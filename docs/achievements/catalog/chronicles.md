# Chronicles (chr_): the zone diary layer

One Chronicle per overworld zone, each split into three Chapters. A Chapter is
a meta deed over a requirement list (zone quest lines, the zone's exp_
wayfarer landmark deed, kill and skill tasks, the zone's dungeon and delve
first-clear deeds, and the chr_ tasks defined below). Chapter I covers the
zone's early levels, Chapter II its mid stretch, Chapter III its endgame. Nothing here is missable: every
requirement is a state predicate over persisted progress or repeatable
content. Retired quests (q_archetype_acceptance, q_prof_make_amends,
q_aldrics_fallen_star) are deliberately excluded everywhere.

Cross-file requirements reference exact deed ids (reconciled at assembly):
dgn_hollow_crypt, dgn_sunken_bastion, dgn_gravewyrm_sanctum, dlv_reliquary,
dlv_litany, cmb_thunzharr (dungeons-delves.md), and the per-zone landmark
deeds exp_vale_wayfarer, exp_marsh_wayfarer, exp_peaks_wayfarer
(social-economy-exploration.md, which owns the single POI-visit mechanism:
the poisVisited set, within 20 yd, 1 Hz sweep).

## Registries

- Proposed titles (3): "of the Vale", "of the Mirefen", "of Thornpeak"
- Proposed borders: none from this file
- Steam names (3): ACH_VALE_CHAPTER_III, ACH_MARSH_CHAPTER_III,
  ACH_PEAKS_CHAPTER_III

## Chronicler NPCs (content to add)

Each zone gets an in-world Chronicler: the flavor face of its Chronicle. The
NPC is ceremony, not a gate; every chapter reward is equally claimable from
the deeds window. All three are new NpcDefs to add to the zone content files
(no quests, no vendor; a `chronicler` interaction that opens the Chronicle
page of the deeds window).

- Saul the Chronicler (template id `chronicler_saul`, Eastbrook Vale). Home:
  the Eastbrook town square, its quiet southeast corner, looking back across
  the square toward the well (maintainer's naming; sanctioned by the
  catalog voice rules). Personality: a patient old record-keeper who writes
  every deed down twice, "once for the ledger and once for the fireside."
- Chronicler Osric Fenn (template id `chronicler_osric_fenn`, Mirefen Marsh).
  Home: Fenbridge, the west side of the square on open ground, looking east
  toward the gate. Personality: a damp, cheerful scribe who
  binds his books in oiled prowler hide and swears the fen eats more pages
  than readers.
- Chronicler Zenzie (template id `chronicler_edda_hartwell`, Thornpeak
  Heights; the display name was renamed from "Chronicler Edda Hartwell" by
  maintainer call, and the template id is retained for save compatibility).
  Home: Highwatch, the south road shoulder below the square, overlooking the
  climb up from Fenbridge. Personality: a retired soldier of the watch who
  records names so the mountain cannot forget them, hers least of all.

---

## The Vale Chronicle (Eastbrook Vale, levels 1 to 7)

### chr_vale_chapter_i
- Name: Vale Chronicle, Chapter I
- Desc: Finish the first chapter of Saul's chronicle: Eastbrook's opening errands, the lay of the Vale, and a first taste of its trades.
- Renown: 5
- Trigger: meta: questsDone contains q_wolves, q_boars, q_spiders, and q_greyjaw; plus deeds exp_vale_wayfarer, chr_vale_gatherer, and chr_vale_first_cast.
- Reward: none
- Hidden: no
- Steam: no
- Notes: The four quests are the level 1 to 4 openers from src/sim/content/zone1.ts (Marshal Redbrook, Trader Wilkes, Apothecary Lin). Claim ceremony at Saul the Chronicler in Eastbrook.

### chr_vale_chapter_ii
- Name: Vale Chronicle, Chapter II
- Desc: Finish the second chapter of Saul's chronicle: bandits, murlocs, and mine vermin put down, the Sowfield played, and the Reliquary braved.
- Renown: 10
- Trigger: meta: questsDone contains q_murlocs, q_supplies, q_bandits, q_ringleader, q_mine, and q_bones; plus deeds chr_vale_packbreaker and chr_vale_cup_debut; plus deed dlv_reliquary (any tier).
- Reward: none
- Hidden: no
- Steam: no
- Notes: The Collapsed Reliquary delve entrance is the delve marker at Reliquary Hill (ZONE1_PROPS.delveMarkers, delveId collapsed_reliquary). Requirement deed: dlv_reliquary.

