// Decision engine for AI bot using Finite State Machine (FSM).
// Determines what actions the bot should take based on perception.

import type { BotClient } from './client';
import type { Perception, Entity, SelfInfo, PartyMemberInfo } from './perception';
import { findNearestHostile, isLowHealth, isInRange } from './perception';
import { getRole, getRotation, isTank, isHealer, isDps, type AbilityRotation } from './roles';

export type BotState =
  | 'idle'
  | 'moving_to_target'
  | 'engaging'
  | 'fighting'
  | 'looting'
  | 'returning_to_town'
  | 'resting'
  | 'socializing'
  | 'healing_ally'
  | 'buffing_ally';

export interface BotContext {
  client: BotClient;
  perception: Perception;
  state: BotState;
  target: Entity | null;
  lastStateChange: number;
  stateData: Record<string, unknown>;
}

export interface StateTransition {
  nextState: BotState;
  action?: () => void;
}

export type StateHandler = (ctx: BotContext) => StateTransition | null;

/**
 * Brain - The decision-making component of the AI bot.
 *
 * Uses a finite state machine to determine behavior.
 * Behavior is driven by the bot's combat role:
 * - tank: holds enemy threat, protects the party
 * - dps: deals damage without overtaking tank threat
 * - healer: keeps the party alive and buffed
 */
export class Brain {
  private state: BotState = 'idle';
  private target: Entity | null = null;
  private healTarget: Entity | null = null;
  private buffTarget: PartyMemberInfo | null = null;
  private pendingBuff: string | null = null;
  private lastBuffCheck = 0;
  private lastStatusLog = 0;
  private lastStateChange = Date.now();
  private stateData: Record<string, unknown> = {};
  private leaderCombatTarget: number | null = null;
  private followTargetId: number | null = null;
  private lastFollowAttempt = 0;
  private lastAssistAttempt = 0;

  private client: BotClient;
  private handlers: Map<BotState, StateHandler> = new Map();

  constructor(client: BotClient) {
    this.client = client;

    // Register state handlers
    this.handlers.set('idle', this.handleIdle.bind(this));
    this.handlers.set('moving_to_target', this.handleMovingToTarget.bind(this));
    this.handlers.set('engaging', this.handleEngaging.bind(this));
    this.handlers.set('fighting', this.handleFighting.bind(this));
    this.handlers.set('looting', this.handleLooting.bind(this));
    this.handlers.set('returning_to_town', this.handleReturningToTown.bind(this));
    this.handlers.set('resting', this.handleResting.bind(this));
    this.handlers.set('socializing', this.handleSocializing.bind(this));
    this.handlers.set('healing_ally', this.handleHealingAlly.bind(this));
    this.handlers.set('buffing_ally', this.handleBuffingAlly.bind(this));
  }

  /** Get current state. */
  getState(): BotState {
    return this.state;
  }

  /** Main tick - called every game tick to update behavior. */
  tick(perception: Perception): void {
    // React to transient social events immediately, before the state handler
    // runs and before the manager clears events at the end of the tick.
    this.processPendingInvites(perception);
    this.trackLeaderCombatTarget(perception);
    this.updateFollowAndAssist(perception);
    this.logStatus(perception);

    const ctx: BotContext = {
      client: this.client,
      perception,
      state: this.state,
      target: this.target,
      lastStateChange: this.lastStateChange,
      stateData: this.stateData,
    };

    const handler = this.handlers.get(this.state);
    if (!handler) return;

    const transition = handler(ctx);
    if (transition) {
      this.transition(transition);
    }
  }

  private processPendingInvites(perception: Perception): void {
    if (perception.pendingInvites.length === 0) return;

    for (const invite of perception.pendingInvites) {
      console.log(`[${this.client.account.name}] handling invite: ${invite.type} from ${invite.name} (pid=${invite.from})`);
      if (invite.type === 'party') {
        console.log(`[${this.client.account.name}] auto-accepting party invite`);
        this.client.sendCommand('paccept');
      } else if (invite.type === 'duel') {
        console.log(`[${this.client.account.name}] auto-declining duel request`);
        this.client.sendCommand('pdecline');
      }
    }
  }

