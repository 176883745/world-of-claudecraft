import { describe, expect, it } from 'vitest';
import {
  SELF_MOTION_CAP_MAX_MS,
  SELF_MOTION_CAP_MIN_MS,
  type SelfMotionFrame,
  SelfMotionPredictor,
} from '../src/render/self_motion';
import { Sim } from '../src/sim/sim';
import { type Entity, type MoveInput, RUN_SPEED } from '../src/sim/types';
import { terrainHeight } from '../src/sim/world';

// Policy tests for the online display-only self extrapolator, driven against a
// REAL lagging authority: a live Sim plays the server (inputs arrive lagMs
// late, snapshots leave after each 20 Hz tick) and the predictor renders 60 fps
// frames against the mirrored self entity, exactly like main.ts online.

const SEED = 42;
const FRAME_MS = 1000 / 60;
const SNAP_MS = 50;

const mi = (over: Partial<MoveInput> = {}): MoveInput => ({
  forward: false,
  back: false,
  turnLeft: false,
  turnRight: false,
  strafeLeft: false,
  strafeRight: false,
  jump: false,
  ...over,
});

function teleport(sim: Sim, x: number, z: number): void {
  const p = sim.player;
  p.pos.x = x;
  p.pos.z = z;
  p.pos.y = terrainHeight(x, z, sim.cfg.seed);
  p.prevPos = { ...p.pos };
  p.fallStartY = p.pos.y;
  p.onGround = true;
  p.vx = 0;
  p.vz = 0;
  p.vy = 0;
}

interface FrameResult {
  pose: { x: number; y: number; z: number } | null;
  a: { x: number; y: number; z: number };
}

// The lagging-authority lab: server Sim + mirrored self + predictor.
class Lab {
  readonly srv: Sim;
  readonly self: Entity;
  readonly predictor = new SelfMotionPredictor(SEED);
  private nowMs = 0;
  private lastSnapMs = 0;
  private sinceTickMs = 0;
  private localInput = mi();
  private inputLog: { atMs: number; input: MoveInput }[] = [];
  enabled = true;

  constructor(readonly lagMs: number) {
    this.srv = new Sim({ seed: SEED, playerClass: 'warrior', autoEquip: true });
    this.srv.setPlayerLevel(60);
    teleport(this.srv, 0, -40);
    this.srv.player.facing = 0; // run straight north (+z)
    const p = this.srv.player;
    this.self = { ...p, pos: { ...p.pos }, prevPos: { ...p.prevPos } };
    this.inputLog.push({ atMs: 0, input: mi() });
  }

  setInput(input: MoveInput): void {
    this.localInput = input;
    this.inputLog.push({ atMs: this.nowMs, input });
  }

  // What the server has received by time t (inputs travel lagMs).
  private serverInputAt(tMs: number): MoveInput {
    let eff = this.inputLog[0].input;
    for (const e of this.inputLog) {
      if (e.atMs + this.lagMs <= tMs) eff = e.input;
    }
    return eff;
  }

  frame(): FrameResult {
    this.nowMs += FRAME_MS;
    this.sinceTickMs += FRAME_MS;
    while (this.sinceTickMs >= SNAP_MS) {
      this.sinceTickMs -= SNAP_MS;
      const meta = this.srv.players.get(this.srv.player.id);
      if (!meta) throw new Error('missing player meta');
      Object.assign(meta.moveInput, this.serverInputAt(this.nowMs));
      this.srv.tick();
      // the 20 Hz snapshot: prev pose = last wire pose, pose = fresh server pose
      this.self.prevPos = { ...this.self.pos };
      this.self.pos = { ...this.srv.player.pos };
      this.self.dead = this.srv.player.dead;
      this.self.ghost = this.srv.player.ghost;
      this.lastSnapMs = this.nowMs;
    }
    const alpha = Math.min(1.25, (this.nowMs - this.lastSnapMs) / SNAP_MS);
    const frame: SelfMotionFrame = {
      enabled: this.enabled,
      moveInput: this.localInput,
      displayFacing: 0,
      echoMs: this.lagMs,
      jitterMs: 0,
      alpha,
      frameDt: FRAME_MS / 1000,
    };
    const out = this.predictor.step(this.self, frame);
    const a = {
      x: this.self.prevPos.x + (this.self.pos.x - this.self.prevPos.x) * alpha,
      y: this.self.prevPos.y + (this.self.pos.y - this.self.prevPos.y) * alpha,
      z: this.self.prevPos.z + (this.self.pos.z - this.self.prevPos.z) * alpha,
    };
    return { pose: out ? { ...out } : null, a };
  }

  budget(): number {
    const cap = Math.min(SELF_MOTION_CAP_MAX_MS, Math.max(SELF_MOTION_CAP_MIN_MS, this.lagMs));
    return (RUN_SPEED * cap) / 1000 + 0.05;
  }
}

