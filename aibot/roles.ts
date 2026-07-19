// Combat role definitions for all class/spec combinations.
// Maps each of the 30 class+spec combinations to tank / dps / healer.

export type CombatRole = 'tank' | 'dps' | 'healer';

export interface ClassSpecInfo {
  class: string;
  spec: string;
  role: CombatRole;
  displayName: string;
}

export interface AbilityRotation {
  opening?: string[];
  builder?: string[];
  spender?: string[];
  filler?: string[];
  defensive?: string[];
  taunt?: string[];
  aoe?: string[];
  // For pet classes
  summonPet?: string[];
  // For healers
  singleTargetHeal?: string[];
  hot?: string[];
  // For buffers
  selfBuff?: string[];
  partyBuff?: string[];
}

// ---------------------------------------------------------------------------
// Role mapping: class + spec -> combat role
// ---------------------------------------------------------------------------

export const ROLE_TABLE: Record<string, CombatRole> = {
  // Warrior
  'warrior/arms': 'dps',
  'warrior/fury': 'dps',
  'warrior/prot': 'tank',

  // Paladin
  'paladin/holy': 'healer',
  'paladin/protection': 'tank',
  'paladin/retribution': 'dps',

  // Hunter
  'hunter/beast_mastery': 'dps',
  'hunter/marksmanship': 'dps',
  'hunter/survival': 'dps',

  // Rogue
  'rogue/assassination': 'dps',
  'rogue/combat': 'dps',
  'rogue/subtlety': 'dps',

  // Priest
  'priest/discipline': 'healer',
  'priest/holy': 'healer',
  'priest/shadow': 'dps',

  // Shaman
  'shaman/elemental': 'dps',
  'shaman/enhancement': 'dps',
  'shaman/restoration': 'healer',

  // Mage
  'mage/arcane': 'dps',
  'mage/fire': 'dps',
  'mage/frost': 'dps',

  // Warlock
  'warlock/affliction': 'dps',
  'warlock/demonology': 'dps',
  'warlock/destruction': 'dps',

  // Druid
  'druid/balance': 'dps',
  'druid/feral': 'tank',
  'druid/restoration': 'healer',
};

export function getRole(classType: string, spec: string | null | undefined): CombatRole {
  if (!spec) {
    // Fallback: derive from class only
    switch (classType) {
      case 'warrior':
      case 'paladin':
      case 'druid':
        return 'dps'; // ambiguous without spec; default to dps to avoid false tanking
      case 'priest':
      case 'shaman':
        return 'healer'; // ambiguous without spec; default to healer
      default:
        return 'dps';
    }
  }
  const key = `${classType}/${spec}`;
  return ROLE_TABLE[key] || 'dps';
}

// ---------------------------------------------------------------------------
// Ability rotations per class/spec
// ---------------------------------------------------------------------------