  private logStatus(perception: Perception): void {
    const now = Date.now();
    if (now - this.lastStatusLog < 2000) return;
    this.lastStatusLog = now;

    const self = perception.self;
    if (!self) {
      console.log(`[${this.client.account.name}] status: no self info`);
      return;
    }

    const party = self.partyInfo;
    const leader = party ? this.findPartyLeader(perception) : null;
    const leaderDist = leader ? this.distanceToLeader(self, leader) : null;
    const hasPet = this.hasPet(perception);

    console.log(
      `[${this.client.account.name}] status: state=${this.state} class=${self.class}/${self.spec ?? 'none'} role=${self.role ?? 'none'} ` +
        `pos=(${self.position.x.toFixed(1)},${self.position.z.toFixed(1)}) ` +
        `party=${party ? `${party.leader}:[${party.members.map(m => m.pid).join(',')}]` : 'none'} ` +
        `leader=${leader ? this.getLeaderId(leader) : 'none'} dist=${leaderDist?.toFixed(1) ?? 'n/a'} pet=${hasPet}`,
    );
  }

  private transition(transition: StateTransition): void {
    const oldState = this.state;
    this.state = transition.nextState;
    this.lastStateChange = Date.now();

    if (oldState !== transition.nextState) {
      console.log(`[${this.client.account.name}] state: ${oldState} -> ${transition.nextState}`);
    }

    if (transition.action) {
      transition.action();
    }
  }

  // -------------------------------------------------------------------------
  // State handlers
  // -------------------------------------------------------------------------

  private handleIdle(ctx: BotContext): StateTransition | null {
    const { perception } = ctx;
    if (!perception.self) return null;

    const self = perception.self;
    const role = self.role ?? 'dps';

    // Healers: look for wounded party members before anything else
    if (role === 'healer') {
      const woundedAlly = this.findWoundedPartyMember(perception);
      if (woundedAlly) {
        this.healTarget = woundedAlly;
        return { nextState: 'healing_ally' };
      }
    }

    // Buffer classes: refresh missing buffs (throttled)
    const buffNeed = this.findBuffNeed(perception);
    if (buffNeed) {
      this.buffTarget = buffNeed.member;
      this.pendingBuff = buffNeed.buff;
      this.stateData['buffSelfOnly'] = buffNeed.selfOnly;
      return { nextState: 'buffing_ally' };
    }

    // Check for low health first
    if (isLowHealth(self, 0.2)) {
      return { nextState: 'resting' };
    }

    // Pet classes: summon/revive pet if missing
    if (!this.hasPet(perception)) {
      if (this.trySummonPet(self)) {
        // Wait a tick for summon to start, then continue
        return null;
      }
    }

    // Defend ourselves if something is actively attacking us
    const nearestHostile = findNearestHostile(perception);
    if (nearestHostile && nearestHostile.targetId === self.id) {
      this.target = nearestHostile;
      return {
        nextState: 'engaging',
        action: () => this.engageTarget(self, nearestHostile),
      };
    }

    // In a party: assist the leader's target. Following is handled server-side via /follow.
    const leader = this.findPartyLeader(perception);
    if (leader && this.getLeaderId(leader) !== self.id) {
      const leaderTarget = this.getLeaderTarget(perception);
      if (leaderTarget && !leaderTarget.isDead) {
        console.log(`[${this.client.account.name}] idle: assisting leader on target ${leaderTarget.id}`);
        this.target = leaderTarget;
        return {
          nextState: 'engaging',
          action: () => this.engageTarget(self, leaderTarget),
        };
      } else {
        console.log(`[${this.client.account.name}] idle: no leader target (tracked=${this.leaderCombatTarget})`);
      }
    } else if (perception.self.partyInfo) {
      console.log(`[${this.client.account.name}] idle: no leader found (leaderId=${perception.self.partyInfo.leader}, selfId=${self.id})`);
    }

    // Nothing to do - stay idle
    return null;
  }

  private engageTarget(self: SelfInfo, target: Entity): void {
    this.client.sendCommand('target', { target: target.id });
    if (this.isPetClass(self)) {
      this.sendPetAttack(target.id);
    }
  }