### chr_vale_chapter_iii
- Name: Chronicle of the Vale
- Desc: See the Vale's whole story through: the Gravecaller unmasked, the Hollow Crypt cleansed, and every named terror of the Vale laid low.
- Renown: 25
- Trigger: meta: deeds chr_vale_chapter_i, chr_vale_chapter_ii, and chr_vale_rares; plus questsDone contains q_whispers, q_names_of_the_dead, q_silence_the_call, q_rite, q_sexton, q_hollow, q_gravecallers_trail, and q_mogger; plus deed dgn_hollow_crypt.
- Reward: title "of the Vale"
- Hidden: no
- Steam: ACH_VALE_CHAPTER_III
- Notes: Completes Brother Aldric's full Gravecaller chain (zone1.ts). q_mogger is gated behind q_gravecallers_trail in content, so it is correctly endgame for the zone. Steam name and desc stay spoiler-safe (the dungeon is named, the boss twist is not).

### chr_vale_gatherer
- Name: Living off the Land
- Desc: Harvest an ore vein, a wood stand, and an herb patch in Eastbrook Vale.
- Renown: 5
- Trigger: predicate: one successful harvest from a gather node of each type (ore, wood, herb) with zoneId eastbrook_vale; persisted per-type flags.
- Reward: none
- Hidden: no
- Steam: no
- Notes: Nodes exist for all three types (src/sim/content/gather_nodes.ts: ore near Boar Meadow, wood near Sableweb, herbs near Mirror Lake). Gathering tools are sold by Trader Wilkes in Eastbrook.

### chr_vale_first_cast
- Name: Something in Mirror Lake
- Desc: Catch a fish from the waters of Eastbrook Vale.
- Renown: 5
- Trigger: completion: a fishing cast in eastbrook_vale resolves to a fish item (raw_mirror_trout, raw_river_perch, or glimmerfin_koi; weeds and empty hooks do not count).
- Reward: none
- Hidden: no
- Steam: no
- Notes: FISHING_TABLES.eastbrook_vale (src/sim/content/items.ts); Fisherman Brandt sells the simple_fishing_pole. Not luck-gated: common fish are the majority of the table, so a catch lands within a few casts.

### chr_vale_packbreaker
- Name: Packbreaker
- Desc: Slay 3 Forest Wolves within 10 seconds.
- Renown: 5
- Trigger: speed: three forest_wolf kill credits by the same player inside a rolling 10 second window.
- Reward: none
- Hidden: no
- Steam: no
- Notes: The Wolf Run camps spawn 6 to 7 wolves each and the wolves pack up (packFrenzy), so the pull exists in natural play; fails only through pull size and execution, never RNG.

### chr_vale_cup_debut
- Name: Copper Pail Contender
- Desc: Take the field and touch the ball in a Vale Cup match at the Sowfield.
- Renown: 5
- Trigger: completion: record at least one personal ball touch in a QUEUED Vale Cup bout (touch attribution per src/sim/vale_cup_ball.ts). Bot-backfilled queued bouts count; practice bouts and offline-staged bouts NEVER count (the same exclusions the pvp_fiesta_* deeds carry).
- Reward: none
- Hidden: no
- Steam: no
- Notes: The Sowfield and Groundskeeper Bram are permanent zone1 fixtures (vale_cup_layout, ZONE1_NPCS). A touch is a personal outcome, so an AFK body coasting to full time earns nothing; rated play is deliberately NOT required so low-population queues still progress the Chronicle, while the rated pvp_ deeds stay the competitive layer. If the Cup ever becomes season-bound this task must move to feats per catalog rule 5.

### chr_vale_rares
- Name: Terrors of the Vale
- Desc: Slay the five named terrors of Eastbrook Vale: Old Greyjaw, Mogger, Grix the Tunnelking, Captain Verlan, and Wraithbinder Maldrec.
- Renown: 10
- Trigger: predicate: kill credit on each of old_greyjaw, mogger, grix_the_tunnelking, captain_verlan, and wraithbinder_maldrec; persisted per-mob set.
- Reward: none
- Hidden: no
- Steam: no
- Notes: All five are rare or rare-elite spawns in zone1.ts with timed respawns (respawnMult up to 432, roughly 3 hours for Grix and Maldrec), so nothing is missable; these are kill tasks, not drop tasks, so no luck gate.