export function getRotation(classType: string, spec: string | null | undefined): AbilityRotation {
  const role = getRole(classType, spec);
  const key = spec ? `${classType}/${spec}` : classType;

  // Tank rotations
  if (role === 'tank') {
    if (classType === 'warrior') {
      return {
        taunt: ['taunt'],
        builder: ['sunder_armor'],
        spender: ['shield_slam', 'revenge'],
        defensive: ['defensive_stance', 'ironhold'],
        filler: ['heroic_strike', 'attack'],
      };
    }
    if (classType === 'paladin') {
      return {
        taunt: ['holy_taunt'],
        builder: ['righteous_fury'],
        spender: ['shield_slam', 'crusader_strike'],
        defensive: ['devotion_aura'],
        filler: ['attack'],
      };
    }
    if (classType === 'druid') {
      return {
        opening: ['bear_form'],
        taunt: ['growl'],
        builder: ['maul'],
        spender: ['swipe'],
        defensive: ['barkskin'],
        filler: ['attack'],
      };
    }
  }

  // Healer rotations
  if (role === 'healer') {
    if (classType === 'priest') {
      return {
        singleTargetHeal: ['flash_heal', 'heal', 'greater_heal'],
        hot: ['renew'],
        partyBuff: ['power_word_fortitude'],
        selfBuff: ['inner_fire'],
        filler: ['smite'],
      };
    }
    if (classType === 'paladin') {
      return {
        singleTargetHeal: ['holy_light', 'flash_of_light', 'holy_shock'],
        partyBuff: ['blessing_of_might', 'devotion_aura'],
        filler: ['crusader_strike'],
      };
    }
    if (classType === 'druid') {
      return {
        singleTargetHeal: ['healing_touch', 'swiftmend'],
        hot: ['rejuvenation', 'regrowth', 'lifebloom'],
        partyBuff: ['mark_of_the_wild'],
        filler: ['wrath'],
      };
    }
    if (classType === 'shaman') {
      return {
        singleTargetHeal: ['healing_wave', 'chain_heal', 'lesser_healing_wave'],
        hot: ['riptide'],
        selfBuff: ['lightning_shield', 'water_shield'],
        filler: ['lightning_bolt'],
      };
    }
  }

  // DPS rotations by class/spec
  switch (key) {
    case 'warrior/arms':
      return {
        opening: ['charge'],
        builder: ['sunder_armor'],
        spender: ['mortal_strike', 'overpower'],
        filler: ['heroic_strike', 'attack'],
      };
    case 'warrior/fury':
      return {
        opening: ['charge'],
        spender: ['bloodthirst', 'whirlwind'],
        filler: ['heroic_strike', 'attack'],
      };
    case 'paladin/retribution':
      return {
        builder: ['seal_of_command'],
        spender: ['crusader_strike', 'judgement_of_command'],
        filler: ['attack'],
      };
    case 'hunter/beast_mastery':
      return {
        summonPet: ['pet_revive'],
        opening: ['hunters_mark', 'bestial_wrath'],
        builder: ['serpent_sting'],
        spender: ['kill_command', 'arcane_shot'],
        filler: ['steady_shot'],
      };
    case 'hunter/marksmanship':
      return {
        summonPet: ['pet_revive'],
        opening: ['hunters_mark', 'trueshot_aura'],
        builder: ['serpent_sting', 'aimed_shot'],
        spender: ['chimera_shot', 'arcane_shot'],
        filler: ['steady_shot'],
      };
    case 'hunter/survival':
      return {
        summonPet: ['pet_revive'],
        opening: ['hunters_mark'],
        builder: ['serpent_sting', 'explosive_shot'],
        spender: ['black_arrow', 'aimed_shot'],
        filler: ['steady_shot'],
      };
    case 'rogue/assassination':
      return {
        opening: ['garrote', 'slice_and_dice'],
        builder: ['mutilate'],
        spender: ['envenom', 'rupture'],
        filler: ['attack'],
      };
    case 'rogue/combat':
      return {
        opening: ['slice_and_dice'],
        builder: ['sinister_strike'],
        spender: ['eviscerate', 'blade_flurry'],
        filler: ['attack'],
      };
    case 'rogue/subtlety':
      return {
        opening: ['premeditation', 'ambush', 'slice_and_dice'],
        builder: ['backstab', 'hemorrhage'],
        spender: ['eviscerate', 'rupture'],
        filler: ['attack'],
      };
    case 'priest/shadow':
      return {
        opening: ['shadowform'],
        builder: ['vampiric_touch', 'shadow_word_pain', 'devouring_plague'],
        spender: ['mind_blast', 'mind_flay'],
        filler: ['smite'],
      };
    case 'shaman/elemental':
      return {
        builder: ['flame_shock'],
        spender: ['lightning_bolt', 'chain_lightning', 'lava_burst'],
        selfBuff: ['lightning_shield'],
        filler: ['earth_shock'],
      };
    case 'shaman/enhancement':
      return {
        opening: ['ghost_wolf'],
        selfBuff: ['rockbiter_weapon', 'flametongue_weapon'],
        spender: ['stormstrike', 'lava_lash', 'shock'],
        filler: ['attack'],
      };
    case 'mage/arcane':
      return {
        opening: ['arcane_intellect'],
        builder: ['arcane_missiles'],
        spender: ['arcane_barrage', 'arcane_power'],
        filler: ['fireball'],
      };
    case 'mage/fire':
      return {
        builder: ['pyroblast', 'living_bomb'],
        spender: ['fireball', 'fire_blast', 'combustion'],
        filler: ['scorch'],
      };
    case 'mage/frost':
      return {
        builder: ['frostbolt'],
        spender: ['ice_lance', 'frostfire_bolt', 'icy_veins'],
        filler: ['fireball'],
      };
    case 'warlock/affliction':
      return {
        summonPet: ['summon_felguard'],
        builder: ['curse_of_agony', 'corruption', 'unstable_affliction'],
        spender: ['shadow_bolt', 'haunt', 'drain_soul'],
        filler: ['shadow_bolt'],
      };
    case 'warlock/demonology':
      return {
        summonPet: ['summon_felguard'],
        opening: ['metamorphosis'],
        builder: ['curse_of_agony', 'corruption'],
        spender: ['shadow_bolt', 'soul_fire'],
        filler: ['shadow_bolt'],
      };
    case 'warlock/destruction':
      return {
        summonPet: ['summon_imp'],
        builder: ['immolate', 'curse_of_elements'],
        spender: ['chaos_bolt', 'conflagrate', 'incinerate'],
        filler: ['shadow_bolt'],
      };
    case 'druid/balance':
      return {
        opening: ['moonkin_form'],
        builder: ['moonfire', 'insect_swarm'],
        spender: ['starfire', 'wrath', 'starsurge'],
        filler: ['wrath'],
      };
    case 'druid/feral':
      return {
        opening: ['cat_form'],
        builder: ['rake', 'shred'],
        spender: ['ferocious_bite', 'rip', 'savage_roar'],
        filler: ['attack'],
      };
    default:
      // Generic fallback
      return {
        filler: ['attack'],
      };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function isTank(classType: string, spec: string | null | undefined): boolean {
  return getRole(classType, spec) === 'tank';
}

export function isHealer(classType: string, spec: string | null | undefined): boolean {
  return getRole(classType, spec) === 'healer';
}

export function isDps(classType: string, spec: string | null | undefined): boolean {
  return getRole(classType, spec) === 'dps';
}