  private handleEngaging(ctx: BotContext): StateTransition | null {
    const { perception } = ctx;
    const target = this.target;
    if (!perception.self) return { nextState: 'idle' };

    const self = perception.self;
    const role = self.role ?? 'dps';

    if (!target || target.isDead) {
      this.target = null;
      return { nextState: 'idle' };
    }

    // Healers interrupt movement to heal wounded party members
    if (role === 'healer') {
      const woundedAlly = this.findWoundedPartyMember(perception);
      if (woundedAlly) {
        this.healTarget = woundedAlly;
        return { nextState: 'healing_ally', action: () => this.client.stopMoving() };
      }
    }

    // Check if we're in combat range (ranged classes can fight from afar)
    const combatRange = role === 'tank' ? 5 : this.isRangedRole(self) ? 30 : 3;
    if (isInRange(self, target, combatRange)) {
      return { nextState: 'fighting' };
    }

    // Move towards target
    this.moveTowardsEntity(ctx, target);

    // Update target position from perception
    const updatedTarget = perception.entities.find(e => e.id === target.id);
    if (updatedTarget) {
      this.target = updatedTarget;
    }

    return null;
  }

  private handleFighting(ctx: BotContext): StateTransition | null {
    const { perception } = ctx;
    let target = this.target;

    if (!perception.self) return { nextState: 'idle' };
    const self = perception.self;
    const role = self.role ?? 'dps';

    // Sync target with fresh perception; if it disappeared, treat as lost.
    if (target) {
      const currentTarget = target;
      const updatedTarget = perception.entities.find(e => e.id === currentTarget.id);
      if (updatedTarget) {
        target = updatedTarget;
        this.target = updatedTarget;
      } else {
        console.log(`[${this.client.account.name}] target ${currentTarget.id} no longer visible, dropping combat`);
        this.target = null;
        return { nextState: 'idle' };
      }
    }

    if (!target) {
      return { nextState: 'idle' };
    }

    // Healers prioritize wounded allies over dealing damage
    if (role === 'healer') {
      const woundedAlly = this.findWoundedPartyMember(perception);
      if (woundedAlly) {
        this.healTarget = woundedAlly;
        return { nextState: 'healing_ally' };
      }
    }

    // Check for low health - retreat if needed (non-tanks)
    if (role !== 'tank' && isLowHealth(self, 0.15)) {
      return { nextState: 'resting', action: () => this.client.stopMoving() };
    }

    // Target died or lost
    if (!target || target.isDead) {
      this.target = null;
      return { nextState: 'looting' };
    }

    // Target ran away
    if (target.distance > 40) {
      this.target = null;
      return { nextState: 'idle' };
    }

    // Maintain range for ranged roles
    if (role === 'dps' && this.isRangedRole(self)) {
      if (target.distance < 8) {
        // Kite back
        this.moveAwayFromEntity(ctx, target);
        return null;
      }
      this.client.stopMoving();
    }

    // Role-based combat rotation
    if (role === 'tank') {
      this.performTankRotation(ctx, self, target);
    } else if (role === 'healer') {
      // Healers only fight if no one needs healing
      this.performCombatRotation(ctx, self, target);
    } else {
      this.performCombatRotation(ctx, self, target);
    }

    return null;
  }

  private handleHealingAlly(ctx: BotContext): StateTransition | null {
    const { perception } = ctx;

    if (!perception.self) return { nextState: 'idle' };

    // Update heal target position
    const target = this.healTarget;
    if (!target) return { nextState: 'idle' };

    const updatedTarget = perception.entities.find(e => e.id === target.id);
    this.healTarget = updatedTarget || target;

    if (!this.healTarget || this.healTarget.isDead) {
      this.healTarget = null;
      return { nextState: 'idle' };
    }

    // Target healed enough
    if (!isLowHealth(this.healTarget, 0.6)) {
      this.healTarget = null;
      return { nextState: 'idle' };
    }

    // Move into heal range if needed
    if (this.healTarget.distance > 30) {
      this.moveTowardsEntity(ctx, this.healTarget);
      return null;
    }

    this.client.stopMoving();

    // Select ally and cast heal
    this.client.sendCommand('target', { target: this.healTarget.id });
    this.performHealingRotation(perception.self, this.healTarget);

    return null;
  }