---

## The Marsh Chronicle (Mirefen Marsh, levels 6 to 13)

### chr_marsh_chapter_i
- Name: Marsh Chronicle, Chapter I
- Desc: Finish the first chapter of Osric Fenn's chronicle: answer the Fenbridge muster, secure the causeway, and learn the shape of the fen.
- Renown: 5
- Trigger: meta: questsDone contains q_fenbridge_muster, q_prowlers, q_prowler_pelts, q_fen_supplies, and q_deepfen; plus deeds exp_marsh_wayfarer and chr_marsh_gatherer.
- Reward: none
- Hidden: no
- Steam: no
- Notes: The five quests are the causeway and shallows openers (Warden Fenwick, Provisioner Hale; src/sim/content/zone2.ts). Claim ceremony at Chronicler Osric Fenn in Fenbridge.

### chr_marsh_chapter_ii
- Name: Marsh Chronicle, Chapter II
- Desc: Finish the second chapter of Osric Fenn's chronicle: the widows burned out, the drowned laid to rest, the Codfather landed, and the Litany braved.
- Renown: 10
- Trigger: meta: questsDone contains q_idols, q_deepfen_purge, q_widows, q_broodmother, q_drowned, q_drowned_censers, q_no_rest, and q_the_codfather; plus deed chr_marsh_unburst; plus deed dlv_litany (any tier).
- Reward: none
- Hidden: no
- Steam: no
- Notes: The Drowned Litany is the Mirefen Marsh delve (src/sim/content/delves/drowned_litany.ts); its overworld marker currently sits at (-95, 505) near the Troll Mounds (defined in ZONE3_PROPS.delveMarkers though the coordinate is inside the marsh). Requirement deed: dlv_litany.

### chr_marsh_chapter_iii
- Name: Chronicle of the Mirefen
- Desc: See the fen's whole story through: the cult camp broken, the Fogbinder silenced in the Sunken Bastion, and every named terror of the mist laid low.
- Renown: 25
- Trigger: meta: deeds chr_marsh_chapter_i, chr_marsh_chapter_ii, chr_marsh_hush_the_mending, and chr_marsh_rares; plus questsDone contains q_trolls, q_troll_fetishes, q_grubjaw, q_cult_camp, q_summoners, q_deacon, q_bastion_door, q_olen, and q_mistcaller; plus deed dgn_sunken_bastion.
- Reward: title "of the Mirefen"
- Hidden: no
- Steam: ACH_MARSH_CHAPTER_III
- Notes: Completes the full zone2 Gravecaller arc through Vael the Fogbinder (zone2.ts). Steam desc names the dungeon, not the boss.

### chr_marsh_gatherer
- Name: Fenbridge Foraging
- Desc: Harvest an ore vein, a wood stand, and an herb patch in Mirefen Marsh.
- Renown: 5
- Trigger: predicate: one successful harvest from a gather node of each type (ore, wood, herb) with zoneId mirefen_marsh; persisted per-type flags.
- Reward: none
- Hidden: no
- Steam: no
- Notes: gather_nodes.ts places two of each type in mirefen_marsh.

### chr_marsh_unburst
- Name: Do Not Stand in the Spores
- Desc: Slay 8 Bog Bloats without being caught in their Caustic Spores burst.
- Renown: 10
- Trigger: mechanical: lifetime counter of bog_bloat kills credited to the player where the delayed deathThroes blast dealt the player no damage; 8 clean kills complete it (clean kills accumulate, no streak reset).
- Reward: none
- Hidden: no
- Steam: no
- Notes: The corpse swells for 1.5 seconds before bursting (ZONE2_MOBS.bog_bloat.deathThroes), so failure is purely a positioning error, never RNG. Teaches the zone's signature avoid.

### chr_marsh_hush_the_mending
- Name: Silence the Mending
- Desc: In the Gravecaller encampment, slay a Gravecaller Mender before any of the cultists it tends.
- Renown: 10
- Trigger: mechanical: a gravecaller_mender dies by your killing blow while at least one living gravecaller_cultist or gravecaller_summoner stands within 14 yards of it (its Grave Mending radius).
- Reward: none
- Hidden: no
- Steam: no
- Notes: Kill-order skill task built on ZONE2_MOBS.gravecaller_mender.mendAlly (radius 14); the camp packs at the Gravecaller Encampment always spawn menders beside cultists (ZONE2_CAMPS), so the setup is natural play. Fails only through target-priority error.