describe('SelfMotionPredictor', () => {
  it('moves the pose the moment intent is pressed, long before the server does', () => {
    const lab = new Lab(120);
    lab.frame();
    const before = lab.frame();
    lab.setInput(mi({ forward: true }));
    let moved = 0;
    for (let i = 0; i < 4; i++) {
      const r = lab.frame();
      if (r.pose) moved = r.pose.z - (before.pose?.z ?? 0);
    }
    expect(moved).toBeGreaterThan(0.2); // ~4 frames of RUN_SPEED
    // the server has not even received the input yet (120ms lag > 4 frames)
    expect(lab.srv.player.pos.z).toBeCloseTo(-40, 3);
  });

  it('keeps the horizontal error inside the latency leash for the whole run', () => {
    const lab = new Lab(100);
    lab.setInput(mi({ forward: true }));
    const budget = lab.budget();
    for (let i = 0; i < 60 * 3; i++) {
      const { pose, a } = lab.frame();
      if (!pose) throw new Error('predictor disabled unexpectedly');
      const err = Math.hypot(pose.x - a.x, pose.z - a.z);
      expect(err, `frame ${i}`).toBeLessThanOrEqual(budget + 1e-6);
    }
  });

  it('leads the authoritative pose in a steady run (latency actually hidden)', () => {
    const lab = new Lab(100);
    lab.setInput(mi({ forward: true }));
    for (let i = 0; i < 60; i++) lab.frame(); // 1s warmup
    let leadSum = 0;
    let n = 0;
    for (let i = 0; i < 60; i++) {
      const { pose, a } = lab.frame();
      if (pose) {
        leadSum += pose.z - a.z;
        n++;
      }
    }
    expect(leadSum / n).toBeGreaterThan(0.25); // meaningful fraction of the 0.7yd lag
  });

  it('caps the extrapolation on a terrible link', () => {
    const lab = new Lab(500);
    lab.setInput(mi({ forward: true }));
    const capBudget = (RUN_SPEED * SELF_MOTION_CAP_MAX_MS) / 1000 + 0.05;
    for (let i = 0; i < 60 * 2; i++) {
      const { pose, a } = lab.frame();
      if (!pose) throw new Error('predictor disabled unexpectedly');
      expect(Math.hypot(pose.x - a.x, pose.z - a.z), `frame ${i}`).toBeLessThanOrEqual(
        capBudget + 1e-6,
      );
    }
  });

  it('stops instantly and settles onto the server pose with no backslide', () => {
    const lab = new Lab(100);
    lab.setInput(mi({ forward: true }));
    for (let i = 0; i < 60 * 2; i++) lab.frame();
    lab.setInput(mi());
    let prevZ = -Infinity;
    let last: FrameResult | null = null;
    for (let i = 0; i < 60 * 1.5; i++) {
      const r = lab.frame();
      if (r.pose) {
        expect(r.pose.z, `frame ${i} backslide`).toBeGreaterThanOrEqual(prevZ - 0.005);
        prevZ = r.pose.z;
        last = r;
      }
    }
    if (!last?.pose) throw new Error('no pose');
    // converged onto the (now stationary) authoritative pose
    expect(Math.abs(last.pose.z - last.a.z)).toBeLessThan(0.25);
  });

  it('snaps to the authoritative pose on a server teleport', () => {
    const lab = new Lab(100);
    lab.setInput(mi({ forward: true }));
    for (let i = 0; i < 30; i++) lab.frame();
    teleport(lab.srv, 0, 40); // 80yd jump, way past the 6yd snap rule
    let r: FrameResult | null = null;
    for (let i = 0; i < 4; i++) r = lab.frame(); // let a snapshot deliver it
    if (!r?.pose) throw new Error('no pose');
    expect(Math.abs(r.pose.z - r.a.z)).toBeLessThan(2);
  });

  it('returns null when disabled and re-adopts cleanly on re-enable', () => {
    const lab = new Lab(100);
    lab.setInput(mi({ forward: true }));
    for (let i = 0; i < 30; i++) lab.frame();
    lab.enabled = false;
    expect(lab.frame().pose).toBeNull();
    lab.enabled = true;
    const r = lab.frame();
    if (!r.pose) throw new Error('no pose after re-enable');
    expect(Math.hypot(r.pose.z - r.a.z, r.pose.x - r.a.x)).toBeLessThan(0.5);
  });

  it('starts the jump arc locally without waiting for the server', () => {
    const lab = new Lab(150);
    lab.setInput(mi({ forward: true }));
    for (let i = 0; i < 30; i++) lab.frame();
    const groundY = lab.frame().pose?.y ?? 0;
    // hold jump across a full 50ms fixed step (a sub-step tap can fall between
    // 20 Hz samples, exactly like it can server-side)
    lab.setInput(mi({ forward: true, jump: true }));
    for (let i = 0; i < 4; i++) lab.frame();
    lab.setInput(mi({ forward: true }));
    let maxRise = 0;
    for (let i = 0; i < 12; i++) {
      const r = lab.frame(); // 200ms window, server still grounded for most of it
      if (r.pose) maxRise = Math.max(maxRise, r.pose.y - groundY);
    }
    expect(maxRise).toBeGreaterThan(0.3);
  });
});