  private handleBuffingAlly(ctx: BotContext): StateTransition | null {
    const { perception } = ctx;

    if (!perception.self) return { nextState: 'idle' };

    const target = this.buffTarget;
    const buff = this.pendingBuff;
    if (!target || !buff) return { nextState: 'idle' };

    // Update target info from fresh party data
    const updatedMember = perception.self.partyInfo?.members.find(m => m.pid === target.pid);
    this.buffTarget = updatedMember || target;

    // Target left party, died, or buff is no longer needed
    if (!this.buffTarget || this.buffTarget.dead) {
      this.buffTarget = null;
      this.pendingBuff = null;
      return { nextState: 'idle' };
    }

    if (this.hasAura(this.buffTarget, buff)) {
      this.buffTarget = null;
      this.pendingBuff = null;
      return { nextState: 'idle' };
    }

    const selfOnly = this.stateData['buffSelfOnly'] === true;

    // Check range (party wire only has x/z; use 2D distance)
    const self = perception.self;
    const distance2D = Math.sqrt(
      Math.pow(this.buffTarget.x - self.position.x, 2) +
      Math.pow(this.buffTarget.z - self.position.z, 2),
    );

    if (distance2D > 30 && !selfOnly) {
      this.moveTowardsPartyMember(ctx, this.buffTarget);
      return null;
    }

    this.client.stopMoving();

    // Target ally and cast buff
    if (selfOnly) {
      // Self-only buffs are cast without changing target
      this.client.sendCommand('useAbility', { ability: buff, target: this.buffTarget.pid });
    } else {
      this.client.sendCommand('target', { target: this.buffTarget.pid });
      this.client.sendCommand('useAbility', { ability: buff, target: this.buffTarget.pid });
    }

    // Buff cast attempted; clear pending so we don't spam on next tick
    this.buffTarget = null;
    this.pendingBuff = null;

    return { nextState: 'idle' };
  }

  private handleLooting(ctx: BotContext): StateTransition | null {
    const { perception } = ctx;

    // Reset combat-scoped pet state
    this.stateData['petModeSet'] = false;

    // Check for loot events
    const lootEvents = perception.events.filter(e => e.type === 'loot');
    if (lootEvents.length === 0) {
      // No loot, return to idle
      return { nextState: 'idle' };
    }

    // Loot is automatic in this game, just transition after a brief moment
    const timeInState = Date.now() - this.lastStateChange;
    if (timeInState > 500) {
      return { nextState: 'idle' };
    }

    return null;
  }

  private handleResting(ctx: BotContext): StateTransition | null {
    const { perception } = ctx;

    if (!perception.self) return { nextState: 'idle' };

    // Check if health recovered
    if (!isLowHealth(perception.self, 0.8)) {
      return { nextState: 'idle' };
    }

    // Check for new threats while resting
    const nearestHostile = findNearestHostile(perception);
    if (nearestHostile && nearestHostile.distance < 10) {
      this.target = nearestHostile;
      return { nextState: 'engaging' };
    }

    // Use food/potion if available
    // For now, just wait for natural regen
    this.client.stopMoving();

    return null;
  }

  private handleReturningToTown(ctx: BotContext): StateTransition | null {
    // TODO: Implement town return logic
    return { nextState: 'idle' };
  }

  private handleMovingToTarget(ctx: BotContext): StateTransition | null {
    // TODO: Implement quest objective movement
    return { nextState: 'idle' };
  }

  private handleSocializing(ctx: BotContext): StateTransition | null {
    const { perception } = ctx;

    // Handle pending invites
    if (perception.pendingInvites.length > 0) {
      const invite = perception.pendingInvites[0];
      console.log(`[${this.client.account.name}] handling invite: ${invite.type} from ${invite.name}`);
      // Auto-accept party invites (configurable)
      if (invite.type === 'party') {
        console.log(`[${this.client.account.name}] auto-accepting party invite`);
        this.client.sendCommand('paccept');
      } else if (invite.type === 'duel') {
        // Auto-decline duels (they're risky)
        this.client.sendCommand('pdecline');
      }
    }

    // Handle chat messages
    if (perception.chatMessages.length > 0) {
      // Chat responses are handled by AI module
      // For now, just acknowledge
    }

    return { nextState: 'idle' };
  }

  // -------------------------------------------------------------------------
  // Party / healing helpers
  // -------------------------------------------------------------------------

  private findWoundedPartyMember(perception: Perception): Entity | null {
    if (!perception.self) return null;
    if (!isHealer(perception.self.class, perception.self.spec)) return null;

    const partyMembers = perception.nearbyFriendlies.filter(e => this.isPartyMember(perception, e));
    const wounded = partyMembers.filter(e => isLowHealth(e, 0.5));

    if (wounded.length === 0) return null;

    // Heal the most wounded (lowest HP percentage)
    return wounded.reduce((mostWounded, e) =>
      e.hp / e.maxHp < mostWounded.hp / mostWounded.maxHp ? e : mostWounded,
    );
  }