### chr_marsh_rares
- Name: Named in the Mist
- Desc: Slay the three named terrors of Mirefen Marsh: Mirejaw the Ravenous, Sloomtooth the Drowned, and Sister Nhalia.
- Renown: 10
- Trigger: predicate: kill credit on each of mirejaw_the_ravenous, sloomtooth_the_drowned, and sister_nhalia; persisted per-mob set.
- Reward: none
- Hidden: no
- Steam: no
- Notes: All three are rare elites with timed respawns (respawnMult 648, roughly 4.5 hours; zone2.ts). Grubjaw is deliberately excluded because q_grubjaw already requires him. Template caution: the overworld rare `sister_nhalia` (zone2.ts) pinned here is DISTINCT from the delve boss `sister_nhalia_drowned_canticle` (drowned_litany.ts) that dlv_nhalia_bells fights; implementers bind by template id, never display name.

---

## The Peaks Chronicle (Thornpeak Heights, levels 13 to 20)

### chr_peaks_chapter_i
- Name: Peaks Chronicle, Chapter I
- Desc: Finish the first chapter of Zenzie's chronicle: clear the ridge road, empty the burrows, and learn every path Highwatch guards.
- Renown: 5
- Trigger: meta: questsDone contains q_highwatch_summons, q_stalkers, q_stalker_pelts, q_stalkers_return, q_stalker_cloaks, q_old_cragmaw, q_kobold_tunnels, and q_glowing_wax; plus deeds exp_peaks_wayfarer and chr_peaks_sparring.
- Reward: none
- Hidden: no
- Steam: no
- Notes: The stalker and kobold chains are the zone's level 13 to 15 opener arcs (Captain Thessaly, Quartermaster Bree, Loremaster Caddis; src/sim/content/zone3.ts). Claim ceremony at Chronicler Zenzie in Highwatch.

### chr_peaks_chapter_ii
- Name: Peaks Chronicle, Chapter II
- Desc: Finish the second chapter of Zenzie's chronicle: break Drogmar's war-camp, read the waking storm, and stand where the Glimmermere glows.
- Renown: 10
- Trigger: meta: questsDone contains q_ogre_edges, q_ogre_totems, q_ogre_bounty, q_crushers, q_drogmar, q_elementals, q_shard_cores, q_kazzix, q_glimmermere_light, and q_tarn_waders; plus deeds chr_peaks_glimmer_cast, chr_peaks_moongate, and chr_peaks_waking_witness.
- Reward: none
- Hidden: no
- Steam: no
- Notes: q_glimmermere_light and q_tarn_waders are the surface-side Drowned Temple openers at Ondrel Vane on the Glimmermere shore (src/sim/content/temple.ts); the temple interior's deeds belong to dungeons-delves.md and are not required here.

### chr_peaks_chapter_iii
- Name: Chronicle of Thornpeak
- Desc: See the mountain's whole story through: the Wyrmcult broken, the Sanctum silenced, the Waking Peak felled, and every named terror of the crags laid low.
- Renown: 50
- Trigger: meta: deeds chr_peaks_chapter_i, chr_peaks_chapter_ii, and chr_peaks_rares; plus questsDone contains q_zealots, q_cult_orders, q_necromancers, q_revenants, q_revenant_vanguard, q_wyrm_sigils, q_breaking_the_seal, q_voice_below, q_sanctum_gate, q_korgath, q_velkhar, and q_gravewyrm; plus deeds dgn_gravewyrm_sanctum and cmb_thunzharr.
- Reward: title "of Thornpeak"
- Hidden: no
- Steam: ACH_PEAKS_CHAPTER_III
- Notes: Completes the zone3 arc through q_gravewyrm (zone3.ts). The Nythraxis raid chain (q_nythraxis_restless_dead through q_nythraxis_scourges_end, 10-player) is deliberately excluded: it is raid-tier content owned by dungeons-delves.md, above the chronicle's zone-endgame bar. Steam desc names the Sanctum and the world boss, not the sealed dragon.

### chr_peaks_sparring
- Name: Wall Drills
- Desc: Deal 1,000 total damage to the training dummy above Highwatch.
- Renown: 5
- Trigger: lifetime counter: damage dealt by the player to training_dummy reaches 1000.
- Reward: none
- Hidden: no
- Steam: no
- Notes: The dummy is a permanent fixture on the hill above Highwatch (ZONE3_CAMPS; zero armor, respawns 10 seconds after a "death"). Active play, not attendance; introduces the practice target as part of the zone tour.