  private isPartyMember(perception: Perception, entity: Entity): boolean {
    if (!perception.self || !perception.self.partyInfo) return false;
    return perception.self.partyInfo.memberIds.includes(entity.id);
  }

  private findPartyLeader(perception: Perception): PartyMemberInfo | Entity | null {
    if (!perception.self || !perception.self.partyInfo) return null;

    const leaderId = perception.self.partyInfo.leader;
    if (leaderId === perception.self.id) return null; // We are the leader

    // Prefer the live nearby entity copy because snapshot positions update every tick.
    // Party wire positions can be stale when the leader is moving.
    const nearby = perception.nearbyFriendlies.find(e => e.id === leaderId);
    if (nearby) {
      return nearby;
    }

    // Fallback: party member info
    const member = perception.self.partyInfo.members.find(m => m.pid === leaderId);
    if (member) {
      return member;
    }

    console.log(`[${this.client.account.name}] findPartyLeader: not found (leaderId=${leaderId}, members=${perception.self.partyInfo.members.map(m => m.pid).join(',')})`);
    return null;
  }

  private getLeaderId(leader: PartyMemberInfo | Entity): number {
    return 'pid' in leader ? leader.pid : leader.id;
  }

  private getLeaderTarget(perception: Perception): Entity | null {
    const leader = this.findPartyLeader(perception);
    if (!leader) return null;

    const leaderId = this.getLeaderId(leader);

    // Prefer the live nearby entity copy of the leader (it carries targetId).
    const nearbyLeader = perception.nearbyFriendlies.find(e => e.id === leaderId);
    if (nearbyLeader?.targetId) {
      this.leaderCombatTarget = nearbyLeader.targetId;
      return perception.entities.find(e => e.id === nearbyLeader.targetId && !e.isDead) ?? null;
    }

    // Fall back to the most recent combat target we observed from events.
    if (this.leaderCombatTarget) {
      const target = perception.entities.find(
        e => e.id === this.leaderCombatTarget && !e.isDead,
      );
      if (target) {
        console.log(`[${this.client.account.name}] getLeaderTarget: using tracked target ${target.id}`);
        return target;
      }
      console.log(`[${this.client.account.name}] getLeaderTarget: tracked target ${this.leaderCombatTarget} not visible or dead`);
    }

    return null;
  }

  private trackLeaderCombatTarget(perception: Perception): void {
    const leader = this.findPartyLeader(perception);
    if (!leader) return;

    const leaderId = this.getLeaderId(leader);
    for (const event of perception.events) {
      if (event.type === 'death' && event.target === this.leaderCombatTarget) {
        console.log(`[${this.client.account.name}] leader combat target died, clearing`);
        this.leaderCombatTarget = null;
        continue;
      }

      let sourceId: number | undefined;
      let targetId: number | undefined;

      if (event.type === 'damage' || event.type === 'heal') {
        const e = event as { source: number; target: number };
        sourceId = e.source;
        targetId = e.target;
      } else if (event.type === 'abilityUsed') {
        const e = event as { source: number; target?: number };
        sourceId = e.source;
        targetId = e.target;
      } else if (event.type === 'targetChanged') {
        const e = event as { entity: number; target?: number };
        sourceId = e.entity;
        targetId = e.target;
      } else if (event.type === 'spellfx') {
        // spellfx is not part of the base protocol union; treat it as a custom event.
        const e = event as Record<string, unknown>;
        sourceId = typeof e.sourceId === 'number' ? e.sourceId : undefined;
        targetId = typeof e.targetId === 'number' ? e.targetId : undefined;
      }

      if (sourceId === leaderId && typeof targetId === 'number') {
        console.log(`[${this.client.account.name}] tracked leader combat target: ${targetId} (event=${event.type})`);
        this.leaderCombatTarget = targetId;
      }
    }
  }

  private getLeaderName(perception: Perception): string | null {
    const leader = this.findPartyLeader(perception);
    if (!leader) return null;
    return leader.name ?? null;
  }

  /**
   * Use server slash commands to follow and assist the party leader.
   * /follow makes the server auto-walk after the leader (like a pet).
   * /assist snaps our target to the leader's target.
   * We track follow state locally because the bot wire does not expose followTargetId.
   */
  private updateFollowAndAssist(perception: Perception): void {
    if (!perception.self) return;
    const self = perception.self;

    // Combat breaks /follow on the server; clear our local tracking.
    if (self.inCombat && this.followTargetId !== null) {
      console.log(`[${this.client.account.name}] follow broken by combat`);
      this.followTargetId = null;
    }

    const leader = this.findPartyLeader(perception);
    if (!leader) {
      this.followTargetId = null;
      return;
    }

    const leaderId = this.getLeaderId(leader);
    const leaderName = this.getLeaderName(perception);
    if (!leaderName) return;

    // Assist the leader's target whenever we can observe one.
    const leaderTarget = this.getLeaderTarget(perception);
    if (leaderTarget && !leaderTarget.isDead) {
      const now = Date.now();
      if (now - this.lastAssistAttempt > 3000) {
        this.lastAssistAttempt = now;
        // Only send /assist when our target differs from the leader's target.
        if (self.targetId !== leaderTarget.id) {
          console.log(`[${this.client.account.name}] /assist ${leaderName} -> target ${leaderTarget.id}`);
          this.client.sendChat(`/assist ${leaderName}`);
        }
      }
    }

    // Out of combat: ask the server to follow the leader.
    if (!self.inCombat) {
      const distance = this.distanceToLeader(self, leader);
      const now = Date.now();

      // /follow only works up to 60 yards; beyond 55 yards close the gap manually.
      if (distance > 55) {
        this.followTargetId = null;
        this.moveTowardsLeader(self, leader);
        return;
      }

      if (distance > 10 && now - this.lastFollowAttempt > 5000) {
        this.lastFollowAttempt = now;
        this.followTargetId = leaderId;
        console.log(`[${this.client.account.name}] /follow ${leaderName} (dist=${distance.toFixed(1)})`);
        this.client.sendChat(`/follow ${leaderName}`);
      }
    }
  }