### chr_peaks_glimmer_cast
- Name: Cold Water, Colder Light
- Desc: Catch a fish from the Glimmermere.
- Renown: 5
- Trigger: completion: a fishing cast in thornpeak_heights resolves to a fish item (raw_frostgill_trout, raw_stonescale_carp, or glimmerfin_koi; weeds and empty hooks do not count).
- Reward: none
- Hidden: no
- Steam: no
- Notes: FISHING_TABLES.thornpeak_heights (items.ts); the Glimmermere at (-70, 760) is the zone's only lake, so the zone-scoped trigger is effectively the tarn. Stands in for a gather-node task: gather_nodes.ts places no nodes in thornpeak_heights.

### chr_peaks_moongate
- Name: Through the Cold Gate
- Desc: Step through the moongate on the Glimmermere shore.
- Renown: 5
- Trigger: interaction: enter the Drowned Temple via the moongate at MOONGATE_POS (-70, 792) (dungeon id drowned_temple).
- Reward: none
- Hidden: no
- Steam: no
- Notes: Entry only, no clear required; the Drowned Temple's clear and encounter deeds live in dungeons-delves.md. Ondrel Vane keeps watch at the gate (temple.ts).

### chr_peaks_waking_witness
- Name: The Mountain That Walks
- Desc: Lay eyes on Thunzharr, the Waking Peak while he strides the mountain.
- Renown: 5
- Trigger: interaction: be within 100 yards (pinned literal; inside the interest scope) of a living thunzharr_waking_peak at any point while he is risen.
- Reward: none
- Hidden: no
- Steam: no
- Notes: Thunzharr rises on a fixed cadence (src/sim/world_boss.ts) with a server-wide warning and 350-yard battle yells, so witnessing is never missable and needs no kill. The kill itself is deed cmb_thunzharr, required by Chapter III.

### chr_peaks_rares
- Name: Names Cut into the Crag
- Desc: Slay the four named terrors of Thornpeak Heights: the Ironvein Foreman, Brutok Skullsmasher, Voskar the Emberwing, and Marrowlord Varkas.
- Renown: 10
- Trigger: predicate: kill credit on each of ironvein_foreman, brutok_skullsmasher, voskar_emberwing, and marrowlord_varkas; persisted per-mob set.
- Reward: none
- Hidden: no
- Steam: no
- Notes: All four are rare elites with timed respawns (respawnMult 144 to 864, one to six hours; zone3.ts). Old Cragmaw and Shardlord Kazzix are deliberately excluded because q_old_cragmaw and q_kazzix already require them.

---

## Tally

- Chapter metas: 9 (3 per zone). Renown: Vale 5 + 10 + 25, Mirefen 5 + 10 + 25, Thornpeak 5 + 10 + 50 = 145.
- chr_ task deeds: 14 (Vale 5, Mirefen 4, Thornpeak 5). Renown: 30 + 35 + 30 = 95. (The three per-zone landmark tasks moved to social-economy-exploration.md as the exp_ wayfarer deeds in the assembly duplicate sweep; chr_vale_cup_debut retuned 10 to 5 with the touch-outcome gate.)
- Chronicles Renown subtotal: 240.
- Titles: 3 (Chapter III of each zone). Borders: 0. Steam: 3 (Chapter III of each zone).

---

## Polish-round additions (2026-07-09)

Tally delta: +1 deed, +5 Renown, no new titles, borders, or Steam entries.

### chr_marsh_first_cast
- Name: Eels in the Reeds
- Desc: Catch a fish from the waters of Mirefen Marsh.
- Renown: 5
- Trigger: interaction: visited mark 'fish:mirefen_marsh' (already emitted for every ZONE_FISH zone by onFishCaughtForDeeds, src/sim/deeds.ts; zero new instrumentation)
- Reward: none
- Hidden: no
- Steam: no
- Notes: Completes the per-zone first-cast trio beside chr_vale_first_cast and chr_peaks_glimmer_cast; the Marsh fishing debut the audit found missing. Deliberately NOT added to chr_marsh_chapter_i or chapter_ii: existing deed triggers are never retro-edited in this round (README polish-round resolutions). The Vale and Peaks casts carry no Steam entry, so neither does this one.