  private moveTowardsLeader(self: SelfInfo, leader: PartyMemberInfo | Entity): void {
    const targetX = 'position' in leader ? leader.position.x : leader.x;
    const targetZ = 'position' in leader ? leader.position.z : leader.z;
    const dx = targetX - self.position.x;
    const dz = targetZ - self.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance > 1) {
      const facing = Math.atan2(dx, dz);
      this.client.setFacing(facing);
      this.client.setMoveInput({ f: 1 });
    } else {
      this.client.stopMoving();
    }
  }

  private isPetClass(self: SelfInfo): boolean {
    const cls = self.class.toLowerCase();
    return cls === 'hunter' || cls === 'warlock';
  }

  private distanceToLeader(self: SelfInfo, leader: PartyMemberInfo | Entity): number {
    if ('position' in leader) {
      const dx = leader.position.x - self.position.x;
      const dz = leader.position.z - self.position.z;
      return Math.sqrt(dx * dx + dz * dz);
    }
    const dx = leader.x - self.position.x;
    const dz = leader.z - self.position.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  private findBuffNeed(perception: Perception): { member: PartyMemberInfo; buff: string; selfOnly: boolean } | null {
    if (!perception.self) return null;

    const partyInfo = perception.self.partyInfo;
    if (!partyInfo || partyInfo.members.length === 0) return null;

    // Throttle checks to avoid spamming
    const now = Date.now();
    if (now - this.lastBuffCheck < 5000) return null;
    this.lastBuffCheck = now;

    const rotation = getRotation(perception.self.class, perception.self.spec);
    const selfBuffs = rotation.selfBuff ?? [];
    const partyBuffs = rotation.partyBuff ?? [];

    // Self-only buffs: only cast on self
    const selfMember = partyInfo.members.find(m => m.pid === perception.self!.id);
    if (selfMember && !selfMember.dead) {
      for (const buff of selfBuffs) {
        if (!this.hasAura(selfMember, buff)) {
          return { member: selfMember, buff, selfOnly: true };
        }
      }
    }

    // Party buffs: cast on self first, then other party members
    for (const buff of partyBuffs) {
      if (selfMember && !selfMember.dead && !this.hasAura(selfMember, buff)) {
        return { member: selfMember, buff, selfOnly: false };
      }

      for (const member of partyInfo.members) {
        if (member.pid === perception.self.id) continue;
        if (member.dead) continue;
        if (!this.hasAura(member, buff)) {
          return { member, buff, selfOnly: false };
        }
      }
    }

    return null;
  }

  private hasAura(member: PartyMemberInfo, auraId: string): boolean {
    return member.auras.some(a => a.id === auraId);
  }

  private hasPet(perception: Perception): boolean {
    if (!perception.self) return true; // assume has pet if no self info
    return perception.entities.some(
      e => e.isPet && e.ownerId === perception.self!.id && !e.isDead,
    );
  }

  private trySummonPet(self: SelfInfo): boolean {
    const rotation = getRotation(self.class, self.spec);
    const summonActions = rotation.summonPet ?? [];

    if (summonActions.length === 0) {
      return false;
    }

    console.log(`[${this.client.account.name}] trySummonPet: class=${self.class}/${self.spec} actions=[${summonActions.join(',')}]`);

    for (const action of summonActions) {
      // Hunter pet revival is a server command, not an ability
      if (action === 'pet_revive') {
        const now = Date.now();
        const last = (this.stateData['lastPetReviveAttempt'] as number) ?? 0;
        if (now - last < 10000) continue;
        this.stateData['lastPetReviveAttempt'] = now;
        this.client.sendCommand('pet_revive');
        console.log(`[${this.client.account.name}] reviving pet`);
        return true;
      }

      // Warlock demon summons are normal abilities
      if (this.useAbilityIfReady(self, action, self.id)) {
        console.log(`[${this.client.account.name}] summoning pet: ${action}`);
        return true;
      }
    }
    return false;
  }

  private sendPetAttack(targetId: number): void {
    // Select target first so pet_attack hits the right enemy
    this.client.sendCommand('target', { target: targetId });
    this.client.sendCommand('pet_attack');
  }

  private sendPetTaunt(): void {
    this.client.sendCommand('pet_taunt');
  }

  private setPetMode(mode: 'passive' | 'defensive' | 'aggressive'): void {
    this.client.sendCommand('pet_mode', { mode });
  }

  private setPetAutoTaunt(enabled: boolean): void {
    this.client.sendCommand('pet_auto_taunt', { enabled });
  }

  private isTankPet(petTypeId: string): boolean {
    const tankPetIds = ['voidwalker', 'gloomshade', 'felguard', 'warfiend', 'pyre_colossus', 'bear'];
    return tankPetIds.some(id => petTypeId.toLowerCase().includes(id));
  }

  private controlPet(ctx: BotContext, self: SelfInfo, target: Entity): void {
    const pet = ctx.perception.entities.find(
      e => e.isPet && e.ownerId === self.id && !e.isDead,
    );
    if (!pet) return;

    // Initialize pet mode once per combat session
    if (!this.stateData['petModeSet']) {
      this.setPetMode('defensive');
      this.stateData['petModeSet'] = true;
    }

    // Throttle pet attack commands to avoid spam
    const now = Date.now();
    const lastAttack = (this.stateData['lastPetAttack'] as number) ?? 0;
    if (now - lastAttack > 2000) {
      this.stateData['lastPetAttack'] = now;
      this.sendPetAttack(target.id);
    }

    // Tank pets taunt if target is not on the pet
    if (this.isTankPet(pet.typeId) && target.targetId && target.targetId !== pet.id) {
      const lastTaunt = (this.stateData['lastPetTaunt'] as number) ?? 0;
      if (now - lastTaunt > 6000) {
        this.stateData['lastPetTaunt'] = now;
        this.sendPetTaunt();
      }
    }
  }

  private isRangedRole(self: SelfInfo): boolean {
    const cls = self.class;
    const spec = self.spec;
    return (
      cls === 'mage' ||
      cls === 'warlock' ||
      cls === 'hunter' ||
      (cls === 'priest' && spec === 'shadow') ||
      (cls === 'shaman' && spec === 'elemental') ||
      (cls === 'druid' && spec === 'balance')
    );
  }

  // -------------------------------------------------------------------------
  // Action helpers
  // -------------------------------------------------------------------------

  private moveTowardsEntity(ctx: BotContext, target: Entity): void {
    const self = ctx.perception.self;
    if (!self) return;

    const dx = target.position.x - self.position.x;
    const dz = target.position.z - self.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > 1) {
      // Calculate facing angle
      const facing = Math.atan2(dx, dz);
      this.client.setFacing(facing);
      this.client.setMoveInput({ f: 1 }); // Forward
    } else {
      this.client.stopMoving();
    }
  }

  private moveAwayFromEntity(ctx: BotContext, target: Entity): void {
    const self = ctx.perception.self;
    if (!self) return;

    const dx = self.position.x - target.position.x;
    const dz = self.position.z - target.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 20) {
      const facing = Math.atan2(dx, dz);
      this.client.setFacing(facing);
      this.client.setMoveInput({ f: 1 });
    } else {
      this.client.stopMoving();
    }
  }

  private moveTowardsPartyMember(ctx: BotContext, target: PartyMemberInfo): void {
    const self = ctx.perception.self;
    if (!self) return;

    const dx = target.x - self.position.x;
    const dz = target.z - self.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > 1) {
      const facing = Math.atan2(dx, dz);
      this.client.setFacing(facing);
      this.client.setMoveInput({ f: 1 });
    } else {
      this.client.stopMoving();
    }
  }

  private useAbilityIfReady(self: SelfInfo, ability: string, targetId: number): boolean {
    if (!ability) return false;
    if (self.cooldowns[ability]) return false;
    this.client.sendCommand('useAbility', { ability, target: targetId });
    return true;
  }

  // -------------------------------------------------------------------------
  // Combat rotations
  // -------------------------------------------------------------------------

  private performTankRotation(ctx: BotContext, self: SelfInfo, target: Entity): void {
    const rotation = getRotation(self.class, self.spec);

    // Ensure target is selected
    this.client.sendCommand('target', { target: target.id });

    // Maintain defensive stance / form
    if (rotation.opening) {
      for (const ability of rotation.opening) {
        if (this.useAbilityIfReady(self, ability, self.id)) return;
      }
    }

    // If target is not attacking us, taunt
    if (target.targetId && target.targetId !== self.id) {
      for (const ability of rotation.taunt ?? []) {
        if (this.useAbilityIfReady(self, ability, target.id)) return;
      }
    }

    // Build threat
    for (const ability of rotation.builder ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }

    // Use high-threat spenders
    for (const ability of rotation.spender ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }

    // Use defensive cooldowns when hurt
    if (isLowHealth(self, 0.5)) {
      for (const ability of rotation.defensive ?? []) {
        if (this.useAbilityIfReady(self, ability, self.id)) return;
      }
    }

    // Auto-attack filler
    for (const ability of rotation.filler ?? ['attack']) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
  }

  private performCombatRotation(ctx: BotContext, self: SelfInfo, target: Entity): void {
    const rotation = getRotation(self.class, self.spec);

    // Ensure target is selected
    this.client.sendCommand('target', { target: target.id });

    // Pet classes: re-summon pet if it died mid-combat
    if (rotation.summonPet && !this.hasPet(ctx.perception)) {
      if (this.trySummonPet(self)) return;
    }

    // Pet classes: command pet to attack and optionally taunt
    if (rotation.summonPet) {
      this.controlPet(ctx, self, target);
    }

    // DPS should not overtake tank threat if a tank is present.
    // We approximate this by holding back when target is not on us and not on tank
    // (requires threat info from the wire; this is a conservative default).
    if (target.targetId && target.targetId !== self.id) {
      // Target is on someone else; if it's not a tank, reduce aggressive output
      // We don't have explicit role info for other players, so we just continue
      // but avoid opening abilities.
    } else {
      // Safe to use opening abilities
      for (const ability of rotation.opening ?? []) {
        if (this.useAbilityIfReady(self, ability, target.id)) return;
      }
    }

    // Self buffs (Hunter aspects, Shaman shields, etc.)
    for (const ability of rotation.selfBuff ?? []) {
      if (this.useAbilityIfReady(self, ability, self.id)) return;
    }

    // Damage over time / debuffs
    for (const ability of rotation.builder ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }

    // Big damage spenders
    for (const ability of rotation.spender ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }

    // Filler
    for (const ability of rotation.filler ?? ['attack']) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
  }

  private performHealingRotation(self: SelfInfo, target: Entity): void {
    const rotation = getRotation(self.class, self.spec);

    // HoT first if target is not critically wounded
    if (!isLowHealth(target, 0.35)) {
      for (const ability of rotation.hot ?? []) {
        if (this.useAbilityIfReady(self, ability, target.id)) return;
      }
    }

    // Direct heal
    for (const ability of rotation.singleTargetHeal ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }

    // Fallback filler
    for (const ability of rotation.filler ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
  }
}
