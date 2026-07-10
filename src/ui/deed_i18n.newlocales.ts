// Deed name / desc / title locale tables (the talent_i18n.newlocales shape):
// the release-fill data behind DEED_LOCALES in deed_i18n.ts. One table per
// base locale, keyed by deed id in catalog order. es_ES and fr_CA are pure
// dialect aliases assembled in deed_i18n.ts (the talent_i18n localeText
// dialect model), and en / en_CA resolve to the authored English before the
// table is consulted. Values carry no em or en dashes (repo copy rule; this
// file sits outside the overlay exemption).
import type { DeedLocaleTable } from './deed_i18n';

export const DEED_LOCALE_TABLES: Record<
  | 'cs_CZ'
  | 'da_DK'
  | 'de_DE'
  | 'es'
  | 'fr_FR'
  | 'id_ID'
  | 'it_IT'
  | 'ja_JP'
  | 'ko_KR'
  | 'nl_NL'
  | 'pl_PL'
  | 'pt_BR'
  | 'ru_RU'
  | 'sv_SE'
  | 'tr_TR'
  | 'vi_VN'
  | 'zh_CN'
  | 'zh_TW',
  DeedLocaleTable
> = {
  cs_CZ: {
    prog_first_steps: {
      name: 'První kroky',
      desc: 'Dosáhni úrovně 2 a udělej první krok na dlouhé cestě.',
    },
    prog_finding_your_feet: {
      name: 'Pevná půda pod nohama',
      desc: 'Dosáhni úrovně 5; divočina už vypadá o kousek menší.',
    },
    prog_double_digits: { name: 'Dvě cifry', desc: 'Dosáhni úrovně 10 a odemkni své talenty.' },
    prog_the_long_middle: { name: 'Dlouhý střed cesty', desc: 'Dosáhni úrovně 15.' },
    prog_level_cap: { name: 'Výhled z vrcholu', desc: 'Dosáhni úrovně 20, nejvyšší možné úrovně.' },
    prog_well_rested: {
      name: 'Dobře odpočatý',
      desc: 'Usaď se v hostinci, dokud nezískáš odpočaté zkušenosti.',
    },
    prog_talented: { name: 'Dobře vynaložený bod', desc: 'Utrať svůj první talentový bod.' },
    prog_specialized: {
      name: 'Vyhlášení záměru',
      desc: 'Zvol si specializaci a nauč se její stěžejní schopnost.',
    },
    prog_deep_roots: {
      name: 'Hluboké kořeny',
      desc: 'Utrať talentový bod za talent z poslední řady.',
    },
    prog_full_build: {
      name: 'Celá jedenáctka',
      desc: 'Utrať všech jedenáct talentových bodů v jedné sestavě.',
    },
    prog_veteran: {
      name: 'Veterán',
      desc: 'Získej za celý život 250 000 zkušeností.',
      title: 'Veterán',
    },
    prog_champion: {
      name: 'Šampion',
      desc: 'Získej za celý život 500 000 zkušeností.',
      title: 'Šampion',
    },
    prog_paragon: {
      name: 'Vzor',
      desc: 'Získej za celý život 1 000 000 zkušeností.',
      title: 'Vzor',
    },
    prog_mythic: {
      name: 'Mýtický',
      desc: 'Získej za celý život 2 500 000 zkušeností.',
      title: 'Mýtický',
    },
    prog_eternal: {
      name: 'Věčný',
      desc: 'Získej za celý život 5 000 000 zkušeností.',
      title: 'Věčný',
    },
    prog_prestige: {
      name: 'Začít znovu',
      desc: 'Dosáhni nejvyšší úrovně, naplň ukazatel ještě jednou a získej prestižní hodnost 1.',
    },
    prog_prestige_5: { name: 'Staré zvyky', desc: 'Dosáhni prestižní hodnosti 5.' },
    prog_prestige_10: { name: 'Perpetuum mobile', desc: 'Dosáhni prestižní hodnosti 10.' },
    prog_first_harvest: { name: 'Plody polí', desc: 'Skliď své první sběrné naleziště.' },
    prog_mining_100: { name: 'Ruda v krvi', desc: 'Dosáhni zdatnosti 100 v hornictví.' },
    prog_logging_100: {
      name: 'Sekáč jádrového dřeva',
      desc: 'Dosáhni zdatnosti 100 v dřevorubectví.',
    },
    prog_herbalism_100: { name: 'Mistr lučin', desc: 'Dosáhni zdatnosti 100 v bylinkářství.' },
    prog_master_gatherer: {
      name: 'Mistr sběrač',
      desc: 'Dosáhni zdatnosti 100 v hornictví, dřevorubectví a bylinkářství.',
    },
    prog_first_craft: { name: 'Vlastníma rukama', desc: 'Dokonči svou první úspěšnou výrobu.' },
    prog_craft_specialist: {
      name: 'Tajemství řemesla',
      desc: 'Dosáhni dovednosti 75 v kterémkoli řemesle a odemkni výhody jeho specializace.',
    },
    prog_around_the_ring: {
      name: 'Kolem dokola',
      desc: 'Dosáhni dovednosti 25 v pěti různých řemeslech.',
    },
    cmb_first_blood: { name: 'První krev', desc: 'Poraz svého prvního nepřítele.' },
    cmb_slayer: { name: 'Zabiják', desc: 'Poraz 1 000 nepřátel.' },
    cmb_legion_of_one: { name: 'Armáda jednoho', desc: 'Poraz 10 000 nepřátel.' },
    cmb_heavy_hitter: { name: 'Těžká váha', desc: 'Uštědři celkem 500 000 poškození.' },
    cmb_critical_eye: { name: 'Kritické oko', desc: 'Zasaď 500 kritických úderů.' },
    cmb_giantslayer: {
      name: 'Obrobijce',
      desc: 'Zasaď smrtící úder nepříteli alespoň o pět úrovní nad tebou.',
    },
    cmb_first_fall: {
      name: 'Oklepat a jít dál',
      desc: 'Zemři poprvé; stává se to i těm nejlepším.',
    },
    dgn_hollow_crypt: {
      name: 'Lamač krypty',
      desc: 'Poraz Morthena Hrobovolajícího v Duté kryptě.',
    },
    dgn_sunken_bastion: {
      name: 'Mlhovazač bez pout',
      desc: 'Poraz Vaela Mlhovazače v Potopené baště.',
    },
    dgn_drowned_temple: {
      name: 'Utopit měsíc',
      desc: 'Poraz Ysolei, avatara utopeného měsíce, v Utopeném chrámu.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Drak v hlubinách',
      desc: 'Poraz Korzula Hrobodraka ve Svatyni Hrobodraka.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Hrdinská: Dutá krypta',
      desc: 'Poraz Morthena Hrobovolajícího v Duté kryptě na hrdinské obtížnosti.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Hrdinská: Potopená bašta',
      desc: 'Poraz Vaela Mlhovazače v Potopené baště na hrdinské obtížnosti.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Hrdinská: Utopený chrám',
      desc: 'Poraz Ysolei, avatara utopeného měsíce, v Utopeném chrámu na hrdinské obtížnosti.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Hrdinská: Svatyně Hrobodraka',
      desc: 'Poraz Korzula Hrobodraka ve Svatyni Hrobodraka na hrdinské obtížnosti.',
    },
    dgn_nythraxis: {
      name: 'Už žádná metla',
      desc: 'Poraz Nythraxise, metlu Thornpeaku, za zapečetěnými královskými dveřmi.',
    },
    dgn_nythraxis_heroic: {
      name: 'Hrdinská: Už žádná metla',
      desc: 'Poraz Nythraxise, metlu Thornpeaku, na hrdinské obtížnosti.',
    },
    dgn_thornpeak_rounds: {
      name: 'Obchůzka',
      desc: 'Vyčisti Dutou kryptu, Potopenou baštu, Utopený chrám a Svatyni Hrobodraka.',
    },
    dgn_deepward: {
      name: 'Stráž hlubin',
      desc: 'Pokoř každý dungeon, raid i obě výpravy na hrdinské obtížnosti.',
    },
    dgn_mark_circuit: {
      name: 'Celý okruh',
      desc: 'Získej Hrdinské značky ze všech čtyř hrdinských dungeonů během jediného dne.',
    },
    dgn_boss_clears_50: {
      name: 'Padesát dveří za sebou',
      desc: 'Poraz 50 závěrečných bossů dungeonů.',
    },
    dgn_morthen_flawless: {
      name: 'Ani kůstka nazmar',
      desc: 'Poraz Morthena Hrobovolajícího na hrdinské obtížnosti, aniž by kdokoli ze skupiny zemřel.',
    },
    dgn_morthen_trio: {
      name: 'Tři proti hrobu',
      desc: 'Poraz Morthena Hrobovolajícího s nejvýše třemi hráči.',
    },
    dgn_olen_arc: {
      name: 'Úkrok před žencem',
      desc: 'Poraz rytířského velitele Olena, aniž by jeho Žnoucí oblouk zasáhl kohokoli kromě jeho aktuálního cíle.',
    },
    dgn_vael_thralls: {
      name: 'Bez jediného otroka',
      desc: 'Poraz Vaela Mlhovazače, když je každý Utopený otrok, kterého povolal, již zabit.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Do posledního plemene',
      desc: 'Poraz Ysolei, když je každé Měsíční plémě, které povolala, již zabito.',
    },
    dgn_ysolei_flawless: {
      name: 'Suché oči',
      desc: 'Poraz Ysolei, avatara utopeného měsíce, na hrdinské obtížnosti, aniž by kdokoli ze skupiny zemřel.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Zůstaňte pohřbení',
      desc: 'Poraz velkého nekromanta Velkhara tak, aby byl každý Povstalý kostěný chodec zničen dřív, než Velkhar padne.',
    },
    dgn_korzul_flawless: {
      name: 'Drakobijce',
      desc: 'Poraz Korzula Hrobodraka na hrdinské obtížnosti, aniž by kdokoli ze skupiny zemřel.',
      title: 'Drakobijce',
    },
    dgn_sanctum_speed: {
      name: 'Sprint svatyní',
      desc: 'Poraz Korzula Hrobodraka do 15 minut od chvíle, kdy si tvá skupina zabrala Svatyni Hrobodraka.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Před králem nepokleknu',
      desc: 'Poraz Nythraxise tak, aby Hrobolam nikdy nezasáhl nikoho kromě jeho aktuálního cíle.',
    },
    dgn_nythraxis_wardens: {
      name: 'Strážci ochranných kamenů',
      desc: 'Poraz Nythraxise tak, aby byl každý Nesmrtelný hněv zlomen dřív, než udeří.',
    },
    dgn_nythraxis_deathless: {
      name: 'Nikdo nesmrtelnější',
      desc: 'Poraz Nythraxise, metlu Thornpeaku, na hrdinské obtížnosti, aniž by jediný člen raidu zemřel.',
      title: 'Nesmrtelný',
    },
    cmb_thunzharr: {
      name: 'Hora padla',
      desc: 'Sraz Thunzharra, probouzející se štít, u Bouřného skalního štítu.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Štítolam',
      desc: 'Sraz Thunzharra, probouzející se štít, aniž bys zemřel, od svého prvního úderu po jeho poslední dech.',
      title: 'Štítolam',
    },
    cmb_thunzharr_ten: {
      name: 'Hory ze zvyku',
      desc: 'Sraz Thunzharra, probouzející se štít, desetkrát.',
    },
    dlv_reliquary: { name: 'Relikviářový běžec', desc: 'Vyčisti Zhroucený relikviář.' },
    dlv_reliquary_heroic: {
      name: 'Hrdinsky: Zhroucený relikviář',
      desc: 'Vyčisti Zhroucený relikviář na hrdinském stupni.',
    },
    dlv_litany: { name: 'Utiš Litanii', desc: 'Vyčisti Utopenou litanii.' },
    dlv_litany_heroic: {
      name: 'Hrdinsky: Utopená litanie',
      desc: 'Vyčisti Utopenou litanii na hrdinském stupni.',
    },
    dlv_lore_journal: {
      name: 'Poznámky na okraji',
      desc: 'Odemkni všech pět záznamů deníku výprav.',
    },
    dlv_companion_max: {
      name: 'V hlubině poznáš přítele',
      desc: 'Doveď společnici z výprav na její nejvyšší hodnost.',
    },
    dlv_companions_both: {
      name: 'Obě lucerny rozžaté',
      desc: 'Doveď obě společnice z výprav, Akolytku Tessu a Eddu Reedhand, na nejvyšší hodnost.',
    },
    dlv_clears_50: { name: 'Padesát sáhů', desc: 'Dokonči 50 výprav.' },
    dlv_solo_heroic: {
      name: 'Ve dvou se to lépe táhne',
      desc: 'Vyčisti výpravu na hrdinském stupni bez jediného dalšího hráče, jen ty a tvá společnice.',
    },
    dlv_tumbler_premium: {
      name: 'Cesta stavítek, zvládnutá',
      desc: 'Otevři chráněnou truhlu relikviáře při nejvyšší sázce, bezchybně na jediný pokus.',
    },
    dlv_rite_flawless: {
      name: 'Slovo od slova',
      desc: 'Dokonči Obřad utopeného relikviáře bez jediné chyby.',
    },
    dlv_varric_ringers: {
      name: 'Zvony umlkly',
      desc: 'Poraz Diákona Varrica poté, co pobiješ každého Pohřebního zvoníka, kterého pozvedne.',
    },
    dlv_nhalia_bells: {
      name: 'Tišitel zvonů',
      desc: 'Poraz Sestru Nhalii, Utopený chvalozpěv, aniž by kohokoli ze skupiny zasáhl Zvonící zvon.',
      title: 'Tišitel zvonů',
    },
    chr_vale_chapter_i: {
      name: 'Kronika Údolí, kapitola I',
      desc: 'Dokonči první kapitolu Saulovy kroniky: první pochůzky v Eastbrooku, obhlídka Údolí a první ochutnávka zdejších řemesel.',
    },
    chr_vale_chapter_ii: {
      name: 'Kronika Údolí, kapitola II',
      desc: 'Dokonči druhou kapitolu Saulovy kroniky: bandité, murloci i důlní havěť pobiti, zápas na Prasečím poli odehrán a Relikviář zdolán.',
    },
    chr_vale_chapter_iii: {
      name: 'Kronika Údolí',
      desc: 'Doveď příběh Údolí až do konce: Hrobovolající odhalen, Dutá krypta očištěna a všechny pojmenované hrůzy Údolí pobity.',
      title: 'z Údolí',
    },
    chr_vale_gatherer: {
      name: 'Z darů kraje',
      desc: 'Vytěž v Eastbrookském údolí rudnou žílu, porost dřeva i záhon bylin.',
    },
    chr_vale_first_cast: {
      name: 'Něco v Zrcadlovém jezeře',
      desc: 'Chyť rybu ve vodách Eastbrookského údolí.',
    },
    chr_vale_packbreaker: { name: 'Postrach smeček', desc: 'Zab 3 Lesní vlky během 10 sekund.' },
    chr_vale_cup_debut: {
      name: 'Uchazeč o Měděné vědro',
      desc: 'Nastup na hřiště a dotkni se míče v zápase Poháru Údolí na Prasečím poli.',
    },
    chr_vale_rares: {
      name: 'Hrůzy Údolí',
      desc: 'Zab pět pojmenovaných hrůz Eastbrookského údolí: Starého Šedočelista, Moggera, Grixe Tunelového krále, Kapitána Verlana a Maldreca, poutače přízraků.',
    },
    chr_marsh_chapter_i: {
      name: 'Kronika Močálu, kapitola I',
      desc: 'Dokonči první kapitolu kroniky Osrica Fenna: odpověz na fenbridgeské svolání, zajisti hráz a poznej tvář slatě.',
    },
    chr_marsh_chapter_ii: {
      name: 'Kronika Močálu, kapitola II',
      desc: 'Dokonči druhou kapitolu kroniky Osrica Fenna: vdovy vypáleny, utopení uloženi k odpočinku, Tresčí kmotr uloven a Litanie zdolána.',
    },
    chr_marsh_chapter_iii: {
      name: 'Kronika Mirefenu',
      desc: 'Doveď příběh slatě až do konce: tábor kultu rozprášen, Mlhovazač umlčen v Potopené baště a všechny pojmenované hrůzy mlhy pobity.',
      title: 'z Mirefenu',
    },
    chr_marsh_gatherer: {
      name: 'Fenbridgeská sklizeň',
      desc: 'Vytěž v Mirefenském močálu rudnou žílu, porost dřeva i záhon bylin.',
    },
    chr_marsh_unburst: {
      name: 'Nestůj ve výtrusech',
      desc: 'Zab 8 Bahenních nadmutců, aniž by tě zasáhl výbuch jejich Žíravých výtrusů.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Umlč hojení',
      desc: 'V táboře Hrobovolajících zab Ranhojiče Hrobovolajících dřív než kteréhokoli z kultistů, o které pečuje.',
    },
    chr_marsh_rares: {
      name: 'Jména v mlze',
      desc: 'Zab tři pojmenované hrůzy Mirefenského močálu: Lačnou Bahnočelist, Sloomtootha Utopeného a Sestru Nhalii.',
    },
    chr_peaks_chapter_i: {
      name: 'Kronika Výšin, kapitola I',
      desc: 'Dokonči první kapitolu Zenziiny kroniky: vyčisti hřebenovou cestu, vyprázdni nory a poznej každou stezku, kterou Highwatch střeží.',
    },
    chr_peaks_chapter_ii: {
      name: 'Kronika Výšin, kapitola II',
      desc: 'Dokonči druhou kapitolu Zenziiny kroniky: rozbij Drogmarův válečný tábor, přečti probouzející se bouři a postav se tam, kde září Třpytivé pleso.',
    },
    chr_peaks_chapter_iii: {
      name: 'Kronika Thornpeaku',
      desc: 'Doveď příběh hory až do konce: kult draka rozprášen, Svatyně umlčena, Probouzející se štít sražen a všechny pojmenované hrůzy skalisek pobity.',
      title: 'z Thornpeaku',
    },
    chr_peaks_sparring: {
      name: 'Dril na hradbách',
      desc: 'Uštědři celkem 1 000 poškození Cvičnému panákovi nad Highwatchem.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Studená voda, chladnější světlo',
      desc: 'Chyť rybu z Třpytivého plesa.',
    },
    chr_peaks_moongate: {
      name: 'Skrz chladnou bránu',
      desc: 'Projdi měsíční bránou na břehu Třpytivého plesa.',
    },
    chr_peaks_waking_witness: {
      name: 'Hora, která kráčí',
      desc: 'Spatři Thunzharra, probouzející se štít, když kráčí horou.',
    },
    chr_peaks_rares: {
      name: 'Jména vytesaná do skály',
      desc: 'Zab čtyři pojmenované hrůzy Thornpeakských výšin: Předáka Železné žíly, Brutoka Drtiče lebek, Voskara Žhavé křídlo a Pána morku Varkase.',
    },
    col_discovery_25: {
      name: 'Křeček',
      desc: 'Objev 25 různých předmětů (předmět se počítá, když se poprvé ocitne ve tvém vlastnictví).',
    },
    col_discovery_75: { name: 'Straka', desc: 'Objev 75 různých předmětů.' },
    col_discovery_150: {
      name: 'Kabinet kuriozit',
      desc: 'Objev 150 různých předmětů.',
      title: 'Kurátor',
    },
    col_discovery_250: { name: 'Velký katalog', desc: 'Objev 250 různých předmětů.' },
    col_first_rare: { name: 'Něco modrého', desc: 'Získej svůj první předmět vzácné kvality.' },
    col_first_epic: { name: 'Zrozen v purpuru', desc: 'Získej svůj první předmět epické kvality.' },
    col_first_legendary: {
      name: 'Oranžové terno',
      desc: 'Získej svůj první předmět legendární kvality.',
    },
    col_set_vale_arcanist: {
      name: 'Regálie údolního arkanisty',
      desc: 'Objev každý kus Regálií údolního arkanisty.',
    },
    col_set_boundstone_vanguard: {
      name: 'Předvoj spoutaného kamene',
      desc: 'Objev každý kus Předvoje spoutaného kamene.',
    },
    col_set_greyjaw_stalker: {
      name: 'Výbava stopaře Šedočelista',
      desc: 'Objev každý kus Výbavy stopaře Šedočelista.',
    },
    col_set_deathlord: {
      name: 'Válečná výstroj mohylového pána',
      desc: 'Objev každý kus Válečné výstroje mohylového pána.',
    },
    col_set_wyrmshadow: {
      name: 'Roucha nočního tesáku',
      desc: 'Objev každý kus Rouch nočního tesáku.',
    },
    col_set_necromancers: { name: 'Oděv smutkotkaní', desc: 'Objev každý kus Oděvu smutkotkaní.' },
    col_set_crownforged: { name: 'Regálie z kosti', desc: 'Objev každý kus Regálií z kosti.' },
    col_set_nighttalon: {
      name: 'Kožešina děsivého tesáku',
      desc: 'Objev každý kus Kožešiny děsivého tesáku.',
    },
    col_set_soulflame: {
      name: 'Regálie přízračného ohně',
      desc: 'Objev každý kus Regálií přízračného ohně.',
    },
    col_set_stormcallers: {
      name: 'Roucha volání vichru',
      desc: 'Objev každý kus Rouch volání vichru.',
    },
    col_seven_regalia: {
      name: 'Sedmerý šatník',
      desc: 'Objev každý kus všech sedmi epických zbrojních rodin.',
      title: 'Skvostný',
    },
    col_true_colors: {
      name: 'V pravých barvách',
      desc: 'Nastup na hřiště v jiném vzhledu, než je výchozí vzhled tvé třídy.',
    },
    col_all_slots: {
      name: 'Jedenáct kusů parády',
      desc: 'Měj současně nasazený předmět ve všech jedenácti slotech výstroje.',
    },
    col_quartermaster_buyout: {
      name: 'Věrný zákazník',
      desc: 'Objev všech deset kusů z nabídky Zásobovače Vexe.',
    },
    col_glimmerfin: { name: 'Třpyt naděje', desc: 'Chyť Koi se třpytivou ploutví.' },
    col_full_creel: {
      name: 'Plný košík',
      desc: 'Objev všech šest běžných úlovků z vod Údolí, Močálu a Výšin.',
    },
    col_junk_drawer: {
      name: 'Šuplík s harampádím',
      desc: 'Objev 10 různých předmětů mizerné kvality.',
    },
    pvp_arena_first_match: {
      name: 'Písek v botách',
      desc: 'Odehraj hodnocený zápas v Popelavém koloseu, v libovolné z obou kategorií.',
    },
    pvp_arena_first_win: {
      name: 'Dav burácí',
      desc: 'Vyhraj hodnocený zápas v aréně, v libovolné z obou kategorií.',
    },
    pvp_arena_1v1_1600: {
      name: 'Vyzyvatel kolosea',
      desc: 'Dosáhni hodnocení 1600 v arénové kategorii 1 na 1.',
    },
    pvp_arena_1v1_1750: {
      name: 'Sok kolosea',
      desc: 'Dosáhni hodnocení 1750 v arénové kategorii 1 na 1.',
    },
    pvp_arena_1v1_1900: {
      name: 'Gladiátor',
      desc: 'Dosáhni hodnocení 1900 v arénové kategorii 1 na 1.',
      title: 'Gladiátor',
    },
    pvp_arena_2v2_1600: {
      name: 'Dva ve zbrani',
      desc: 'Dosáhni hodnocení 1600 v arénové kategorii 2 na 2.',
    },
    pvp_arena_2v2_1750: {
      name: 'Obávaná dvojka',
      desc: 'Dosáhni hodnocení 1750 v arénové kategorii 2 na 2.',
    },
    pvp_arena_2v2_1900: {
      name: 'Dokonalá souhra',
      desc: 'Dosáhni hodnocení 1900 v arénové kategorii 2 na 2.',
    },
    pvp_duel_first_win: { name: 'Vyřídíme si to venku', desc: 'Vyhraj duel.' },
    pvp_duel_grace: {
      name: 'Lekce pokory',
      desc: 'Prohraj duel s důstojností víceméně nedotčenou.',
    },
    pvp_vcup_first_match: {
      name: 'Kopačky na hřišti',
      desc: 'Odehraj celý zápas Poháru údolí na Prasečím poli, ať vyhraješ, nebo prohraješ.',
    },
    pvp_vcup_first_win: { name: 'První trofej', desc: 'Vyhraj hodnocený zápas Poháru údolí.' },
    pvp_vcup_wins_10: {
      name: 'Ostřílený kančbalista',
      desc: 'Vyhraj 10 hodnocených zápasů Poháru údolí.',
    },
    pvp_vcup_wins_25: {
      name: 'Legenda kančbalu',
      desc: 'Vyhraj 25 hodnocených zápasů Poháru údolí.',
      title: 'Legenda kančbalu',
    },
    pvp_vcup_first_goal: {
      name: 'Střelecký účet otevřen',
      desc: 'Vstřel gól v hodnoceném zápase Poháru údolí.',
    },
    pvp_vcup_hat_trick: {
      name: 'Hrdina hattricku',
      desc: 'Vstřel tři góly v jediném hodnoceném zápase Poháru údolí, v kategorii 3 na 3 nebo větší.',
    },
    pvp_vcup_golden_goal: {
      name: 'Zlatý okamžik',
      desc: 'Vstřel zlatý gól, který rozhodne hodnocený zápas Poháru údolí.',
    },
    pvp_vcup_first_save: {
      name: 'Jisté ruce',
      desc: 'Předveď zákrok jako brankář v hodnoceném zápase Poháru údolí.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Přese mě nic neprojde',
      desc: 'Vyhraj hodnocený zápas Poháru údolí jako brankář bez inkasovaného gólu.',
    },
    pvp_vcup_guild_win: {
      name: 'Za zástavu',
      desc: 'Vyhraj hodnocený zápas Poháru údolí odehraný pod zástavou tvého cechu.',
    },
    pvp_fiesta_first_bout: {
      name: 'Nezvaný host',
      desc: 'Odehraj celý souboj Fiesty 2 na 2, ať vyhraješ, nebo prohraješ.',
    },
    pvp_fiesta_first_win: { name: 'Duše Fiesty', desc: 'Vyhraj souboj Fiesty 2 na 2.' },
    pvp_fiesta_double: {
      name: 'Dvojitý malér',
      desc: 'Zaznamenej dvě eliminace ve Fiestě během čtyř sekund.',
    },
    pvp_fiesta_shutdown: {
      name: 'Kazič zábavy',
      desc: 'Sejmi soupeře ve Fiestě, který je na sérii tří a více.',
    },
    pvp_fiesta_full_build: {
      name: 'Ve velké parádě',
      desc: 'Vyhraj souboj Fiesty s vylepšením zajištěným ze všech tří vln.',
    },
    pvp_fiesta_powerups: {
      name: 'Od každého jednou',
      desc: 'Seber alespoň jednou každý ze čtyř power-upů v ringu: Démona rychlosti, Kolosa, Měsíční boty a Berserkera.',
    },
    pvp_fiesta_five_kills: {
      name: 'Tahoun párty',
      desc: 'Zaznamenej pět eliminací v jediném souboji Fiesty.',
    },
    soc_first_party: {
      name: 'Ve dvou se to lépe táhne',
      desc: 'Připoj se do skupiny s dalším hráčem.',
    },
    soc_full_house: { name: 'Plná sestava', desc: 'Vyčisti dungeon v plné pětičlenné skupině.' },
    soc_guild_joined: { name: 'Pod jednou zástavou', desc: 'Staň se členem cechu.' },
    soc_guild_founded: { name: 'Zakladatelův brk', desc: 'Založ vlastní cech.' },
    soc_first_trade: { name: 'Poctivý obchod', desc: 'Dokonči obchod s jiným hráčem.' },
    soc_first_sale: {
      name: 'Máme otevřeno',
      desc: 'Vyzvedni mince ze svého prvního prodeje na Světovém trhu.',
    },
    soc_steady_custom: {
      name: 'Stálá klientela',
      desc: 'Vyzvedni z prodejů na Světovém trhu celkem 10 zlatých za celý život.',
    },
    soc_market_magnate: {
      name: 'Magnát trhu',
      desc: 'Vyzvedni z prodejů na Světovém trhu celkem 100 zlatých za celý život.',
      title: 'Magnát',
    },
    soc_by_ravens_wing: {
      name: 'Na havraních křídlech',
      desc: 'Pošli Havraní poštou dopis nesoucí mince nebo balíček.',
    },
    soc_room_for_more: { name: 'Kam s tím', desc: 'Kup si své první rozšíření banky.' },
    soc_gilded_strongbox: {
      name: 'Pozlacená truhlice',
      desc: 'Kup všechna rozšíření banky, která ti pokladníci prodají.',
    },
    soc_meet_bursar: {
      name: 'Věříme ve Fernanda',
      desc: 'Slož poklonu pokladníku Fernandovi, správci Pozlacené truhlice v Eastbrooku.',
    },
    soc_pocket_money: { name: 'Kapesné', desc: 'Ukořisti za celý život celkem 1 zlatý v mincích.' },
    soc_heavy_purse: {
      name: 'Těžký měšec',
      desc: 'Ukořisti za celý život celkem 10 zlatých v mincích.',
    },
    soc_wyrms_hoard: {
      name: 'Dračí poklad',
      desc: 'Ukořisti za celý život celkem 100 zlatých v mincích.',
    },
    soc_civic_duty: { name: 'Občanská povinnost', desc: 'Přiděl svůj první bod zaměření města.' },
    exp_long_road_north: {
      name: 'Dlouhá cesta na sever',
      desc: 'Navštiv všechna tři hlavní sídla: Eastbrook, Fenbridge a Highwatch.',
    },
    exp_vale_wayfarer: {
      name: 'Pocestný z údolí',
      desc: 'Navštiv všech jedenáct pojmenovaných míst Eastbrookského údolí.',
    },
    exp_marsh_wayfarer: {
      name: 'Pocestný z močálu',
      desc: 'Navštiv všech osm pojmenovaných míst Mirefenského močálu.',
    },
    exp_peaks_wayfarer: {
      name: 'Pocestný z výšin',
      desc: 'Navštiv všech deset pojmenovaných míst Thornpeakských výšin.',
    },
    exp_world_traveler: {
      name: 'Světoběžník',
      desc: 'Vykonej skutek pocestného všech tří zón.',
      title: 'Pocestný',
    },
    exp_something_shiny: { name: 'Něco se třpytí', desc: 'Seber ze země třpytící se předmět.' },
    exp_first_ore: { name: 'Udeř do země', desc: 'Skliď své první naleziště rudy.' },
    exp_first_timber: { name: 'Pozor, padá!', desc: 'Skliď své první naleziště dřeva.' },
    exp_first_herb: { name: 'Zelené prsty', desc: 'Skliď své první naleziště bylin.' },
    feat_era_cap: {
      name: 'Dítě První éry',
      desc: 'Dosáhl(a) jsi úrovně 20 v době, kdy trvala První éra.',
    },
    feat_book_complete: { name: 'Celá kniha', desc: 'Vykonej každý skutek v Knize skutků.' },
    feat_brightwood_relic: {
      name: 'Vzpomínka na Brightwood',
      desc: 'Uchovej relikvii starého Brightwoodu: Kazajku z trnité kůže nebo Korunu monarchy.',
    },
    hid_saul_footnote: {
      name: 'Poznámka pod čarou dějin',
      desc: 'Devětkrát bez přestávky jsi otravoval(a) kronikáře Saula.',
      title: 'Poznámka pod čarou',
    },
    hid_gilded_tour: {
      name: 'Pozlacené turné',
      desc: 'Obchodoval(a) jsi se všemi třemi pobočkami Pozlacené truhlice.',
    },
    hid_fall_death: {
      name: 'Gravitace vždycky vyhraje',
      desc: 'Zemřel(a) jsi na dlouhý rozhovor se zemí.',
    },
    hid_keepers_toll_twice: {
      name: 'Strážce vybírá dvakrát',
      desc: 'Zemřel(a) jsi, když na tobě ještě leželo Strážcovo mýto.',
    },
    hid_roll_hundred: {
      name: 'Čistá stovka',
      desc: 'Hodil(a) jsi rovných 100 při obyčejném /roll.',
    },
    hid_yumi_cheer: {
      name: 'Největší fanoušek Yumi',
      desc: 'Povzbuzoval(a) jsi Yumi uprostřed souboje tam, kde tě mohla slyšet.',
    },
    hid_bountiful_coffer: {
      name: 'Purpurová truhla',
      desc: 'Rozlouskl(a) jsi Bohatou truhlu dřív, než se stačila zaseknout.',
    },
    hid_companion_save: {
      name: 'Ne pod jejím dohledem',
      desc: 'Tvá společnice z výpravy zvedla padlého člena skupiny zpátky na nohy.',
    },
    hid_codfather: {
      name: 'Vítej v rodině',
      desc: 'Vytáhl(a) jsi Tresčího kmotra z Mělčin Deepfenu.',
    },
    prog_crown_below: {
      name: 'Koruna v hlubinách',
      desc: 'Následuj korunu od neklidných kostěných polí až do hrobky krále Nythraxise a dokonči úkol Konec metly.',
    },
    prog_mere_at_rest: {
      name: 'Klid nad plesem',
      desc: 'Doveď hlídku Ondrela Vanea až do konce: sbor umlčen, Bledá spirála skolena a utopený měsíc uložen k odpočinku.',
    },
    prog_callused_hands: {
      name: 'Mozolnaté ruce',
      desc: 'Dokonči úkol Řemeslo pro každou ruku a vyslouž si první mozol v eastbrookských řemeslech.',
    },
    prog_tools_of_the_trade: {
      name: 'Nástroje řemesla',
      desc: 'Dokonči výrobu vázanou na stanoviště v highwatchském řemeslném centru.',
    },
    dgn_nythraxis_crypt: {
      name: 'Co krypta skrývala',
      desc: 'Odvaž se do Opuštěné krypty a získej od jejích strážců obě poloviny klíče od krypty i starobylý deník.',
    },
    chr_marsh_first_cast: {
      name: 'Úhoři v rákosí',
      desc: 'Chyť rybu ve vodách Mirefenského močálu.',
    },
  },
  da_DK: {
    prog_first_steps: {
      name: 'De Første Skridt',
      desc: 'Nå niveau 2, og tag dit første skridt på en lang vej.',
    },
    prog_finding_your_feet: {
      name: 'Fast Grund under Fødderne',
      desc: 'Nå niveau 5; vildmarken ser allerede en smule mindre ud.',
    },
    prog_double_digits: { name: 'Tocifret', desc: 'Nå niveau 10, og lås dine talenter op.' },
    prog_the_long_middle: { name: 'Den Lange Midte', desc: 'Nå niveau 15.' },
    prog_level_cap: { name: 'Udsigten fra Toppen', desc: 'Nå niveau 20, det højeste niveau.' },
    prog_well_rested: {
      name: 'Veludhvilet',
      desc: 'Slå dig til ro på en kro, indtil du har optjent udhvilet erfaring.',
    },
    prog_talented: { name: 'Godt Givet Ud', desc: 'Brug dit første talentpoint.' },
    prog_specialized: {
      name: 'En Klar Hensigt',
      desc: 'Vælg en specialisering, og lær dens signaturevne.',
    },
    prog_deep_roots: {
      name: 'Dybe Rødder',
      desc: 'Brug et talentpoint på et talent i nederste række.',
    },
    prog_full_build: {
      name: 'Alle Elleve',
      desc: 'Brug alle elleve talentpoint på ét og samme build.',
    },
    prog_veteran: {
      name: 'Veteran',
      desc: 'Optjen sammenlagt 250.000 erfaring.',
      title: 'Veteran',
    },
    prog_champion: { name: 'Mester', desc: 'Optjen sammenlagt 500.000 erfaring.', title: 'Mester' },
    prog_paragon: {
      name: 'Forbillede',
      desc: 'Optjen sammenlagt 1.000.000 erfaring.',
      title: 'Forbillede',
    },
    prog_mythic: { name: 'Mytisk', desc: 'Optjen sammenlagt 2.500.000 erfaring.', title: 'Mytisk' },
    prog_eternal: { name: 'Evig', desc: 'Optjen sammenlagt 5.000.000 erfaring.', title: 'Evig' },
    prog_prestige: {
      name: 'Begynd Forfra',
      desc: 'Nå det højeste niveau, fyld bjælken endnu en gang, og gør krav på prestigerang 1.',
    },
    prog_prestige_5: { name: 'Gamle Vaner', desc: 'Nå prestigerang 5.' },
    prog_prestige_10: { name: 'Evighedsmaskinen', desc: 'Nå prestigerang 10.' },
    prog_first_harvest: { name: 'Markens Frugter', desc: 'Høst din første indsamlingsforekomst.' },
    prog_mining_100: { name: 'Malm i Blodet', desc: 'Nå 100 i færdigheden Minedrift.' },
    prog_logging_100: { name: 'Kernevedshugger', desc: 'Nå 100 i færdigheden Skovhugst.' },
    prog_herbalism_100: { name: 'Engens Mester', desc: 'Nå 100 i færdigheden Urtekundskab.' },
    prog_master_gatherer: {
      name: 'Mestersamler',
      desc: 'Nå 100 i færdighed i Minedrift, Skovhugst og Urtekundskab.',
    },
    prog_first_craft: { name: 'Håndlavet', desc: 'Fuldfør din første vellykkede fremstilling.' },
    prog_craft_specialist: {
      name: 'Fagets Hemmeligheder',
      desc: 'Nå 75 i færdighed i ét enkelt håndværk, og lås dets specialiseringsfordele op.',
    },
    prog_around_the_ring: {
      name: 'Ringen Rundt',
      desc: 'Nå 25 i færdighed i fem forskellige håndværk.',
    },
    cmb_first_blood: { name: 'Første Blod', desc: 'Besejr din første fjende.' },
    cmb_slayer: { name: 'Dræber', desc: 'Besejr 1.000 fjender.' },
    cmb_legion_of_one: { name: 'Én Mands Legion', desc: 'Besejr 10.000 fjender.' },
    cmb_heavy_hitter: { name: 'Hårdtslående', desc: 'Uddel 500.000 skade i alt.' },
    cmb_critical_eye: { name: 'Kritisk Blik', desc: 'Uddel 500 kritiske træf.' },
    cmb_giantslayer: {
      name: 'Kæmpedræber',
      desc: 'Giv dødsstødet til en fjende mindst fem niveauer over dig.',
    },
    cmb_first_fall: {
      name: 'Børst Støvet Af',
      desc: 'Dø for første gang; det sker for de bedste af os.',
    },
    dgn_hollow_crypt: {
      name: 'Kryptbryder',
      desc: 'Besejr Morthen Gravkalderen i Den Hule Krypt.',
    },
    dgn_sunken_bastion: {
      name: 'Fogbinderen Ubundet',
      desc: 'Besejr Vael Fogbinderen i Den Sunkne Bastion.',
    },
    dgn_drowned_temple: {
      name: 'Månen Druknes',
      desc: 'Besejr Ysolei, den Druknede Månes Avatar, i Det Druknede Tempel.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Ormen Dernede',
      desc: 'Besejr Korzul Gravormen i Gravormens Helligdom.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Heroisk: Den Hule Krypt',
      desc: 'Besejr Morthen Gravkalderen i Den Hule Krypt på heroisk sværhedsgrad.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Heroisk: Den Sunkne Bastion',
      desc: 'Besejr Vael Fogbinderen i Den Sunkne Bastion på heroisk sværhedsgrad.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Heroisk: Det Druknede Tempel',
      desc: 'Besejr Ysolei, den Druknede Månes Avatar, i Det Druknede Tempel på heroisk sværhedsgrad.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Heroisk: Gravormens Helligdom',
      desc: 'Besejr Korzul Gravormen i Gravormens Helligdom på heroisk sværhedsgrad.',
    },
    dgn_nythraxis: {
      name: 'Svøbens Endeligt',
      desc: 'Besejr Nythraxis, Tornetops Svøbe, bag den forseglede kongelige dør.',
    },
    dgn_nythraxis_heroic: {
      name: 'Heroisk: Svøbens Endeligt',
      desc: 'Besejr Nythraxis, Tornetops Svøbe, på heroisk sværhedsgrad.',
    },
    dgn_thornpeak_rounds: {
      name: 'På Runde',
      desc: 'Ryd Den Hule Krypt, Den Sunkne Bastion, Det Druknede Tempel og Gravormens Helligdom.',
    },
    dgn_deepward: {
      name: 'Dybets Værge',
      desc: 'Betving hver eneste fangekælder, raidet og begge delves på heroisk sværhedsgrad.',
    },
    dgn_mark_circuit: {
      name: 'Hele Turen Rundt',
      desc: 'Optjen Heroiske Mærker fra alle fire heroiske fangekældre på en og samme dag.',
    },
    dgn_boss_clears_50: {
      name: 'Halvtreds Døre Nede',
      desc: 'Besejr 50 slutbosser i fangekældrene.',
    },
    dgn_morthen_flawless: {
      name: 'Ikke en Knogle at Rafle om',
      desc: 'Besejr Morthen Gravkalderen på heroisk sværhedsgrad, uden at noget gruppemedlem dør.',
    },
    dgn_morthen_trio: {
      name: 'Tre mod Graven',
      desc: 'Besejr Morthen Gravkalderen med tre eller færre spillere.',
    },
    dgn_olen_arc: {
      name: 'Et Skridt foran Leen',
      desc: 'Besejr Ridderkommandør Olen, uden at hans Mejende Bue rammer andre end hans aktuelle mål.',
    },
    dgn_vael_thralls: {
      name: 'Trællefri',
      desc: 'Besejr Vael Fogbinderen, mens samtlige Druknede Trælle, han hidkalder, allerede er fældet.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Hver Eneste Måneyngel',
      desc: 'Besejr Ysolei, mens al den Måneyngel, hun hidkalder, allerede er fældet.',
    },
    dgn_ysolei_flawless: {
      name: 'Tørre Øjne',
      desc: 'Besejr Ysolei, den Druknede Månes Avatar, på heroisk sværhedsgrad, uden at noget gruppemedlem dør.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Bliv i Graven',
      desc: 'Besejr Stornekromantør Velkhar med samtlige Genopvakte Benvandrere tilintetgjort, før han falder.',
    },
    dgn_korzul_flawless: {
      name: 'Ormefælder',
      desc: 'Besejr Korzul Gravormen på heroisk sværhedsgrad, uden at noget gruppemedlem dør.',
      title: 'Ormefælder',
    },
    dgn_sanctum_speed: {
      name: 'Helligdomsspurt',
      desc: 'Besejr Korzul Gravormen inden for 15 minutter efter, at din gruppe har gjort krav på Gravormens Helligdom.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Knæl for Ingen Konge',
      desc: 'Besejr Nythraxis, uden at Gravbryder nogensinde rammer andre end hans aktuelle mål.',
    },
    dgn_nythraxis_wardens: {
      name: 'Værgestenenes Vogtere',
      desc: 'Besejr Nythraxis med hvert Udødeligt Raseri brudt, før det rammer.',
    },
    dgn_nythraxis_deathless: {
      name: 'Ingen Mere Udødelig',
      desc: 'Besejr Nythraxis, Tornetops Svøbe, på heroisk sværhedsgrad, uden at en eneste raider dør.',
      title: 'den Udødelige',
    },
    cmb_thunzharr: {
      name: 'Bjerget Faldt',
      desc: 'Fæld Thunzharr, den Vågnende Tinde, ved Stormklippen.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Tindebryder',
      desc: 'Fæld Thunzharr, den Vågnende Tinde, uden at dø fra dit første slag til hans sidste åndedrag.',
      title: 'Tindebryder',
    },
    cmb_thunzharr_ten: {
      name: 'Bjerge som Vane',
      desc: 'Fæld Thunzharr, den Vågnende Tinde, ti gange.',
    },
    dlv_reliquary: { name: 'Relikvarieløber', desc: 'Ryd Det Sammenstyrtede Relikvarium.' },
    dlv_reliquary_heroic: {
      name: 'Heroisk: Det Sammenstyrtede Relikvarium',
      desc: 'Ryd Det Sammenstyrtede Relikvarium på heroisk niveau.',
    },
    dlv_litany: { name: 'Tys på Litaniet', desc: 'Ryd Det Druknede Litani.' },
    dlv_litany_heroic: {
      name: 'Heroisk: Det Druknede Litani',
      desc: 'Ryd Det Druknede Litani på heroisk niveau.',
    },
    dlv_lore_journal: { name: 'Randnoter', desc: 'Lås alle fem optegnelser i delve-dagbogen op.' },
    dlv_companion_max: {
      name: 'En Ven i Dybet',
      desc: 'Optræn en delve-følgesvend til hendes højeste rang.',
    },
    dlv_companions_both: {
      name: 'Begge Lygter Tændt',
      desc: 'Optræn begge delve-følgesvende, Akolyt Tessa og Edda Sivhånd, til deres højeste rang.',
    },
    dlv_clears_50: { name: 'Halvtreds Favne', desc: 'Gennemfør 50 delve-ture.' },
    dlv_solo_heroic: {
      name: 'To er en Hel Flok',
      desc: 'Ryd en delve på heroisk niveau uden nogen anden spiller, kun dig og din følgesvend.',
    },
    dlv_tumbler_premium: {
      name: 'Stifternes Sti, Mestret',
      desc: 'Åbn en værnet relikvariekiste ved højeste indsats, fejlfrit i dit eneste forsøg.',
    },
    dlv_rite_flawless: {
      name: 'Til Punkt og Prikke',
      desc: 'Gennemfør Det Druknede Relikvarieritual uden en eneste fejl.',
    },
    dlv_varric_ringers: {
      name: 'Klokkerne Forstummer',
      desc: 'Fæld hver Ligklokkeringer, Diakon Varric genopvækker, før han selv falder.',
    },
    dlv_nhalia_bells: {
      name: 'Klokkestiller',
      desc: 'Besejr Søster Nhalia, den Druknede Kantikel, uden at noget gruppemedlem bliver ramt af en Klemtende Klokke.',
      title: 'Klokkestiller',
    },
    chr_vale_chapter_i: {
      name: 'Dalens Krønike, Kapitel I',
      desc: 'Afslut første kapitel af Sauls krønike: Østbæks første ærinder, overblik over Dalen og en første smag på dens håndværk.',
    },
    chr_vale_chapter_ii: {
      name: 'Dalens Krønike, Kapitel II',
      desc: 'Afslut andet kapitel af Sauls krønike: banditter, mudfinne-snigerne og minens skadedyr nedkæmpet, Somarken spillet og Relikvariet trodset.',
    },
    chr_vale_chapter_iii: {
      name: 'Krøniken om Dalen',
      desc: 'Følg Dalens fulde fortælling til ende: Gravkalderen afsløret, Den Hule Krypt renset og hver navngiven rædsel i Dalen fældet.',
      title: 'af Dalen',
    },
    chr_vale_gatherer: {
      name: 'Leve af Landet',
      desc: 'Høst en malmåre, en skovbevoksning og et urtebed i Østbæk Dal.',
    },
    chr_vale_first_cast: { name: 'Noget i Spejlsøen', desc: 'Fang en fisk i Østbæk Dals vande.' },
    chr_vale_packbreaker: { name: 'Flokbryder', desc: 'Dræb 3 Skovulve inden for 10 sekunder.' },
    chr_vale_cup_debut: {
      name: 'Kobberspandens Kandidat',
      desc: 'Gå på banen og rør bolden i en Dalpokal-kamp på Somarken.',
    },
    chr_vale_rares: {
      name: 'Dalens Rædsler',
      desc: 'Dræb de fem navngivne rædsler i Østbæk Dal: Gamle Gråkæft, Mogger, Grix Tunnelkongen, Kaptajn Verlan og Genfærdsbinder Maldrec.',
    },
    chr_marsh_chapter_i: {
      name: 'Sumpens Krønike, Kapitel I',
      desc: 'Afslut første kapitel af Osric Fenns krønike: besvar mønstringen ved Sumpbroen, sikr dæmningsvejen og lær kærets form at kende.',
    },
    chr_marsh_chapter_ii: {
      name: 'Sumpens Krønike, Kapitel II',
      desc: 'Afslut andet kapitel af Osric Fenns krønike: enkerne røget ud, de druknede stedt til hvile, Torskefaderen halet i land og Litaniet trodset.',
    },
    chr_marsh_chapter_iii: {
      name: 'Krøniken om Mosekæret',
      desc: 'Følg kærets fulde fortælling til ende: kultlejren knust, Fogbinderen bragt til tavshed i Den Sunkne Bastion og hver navngiven rædsel i tågen fældet.',
      title: 'af Mosekæret',
    },
    chr_marsh_gatherer: {
      name: 'Sanketur ved Sumpbroen',
      desc: 'Høst en malmåre, en skovbevoksning og et urtebed i Mosekær Sump.',
    },
    chr_marsh_unburst: {
      name: 'Stå Ikke i Sporerne',
      desc: 'Dræb 8 Sumpopsvulmere uden at blive fanget i deres udbrud af Ætsende Sporer.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Bring Helingen til Tavshed',
      desc: 'Fæld en Gravkalder-Heler i Gravkaldernes Lejr, inden nogen af de kultister, den plejer, falder.',
    },
    chr_marsh_rares: {
      name: 'Navne i Tågen',
      desc: 'Dræb de tre navngivne rædsler i Mosekær Sump: Sumpkæft den Glubske, Sloomtand den Druknede og Søster Nhalia.',
    },
    chr_peaks_chapter_i: {
      name: 'Tindernes Krønike, Kapitel I',
      desc: 'Afslut første kapitel af Zenzies krønike: ryd vejen over bjergkammen, tøm hulerne og lær hver sti, Højvagten vogter.',
    },
    chr_peaks_chapter_ii: {
      name: 'Tindernes Krønike, Kapitel II',
      desc: 'Afslut andet kapitel af Zenzies krønike: knus Drogmars Krigslejr, tyd den vågnende storm og stå, hvor Glimmersøen gløder.',
    },
    chr_peaks_chapter_iii: {
      name: 'Krøniken om Tornetop',
      desc: 'Følg bjergets fulde fortælling til ende: Ormekulten knust, Helligdommen bragt til tavshed, den Vågnende Tinde styrtet og hver navngiven rædsel i klipperne fældet.',
      title: 'af Tornetop',
    },
    chr_peaks_sparring: {
      name: 'Øvelser på Muren',
      desc: 'Tilføj træningsdukken over Højvagten 1.000 skade i alt.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Koldt Vand, Koldere Lys',
      desc: 'Fang en fisk i Glimmersøen.',
    },
    chr_peaks_moongate: {
      name: 'Gennem den Kolde Port',
      desc: 'Træd gennem måneporten ved Glimmersøens bred.',
    },
    chr_peaks_waking_witness: {
      name: 'Bjerget der Vandrer',
      desc: 'Få øje på Thunzharr, den Vågnende Tinde, mens han skrider hen over bjerget.',
    },
    chr_peaks_rares: {
      name: 'Navne Hugget i Klippen',
      desc: 'Dræb de fire navngivne rædsler i Tornetop Højder: Jernåre-Formanden, Brutok Kranieknuser, Voskar Glødevinge og Margherre Varkas.',
    },
    col_discovery_25: {
      name: 'Hamstrer',
      desc: 'Opdag 25 forskellige genstande (en genstand tæller første gang, den nogensinde kommer i din besiddelse).',
    },
    col_discovery_75: { name: 'Husskade', desc: 'Opdag 75 forskellige genstande.' },
    col_discovery_150: {
      name: 'Raritetskabinet',
      desc: 'Opdag 150 forskellige genstande.',
      title: 'Kuratoren',
    },
    col_discovery_250: { name: 'Det Store Katalog', desc: 'Opdag 250 forskellige genstande.' },
    col_first_rare: { name: 'Noget Blåt', desc: 'Skaf din første genstand af sjælden kvalitet.' },
    col_first_epic: { name: 'Født i Purpur', desc: 'Skaf din første genstand af episk kvalitet.' },
    col_first_legendary: {
      name: 'Appelsinen i Turbanen',
      desc: 'Skaf din første genstand af legendarisk kvalitet.',
    },
    col_set_vale_arcanist: {
      name: 'Dalarkanistens Skrud',
      desc: 'Opdag hver del af Dalarkanistens Skrud.',
    },
    col_set_boundstone_vanguard: {
      name: 'Bundstens-Fortroppen',
      desc: 'Opdag hver del af Bundstens-Fortroppen.',
    },
    col_set_greyjaw_stalker: {
      name: 'Gråkæbe-Luskerens Udstyr',
      desc: 'Opdag hver del af Gråkæbe-Luskerens Udstyr.',
    },
    col_set_deathlord: {
      name: 'Barrowlord-Krigsudstyr',
      desc: 'Opdag hver del af Barrowlord-Krigsudstyret.',
    },
    col_set_wyrmshadow: { name: 'Nightfang-Ornat', desc: 'Opdag hver del af Nightfang-Ornatet.' },
    col_set_necromancers: {
      name: 'Mournweave-Dragt',
      desc: 'Opdag hver del af Mournweave-Dragten.',
    },
    col_set_crownforged: {
      name: 'Bonewrought-Skrud',
      desc: 'Opdag hver del af Bonewrought-Skruddet.',
    },
    col_set_nighttalon: { name: 'Direfang-Pels', desc: 'Opdag hver del af Direfang-Pelsen.' },
    col_set_soulflame: { name: 'Wraithfire-Skrud', desc: 'Opdag hver del af Wraithfire-Skruddet.' },
    col_set_stormcallers: { name: 'Galecall-Ornat', desc: 'Opdag hver del af Galecall-Ornatet.' },
    col_seven_regalia: {
      name: 'Den Syvfoldige Garderobe',
      desc: 'Opdag hver del af alle syv episke rustningsfamilier.',
      title: 'den Prægtige',
    },
    col_true_colors: {
      name: 'Bekend Kulør',
      desc: 'Gå på banen iført et hvilket som helst andet udseende end din klasses standard.',
    },
    col_all_slots: {
      name: 'Klædt På til Elleve',
      desc: 'Hav en genstand udrustet i alle elleve udstyrspladser på samme tid.',
    },
    col_quartermaster_buyout: {
      name: 'Stamkunde',
      desc: 'Opdag alle ti dele af den Heroiske Kvartermesters lager.',
    },
    col_glimmerfin: { name: 'Et Glimt af Håb', desc: 'Fang en Glimtfinne-Koi.' },
    col_full_creel: {
      name: 'Fyldt Fiskekurv',
      desc: 'Opdag alle seks almindelige fangster fra Dalens, Sumpens og Højdernes vande.',
    },
    col_junk_drawer: {
      name: 'Rodeskuffen',
      desc: 'Opdag 10 forskellige genstande af ringe kvalitet.',
    },
    pvp_arena_first_match: {
      name: 'Sand i Støvlerne',
      desc: 'Kæmp en ranglistekamp i Askekolosseet, i en af rækkerne.',
    },
    pvp_arena_first_win: {
      name: 'Publikum Brøler',
      desc: 'Vind en ranglistekamp i arenaen, i en af rækkerne.',
    },
    pvp_arena_1v1_1600: {
      name: 'Kolosseets Udfordrer',
      desc: 'Nå 1600 i rating i 1v1-arenarækken.',
    },
    pvp_arena_1v1_1750: { name: 'Kolosseets Rival', desc: 'Nå 1750 i rating i 1v1-arenarækken.' },
    pvp_arena_1v1_1900: {
      name: 'Gladiator',
      desc: 'Nå 1900 i rating i 1v1-arenarækken.',
      title: 'Gladiator',
    },
    pvp_arena_2v2_1600: { name: 'To Mand Høj', desc: 'Nå 1600 i rating i 2v2-arenarækken.' },
    pvp_arena_2v2_1750: { name: 'Frygtet Makkerpar', desc: 'Nå 1750 i rating i 2v2-arenarækken.' },
    pvp_arena_2v2_1900: { name: 'Perfekt Parløb', desc: 'Nå 1900 i rating i 2v2-arenarækken.' },
    pvp_duel_first_win: { name: 'Vi Tager Den Udenfor', desc: 'Vind en duel.' },
    pvp_duel_grace: {
      name: 'En Lektion i Ydmyghed',
      desc: 'Tab en duel med værdigheden nogenlunde i behold.',
    },
    pvp_vcup_first_match: {
      name: 'Støvler på Banen',
      desc: 'Spil en hel Dalpokal-kamp til ende på Somarken, uanset sejr eller nederlag.',
    },
    pvp_vcup_first_win: { name: 'Det Første Sølvtøj', desc: 'Vind en ranglistekamp i Dalpokalen.' },
    pvp_vcup_wins_10: {
      name: 'Garvet Vildsvineboldspiller',
      desc: 'Vind 10 ranglistekampe i Dalpokalen.',
    },
    pvp_vcup_wins_25: {
      name: 'Vildsvinebold-Legende',
      desc: 'Vind 25 ranglistekampe i Dalpokalen.',
      title: 'Vildsvinebold-Legende',
    },
    pvp_vcup_first_goal: { name: 'På Måltavlen', desc: 'Scor et mål i en Dalpokal-ranglistekamp.' },
    pvp_vcup_hat_trick: {
      name: 'Hattrick-Helt',
      desc: 'Scor tre mål i en enkelt Dalpokal-ranglistekamp, i 3v3-rækken eller større.',
    },
    pvp_vcup_golden_goal: {
      name: 'Gyldent Øjeblik',
      desc: 'Scor det gyldne mål, der afgør en Dalpokal-ranglistekamp.',
    },
    pvp_vcup_first_save: {
      name: 'Sikre Hænder',
      desc: 'Red et skud som målmand i en Dalpokal-ranglistekamp.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Intet Slipper Forbi Mig',
      desc: 'Vind en Dalpokal-ranglistekamp som målmand uden at lukke et mål ind.',
    },
    pvp_vcup_guild_win: {
      name: 'For Banneret',
      desc: 'Vind en Dalpokal-ranglistekamp, hvor holdet stillede op under dit gildes banner.',
    },
    pvp_fiesta_first_bout: {
      name: 'Ubuden Gæst',
      desc: 'Kæmp en fuld 2v2 Fiesta-dyst, uanset sejr eller nederlag.',
    },
    pvp_fiesta_first_win: { name: 'Festens Midtpunkt', desc: 'Vind en 2v2 Fiesta-dyst.' },
    pvp_fiesta_double: {
      name: 'Dobbelt Ballade',
      desc: 'Lav to Fiesta-nedlæggelser inden for fire sekunder.',
    },
    pvp_fiesta_shutdown: {
      name: 'Lyseslukker',
      desc: 'Nedlæg en Fiesta-modstander, der er på en stime på tre eller mere.',
    },
    pvp_fiesta_full_build: {
      name: 'Klædt på til Lejligheden',
      desc: 'Vind en Fiesta-dyst med en forstærkning låst fast fra alle tre bølger.',
    },
    pvp_fiesta_powerups: {
      name: 'En af Hver',
      desc: 'Snup hver af de fire power-ups i ringen mindst én gang: Fartdjævel, Kolos, Månestøvler og Bersærk.',
    },
    pvp_fiesta_five_kills: {
      name: 'Bærer Hele Festen',
      desc: 'Lav fem nedlæggelser i en enkelt Fiesta-dyst.',
    },
    soc_first_party: { name: 'Bedre Sammen', desc: 'Slut dig til en gruppe med en anden spiller.' },
    soc_full_house: {
      name: 'Fuldt Hus',
      desc: 'Gennemfør en fangekælder med en fuld gruppe på fem.',
    },
    soc_guild_joined: { name: 'Under Samme Banner', desc: 'Bliv medlem af et gilde.' },
    soc_guild_founded: { name: 'Stifterens Fjerpen', desc: 'Stift dit eget gilde.' },
    soc_first_trade: {
      name: 'En Ærlig Handel',
      desc: 'Gennemfør en byttehandel med en anden spiller.',
    },
    soc_first_sale: {
      name: 'Åbent for Handel',
      desc: 'Indkassér mønterne fra dit første salg på Verdensmarkedet.',
    },
    soc_steady_custom: {
      name: 'Fast Kundekreds',
      desc: 'Indkassér en samlet livstidssum på 10 guld fra dine salg på Verdensmarkedet.',
    },
    soc_market_magnate: {
      name: 'Markedsmagnat',
      desc: 'Indkassér en samlet livstidssum på 100 guld fra dine salg på Verdensmarkedet.',
      title: 'Magnat',
    },
    soc_by_ravens_wing: {
      name: 'På Ravnevinger',
      desc: 'Send et Ravnepost-brev med mønter eller en pakke.',
    },
    soc_room_for_more: { name: 'Plads til Mere', desc: 'Køb din første bankudvidelse.' },
    soc_gilded_strongbox: {
      name: 'Det Forgyldte Pengeskrin',
      desc: 'Køb hver eneste bankudvidelse, som skatmestrene vil sælge dig.',
    },
    soc_meet_bursar: {
      name: 'Fernando Være Lovet',
      desc: 'Vis din ærbødighed for Skatmester Fernando, vogter af Det Forgyldte Pengeskrin i Østbæk.',
    },
    soc_pocket_money: {
      name: 'Lommepenge',
      desc: 'Saml en samlet livstidssum på 1 guld i mønt som bytte.',
    },
    soc_heavy_purse: {
      name: 'Tung Pung',
      desc: 'Saml en samlet livstidssum på 10 guld i mønt som bytte.',
    },
    soc_wyrms_hoard: {
      name: 'En Orms Skat',
      desc: 'Saml en samlet livstidssum på 100 guld i mønt som bytte.',
    },
    soc_civic_duty: { name: 'Borgerpligt', desc: 'Tildel dit første byfokus-point.' },
    exp_long_road_north: {
      name: 'Den Lange Vej mod Nord',
      desc: 'Besøg alle tre hovedbyer: Østbæk, Sumpbroen og Højvagten.',
    },
    exp_vale_wayfarer: {
      name: 'Dalens Vejfarer',
      desc: 'Besøg alle elleve navngivne steder i Østbæk Dal.',
    },
    exp_marsh_wayfarer: {
      name: 'Sumpens Vejfarer',
      desc: 'Besøg alle otte navngivne steder i Mosekær Sump.',
    },
    exp_peaks_wayfarer: {
      name: 'Højdernes Vejfarer',
      desc: 'Besøg alle ti navngivne steder i Tornetop Højder.',
    },
    exp_world_traveler: {
      name: 'Verdensrejsende',
      desc: 'Opnå vejfarer-bedriften i alle tre zoner.',
      title: 'Vejfareren',
    },
    exp_something_shiny: {
      name: 'Noget, der Glimter',
      desc: 'Saml en funklende genstand op fra jorden.',
    },
    exp_first_ore: { name: 'Hak i Klippen', desc: 'Høst din første malmforekomst.' },
    exp_first_timber: { name: 'Træet Falder!', desc: 'Høst din første træforekomst.' },
    exp_first_herb: { name: 'Grønne Fingre', desc: 'Høst din første urteforekomst.' },
    feat_era_cap: {
      name: 'Barn af Den Første Æra',
      desc: 'Nåede niveau 20, mens Den Første Æra stod på.',
    },
    feat_book_complete: {
      name: 'Hele Bogen',
      desc: 'Opnå hver eneste bedrift i Bedrifternes Bog.',
    },
    feat_brightwood_relic: {
      name: 'Til Minde om Lysskoven',
      desc: 'Gem et relikvie fra den gamle Lysskov: Tornehude-Vams eller Monarkens Krone.',
    },
    hid_saul_footnote: {
      name: 'En Fodnote i Historien',
      desc: 'Plagede krønikeskriveren Saul ni gange uden ophold.',
      title: 'Fodnoten',
    },
    hid_gilded_tour: {
      name: 'Den Forgyldte Rundtur',
      desc: 'Gjorde forretninger med alle tre filialer af Det Forgyldte Pengeskrin.',
    },
    hid_fall_death: {
      name: 'Tyngdekraften Vinder Altid',
      desc: 'Døde af en lang samtale med jorden.',
    },
    hid_keepers_toll_twice: {
      name: 'Vogteren Opkræver To Gange',
      desc: 'Døde, mens Vogterens Told stadig tyngede dig.',
    },
    hid_roll_hundred: {
      name: 'Et Rent Hundrede',
      desc: "Slog en perfekt 100'er med et almindeligt /roll.",
    },
    hid_yumi_cheer: {
      name: 'Yumis Største Fan',
      desc: 'Jublede for Yumi midt under en dyst, hvor hun kunne høre dig.',
    },
    hid_bountiful_coffer: {
      name: 'Det Purpurne Skrin',
      desc: 'Knækkede et Gavmildt Skrin, før det nåede at gå i baglås.',
    },
    hid_companion_save: {
      name: 'Ikke på Hendes Vagt',
      desc: 'Din delve-følgesvend halede en falden gruppefælle tilbage på benene.',
    },
    hid_codfather: {
      name: 'Optaget i Familien',
      desc: 'Halede Torskefaderen op af Dybmosens Lavvande.',
    },
    prog_crown_below: {
      name: 'Kronen Dernede',
      desc: "Følg kronen fra de rastløse knoglemarker til Kong Nythraxis' gravkammer, og fuldfør Svøbens Ende.",
    },
    prog_mere_at_rest: {
      name: 'Søen Falder til Ro',
      desc: 'Følg Ondrel Vanes vagt til vejs ende: koret bragt til tavshed, Blegslyngen fældet og den Druknede Måne stedt til hvile.',
    },
    prog_callused_hands: {
      name: 'Barkede Næver',
      desc: 'Fuldfør Et Håndværk til Hver Hånd, og slid dig til din første hårde hud i Østbæks håndværk.',
    },
    prog_tools_of_the_trade: {
      name: 'Fagets Redskaber',
      desc: 'Fuldfør en stationsbunden fremstilling ved håndværkspladsen i Højvagten.',
    },
    dgn_nythraxis_crypt: {
      name: 'Hvad Krypten Gemte',
      desc: 'Vov dig ind i Den Forladte Krypt, og hent begge halvdele af nøglestenen og den ældgamle dagbog fra dens vogtere.',
    },
    chr_marsh_first_cast: { name: 'Ål i Sivene', desc: 'Fang en fisk i Mosekær Sumps vande.' },
  },
  de_DE: {
    prog_first_steps: {
      name: 'Erste Schritte',
      desc: 'Erreiche Stufe 2 und mache den ersten Schritt auf einem langen Weg.',
    },
    prog_finding_your_feet: {
      name: 'Sicherer Tritt',
      desc: 'Erreiche Stufe 5; die Wildnis wirkt schon ein wenig kleiner.',
    },
    prog_double_digits: {
      name: 'Zweistellig',
      desc: 'Erreiche Stufe 10 und schalte deine Talente frei.',
    },
    prog_the_long_middle: { name: 'Die lange Mitte', desc: 'Erreiche Stufe 15.' },
    prog_level_cap: {
      name: 'Der Blick von ganz oben',
      desc: 'Erreiche Stufe 20, die Höchststufe.',
    },
    prog_well_rested: {
      name: 'Gut ausgeruht',
      desc: 'Kehre in einem Gasthaus ein, bis du ausgeruhte Erfahrung verdient hast.',
    },
    prog_talented: {
      name: 'Ein gut angelegter Punkt',
      desc: 'Verteile deinen ersten Talentpunkt.',
    },
    prog_specialized: {
      name: 'Eine klare Ansage',
      desc: 'Wähle eine Spezialisierung und erlerne ihre Signaturfähigkeit.',
    },
    prog_deep_roots: {
      name: 'Tiefe Wurzeln',
      desc: 'Verteile einen Talentpunkt auf ein Talent der letzten Reihe.',
    },
    prog_full_build: {
      name: 'Die volle Elf',
      desc: 'Verteile alle elf Talentpunkte auf eine einzige Skillung.',
    },
    prog_veteran: {
      name: 'Veteran',
      desc: 'Sammle insgesamt 250.000 Erfahrung.',
      title: 'Veteran',
    },
    prog_champion: {
      name: 'Champion',
      desc: 'Sammle insgesamt 500.000 Erfahrung.',
      title: 'Champion',
    },
    prog_paragon: {
      name: 'Paragon',
      desc: 'Sammle insgesamt 1.000.000 Erfahrung.',
      title: 'Paragon',
    },
    prog_mythic: {
      name: 'Mythisch',
      desc: 'Sammle insgesamt 2.500.000 Erfahrung.',
      title: 'Mythisch',
    },
    prog_eternal: { name: 'Ewig', desc: 'Sammle insgesamt 5.000.000 Erfahrung.', title: 'Ewig' },
    prog_prestige: {
      name: 'Noch einmal von vorn',
      desc: 'Erreiche die Höchststufe, fülle den Balken noch einmal und beanspruche Prestigerang 1.',
    },
    prog_prestige_5: { name: 'Alte Gewohnheiten', desc: 'Erreiche Prestigerang 5.' },
    prog_prestige_10: { name: 'Perpetuum mobile', desc: 'Erreiche Prestigerang 10.' },
    prog_first_harvest: { name: 'Früchte des Feldes', desc: 'Ernte dein erstes Sammelvorkommen.' },
    prog_mining_100: { name: 'Erz im Blut', desc: 'Erreiche eine Fertigkeit von 100 im Bergbau.' },
    prog_logging_100: {
      name: 'Kernholzhauer',
      desc: 'Erreiche eine Fertigkeit von 100 in der Holzfällerei.',
    },
    prog_herbalism_100: {
      name: 'Meister der Wiesen',
      desc: 'Erreiche eine Fertigkeit von 100 in der Kräuterkunde.',
    },
    prog_master_gatherer: {
      name: 'Meistersammler',
      desc: 'Erreiche eine Fertigkeit von 100 in Bergbau, Holzfällerei und Kräuterkunde.',
    },
    prog_first_craft: {
      name: 'Handarbeit',
      desc: 'Schließe deine erste erfolgreiche Herstellung ab.',
    },
    prog_craft_specialist: {
      name: 'Betriebsgeheimnisse',
      desc: 'Erreiche eine Fertigkeit von 75 in einem beliebigen Handwerk und schalte dessen Spezialisierungsboni frei.',
    },
    prog_around_the_ring: {
      name: 'Einmal um den Ring',
      desc: 'Erreiche eine Fertigkeit von 25 in fünf verschiedenen Handwerken.',
    },
    cmb_first_blood: { name: 'Erstes Blut', desc: 'Besiege deinen ersten Gegner.' },
    cmb_slayer: { name: 'Schlächter', desc: 'Besiege 1.000 Gegner.' },
    cmb_legion_of_one: { name: 'Eine Legion für sich', desc: 'Besiege 10.000 Gegner.' },
    cmb_heavy_hitter: { name: 'Schwergewicht', desc: 'Richte insgesamt 500.000 Schaden an.' },
    cmb_critical_eye: { name: 'Kritischer Blick', desc: 'Lande 500 kritische Treffer.' },
    cmb_giantslayer: {
      name: 'Riesentöter',
      desc: 'Führe den Todesstoß gegen einen Gegner aus, der mindestens fünf Stufen über dir liegt.',
    },
    cmb_first_fall: {
      name: 'Staub abklopfen',
      desc: 'Stirb zum ersten Mal; das passiert den Besten von uns.',
    },
    dgn_hollow_crypt: {
      name: 'Gruftbrecher',
      desc: 'Besiege Morthen den Gravecaller in der Hohlen Gruft.',
    },
    dgn_sunken_bastion: {
      name: 'Der Fogbinder, entfesselt',
      desc: 'Besiege Vael den Fogbinder in der versunkenen Bastion.',
    },
    dgn_drowned_temple: {
      name: 'Den Mond ertränken',
      desc: 'Besiege Ysolei, Avatar des Ertränkten Mondes, im Ertränkten Tempel.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Der Wyrm in der Tiefe',
      desc: 'Besiege Korzul den Gravewyrm im Gravewyrm-Heiligtum.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Heroisch: Die Hohle Gruft',
      desc: 'Besiege Morthen den Gravecaller in der Hohlen Gruft auf heroischem Schwierigkeitsgrad.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Heroisch: Die versunkene Bastion',
      desc: 'Besiege Vael den Fogbinder in der versunkenen Bastion auf heroischem Schwierigkeitsgrad.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Heroisch: Der Ertränkte Tempel',
      desc: 'Besiege Ysolei, Avatar des Ertränkten Mondes, im Ertränkten Tempel auf heroischem Schwierigkeitsgrad.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Heroisch: Gravewyrm-Heiligtum',
      desc: 'Besiege Korzul den Gravewyrm im Gravewyrm-Heiligtum auf heroischem Schwierigkeitsgrad.',
    },
    dgn_nythraxis: {
      name: 'Die Geißel gebrochen',
      desc: 'Besiege Nythraxis, Geißel von Thornpeak, jenseits der versiegelten königlichen Tür.',
    },
    dgn_nythraxis_heroic: {
      name: 'Heroisch: Die Geißel gebrochen',
      desc: 'Besiege Nythraxis, Geißel von Thornpeak, auf heroischem Schwierigkeitsgrad.',
    },
    dgn_thornpeak_rounds: {
      name: 'Die Runde gemacht',
      desc: 'Säubere die Hohle Gruft, die versunkene Bastion, den Ertränkten Tempel und das Gravewyrm-Heiligtum.',
    },
    dgn_deepward: {
      name: 'Tiefenwacht',
      desc: 'Bezwinge jeden Dungeon, den Schlachtzug und beide Tiefgänge auf heroischem Schwierigkeitsgrad.',
    },
    dgn_mark_circuit: {
      name: 'Der volle Rundgang',
      desc: 'Verdiene an einem einzigen Tag Heroische Marken aus allen vier heroischen Dungeons.',
    },
    dgn_boss_clears_50: { name: 'Fünfzig Türen weiter', desc: 'Besiege 50 Dungeon-Endbosse.' },
    dgn_morthen_flawless: {
      name: 'Ohne Wenn und Knochen',
      desc: 'Besiege Morthen den Gravecaller auf heroischem Schwierigkeitsgrad, ohne dass ein Gruppenmitglied stirbt.',
    },
    dgn_morthen_trio: {
      name: 'Drei gegen das Grab',
      desc: 'Besiege Morthen den Gravecaller mit höchstens drei Spielern.',
    },
    dgn_olen_arc: {
      name: 'Dem Schnitter ausgewichen',
      desc: 'Besiege Ritterkommandant Olen, ohne dass sein Sensenschwung jemand anderen als sein aktuelles Ziel trifft.',
    },
    dgn_vael_thralls: {
      name: 'Niemandes Knecht',
      desc: 'Besiege Vael den Fogbinder, nachdem jeder Ertrunkene Knecht, den er ruft, bereits erschlagen wurde.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Bis zur letzten Mondbrut',
      desc: 'Besiege Ysolei, nachdem jede Mondbrut, die sie ruft, bereits erschlagen wurde.',
    },
    dgn_ysolei_flawless: {
      name: 'Trockenen Auges',
      desc: 'Besiege Ysolei, Avatar des Ertränkten Mondes, auf heroischem Schwierigkeitsgrad, ohne dass ein Gruppenmitglied stirbt.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Bleibt begraben',
      desc: 'Besiege Großnekromant Velkhar und vernichte jeden Erhobenen Knochenläufer, bevor Velkhar fällt.',
    },
    dgn_korzul_flawless: {
      name: 'Wyrmfäller',
      desc: 'Besiege Korzul den Gravewyrm auf heroischem Schwierigkeitsgrad, ohne dass ein Gruppenmitglied stirbt.',
      title: 'Wyrmfäller',
    },
    dgn_sanctum_speed: {
      name: 'Sprint durchs Heiligtum',
      desc: 'Besiege Korzul den Gravewyrm binnen 15 Minuten, nachdem deine Gruppe das Gravewyrm-Heiligtum beansprucht hat.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Knie vor keinem König',
      desc: 'Besiege Nythraxis, ohne dass Grabbrecher je jemand anderen als sein aktuelles Ziel trifft.',
    },
    dgn_nythraxis_wardens: {
      name: 'Hüter der Wachsteine',
      desc: 'Besiege Nythraxis, wobei jeder Todlose Zorn gebrochen wird, bevor er sich entlädt.',
    },
    dgn_nythraxis_deathless: {
      name: 'Niemand ist todloser',
      desc: 'Besiege Nythraxis, Geißel von Thornpeak, auf heroischem Schwierigkeitsgrad, ohne dass ein einziges Schlachtzugsmitglied stirbt.',
      title: 'Todlos',
    },
    cmb_thunzharr: {
      name: 'Der Berg fiel',
      desc: 'Bringe Thunzharr, den Erwachenden Gipfel, bei Stormcrag zu Fall.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Gipfelbrecher',
      desc: 'Bringe Thunzharr, den Erwachenden Gipfel, zu Fall, ohne von deinem ersten Schlag bis zu seinem letzten Atemzug zu sterben.',
      title: 'Gipfelbrecher',
    },
    cmb_thunzharr_ten: {
      name: 'Berge aus Gewohnheit',
      desc: 'Bringe Thunzharr, den Erwachenden Gipfel, zehnmal zu Fall.',
    },
    dlv_reliquary: { name: 'Reliquiarläufer', desc: 'Säubere das Eingestürzte Reliquiar.' },
    dlv_reliquary_heroic: {
      name: 'Heroisch: Das Eingestürzte Reliquiar',
      desc: 'Säubere das Eingestürzte Reliquiar auf heroischer Stufe.',
    },
    dlv_litany: { name: 'Die Litanei verstummt', desc: 'Säubere die Ertrunkene Litanei.' },
    dlv_litany_heroic: {
      name: 'Heroisch: Die Ertrunkene Litanei',
      desc: 'Säubere die Ertrunkene Litanei auf heroischer Stufe.',
    },
    dlv_lore_journal: {
      name: 'Marginalien',
      desc: 'Schalte alle fünf Einträge des Tiefgangsjournals frei.',
    },
    dlv_companion_max: {
      name: 'Eine Freundin in der Tiefe',
      desc: 'Bringe eine Tiefgangsgefährtin auf ihren höchsten Rang.',
    },
    dlv_companions_both: {
      name: 'Beide Laternen entzündet',
      desc: 'Bringe beide Tiefgangsgefährtinnen, Akolythin Tessa und Edda Reedhand, auf ihren höchsten Rang.',
    },
    dlv_clears_50: { name: 'Fünfzig Faden tief', desc: 'Schließe 50 Tiefgangsläufe ab.' },
    dlv_solo_heroic: {
      name: 'Zwei sind ein Heer',
      desc: 'Säubere einen Tiefgang auf heroischer Stufe ohne weitere Spieler, nur du und deine Gefährtin.',
    },
    dlv_tumbler_premium: {
      name: 'Der Pfad der Zuhaltungen, gemeistert',
      desc: 'Öffne eine bannversiegelte Reliquiartruhe beim höchsten Einsatz, makellos in deinem einzigen Versuch.',
    },
    dlv_rite_flawless: {
      name: 'Textsicher',
      desc: 'Schließe den Ritus des Ertrunkenen Reliquiars ohne einen einzigen Fehler ab.',
    },
    dlv_varric_ringers: {
      name: 'Das Geläut verklingt',
      desc: 'Besiege Diakon Varric, während jeder Begräbnisläuter, den er erweckt, bereits erschlagen ist.',
    },
    dlv_nhalia_bells: {
      name: 'Glockenstiller',
      desc: 'Besiege Schwester Nhalia, die Ertrunkene Hymne, ohne dass ein Gruppenmitglied von einer Läutenden Glocke getroffen wird.',
      title: 'Glockenstiller',
    },
    chr_vale_chapter_i: {
      name: 'Talchronik, Kapitel I',
      desc: 'Schließe das erste Kapitel von Sauls Chronik ab: Eastbrooks erste Botengänge, die Lage des Tals und ein erster Vorgeschmack auf seine Gewerke.',
    },
    chr_vale_chapter_ii: {
      name: 'Talchronik, Kapitel II',
      desc: 'Schließe das zweite Kapitel von Sauls Chronik ab: Banditen, Schlammflossen und Minengeziefer erledigt, auf dem Saufeld gespielt und den Abstieg ins Reliquiar gewagt.',
    },
    chr_vale_chapter_iii: {
      name: 'Die Chronik des Tals',
      desc: 'Führe die ganze Geschichte des Tals zu Ende: der Gravecaller entlarvt, die Hohle Gruft gereinigt und jeder namhafte Schrecken des Tals niedergestreckt.',
      title: 'vom Tal',
    },
    chr_vale_gatherer: {
      name: 'Was das Land hergibt',
      desc: 'Ernte im Eastbrook-Tal eine Erzader, ein Gehölz und ein Kräuterbeet.',
    },
    chr_vale_first_cast: {
      name: 'Da ist etwas im Spiegelsee',
      desc: 'Fange einen Fisch aus den Gewässern des Eastbrook-Tals.',
    },
    chr_vale_packbreaker: {
      name: 'Rudelbrecher',
      desc: 'Erlege 3 Waldwölfe innerhalb von 10 Sekunden.',
    },
    chr_vale_cup_debut: {
      name: 'Anwärter auf den Kupfereimer',
      desc: 'Betritt das Feld und berühre den Ball in einem Vale-Cup-Match auf dem Saufeld.',
    },
    chr_vale_rares: {
      name: 'Die Schrecken des Tals',
      desc: 'Erlege die fünf namhaften Schrecken des Eastbrook-Tals: den Alten Greyjaw, Mogger, Grix den Tunnelkönig, Hauptmann Verlan und Maldrec den Geisterbinder.',
    },
    chr_marsh_chapter_i: {
      name: 'Moorchronik, Kapitel I',
      desc: 'Schließe das erste Kapitel von Osric Fenns Chronik ab: dem Musterungsruf von Fenbridge gefolgt, der Damm gesichert und die Gestalt des Fenns erkundet.',
    },
    chr_marsh_chapter_ii: {
      name: 'Moorchronik, Kapitel II',
      desc: 'Schließe das zweite Kapitel von Osric Fenns Chronik ab: die Witwen ausgeräuchert, die Ertrunkenen zur Ruhe gebettet, der Kabeljaupate an Land gezogen und den Abstieg in die Litanei gewagt.',
    },
    chr_marsh_chapter_iii: {
      name: 'Die Chronik des Mirefen',
      desc: 'Führe die ganze Geschichte des Fenns zu Ende: das Kultlager zerschlagen, der Fogbinder in der versunkenen Bastion zum Schweigen gebracht und jeder namhafte Schrecken des Nebels niedergestreckt.',
      title: 'vom Mirefen',
    },
    chr_marsh_gatherer: {
      name: 'Furagieren bei Fenbridge',
      desc: 'Ernte im Mirefen-Moor eine Erzader, ein Gehölz und ein Kräuterbeet.',
    },
    chr_marsh_unburst: {
      name: 'Steh nicht in den Sporen',
      desc: 'Erlege 8 Moor-Aufgedunsene, ohne vom Ausbruch ihrer Ätzenden Sporen erwischt zu werden.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Die Heilung verstummt',
      desc: 'Erlege im Gravecaller-Lager einen Gravecaller-Wundheiler, bevor einer der Kultisten fällt, die er versorgt.',
    },
    chr_marsh_rares: {
      name: 'Namen im Nebel',
      desc: 'Erlege die drei namhaften Schrecken des Mirefen-Moors: Mirejaw den Gefräßigen, Sloomzahn den Ertrunkenen und Schwester Nhalia.',
    },
    chr_peaks_chapter_i: {
      name: 'Gipfelchronik, Kapitel I',
      desc: 'Schließe das erste Kapitel von Zenzies Chronik ab: die Gratstraße geräumt, die Baue geleert und jeden Pfad kennengelernt, den Highwatch bewacht.',
    },
    chr_peaks_chapter_ii: {
      name: 'Gipfelchronik, Kapitel II',
      desc: 'Schließe das zweite Kapitel von Zenzies Chronik ab: Drogmars Kriegslager zerschlagen, den erwachenden Sturm gedeutet und dort gestanden, wo der Glimmermere leuchtet.',
    },
    chr_peaks_chapter_iii: {
      name: 'Die Chronik von Thornpeak',
      desc: 'Führe die ganze Geschichte des Berges zu Ende: der Wyrmkult zerschlagen, das Heiligtum zum Schweigen gebracht, der Erwachende Gipfel gefällt und jeder namhafte Schrecken der Felsen niedergestreckt.',
      title: 'von Thornpeak',
    },
    chr_peaks_sparring: {
      name: 'Drill an der Mauer',
      desc: 'Verursache insgesamt 1.000 Schaden an der Trainingspuppe über Highwatch.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Kaltes Wasser, kälteres Licht',
      desc: 'Fange einen Fisch aus dem Glimmermere.',
    },
    chr_peaks_moongate: {
      name: 'Durch das kalte Tor',
      desc: 'Durchschreite das Mondtor am Ufer des Glimmermere.',
    },
    chr_peaks_waking_witness: {
      name: 'Der Berg, der wandelt',
      desc: 'Erblicke Thunzharr, den Erwachenden Gipfel, während er über den Berg schreitet.',
    },
    chr_peaks_rares: {
      name: 'In den Fels gemeißelte Namen',
      desc: 'Erlege die vier namhaften Schrecken der Thornpeak-Höhen: den Eisenader-Vorarbeiter, Brutok Schädelschmetterer, Voskar Glutschwinge und Marklord Varkas.',
    },
    col_discovery_25: {
      name: 'Hamsterer',
      desc: 'Entdecke 25 verschiedene Gegenstände (ein Gegenstand zählt, wenn er zum ersten Mal in deinen Besitz gelangt).',
    },
    col_discovery_75: { name: 'Elster', desc: 'Entdecke 75 verschiedene Gegenstände.' },
    col_discovery_150: {
      name: 'Wunderkammer',
      desc: 'Entdecke 150 verschiedene Gegenstände.',
      title: 'Kustos',
    },
    col_discovery_250: {
      name: 'Der große Katalog',
      desc: 'Entdecke 250 verschiedene Gegenstände.',
    },
    col_first_rare: {
      name: 'Etwas Blaues',
      desc: 'Erhalte deinen ersten Gegenstand von seltener Qualität.',
    },
    col_first_epic: {
      name: 'Purpurgeboren',
      desc: 'Erhalte deinen ersten Gegenstand von epischer Qualität.',
    },
    col_first_legendary: {
      name: 'Orangenehm überrascht',
      desc: 'Erhalte deinen ersten Gegenstand von legendärer Qualität.',
    },
    col_set_vale_arcanist: {
      name: 'Ornat des Tal-Arkanisten',
      desc: 'Entdecke jedes Teil des Ornats des Tal-Arkanisten.',
    },
    col_set_boundstone_vanguard: {
      name: 'Gebundstein-Vorhut',
      desc: 'Entdecke jedes Teil der Gebundstein-Vorhut.',
    },
    col_set_greyjaw_stalker: {
      name: 'Rüstzeug des Greyjaw-Pirschers',
      desc: 'Entdecke jedes Teil des Rüstzeugs des Greyjaw-Pirschers.',
    },
    col_set_deathlord: {
      name: 'Barrowlord-Kriegsrüstung',
      desc: 'Entdecke jedes Teil der Barrowlord-Kriegsrüstung.',
    },
    col_set_wyrmshadow: {
      name: 'Nightfang-Gewänder',
      desc: 'Entdecke jedes Teil der Nightfang-Gewänder.',
    },
    col_set_necromancers: {
      name: 'Mournweave-Gewandung',
      desc: 'Entdecke jedes Teil der Mournweave-Gewandung.',
    },
    col_set_crownforged: {
      name: 'Bonewrought-Ornat',
      desc: 'Entdecke jedes Teil des Bonewrought-Ornats.',
    },
    col_set_nighttalon: { name: 'Direfang-Pelz', desc: 'Entdecke jedes Teil des Direfang-Pelzes.' },
    col_set_soulflame: {
      name: 'Wraithfire-Ornat',
      desc: 'Entdecke jedes Teil des Wraithfire-Ornats.',
    },
    col_set_stormcallers: {
      name: 'Galecall-Gewänder',
      desc: 'Entdecke jedes Teil der Galecall-Gewänder.',
    },
    col_seven_regalia: {
      name: 'Die siebenfache Garderobe',
      desc: 'Entdecke jedes Teil aller sieben epischen Rüstungsfamilien.',
      title: 'in voller Pracht',
    },
    col_true_colors: {
      name: 'Farbe bekennen',
      desc: 'Zeig dich im Feld mit einem anderen Erscheinungsbild als dem Standard deiner Klasse.',
    },
    col_all_slots: {
      name: 'Aufgebrezelt hoch elf',
      desc: 'Trage gleichzeitig in allen elf Ausrüstungsplätzen einen Gegenstand.',
    },
    col_quartermaster_buyout: {
      name: 'Stammkunde',
      desc: 'Entdecke alle zehn Stücke aus dem Vorrat des Heroischen Quartiermeisters.',
    },
    col_glimmerfin: { name: 'Ein Schimmer Hoffnung', desc: 'Fange einen Schimmerflossen-Koi.' },
    col_full_creel: {
      name: 'Voller Fangkorb',
      desc: 'Entdecke alle sechs gewöhnlichen Fänge aus den Gewässern des Tals, des Moors und der Höhen.',
    },
    col_junk_drawer: {
      name: 'Die Krimskramsschublade',
      desc: 'Entdecke 10 verschiedene Gegenstände von schlechter Qualität.',
    },
    pvp_arena_first_match: {
      name: 'Sand in den Stiefeln',
      desc: 'Bestreite ein gewertetes Match im Aschenkolosseum, gleich in welchem Modus.',
    },
    pvp_arena_first_win: {
      name: 'Die Menge tobt',
      desc: 'Gewinne ein gewertetes Arenamatch, gleich in welchem Modus.',
    },
    pvp_arena_1v1_1600: {
      name: 'Anwärter des Kolosseums',
      desc: 'Erreiche eine Wertung von 1600 im 1v1-Arenamodus.',
    },
    pvp_arena_1v1_1750: {
      name: 'Rivale des Kolosseums',
      desc: 'Erreiche eine Wertung von 1750 im 1v1-Arenamodus.',
    },
    pvp_arena_1v1_1900: {
      name: 'Gladiator',
      desc: 'Erreiche eine Wertung von 1900 im 1v1-Arenamodus.',
      title: 'Gladiator',
    },
    pvp_arena_2v2_1600: {
      name: 'Zu zweit stark',
      desc: 'Erreiche eine Wertung von 1600 im 2v2-Arenamodus.',
    },
    pvp_arena_2v2_1750: {
      name: 'Gefürchtetes Duo',
      desc: 'Erreiche eine Wertung von 1750 im 2v2-Arenamodus.',
    },
    pvp_arena_2v2_1900: {
      name: 'Perfektes Gespann',
      desc: 'Erreiche eine Wertung von 1900 im 2v2-Arenamodus.',
    },
    pvp_duel_first_win: { name: 'Das klären wir draußen', desc: 'Gewinne ein Duell.' },
    pvp_duel_grace: {
      name: 'Eine Lektion in Demut',
      desc: 'Verliere ein Duell und bewahre dabei den Großteil deiner Würde.',
    },
    pvp_vcup_first_match: {
      name: 'Stiefel auf dem Rasen',
      desc: 'Bestreite ein Talpokal-Match auf dem Saufeld bis zum Schlusspfiff, ob Sieg oder Niederlage.',
    },
    pvp_vcup_first_win: { name: 'Der erste Pott', desc: 'Gewinne ein gewertetes Talpokal-Match.' },
    pvp_vcup_wins_10: {
      name: 'Keilerball-Routinier',
      desc: 'Gewinne 10 gewertete Talpokal-Matches.',
    },
    pvp_vcup_wins_25: {
      name: 'Keilerball-Legende',
      desc: 'Gewinne 25 gewertete Talpokal-Matches.',
      title: 'Keilerball-Legende',
    },
    pvp_vcup_first_goal: {
      name: 'Der Bann ist gebrochen',
      desc: 'Erziele ein Tor in einem gewerteten Talpokal-Match.',
    },
    pvp_vcup_hat_trick: {
      name: 'Hattrick-Held',
      desc: 'Erziele drei Tore in einem einzigen gewerteten Talpokal-Match, im 3v3-Modus oder größer.',
    },
    pvp_vcup_golden_goal: {
      name: 'Goldener Moment',
      desc: 'Erziele das Golden Goal, das ein gewertetes Talpokal-Match entscheidet.',
    },
    pvp_vcup_first_save: {
      name: 'Sichere Hände',
      desc: 'Pariere als Torhüter einen Ball in einem gewerteten Talpokal-Match.',
    },
    pvp_vcup_clean_sheet: {
      name: 'An mir kommt keiner vorbei',
      desc: 'Gewinne ein gewertetes Talpokal-Match als Torhüter, ohne ein Tor zu kassieren.',
    },
    pvp_vcup_guild_win: {
      name: 'Für das Banner',
      desc: 'Gewinne ein gewertetes Talpokal-Match, zu dem du unter dem Banner deiner Gilde angetreten bist.',
    },
    pvp_fiesta_first_bout: {
      name: 'Partycrasher',
      desc: 'Bestreite eine volle 2v2-Fiesta-Runde, ob Sieg oder Niederlage.',
    },
    pvp_fiesta_first_win: { name: 'Die Seele der Fiesta', desc: 'Gewinne eine 2v2-Fiesta-Runde.' },
    pvp_fiesta_double: {
      name: 'Doppelter Ärger',
      desc: 'Erziele zwei Fiesta-Niederschläge innerhalb von vier Sekunden.',
    },
    pvp_fiesta_shutdown: {
      name: 'Spielverderber',
      desc: 'Schalte einen Fiesta-Gegner aus, der auf einer Serie von drei oder mehr steht.',
    },
    pvp_fiesta_full_build: {
      name: 'Passend gekleidet',
      desc: 'Gewinne eine Fiesta-Runde mit einer gesicherten Verstärkung aus jeder der drei Wellen.',
    },
    pvp_fiesta_powerups: {
      name: 'Von jedem eins',
      desc: 'Schnapp dir jedes der vier Ring-Power-ups mindestens einmal: Tempoteufel, Koloss, Mondstiefel und Berserker.',
    },
    pvp_fiesta_five_kills: {
      name: 'Partyträger',
      desc: 'Erziele fünf Niederschläge in einer einzigen Fiesta-Runde.',
    },
    soc_first_party: {
      name: 'Gemeinsam stärker',
      desc: 'Schließe dich mit einem anderen Spieler zu einer Gruppe zusammen.',
    },
    soc_full_house: {
      name: 'Volles Haus',
      desc: 'Bezwinge einen Dungeon mit einer vollen Fünfergruppe.',
    },
    soc_guild_joined: { name: 'Unter einem Banner', desc: 'Werde Mitglied einer Gilde.' },
    soc_guild_founded: { name: 'Die Feder des Gründers', desc: 'Gründe deine eigene Gilde.' },
    soc_first_trade: {
      name: 'Ein fairer Handel',
      desc: 'Schließe einen Handel mit einem anderen Spieler ab.',
    },
    soc_first_sale: {
      name: 'Offen für Geschäfte',
      desc: 'Streiche die Münzen aus deinem ersten Verkauf auf dem Weltmarkt ein.',
    },
    soc_steady_custom: {
      name: 'Treue Kundschaft',
      desc: 'Streiche aus deinen Verkäufen auf dem Weltmarkt insgesamt 10 Gold ein.',
    },
    soc_market_magnate: {
      name: 'Marktmagnat',
      desc: 'Streiche aus deinen Verkäufen auf dem Weltmarkt insgesamt 100 Gold ein.',
      title: 'Magnat',
    },
    soc_by_ravens_wing: {
      name: 'Auf Rabenschwingen',
      desc: 'Verschicke einen Rabenpost-Brief mit Münzen oder einem Paket.',
    },
    soc_room_for_more: { name: 'Platz für mehr', desc: 'Kaufe deine erste Bankerweiterung.' },
    soc_gilded_strongbox: {
      name: 'Die Vergoldete Schatulle',
      desc: 'Kaufe jede Bankerweiterung, die die Kämmerer dir verkaufen.',
    },
    soc_meet_bursar: {
      name: 'Auf Fernando ist Verlass',
      desc: 'Erweise Kämmerer Fernando, dem Hüter der Vergoldeten Schatulle in Eastbrook, deine Ehrerbietung.',
    },
    soc_pocket_money: { name: 'Taschengeld', desc: 'Erbeute insgesamt 1 Gold in Münzen.' },
    soc_heavy_purse: { name: 'Ein schwerer Beutel', desc: 'Erbeute insgesamt 10 Gold in Münzen.' },
    soc_wyrms_hoard: {
      name: 'Der Hort eines Wyrms',
      desc: 'Erbeute insgesamt 100 Gold in Münzen.',
    },
    soc_civic_duty: { name: 'Bürgerpflicht', desc: 'Vergib deinen ersten Stadtfokus-Punkt.' },
    exp_long_road_north: {
      name: 'Die lange Straße gen Norden',
      desc: 'Besuche alle drei Hauptorte: Eastbrook, Fenbridge und Highwatch.',
    },
    exp_vale_wayfarer: {
      name: 'Wanderer des Tals',
      desc: 'Besuche alle elf benannten Orte des Eastbrook-Tals.',
    },
    exp_marsh_wayfarer: {
      name: 'Wanderer des Moors',
      desc: 'Besuche alle acht benannten Orte des Mirefen-Moors.',
    },
    exp_peaks_wayfarer: {
      name: 'Wanderer der Höhen',
      desc: 'Besuche alle zehn benannten Orte der Thornpeak-Höhen.',
    },
    exp_world_traveler: {
      name: 'Weltenbummler',
      desc: 'Erringe die Wanderer-Tat aller drei Zonen.',
      title: 'der Wanderer',
    },
    exp_something_shiny: {
      name: 'Etwas Glitzerndes',
      desc: 'Hebe ein funkelndes Objekt vom Boden auf.',
    },
    exp_first_ore: { name: 'Hau in den Fels', desc: 'Baue dein erstes Erzvorkommen ab.' },
    exp_first_timber: { name: 'Baum fällt!', desc: 'Ernte dein erstes Holzvorkommen.' },
    exp_first_herb: { name: 'Ein grüner Daumen', desc: 'Ernte dein erstes Kräutervorkommen.' },
    feat_era_cap: {
      name: 'Kind der Ersten Ära',
      desc: 'Stufe 20 erreicht, als die Erste Ära noch im Gange war.',
    },
    feat_book_complete: { name: 'Das ganze Buch', desc: 'Erringe jede Tat im Buch der Taten.' },
    feat_brightwood_relic: {
      name: 'Hellholz unvergessen',
      desc: 'Bewahre ein Relikt des alten Hellholzes: das Dornhaut-Wams oder die Krone des Monarchen.',
    },
    hid_saul_footnote: {
      name: 'Eine Fußnote der Geschichte',
      desc: 'Saul den Chronisten neunmal ohne Pause belästigt.',
      title: 'die Fußnote',
    },
    hid_gilded_tour: {
      name: 'Die vergoldete Rundreise',
      desc: 'Mit allen drei Filialen der Vergoldeten Schatulle Geschäfte gemacht.',
    },
    hid_fall_death: {
      name: 'Die Schwerkraft gewinnt immer',
      desc: 'An einem langen Zwiegespräch mit dem Boden verstorben.',
    },
    hid_keepers_toll_twice: {
      name: 'Der Hüter kassiert zweimal',
      desc: 'Gestorben, während der Zoll des Hüters noch auf dir lastete.',
    },
    hid_roll_hundred: {
      name: 'Eine glatte Hundert',
      desc: 'Bei einem schlichten /roll eine perfekte 100 gewürfelt.',
    },
    hid_yumi_cheer: {
      name: 'Yumis größter Fan',
      desc: 'Mitten im Kampf für Yumi gejubelt, wo sie dich hören konnte.',
    },
    hid_bountiful_coffer: {
      name: 'Die purpurne Truhe',
      desc: 'Eine Reiche Truhe geknackt, bevor sie sich verklemmen konnte.',
    },
    hid_companion_save: {
      name: 'Nicht, solange sie wacht',
      desc: 'Deine Tiefgang-Gefährtin hat ein gefallenes Gruppenmitglied zurück auf die Beine gehievt.',
    },
    hid_codfather: {
      name: 'In die Familie aufgenommen',
      desc: 'Den Kabeljaupaten aus den Deepfen-Untiefen gezogen.',
    },
    prog_crown_below: {
      name: 'Die Krone in der Tiefe',
      desc: 'Folge der Krone von den ruhelosen Knochenfeldern bis zum Grab von König Nythraxis und führe „Das Ende der Geißel“ zum Abschluss.',
    },
    prog_mere_at_rest: {
      name: 'Stille über dem See',
      desc: 'Begleite Ondrel Vanes Wacht bis zu ihrem Ende: der Chor zum Schweigen gebracht, der Bleichwinder erschlagen und der Ertränkte Mond zur Ruhe gebettet.',
    },
    prog_callused_hands: {
      name: 'Schwielige Hände',
      desc: 'Schließe „Ein Handwerk für jede Hand“ ab und verdiene dir deine erste Schwiele in den Handwerken von Eastbrook.',
    },
    prog_tools_of_the_trade: {
      name: 'Werkzeuge des Handwerks',
      desc: 'Schließe eine an eine Werkstation gebundene Herstellung im Handwerkszentrum von Highwatch ab.',
    },
    dgn_nythraxis_crypt: {
      name: 'Was die Krypta hütete',
      desc: 'Trotze der Verlassenen Krypta und birg beide Hälften des Kryptenschlüssels sowie das Alte Tagebuch von ihren Wächtern.',
    },
    chr_marsh_first_cast: {
      name: 'Aale im Schilf',
      desc: 'Fange einen Fisch aus den Gewässern des Mirefen-Moors.',
    },
  },
  es: {
    prog_first_steps: {
      name: 'Primeros pasos',
      desc: 'Alcanza el nivel 2 y da tu primer paso en un largo camino.',
    },
    prog_finding_your_feet: {
      name: 'Pie firme',
      desc: 'Alcanza el nivel 5; las tierras salvajes ya se ven un poco más pequeñas.',
    },
    prog_double_digits: {
      name: 'Dos dígitos',
      desc: 'Alcanza el nivel 10 y desbloquea tus talentos.',
    },
    prog_the_long_middle: { name: 'El largo trecho', desc: 'Alcanza el nivel 15.' },
    prog_level_cap: {
      name: 'La vista desde la cima',
      desc: 'Alcanza el nivel 20, el nivel máximo.',
    },
    prog_well_rested: {
      name: 'Bien descansado',
      desc: 'Instálate en una posada hasta obtener experiencia de descanso.',
    },
    prog_talented: { name: 'Un punto bien gastado', desc: 'Gasta tu primer punto de talento.' },
    prog_specialized: {
      name: 'Declaración de intenciones',
      desc: 'Elige una especialización y aprende su habilidad distintiva.',
    },
    prog_deep_roots: {
      name: 'Raíces profundas',
      desc: 'Gasta un punto de talento en un talento de la última fila.',
    },
    prog_full_build: {
      name: 'Once de once',
      desc: 'Gasta los once puntos de talento en una sola configuración.',
    },
    prog_veteran: {
      name: 'Veterano',
      desc: 'Acumula 250,000 de experiencia a lo largo de tu vida.',
      title: 'Veterano',
    },
    prog_champion: {
      name: 'Campeón',
      desc: 'Acumula 500,000 de experiencia a lo largo de tu vida.',
      title: 'Campeón',
    },
    prog_paragon: {
      name: 'Parangón',
      desc: 'Acumula 1,000,000 de experiencia a lo largo de tu vida.',
      title: 'Parangón',
    },
    prog_mythic: {
      name: 'Mítico',
      desc: 'Acumula 2,500,000 de experiencia a lo largo de tu vida.',
      title: 'Mítico',
    },
    prog_eternal: {
      name: 'Eterno',
      desc: 'Acumula 5,000,000 de experiencia a lo largo de tu vida.',
      title: 'Eterno',
    },
    prog_prestige: {
      name: 'Volver a empezar',
      desc: 'Alcanza el nivel máximo, llena la barra una vez más y reclama el rango de prestigio 1.',
    },
    prog_prestige_5: { name: 'Viejas costumbres', desc: 'Alcanza el rango de prestigio 5.' },
    prog_prestige_10: { name: 'Movimiento perpetuo', desc: 'Alcanza el rango de prestigio 10.' },
    prog_first_harvest: {
      name: 'Frutos del campo',
      desc: 'Cosecha tu primer nodo de recolección.',
    },
    prog_mining_100: {
      name: 'Mineral en la sangre',
      desc: 'Alcanza 100 de competencia en Minería.',
    },
    prog_logging_100: { name: 'Talador de duramen', desc: 'Alcanza 100 de competencia en Tala.' },
    prog_herbalism_100: {
      name: 'Maestro del prado',
      desc: 'Alcanza 100 de competencia en Herboristería.',
    },
    prog_master_gatherer: {
      name: 'Maestro recolector',
      desc: 'Alcanza 100 de competencia en Minería, Tala y Herboristería.',
    },
    prog_first_craft: { name: 'Hecho a mano', desc: 'Completa con éxito tu primera fabricación.' },
    prog_craft_specialist: {
      name: 'Secretos del oficio',
      desc: 'Alcanza 75 de habilidad en un mismo oficio y desbloquea sus ventajas de especialización.',
    },
    prog_around_the_ring: {
      name: 'La vuelta al anillo',
      desc: 'Alcanza 25 de habilidad en cinco oficios distintos.',
    },
    cmb_first_blood: { name: 'Primera sangre', desc: 'Derrota a tu primer enemigo.' },
    cmb_slayer: { name: 'Matador', desc: 'Derrota a 1,000 enemigos.' },
    cmb_legion_of_one: { name: 'Legión de uno', desc: 'Derrota a 10,000 enemigos.' },
    cmb_heavy_hitter: { name: 'Mano pesada', desc: 'Inflige 500,000 de daño en total.' },
    cmb_critical_eye: { name: 'Ojo crítico', desc: 'Asesta 500 golpes críticos.' },
    cmb_giantslayer: {
      name: 'Matagigantes',
      desc: 'Asesta el golpe mortal a un enemigo al menos cinco niveles por encima del tuyo.',
    },
    cmb_first_fall: {
      name: 'Sacúdete el polvo',
      desc: 'Muere por primera vez; le pasa hasta a los mejores.',
    },
    dgn_hollow_crypt: {
      name: 'Quiebracriptas',
      desc: 'Derrota a Morthen el Gravecaller en la Cripta Hueca.',
    },
    dgn_sunken_bastion: {
      name: 'El Fogbinder desatado',
      desc: 'Derrota a Vael el Fogbinder en el Bastión Sumergido.',
    },
    dgn_drowned_temple: {
      name: 'Ahogar la Luna',
      desc: 'Derrota a Ysolei, Avatar de la Luna Ahogada, en el Templo Ahogado.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'El wyrm de las profundidades',
      desc: 'Derrota a Korzul el Gravewyrm en el Santuario del Gravewyrm.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Heroico: La Cripta Hueca',
      desc: 'Derrota a Morthen el Gravecaller en la Cripta Hueca en dificultad heroica.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Heroico: El Bastión Sumergido',
      desc: 'Derrota a Vael el Fogbinder en el Bastión Sumergido en dificultad heroica.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Heroico: El Templo Ahogado',
      desc: 'Derrota a Ysolei, Avatar de la Luna Ahogada, en el Templo Ahogado en dificultad heroica.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Heroico: Santuario del Gravewyrm',
      desc: 'Derrota a Korzul el Gravewyrm en el Santuario del Gravewyrm en dificultad heroica.',
    },
    dgn_nythraxis: {
      name: 'Azote nunca más',
      desc: 'Derrota a Nythraxis, Azote de Thornpeak, más allá de la puerta real sellada.',
    },
    dgn_nythraxis_heroic: {
      name: 'Heroico: Azote nunca más',
      desc: 'Derrota a Nythraxis, Azote de Thornpeak, en dificultad heroica.',
    },
    dgn_thornpeak_rounds: {
      name: 'Hacer la ronda',
      desc: 'Supera la Cripta Hueca, el Bastión Sumergido, el Templo Ahogado y el Santuario del Gravewyrm.',
    },
    dgn_deepward: {
      name: 'Guarda de las Profundidades',
      desc: 'Conquista cada mazmorra, la banda y las dos expediciones en dificultad heroica.',
    },
    dgn_mark_circuit: {
      name: 'El circuito completo',
      desc: 'Obtén Marcas Heroicas de las cuatro mazmorras heroicas en un solo día.',
    },
    dgn_boss_clears_50: {
      name: 'Cincuenta puertas más abajo',
      desc: 'Derrota a 50 jefes finales de mazmorra.',
    },
    dgn_morthen_flawless: {
      name: 'Sin dejarse los huesos',
      desc: 'Derrota a Morthen el Gravecaller en dificultad heroica sin que muera ningún miembro del grupo.',
    },
    dgn_morthen_trio: {
      name: 'Tres contra la tumba',
      desc: 'Derrota a Morthen el Gravecaller con tres jugadores o menos.',
    },
    dgn_olen_arc: {
      name: 'Esquiva al segador',
      desc: 'Derrota al Caballero comandante Olen sin que su Arco Segador golpee a nadie más que a su objetivo actual.',
    },
    dgn_vael_thralls: {
      name: 'Ningún siervo mío',
      desc: 'Derrota a Vael el Fogbinder con cada Siervo ahogado que convoque ya abatido.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Hasta el último engendro lunar',
      desc: 'Derrota a Ysolei con cada Engendro lunar que convoque ya abatido.',
    },
    dgn_ysolei_flawless: {
      name: 'Ni una lágrima',
      desc: 'Derrota a Ysolei, Avatar de la Luna Ahogada, en dificultad heroica sin que muera ningún miembro del grupo.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Quédense enterrados',
      desc: 'Derrota al Gran nigromante Velkhar con cada Caminahuesos alzado destruido antes de que él caiga.',
    },
    dgn_korzul_flawless: {
      name: 'Matawyrms',
      desc: 'Derrota a Korzul el Gravewyrm en dificultad heroica sin que muera ningún miembro del grupo.',
      title: 'Matawyrms',
    },
    dgn_sanctum_speed: {
      name: 'Carrera por el Santuario',
      desc: 'Derrota a Korzul el Gravewyrm en los 15 minutos siguientes a que tu grupo reclame el Santuario del Gravewyrm.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Ante ningún rey me arrodillo',
      desc: 'Derrota a Nythraxis sin que Quiebratumbas golpee jamás a nadie más que a su objetivo actual.',
    },
    dgn_nythraxis_wardens: {
      name: 'Guardianes de las piedras de guarda',
      desc: 'Derrota a Nythraxis con cada Furia Imperecedera quebrada antes de que llegue a golpear.',
    },
    dgn_nythraxis_deathless: {
      name: 'Nadie más imperecedero',
      desc: 'Derrota a Nythraxis, Azote de Thornpeak, en dificultad heroica sin que muera un solo miembro de la banda.',
      title: 'el Imperecedero',
    },
    cmb_thunzharr: {
      name: 'La montaña cayó',
      desc: 'Derriba a Thunzharr, el Pico Despierto, en Stormcrag.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Quiebrapicos',
      desc: 'Derriba a Thunzharr, el Pico Despierto, sin morir desde tu primer golpe hasta su último aliento.',
      title: 'Quiebrapicos',
    },
    cmb_thunzharr_ten: {
      name: 'Costumbre de montañas',
      desc: 'Derriba a Thunzharr, el Pico Despierto, diez veces.',
    },
    dlv_reliquary: { name: 'Corredor del Relicario', desc: 'Limpia el Relicario Hundido.' },
    dlv_reliquary_heroic: {
      name: 'Heroico: El Relicario Hundido',
      desc: 'Limpia el Relicario Hundido en el nivel Heroico.',
    },
    dlv_litany: { name: 'Acalla la Letanía', desc: 'Limpia la Letanía Ahogada.' },
    dlv_litany_heroic: {
      name: 'Heroico: La Letanía Ahogada',
      desc: 'Limpia la Letanía Ahogada en el nivel Heroico.',
    },
    dlv_lore_journal: {
      name: 'Notas al margen',
      desc: 'Desbloquea las cinco entradas del diario de expedición.',
    },
    dlv_companion_max: {
      name: 'Una amiga en las profundidades',
      desc: 'Lleva a una compañera de expedición a su rango más alto.',
    },
    dlv_companions_both: {
      name: 'Ambas linternas encendidas',
      desc: 'Lleva a las dos compañeras de expedición, la Acólita Tessa y Edda Reedhand, a su rango más alto.',
    },
    dlv_clears_50: { name: 'Cincuenta brazas', desc: 'Completa 50 expediciones.' },
    dlv_solo_heroic: {
      name: 'Dos son multitud',
      desc: 'Limpia una expedición de nivel Heroico sin ningún otro jugador: solo tú y tu compañera.',
    },
    dlv_tumbler_premium: {
      name: 'El camino del cerrojo, dominado',
      desc: 'Abre un cofre protegido del relicario a la apuesta más alta, impecable en tu único intento.',
    },
    dlv_rite_flawless: {
      name: 'Al pie de la letra',
      desc: 'Completa el Rito del Relicario Ahogado sin un solo error.',
    },
    dlv_varric_ringers: {
      name: 'Las campanas enmudecen',
      desc: 'Derrota al Diácono Varric con todos los Campaneros funerarios que alza ya abatidos.',
    },
    dlv_nhalia_bells: {
      name: 'Acallacampanas',
      desc: 'Derrota a la Hermana Nhalia, el Cántico Ahogado, sin que ninguna Campana doliente golpee a ningún miembro del grupo.',
      title: 'Acallacampanas',
    },
    chr_vale_chapter_i: {
      name: 'Crónica del Valle, capítulo I',
      desc: 'Termina el primer capítulo de la crónica de Saul: los primeros encargos de Eastbrook, el trazado del Valle y una primera muestra de sus oficios.',
    },
    chr_vale_chapter_ii: {
      name: 'Crónica del Valle, capítulo II',
      desc: 'Termina el segundo capítulo de la crónica de Saul: bandidos, merodeadores Aletabarro y alimañas de la mina abatidos, un partido disputado en el Sembradal y el Relicario desafiado.',
    },
    chr_vale_chapter_iii: {
      name: 'Crónica del Valle',
      desc: 'Vive la historia del Valle hasta el final: el Gravecaller desenmascarado, la Cripta Hueca purificada y cada terror con nombre del Valle abatido.',
      title: 'del Valle',
    },
    chr_vale_gatherer: {
      name: 'Vivir de la tierra',
      desc: 'Recolecta una veta de mineral, un árbol talable y un macizo de hierbas en el Valle de Eastbrook.',
    },
    chr_vale_first_cast: {
      name: 'Algo en el Lago Espejo',
      desc: 'Pesca un pez en las aguas del Valle de Eastbrook.',
    },
    chr_vale_packbreaker: {
      name: 'Rompemanadas',
      desc: 'Mata 3 Lobos del bosque en un lapso de 10 segundos.',
    },
    chr_vale_cup_debut: {
      name: 'Aspirante al Balde de Cobre',
      desc: 'Salta al campo y toca el balón en un partido de la Copa del Valle en el Sembradal.',
    },
    chr_vale_rares: {
      name: 'Terrores del Valle',
      desc: 'Mata a los cinco terrores con nombre del Valle de Eastbrook: el Viejo Greyjaw, Mogger, Grix el Rey Túnel, el Capitán Verlan y Maldrec el Ataespectros.',
    },
    chr_marsh_chapter_i: {
      name: 'Crónica de la Ciénaga, capítulo I',
      desc: 'Termina el primer capítulo de la crónica de Osric Fenn: responde al alistamiento de Fenbridge, asegura la calzada y aprende la forma del pantano.',
    },
    chr_marsh_chapter_ii: {
      name: 'Crónica de la Ciénaga, capítulo II',
      desc: 'Termina el segundo capítulo de la crónica de Osric Fenn: las viudas expulsadas con fuego, los ahogados devueltos al descanso, el Bacaladrino pescado y la Letanía desafiada.',
    },
    chr_marsh_chapter_iii: {
      name: 'Crónica de Mirefen',
      desc: 'Vive la historia del pantano hasta el final: el campamento del culto destruido, el Fogbinder silenciado en el Bastión Sumergido y cada terror con nombre de la niebla abatido.',
      title: 'de Mirefen',
    },
    chr_marsh_gatherer: {
      name: 'Forrajeo en Fenbridge',
      desc: 'Recolecta una veta de mineral, un árbol talable y un macizo de hierbas en la Ciénaga de Mirefen.',
    },
    chr_marsh_unburst: {
      name: 'No pises las esporas',
      desc: 'Mata 8 Hinchados del pantano sin que te alcance su estallido de Esporas Cáusticas.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Silencia la sanación',
      desc: 'En el campamento Gravecaller, mata a un Sanador Gravecaller antes que a cualquiera de los cultistas que atiende.',
    },
    chr_marsh_rares: {
      name: 'Nombres en la niebla',
      desc: 'Mata a los tres terrores con nombre de la Ciénaga de Mirefen: Mirejaw el Voraz, Sloomtooth el Ahogado y la Hermana Nhalia.',
    },
    chr_peaks_chapter_i: {
      name: 'Crónica de las Alturas, capítulo I',
      desc: 'Termina el primer capítulo de la crónica de Zenzie: despeja el camino de la cresta, vacía las madrigueras y conoce cada senda que guarda Highwatch.',
    },
    chr_peaks_chapter_ii: {
      name: 'Crónica de las Alturas, capítulo II',
      desc: 'Termina el segundo capítulo de la crónica de Zenzie: destruye el campamento de guerra de Drogmar, descifra la tormenta que despierta y planta los pies donde resplandece el Glimmermere.',
    },
    chr_peaks_chapter_iii: {
      name: 'Crónica de Thornpeak',
      desc: 'Vive la historia de la montaña hasta el final: el Culto del Wyrm quebrado, el Santuario silenciado, el Pico Despierto derribado y cada terror con nombre de los riscos abatido.',
      title: 'de Thornpeak',
    },
    chr_peaks_sparring: {
      name: 'Ejercicios de muralla',
      desc: 'Inflige 1000 de daño total al muñeco de entrenamiento sobre Highwatch.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Agua fría, luz más fría',
      desc: 'Pesca un pez en el Glimmermere.',
    },
    chr_peaks_moongate: {
      name: 'A través de la puerta fría',
      desc: 'Cruza la puerta lunar en la orilla del Glimmermere.',
    },
    chr_peaks_waking_witness: {
      name: 'La montaña que camina',
      desc: 'Contempla a Thunzharr, el Pico Despierto, mientras recorre la montaña.',
    },
    chr_peaks_rares: {
      name: 'Nombres tallados en el risco',
      desc: 'Mata a los cuatro terrores con nombre de las Alturas de Thornpeak: el Capataz Vena de Hierro, Brutok Rompecráneos, Voskar Aladebrasa y el Señor de Médula Varkas.',
    },
    col_discovery_25: {
      name: 'Acaparador',
      desc: 'Descubre 25 objetos distintos (un objeto cuenta la primera vez que llega a tu poder).',
    },
    col_discovery_75: { name: 'Urraca', desc: 'Descubre 75 objetos distintos.' },
    col_discovery_150: {
      name: 'Gabinete de curiosidades',
      desc: 'Descubre 150 objetos distintos.',
      title: 'el Curador',
    },
    col_discovery_250: { name: 'El gran catálogo', desc: 'Descubre 250 objetos distintos.' },
    col_first_rare: { name: 'Algo azul', desc: 'Consigue tu primer objeto de calidad rara.' },
    col_first_epic: {
      name: 'Nacido en la púrpura',
      desc: 'Consigue tu primer objeto de calidad épica.',
    },
    col_first_legendary: {
      name: 'Qué naranja suerte',
      desc: 'Consigue tu primer objeto de calidad legendaria.',
    },
    col_set_vale_arcanist: {
      name: 'Vestiduras del Arcanista del Valle',
      desc: 'Descubre cada pieza de las Vestiduras del Arcanista del Valle.',
    },
    col_set_boundstone_vanguard: {
      name: 'Vanguardia Piedravínculo',
      desc: 'Descubre cada pieza de la Vanguardia Piedravínculo.',
    },
    col_set_greyjaw_stalker: {
      name: 'Equipo del acechador de Greyjaw',
      desc: 'Descubre cada pieza del Equipo del acechador de Greyjaw.',
    },
    col_set_deathlord: {
      name: 'Armamento de guerra de Barrowlord',
      desc: 'Descubre cada pieza del Armamento de guerra de Barrowlord.',
    },
    col_set_wyrmshadow: {
      name: 'Vestimentas Nightfang',
      desc: 'Descubre cada pieza de las Vestimentas Nightfang.',
    },
    col_set_necromancers: {
      name: 'Atavío de Mournweave',
      desc: 'Descubre cada pieza del Atavío de Mournweave.',
    },
    col_set_crownforged: {
      name: 'Vestiduras Bonewrought',
      desc: 'Descubre cada pieza de las Vestiduras Bonewrought.',
    },
    col_set_nighttalon: {
      name: 'Pelaje Direfang',
      desc: 'Descubre cada pieza del Pelaje Direfang.',
    },
    col_set_soulflame: {
      name: 'Vestiduras Wraithfire',
      desc: 'Descubre cada pieza de las Vestiduras Wraithfire.',
    },
    col_set_stormcallers: {
      name: 'Vestimentas de Galecall',
      desc: 'Descubre cada pieza de las Vestimentas de Galecall.',
    },
    col_seven_regalia: {
      name: 'El guardarropa séptuple',
      desc: 'Descubre cada pieza de las siete familias de armaduras épicas.',
      title: 'el Resplandeciente',
    },
    col_true_colors: {
      name: 'Tus verdaderos colores',
      desc: 'Salta al campo con cualquier apariencia que no sea la predeterminada de tu clase.',
    },
    col_all_slots: {
      name: 'De punta en blanco, once veces',
      desc: 'Ten un objeto equipado en las once ranuras de equipo al mismo tiempo.',
    },
    col_quartermaster_buyout: {
      name: 'Cliente preferente',
      desc: 'Descubre las diez piezas del inventario del Intendente Vex.',
    },
    col_glimmerfin: {
      name: 'Un destello de esperanza',
      desc: 'Pesca un Koi de aletas brillantes.',
    },
    col_full_creel: {
      name: 'Nasa llena',
      desc: 'Descubre las seis capturas comunes de las aguas del Valle, la Ciénaga y las Alturas.',
    },
    col_junk_drawer: {
      name: 'El cajón de los trastos',
      desc: 'Descubre 10 objetos distintos de calidad pobre.',
    },
    pvp_arena_first_match: {
      name: 'Arena en las botas',
      desc: 'Disputa un combate clasificatorio en el Coliseo Ceniciento, en cualquiera de las dos categorías.',
    },
    pvp_arena_first_win: {
      name: 'La multitud ruge',
      desc: 'Gana un combate clasificatorio de arena en cualquiera de las dos categorías.',
    },
    pvp_arena_1v1_1600: {
      name: 'Aspirante del Coliseo',
      desc: 'Alcanza un índice de 1600 en la categoría 1c1 de la arena.',
    },
    pvp_arena_1v1_1750: {
      name: 'Rival del Coliseo',
      desc: 'Alcanza un índice de 1750 en la categoría 1c1 de la arena.',
    },
    pvp_arena_1v1_1900: {
      name: 'Gladiador',
      desc: 'Alcanza un índice de 1900 en la categoría 1c1 de la arena.',
      title: 'Gladiador',
    },
    pvp_arena_2v2_1600: {
      name: 'Dúo firme',
      desc: 'Alcanza un índice de 1600 en la categoría 2c2 de la arena.',
    },
    pvp_arena_2v2_1750: {
      name: 'Pareja temible',
      desc: 'Alcanza un índice de 1750 en la categoría 2c2 de la arena.',
    },
    pvp_arena_2v2_1900: {
      name: 'Compenetración perfecta',
      desc: 'Alcanza un índice de 1900 en la categoría 2c2 de la arena.',
    },
    pvp_duel_first_win: { name: 'Esto se arregla afuera', desc: 'Gana un duelo.' },
    pvp_duel_grace: {
      name: 'Una lección de humildad',
      desc: 'Pierde un duelo con la dignidad casi intacta.',
    },
    pvp_vcup_first_match: {
      name: 'Botas en la cancha',
      desc: 'Juega un partido completo de la Copa del Valle en el Sembradal, ganes o pierdas.',
    },
    pvp_vcup_first_win: {
      name: 'El primer trofeo',
      desc: 'Gana un partido clasificatorio de la Copa del Valle.',
    },
    pvp_vcup_wins_10: {
      name: 'Balonjabalista curtido',
      desc: 'Gana 10 partidos clasificatorios de la Copa del Valle.',
    },
    pvp_vcup_wins_25: {
      name: 'Leyenda del balonjabalí',
      desc: 'Gana 25 partidos clasificatorios de la Copa del Valle.',
      title: 'Leyenda del balonjabalí',
    },
    pvp_vcup_first_goal: {
      name: 'Estreno goleador',
      desc: 'Anota un gol en un partido clasificatorio de la Copa del Valle.',
    },
    pvp_vcup_hat_trick: {
      name: 'Héroe del triplete',
      desc: 'Anota tres goles en un solo partido clasificatorio de la Copa del Valle, en la categoría 3c3 o superior.',
    },
    pvp_vcup_golden_goal: {
      name: 'Momento de oro',
      desc: 'Anota el gol de oro que decide un partido clasificatorio de la Copa del Valle.',
    },
    pvp_vcup_first_save: {
      name: 'Manos seguras',
      desc: 'Realiza una atajada como guardameta en un partido clasificatorio de la Copa del Valle.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Por aquí no pasa nada',
      desc: 'Gana un partido clasificatorio de la Copa del Valle como guardameta sin recibir ningún gol.',
    },
    pvp_vcup_guild_win: {
      name: 'Por el estandarte',
      desc: 'Gana un partido clasificatorio de la Copa del Valle disputado bajo el estandarte de tu hermandad.',
    },
    pvp_fiesta_first_bout: {
      name: 'Colado en la Fiesta',
      desc: 'Disputa un combate completo de Fiesta 2c2, ganes o pierdas.',
    },
    pvp_fiesta_first_win: { name: 'El alma de la Fiesta', desc: 'Gana un combate de Fiesta 2c2.' },
    pvp_fiesta_double: {
      name: 'Doble problema',
      desc: 'Consigue dos derribos en la Fiesta en un lapso de cuatro segundos.',
    },
    pvp_fiesta_shutdown: {
      name: 'Aguafiestas',
      desc: 'Derriba a un rival de la Fiesta que lleve una racha de tres o más.',
    },
    pvp_fiesta_full_build: {
      name: 'Vestido para la ocasión',
      desc: 'Gana un combate de Fiesta con un aumento fijado de cada una de las tres oleadas.',
    },
    pvp_fiesta_powerups: {
      name: 'Uno de cada',
      desc: 'Recoge al menos una vez cada una de las cuatro mejoras del ring: Demonio Veloz, Coloso, Botas Lunares y Frenético.',
    },
    pvp_fiesta_five_kills: {
      name: 'Cargando con la Fiesta',
      desc: 'Consigue cinco derribos en un solo combate de Fiesta.',
    },
    soc_first_party: { name: 'Mejor acompañados', desc: 'Únete a un grupo con otro jugador.' },
    soc_full_house: {
      name: 'Casa llena',
      desc: 'Supera una mazmorra con un grupo completo de cinco.',
    },
    soc_guild_joined: {
      name: 'Bajo un mismo estandarte',
      desc: 'Conviértete en miembro de una hermandad.',
    },
    soc_guild_founded: { name: 'La pluma fundadora', desc: 'Funda tu propia hermandad.' },
    soc_first_trade: { name: 'Un trato justo', desc: 'Completa un intercambio con otro jugador.' },
    soc_first_sale: {
      name: 'Abierto al público',
      desc: 'Cobra las monedas de tu primera venta en el Mercado Mundial.',
    },
    soc_steady_custom: {
      name: 'Clientela fija',
      desc: 'Cobra un total acumulado de 10 de oro por tus ventas en el Mercado Mundial.',
    },
    soc_market_magnate: {
      name: 'Magnate del mercado',
      desc: 'Cobra un total acumulado de 100 de oro por tus ventas en el Mercado Mundial.',
      title: 'Magnate',
    },
    soc_by_ravens_wing: {
      name: 'En alas del cuervo',
      desc: 'Envía una carta del Correo del Cuervo que lleve monedas o un paquete.',
    },
    soc_room_for_more: { name: 'Sitio para más', desc: 'Compra tu primera ampliación de banco.' },
    soc_gilded_strongbox: {
      name: 'El Arca Dorada',
      desc: 'Compra cada ampliación de banco que los tesoreros estén dispuestos a venderte.',
    },
    soc_meet_bursar: {
      name: 'En Fernando confiamos',
      desc: 'Presenta tus respetos al Tesorero Fernando, custodio del Arca Dorada en Eastbrook.',
    },
    soc_pocket_money: {
      name: 'Dinero de bolsillo',
      desc: 'Saquea un total acumulado de 1 de oro en monedas.',
    },
    soc_heavy_purse: {
      name: 'Bolsa pesada',
      desc: 'Saquea un total acumulado de 10 de oro en monedas.',
    },
    soc_wyrms_hoard: {
      name: 'Un tesoro de wyrm',
      desc: 'Saquea un total acumulado de 100 de oro en monedas.',
    },
    soc_civic_duty: { name: 'Deber cívico', desc: 'Asigna tu primer punto de enfoque del pueblo.' },
    exp_long_road_north: {
      name: 'El largo camino al norte',
      desc: 'Visita los tres asentamientos principales: Eastbrook, Fenbridge y Highwatch.',
    },
    exp_vale_wayfarer: {
      name: 'Caminante del Valle',
      desc: 'Visita los once lugares con nombre del Valle de Eastbrook.',
    },
    exp_marsh_wayfarer: {
      name: 'Caminante de la Ciénaga',
      desc: 'Visita los ocho lugares con nombre de la Ciénaga de Mirefen.',
    },
    exp_peaks_wayfarer: {
      name: 'Caminante de las Alturas',
      desc: 'Visita los diez lugares con nombre de las Alturas de Thornpeak.',
    },
    exp_world_traveler: {
      name: 'Trotamundos',
      desc: 'Consigue la gesta de caminante de las tres zonas.',
      title: 'Caminante',
    },
    exp_something_shiny: { name: 'Algo brillante', desc: 'Recoge un objeto reluciente del suelo.' },
    exp_first_ore: { name: '¡A picar piedra!', desc: 'Recolecta tu primer nodo de mineral.' },
    exp_first_timber: { name: '¡Árbol va!', desc: 'Recolecta tu primer nodo de madera.' },
    exp_first_herb: { name: 'Mano verde', desc: 'Recolecta tu primer nodo de hierbas.' },
    feat_era_cap: {
      name: 'Hijo de la Primera Era',
      desc: 'Alcanzaste el nivel 20 mientras la Primera Era estaba en curso.',
    },
    feat_book_complete: {
      name: 'El libro completo',
      desc: 'Consigue cada gesta del Libro de Gestas.',
    },
    feat_brightwood_relic: {
      name: 'Brightwood en la memoria',
      desc: 'Conserva una reliquia del viejo Brightwood: el Jubón de piel de zarza o la Corona del Monarca.',
    },
    hid_saul_footnote: {
      name: 'Una nota al pie de la historia',
      desc: 'Importunaste a Saul el Cronista nueve veces sin pausa.',
      title: 'Nota al pie',
    },
    hid_gilded_tour: {
      name: 'La gira dorada',
      desc: 'Hiciste negocios con las tres sucursales del Arca Dorada.',
    },
    hid_fall_death: {
      name: 'La gravedad siempre gana',
      desc: 'Moriste tras una larga conversación con el suelo.',
    },
    hid_keepers_toll_twice: {
      name: 'El Guardián cobra dos veces',
      desc: 'Moriste mientras el Tributo del Guardián aún pesaba sobre ti.',
    },
    hid_roll_hundred: {
      name: 'Cien natural',
      desc: 'Sacaste un 100 perfecto en un /roll sin más.',
    },
    hid_yumi_cheer: {
      name: 'Fan número uno de Yumi',
      desc: 'Vitoreaste a Yumi donde podía oírte, en pleno combate.',
    },
    hid_bountiful_coffer: {
      name: 'El cofre púrpura',
      desc: 'Forzaste un Cofre Pródigo antes de que pudiera trabarse.',
    },
    hid_companion_save: {
      name: 'No mientras ella vigile',
      desc: 'Tu compañera de expedición puso de nuevo en pie a un aliado caído.',
    },
    hid_codfather: {
      name: 'Ya eres de la familia',
      desc: 'Sacaste a El Bacaladrino de los Bajíos de Deepfen.',
    },
    prog_crown_below: {
      name: 'La corona de las profundidades',
      desc: 'Sigue la corona desde los campos de huesos inquietos hasta la tumba del rey Nythraxis y lleva El fin del Azote a su término.',
    },
    prog_mere_at_rest: {
      name: 'El lago en reposo',
      desc: 'Acompaña hasta el final la guardia de Ondrel Vane, el Vigía de la Marea: el coro silenciado, la Espiral Pálida abatida y la Luna Ahogada puesta a descansar.',
    },
    prog_callused_hands: {
      name: 'Manos encallecidas',
      desc: 'Completa Un oficio para cada mano y gánate tu primer callo en los oficios de Eastbrook.',
    },
    prog_tools_of_the_trade: {
      name: 'Las herramientas del oficio',
      desc: 'Completa una fabricación ligada a una estación en el centro de artesanía de Highwatch.',
    },
    dgn_nythraxis_crypt: {
      name: 'Lo que guardaba la cripta',
      desc: 'Adéntrate en la Cripta abandonada y recupera de sus guardianes las dos mitades de la piedra clave y el diario antiguo.',
    },
    chr_marsh_first_cast: {
      name: 'Anguilas entre los juncos',
      desc: 'Pesca un pez en las aguas de la Ciénaga de Mirefen.',
    },
  },
  fr_FR: {
    prog_first_steps: {
      name: 'Premiers pas',
      desc: 'Atteignez le niveau 2 et faites votre premier pas sur une longue route.',
    },
    prog_finding_your_feet: {
      name: 'Prendre ses marques',
      desc: 'Atteignez le niveau 5 ; les terres sauvages semblent déjà un peu moins vastes.',
    },
    prog_double_digits: {
      name: 'Deux chiffres',
      desc: 'Atteignez le niveau 10 et débloquez vos talents.',
    },
    prog_the_long_middle: { name: 'Au milieu du gué', desc: 'Atteignez le niveau 15.' },
    prog_level_cap: {
      name: 'La vue depuis le sommet',
      desc: 'Atteignez le niveau 20, le niveau maximum.',
    },
    prog_well_rested: {
      name: 'Bien reposé',
      desc: "Installez-vous dans une auberge jusqu'à avoir gagné de l'expérience de repos.",
    },
    prog_talented: { name: 'Un point bien placé', desc: 'Dépensez votre premier point de talent.' },
    prog_specialized: {
      name: "Déclaration d'intention",
      desc: 'Choisissez une spécialisation et apprenez sa technique emblématique.',
    },
    prog_deep_roots: {
      name: 'Racines profondes',
      desc: 'Dépensez un point de talent dans un talent de la dernière rangée.',
    },
    prog_full_build: {
      name: 'Les onze au complet',
      desc: 'Dépensez vos onze points de talent dans un seul et même build.',
    },
    prog_veteran: {
      name: 'Vétéran',
      desc: "Gagnez 250 000 points d'expérience cumulés.",
      title: 'Vétéran',
    },
    prog_champion: {
      name: 'Champion',
      desc: "Gagnez 500 000 points d'expérience cumulés.",
      title: 'Champion',
    },
    prog_paragon: {
      name: 'Parangon',
      desc: "Gagnez 1 000 000 points d'expérience cumulés.",
      title: 'Parangon',
    },
    prog_mythic: {
      name: 'Mythique',
      desc: "Gagnez 2 500 000 points d'expérience cumulés.",
      title: 'Mythique',
    },
    prog_eternal: {
      name: 'Éternel',
      desc: "Gagnez 5 000 000 points d'expérience cumulés.",
      title: 'Éternel',
    },
    prog_prestige: {
      name: 'Tout recommencer',
      desc: 'Atteignez le niveau maximum, remplissez la barre une fois de plus et réclamez le rang de prestige 1.',
    },
    prog_prestige_5: { name: 'Les vieilles habitudes', desc: 'Atteignez le rang de prestige 5.' },
    prog_prestige_10: { name: 'Mouvement perpétuel', desc: 'Atteignez le rang de prestige 10.' },
    prog_first_harvest: {
      name: 'Les fruits de la terre',
      desc: 'Exploitez votre premier point de récolte.',
    },
    prog_mining_100: {
      name: 'Le minerai dans le sang',
      desc: 'Atteignez 100 points de maîtrise en Minage.',
    },
    prog_logging_100: {
      name: 'Fendeur de bois de cœur',
      desc: 'Atteignez 100 points de maîtrise en Bûcheronnage.',
    },
    prog_herbalism_100: {
      name: 'Maître des prés',
      desc: 'Atteignez 100 points de maîtrise en Herboristerie.',
    },
    prog_master_gatherer: {
      name: 'Maître récolteur',
      desc: 'Atteignez 100 points de maîtrise en Minage, en Bûcheronnage et en Herboristerie.',
    },
    prog_first_craft: { name: 'Fait main', desc: 'Réussissez votre première fabrication.' },
    prog_craft_specialist: {
      name: 'Secrets de métier',
      desc: "Atteignez 75 points de compétence dans un métier d'artisanat et débloquez ses avantages de spécialisation.",
    },
    prog_around_the_ring: {
      name: 'Le tour du cercle',
      desc: "Atteignez 25 points de compétence dans cinq métiers d'artisanat différents.",
    },
    cmb_first_blood: { name: 'Premier sang', desc: 'Vainquez votre premier ennemi.' },
    cmb_slayer: { name: 'Pourfendeur', desc: 'Vainquez 1 000 ennemis.' },
    cmb_legion_of_one: { name: 'Une légion à soi seul', desc: 'Vainquez 10 000 ennemis.' },
    cmb_heavy_hitter: { name: 'Cogneur', desc: 'Infligez 500 000 points de dégâts au total.' },
    cmb_critical_eye: { name: 'Œil critique', desc: 'Portez 500 coups critiques.' },
    cmb_giantslayer: {
      name: 'Tueur de géants',
      desc: "Portez le coup fatal à un ennemi d'au moins cinq niveaux au-dessus du vôtre.",
    },
    cmb_first_fall: {
      name: 'On se relève',
      desc: 'Mourez pour la première fois ; cela arrive même aux meilleurs.',
    },
    dgn_hollow_crypt: {
      name: 'Brise-crypte',
      desc: 'Vainquez Morthen le Gravecaller dans la Crypte creuse.',
    },
    dgn_sunken_bastion: {
      name: 'Le Fogbinder délié',
      desc: 'Vainquez Vael le Fogbinder dans le Bastion englouti.',
    },
    dgn_drowned_temple: {
      name: 'Noyer la Lune',
      desc: 'Vainquez Ysolei, avatar de la Lune noyée, dans le Temple noyé.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Le wyrm des profondeurs',
      desc: 'Vainquez Korzul le Gravewyrm dans le Sanctuaire du Gravewyrm.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Héroïque : la Crypte creuse',
      desc: 'Vainquez Morthen le Gravecaller dans la Crypte creuse en difficulté héroïque.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Héroïque : le Bastion englouti',
      desc: 'Vainquez Vael le Fogbinder dans le Bastion englouti en difficulté héroïque.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Héroïque : le Temple noyé',
      desc: 'Vainquez Ysolei, avatar de la Lune noyée, dans le Temple noyé en difficulté héroïque.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Héroïque : le Sanctuaire du Gravewyrm',
      desc: 'Vainquez Korzul le Gravewyrm dans le Sanctuaire du Gravewyrm en difficulté héroïque.',
    },
    dgn_nythraxis: {
      name: "Le Fléau n'est plus",
      desc: 'Vainquez Nythraxis, Fléau de Thornpeak, au-delà de la porte royale scellée.',
    },
    dgn_nythraxis_heroic: {
      name: "Héroïque : le Fléau n'est plus",
      desc: 'Vainquez Nythraxis, Fléau de Thornpeak, en difficulté héroïque.',
    },
    dgn_thornpeak_rounds: {
      name: 'La grande tournée',
      desc: 'Terminez la Crypte creuse, le Bastion englouti, le Temple noyé et le Sanctuaire du Gravewyrm.',
    },
    dgn_deepward: {
      name: 'Gardien des profondeurs',
      desc: 'Triomphez de chaque donjon, du raid et des deux plongées en difficulté héroïque.',
    },
    dgn_mark_circuit: {
      name: 'Le grand circuit',
      desc: 'Gagnez des Marques héroïques dans les quatre donjons héroïques en une seule journée.',
    },
    dgn_boss_clears_50: {
      name: 'Cinquante portes plus bas',
      desc: 'Vainquez 50 boss de fin de donjon.',
    },
    dgn_morthen_flawless: {
      name: 'Sans tomber sur un os',
      desc: "Vainquez Morthen le Gravecaller en difficulté héroïque sans qu'aucun membre du groupe ne meure.",
    },
    dgn_morthen_trio: {
      name: 'Trois contre la tombe',
      desc: 'Vainquez Morthen le Gravecaller à trois joueurs ou moins.',
    },
    dgn_olen_arc: {
      name: 'Esquiver la faucheuse',
      desc: "Vainquez le chevalier-commandant Olen sans que son Arc faucheur ne touche personne d'autre que sa cible du moment.",
    },
    dgn_vael_thralls: {
      name: 'Serviteur de personne',
      desc: "Vainquez Vael le Fogbinder alors que chaque Serviteur noyé qu'il appelle a déjà été abattu.",
    },
    dgn_ysolei_moonspawn: {
      name: "Jusqu'à la dernière engeance",
      desc: "Vainquez Ysolei alors que chaque Engeance de lune qu'elle appelle a déjà été abattue.",
    },
    dgn_ysolei_flawless: {
      name: 'Les yeux secs',
      desc: "Vainquez Ysolei, avatar de la Lune noyée, en difficulté héroïque sans qu'aucun membre du groupe ne meure.",
    },
    dgn_velkhar_bonewalkers: {
      name: 'Restez enterrés',
      desc: 'Vainquez le grand nécromancien Velkhar en ayant détruit chaque Marche-os relevé avant que Velkhar ne tombe.',
    },
    dgn_korzul_flawless: {
      name: 'Terrasse-wyrm',
      desc: "Vainquez Korzul le Gravewyrm en difficulté héroïque sans qu'aucun membre du groupe ne meure.",
      title: 'Terrasse-wyrm',
    },
    dgn_sanctum_speed: {
      name: 'Sprint du Sanctuaire',
      desc: 'Vainquez Korzul le Gravewyrm dans les 15 minutes suivant la prise du Sanctuaire du Gravewyrm par votre groupe.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Ne plier devant aucun roi',
      desc: "Vainquez Nythraxis sans que Brise-tombe ne frappe personne d'autre que sa cible du moment.",
    },
    dgn_nythraxis_wardens: {
      name: 'Gardiens des pierres de garde',
      desc: "Vainquez Nythraxis en brisant chaque Rage immortelle avant qu'elle ne frappe.",
    },
    dgn_nythraxis_deathless: {
      name: "Nul n'est plus immortel",
      desc: "Vainquez Nythraxis, Fléau de Thornpeak, en difficulté héroïque sans qu'un seul membre du raid ne meure.",
      title: "l'Immortel",
    },
    cmb_thunzharr: {
      name: 'La montagne est tombée',
      desc: 'Terrassez Thunzharr, le Pic Éveillé, à Stormcrag.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Brise-cime',
      desc: "Terrassez Thunzharr, le Pic Éveillé, sans mourir, de votre premier coup jusqu'à son dernier souffle.",
      title: 'Brise-cime',
    },
    cmb_thunzharr_ten: {
      name: "L'habitude des montagnes",
      desc: 'Terrassez Thunzharr, le Pic Éveillé, dix fois.',
    },
    dlv_reliquary: { name: 'Coureur de reliquaire', desc: 'Nettoyer le Reliquaire effondré.' },
    dlv_reliquary_heroic: {
      name: 'Héroïque : Le Reliquaire effondré',
      desc: 'Nettoyer le Reliquaire effondré au palier héroïque.',
    },
    dlv_litany: { name: 'Faire taire la Litanie', desc: 'Nettoyer la Litanie noyée.' },
    dlv_litany_heroic: {
      name: 'Héroïque : La Litanie noyée',
      desc: 'Nettoyer la Litanie noyée au palier héroïque.',
    },
    dlv_lore_journal: {
      name: 'Marginalia',
      desc: 'Débloquer les cinq entrées du journal de plongée.',
    },
    dlv_companion_max: {
      name: 'Une amie des profondeurs',
      desc: 'Hisser une compagne de plongée à son rang le plus élevé.',
    },
    dlv_companions_both: {
      name: 'Deux lanternes allumées',
      desc: "Hisser les deux compagnes de plongée, l'Acolyte Tessa et Edda Reedhand, à leur rang le plus élevé.",
    },
    dlv_clears_50: { name: 'Cinquante brasses', desc: 'Terminer 50 plongées.' },
    dlv_solo_heroic: {
      name: "Deux, c'est déjà trop",
      desc: 'Nettoyer une plongée au palier héroïque sans aucun autre joueur : seulement vous et votre compagne.',
    },
    dlv_tumbler_premium: {
      name: 'La Voie des goupilles, maîtrisée',
      desc: 'Ouvrir un coffre gardé du reliquaire à la mise la plus haute, sans faute, en un seul et unique essai.',
    },
    dlv_rite_flawless: {
      name: 'Au mot près',
      desc: 'Accomplir le Rite du Reliquaire noyé sans la moindre erreur.',
    },
    dlv_varric_ringers: {
      name: 'Les cloches se taisent',
      desc: "Vaincre le Diacre Varric alors que chaque Sonneur funéraire qu'il relève a déjà été abattu.",
    },
    dlv_nhalia_bells: {
      name: 'Étouffe-cloches',
      desc: "Vaincre Sœur Nhalia, le Cantique noyé, sans qu'aucun membre du groupe ne soit frappé par une Cloche du glas.",
      title: 'Étouffe-cloches',
    },
    chr_vale_chapter_i: {
      name: 'Chronique du Val, chapitre I',
      desc: "Terminer le premier chapitre de la chronique de Saul : les premières commissions d'Eastbrook, les contours du Val et un premier goût de ses métiers.",
    },
    chr_vale_chapter_ii: {
      name: 'Chronique du Val, chapitre II',
      desc: 'Terminer le deuxième chapitre de la chronique de Saul : bandits, murlocs et vermine de la mine abattus, un match disputé au Pré de la Truie et le Reliquaire bravé.',
    },
    chr_vale_chapter_iii: {
      name: 'Chronique du Val',
      desc: "Mener l'histoire du Val à son terme : le Gravecaller démasqué, la Crypte creuse purifiée et toutes les terreurs nommées du Val terrassées.",
      title: 'du Val',
    },
    chr_vale_gatherer: {
      name: 'Vivre de la terre',
      desc: "Récolter un filon de minerai, un bosquet de bois et un carré d'herbes dans le Val d'Eastbrook.",
    },
    chr_vale_first_cast: {
      name: 'Quelque chose dans le Lac Miroir',
      desc: "Pêcher un poisson dans les eaux du Val d'Eastbrook.",
    },
    chr_vale_packbreaker: {
      name: 'Brise-meute',
      desc: 'Tuer 3 Loups des bois en moins de 10 secondes.',
    },
    chr_vale_cup_debut: {
      name: 'Prétendant au Seau de cuivre',
      desc: "Entrer sur le terrain et toucher le ballon lors d'un match de Coupe du Val au Pré de la Truie.",
    },
    chr_vale_rares: {
      name: 'Les terreurs du Val',
      desc: "Tuer les cinq terreurs nommées du Val d'Eastbrook : Vieux Greyjaw, Mogger, Grix le Roi des tunnels, Capitaine Verlan et Maldrec le Lie-spectres.",
    },
    chr_marsh_chapter_i: {
      name: 'Chronique du Marais, chapitre I',
      desc: "Terminer le premier chapitre de la chronique d'Osric Fenn : répondre au rassemblement de Fenbridge, sécuriser la chaussée et apprendre les contours du marais.",
    },
    chr_marsh_chapter_ii: {
      name: 'Chronique du Marais, chapitre II',
      desc: "Terminer le deuxième chapitre de la chronique d'Osric Fenn : les veuves délogées par les flammes, les noyés rendus au repos, le Capitaine brochet remonté et la Litanie bravée.",
    },
    chr_marsh_chapter_iii: {
      name: 'Chronique de Mirefen',
      desc: "Mener l'histoire du marais à son terme : le camp du culte démantelé, le Fogbinder réduit au silence dans le Bastion englouti et toutes les terreurs nommées de la brume terrassées.",
      title: 'de Mirefen',
    },
    chr_marsh_gatherer: {
      name: 'Cueillette à Fenbridge',
      desc: "Récolter un filon de minerai, un bosquet de bois et un carré d'herbes dans le Marais de Mirefen.",
    },
    chr_marsh_unburst: {
      name: 'Ne restez pas dans les spores',
      desc: "Tuer 8 Boursouflés du bourbier sans être pris dans l'explosion de leurs Spores caustiques.",
    },
    chr_marsh_hush_the_mending: {
      name: 'Faire taire les soins',
      desc: "Dans le campement Gravecaller, tuer un Soigneur Gravecaller avant le moindre des cultistes qu'il soigne.",
    },
    chr_marsh_rares: {
      name: 'Des noms dans la brume',
      desc: "Tuer les trois terreurs nommées du Marais de Mirefen : Mirejaw l'Affamé, Sloomtooth le Noyé et Sœur Nhalia.",
    },
    chr_peaks_chapter_i: {
      name: 'Chronique des Hauteurs, chapitre I',
      desc: 'Terminer le premier chapitre de la chronique de Zenzie : dégager la route de la crête, vider les terriers et connaître chaque sentier que garde Highwatch.',
    },
    chr_peaks_chapter_ii: {
      name: 'Chronique des Hauteurs, chapitre II',
      desc: "Terminer le deuxième chapitre de la chronique de Zenzie : briser le camp de guerre de Drogmar, lire la tempête qui s'éveille et se tenir là où luit le Glimmermere.",
    },
    chr_peaks_chapter_iii: {
      name: 'Chronique de Thornpeak',
      desc: "Mener l'histoire de la montagne à son terme : le Culte du Wyrm brisé, le Sanctuaire réduit au silence, le Pic Éveillé abattu et toutes les terreurs nommées des falaises terrassées.",
      title: 'de Thornpeak',
    },
    chr_peaks_sparring: {
      name: 'Exercices de rempart',
      desc: "Infliger 1 000 points de dégâts au total au Mannequin d'entraînement qui surplombe Highwatch.",
    },
    chr_peaks_glimmer_cast: {
      name: 'Eau froide, lumière plus froide encore',
      desc: 'Pêcher un poisson dans le Glimmermere.',
    },
    chr_peaks_moongate: {
      name: 'Par la porte froide',
      desc: 'Franchir la porte de lune sur la rive du Glimmermere.',
    },
    chr_peaks_waking_witness: {
      name: 'La montagne qui marche',
      desc: "Poser les yeux sur Thunzharr, le Pic Éveillé, tandis qu'il arpente la montagne.",
    },
    chr_peaks_rares: {
      name: 'Des noms gravés dans le roc',
      desc: 'Tuer les quatre terreurs nommées des Hauteurs de Thornpeak : le Contremaître Veinefer, Brutok Brise-crânes, Voskar Aile-de-braise et le Seigneur de moelle Varkas.',
    },
    col_discovery_25: {
      name: 'Ramasse-tout',
      desc: "Découvrir 25 objets différents (un objet compte la première fois qu'il entre en votre possession).",
    },
    col_discovery_75: { name: 'Pie voleuse', desc: 'Découvrir 75 objets différents.' },
    col_discovery_150: {
      name: 'Cabinet de curiosités',
      desc: 'Découvrir 150 objets différents.',
      title: 'le Conservateur',
    },
    col_discovery_250: { name: 'Le Grand Catalogue', desc: 'Découvrir 250 objets différents.' },
    col_first_rare: {
      name: 'Quelque chose de bleu',
      desc: 'Obtenir votre premier objet de qualité rare.',
    },
    col_first_epic: {
      name: 'Né dans la pourpre',
      desc: 'Obtenir votre premier objet de qualité épique.',
    },
    col_first_legendary: {
      name: "L'orange vous va si bien",
      desc: 'Obtenir votre premier objet de qualité légendaire.',
    },
    col_set_vale_arcanist: {
      name: "Regalia d'arcaniste du Val",
      desc: "Découvrir chaque pièce du Regalia d'arcaniste du Val.",
    },
    col_set_boundstone_vanguard: {
      name: 'Avant-garde de pierre-liée',
      desc: "Découvrir chaque pièce de l'Avant-garde de pierre-liée.",
    },
    col_set_greyjaw_stalker: {
      name: 'Attirail du traqueur de Greyjaw',
      desc: "Découvrir chaque pièce de l'Attirail du traqueur de Greyjaw.",
    },
    col_set_deathlord: {
      name: 'Tenue de combat de Barrowlord',
      desc: 'Découvrir chaque pièce de la Tenue de combat de Barrowlord.',
    },
    col_set_wyrmshadow: {
      name: 'Habits Nightfang',
      desc: 'Découvrir chaque pièce des Habits Nightfang.',
    },
    col_set_necromancers: {
      name: 'Atours de Mournweave',
      desc: 'Découvrir chaque pièce des Atours de Mournweave.',
    },
    col_set_crownforged: {
      name: 'Regalia Bonewrought',
      desc: 'Découvrir chaque pièce du Regalia Bonewrought.',
    },
    col_set_nighttalon: {
      name: 'Pelage de Direfang',
      desc: 'Découvrir chaque pièce du Pelage de Direfang.',
    },
    col_set_soulflame: {
      name: 'Regalia Wraithfire',
      desc: 'Découvrir chaque pièce du Regalia Wraithfire.',
    },
    col_set_stormcallers: {
      name: 'Habits de Galecall',
      desc: 'Découvrir chaque pièce des Habits de Galecall.',
    },
    col_seven_regalia: {
      name: 'La Garde-robe aux sept parures',
      desc: "Découvrir chaque pièce des sept familles d'armures épiques.",
      title: 'le Resplendissant',
    },
    col_true_colors: {
      name: 'Sous ses vraies couleurs',
      desc: 'Entrer en lice avec une apparence autre que celle par défaut de votre classe.',
    },
    col_all_slots: {
      name: 'Sur son trente-et-onze',
      desc: "Porter un objet dans les onze emplacements d'équipement en même temps.",
    },
    col_quartermaster_buyout: {
      name: 'Client privilégié',
      desc: "Découvrir les dix pièces du stock de l'Intendant Vex.",
    },
    col_glimmerfin: {
      name: "Une lueur d'espoir",
      desc: 'Pêcher un Koï aux nageoires scintillantes.',
    },
    col_full_creel: {
      name: 'Bourriche pleine',
      desc: 'Découvrir les six prises communes des eaux du Val, du Marais et des Hauteurs.',
    },
    col_junk_drawer: {
      name: 'Le Tiroir à camelote',
      desc: 'Découvrir 10 objets différents de qualité médiocre.',
    },
    pvp_arena_first_match: {
      name: 'Du sable dans les bottes',
      desc: "Disputez un match classé au Colisée des Cendres, dans l'une ou l'autre catégorie.",
    },
    pvp_arena_first_win: {
      name: 'La foule rugit',
      desc: "Remportez un match d'arène classé, dans l'une ou l'autre catégorie.",
    },
    pvp_arena_1v1_1600: {
      name: 'Prétendant du Colisée',
      desc: "Atteignez une cote de 1600 dans la catégorie d'arène 1v1.",
    },
    pvp_arena_1v1_1750: {
      name: 'Rival du Colisée',
      desc: "Atteignez une cote de 1750 dans la catégorie d'arène 1v1.",
    },
    pvp_arena_1v1_1900: {
      name: 'Gladiateur',
      desc: "Atteignez une cote de 1900 dans la catégorie d'arène 1v1.",
      title: 'Gladiateur',
    },
    pvp_arena_2v2_1600: {
      name: 'Forts à deux',
      desc: "Atteignez une cote de 1600 dans la catégorie d'arène 2v2.",
    },
    pvp_arena_2v2_1750: {
      name: 'Duo redoutable',
      desc: "Atteignez une cote de 1750 dans la catégorie d'arène 2v2.",
    },
    pvp_arena_2v2_1900: {
      name: 'Entente parfaite',
      desc: "Atteignez une cote de 1900 dans la catégorie d'arène 2v2.",
    },
    pvp_duel_first_win: { name: 'On règle ça dehors', desc: 'Remportez un duel.' },
    pvp_duel_grace: {
      name: "Une leçon d'humilité",
      desc: 'Perdez un duel avec votre dignité à peu près intacte.',
    },
    pvp_vcup_first_match: {
      name: 'Crampons sur le pré',
      desc: "Disputez un match de la Coupe du Val jusqu'à son terme au Pré de la Truie, victoire ou défaite.",
    },
    pvp_vcup_first_win: {
      name: 'Premier trophée',
      desc: 'Remportez un match classé de la Coupe du Val.',
    },
    pvp_vcup_wins_10: {
      name: 'Briscard de la balle au sanglier',
      desc: 'Remportez 10 matchs classés de la Coupe du Val.',
    },
    pvp_vcup_wins_25: {
      name: 'Légende de la balle au sanglier',
      desc: 'Remportez 25 matchs classés de la Coupe du Val.',
      title: 'Légende de la balle au sanglier',
    },
    pvp_vcup_first_goal: {
      name: 'Compteur débloqué',
      desc: "Marquez un but lors d'un match classé de la Coupe du Val.",
    },
    pvp_vcup_hat_trick: {
      name: 'Coup du chapeau',
      desc: 'Marquez trois buts dans un même match classé de la Coupe du Val, en catégorie 3v3 ou plus.',
    },
    pvp_vcup_golden_goal: {
      name: 'Instant en or',
      desc: "Marquez le but en or qui décide d'un match classé de la Coupe du Val.",
    },
    pvp_vcup_first_save: {
      name: 'Des mains sûres',
      desc: "Réalisez un arrêt en tant que gardien lors d'un match classé de la Coupe du Val.",
    },
    pvp_vcup_clean_sheet: {
      name: 'Rien ne passe',
      desc: 'Remportez un match classé de la Coupe du Val en tant que gardien sans encaisser de but.',
    },
    pvp_vcup_guild_win: {
      name: 'Pour la bannière',
      desc: 'Remportez un match classé de la Coupe du Val disputé sous la bannière de votre guilde.',
    },
    pvp_fiesta_first_bout: {
      name: "Taper l'incruste",
      desc: "Disputez un combat de Fiesta 2v2 jusqu'au bout, victoire ou défaite.",
    },
    pvp_fiesta_first_win: {
      name: "L'âme de la Fiesta",
      desc: 'Remportez un combat de Fiesta 2v2.',
    },
    pvp_fiesta_double: {
      name: 'Coup double',
      desc: "Réussissez deux mises au tapis en Fiesta en l'espace de quatre secondes.",
    },
    pvp_fiesta_shutdown: {
      name: 'Trouble-fête',
      desc: 'Mettez au tapis un adversaire de Fiesta en pleine série de trois ou plus.',
    },
    pvp_fiesta_full_build: {
      name: 'Sur son trente-et-un',
      desc: 'Remportez un combat de Fiesta avec une amélioration verrouillée à chacune des trois vagues.',
    },
    pvp_fiesta_powerups: {
      name: 'Un de chaque',
      desc: 'Ramassez au moins une fois chacun des quatre bonus du ring : Démon de vitesse, Colosse, Bottes lunaires et Berserker.',
    },
    pvp_fiesta_five_kills: {
      name: 'Toute la fête sur le dos',
      desc: 'Réussissez cinq mises au tapis en un seul combat de Fiesta.',
    },
    soc_first_party: {
      name: "L'union fait la force",
      desc: 'Formez un groupe avec un autre joueur.',
    },
    soc_full_house: {
      name: 'Cinq sur cinq',
      desc: 'Terminez un donjon avec un groupe complet de cinq joueurs.',
    },
    soc_guild_joined: { name: 'Sous une même bannière', desc: "Devenez membre d'une guilde." },
    soc_guild_founded: { name: 'La plume du fondateur', desc: 'Fondez votre propre guilde.' },
    soc_first_trade: {
      name: 'Échange de bons procédés',
      desc: 'Menez à bien un échange avec un autre joueur.',
    },
    soc_first_sale: {
      name: 'Boutique ouverte',
      desc: "Encaissez l'argent de votre première vente au Marché mondial.",
    },
    soc_steady_custom: {
      name: 'Clientèle fidèle',
      desc: "Encaissez un total cumulé de 10 pièces d'or sur vos ventes au Marché mondial.",
    },
    soc_market_magnate: {
      name: 'Magnat du marché',
      desc: "Encaissez un total cumulé de 100 pièces d'or sur vos ventes au Marché mondial.",
      title: 'Magnat',
    },
    soc_by_ravens_wing: {
      name: "À tire-d'aile de corbeau",
      desc: "Envoyez une lettre de la Poste aux corbeaux contenant de l'argent ou un colis.",
    },
    soc_room_for_more: {
      name: 'Encore de la place',
      desc: 'Achetez votre première extension de banque.',
    },
    soc_gilded_strongbox: {
      name: 'Le Coffre doré',
      desc: 'Achetez toutes les extensions de banque que les trésoriers voudront bien vous vendre.',
    },
    soc_meet_bursar: {
      name: 'En Fernando nous croyons',
      desc: 'Présentez vos respects au trésorier Fernando, gardien du Coffre doré à Eastbrook.',
    },
    soc_pocket_money: {
      name: 'Argent de poche',
      desc: "Ramassez un total cumulé de 1 pièce d'or en espèces.",
    },
    soc_heavy_purse: {
      name: 'Bourse bien garnie',
      desc: "Ramassez un total cumulé de 10 pièces d'or en espèces.",
    },
    soc_wyrms_hoard: {
      name: 'Un trésor de wyrm',
      desc: "Ramassez un total cumulé de 100 pièces d'or en espèces.",
    },
    soc_civic_duty: {
      name: 'Devoir civique',
      desc: 'Attribuez votre premier point de priorité de la ville.',
    },
    exp_long_road_north: {
      name: 'La longue route du nord',
      desc: 'Visitez les trois bourgs principaux : Eastbrook, Fenbridge et Highwatch.',
    },
    exp_vale_wayfarer: {
      name: 'Voyageur du Val',
      desc: "Visitez les onze lieux-dits du Val d'Eastbrook.",
    },
    exp_marsh_wayfarer: {
      name: 'Voyageur du Marais',
      desc: 'Visitez les huit lieux-dits du Marais de Mirefen.',
    },
    exp_peaks_wayfarer: {
      name: 'Voyageur des Hauteurs',
      desc: 'Visitez les dix lieux-dits des Hauteurs de Thornpeak.',
    },
    exp_world_traveler: {
      name: 'Grand voyageur',
      desc: 'Obtenez le haut fait de voyageur des trois zones.',
      title: 'le Voyageur',
    },
    exp_something_shiny: {
      name: 'Quelque chose qui brille',
      desc: 'Ramassez un objet scintillant sur le sol.',
    },
    exp_first_ore: {
      name: 'Premier coup de pioche',
      desc: 'Récoltez votre premier filon de minerai.',
    },
    exp_first_timber: { name: 'Ça va tomber !', desc: 'Récoltez votre première coupe de bois.' },
    exp_first_herb: { name: 'La main verte', desc: "Récoltez votre premier plant d'herbes." },
    feat_era_cap: {
      name: 'Enfant de la Première Ère',
      desc: 'A atteint le niveau 20 du temps de la Première Ère.',
    },
    feat_book_complete: {
      name: 'Le Livre entier',
      desc: 'Obtenez chaque haut fait du Livre des hauts faits.',
    },
    feat_brightwood_relic: {
      name: 'En souvenir de Brightwood',
      desc: "Conservez une relique de l'ancienne Brightwood : le Justaucorps en peau de ronces ou la Couronne du Monarque.",
    },
    hid_saul_footnote: {
      name: "Une note de bas de page dans l'Histoire",
      desc: 'A importuné Saul le Chroniqueur neuf fois sans reprendre haleine.',
      title: 'la Note de bas de page',
    },
    hid_gilded_tour: {
      name: 'La tournée dorée',
      desc: 'A fait affaire avec les trois succursales du Coffre doré.',
    },
    hid_fall_death: {
      name: 'La gravité gagne toujours',
      desc: 'A succombé à une longue conversation avec le sol.',
    },
    hid_keepers_toll_twice: {
      name: 'Le Veilleur encaisse deux fois',
      desc: 'A succombé alors que le Tribut du Veilleur pesait encore sur ses épaules.',
    },
    hid_roll_hundred: {
      name: 'Cent naturel',
      desc: 'A obtenu un 100 parfait sur un simple /roll.',
    },
    hid_yumi_cheer: {
      name: 'Fan numéro un de Yumi',
      desc: "A acclamé Yumi assez près pour qu'elle l'entende, en plein combat.",
    },
    hid_bountiful_coffer: {
      name: 'Le Coffre pourpre',
      desc: "A crocheté un Coffre d'abondance avant qu'il ne s'enraye.",
    },
    hid_companion_save: {
      name: "Pas tant qu'elle veille",
      desc: 'Votre compagne de plongée a remis sur pied un coéquipier tombé à terre.',
    },
    hid_codfather: {
      name: 'Bienvenue dans la Famille',
      desc: 'A sorti le Capitaine brochet des Hauts-fonds de Deepfen.',
    },
    prog_crown_below: {
      name: 'La couronne des profondeurs',
      desc: "Suivez la couronne depuis les champs d'ossements agités jusqu'au tombeau du roi Nythraxis et menez « La Fin du Fléau » à son terme.",
    },
    prog_mere_at_rest: {
      name: 'Les eaux apaisées',
      desc: "Accompagnez la garde d'Ondrel Vane, le Veille-marées, jusqu'au bout : le chœur réduit au silence, le Pâlanneau abattu et la Lune noyée rendue au repos.",
    },
    prog_callused_hands: {
      name: 'Mains calleuses',
      desc: "Terminez « Un métier pour chaque main » et gagnez votre première callosité dans les métiers d'Eastbrook.",
    },
    prog_tools_of_the_trade: {
      name: 'Les outils du métier',
      desc: "Réalisez une fabrication exigeant un établi au pôle d'artisanat de Highwatch.",
    },
    dgn_nythraxis_crypt: {
      name: 'Ce que gardait la crypte',
      desc: 'Bravez la Crypte abandonnée et récupérez les deux moitiés de la clef ainsi que le journal ancien auprès de ses gardiens.',
    },
    chr_marsh_first_cast: {
      name: 'Des anguilles dans les roseaux',
      desc: 'Pêcher un poisson dans les eaux du Marais de Mirefen.',
    },
  },
  id_ID: {
    prog_first_steps: {
      name: 'Langkah Pertama',
      desc: 'Capai level 2 dan ayunkan langkah pertamamu di jalan yang masih panjang.',
    },
    prog_finding_your_feet: {
      name: 'Mulai Menapak',
      desc: 'Capai level 5; alam liar sudah terasa sedikit lebih kecil.',
    },
    prog_double_digits: { name: 'Dua Digit', desc: 'Capai level 10 dan buka talentamu.' },
    prog_the_long_middle: { name: 'Jalan Tengah yang Panjang', desc: 'Capai level 15.' },
    prog_level_cap: {
      name: 'Pemandangan dari Puncak',
      desc: 'Capai level 20, batas level tertinggi.',
    },
    prog_well_rested: {
      name: 'Istirahat Cukup',
      desc: 'Beristirahatlah di penginapan hingga kau memperoleh pengalaman istirahat.',
    },
    prog_talented: { name: 'Poin yang Tak Sia-sia', desc: 'Gunakan poin talenta pertamamu.' },
    prog_specialized: {
      name: 'Pernyataan Tekad',
      desc: 'Pilih satu spesialisasi dan pelajari kemampuan khasnya.',
    },
    prog_deep_roots: {
      name: 'Akar yang Dalam',
      desc: 'Gunakan satu poin talenta pada talenta di baris terakhir.',
    },
    prog_full_build: {
      name: 'Sebelas Penuh',
      desc: 'Habiskan seluruh sebelas poin talenta pada satu build.',
    },
    prog_veteran: {
      name: 'Veteran',
      desc: 'Kumpulkan total 250.000 pengalaman sepanjang hayat.',
      title: 'Veteran',
    },
    prog_champion: {
      name: 'Juara',
      desc: 'Kumpulkan total 500.000 pengalaman sepanjang hayat.',
      title: 'Juara',
    },
    prog_paragon: {
      name: 'Teladan',
      desc: 'Kumpulkan total 1.000.000 pengalaman sepanjang hayat.',
      title: 'Teladan',
    },
    prog_mythic: {
      name: 'Mistis',
      desc: 'Kumpulkan total 2.500.000 pengalaman sepanjang hayat.',
      title: 'Mistis',
    },
    prog_eternal: {
      name: 'Abadi',
      desc: 'Kumpulkan total 5.000.000 pengalaman sepanjang hayat.',
      title: 'Abadi',
    },
    prog_prestige: {
      name: 'Mulai Lagi dari Awal',
      desc: 'Capai batas level, penuhi bilah pengalaman sekali lagi, dan raih peringkat prestise 1.',
    },
    prog_prestige_5: { name: 'Kebiasaan Lama', desc: 'Capai peringkat prestise 5.' },
    prog_prestige_10: { name: 'Gerak Abadi', desc: 'Capai peringkat prestise 10.' },
    prog_first_harvest: { name: 'Buah Ladang', desc: 'Panen titik pengumpulan pertamamu.' },
    prog_mining_100: { name: 'Bijih dalam Darah', desc: 'Capai 100 kecakapan Penambangan.' },
    prog_logging_100: { name: 'Penebas Inti Kayu', desc: 'Capai 100 kecakapan Penebangan Kayu.' },
    prog_herbalism_100: { name: 'Penguasa Padang Rumput', desc: 'Capai 100 kecakapan Herbalisme.' },
    prog_master_gatherer: {
      name: 'Pengumpul Ulung',
      desc: 'Capai 100 kecakapan dalam Penambangan, Penebangan Kayu, dan Herbalisme.',
    },
    prog_first_craft: {
      name: 'Buatan Tangan',
      desc: 'Selesaikan hasil kerajinan sukses pertamamu.',
    },
    prog_craft_specialist: {
      name: 'Rahasia Dapur',
      desc: 'Capai 75 keahlian pada satu kerajinan mana pun dan buka bonus spesialisasinya.',
    },
    prog_around_the_ring: {
      name: 'Mengitari Lingkaran',
      desc: 'Capai 25 keahlian pada lima kerajinan yang berbeda.',
    },
    cmb_first_blood: { name: 'Darah Pertama', desc: 'Kalahkan musuh pertamamu.' },
    cmb_slayer: { name: 'Pembantai', desc: 'Kalahkan 1.000 musuh.' },
    cmb_legion_of_one: { name: 'Legiun Seorang Diri', desc: 'Kalahkan 10.000 musuh.' },
    cmb_heavy_hitter: { name: 'Pemukul Kelas Berat', desc: 'Timbulkan total 500.000 kerusakan.' },
    cmb_critical_eye: { name: 'Mata Jeli', desc: 'Daratkan 500 serangan kritis.' },
    cmb_giantslayer: {
      name: 'Penumbang Raksasa',
      desc: 'Daratkan pukulan penghabisan pada musuh yang setidaknya lima level di atasmu.',
    },
    cmb_first_fall: {
      name: 'Tepis Debu, Bangkit Lagi',
      desc: 'Mati untuk pertama kalinya; itu terjadi pada yang terbaik sekalipun.',
    },
    dgn_hollow_crypt: {
      name: 'Pendobrak Kripta',
      desc: 'Kalahkan Morthen sang Pemanggil Kubur di Kripta Berongga.',
    },
    dgn_sunken_bastion: {
      name: 'Ikatan Kabut Terurai',
      desc: 'Kalahkan Vael sang Fogbinder di Benteng Karam.',
    },
    dgn_drowned_temple: {
      name: 'Menenggelamkan Sang Bulan',
      desc: 'Kalahkan Ysolei, Awatara Bulan Tenggelam, di Kuil Tenggelam.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Wyrm di Kedalaman',
      desc: 'Kalahkan Korzul sang Gravewyrm di Sanktum Gravewyrm.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Heroik: Kripta Berongga',
      desc: 'Kalahkan Morthen sang Pemanggil Kubur di Kripta Berongga pada tingkat kesulitan Heroik.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Heroik: Benteng Karam',
      desc: 'Kalahkan Vael sang Fogbinder di Benteng Karam pada tingkat kesulitan Heroik.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Heroik: Kuil Tenggelam',
      desc: 'Kalahkan Ysolei, Awatara Bulan Tenggelam, di Kuil Tenggelam pada tingkat kesulitan Heroik.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Heroik: Sanktum Gravewyrm',
      desc: 'Kalahkan Korzul sang Gravewyrm di Sanktum Gravewyrm pada tingkat kesulitan Heroik.',
    },
    dgn_nythraxis: {
      name: 'Tamatlah Sang Bencana',
      desc: 'Kalahkan Nythraxis, Bencana Thornpeak, di balik pintu kerajaan yang tersegel.',
    },
    dgn_nythraxis_heroic: {
      name: 'Heroik: Tamatlah Sang Bencana',
      desc: 'Kalahkan Nythraxis, Bencana Thornpeak, pada tingkat kesulitan Heroik.',
    },
    dgn_thornpeak_rounds: {
      name: 'Ronda Keliling',
      desc: 'Tuntaskan Kripta Berongga, Benteng Karam, Kuil Tenggelam, dan Sanktum Gravewyrm.',
    },
    dgn_deepward: {
      name: 'Penjaga Kedalaman',
      desc: 'Taklukkan setiap dungeon, raid, dan kedua delve pada tingkat kesulitan Heroik.',
    },
    dgn_mark_circuit: {
      name: 'Sirkuit Penuh',
      desc: 'Dapatkan Tanda Heroik dari keempat dungeon Heroik dalam satu hari yang sama.',
    },
    dgn_boss_clears_50: {
      name: 'Lima Puluh Gerbang Tumbang',
      desc: 'Kalahkan 50 bos pamungkas dungeon.',
    },
    dgn_morthen_flawless: {
      name: 'Tak Sebatang Tulang Patah',
      desc: 'Kalahkan Morthen sang Pemanggil Kubur pada tingkat kesulitan Heroik tanpa satu pun anggota party yang mati.',
    },
    dgn_morthen_trio: {
      name: 'Bertiga Melawan Kubur',
      desc: 'Kalahkan Morthen sang Pemanggil Kubur dengan tiga pemain atau kurang.',
    },
    dgn_olen_arc: {
      name: 'Mengelak dari Sang Penuai',
      desc: 'Kalahkan Komandan Ksatria Olen tanpa Busur Penuai miliknya mengenai siapa pun selain target yang sedang diincarnya.',
    },
    dgn_vael_thralls: {
      name: 'Bukan Budakku',
      desc: 'Kalahkan Vael sang Fogbinder dengan setiap Budak Tenggelam yang dipanggilnya telah tewas lebih dulu.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Tak Satu Anak Bulan Tersisa',
      desc: 'Kalahkan Ysolei dengan setiap Anak Bulan yang dipanggilnya telah tewas lebih dulu.',
    },
    dgn_ysolei_flawless: {
      name: 'Mata yang Kering',
      desc: 'Kalahkan Ysolei, Awatara Bulan Tenggelam, pada tingkat kesulitan Heroik tanpa satu pun anggota party yang mati.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Tetaplah Terkubur',
      desc: 'Kalahkan Nekromancer Agung Velkhar dengan setiap Pejalan Tulang Bangkit dihancurkan sebelum ia tumbang.',
    },
    dgn_korzul_flawless: {
      name: 'Penumbang Wyrm',
      desc: 'Kalahkan Korzul sang Gravewyrm pada tingkat kesulitan Heroik tanpa satu pun anggota party yang mati.',
      title: 'Penumbang Wyrm',
    },
    dgn_sanctum_speed: {
      name: 'Lari Kencang Sanktum',
      desc: 'Kalahkan Korzul sang Gravewyrm dalam 15 menit sejak party-mu mengklaim Sanktum Gravewyrm.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Tak Bertekuk Lutut pada Raja',
      desc: 'Kalahkan Nythraxis tanpa Pembelah Kubur mengenai siapa pun selain target yang sedang diincarnya.',
    },
    dgn_nythraxis_wardens: {
      name: 'Penjaga Batu Penangkal',
      desc: 'Kalahkan Nythraxis dengan setiap Amukan Nirmaut dipatahkan sebelum sempat menghantam.',
    },
    dgn_nythraxis_deathless: {
      name: 'Tiada yang Lebih Nirmaut',
      desc: 'Kalahkan Nythraxis, Bencana Thornpeak, pada tingkat kesulitan Heroik tanpa satu pun anggota raid yang mati.',
      title: 'sang Nirmaut',
    },
    cmb_thunzharr: {
      name: 'Gunung pun Tumbang',
      desc: 'Tumbangkan Thunzharr, Puncak yang Terjaga, di Stormcrag.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Pemecah Puncak',
      desc: 'Tumbangkan Thunzharr, Puncak yang Terjaga, tanpa mati sejak pukulan pertamamu hingga napas terakhirnya.',
      title: 'Pemecah Puncak',
    },
    cmb_thunzharr_ten: {
      name: 'Kebiasaan Menumbangkan Gunung',
      desc: 'Tumbangkan Thunzharr, Puncak yang Terjaga, sepuluh kali.',
    },
    dlv_reliquary: { name: 'Pelari Reliquary', desc: 'Tuntaskan Reliquary yang Runtuh.' },
    dlv_reliquary_heroic: {
      name: 'Heroik: Reliquary yang Runtuh',
      desc: 'Tuntaskan Reliquary yang Runtuh pada tingkat Heroik.',
    },
    dlv_litany: { name: 'Bungkam Litani', desc: 'Tuntaskan Litani Tenggelam.' },
    dlv_litany_heroic: {
      name: 'Heroik: Litani Tenggelam',
      desc: 'Tuntaskan Litani Tenggelam pada tingkat Heroik.',
    },
    dlv_lore_journal: { name: 'Catatan Pinggir', desc: 'Buka kelima entri jurnal delve.' },
    dlv_companion_max: {
      name: 'Sahabat di Kedalaman',
      desc: 'Naikkan seorang pendamping delve hingga pangkat tertingginya.',
    },
    dlv_companions_both: {
      name: 'Dua Lentera Menyala',
      desc: 'Naikkan kedua pendamping delve, Akolit Tessa dan Edda Reedhand, hingga pangkat tertinggi mereka.',
    },
    dlv_clears_50: { name: 'Lima Puluh Depa', desc: 'Tuntaskan 50 penjelajahan delve.' },
    dlv_solo_heroic: {
      name: 'Berdua Saja Sudah Ramai',
      desc: 'Tuntaskan sebuah delve tingkat Heroik tanpa pemain lain, hanya kau dan pendampingmu.',
    },
    dlv_tumbler_premium: {
      name: 'Jalan Sang Pembuka Kunci, Paripurna',
      desc: 'Buka sebuah peti relikuari bersegel pelindung pada taruhan tertinggi, mulus pada satu-satunya percobaanmu.',
    },
    dlv_rite_flawless: {
      name: 'Hafal Kata demi Kata',
      desc: 'Selesaikan Ritus Relikuari Tenggelam tanpa satu pun kesalahan.',
    },
    dlv_varric_ringers: {
      name: 'Lonceng-Lonceng Terdiam',
      desc: 'Kalahkan Diaken Varric dengan setiap Pembunyi Lonceng Pemakaman yang ia bangkitkan telah tewas lebih dulu.',
    },
    dlv_nhalia_bells: {
      name: 'Peredam Lonceng',
      desc: 'Kalahkan Suster Nhalia, Sang Kidung Tenggelam, tanpa satu pun anggota party terkena hantaman Lonceng Berdentang.',
      title: 'Peredam Lonceng',
    },
    chr_vale_chapter_i: {
      name: 'Kronik Lembah, Bab I',
      desc: 'Selesaikan bab pertama kronik Saul: tugas-tugas pembuka Eastbrook, seluk-beluk Lembah, dan cicipan pertama kerajinannya.',
    },
    chr_vale_chapter_ii: {
      name: 'Kronik Lembah, Bab II',
      desc: 'Selesaikan bab kedua kronik Saul: bandit, murloc, dan hama tambang ditumpas, laga di Sowfield dimainkan, dan Reliquary dijajal.',
    },
    chr_vale_chapter_iii: {
      name: 'Kronik Sang Lembah',
      desc: 'Tuntaskan seluruh kisah Lembah: kedok sang Pemanggil Kubur terbongkar, Kripta Berongga disucikan, dan setiap teror bernama di Lembah ditumbangkan.',
      title: 'dari Lembah',
    },
    chr_vale_gatherer: {
      name: 'Hidup dari Hasil Bumi',
      desc: 'Panen satu urat bijih, satu tegakan kayu, dan satu petak herba di Lembah Eastbrook.',
    },
    chr_vale_first_cast: {
      name: 'Ada Sesuatu di Danau Cermin',
      desc: 'Pancing seekor ikan dari perairan Lembah Eastbrook.',
    },
    chr_vale_packbreaker: {
      name: 'Pemecah Kawanan',
      desc: 'Bantai 3 Serigala Hutan dalam waktu 10 detik.',
    },
    chr_vale_cup_debut: {
      name: 'Penantang Ember Tembaga',
      desc: 'Turun ke lapangan dan sentuh bola dalam sebuah pertandingan Piala Lembah di Sowfield.',
    },
    chr_vale_rares: {
      name: 'Teror-Teror Lembah',
      desc: 'Bantai lima teror bernama di Lembah Eastbrook: Greyjaw Tua, Mogger, Grix sang Raja Terowongan, Kapten Verlan, dan Pengikat Arwah Maldrec.',
    },
    chr_marsh_chapter_i: {
      name: 'Kronik Rawa, Bab I',
      desc: 'Selesaikan bab pertama kronik Osric Fenn: penuhi panggilan mobilisasi Jembatan Rawa, amankan jalan lintasnya, dan kenali seluk-beluk rawa.',
    },
    chr_marsh_chapter_ii: {
      name: 'Kronik Rawa, Bab II',
      desc: 'Selesaikan bab kedua kronik Osric Fenn: sarang para janda dibakar habis, kaum tenggelam dibaringkan dalam damai, Sang Bapak Kod didaratkan, dan Litani dijajal.',
    },
    chr_marsh_chapter_iii: {
      name: 'Kronik Mirefen',
      desc: 'Tuntaskan seluruh kisah rawa: perkemahan sekte diporak-porandakan, sang Fogbinder dibungkam di Benteng Karam, dan setiap teror bernama di dalam kabut ditumbangkan.',
      title: 'dari Mirefen',
    },
    chr_marsh_gatherer: {
      name: 'Meramban di Jembatan Rawa',
      desc: 'Panen satu urat bijih, satu tegakan kayu, dan satu petak herba di Rawa Mirefen.',
    },
    chr_marsh_unburst: {
      name: 'Jangan Berdiri di Dalam Spora',
      desc: 'Bantai 8 Kembung Rawa tanpa terkena ledakan Spora Kaustik mereka.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Bungkam Sang Penambal',
      desc: 'Di Perkemahan Gravecaller, bantai seorang Penambal Pemanggil Kubur sebelum satu pun kultis yang dirawatnya tumbang.',
    },
    chr_marsh_rares: {
      name: 'Nama-Nama dalam Kabut',
      desc: 'Bantai tiga teror bernama di Rawa Mirefen: Mirejaw sang Rakus, Sloomtooth sang Tenggelam, dan Suster Nhalia.',
    },
    chr_peaks_chapter_i: {
      name: 'Kronik Puncak, Bab I',
      desc: 'Selesaikan bab pertama kronik Zenzie: bersihkan jalan punggung bukit, kosongkan liang-liang, dan kenali setiap jalur yang dijaga Menara Pengawas.',
    },
    chr_peaks_chapter_ii: {
      name: 'Kronik Puncak, Bab II',
      desc: 'Selesaikan bab kedua kronik Zenzie: hancurkan Kemah Perang Drogmar, baca tanda-tanda badai yang terjaga, dan berdirilah di tempat Glimmermere berpendar.',
    },
    chr_peaks_chapter_iii: {
      name: 'Kronik Thornpeak',
      desc: 'Tuntaskan seluruh kisah gunung: Wyrmcult dihancurkan, Sanktum dibungkam, sang Puncak yang Terjaga dirobohkan, dan setiap teror bernama di tebing-tebing ditumbangkan.',
      title: 'dari Thornpeak',
    },
    chr_peaks_sparring: {
      name: 'Latihan Tembok',
      desc: 'Berikan total 1.000 kerusakan pada Boneka Latihan di atas Menara Pengawas.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Air Dingin, Cahaya Lebih Dingin',
      desc: 'Pancing seekor ikan dari Glimmermere.',
    },
    chr_peaks_moongate: {
      name: 'Melewati Gerbang Dingin',
      desc: 'Melangkahlah melewati gerbang bulan di tepian Glimmermere.',
    },
    chr_peaks_waking_witness: {
      name: 'Gunung yang Berjalan',
      desc: 'Saksikan Thunzharr, Puncak yang Terjaga, saat ia melangkah di gunung.',
    },
    chr_peaks_rares: {
      name: 'Nama Terpahat di Tebing',
      desc: 'Bantai empat teror bernama di Dataran Tinggi Thornpeak: Mandor Ironvein, Brutok Penghancur Tengkorak, Voskar sang Sayap Bara, dan Tuan Sumsum Varkas.',
    },
    col_discovery_25: {
      name: 'Tukang Timbun',
      desc: 'Temukan 25 barang berbeda (sebuah barang terhitung saat pertama kali masuk ke dalam kepemilikanmu).',
    },
    col_discovery_75: { name: 'Pemburu Kilauan', desc: 'Temukan 75 barang berbeda.' },
    col_discovery_150: {
      name: 'Lemari Keajaiban',
      desc: 'Temukan 150 barang berbeda.',
      title: 'sang Kurator',
    },
    col_discovery_250: { name: 'Katalog Agung', desc: 'Temukan 250 barang berbeda.' },
    col_first_rare: {
      name: 'Sesuatu yang Biru',
      desc: 'Dapatkan barang pertamamu yang berkualitas langka.',
    },
    col_first_epic: {
      name: 'Berdarah Ungu',
      desc: 'Dapatkan barang pertamamu yang berkualitas epik.',
    },
    col_first_legendary: {
      name: 'Rezeki Jingga',
      desc: 'Dapatkan barang pertamamu yang berkualitas legendaris.',
    },
    col_set_vale_arcanist: {
      name: 'Regalia Arkanis Lembah',
      desc: 'Temukan setiap bagian dari Regalia Arkanis Lembah.',
    },
    col_set_boundstone_vanguard: {
      name: 'Garda Depan Batu Terikat',
      desc: 'Temukan setiap bagian dari Garda Depan Batu Terikat.',
    },
    col_set_greyjaw_stalker: {
      name: 'Perlengkapan Pengintai Greyjaw',
      desc: 'Temukan setiap bagian dari Perlengkapan Pengintai Greyjaw.',
    },
    col_set_deathlord: {
      name: 'Perlengkapan Tempur Barrowlord',
      desc: 'Temukan setiap bagian dari Perlengkapan Tempur Barrowlord.',
    },
    col_set_wyrmshadow: {
      name: 'Jubah Nightfang',
      desc: 'Temukan setiap bagian dari Jubah Nightfang.',
    },
    col_set_necromancers: {
      name: 'Busana Mournweave',
      desc: 'Temukan setiap bagian dari Busana Mournweave.',
    },
    col_set_crownforged: {
      name: 'Regalia Bonewrought',
      desc: 'Temukan setiap bagian dari Regalia Bonewrought.',
    },
    col_set_nighttalon: {
      name: 'Bulu Direfang',
      desc: 'Temukan setiap bagian dari Bulu Direfang.',
    },
    col_set_soulflame: {
      name: 'Regalia Wraithfire',
      desc: 'Temukan setiap bagian dari Regalia Wraithfire.',
    },
    col_set_stormcallers: {
      name: 'Jubah Galecall',
      desc: 'Temukan setiap bagian dari Jubah Galecall.',
    },
    col_seven_regalia: {
      name: 'Lemari Busana Tujuh Rupa',
      desc: 'Temukan setiap bagian dari ketujuh keluarga zirah epik.',
      title: 'yang Gemilang',
    },
    col_true_colors: {
      name: 'Warna Sejati',
      desc: 'Turun ke lapangan mengenakan tampilan apa pun selain tampilan bawaan kelasmu.',
    },
    col_all_slots: {
      name: 'Necis Sebelas Slot',
      desc: 'Kenakan barang di kesebelas slot perlengkapan pada saat yang sama.',
    },
    col_quartermaster_buyout: {
      name: 'Pelanggan Kesayangan',
      desc: 'Temukan kesepuluh barang dagangan Kepala Perbekalan Vex.',
    },
    col_glimmerfin: { name: 'Kilau Harapan', desc: 'Pancing seekor Koi Sirip Kilau.' },
    col_full_creel: {
      name: 'Keranjang Ikan Penuh',
      desc: 'Temukan keenam tangkapan umum dari perairan Lembah, Rawa, dan Dataran Tinggi.',
    },
    col_junk_drawer: {
      name: 'Laci Rongsokan',
      desc: 'Temukan 10 barang berbeda yang berkualitas buruk.',
    },
    pvp_arena_first_match: {
      name: 'Pasir di Sepatu Bot',
      desc: 'Bertarunglah dalam satu pertandingan berperingkat di Koliseum Abu, di divisi mana pun.',
    },
    pvp_arena_first_win: {
      name: 'Gemuruh Penonton',
      desc: 'Menangkan satu pertandingan arena berperingkat di divisi mana pun.',
    },
    pvp_arena_1v1_1600: {
      name: 'Penantang Koliseum',
      desc: 'Capai rating 1600 di divisi arena 1v1.',
    },
    pvp_arena_1v1_1750: { name: 'Rival Koliseum', desc: 'Capai rating 1750 di divisi arena 1v1.' },
    pvp_arena_1v1_1900: {
      name: 'Gladiator',
      desc: 'Capai rating 1900 di divisi arena 1v1.',
      title: 'Gladiator',
    },
    pvp_arena_2v2_1600: { name: 'Kuat Berdua', desc: 'Capai rating 1600 di divisi arena 2v2.' },
    pvp_arena_2v2_1750: { name: 'Duet Maut', desc: 'Capai rating 1750 di divisi arena 2v2.' },
    pvp_arena_2v2_1900: {
      name: 'Kemitraan Sempurna',
      desc: 'Capai rating 1900 di divisi arena 2v2.',
    },
    pvp_duel_first_win: { name: 'Selesaikan di Luar', desc: 'Menangkan sebuah duel.' },
    pvp_duel_grace: {
      name: 'Pelajaran Kerendahan Hati',
      desc: 'Kalah dalam duel dengan martabat yang sebagian besar masih utuh.',
    },
    pvp_vcup_first_match: {
      name: 'Turun ke Lapangan',
      desc: 'Selesaikan satu pertandingan Piala Lembah secara penuh di Sowfield, menang ataupun kalah.',
    },
    pvp_vcup_first_win: {
      name: 'Trofi Pertama',
      desc: 'Menangkan satu pertandingan Piala Lembah berperingkat.',
    },
    pvp_vcup_wins_10: {
      name: 'Pebola Babi Hutan Kawakan',
      desc: 'Menangkan 10 pertandingan Piala Lembah berperingkat.',
    },
    pvp_vcup_wins_25: {
      name: 'Legenda Bola Babi Hutan',
      desc: 'Menangkan 25 pertandingan Piala Lembah berperingkat.',
      title: 'Legenda Bola Babi Hutan',
    },
    pvp_vcup_first_goal: {
      name: 'Pecah Telur',
      desc: 'Cetak satu gol dalam pertandingan Piala Lembah berperingkat.',
    },
    pvp_vcup_hat_trick: {
      name: 'Pahlawan Hat-trick',
      desc: 'Cetak tiga gol dalam satu pertandingan Piala Lembah berperingkat, di divisi 3v3 atau lebih besar.',
    },
    pvp_vcup_golden_goal: {
      name: 'Momen Emas',
      desc: 'Cetak gol emas yang menentukan hasil sebuah pertandingan Piala Lembah berperingkat.',
    },
    pvp_vcup_first_save: {
      name: 'Tangan Andal',
      desc: 'Lakukan satu penyelamatan sebagai kiper dalam pertandingan Piala Lembah berperingkat.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Tak Satu Pun Lolos',
      desc: 'Menangkan pertandingan Piala Lembah berperingkat sebagai kiper tanpa kebobolan satu gol pun.',
    },
    pvp_vcup_guild_win: {
      name: 'Demi Sang Panji',
      desc: 'Menangkan pertandingan Piala Lembah berperingkat yang diikuti di bawah panji guild-mu.',
    },
    pvp_fiesta_first_bout: {
      name: 'Penyusup Pesta',
      desc: 'Bertarunglah dalam satu laga Fiesta 2v2 secara penuh, menang ataupun kalah.',
    },
    pvp_fiesta_first_win: { name: 'Bintang Fiesta', desc: 'Menangkan satu laga Fiesta 2v2.' },
    pvp_fiesta_double: {
      name: 'Sekali Dayung, Dua Tumbang',
      desc: 'Robohkan dua lawan Fiesta dalam rentang empat detik.',
    },
    pvp_fiesta_shutdown: {
      name: 'Perusak Pesta',
      desc: 'Robohkan lawan Fiesta yang tengah berada dalam rentetan tiga atau lebih.',
    },
    pvp_fiesta_full_build: {
      name: 'Berdandan untuk Pesta',
      desc: 'Menangkan laga Fiesta dengan augmen terkunci dari ketiga gelombang.',
    },
    pvp_fiesta_powerups: {
      name: 'Cicipi Semuanya',
      desc: 'Ambil masing-masing dari keempat power-up gelanggang setidaknya sekali: Setan Kecepatan, Raksasa, Bot Bulan, dan Berserker.',
    },
    pvp_fiesta_five_kills: {
      name: 'Tulang Punggung Pesta',
      desc: 'Robohkan lima lawan dalam satu laga Fiesta.',
    },
    soc_first_party: {
      name: 'Lebih Baik Bersama',
      desc: 'Bergabunglah dalam satu party bersama pemain lain.',
    },
    soc_full_house: {
      name: 'Formasi Lengkap',
      desc: 'Taklukkan sebuah dungeon dengan party lengkap berisi lima orang.',
    },
    soc_guild_joined: { name: 'Di Bawah Satu Panji', desc: 'Jadilah anggota sebuah guild.' },
    soc_guild_founded: { name: 'Pena Sang Pendiri', desc: 'Dirikan guild milikmu sendiri.' },
    soc_first_trade: {
      name: 'Pertukaran yang Adil',
      desc: 'Selesaikan satu pertukaran barang dengan pemain lain.',
    },
    soc_first_sale: {
      name: 'Buka Lapak',
      desc: 'Ambil uang hasil penjualan pertamamu di Pasar Dunia.',
    },
    soc_steady_custom: {
      name: 'Pelanggan Tetap',
      desc: 'Kumpulkan total 10 emas seumur hidup dari penjualanmu di Pasar Dunia.',
    },
    soc_market_magnate: {
      name: 'Taipan Pasar',
      desc: 'Kumpulkan total 100 emas seumur hidup dari penjualanmu di Pasar Dunia.',
      title: 'Taipan',
    },
    soc_by_ravens_wing: {
      name: 'Lewat Sayap Gagak',
      desc: 'Kirim sepucuk surat Pos Gagak yang memuat uang atau paket.',
    },
    soc_room_for_more: { name: 'Ruang Tambahan', desc: 'Beli perluasan bank pertamamu.' },
    soc_gilded_strongbox: {
      name: 'Brankas Bersepuh Emas',
      desc: 'Beli setiap perluasan bank yang bersedia dijual para bendahara kepadamu.',
    },
    soc_meet_bursar: {
      name: 'Kepada Fernando Kami Percaya',
      desc: 'Beri hormat kepada Bendahara Fernando, penjaga Brankas Bersepuh Emas di Eastbrook.',
    },
    soc_pocket_money: {
      name: 'Uang Jajan',
      desc: 'Jarah total 1 emas seumur hidup dalam bentuk kepingan uang.',
    },
    soc_heavy_purse: {
      name: 'Pundi-Pundi Berat',
      desc: 'Jarah total 10 emas seumur hidup dalam bentuk kepingan uang.',
    },
    soc_wyrms_hoard: {
      name: 'Timbunan Sang Wyrm',
      desc: 'Jarah total 100 emas seumur hidup dalam bentuk kepingan uang.',
    },
    soc_civic_duty: { name: 'Tugas Warga', desc: 'Alokasikan poin fokus kota pertamamu.' },
    exp_long_road_north: {
      name: 'Jalan Panjang ke Utara',
      desc: 'Kunjungi ketiga permukiman pusat: Eastbrook, Jembatan Rawa, dan Menara Pengawas.',
    },
    exp_vale_wayfarer: {
      name: 'Pengelana Lembah',
      desc: 'Kunjungi kesebelas tempat bernama di Lembah Eastbrook.',
    },
    exp_marsh_wayfarer: {
      name: 'Pengelana Rawa',
      desc: 'Kunjungi kedelapan tempat bernama di Rawa Mirefen.',
    },
    exp_peaks_wayfarer: {
      name: 'Pengelana Dataran Tinggi',
      desc: 'Kunjungi kesepuluh tempat bernama di Dataran Tinggi Thornpeak.',
    },
    exp_world_traveler: {
      name: 'Penjelajah Dunia',
      desc: 'Raih jasa pengelana dari ketiga zona.',
      title: 'Sang Pengelana',
    },
    exp_something_shiny: {
      name: 'Sesuatu yang Berkilau',
      desc: 'Pungut sebuah benda berkilauan dari tanah.',
    },
    exp_first_ore: { name: 'Belah Bumi', desc: 'Panen titik bijih pertamamu.' },
    exp_first_timber: { name: 'Awas, Tumbang!', desc: 'Panen titik kayu pertamamu.' },
    exp_first_herb: { name: 'Tangan Dingin', desc: 'Panen titik herba pertamamu.' },
    feat_era_cap: {
      name: 'Anak Era Pertama',
      desc: 'Mencapai level 20 selagi Era Pertama masih berjalan.',
    },
    feat_book_complete: { name: 'Seisi Kitab', desc: 'Raih setiap jasa dalam Kitab Jasa.' },
    feat_brightwood_relic: {
      name: 'Mengenang Brightwood',
      desc: 'Simpan sebuah relik dari Brightwood lama: Jaket Kulit Berduri atau Mahkota Sang Raja.',
    },
    hid_saul_footnote: {
      name: 'Catatan Kaki Sejarah',
      desc: 'Mengusik Saul sang Juru Kronik sembilan kali tanpa jeda.',
      title: 'Sang Catatan Kaki',
    },
    hid_gilded_tour: {
      name: 'Tur Bersepuh Emas',
      desc: 'Bertransaksi dengan ketiga cabang Brankas Bersepuh Emas.',
    },
    hid_fall_death: {
      name: 'Gravitasi Selalu Menang',
      desc: 'Mati akibat percakapan panjang dengan tanah.',
    },
    hid_keepers_toll_twice: {
      name: 'Sang Penjaga Menagih Dua Kali',
      desc: 'Mati selagi Upeti Sang Penjaga masih membebanimu.',
    },
    hid_roll_hundred: {
      name: 'Seratus Sempurna',
      desc: 'Melempar angka 100 sempurna pada /roll biasa.',
    },
    hid_yumi_cheer: {
      name: 'Penggemar Berat Yumi',
      desc: 'Bersorak untuk Yumi di tempat yang bisa ia dengar, di tengah laga.',
    },
    hid_bountiful_coffer: {
      name: 'Peti Ungu',
      desc: 'Membobol sebuah Peti Melimpah sebelum peti itu sempat macet.',
    },
    hid_companion_save: {
      name: 'Tidak Selama Ia Berjaga',
      desc: 'Pendamping delve-mu menarik rekan party yang tumbang hingga berdiri kembali.',
    },
    hid_codfather: {
      name: 'Masuk ke Dalam Keluarga',
      desc: 'Menyeret Sang Bapak Kod keluar dari Perairan Dangkal Deepfen.',
    },
    prog_crown_below: {
      name: 'Mahkota di Kedalaman',
      desc: 'Ikuti jejak sang mahkota dari padang tulang yang gelisah hingga ke makam Raja Nythraxis dan tuntaskan Akhir Sang Bencana.',
    },
    prog_mere_at_rest: {
      name: 'Danau yang Tenteram',
      desc: 'Tuntaskan penjagaan Ondrel Vane hingga akhir: paduan suara dibungkam, sang Lingkar Pucat ditumbangkan, dan Bulan Tenggelam diistirahatkan.',
    },
    prog_callused_hands: {
      name: 'Tangan Kapalan',
      desc: 'Selesaikan Kerja untuk Setiap Tangan dan dapatkan kapalan pertamamu dalam aneka pertukangan Eastbrook.',
    },
    prog_tools_of_the_trade: {
      name: 'Perkakas Sang Tukang',
      desc: 'Selesaikan satu kerajinan yang terikat stasiun di pusat kriya Menara Pengawas.',
    },
    dgn_nythraxis_crypt: {
      name: 'Yang Disimpan Kripta',
      desc: 'Beranikan diri memasuki Kripta Terbengkalai dan dapatkan kembali kedua belahan batu kunci serta buku harian kuno dari para penjaganya.',
    },
    chr_marsh_first_cast: {
      name: 'Belut di Sela Buluh',
      desc: 'Pancing seekor ikan dari perairan Rawa Mirefen.',
    },
  },
  it_IT: {
    prog_first_steps: {
      name: 'Primi Passi',
      desc: 'Raggiungi il livello 2 e muovi il primo passo su una lunga strada.',
    },
    prog_finding_your_feet: {
      name: 'Passo Sicuro',
      desc: "Raggiungi il livello 5; le terre selvagge sembrano già un po' più piccole.",
    },
    prog_double_digits: {
      name: 'Doppia Cifra',
      desc: 'Raggiungi il livello 10 e sblocca i tuoi talenti.',
    },
    prog_the_long_middle: { name: 'Nel Mezzo del Cammino', desc: 'Raggiungi il livello 15.' },
    prog_level_cap: {
      name: 'La Vista dalla Cima',
      desc: 'Raggiungi il livello 20, il livello massimo.',
    },
    prog_well_rested: {
      name: 'Ben Riposato',
      desc: 'Sistemati in una locanda finché non avrai maturato esperienza riposata.',
    },
    prog_talented: { name: 'Un Punto Ben Speso', desc: 'Spendi il tuo primo punto talento.' },
    prog_specialized: {
      name: "Dichiarazione d'Intenti",
      desc: 'Scegli una specializzazione e apprendi la sua abilità distintiva.',
    },
    prog_deep_roots: {
      name: 'Radici Profonde',
      desc: "Spendi un punto talento in un talento dell'ultima fila.",
    },
    prog_full_build: {
      name: 'Undici su Undici',
      desc: "Spendi tutti e undici i punti talento in un'unica build.",
    },
    prog_veteran: {
      name: 'Veterano',
      desc: 'Guadagna 250.000 punti esperienza complessivi.',
      title: 'Veterano',
    },
    prog_champion: {
      name: 'Campione',
      desc: 'Guadagna 500.000 punti esperienza complessivi.',
      title: 'Campione',
    },
    prog_paragon: {
      name: 'Esemplare',
      desc: 'Guadagna 1.000.000 di punti esperienza complessivi.',
      title: 'Esemplare',
    },
    prog_mythic: {
      name: 'Mitico',
      desc: 'Guadagna 2.500.000 punti esperienza complessivi.',
      title: 'Mitico',
    },
    prog_eternal: {
      name: 'Eterno',
      desc: 'Guadagna 5.000.000 di punti esperienza complessivi.',
      title: 'Eterno',
    },
    prog_prestige: {
      name: 'Ricominciare da Capo',
      desc: 'Raggiungi il livello massimo, riempi la barra ancora una volta e rivendica il grado di prestigio 1.',
    },
    prog_prestige_5: { name: 'Vecchie Abitudini', desc: 'Raggiungi il grado di prestigio 5.' },
    prog_prestige_10: { name: 'Moto Perpetuo', desc: 'Raggiungi il grado di prestigio 10.' },
    prog_first_harvest: {
      name: 'I Frutti del Campo',
      desc: 'Raccogli il tuo primo nodo di raccolta.',
    },
    prog_mining_100: {
      name: 'Minerale nel Sangue',
      desc: 'Raggiungi 100 di competenza in Estrazione.',
    },
    prog_logging_100: {
      name: 'Spaccadurame',
      desc: 'Raggiungi 100 di competenza in Disboscamento.',
    },
    prog_herbalism_100: {
      name: 'Maestro del Prato',
      desc: 'Raggiungi 100 di competenza in Erboristeria.',
    },
    prog_master_gatherer: {
      name: 'Maestro Raccoglitore',
      desc: 'Raggiungi 100 di competenza in Estrazione, Disboscamento ed Erboristeria.',
    },
    prog_first_craft: {
      name: 'Fatto a Mano',
      desc: 'Porta a termine la tua prima creazione riuscita.',
    },
    prog_craft_specialist: {
      name: 'I Segreti del Mestiere',
      desc: 'Raggiungi 75 di abilità in un mestiere qualsiasi e sbloccane i vantaggi di specializzazione.',
    },
    prog_around_the_ring: {
      name: "Il Giro dell'Anello",
      desc: 'Raggiungi 25 di abilità in cinque mestieri diversi.',
    },
    cmb_first_blood: { name: 'Primo Sangue', desc: 'Sconfiggi il tuo primo nemico.' },
    cmb_slayer: { name: 'Uccisore', desc: 'Sconfiggi 1.000 nemici.' },
    cmb_legion_of_one: { name: 'Legione di Uno', desc: 'Sconfiggi 10.000 nemici.' },
    cmb_heavy_hitter: { name: 'Mano Pesante', desc: 'Infliggi 500.000 danni totali.' },
    cmb_critical_eye: { name: 'Occhio Critico', desc: 'Metti a segno 500 colpi critici.' },
    cmb_giantslayer: {
      name: 'Ammazzagiganti',
      desc: 'Assesta il colpo di grazia a un nemico superiore a te di almeno cinque livelli.',
    },
    cmb_first_fall: {
      name: 'Scrollati la Polvere di Dosso',
      desc: 'Muori per la prima volta; capita anche ai migliori.',
    },
    dgn_hollow_crypt: {
      name: 'Spaccacripte',
      desc: 'Sconfiggi Morthen il Gravecaller nella Cripta Vuota.',
    },
    dgn_sunken_bastion: {
      name: 'Il Fogbinder Slegato',
      desc: 'Sconfiggi Vael il Fogbinder nel Bastione Sommerso.',
    },
    dgn_drowned_temple: {
      name: 'Annegare la Luna',
      desc: 'Sconfiggi Ysolei, Avatar della Luna Annegata, nel Tempio Annegato.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Il Wyrm nel Profondo',
      desc: 'Sconfiggi Korzul il Gravewyrm nel Santuario del Gravewyrm.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Eroico: La Cripta Vuota',
      desc: 'Sconfiggi Morthen il Gravecaller nella Cripta Vuota in difficoltà Eroica.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Eroico: Il Bastione Sommerso',
      desc: 'Sconfiggi Vael il Fogbinder nel Bastione Sommerso in difficoltà Eroica.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Eroico: Il Tempio Annegato',
      desc: 'Sconfiggi Ysolei, Avatar della Luna Annegata, nel Tempio Annegato in difficoltà Eroica.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Eroico: Santuario del Gravewyrm',
      desc: 'Sconfiggi Korzul il Gravewyrm nel Santuario del Gravewyrm in difficoltà Eroica.',
    },
    dgn_nythraxis: {
      name: 'Flagello Mai Più',
      desc: 'Sconfiggi Nythraxis, Flagello di Thornpeak, oltre la porta reale sigillata.',
    },
    dgn_nythraxis_heroic: {
      name: 'Eroico: Flagello Mai Più',
      desc: 'Sconfiggi Nythraxis, Flagello di Thornpeak, in difficoltà Eroica.',
    },
    dgn_thornpeak_rounds: {
      name: 'Il Gran Giro',
      desc: 'Ripulisci la Cripta Vuota, il Bastione Sommerso, il Tempio Annegato e il Santuario del Gravewyrm.',
    },
    dgn_deepward: {
      name: 'Custode del Profondo',
      desc: 'Conquista ogni dungeon, il raid ed entrambe le incursioni in difficoltà Eroica.',
    },
    dgn_mark_circuit: {
      name: 'Il Circuito Completo',
      desc: 'Ottieni Marchi Eroici da tutti e quattro i dungeon Eroici in un solo giorno.',
    },
    dgn_boss_clears_50: {
      name: 'Cinquanta Porte Dopo',
      desc: 'Sconfiggi 50 boss finali dei dungeon.',
    },
    dgn_morthen_flawless: {
      name: 'Nemmeno un Osso Rotto',
      desc: 'Sconfiggi Morthen il Gravecaller in difficoltà Eroica senza che alcun membro del gruppo muoia.',
    },
    dgn_morthen_trio: {
      name: 'Tre Contro la Tomba',
      desc: 'Sconfiggi Morthen il Gravecaller con tre giocatori o meno.',
    },
    dgn_olen_arc: {
      name: 'Schivare il Mietitore',
      desc: 'Sconfiggi il Cavaliere comandante Olen senza che il suo Arco Mietitore colpisca nessuno oltre al suo bersaglio attuale.',
    },
    dgn_vael_thralls: {
      name: 'Servo di Nessuno',
      desc: 'Sconfiggi Vael il Fogbinder con ogni Servo annegato da lui richiamato già ucciso.',
    },
    dgn_ysolei_moonspawn: {
      name: "Fino all'Ultima Progenie Lunare",
      desc: 'Sconfiggi Ysolei con ogni Progenie Lunare da lei richiamata già uccisa.',
    },
    dgn_ysolei_flawless: {
      name: 'Occhi Asciutti',
      desc: 'Sconfiggi Ysolei, Avatar della Luna Annegata, in difficoltà Eroica senza che alcun membro del gruppo muoia.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Restate Sepolti',
      desc: 'Sconfiggi il Grande negromante Velkhar con ogni Camminatore di ossa risorto distrutto prima che lui cada.',
    },
    dgn_korzul_flawless: {
      name: 'Abbattiwyrm',
      desc: 'Sconfiggi Korzul il Gravewyrm in difficoltà Eroica senza che alcun membro del gruppo muoia.',
      title: 'Abbattiwyrm',
    },
    dgn_sanctum_speed: {
      name: 'Scatto nel Santuario',
      desc: 'Sconfiggi Korzul il Gravewyrm entro 15 minuti da quando il tuo gruppo rivendica il Santuario del Gravewyrm.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Mai Piegarsi a un Re',
      desc: 'Sconfiggi Nythraxis senza che Spaccatombe colpisca mai nessuno oltre al suo bersaglio attuale.',
    },
    dgn_nythraxis_wardens: {
      name: 'Custodi delle Pietre di Guardia',
      desc: 'Sconfiggi Nythraxis con ogni Furia Senza Morte spezzata prima che colpisca.',
    },
    dgn_nythraxis_deathless: {
      name: 'I Veri Senzamorte',
      desc: 'Sconfiggi Nythraxis, Flagello di Thornpeak, in difficoltà Eroica senza che un solo membro del raid muoia.',
      title: 'il Senzamorte',
    },
    cmb_thunzharr: {
      name: 'La Montagna è Caduta',
      desc: 'Abbatti Thunzharr, il Picco Risvegliato, a Stormcrag.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Spaccavette',
      desc: 'Abbatti Thunzharr, il Picco Risvegliato, senza morire dal tuo primo colpo al suo ultimo respiro.',
      title: 'Spaccavette',
    },
    cmb_thunzharr_ten: {
      name: 'Il Vizio delle Montagne',
      desc: 'Abbatti Thunzharr, il Picco Risvegliato, dieci volte.',
    },
    dlv_reliquary: {
      name: 'Corridore del Reliquiario',
      desc: 'Ripulisci il Reliquiario Crollato.',
    },
    dlv_reliquary_heroic: {
      name: 'Eroico: Il Reliquiario Crollato',
      desc: 'Ripulisci il Reliquiario Crollato al livello Eroico.',
    },
    dlv_litany: { name: 'Silenzio sulla Litania', desc: 'Ripulisci la Litania Annegata.' },
    dlv_litany_heroic: {
      name: 'Eroico: La Litania Annegata',
      desc: 'Ripulisci la Litania Annegata al livello Eroico.',
    },
    dlv_lore_journal: {
      name: 'Note a Margine',
      desc: 'Sblocca tutte e cinque le voci del diario delle incursioni.',
    },
    dlv_companion_max: {
      name: "Un'Amica nel Profondo",
      desc: "Porta una compagna d'incursione al suo grado più alto.",
    },
    dlv_companions_both: {
      name: 'Due Lanterne Accese',
      desc: "Porta entrambe le compagne d'incursione, l'Accolita Tessa ed Edda Reedhand, al loro grado più alto.",
    },
    dlv_clears_50: { name: 'Cinquanta Braccia di Profondità', desc: 'Completa 50 incursioni.' },
    dlv_solo_heroic: {
      name: 'In Due è già Folla',
      desc: "Ripulisci un'incursione di livello Eroico senza nessun altro giocatore, solo tu e la tua compagna.",
    },
    dlv_tumbler_premium: {
      name: 'La Via del Nottolino, alla Perfezione',
      desc: 'Apri uno scrigno sigillato del reliquiario alla posta più alta, senza errori al tuo unico tentativo.',
    },
    dlv_rite_flawless: {
      name: 'Parola per Parola',
      desc: 'Completa il Rito del Reliquiario Annegato senza un solo errore.',
    },
    dlv_varric_ringers: {
      name: 'Le Campane Tacciono',
      desc: 'Sconfiggi il Diacono Varric quando ogni Campanaro Funebre che risveglia è già stato ucciso.',
    },
    dlv_nhalia_bells: {
      name: 'Fermacampane',
      desc: 'Sconfiggi Sorella Nhalia, il Cantico Annegato, senza che nessun membro del gruppo venga colpito da una Campana Rintoccante.',
      title: 'Fermacampane',
    },
    chr_vale_chapter_i: {
      name: 'Cronaca della Valle, Capitolo I',
      desc: 'Concludi il primo capitolo della cronaca di Saul: le prime commissioni di Eastbrook, la conformazione della Valle e un primo assaggio dei suoi mestieri.',
    },
    chr_vale_chapter_ii: {
      name: 'Cronaca della Valle, Capitolo II',
      desc: 'Concludi il secondo capitolo della cronaca di Saul: banditi, murloc e parassiti della miniera sterminati, una partita giocata al Campo della Scrofa e il Reliquiario affrontato.',
    },
    chr_vale_chapter_iii: {
      name: 'Cronaca della Valle',
      desc: "Porta a compimento l'intera storia della Valle: il Gravecaller smascherato, la Cripta Vuota purificata e ogni terrore famigerato della Valle abbattuto.",
      title: 'della Valle',
    },
    chr_vale_gatherer: {
      name: 'Vivere della Terra',
      desc: "Raccogli una vena di minerale, un ceppo di legname e una macchia d'erbe nella Valle di Eastbrook.",
    },
    chr_vale_first_cast: {
      name: 'Qualcosa nel Lago Specchio',
      desc: 'Pesca un pesce nelle acque della Valle di Eastbrook.',
    },
    chr_vale_packbreaker: {
      name: 'Spezzabranco',
      desc: 'Uccidi 3 Lupi della foresta entro 10 secondi.',
    },
    chr_vale_cup_debut: {
      name: 'Contendente del Secchio di Rame',
      desc: 'Scendi in campo e tocca la palla in una partita della Coppa della Valle al Campo della Scrofa.',
    },
    chr_vale_rares: {
      name: 'I Terrori della Valle',
      desc: 'Uccidi i cinque terrori famigerati della Valle di Eastbrook: il Vecchio Greyjaw, Mogger, Grix il Re dei Cunicoli, il Capitano Verlan e Maldrec il Legaspettri.',
    },
    chr_marsh_chapter_i: {
      name: 'Cronaca della Palude, Capitolo I',
      desc: 'Concludi il primo capitolo della cronaca di Osric Fenn: rispondi al raduno di Fenbridge, metti al sicuro la strada rialzata e impara la forma della palude.',
    },
    chr_marsh_chapter_ii: {
      name: 'Cronaca della Palude, Capitolo II',
      desc: 'Concludi il secondo capitolo della cronaca di Osric Fenn: le vedove scacciate col fuoco, gli annegati messi a riposo, il Pescadrino tirato a riva e la Litania affrontata.',
    },
    chr_marsh_chapter_iii: {
      name: 'Cronaca di Mirefen',
      desc: "Porta a compimento l'intera storia della palude: il campo del culto distrutto, il Fogbinder ridotto al silenzio nel Bastione Sommerso e ogni terrore famigerato della nebbia abbattuto.",
      title: 'di Mirefen',
    },
    chr_marsh_gatherer: {
      name: 'Raccolto di Fenbridge',
      desc: "Raccogli una vena di minerale, un ceppo di legname e una macchia d'erbe nella Palude di Mirefen.",
    },
    chr_marsh_unburst: {
      name: 'Non Restare nelle Spore',
      desc: "Uccidi 8 Gonfioni del pantano senza farti cogliere dall'esplosione delle loro Spore Caustiche.",
    },
    chr_marsh_hush_the_mending: {
      name: 'Silenzio alle Cure',
      desc: 'Nel campo Gravecaller, uccidi un Risanatore Gravecaller prima di qualsiasi cultista che ha in cura.',
    },
    chr_marsh_rares: {
      name: 'Nomi nella Nebbia',
      desc: "Uccidi i tre terrori famigerati della Palude di Mirefen: Mirejaw il Famelico, Sloomtooth l'Annegato e Sorella Nhalia.",
    },
    chr_peaks_chapter_i: {
      name: 'Cronaca delle Vette, Capitolo I',
      desc: 'Concludi il primo capitolo della cronaca di Zenzie: sgombra la strada della cresta, svuota le tane e impara ogni sentiero che Highwatch protegge.',
    },
    chr_peaks_chapter_ii: {
      name: 'Cronaca delle Vette, Capitolo II',
      desc: 'Concludi il secondo capitolo della cronaca di Zenzie: distruggi il campo di guerra di Drogmar, decifra la tempesta che si risveglia e fermati là dove il Glimmermere risplende.',
    },
    chr_peaks_chapter_iii: {
      name: 'Cronaca di Thornpeak',
      desc: "Porta a compimento l'intera storia della montagna: il Culto del Wyrm spezzato, il Santuario ridotto al silenzio, il Picco Risvegliato abbattuto e ogni terrore famigerato delle rupi eliminato.",
      title: 'di Thornpeak',
    },
    chr_peaks_sparring: {
      name: 'Esercitazioni sul Muro',
      desc: "Infliggi 1.000 danni totali al manichino d'allenamento sopra Highwatch.",
    },
    chr_peaks_glimmer_cast: {
      name: 'Acqua Fredda, Luce più Fredda',
      desc: 'Pesca un pesce nel Glimmermere.',
    },
    chr_peaks_moongate: {
      name: 'Oltre il Cancello Freddo',
      desc: 'Attraversa il cancello lunare sulla riva del Glimmermere.',
    },
    chr_peaks_waking_witness: {
      name: 'La Montagna che Cammina',
      desc: 'Posa lo sguardo su Thunzharr, il Picco Risvegliato, mentre incede sulla montagna.',
    },
    chr_peaks_rares: {
      name: 'Nomi Incisi nella Rupe',
      desc: 'Uccidi i quattro terrori famigerati delle Alture di Thornpeak: il Caposquadra Venaferrata, Brutok Spaccacranio, Voskar Aladibrace e il Signore del Midollo Varkas.',
    },
    col_discovery_25: {
      name: 'Accaparratore',
      desc: 'Scopri 25 oggetti diversi (un oggetto conta la prima volta che entra in tuo possesso).',
    },
    col_discovery_75: { name: 'Gazza Ladra', desc: 'Scopri 75 oggetti diversi.' },
    col_discovery_150: {
      name: 'Camera delle Meraviglie',
      desc: 'Scopri 150 oggetti diversi.',
      title: 'il Curatore',
    },
    col_discovery_250: { name: 'Il Gran Catalogo', desc: 'Scopri 250 oggetti diversi.' },
    col_first_rare: {
      name: 'Qualcosa di Blu',
      desc: 'Ottieni il tuo primo oggetto di qualità rara.',
    },
    col_first_epic: {
      name: 'Nato nella Porpora',
      desc: 'Ottieni il tuo primo oggetto di qualità epica.',
    },
    col_first_legendary: {
      name: "Un Colpo d'Arancio",
      desc: 'Ottieni il tuo primo oggetto di qualità leggendaria.',
    },
    col_set_vale_arcanist: {
      name: "Regalia dell'Arcanista della Valle",
      desc: "Scopri ogni pezzo delle Regalia dell'Arcanista della Valle.",
    },
    col_set_boundstone_vanguard: {
      name: 'Avanguardia Pietrvincolo',
      desc: "Scopri ogni pezzo dell'Avanguardia Pietrvincolo.",
    },
    col_set_greyjaw_stalker: {
      name: 'Corredo del Braccatore di Greyjaw',
      desc: 'Scopri ogni pezzo del Corredo del Braccatore di Greyjaw.',
    },
    col_set_deathlord: {
      name: 'Corredo da Guerra di Barrowlord',
      desc: 'Scopri ogni pezzo del Corredo da Guerra di Barrowlord.',
    },
    col_set_wyrmshadow: {
      name: 'Vesti Nightfang',
      desc: 'Scopri ogni pezzo delle Vesti Nightfang.',
    },
    col_set_necromancers: {
      name: 'Paramenti Mournweave',
      desc: 'Scopri ogni pezzo dei Paramenti Mournweave.',
    },
    col_set_crownforged: {
      name: 'Regalia Bonewrought',
      desc: 'Scopri ogni pezzo delle Regalia Bonewrought.',
    },
    col_set_nighttalon: {
      name: 'Pelliccia Direfang',
      desc: 'Scopri ogni pezzo della Pelliccia Direfang.',
    },
    col_set_soulflame: {
      name: 'Regalia Wraithfire',
      desc: 'Scopri ogni pezzo delle Regalia Wraithfire.',
    },
    col_set_stormcallers: {
      name: 'Vesti Galecall',
      desc: 'Scopri ogni pezzo delle Vesti Galecall.',
    },
    col_seven_regalia: {
      name: 'Il Guardaroba delle Sette Vesti',
      desc: 'Scopri ogni pezzo di tutte e sette le famiglie di armature epiche.',
      title: 'lo Sfolgorante',
    },
    col_true_colors: {
      name: 'I Tuoi Veri Colori',
      desc: 'Scendi in campo con un aspetto diverso da quello predefinito della tua classe.',
    },
    col_all_slots: {
      name: 'Di Tutto Punto, in Undici Punti',
      desc: "Indossa un oggetto in tutti e undici gli slot dell'equipaggiamento contemporaneamente.",
    },
    col_quartermaster_buyout: {
      name: 'Cliente di Riguardo',
      desc: 'Scopri tutti e dieci i pezzi della mercanzia del Quartiermastro Vex.',
    },
    col_glimmerfin: {
      name: 'Un Barlume di Speranza',
      desc: 'Pesca un Koi dalle pinne scintillanti.',
    },
    col_full_creel: {
      name: 'Cesta Piena',
      desc: 'Scopri tutte e sei le prede comuni delle acque della Valle, della Palude e delle Alture.',
    },
    col_junk_drawer: {
      name: 'Il Cassetto delle Cianfrusaglie',
      desc: 'Scopri 10 oggetti diversi di qualità scadente.',
    },
    pvp_arena_first_match: {
      name: 'Sabbia negli Stivali',
      desc: 'Disputa un incontro classificato nel Colosseo Cinereo, in una delle due categorie.',
    },
    pvp_arena_first_win: {
      name: 'Il Boato della Folla',
      desc: 'Vinci un incontro classificato in arena, in una delle due categorie.',
    },
    pvp_arena_1v1_1600: {
      name: 'Contendente del Colosseo',
      desc: "Raggiungi 1600 di valutazione nella categoria 1v1 dell'arena.",
    },
    pvp_arena_1v1_1750: {
      name: 'Rivale del Colosseo',
      desc: "Raggiungi 1750 di valutazione nella categoria 1v1 dell'arena.",
    },
    pvp_arena_1v1_1900: {
      name: 'Gladiatore',
      desc: "Raggiungi 1900 di valutazione nella categoria 1v1 dell'arena.",
      title: 'Gladiatore',
    },
    pvp_arena_2v2_1600: {
      name: 'Forti in Due',
      desc: "Raggiungi 1600 di valutazione nella categoria 2v2 dell'arena.",
    },
    pvp_arena_2v2_1750: {
      name: 'Coppia Temibile',
      desc: "Raggiungi 1750 di valutazione nella categoria 2v2 dell'arena.",
    },
    pvp_arena_2v2_1900: {
      name: 'Intesa Perfetta',
      desc: "Raggiungi 1900 di valutazione nella categoria 2v2 dell'arena.",
    },
    pvp_duel_first_win: { name: 'Risolviamola Fuori', desc: 'Vinci un duello.' },
    pvp_duel_grace: {
      name: 'Una Lezione di Umiltà',
      desc: 'Perdi un duello con la dignità quasi intatta.',
    },
    pvp_vcup_first_match: {
      name: 'Scarpini in Campo',
      desc: "Porta a termine un'intera partita di Coppa della Valle al Campo della Scrofa, vinta o persa che sia.",
    },
    pvp_vcup_first_win: {
      name: 'Primo Trofeo in Bacheca',
      desc: 'Vinci una partita classificata di Coppa della Valle.',
    },
    pvp_vcup_wins_10: {
      name: 'Vecchia Volpe del Boarball',
      desc: 'Vinci 10 partite classificate di Coppa della Valle.',
    },
    pvp_vcup_wins_25: {
      name: 'Leggenda del Boarball',
      desc: 'Vinci 25 partite classificate di Coppa della Valle.',
      title: 'Leggenda del Boarball',
    },
    pvp_vcup_first_goal: {
      name: 'A Segno',
      desc: 'Segna un gol in una partita classificata di Coppa della Valle.',
    },
    pvp_vcup_hat_trick: {
      name: 'Eroe della Tripletta',
      desc: 'Segna tre gol in una singola partita classificata di Coppa della Valle, nella categoria 3v3 o superiore.',
    },
    pvp_vcup_golden_goal: {
      name: "Momento d'Oro",
      desc: "Segna il gol d'oro che decide una partita classificata di Coppa della Valle.",
    },
    pvp_vcup_first_save: {
      name: 'Mani Sicure',
      desc: 'Effettua una parata da portiere in una partita classificata di Coppa della Valle.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Di Qui Non Si Passa',
      desc: 'Vinci da portiere una partita classificata di Coppa della Valle senza subire gol.',
    },
    pvp_vcup_guild_win: {
      name: 'Per il Vessillo',
      desc: 'Vinci una partita classificata di Coppa della Valle disputata sotto il vessillo della tua gilda.',
    },
    pvp_fiesta_first_bout: {
      name: 'Imbucato alla Fiesta',
      desc: 'Combatti per intero uno scontro Fiesta 2v2, vinto o perso che sia.',
    },
    pvp_fiesta_first_win: { name: "L'Anima della Fiesta", desc: 'Vinci uno scontro Fiesta 2v2.' },
    pvp_fiesta_double: {
      name: 'Doppio Guaio',
      desc: 'Metti a segno due abbattimenti nella Fiesta nel giro di quattro secondi.',
    },
    pvp_fiesta_shutdown: {
      name: 'Guastafeste',
      desc: 'Abbatti un avversario della Fiesta che vanta una serie di tre o più abbattimenti.',
    },
    pvp_fiesta_full_build: {
      name: "In Tiro per l'Occasione",
      desc: 'Vinci uno scontro della Fiesta avendo fissato un potenziamento in ognuna delle tre ondate.',
    },
    pvp_fiesta_powerups: {
      name: 'Uno per Tipo',
      desc: 'Raccogli almeno una volta ognuno dei quattro power-up del ring: Demone della Velocità, Colosso, Stivali Lunari e Berserker.',
    },
    pvp_fiesta_five_kills: {
      name: 'Squadra in Spalla',
      desc: 'Metti a segno cinque abbattimenti in un singolo scontro della Fiesta.',
    },
    soc_first_party: {
      name: 'Meglio in Compagnia',
      desc: 'Unisciti a un gruppo con un altro giocatore.',
    },
    soc_full_house: {
      name: 'Al Gran Completo',
      desc: 'Completa un dungeon con un gruppo al completo di cinque membri.',
    },
    soc_guild_joined: { name: "Sotto un'Unica Bandiera", desc: 'Diventa membro di una gilda.' },
    soc_guild_founded: { name: 'La Penna del Fondatore', desc: 'Fonda una gilda tutta tua.' },
    soc_first_trade: {
      name: 'Un Equo Scambio',
      desc: 'Concludi uno scambio con un altro giocatore.',
    },
    soc_first_sale: {
      name: 'Bottega Aperta',
      desc: "Riscuoti l'incasso della tua prima vendita al Mercato Mondiale.",
    },
    soc_steady_custom: {
      name: 'Clientela Fissa',
      desc: "Riscuoti un totale complessivo di 10 monete d'oro dalle tue vendite al Mercato Mondiale.",
    },
    soc_market_magnate: {
      name: 'Magnate del Mercato',
      desc: "Riscuoti un totale complessivo di 100 monete d'oro dalle tue vendite al Mercato Mondiale.",
      title: 'Magnate',
    },
    soc_by_ravens_wing: {
      name: "Sull'Ala del Corvo",
      desc: 'Invia una lettera della Corvoposta con dentro monete o un pacco.',
    },
    soc_room_for_more: {
      name: "C'è Posto per Altro",
      desc: 'Acquista il tuo primo ampliamento della banca.',
    },
    soc_gilded_strongbox: {
      name: 'Il Forziere Dorato',
      desc: 'Acquista ogni ampliamento della banca che gli economi sono disposti a venderti.',
    },
    soc_meet_bursar: {
      name: 'In Fernando Confidiamo',
      desc: "Rendi omaggio all'Economo Fernando, custode del Forziere Dorato a Eastbrook.",
    },
    soc_pocket_money: {
      name: 'Paghetta',
      desc: "Raccogli come bottino un totale complessivo di 1 moneta d'oro in denaro sonante.",
    },
    soc_heavy_purse: {
      name: 'Borsa Pesante',
      desc: "Raccogli come bottino un totale complessivo di 10 monete d'oro in denaro sonante.",
    },
    soc_wyrms_hoard: {
      name: 'Un Tesoro da Wyrm',
      desc: "Raccogli come bottino un totale complessivo di 100 monete d'oro in denaro sonante.",
    },
    soc_civic_duty: {
      name: 'Dovere Civico',
      desc: 'Assegna il tuo primo punto di sviluppo cittadino.',
    },
    exp_long_road_north: {
      name: 'La Lunga Strada verso Nord',
      desc: 'Visita tutti e tre gli insediamenti principali: Eastbrook, Fenbridge e Highwatch.',
    },
    exp_vale_wayfarer: {
      name: 'Viandante della Valle',
      desc: 'Visita tutti gli undici luoghi noti della Valle di Eastbrook.',
    },
    exp_marsh_wayfarer: {
      name: 'Viandante della Palude',
      desc: 'Visita tutti gli otto luoghi noti della Palude di Mirefen.',
    },
    exp_peaks_wayfarer: {
      name: 'Viandante delle Alture',
      desc: 'Visita tutti i dieci luoghi noti delle Alture di Thornpeak.',
    },
    exp_world_traveler: {
      name: 'Giramondo',
      desc: "Ottieni l'impresa da viandante di tutte e tre le zone.",
      title: 'il Viandante',
    },
    exp_something_shiny: {
      name: 'Qualcosa che Luccica',
      desc: 'Raccogli da terra un oggetto scintillante.',
    },
    exp_first_ore: { name: 'Giù il Piccone', desc: 'Raccogli il tuo primo nodo di minerale.' },
    exp_first_timber: { name: "Cade l'Albero!", desc: 'Raccogli il tuo primo nodo di legname.' },
    exp_first_herb: { name: 'Pollice Verde', desc: 'Raccogli il tuo primo nodo di erbe.' },
    feat_era_cap: {
      name: 'Figlio della Prima Era',
      desc: 'Hai raggiunto il livello 20 mentre la Prima Era era in corso.',
    },
    feat_book_complete: {
      name: 'Il Libro Intero',
      desc: 'Ottieni ogni impresa del Libro delle Imprese.',
    },
    feat_brightwood_relic: {
      name: 'In Ricordo di Brightwood',
      desc: 'Conserva una reliquia della vecchia Brightwood: il Giubbotto di pelle di rovo o la Corona del Monarca.',
    },
    hid_saul_footnote: {
      name: 'Una Postilla nella Storia',
      desc: 'Hai importunato Saul il Cronista nove volte senza sosta.',
      title: 'la Postilla',
    },
    hid_gilded_tour: {
      name: 'Il Tour Dorato',
      desc: 'Hai fatto affari con tutte e tre le filiali del Forziere Dorato.',
    },
    hid_fall_death: {
      name: 'La Gravità Vince Sempre',
      desc: 'Ti è stata fatale una lunga conversazione con il suolo.',
    },
    hid_keepers_toll_twice: {
      name: 'Il Custode Riscuote Due Volte',
      desc: 'Hai incontrato la morte mentre il Tributo del Custode gravava ancora su di te.',
    },
    hid_roll_hundred: {
      name: 'Cento Naturale',
      desc: 'Hai tirato un 100 perfetto con un semplice /roll.',
    },
    hid_yumi_cheer: {
      name: 'Fan Numero Uno di Yumi',
      desc: 'Hai fatto il tifo per Yumi dove poteva sentirti, nel bel mezzo di uno scontro.',
    },
    hid_bountiful_coffer: {
      name: 'Lo Scrigno Viola',
      desc: 'Hai scassinato uno Scrigno Munifico prima che potesse incepparsi.',
    },
    hid_companion_save: {
      name: "Non Finché C'è Lei",
      desc: "La tua compagna d'incursione ha rimesso in piedi un membro del gruppo caduto.",
    },
    hid_codfather: {
      name: 'Uno di Famiglia',
      desc: 'Hai trascinato Il Pescadrino fuori dai Bassifondi di Deepfen.',
    },
    prog_crown_below: {
      name: 'La Corona Sepolta',
      desc: "Segui la corona dai campi d'ossa irrequieti fino alla tomba di re Nythraxis e porta a compimento La Fine del Flagello.",
    },
    prog_mere_at_rest: {
      name: 'La Quiete del Lago',
      desc: 'Porta a termine la veglia di Ondrel Vane: il coro messo a tacere, lo Spiropallido ucciso e la Luna Annegata deposta nel suo riposo.',
    },
    prog_callused_hands: {
      name: 'Mani Callose',
      desc: 'Completa Un Mestiere per Ogni Mano e guadagnati il primo callo nei mestieri di Eastbrook.',
    },
    prog_tools_of_the_trade: {
      name: 'Gli Attrezzi del Mestiere',
      desc: 'Completa una creazione vincolata a una postazione presso il polo artigiano di Highwatch.',
    },
    dgn_nythraxis_crypt: {
      name: 'Ciò che la Cripta Custodiva',
      desc: 'Affronta la Cripta abbandonata e recupera dai suoi guardiani entrambe le metà della chiave di volta e il diario antico.',
    },
    chr_marsh_first_cast: {
      name: 'Anguille tra le Canne',
      desc: 'Pesca un pesce nelle acque della Palude di Mirefen.',
    },
  },
  ja_JP: {
    prog_first_steps: {
      name: 'はじめの一歩',
      desc: 'レベル2に到達し、長い旅路の最初の一歩を踏み出す。',
    },
    prog_finding_your_feet: {
      name: '足慣らし',
      desc: 'レベル5に到達する。荒野は早くも、少しだけ小さく見える。',
    },
    prog_double_digits: { name: '二桁の大台', desc: 'レベル10に到達し、タレントを解放する。' },
    prog_the_long_middle: { name: '長い道の半ば', desc: 'レベル15に到達する。' },
    prog_level_cap: { name: '頂の眺め', desc: 'レベル上限であるレベル20に到達する。' },
    prog_well_rested: {
      name: '英気を養う',
      desc: '休息経験値を得るまで、宿屋に腰を落ち着けてくつろぐ。',
    },
    prog_talented: { name: '価値ある1ポイント', desc: '最初のタレントポイントを振る。' },
    prog_specialized: {
      name: '所信表明',
      desc: '特化を選び、その象徴となるアビリティを習得する。',
    },
    prog_deep_roots: { name: '深き根', desc: '最終段のタレントにポイントを振る。' },
    prog_full_build: {
      name: '十一分の力',
      desc: '11のタレントポイントすべてをひとつのビルドに振り切る。',
    },
    prog_veteran: { name: '古参', desc: '生涯経験値250,000を獲得する。', title: '古参' },
    prog_champion: { name: '勇者', desc: '生涯経験値500,000を獲得する。', title: '勇者' },
    prog_paragon: { name: '範士', desc: '生涯経験値1,000,000を獲得する。', title: '範士' },
    prog_mythic: { name: '神話', desc: '生涯経験値2,500,000を獲得する。', title: '神話' },
    prog_eternal: { name: '永遠', desc: '生涯経験値5,000,000を獲得する。', title: '永遠' },
    prog_prestige: {
      name: 'もう一度はじめから',
      desc: 'レベル上限に達したのち、もう一度バーを満たしてプレステージランク1を手にする。',
    },
    prog_prestige_5: { name: '三つ子の魂', desc: 'プレステージランク5に到達する。' },
    prog_prestige_10: { name: '永久機関', desc: 'プレステージランク10に到達する。' },
    prog_first_harvest: { name: '野の実り', desc: '初めて採集ポイントを収穫する。' },
    prog_mining_100: { name: '血は鉱脈より濃し', desc: '採掘の熟練度100に到達する。' },
    prog_logging_100: { name: '心材断ち', desc: '伐採の熟練度100に到達する。' },
    prog_herbalism_100: { name: '野辺の名人', desc: '薬草学の熟練度100に到達する。' },
    prog_master_gatherer: {
      name: '採集の達人',
      desc: '採掘、伐採、薬草学のすべてで熟練度100に到達する。',
    },
    prog_first_craft: { name: '手仕事の味', desc: '初めての製作を成功させる。' },
    prog_craft_specialist: {
      name: '秘伝の技',
      desc: 'いずれかひとつの製作スキルで75に到達し、その特化の恩恵を解放する。',
    },
    prog_around_the_ring: { name: '環をひと巡り', desc: '5種類の異なる製作スキルで25に到達する。' },
    cmb_first_blood: { name: '初陣の血', desc: '初めての敵を打ち倒す。' },
    cmb_slayer: { name: '討伐者', desc: '敵を1,000体倒す。' },
    cmb_legion_of_one: { name: '一騎当千', desc: '敵を10,000体倒す。' },
    cmb_heavy_hitter: { name: '剛打の使い手', desc: '合計500,000のダメージを与える。' },
    cmb_critical_eye: { name: '会心の眼', desc: 'クリティカルヒットを500回命中させる。' },
    cmb_giantslayer: { name: '巨人殺し', desc: '自分より5レベル以上高い敵にとどめの一撃を放つ。' },
    cmb_first_fall: { name: '埃を払って立て', desc: '初めて死ぬ。誰にでもあることだ。' },
    dgn_hollow_crypt: { name: '墓所破り', desc: '虚ろの墓所で墓呼びのモーセンを倒す。' },
    dgn_sunken_bastion: {
      name: '解けた霧の縛め',
      desc: '沈んだ砦でフォグバインダーのヴァエルを倒す。',
    },
    dgn_drowned_temple: {
      name: '月を沈める',
      desc: '溺れし神殿で「イソレイ、溺月の化身」を倒す。',
    },
    dgn_gravewyrm_sanctum: {
      name: '地の底のワーム',
      desc: '墓ワームの聖所で墓ワームのコルズルを倒す。',
    },
    dgn_hollow_crypt_heroic: {
      name: '英雄: 虚ろの墓所',
      desc: '英雄難易度の虚ろの墓所で墓呼びのモーセンを倒す。',
    },
    dgn_sunken_bastion_heroic: {
      name: '英雄: 沈んだ砦',
      desc: '英雄難易度の沈んだ砦でフォグバインダーのヴァエルを倒す。',
    },
    dgn_drowned_temple_heroic: {
      name: '英雄: 溺れし神殿',
      desc: '英雄難易度の溺れし神殿で「イソレイ、溺月の化身」を倒す。',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: '英雄: 墓ワームの聖所',
      desc: '英雄難易度の墓ワームの聖所で墓ワームのコルズルを倒す。',
    },
    dgn_nythraxis: {
      name: '災厄、ここに果てる',
      desc: '封印された王家の扉の先で「ナイスラクシス、ソーンピークの災厄」を倒す。',
    },
    dgn_nythraxis_heroic: {
      name: '英雄: 災厄、ここに果てる',
      desc: '英雄難易度で「ナイスラクシス、ソーンピークの災厄」を倒す。',
    },
    dgn_thornpeak_rounds: {
      name: '巡り巡って',
      desc: '虚ろの墓所、沈んだ砦、溺れし神殿、墓ワームの聖所を攻略する。',
    },
    dgn_deepward: {
      name: '深淵の護り手',
      desc: 'すべてのダンジョンとレイド、そして両方のデルヴを英雄難易度で制覇する。',
    },
    dgn_mark_circuit: {
      name: '完全周回',
      desc: '1日のうちに、4つの英雄ダンジョンすべてで英雄の証を手に入れる。',
    },
    dgn_boss_clears_50: { name: '五十の扉の先', desc: 'ダンジョン最奥のボスを50体倒す。' },
    dgn_morthen_flawless: {
      name: '骨折り知らず',
      desc: 'パーティメンバーを1人も死なせずに、英雄難易度で墓呼びのモーセンを倒す。',
    },
    dgn_morthen_trio: {
      name: '墓に挑む三人',
      desc: '3人以下のプレイヤーで墓呼びのモーセンを倒す。',
    },
    dgn_olen_arc: {
      name: '死神かわし',
      desc: '刈り取りの弧を現在の標的以外の誰にも当てさせずに、騎士司令官オレンを倒す。',
    },
    dgn_vael_thralls: {
      name: '下僕はお断り',
      desc: '呼び出される溺れた下僕をすべて倒しきった上で、フォグバインダーのヴァエルを倒す。',
    },
    dgn_ysolei_moonspawn: {
      name: '月の落とし子、残らず',
      desc: '呼び出される月の落とし子をすべて倒しきった上で、イソレイを倒す。',
    },
    dgn_ysolei_flawless: {
      name: '乾いた瞳',
      desc: 'パーティメンバーを1人も死なせずに、英雄難易度で「イソレイ、溺月の化身」を倒す。',
    },
    dgn_velkhar_bonewalkers: {
      name: '墓に還れ',
      desc: '甦った骨歩きをすべて破壊してから、大死霊術師ヴェルカーを倒す。',
    },
    dgn_korzul_flawless: {
      name: 'ワーム討ち',
      desc: 'パーティメンバーを1人も死なせずに、英雄難易度で墓ワームのコルズルを倒す。',
      title: 'ワーム討ち',
    },
    dgn_sanctum_speed: {
      name: '聖所駆け',
      desc: 'パーティが墓ワームの聖所を確保してから15分以内に、墓ワームのコルズルを倒す。',
    },
    dgn_nythraxis_gravebreaker: {
      name: '王に跪かず',
      desc: '墓砕きを現在の標的以外の誰にも当てさせずに、ナイスラクシスを倒す。',
    },
    dgn_nythraxis_wardens: {
      name: '護り石の番人',
      desc: 'すべての不死の憤怒を着弾前に打ち破った上で、ナイスラクシスを倒す。',
    },
    dgn_nythraxis_deathless: {
      name: '不死身の中の不死身',
      desc: 'レイドの誰ひとり死なせずに、英雄難易度で「ナイスラクシス、ソーンピークの災厄」を倒す。',
      title: '不死身',
    },
    cmb_thunzharr: {
      name: 'かくして山は倒れた',
      desc: 'ストームクラッグで「サンザール、目覚めし峰」を打ち倒す。',
    },
    cmb_thunzharr_unbroken: {
      name: '峰砕き',
      desc: '最初の一撃から最後の吐息まで一度も死なずに、「サンザール、目覚めし峰」を打ち倒す。',
      title: '峰砕き',
    },
    cmb_thunzharr_ten: { name: '山崩しの常連', desc: '「サンザール、目覚めし峰」を10回打ち倒す。' },
    dlv_reliquary: { name: '聖遺物庫の走り手', desc: '崩れた聖遺物庫を攻略する。' },
    dlv_reliquary_heroic: {
      name: '英雄：崩れた聖遺物庫',
      desc: '崩れた聖遺物庫を英雄ティアで攻略する。',
    },
    dlv_litany: { name: '連祷を鎮めよ', desc: '溺れし連祷を攻略する。' },
    dlv_litany_heroic: { name: '英雄：溺れし連祷', desc: '溺れし連祷を英雄ティアで攻略する。' },
    dlv_lore_journal: { name: '欄外の書き込み', desc: 'デルヴ日誌の項目5つをすべて解放する。' },
    dlv_companion_max: { name: '深みの友', desc: 'デルヴの相棒を最高位まで育て上げる。' },
    dlv_companions_both: {
      name: '灯る二つのランタン',
      desc: '侍祭テッサとエッダ・リードハンド、二人のデルヴの相棒をどちらも最高位まで育て上げる。',
    },
    dlv_clears_50: { name: '五十尋の深み', desc: 'デルヴの探索を50回完遂する。' },
    dlv_solo_heroic: {
      name: 'ふたりで満員',
      desc: '他のプレイヤーを連れず、自分と相棒だけで英雄ティアのデルヴを攻略する。',
    },
    dlv_tumbler_premium: {
      name: '錠前師の道、その極み',
      desc: '護りの掛かった聖遺物庫の宝箱に最高の賭け金で挑み、ただ一度きりの機会で、しくじりなく開け切る。',
    },
    dlv_rite_flawless: {
      name: '一言一句、違わず',
      desc: '溺れし聖遺物庫の儀式を一度も間違えずに完遂する。',
    },
    dlv_varric_ringers: {
      name: '鳴りやむ鐘',
      desc: '彼が甦らせる葬儀の鐘鳴らしをすべて先に仕留めてから、助祭ヴァリックを倒す。',
    },
    dlv_nhalia_bells: {
      name: '鐘鎮め',
      desc: 'パーティの誰ひとり鳴り響く鐘に打たれることなく、修道女ナリア、溺れし聖歌を打ち倒す。',
      title: '鐘鎮め',
    },
    chr_vale_chapter_i: {
      name: '渓谷年代記 第一章',
      desc: 'ソールの年代記の第一章を仕上げる：イーストブルックでの手始めの使い走り、渓谷の地勢、そして生業の最初の味見。',
    },
    chr_vale_chapter_ii: {
      name: '渓谷年代記 第二章',
      desc: 'ソールの年代記の第二章を仕上げる：盗賊、泥ひれの潜伏者、鉱山の害獣どもを退治し、ソウフィールドで試合をこなし、聖遺物庫へ挑む。',
    },
    chr_vale_chapter_iii: {
      name: '渓谷の年代記',
      desc: '渓谷の物語を最後まで見届ける：グレイブコーラーの正体を暴き、虚ろの墓所を浄め、渓谷に名だたる恐怖をことごとく討ち倒す。',
      title: '渓谷の語り部',
    },
    chr_vale_gatherer: {
      name: '地の恵みに生きる',
      desc: 'イーストブルック渓谷で鉱脈、木立、薬草の茂みをそれぞれ採取する。',
    },
    chr_vale_first_cast: {
      name: '鏡の湖に潜むもの',
      desc: 'イーストブルック渓谷の水辺で魚を釣り上げる。',
    },
    chr_vale_packbreaker: { name: '群れ崩し', desc: '10秒以内に森の狼を3体倒す。' },
    chr_vale_cup_debut: {
      name: '銅の手桶の挑戦者',
      desc: 'ソウフィールドでのヴェイルカップの試合に出場し、ボールに触れる。',
    },
    chr_vale_rares: {
      name: '渓谷の恐怖',
      desc: 'イーストブルック渓谷に名だたる5体の恐怖、老グレイジョー、モガー、トンネルキングのグリックス、ヴァーラン隊長、魂縛りマルドレクを討ち倒す。',
    },
    chr_marsh_chapter_i: {
      name: '湿地年代記 第一章',
      desc: 'オズリック・フェンの年代記の第一章を仕上げる：フェンブリッジの召集に応じ、土手道を確保し、沼沢の姿かたちを知る。',
    },
    chr_marsh_chapter_ii: {
      name: '湿地年代記 第二章',
      desc: 'オズリック・フェンの年代記の第二章を仕上げる：ウィドウどもを焼き払い、溺れ死者を眠りにつかせ、タラのゴッドファーザーを釣り上げ、連祷へ挑む。',
    },
    chr_marsh_chapter_iii: {
      name: 'マイアフェンの年代記',
      desc: '沼沢の物語を最後まで見届ける：教団の野営地を打ち砕き、沈んだ砦でフォグバインダーを黙らせ、霧に名だたる恐怖をことごとく討ち倒す。',
      title: 'マイアフェンの語り部',
    },
    chr_marsh_gatherer: {
      name: 'フェンブリッジの採集行',
      desc: 'マイアフェン湿地で鉱脈、木立、薬草の茂みをそれぞれ採取する。',
    },
    chr_marsh_unburst: {
      name: '胞子の上に立つな',
      desc: '腐食胞子の破裂に巻き込まれることなく、沼の膨れ者を8体倒す。',
    },
    chr_marsh_hush_the_mending: {
      name: '手当てを封じよ',
      desc: 'グレイブコーラーの野営地で、グレイブコーラーの癒し手を、その世話を受ける信徒の誰よりも先に仕留める。',
    },
    chr_marsh_rares: {
      name: '霧に名だたる者',
      desc: 'マイアフェン湿地に名だたる3体の恐怖、貪るマイアジョー、溺れし者スルームトゥース、シスター・ナリアを討ち倒す。',
    },
    chr_peaks_chapter_i: {
      name: '高地年代記 第一章',
      desc: 'ゼンジーの年代記の第一章を仕上げる：尾根の道を掃討し、巣穴を空にし、ハイウォッチが守るすべての道を知る。',
    },
    chr_peaks_chapter_ii: {
      name: '高地年代記 第二章',
      desc: 'ゼンジーの年代記の第二章を仕上げる：ドログマーの戦営を打ち破り、目覚めゆく嵐を読み解き、グリマーミアが輝くその畔に立つ。',
    },
    chr_peaks_chapter_iii: {
      name: 'ソーンピークの年代記',
      desc: '山の物語を最後まで見届ける：ワーム教団を壊滅させ、聖所を鎮め、目覚めし峰を打ち倒し、岩山に名だたる恐怖をことごとく討ち倒す。',
      title: 'ソーンピークの語り部',
    },
    chr_peaks_sparring: {
      name: '城壁の型稽古',
      desc: 'ハイウォッチの高台にある訓練用ダミーに合計1,000のダメージを与える。',
    },
    chr_peaks_glimmer_cast: {
      name: '冷たい水、さらに冷たい光',
      desc: 'グリマーミアで魚を釣り上げる。',
    },
    chr_peaks_moongate: {
      name: '冷たき門をくぐって',
      desc: 'グリマーミアの岸辺にある月の門をくぐり抜ける。',
    },
    chr_peaks_waking_witness: {
      name: '歩く山',
      desc: 'サンザール、目覚めし峰が山を練り歩くその姿をこの目で見る。',
    },
    chr_peaks_rares: {
      name: '岩山に刻まれし名',
      desc: 'ソーンピーク高地に名だたる4体の恐怖、鉄脈の現場監督、頭蓋砕きブルトーク、燃え翼のヴォスカル、髄王ヴァーカスを討ち倒す。',
    },
    col_discovery_25: {
      name: 'ためこみ屋',
      desc: '25種類のアイテムを発見する（アイテムは初めて所持品に入った時点で数えられる）。',
    },
    col_discovery_75: { name: '光り物好きのカササギ', desc: '75種類のアイテムを発見する。' },
    col_discovery_150: {
      name: '驚異の陳列棚',
      desc: '150種類のアイテムを発見する。',
      title: '蒐集家',
    },
    col_discovery_250: { name: '大いなる目録', desc: '250種類のアイテムを発見する。' },
    col_first_rare: { name: 'サムシング・ブルー', desc: '初めてレア品質のアイテムを手に入れる。' },
    col_first_epic: { name: '高貴なる紫', desc: '初めてエピック品質のアイテムを手に入れる。' },
    col_first_legendary: {
      name: '果報は橙色',
      desc: '初めてレジェンダリー品質のアイテムを手に入れる。',
    },
    col_set_vale_arcanist: {
      name: '渓谷の秘術師の礼装',
      desc: '渓谷の秘術師の礼装の全部位を発見する。',
    },
    col_set_boundstone_vanguard: { name: '束縛石の先鋒', desc: '束縛石の先鋒の全部位を発見する。' },
    col_set_greyjaw_stalker: {
      name: 'グレイジョー追跡者の装具',
      desc: 'グレイジョー追跡者の装具の全部位を発見する。',
    },
    col_set_deathlord: {
      name: 'バロウロードの戦装備',
      desc: 'バロウロードの戦装備の全部位を発見する。',
    },
    col_set_wyrmshadow: {
      name: 'ナイトファングの装束',
      desc: 'ナイトファングの装束の全部位を発見する。',
    },
    col_set_necromancers: {
      name: 'モーンウィーヴの衣',
      desc: 'モーンウィーヴの衣の全部位を発見する。',
    },
    col_set_crownforged: {
      name: 'ボーンロートの礼装',
      desc: 'ボーンロートの礼装の全部位を発見する。',
    },
    col_set_nighttalon: {
      name: 'ダイアファングの毛皮',
      desc: 'ダイアファングの毛皮の全部位を発見する。',
    },
    col_set_soulflame: {
      name: 'レイスファイアの礼装',
      desc: 'レイスファイアの礼装の全部位を発見する。',
    },
    col_set_stormcallers: {
      name: 'ゲイルコールの装束',
      desc: 'ゲイルコールの装束の全部位を発見する。',
    },
    col_seven_regalia: {
      name: '七揃いの衣装箪笥',
      desc: 'エピック防具全7系統、その全部位を発見する。',
      title: '絢爛',
    },
    col_true_colors: { name: '本当の色', desc: 'クラス既定以外の見た目を身にまとって戦場に出る。' },
    col_all_slots: {
      name: '十一分の隙もなし',
      desc: '11か所の装備枠すべてに同時にアイテムを装備する。',
    },
    col_quartermaster_buyout: {
      name: 'お得意様',
      desc: '補給係ヴェックスの品揃え全10点を発見する。',
    },
    col_glimmerfin: { name: '希望のきらめき', desc: 'きらめきヒレの錦鯉を釣り上げる。' },
    col_full_creel: {
      name: '満杯の魚籠',
      desc: '渓谷、湿地、高地の水辺で釣れるコモンの獲物6種をすべて発見する。',
    },
    col_junk_drawer: { name: 'がらくたの引き出し', desc: 'プア品質のアイテムを10種類発見する。' },
    pvp_arena_first_match: {
      name: '砂の洗礼',
      desc: '灰燼のコロシアムで、どちらかの部門のランク戦を戦う。',
    },
    pvp_arena_first_win: {
      name: '沸き立つ観衆',
      desc: 'どちらかの部門でアリーナのランク戦に勝利する。',
    },
    pvp_arena_1v1_1600: {
      name: 'コロシアムの挑戦者',
      desc: 'アリーナの1v1部門でレート1600に到達する。',
    },
    pvp_arena_1v1_1750: {
      name: 'コロシアムの好敵手',
      desc: 'アリーナの1v1部門でレート1750に到達する。',
    },
    pvp_arena_1v1_1900: {
      name: 'グラディエーター',
      desc: 'アリーナの1v1部門でレート1900に到達する。',
      title: 'グラディエーター',
    },
    pvp_arena_2v2_1600: { name: '二人三脚', desc: 'アリーナの2v2部門でレート1600に到達する。' },
    pvp_arena_2v2_1750: { name: '戦慄の二人組', desc: 'アリーナの2v2部門でレート1750に到達する。' },
    pvp_arena_2v2_1900: { name: '完璧なる連携', desc: 'アリーナの2v2部門でレート1900に到達する。' },
    pvp_duel_first_win: { name: '表へ出ろ', desc: '決闘に勝利する。' },
    pvp_duel_grace: { name: '謙虚さの心得', desc: '威厳をおおむね保ったまま、決闘に敗れる。' },
    pvp_vcup_first_match: {
      name: 'ピッチに立つ',
      desc: '勝ち負けを問わず、ソウフィールドでのヴェイルカップの試合を最後まで戦い抜く。',
    },
    pvp_vcup_first_win: { name: '初めての銀杯', desc: 'ヴェイルカップのレート戦に勝利する。' },
    pvp_vcup_wins_10: { name: '熟練ボアボーラー', desc: 'ヴェイルカップのレート戦で10勝する。' },
    pvp_vcup_wins_25: {
      name: 'ボアボールの伝説',
      desc: 'ヴェイルカップのレート戦で25勝する。',
      title: 'ボアボールの伝説',
    },
    pvp_vcup_first_goal: { name: 'まずは一点', desc: 'ヴェイルカップのレート戦でゴールを決める。' },
    pvp_vcup_hat_trick: {
      name: 'ハットトリックの英雄',
      desc: '3v3以上の部門で、ヴェイルカップのレート戦1試合中に3ゴールを決める。',
    },
    pvp_vcup_golden_goal: {
      name: '黄金の瞬間',
      desc: 'ヴェイルカップのレート戦に決着をつけるゴールデンゴールを叩き込む。',
    },
    pvp_vcup_first_save: {
      name: '鉄壁の両手',
      desc: 'ヴェイルカップのレート戦でキーパーとしてセーブを決める。',
    },
    pvp_vcup_clean_sheet: {
      name: '何ひとつ通さない',
      desc: 'キーパーとして無失点のまま、ヴェイルカップのレート戦に勝利する。',
    },
    pvp_vcup_guild_win: {
      name: '旗の名にかけて',
      desc: 'ギルドの旗を掲げて出場したヴェイルカップのレート戦に勝利する。',
    },
    pvp_fiesta_first_bout: {
      name: '宴への乱入者',
      desc: '勝ち負けを問わず、2v2フィエスタの一戦を最後まで戦い抜く。',
    },
    pvp_fiesta_first_win: { name: '宴の主役', desc: '2v2フィエスタの一戦に勝利する。' },
    pvp_fiesta_double: { name: '二丁上がり', desc: 'フィエスタで4秒以内に2回の撃破を決める。' },
    pvp_fiesta_shutdown: {
      name: '祭りに水を差す者',
      desc: 'フィエスタで、3連続撃破以上の勢いに乗った敵を仕留める。',
    },
    pvp_fiesta_full_build: {
      name: '宴の正装',
      desc: '3回のウェーブすべてで強化を確定させた状態で、フィエスタの一戦に勝利する。',
    },
    pvp_fiesta_powerups: {
      name: '全部ひとつずつ',
      desc: 'リングの4種のパワーアップ、スピードデーモン、コロッサス、ムーンブーツ、バーサーカーをそれぞれ1回以上手に入れる。',
    },
    pvp_fiesta_five_kills: { name: '宴を背負う者', desc: 'フィエスタの一戦で5回の撃破を決める。' },
    soc_first_party: { name: '持つべきものは仲間', desc: '他のプレイヤーとパーティを組む。' },
    soc_full_house: { name: 'フルハウス', desc: '5人満員のパーティでダンジョンを攻略する。' },
    soc_guild_joined: { name: '同じ旗の下に', desc: 'ギルドの一員になる。' },
    soc_guild_founded: { name: '創設者の羽ペン', desc: '自分のギルドを設立する。' },
    soc_first_trade: { name: '公正な取引', desc: '他のプレイヤーとの取引を成立させる。' },
    soc_first_sale: { name: '本日開店', desc: '世界市場での初めての売上金を受け取る。' },
    soc_steady_custom: {
      name: '堅実な商い',
      desc: '世界市場の売上から生涯累計10ゴールドを受け取る。',
    },
    soc_market_magnate: {
      name: '市場の豪商',
      desc: '世界市場の売上から生涯累計100ゴールドを受け取る。',
      title: '豪商',
    },
    soc_by_ravens_wing: {
      name: '鴉の翼に乗せて',
      desc: '硬貨か小包を託したレイヴンポストの手紙を送る。',
    },
    soc_room_for_more: { name: 'まだまだ入る', desc: '銀行の拡張を初めて購入する。' },
    soc_gilded_strongbox: {
      name: '金張りの金庫',
      desc: '出納官が売ってくれる銀行の拡張をすべて購入する。',
    },
    soc_meet_bursar: {
      name: '我らフェルナンドを信ず',
      desc: 'イーストブルックで金張りの金庫を預かる出納官フェルナンドのもとを訪れ、敬意を表する。',
    },
    soc_pocket_money: { name: '小遣い銭', desc: '硬貨を生涯累計で1ゴールド拾い集める。' },
    soc_heavy_purse: { name: 'ずっしり重い財布', desc: '硬貨を生涯累計で10ゴールド拾い集める。' },
    soc_wyrms_hoard: { name: 'ワームの財宝', desc: '硬貨を生涯累計で100ゴールド拾い集める。' },
    soc_civic_duty: { name: '市民の務め', desc: '町の重点ポイントを初めて割り振る。' },
    exp_long_road_north: {
      name: '北への長い道',
      desc: '3つの拠点集落、イーストブルック、フェンブリッジ、ハイウォッチをすべて訪れる。',
    },
    exp_vale_wayfarer: {
      name: '渓谷の旅人',
      desc: 'イーストブルック渓谷の名のある場所11か所をすべて訪れる。',
    },
    exp_marsh_wayfarer: {
      name: '湿地の旅人',
      desc: 'マイアフェン湿地の名のある場所8か所をすべて訪れる。',
    },
    exp_peaks_wayfarer: {
      name: '高地の旅人',
      desc: 'ソーンピーク高地の名のある場所10か所をすべて訪れる。',
    },
    exp_world_traveler: {
      name: '世界を巡る者',
      desc: '3つの地方すべてで「旅人」の功績を獲得する。',
      title: '旅人',
    },
    exp_something_shiny: { name: 'きらりと光るもの', desc: '地面できらめく物を拾い上げる。' },
    exp_first_ore: { name: '大地を穿て', desc: '初めての鉱脈から鉱石を採掘する。' },
    exp_first_timber: { name: '倒れるぞーっ！', desc: '初めての立ち木を伐採する。' },
    exp_first_herb: { name: '緑の指', desc: '初めての薬草を摘み取る。' },
    feat_era_cap: { name: '第一の時代の申し子', desc: '第一の時代のさなかにレベル20へ到達した。' },
    feat_book_complete: { name: '書のすべて', desc: '功績の書に載るすべての功績を獲得する。' },
    feat_brightwood_relic: {
      name: 'ブライトウッドの追憶',
      desc: '旧きブライトウッドの遺品、茨革のジャーキンまたは君主の王冠を持ち続ける。',
    },
    hid_saul_footnote: {
      name: '歴史の脚注',
      desc: '年代記官ソールに休む間もなく9回つきまとった。',
      title: '脚注',
    },
    hid_gilded_tour: {
      name: '金張り巡りの旅',
      desc: '金張りの金庫の3つの支店すべてで取引をした。',
    },
    hid_fall_death: { name: '重力は常に勝つ', desc: '地面との長い対話の末に死んだ。' },
    hid_keepers_toll_twice: {
      name: '番人は二度取り立てる',
      desc: '「番人の通行料」がまだ重くのしかかっているうちに死んだ。',
    },
    hid_roll_hundred: { name: 'ナチュラル100', desc: '素の/rollで100ぴったりを出した。' },
    hid_yumi_cheer: {
      name: 'ユミの一番のファン',
      desc: '試合の最中、ユミの耳に届くところで声援を送った。',
    },
    hid_bountiful_coffer: {
      name: '紫の宝匣',
      desc: '錠が噛んでしまう前に豊穣の宝匣をこじ開けた。',
    },
    hid_companion_save: {
      name: '彼女の目の黒いうちは',
      desc: 'デルヴの相棒が、倒れた仲間を引きずり起こして立たせた。',
    },
    hid_codfather: {
      name: 'ファミリーの一員に',
      desc: 'ディープフェンの浅瀬からタラのゴッドファーザーを引きずり上げた。',
    },
    prog_crown_below: {
      name: '地の底の王冠',
      desc: '安らがぬ骨の野から王ナイスラクシスの墓所まで王冠の行方を辿り、「災厄の終わり」を成し遂げる。',
    },
    prog_mere_at_rest: {
      name: '湖水は眠りにつく',
      desc: '聖歌隊を沈黙させ、蒼渦を討ち、溺月を安らかな眠りにつかせて、オンドレル・ヴェインの見張りを最後まで見届ける。',
    },
    prog_callused_hands: {
      name: '手のマメも勲章',
      desc: '「どの手にも生業を」を完了し、イーストブルックの生業で最初のマメをこしらえる。',
    },
    prog_tools_of_the_trade: {
      name: '商売道具',
      desc: 'ハイウォッチの製作拠点で、設備の必要な製作を完了する。',
    },
    dgn_nythraxis_crypt: {
      name: '墓所が守りしもの',
      desc: '放棄された地下墓所へ足を踏み入れ、その守護者たちから要石の両片と古い日誌を回収する。',
    },
    chr_marsh_first_cast: {
      name: '葦間のウナギ',
      desc: 'マイアフェン湿地の水辺で魚を釣り上げる。',
    },
  },
  ko_KR: {
    prog_first_steps: {
      name: '첫걸음',
      desc: '레벨 2를 달성하고 머나먼 여정의 첫걸음을 내디디십시오.',
    },
    prog_finding_your_feet: {
      name: '걸음마 떼기',
      desc: '레벨 5를 달성하십시오. 야생이 벌써 조금은 만만해 보입니다.',
    },
    prog_double_digits: { name: '두 자릿수', desc: '레벨 10을 달성하고 특성을 해금하십시오.' },
    prog_the_long_middle: { name: '길고 긴 중반', desc: '레벨 15를 달성하십시오.' },
    prog_level_cap: { name: '정상에서 보는 풍경', desc: '최고 레벨인 레벨 20을 달성하십시오.' },
    prog_well_rested: {
      name: '충분한 휴식',
      desc: '휴식 경험치가 쌓일 때까지 여관에 머무르십시오.',
    },
    prog_talented: { name: '값진 한 점', desc: '첫 특성 점수를 사용하십시오.' },
    prog_specialized: { name: '출사표', desc: '전문화를 선택하고 그 대표 기술을 배우십시오.' },
    prog_deep_roots: {
      name: '깊이 내린 뿌리',
      desc: '마지막 단의 특성에 특성 점수를 사용하십시오.',
    },
    prog_full_build: {
      name: '온전한 열하나',
      desc: '특성 점수 11점을 모두 하나의 조합에 투자하십시오.',
    },
    prog_veteran: { name: '베테랑', desc: '누적 경험치 250,000을 획득하십시오.', title: '베테랑' },
    prog_champion: { name: '용사', desc: '누적 경험치 500,000을 획득하십시오.', title: '용사' },
    prog_paragon: { name: '귀감', desc: '누적 경험치 1,000,000을 획득하십시오.', title: '귀감' },
    prog_mythic: { name: '신화', desc: '누적 경험치 2,500,000을 획득하십시오.', title: '신화' },
    prog_eternal: { name: '영원', desc: '누적 경험치 5,000,000을 획득하십시오.', title: '영원' },
    prog_prestige: {
      name: '다시, 처음부터',
      desc: '최고 레벨에 도달한 뒤 경험치 막대를 한 번 더 채워 프레스티지 1등급을 획득하십시오.',
    },
    prog_prestige_5: { name: '몸에 밴 습관', desc: '프레스티지 5등급을 달성하십시오.' },
    prog_prestige_10: { name: '영구 기관', desc: '프레스티지 10등급을 달성하십시오.' },
    prog_first_harvest: { name: '들녘의 결실', desc: '첫 채집 지점을 수확하십시오.' },
    prog_mining_100: { name: '핏줄에 흐르는 광석', desc: '채광 숙련도 100을 달성하십시오.' },
    prog_logging_100: { name: '심재를 베는 자', desc: '벌목 숙련도 100을 달성하십시오.' },
    prog_herbalism_100: { name: '초원의 달인', desc: '약초 채집 숙련도 100을 달성하십시오.' },
    prog_master_gatherer: {
      name: '채집의 대가',
      desc: '채광, 벌목, 약초 채집 숙련도를 모두 100까지 올리십시오.',
    },
    prog_first_craft: { name: '손수 만든 물건', desc: '첫 제작을 성공적으로 완료하십시오.' },
    prog_craft_specialist: {
      name: '장인의 비법',
      desc: '한 가지 제작 기술을 75까지 올려 전문화 특전을 해금하십시오.',
    },
    prog_around_the_ring: {
      name: '공방 한 바퀴',
      desc: '서로 다른 다섯 가지 제작 기술을 25까지 올리십시오.',
    },
    cmb_first_blood: { name: '첫 피', desc: '첫 적을 처치하십시오.' },
    cmb_slayer: { name: '학살자', desc: '적 1,000명을 처치하십시오.' },
    cmb_legion_of_one: { name: '1인 군단', desc: '적 10,000명을 처치하십시오.' },
    cmb_heavy_hitter: { name: '강타자', desc: '총 500,000의 피해를 입히십시오.' },
    cmb_critical_eye: { name: '치명적인 눈', desc: '치명타를 500회 적중시키십시오.' },
    cmb_giantslayer: {
      name: '거인 사냥꾼',
      desc: '자신보다 레벨이 5 이상 높은 적에게 결정타를 날리십시오.',
    },
    cmb_first_fall: {
      name: '툭툭 털고 일어나기',
      desc: '처음으로 죽음을 맞이하십시오. 누구에게나 있는 일입니다.',
    },
    dgn_hollow_crypt: {
      name: '묘실을 깨뜨린 자',
      desc: '텅 빈 묘실에서 무덤부름 모르덴을 처치하십시오.',
    },
    dgn_sunken_bastion: {
      name: '안개의 매듭을 풀다',
      desc: '가라앉은 요새에서 안개엮는자 바엘을 처치하십시오.',
    },
    dgn_drowned_temple: {
      name: '달을 가라앉히다',
      desc: '익사한 신전에서 이솔레이, 익사한 달의 화신을 처치하십시오.',
    },
    dgn_gravewyrm_sanctum: {
      name: '지하의 고룡',
      desc: '무덤고룡 성소에서 무덤고룡 코르줄을 처치하십시오.',
    },
    dgn_hollow_crypt_heroic: {
      name: '영웅: 텅 빈 묘실',
      desc: '영웅 난이도의 텅 빈 묘실에서 무덤부름 모르덴을 처치하십시오.',
    },
    dgn_sunken_bastion_heroic: {
      name: '영웅: 가라앉은 요새',
      desc: '영웅 난이도의 가라앉은 요새에서 안개엮는자 바엘을 처치하십시오.',
    },
    dgn_drowned_temple_heroic: {
      name: '영웅: 익사한 신전',
      desc: '영웅 난이도의 익사한 신전에서 이솔레이, 익사한 달의 화신을 처치하십시오.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: '영웅: 무덤고룡 성소',
      desc: '영웅 난이도의 무덤고룡 성소에서 무덤고룡 코르줄을 처치하십시오.',
    },
    dgn_nythraxis: {
      name: '재앙의 끝',
      desc: '봉인된 왕실 문 너머에서 나이트락시스, 손피크의 재앙을 처치하십시오.',
    },
    dgn_nythraxis_heroic: {
      name: '영웅: 재앙의 끝',
      desc: '영웅 난이도에서 나이트락시스, 손피크의 재앙을 처치하십시오.',
    },
    dgn_thornpeak_rounds: {
      name: '던전 순례',
      desc: '텅 빈 묘실, 가라앉은 요새, 익사한 신전, 무덤고룡 성소를 모두 공략하십시오.',
    },
    dgn_deepward: {
      name: '심연 파수꾼',
      desc: '모든 던전과 공격대, 두 탐굴을 영웅 난이도로 정복하십시오.',
    },
    dgn_mark_circuit: {
      name: '완주',
      desc: '하루 안에 네 곳의 영웅 던전 모두에서 영웅의 징표를 획득하십시오.',
    },
    dgn_boss_clears_50: {
      name: '쉰 번째 문 너머',
      desc: '던전 최종 우두머리를 50번 처치하십시오.',
    },
    dgn_morthen_flawless: {
      name: '뼈도 못 추리게',
      desc: '파티원이 한 명도 죽지 않고 영웅 난이도에서 무덤부름 모르덴을 처치하십시오.',
    },
    dgn_morthen_trio: {
      name: '무덤에 맞선 셋',
      desc: '3명 이하의 플레이어로 무덤부름 모르덴을 처치하십시오.',
    },
    dgn_olen_arc: {
      name: '사신을 비껴가다',
      desc: '기사대장 올렌을 처치하되, 그의 수확의 호가 현재 대상 외에는 누구도 맞히지 않게 하십시오.',
    },
    dgn_vael_thralls: {
      name: '노예는 없다',
      desc: '안개엮는자 바엘이 불러내는 익사한 노예를 모두 처치한 상태에서 그를 쓰러뜨리십시오.',
    },
    dgn_ysolei_moonspawn: {
      name: '달의 부산물까지 남김없이',
      desc: '이솔레이가 불러내는 달의 부산물을 모두 처치한 상태에서 그녀를 쓰러뜨리십시오.',
    },
    dgn_ysolei_flawless: {
      name: '젖지 않은 눈',
      desc: '파티원이 한 명도 죽지 않고 영웅 난이도에서 이솔레이, 익사한 달의 화신을 처치하십시오.',
    },
    dgn_velkhar_bonewalkers: {
      name: '무덤에 도로 잠들라',
      desc: '대강령술사 벨카르가 쓰러지기 전에 되살아난 뼈걸음꾼을 모두 파괴하고 그를 처치하십시오.',
    },
    dgn_korzul_flawless: {
      name: '고룡을 쓰러뜨린 자',
      desc: '파티원이 한 명도 죽지 않고 영웅 난이도에서 무덤고룡 코르줄을 처치하십시오.',
      title: '고룡을 쓰러뜨린 자',
    },
    dgn_sanctum_speed: {
      name: '성소 질주',
      desc: '파티가 무덤고룡 성소를 차지한 뒤 15분 안에 무덤고룡 코르줄을 처치하십시오.',
    },
    dgn_nythraxis_gravebreaker: {
      name: '왕 앞에 무릎 꿇지 않으리',
      desc: '나이트락시스를 처치하되, 무덤파쇄가 현재 대상 외에는 누구도 맞히지 않게 하십시오.',
    },
    dgn_nythraxis_wardens: {
      name: '수호석의 파수꾼',
      desc: '모든 불사의 격노를 발동하기 전에 끊어 내고 나이트락시스를 처치하십시오.',
    },
    dgn_nythraxis_deathless: {
      name: '진정한 불사',
      desc: '공격대원이 단 한 명도 죽지 않고 영웅 난이도에서 나이트락시스, 손피크의 재앙을 처치하십시오.',
      title: '불사신',
    },
    cmb_thunzharr: {
      name: '산이 무너지다',
      desc: '스톰크래그에서 천자르, 깨어나는 봉우리를 쓰러뜨리십시오.',
    },
    cmb_thunzharr_unbroken: {
      name: '봉우리를 부순 자',
      desc: '첫 일격부터 마지막 숨이 끊어질 때까지 한 번도 죽지 않고 천자르, 깨어나는 봉우리를 쓰러뜨리십시오.',
      title: '봉우리를 부순 자',
    },
    cmb_thunzharr_ten: {
      name: '산 사냥이 몸에 배다',
      desc: '천자르, 깨어나는 봉우리를 10번 쓰러뜨리십시오.',
    },
    dlv_reliquary: { name: '성물실 질주', desc: '무너진 성물실을 돌파하십시오.' },
    dlv_reliquary_heroic: {
      name: '영웅: 무너진 성물실',
      desc: '영웅 단계에서 무너진 성물실을 돌파하십시오.',
    },
    dlv_litany: { name: '잠잠해진 연도', desc: '익사한 연도를 돌파하십시오.' },
    dlv_litany_heroic: {
      name: '영웅: 익사한 연도',
      desc: '영웅 단계에서 익사한 연도를 돌파하십시오.',
    },
    dlv_lore_journal: { name: '여백의 기록', desc: '탐굴 일지의 다섯 항목을 모두 해금하십시오.' },
    dlv_companion_max: {
      name: '깊은 곳의 벗',
      desc: '탐굴 동료 하나를 최고 등급까지 성장시키십시오.',
    },
    dlv_companions_both: {
      name: '두 등불을 밝히다',
      desc: '두 탐굴 동료, 수련사제 테사와 에다 리드핸드를 모두 최고 등급까지 성장시키십시오.',
    },
    dlv_clears_50: { name: '쉰 길 깊이', desc: '탐굴을 50회 완료하십시오.' },
    dlv_solo_heroic: {
      name: '둘이면 만원',
      desc: '다른 플레이어 없이 당신과 동료 단둘이서 영웅 단계 탐굴을 돌파하십시오.',
    },
    dlv_tumbler_premium: {
      name: '자물쇠의 길, 통달',
      desc: '가장 높은 판돈을 걸고 단 한 번뿐인 시도를 실수 없이 성공하여, 결계 걸린 성물실 상자를 여십시오.',
    },
    dlv_rite_flawless: {
      name: '한 글자도 틀림없이',
      desc: '익사한 성물실 의식을 단 하나의 실수도 없이 완수하십시오.',
    },
    dlv_varric_ringers: {
      name: '종은 침묵한다',
      desc: '부제 바릭이 일으킨 장례 종지기를 모두 처치한 상태로 그를 물리치십시오.',
    },
    dlv_nhalia_bells: {
      name: '종을 재우는 자',
      desc: '파티원 누구도 울리는 종에 맞지 않은 채 나할리아 수녀, 익사한 성가를 물리치십시오.',
      title: '종을 재우는 자',
    },
    chr_vale_chapter_i: {
      name: '골짜기 연대기, 제1장',
      desc: '사울의 연대기 제1장을 끝마치십시오: 이스트브룩의 첫 심부름을 마치고, 골짜기의 지리를 익히고, 그 땅의 생업을 처음 맛보십시오.',
    },
    chr_vale_chapter_ii: {
      name: '골짜기 연대기, 제2장',
      desc: '사울의 연대기 제2장을 끝마치십시오: 도적과 멀록과 광산의 해로운 짐승들을 처치하고, 소우필드에서 경기를 뛰고, 성물실에 도전하십시오.',
    },
    chr_vale_chapter_iii: {
      name: '골짜기의 연대기',
      desc: '골짜기의 이야기를 끝까지 지켜보십시오: 무덤부름의 정체를 밝히고, 텅 빈 묘실을 정화하고, 골짜기의 이름난 공포를 모두 쓰러뜨리십시오.',
      title: '골짜기의 증인',
    },
    chr_vale_gatherer: {
      name: '땅이 먹여 살린다',
      desc: '이스트브룩 골짜기에서 광맥, 나무 군락, 약초밭을 하나씩 채집하십시오.',
    },
    chr_vale_first_cast: {
      name: '거울호수의 무언가',
      desc: '이스트브룩 골짜기의 물에서 물고기 한 마리를 낚으십시오.',
    },
    chr_vale_packbreaker: {
      name: '무리를 흩는 자',
      desc: '10초 안에 숲늑대 3마리를 처치하십시오.',
    },
    chr_vale_cup_debut: {
      name: '구리 양동이 도전자',
      desc: '소우필드에서 열리는 골짜기 컵 경기에 나서서 공을 만져 보십시오.',
    },
    chr_vale_rares: {
      name: '골짜기의 공포',
      desc: '이스트브룩 골짜기의 이름난 공포 다섯을 처치하십시오: 늙은 그레이죠, 모거, 땅굴왕 그릭스, 베를란 대장, 영혼결속자 말드렉.',
    },
    chr_marsh_chapter_i: {
      name: '습지 연대기, 제1장',
      desc: '오스릭 펜의 연대기 제1장을 끝마치십시오: 펜브리지의 소집에 응하고, 둑길을 지켜 내고, 늪의 생김새를 익히십시오.',
    },
    chr_marsh_chapter_ii: {
      name: '습지 연대기, 제2장',
      desc: '오스릭 펜의 연대기 제2장을 끝마치십시오: 과부거미를 불태워 몰아내고, 익사한 망자를 영면에 들게 하고, 대구 대부를 낚아 올리고, 연도에 도전하십시오.',
    },
    chr_marsh_chapter_iii: {
      name: '마이어펜의 연대기',
      desc: '늪의 이야기를 끝까지 지켜보십시오: 교단의 야영지를 무너뜨리고, 가라앉은 요새에서 안개엮는자를 침묵시키고, 안개의 이름난 공포를 모두 쓰러뜨리십시오.',
      title: '마이어펜의 증인',
    },
    chr_marsh_gatherer: {
      name: '펜브리지 채집꾼',
      desc: '마이어펜 습지에서 광맥, 나무 군락, 약초밭을 하나씩 채집하십시오.',
    },
    chr_marsh_unburst: {
      name: '포자를 밟지 마시오',
      desc: '부식성 포자 폭발에 휘말리지 않고 늪 부푼괴물 8마리를 처치하십시오.',
    },
    chr_marsh_hush_the_mending: {
      name: '치유부터 끊어라',
      desc: '무덤부름 야영지에서, 무덤부름 치유사가 돌보는 교단원들보다 먼저 치유사를 처치하십시오.',
    },
    chr_marsh_rares: {
      name: '안개 속의 이름들',
      desc: '마이어펜 습지의 이름난 공포 셋을 처치하십시오: 굶주린 마이어죠, 익사한 슬룸투스, 자매 날리아.',
    },
    chr_peaks_chapter_i: {
      name: '고지 연대기, 제1장',
      desc: '젠지의 연대기 제1장을 끝마치십시오: 산등성이 길을 소탕하고, 굴을 비우고, 하이워치가 지키는 모든 길을 익히십시오.',
    },
    chr_peaks_chapter_ii: {
      name: '고지 연대기, 제2장',
      desc: '젠지의 연대기 제2장을 끝마치십시오: 드로그마르의 전쟁 야영지를 부수고, 깨어나는 폭풍을 읽어 내고, 글리머미어가 빛나는 곳에 서십시오.',
    },
    chr_peaks_chapter_iii: {
      name: '쏜피크의 연대기',
      desc: '산의 이야기를 끝까지 지켜보십시오: 고룡교단을 무너뜨리고, 성소를 침묵시키고, 깨어나는 봉우리를 쓰러뜨리고, 바위산의 이름난 공포를 모두 처치하십시오.',
      title: '쏜피크의 증인',
    },
    chr_peaks_sparring: {
      name: '성벽 훈련',
      desc: '하이워치 위쪽의 훈련용 허수아비에게 총 1,000의 피해를 입히십시오.',
    },
    chr_peaks_glimmer_cast: {
      name: '찬 물, 더 찬 빛',
      desc: '글리머미어에서 물고기 한 마리를 낚으십시오.',
    },
    chr_peaks_moongate: {
      name: '차가운 관문을 지나',
      desc: '글리머미어 호숫가의 달의 관문을 통과하십시오.',
    },
    chr_peaks_waking_witness: {
      name: '걸어 다니는 산',
      desc: '산을 성큼성큼 누비는 천자르, 깨어나는 봉우리를 직접 목격하십시오.',
    },
    chr_peaks_rares: {
      name: '바위에 새겨진 이름들',
      desc: '쏜피크 고지의 이름난 공포 넷을 처치하십시오: 철맥 감독관, 해골분쇄자 브루톡, 잿불날개 보스카르, 골수군주 바르카스.',
    },
    col_discovery_25: {
      name: '못 버리는 성미',
      desc: '서로 다른 아이템 25종을 발견하십시오 (아이템은 처음으로 당신의 소유가 된 순간 집계됩니다).',
    },
    col_discovery_75: { name: '까치의 눈', desc: '서로 다른 아이템 75종을 발견하십시오.' },
    col_discovery_150: {
      name: '호기심의 방',
      desc: '서로 다른 아이템 150종을 발견하십시오.',
      title: '학예사',
    },
    col_discovery_250: { name: '대도감', desc: '서로 다른 아이템 250종을 발견하십시오.' },
    col_first_rare: {
      name: '파랗게 빛나는 것',
      desc: '희귀 등급 아이템을 처음으로 손에 넣으십시오.',
    },
    col_first_epic: { name: '자줏빛 태생', desc: '영웅 등급 아이템을 처음으로 손에 넣으십시오.' },
    col_first_legendary: {
      name: '행운의 주황빛',
      desc: '전설 등급 아이템을 처음으로 손에 넣으십시오.',
    },
    col_set_vale_arcanist: {
      name: '골짜기 비전술사 예복',
      desc: '골짜기 비전술사 예복의 모든 부위를 발견하십시오.',
    },
    col_set_boundstone_vanguard: {
      name: '속박석 선봉대',
      desc: '속박석 선봉대의 모든 부위를 발견하십시오.',
    },
    col_set_greyjaw_stalker: {
      name: '그레이죠 추적자 장비',
      desc: '그레이죠 추적자 장비의 모든 부위를 발견하십시오.',
    },
    col_set_deathlord: {
      name: '고분군주 전투장비',
      desc: '고분군주 전투장비의 모든 부위를 발견하십시오.',
    },
    col_set_wyrmshadow: {
      name: '밤송곳니 의복',
      desc: '밤송곳니 의복의 모든 부위를 발견하십시오.',
    },
    col_set_necromancers: {
      name: '비탄직물 의복',
      desc: '비탄직물 의복의 모든 부위를 발견하십시오.',
    },
    col_set_crownforged: { name: '뼈벼림 예복', desc: '뼈벼림 예복의 모든 부위를 발견하십시오.' },
    col_set_nighttalon: {
      name: '흉포송곳니 가죽',
      desc: '흉포송곳니 가죽의 모든 부위를 발견하십시오.',
    },
    col_set_soulflame: { name: '망령불꽃 예복', desc: '망령불꽃 예복의 모든 부위를 발견하십시오.' },
    col_set_stormcallers: {
      name: '강풍부름 의복',
      desc: '강풍부름 의복의 모든 부위를 발견하십시오.',
    },
    col_seven_regalia: {
      name: '일곱 겹 옷장',
      desc: '일곱 가지 영웅 방어구 세트의 모든 부위를 발견하십시오.',
      title: '찬란한 자',
    },
    col_true_colors: {
      name: '본색을 드러내다',
      desc: '직업 기본 외형이 아닌 다른 외형을 걸치고 전장에 나서십시오.',
    },
    col_all_slots: {
      name: '열한 곳 빈틈없이',
      desc: '열한 개의 장비 칸 전부에 아이템을 동시에 장착하십시오.',
    },
    col_quartermaster_buyout: {
      name: '단골 손님',
      desc: '병참장교 벡스의 취급 물품 열 가지를 모두 발견하십시오.',
    },
    col_glimmerfin: { name: '희망의 반짝임', desc: '반짝이는 지느러미 코이를 낚으십시오.' },
    col_full_creel: {
      name: '가득 찬 어망',
      desc: '골짜기, 습지, 고지의 물에서 나는 여섯 가지 흔한 어획물을 모두 발견하십시오.',
    },
    col_junk_drawer: {
      name: '잡동사니 서랍',
      desc: '서로 다른 하급 등급 아이템 10종을 발견하십시오.',
    },
    pvp_arena_first_match: {
      name: '신발 속 모래',
      desc: '잿빛 투기장에서 어느 부문이든 등급전 한 경기를 치르십시오.',
    },
    pvp_arena_first_win: {
      name: '관중의 함성',
      desc: '어느 부문이든 등급전 투기장 경기에서 승리하십시오.',
    },
    pvp_arena_1v1_1600: {
      name: '투기장의 도전자',
      desc: '1대1 투기장 부문에서 평점 1600을 달성하십시오.',
    },
    pvp_arena_1v1_1750: {
      name: '투기장의 호적수',
      desc: '1대1 투기장 부문에서 평점 1750을 달성하십시오.',
    },
    pvp_arena_1v1_1900: {
      name: '검투사',
      desc: '1대1 투기장 부문에서 평점 1900을 달성하십시오.',
      title: '검투사',
    },
    pvp_arena_2v2_1600: {
      name: '둘이면 충분하다',
      desc: '2대2 투기장 부문에서 평점 1600을 달성하십시오.',
    },
    pvp_arena_2v2_1750: {
      name: '무시무시한 2인조',
      desc: '2대2 투기장 부문에서 평점 1750을 달성하십시오.',
    },
    pvp_arena_2v2_1900: {
      name: '완벽한 공조',
      desc: '2대2 투기장 부문에서 평점 1900을 달성하십시오.',
    },
    pvp_duel_first_win: { name: '결판은 밖에서', desc: '결투에서 승리하십시오.' },
    pvp_duel_grace: {
      name: '겸손의 가르침',
      desc: '결투에서 지되, 체면은 그럭저럭 지켜 내십시오.',
    },
    pvp_vcup_first_match: {
      name: '그라운드에 선 첫발',
      desc: '소우필드에서 골짜기 컵 경기 한 판을 승패에 관계없이 끝까지 치르십시오.',
    },
    pvp_vcup_first_win: { name: '첫 우승컵', desc: '등급전 골짜기 컵 경기에서 승리하십시오.' },
    pvp_vcup_wins_10: {
      name: '노련한 멧돼지공 선수',
      desc: '등급전 골짜기 컵 경기에서 10회 승리하십시오.',
    },
    pvp_vcup_wins_25: {
      name: '멧돼지공의 전설',
      desc: '등급전 골짜기 컵 경기에서 25회 승리하십시오.',
      title: '멧돼지공의 전설',
    },
    pvp_vcup_first_goal: {
      name: '마수걸이 골',
      desc: '등급전 골짜기 컵 경기에서 골을 넣으십시오.',
    },
    pvp_vcup_hat_trick: {
      name: '해트트릭의 주인공',
      desc: '3대3 이상 부문의 등급전 골짜기 컵 경기 한 판에서 세 골을 넣으십시오.',
    },
    pvp_vcup_golden_goal: {
      name: '황금의 순간',
      desc: '등급전 골짜기 컵 경기의 승부를 가르는 골든골을 넣으십시오.',
    },
    pvp_vcup_first_save: {
      name: '든든한 두 손',
      desc: '등급전 골짜기 컵 경기에서 골키퍼로 선방에 성공하십시오.',
    },
    pvp_vcup_clean_sheet: {
      name: '철벽 수문장',
      desc: '골키퍼로 한 골도 내주지 않고 등급전 골짜기 컵 경기에서 승리하십시오.',
    },
    pvp_vcup_guild_win: {
      name: '깃발을 위하여',
      desc: '길드의 깃발 아래 출전한 등급전 골짜기 컵 경기에서 승리하십시오.',
    },
    pvp_fiesta_first_bout: {
      name: '잔치의 불청객',
      desc: '2대2 피에스타 한 판을 승패에 관계없이 끝까지 싸우십시오.',
    },
    pvp_fiesta_first_win: {
      name: '피에스타의 주인공',
      desc: '2대2 피에스타 한 판에서 승리하십시오.',
    },
    pvp_fiesta_double: { name: '연달아 둘', desc: '4초 안에 피에스타 처치 2회를 기록하십시오.' },
    pvp_fiesta_shutdown: {
      name: '흥을 깨는 자',
      desc: '연속 처치 3회 이상을 이어 가던 피에스타 상대를 쓰러뜨리십시오.',
    },
    pvp_fiesta_full_build: {
      name: '완벽한 채비',
      desc: '세 웨이브 모두에서 증강을 확정한 채 피에스타 한 판에서 승리하십시오.',
    },
    pvp_fiesta_powerups: {
      name: '하나씩 전부',
      desc: '링의 파워업 네 가지를 각각 한 번 이상 획득하십시오: 질주광, 거상, 달 장화, 광전사.',
    },
    pvp_fiesta_five_kills: {
      name: '잔치를 짊어지다',
      desc: '피에스타 한 판에서 처치 5회를 기록하십시오.',
    },
    soc_first_party: {
      name: '함께라면 더 멀리',
      desc: '다른 플레이어와 함께 파티에 들어가십시오.',
    },
    soc_full_house: {
      name: '풀 하우스',
      desc: '다섯 명이 꽉 찬 파티로 던전을 끝까지 공략하십시오.',
    },
    soc_guild_joined: { name: '하나의 깃발 아래', desc: '길드의 일원이 되십시오.' },
    soc_guild_founded: { name: '창립자의 깃펜', desc: '자신만의 길드를 창설하십시오.' },
    soc_first_trade: { name: '공정한 거래', desc: '다른 플레이어와 거래를 완료하십시오.' },
    soc_first_sale: { name: '개업 첫날', desc: '세계 시장에서 첫 판매 대금을 수령하십시오.' },
    soc_steady_custom: { name: '단골 장사', desc: '세계 시장 판매로 통산 10골드를 수령하십시오.' },
    soc_market_magnate: {
      name: '시장의 거물',
      desc: '세계 시장 판매로 통산 100골드를 수령하십시오.',
      title: '거물',
    },
    soc_by_ravens_wing: {
      name: '까마귀 날개에 실어',
      desc: '돈이나 소포를 담은 까마귀 우편 편지를 보내십시오.',
    },
    soc_room_for_more: { name: '더 넣을 자리', desc: '첫 은행 확장을 구매하십시오.' },
    soc_gilded_strongbox: {
      name: '도금 금고',
      desc: '출납관이 팔아 주는 모든 은행 확장을 구매하십시오.',
    },
    soc_meet_bursar: {
      name: '페르난도를 믿을지어다',
      desc: '이스트브룩의 도금 금고를 지키는 출납관 페르난도에게 경의를 표하십시오.',
    },
    soc_pocket_money: { name: '쌈짓돈', desc: '통산 1골드의 돈을 전리품으로 획득하십시오.' },
    soc_heavy_purse: {
      name: '묵직한 돈주머니',
      desc: '통산 10골드의 돈을 전리품으로 획득하십시오.',
    },
    soc_wyrms_hoard: {
      name: '고룡의 보물더미',
      desc: '통산 100골드의 돈을 전리품으로 획득하십시오.',
    },
    soc_civic_duty: { name: '시민의 의무', desc: '첫 마을 중점 포인트를 배분하십시오.' },
    exp_long_road_north: {
      name: '북으로 가는 먼 길',
      desc: '세 거점 정착지를 모두 방문하십시오: 이스트브룩, 펜브리지, 하이워치.',
    },
    exp_vale_wayfarer: {
      name: '골짜기의 길손',
      desc: '이스트브룩 골짜기의 이름난 장소 11곳을 모두 방문하십시오.',
    },
    exp_marsh_wayfarer: {
      name: '습지의 길손',
      desc: '마이어펜 습지의 이름난 장소 8곳을 모두 방문하십시오.',
    },
    exp_peaks_wayfarer: {
      name: '고지의 길손',
      desc: '쏜피크 고지의 이름난 장소 10곳을 모두 방문하십시오.',
    },
    exp_world_traveler: {
      name: '세계 여행가',
      desc: '세 지역의 길손 업적을 모두 획득하십시오.',
      title: '길손',
    },
    exp_something_shiny: {
      name: '반짝이는 무언가',
      desc: '땅에 떨어진 반짝이는 물건을 주우십시오.',
    },
    exp_first_ore: { name: '땅을 내리쳐라', desc: '처음으로 광맥을 캐내십시오.' },
    exp_first_timber: { name: '나무 넘어간다!', desc: '처음으로 나무를 베어 목재를 거두십시오.' },
    exp_first_herb: { name: '약초 캐는 손', desc: '처음으로 약초를 캐십시오.' },
    feat_era_cap: {
      name: '제1시대의 아이',
      desc: '제1시대가 이어지는 동안 레벨 20을 달성했습니다.',
    },
    feat_book_complete: {
      name: '책 한 권을 통째로',
      desc: '업적의 서에 실린 모든 업적을 획득하십시오.',
    },
    feat_brightwood_relic: {
      name: '브라이트우드를 기억하며',
      desc: '옛 브라이트우드의 유물을 간직하십시오: 가시가죽 저킨 또는 군주의 왕관.',
    },
    hid_saul_footnote: {
      name: '역사의 각주',
      desc: '연대기 기록관 사울을 쉴 틈 없이 아홉 번이나 졸라 댔습니다.',
      title: '각주',
    },
    hid_gilded_tour: { name: '도금빛 유람', desc: '도금 금고의 세 지점 모두와 거래를 했습니다.' },
    hid_fall_death: { name: '중력은 언제나 이긴다', desc: '땅바닥과 긴 대화를 나누다 죽었습니다.' },
    hid_keepers_toll_twice: {
      name: '지킴이는 두 번 거둔다',
      desc: '지킴이의 대가를 아직 짊어진 채 죽었습니다.',
    },
    hid_roll_hundred: { name: '내추럴 100', desc: '평범한 /roll에서 완벽한 100을 굴렸습니다.' },
    hid_yumi_cheer: {
      name: '유미의 열혈 팬',
      desc: '한창 경기 중에, 유미가 들을 수 있는 곳에서 응원을 보냈습니다.',
    },
    hid_bountiful_coffer: {
      name: '보랏빛 궤짝',
      desc: '자물쇠가 엉키기 전에 풍요의 궤짝을 따냈습니다.',
    },
    hid_companion_save: {
      name: '그녀가 지켜보는 한',
      desc: '탐굴 동료가 쓰러진 파티원을 부축해 다시 일으켜 세웠습니다.',
    },
    hid_codfather: { name: '패밀리 입단', desc: '딥펜 얕은 물에서 대구 대부를 끌어냈습니다.' },
    prog_crown_below: {
      name: '지하의 왕관',
      desc: "잠들지 못한 뼈밭에서 나이트락시스 왕의 무덤까지 왕관의 자취를 좇아 '재앙의 종말'을 끝까지 완수하십시오.",
    },
    prog_mere_at_rest: {
      name: '고요를 되찾은 호수',
      desc: '온드렐 베인의 불침번을 끝까지 함께하십시오: 성가대를 침묵시키고, 페일코일을 처치하고, 익사한 달을 잠재우십시오.',
    },
    prog_callused_hands: {
      name: '굳은살 박인 손',
      desc: "'모든 손을 위한 기술'을 완료하고 이스트브룩의 생업에서 첫 굳은살을 얻으십시오.",
    },
    prog_tools_of_the_trade: {
      name: '장인의 연장',
      desc: '하이워치 제작 거점에서 제작대가 필요한 제작을 완료하십시오.',
    },
    dgn_nythraxis_crypt: {
      name: '납골당이 지켜 온 것',
      desc: '버려진 납골당에 뛰어들어 그 수호자들에게서 열쇠돌 두 조각과 오래된 일지를 되찾으십시오.',
    },
    chr_marsh_first_cast: {
      name: '갈대밭의 뱀장어',
      desc: '마이어펜 습지의 물에서 물고기 한 마리를 낚으십시오.',
    },
  },
  nl_NL: {
    prog_first_steps: {
      name: 'Eerste Stappen',
      desc: 'Bereik level 2 en zet je eerste stap op een lange weg.',
    },
    prog_finding_your_feet: {
      name: 'Je Draai Vinden',
      desc: 'Bereik level 5; de wildernis oogt al een stukje kleiner.',
    },
    prog_double_digits: {
      name: 'Dubbele Cijfers',
      desc: 'Bereik level 10 en ontgrendel je talenten.',
    },
    prog_the_long_middle: { name: 'Het Lange Midden', desc: 'Bereik level 15.' },
    prog_level_cap: {
      name: 'Het Uitzicht vanaf de Top',
      desc: 'Bereik level 20, het hoogste level.',
    },
    prog_well_rested: {
      name: 'Goed Uitgerust',
      desc: 'Nestel je in een herberg tot je uitgeruste ervaring hebt verdiend.',
    },
    prog_talented: { name: 'Een Punt Goed Besteed', desc: 'Besteed je eerste talentpunt.' },
    prog_specialized: {
      name: 'Kleur Bekennen',
      desc: 'Kies een specialisatie en leer haar kenmerkende vaardigheid.',
    },
    prog_deep_roots: {
      name: 'Diepe Wortels',
      desc: 'Besteed een talentpunt aan een talent uit de onderste rij.',
    },
    prog_full_build: {
      name: 'Het Volle Elftal',
      desc: 'Besteed alle elf talentpunten binnen één build.',
    },
    prog_veteran: {
      name: 'Veteraan',
      desc: 'Verdien over je hele levensloop 250.000 ervaring.',
      title: 'Veteraan',
    },
    prog_champion: {
      name: 'Kampioen',
      desc: 'Verdien over je hele levensloop 500.000 ervaring.',
      title: 'Kampioen',
    },
    prog_paragon: {
      name: 'Toonbeeld',
      desc: 'Verdien over je hele levensloop 1.000.000 ervaring.',
      title: 'Toonbeeld',
    },
    prog_mythic: {
      name: 'Mythisch',
      desc: 'Verdien over je hele levensloop 2.500.000 ervaring.',
      title: 'Mythisch',
    },
    prog_eternal: {
      name: 'Eeuwig',
      desc: 'Verdien over je hele levensloop 5.000.000 ervaring.',
      title: 'Eeuwig',
    },
    prog_prestige: {
      name: 'Opnieuw Beginnen',
      desc: 'Bereik het hoogste level, vul de balk nog eens en eis prestigerang 1 op.',
    },
    prog_prestige_5: { name: 'Oude Gewoonten', desc: 'Bereik prestigerang 5.' },
    prog_prestige_10: { name: 'Perpetuum Mobile', desc: 'Bereik prestigerang 10.' },
    prog_first_harvest: { name: 'Vruchten van het Veld', desc: 'Oogst je eerste verzamelplek.' },
    prog_mining_100: { name: 'Erts in het Bloed', desc: 'Bereik 100 vaardigheid in Mijnbouw.' },
    prog_logging_100: { name: 'Kernhouthakker', desc: 'Bereik 100 vaardigheid in Houthakken.' },
    prog_herbalism_100: {
      name: 'Meester van de Weide',
      desc: 'Bereik 100 vaardigheid in Kruidenkunde.',
    },
    prog_master_gatherer: {
      name: 'Meesterverzamelaar',
      desc: 'Bereik 100 vaardigheid in Mijnbouw, Houthakken en Kruidenkunde.',
    },
    prog_first_craft: { name: 'Handwerk', desc: 'Voltooi je eerste geslaagde ambachtswerk.' },
    prog_craft_specialist: {
      name: 'Vakgeheimen',
      desc: 'Bereik 75 vaardigheid in één ambacht en ontgrendel de bijbehorende specialisatievoordelen.',
    },
    prog_around_the_ring: {
      name: 'De Ring Rond',
      desc: 'Bereik 25 vaardigheid in vijf verschillende ambachten.',
    },
    cmb_first_blood: { name: 'Eerste Bloed', desc: 'Versla je eerste vijand.' },
    cmb_slayer: { name: 'Slachter', desc: 'Versla 1.000 vijanden.' },
    cmb_legion_of_one: { name: 'Eenmanslegioen', desc: 'Versla 10.000 vijanden.' },
    cmb_heavy_hitter: { name: 'Zware Jongen', desc: 'Deel in totaal 500.000 schade uit.' },
    cmb_critical_eye: { name: 'Kritisch Oog', desc: 'Plaats 500 kritieke treffers.' },
    cmb_giantslayer: {
      name: 'Reuzendoder',
      desc: 'Deel de genadeslag uit aan een vijand die minstens vijf levels boven je staat.',
    },
    cmb_first_fall: {
      name: 'Klop Het Stof Eraf',
      desc: 'Sterf voor het eerst; het overkomt de besten onder ons.',
    },
    dgn_hollow_crypt: {
      name: 'Cryptebreker',
      desc: 'Versla Morthen de Grafroeper in de Holle Crypte.',
    },
    dgn_sunken_bastion: {
      name: 'De Fogbinder Ontbonden',
      desc: 'Versla Vael de Fogbinder in het Verzonken Bastion.',
    },
    dgn_drowned_temple: {
      name: 'De Maan Verdrinken',
      desc: 'Versla Ysolei, Avatar van de Verdronken Maan, in de Verdronken Tempel.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'De Wurm Beneden',
      desc: 'Versla Korzul de Grafwurm in het Grafwurm-Heiligdom.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Heroïsch: De Holle Crypte',
      desc: 'Versla Morthen de Grafroeper in de Holle Crypte op Heroïsche moeilijkheidsgraad.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Heroïsch: Het Verzonken Bastion',
      desc: 'Versla Vael de Fogbinder in het Verzonken Bastion op Heroïsche moeilijkheidsgraad.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Heroïsch: De Verdronken Tempel',
      desc: 'Versla Ysolei, Avatar van de Verdronken Maan, in de Verdronken Tempel op Heroïsche moeilijkheidsgraad.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Heroïsch: Grafwurm-Heiligdom',
      desc: 'Versla Korzul de Grafwurm in het Grafwurm-Heiligdom op Heroïsche moeilijkheidsgraad.',
    },
    dgn_nythraxis: {
      name: 'Geen Gesel Meer',
      desc: 'Versla Nythraxis, Gesel van Doorntop, achter de verzegelde koninklijke deur.',
    },
    dgn_nythraxis_heroic: {
      name: 'Heroïsch: Geen Gesel Meer',
      desc: 'Versla Nythraxis, Gesel van Doorntop, op Heroïsche moeilijkheidsgraad.',
    },
    dgn_thornpeak_rounds: {
      name: 'De Ronde Doen',
      desc: 'Zuiver de Holle Crypte, het Verzonken Bastion, de Verdronken Tempel en het Grafwurm-Heiligdom.',
    },
    dgn_deepward: {
      name: 'Diepwacht',
      desc: 'Bedwing elke kerker, de raid en beide delves op Heroïsche moeilijkheidsgraad.',
    },
    dgn_mark_circuit: {
      name: 'Het Volledige Circuit',
      desc: 'Verdien op één dag Heroïsche Merken uit alle vier de Heroïsche kerkers.',
    },
    dgn_boss_clears_50: { name: 'Vijftig Deuren Verder', desc: 'Versla 50 eindbazen van kerkers.' },
    dgn_morthen_flawless: {
      name: 'Geen Botje Gebroken',
      desc: 'Versla Morthen de Grafroeper op Heroïsche moeilijkheidsgraad zonder dat een groepslid sterft.',
    },
    dgn_morthen_trio: {
      name: 'Drie Tegen het Graf',
      desc: 'Versla Morthen de Grafroeper met drie of minder spelers.',
    },
    dgn_olen_arc: {
      name: 'De Maaier Ontweken',
      desc: 'Versla Ridder-Commandant Olen zonder dat zijn Maaiboog iemand anders raakt dan zijn huidige doelwit.',
    },
    dgn_vael_thralls: {
      name: 'Niemands Lijfeigene',
      desc: 'Versla Vael de Fogbinder terwijl elke Verdronken Lijfeigene die hij oproept al geveld is.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Tot de Laatste Maanspruit',
      desc: 'Versla Ysolei terwijl elke Maanspruit die zij oproept al geveld is.',
    },
    dgn_ysolei_flawless: {
      name: 'Droge Ogen',
      desc: 'Versla Ysolei, Avatar van de Verdronken Maan, op Heroïsche moeilijkheidsgraad zonder dat een groepslid sterft.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Blijf Begraven',
      desc: 'Versla Groot-Necromantiër Velkhar terwijl elke Verrezen Botloper vernietigd is voordat Velkhar zelf valt.',
    },
    dgn_korzul_flawless: {
      name: 'Wurmveller',
      desc: 'Versla Korzul de Grafwurm op Heroïsche moeilijkheidsgraad zonder dat een groepslid sterft.',
      title: 'Wurmveller',
    },
    dgn_sanctum_speed: {
      name: 'Heiligdomssprint',
      desc: 'Versla Korzul de Grafwurm binnen 15 minuten nadat je groep het Grafwurm-Heiligdom heeft opgeëist.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Kniel voor Geen Koning',
      desc: 'Versla Nythraxis zonder dat Grafbreker ooit iemand anders raakt dan zijn huidige doelwit.',
    },
    dgn_nythraxis_wardens: {
      name: 'Hoeders van de Wachtstenen',
      desc: 'Versla Nythraxis waarbij elke Doodloze Woede wordt gebroken voordat die losbarst.',
    },
    dgn_nythraxis_deathless: {
      name: 'Niemand Doodlozer',
      desc: 'Versla Nythraxis, Gesel van Doorntop, op Heroïsche moeilijkheidsgraad zonder dat één raider sterft.',
      title: 'de Doodloze',
    },
    cmb_thunzharr: {
      name: 'De Berg Viel',
      desc: 'Vel Thunzharr, de Ontwakende Piek, bij Stormrots.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Piekbreker',
      desc: 'Vel Thunzharr, de Ontwakende Piek, zonder te sterven, van jouw eerste slag tot zijn laatste adem.',
      title: 'Piekbreker',
    },
    cmb_thunzharr_ten: {
      name: 'Bergen als Gewoonte',
      desc: 'Vel Thunzharr, de Ontwakende Piek, tien keer.',
    },
    dlv_reliquary: { name: 'Schrijnloper', desc: 'Zuiver het Ingestorte Reliekschrijn.' },
    dlv_reliquary_heroic: {
      name: 'Heroïsch: Het Ingestorte Reliekschrijn',
      desc: 'Zuiver het Ingestorte Reliekschrijn op het Heroïsche niveau.',
    },
    dlv_litany: { name: 'Stil de Litanie', desc: 'Zuiver de Verdronken Litanie.' },
    dlv_litany_heroic: {
      name: 'Heroïsch: De Verdronken Litanie',
      desc: 'Zuiver de Verdronken Litanie op het Heroïsche niveau.',
    },
    dlv_lore_journal: {
      name: 'Marginalia',
      desc: 'Ontgrendel alle vijf de aantekeningen in het delve-dagboek.',
    },
    dlv_companion_max: {
      name: 'Een Vriendin in de Diepte',
      desc: 'Breng een delve-metgezel naar haar hoogste rang.',
    },
    dlv_companions_both: {
      name: 'Beide Lantaarns Ontstoken',
      desc: 'Breng beide delve-metgezellen, Acoliet Tessa en Edda Reedhand, naar hun hoogste rang.',
    },
    dlv_clears_50: { name: 'Vijftig Vadem', desc: 'Voltooi 50 delve-tochten.' },
    dlv_solo_heroic: {
      name: 'Twee is al een Menigte',
      desc: 'Zuiver een delve op het Heroïsche niveau zonder enige andere speler, alleen jij en je metgezel.',
    },
    dlv_tumbler_premium: {
      name: 'Het Pad van de Tuimelaar, Volleerd',
      desc: 'Open een beschermde reliekschrijnkist op de hoogste inzet, foutloos bij je enige poging.',
    },
    dlv_rite_flawless: {
      name: 'Zonder Haperen',
      desc: 'Voltooi de Rite van het Verdronken Reliekschrijn zonder een enkele fout.',
    },
    dlv_varric_ringers: {
      name: 'De Klokken Verstommen',
      desc: 'Versla Diaken Varric terwijl elke Doodsklokluider die hij doet verrijzen al gedood is.',
    },
    dlv_nhalia_bells: {
      name: 'Klokkenstiller',
      desc: 'Versla Zuster Nhalia, de Verdronken Lofzang, zonder dat een groepslid door een Luidende Klok wordt geraakt.',
      title: 'Klokkenstiller',
    },
    chr_vale_chapter_i: {
      name: 'Dalkroniek, Hoofdstuk I',
      desc: 'Voltooi het eerste hoofdstuk van Sauls kroniek: de eerste boodschappen van Oostbeek, de ligging van het Dal en een eerste proeve van zijn ambachten.',
    },
    chr_vale_chapter_ii: {
      name: 'Dalkroniek, Hoofdstuk II',
      desc: 'Voltooi het tweede hoofdstuk van Sauls kroniek: bandieten, murlocs en mijnongedierte neergeslagen, op het Zeugveld gespeeld en het Reliekschrijn getrotseerd.',
    },
    chr_vale_chapter_iii: {
      name: 'Kroniek van het Dal',
      desc: 'Breng het hele verhaal van het Dal tot een einde: de Grafroeper ontmaskerd, de Holle Crypte gezuiverd en elke naamdragende verschrikking van het Dal geveld.',
      title: 'van het Dal',
    },
    chr_vale_gatherer: {
      name: 'Leven van het Land',
      desc: 'Oogst een ertsader, een houtopstand en een kruidenveldje in Oostbeekdal.',
    },
    chr_vale_first_cast: {
      name: 'Er Zit Iets in het Spiegelmeer',
      desc: 'Vang een vis in de wateren van Oostbeekdal.',
    },
    chr_vale_packbreaker: { name: 'Roedelbreker', desc: 'Dood 3 Boswolven binnen 10 seconden.' },
    chr_vale_cup_debut: {
      name: 'Kanshebber op de Koperen Emmer',
      desc: 'Betreed het veld en raak de bal in een Dalbeker-wedstrijd op het Zeugveld.',
    },
    chr_vale_rares: {
      name: 'Verschrikkingen van het Dal',
      desc: 'Dood de vijf naamdragende verschrikkingen van Oostbeekdal: Oude Grijskaak, Mogger, Grix de Tunnelkoning, Kapitein Verlan en Schimbinder Maldrec.',
    },
    chr_marsh_chapter_i: {
      name: 'Moeraskroniek, Hoofdstuk I',
      desc: 'Voltooi het eerste hoofdstuk van Osric Fenns kroniek: geef gehoor aan de mobilisatie van Veenbrug, stel de dijkweg veilig en leer de vorm van het veen kennen.',
    },
    chr_marsh_chapter_ii: {
      name: 'Moeraskroniek, Hoofdstuk II',
      desc: 'Voltooi het tweede hoofdstuk van Osric Fenns kroniek: de weduwen uitgerookt, de verdronkenen te ruste gelegd, de Kabeljauwvader aan land gehaald en de Litanie getrotseerd.',
    },
    chr_marsh_chapter_iii: {
      name: 'Kroniek van het Slijkveen',
      desc: 'Breng het hele verhaal van het veen tot een einde: het sektekamp gebroken, de Fogbinder tot zwijgen gebracht in het Verzonken Bastion en elke naamdragende verschrikking van de nevel geveld.',
      title: 'van het Slijkveen',
    },
    chr_marsh_gatherer: {
      name: 'Foerageren bij Veenbrug',
      desc: 'Oogst een ertsader, een houtopstand en een kruidenveldje in Slijkveenmoeras.',
    },
    chr_marsh_unburst: {
      name: 'Blijf Niet in de Sporen Staan',
      desc: 'Dood 8 Moerasbulten zonder in hun uitbarsting van Bijtende Sporen terecht te komen.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Smoor de Heling',
      desc: 'Dood in het Grafroeper-Kampement een Grafroeper-Heler voordat ook maar een van de sektelingen die hij verzorgt sterft.',
    },
    chr_marsh_rares: {
      name: 'Namen in de Nevel',
      desc: 'Dood de drie naamdragende verschrikkingen van Slijkveenmoeras: Slijkkaak de Vraatzuchtige, Sloomtooth de Verdronkene en Zuster Nhalia.',
    },
    chr_peaks_chapter_i: {
      name: 'Hoogtenkroniek, Hoofdstuk I',
      desc: 'Voltooi het eerste hoofdstuk van Zenzies kroniek: veeg de bergkamweg schoon, ruim de holen leeg en leer elk pad kennen dat Hoogwacht bewaakt.',
    },
    chr_peaks_chapter_ii: {
      name: 'Hoogtenkroniek, Hoofdstuk II',
      desc: 'Voltooi het tweede hoofdstuk van Zenzies kroniek: breek Drogmars oorlogskamp, doorgrond de ontwakende storm en sta waar de Glinstermeer gloeit.',
    },
    chr_peaks_chapter_iii: {
      name: 'Kroniek van Doorntop',
      desc: 'Breng het hele verhaal van de berg tot een einde: de Wurmcultus gebroken, het Heiligdom tot zwijgen gebracht, de Ontwakende Piek geveld en elke naamdragende verschrikking van de rotsen ten val gebracht.',
      title: 'van Doorntop',
    },
    chr_peaks_sparring: {
      name: 'Muuroefeningen',
      desc: 'Breng in totaal 1.000 schade toe aan de oefenpop boven Hoogwacht.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Koud Water, Kouder Licht',
      desc: 'Vang een vis in de Glinstermeer.',
    },
    chr_peaks_moongate: {
      name: 'Door de Koude Poort',
      desc: 'Stap door de maanpoort aan de oever van de Glinstermeer.',
    },
    chr_peaks_waking_witness: {
      name: 'De Berg Die Loopt',
      desc: 'Aanschouw Thunzharr, de Ontwakende Piek terwijl hij over de berg schrijdt.',
    },
    chr_peaks_rares: {
      name: 'Namen in de Rots Gekerfd',
      desc: 'Dood de vier naamdragende verschrikkingen van Doorntop-Hoogten: de IJzerader-Voorman, Brutok Schedelverbrijzelaar, Voskar de Sintelvleugel en Mergheer Varkas.',
    },
    col_discovery_25: {
      name: 'Hamsteraar',
      desc: 'Ontdek 25 verschillende voorwerpen (een voorwerp telt de eerste keer dat het ooit in je bezit komt).',
    },
    col_discovery_75: { name: 'Ekster', desc: 'Ontdek 75 verschillende voorwerpen.' },
    col_discovery_150: {
      name: 'Rariteitenkabinet',
      desc: 'Ontdek 150 verschillende voorwerpen.',
      title: 'de Curator',
    },
    col_discovery_250: { name: 'De Grote Catalogus', desc: 'Ontdek 250 verschillende voorwerpen.' },
    col_first_rare: {
      name: 'Iets Blauws',
      desc: 'Bemachtig je eerste voorwerp van zeldzame kwaliteit.',
    },
    col_first_epic: {
      name: 'In het Purper Geboren',
      desc: 'Bemachtig je eerste voorwerp van epische kwaliteit.',
    },
    col_first_legendary: {
      name: 'Oranje Boven',
      desc: 'Bemachtig je eerste voorwerp van legendarische kwaliteit.',
    },
    col_set_vale_arcanist: {
      name: 'Regalia van de Dal-Arcanist',
      desc: 'Ontdek elk onderdeel van de Regalia van de Dal-Arcanist.',
    },
    col_set_boundstone_vanguard: {
      name: 'Bandsteen-Voorhoede',
      desc: 'Ontdek elk onderdeel van de Bandsteen-Voorhoede.',
    },
    col_set_greyjaw_stalker: {
      name: 'Uitrusting van de Grijskaak-Sluiper',
      desc: 'Ontdek elk onderdeel van de Uitrusting van de Grijskaak-Sluiper.',
    },
    col_set_deathlord: {
      name: 'Barrowlord-Strijduitrusting',
      desc: 'Ontdek elk onderdeel van de Barrowlord-Strijduitrusting.',
    },
    col_set_wyrmshadow: {
      name: 'Nightfang-Gewaden',
      desc: 'Ontdek elk onderdeel van de Nightfang-Gewaden.',
    },
    col_set_necromancers: {
      name: 'Mournweave-Dracht',
      desc: 'Ontdek elk onderdeel van de Mournweave-Dracht.',
    },
    col_set_crownforged: {
      name: 'Bonewrought-Regalia',
      desc: 'Ontdek elk onderdeel van de Bonewrought-Regalia.',
    },
    col_set_nighttalon: {
      name: 'Direfang-Vacht',
      desc: 'Ontdek elk onderdeel van de Direfang-Vacht.',
    },
    col_set_soulflame: {
      name: 'Wraithfire-Regalia',
      desc: 'Ontdek elk onderdeel van de Wraithfire-Regalia.',
    },
    col_set_stormcallers: {
      name: 'Galecall-Gewaden',
      desc: 'Ontdek elk onderdeel van de Galecall-Gewaden.',
    },
    col_seven_regalia: {
      name: 'De Zevenvoudige Garderobe',
      desc: 'Ontdek elk onderdeel van alle zeven epische uitrustingsfamilies.',
      title: 'de Luisterrijke',
    },
    col_true_colors: {
      name: 'Ware Kleuren',
      desc: 'Betreed het veld in een ander uiterlijk dan de standaard van je klasse.',
    },
    col_all_slots: {
      name: 'Tot in de Elf Puntjes',
      desc: 'Draag tegelijkertijd een voorwerp in alle elf uitrustingsvakken.',
    },
    col_quartermaster_buyout: {
      name: 'Vaste Klant',
      desc: 'Ontdek alle tien de stukken uit de voorraad van de Heroïsche Kwartiermeester.',
    },
    col_glimmerfin: { name: 'Een Glansje Hoop', desc: 'Vang een Glansvin-Koi.' },
    col_full_creel: {
      name: 'Volle Viskorf',
      desc: 'Ontdek alle zes de gewone vangsten uit de wateren van het Dal, het Moeras en de Hoogten.',
    },
    col_junk_drawer: {
      name: 'De Rommellade',
      desc: 'Ontdek 10 verschillende voorwerpen van armzalige kwaliteit.',
    },
    pvp_arena_first_match: {
      name: 'Zand in je Laarzen',
      desc: 'Vecht een geklasseerde wedstrijd uit in het Asgrauwe Colosseum, in een van beide divisies.',
    },
    pvp_arena_first_win: {
      name: 'De Menigte Brult',
      desc: 'Win een geklasseerde arenawedstrijd in een van beide divisies.',
    },
    pvp_arena_1v1_1600: {
      name: 'Kanshebber van het Colosseum',
      desc: 'Bereik een rating van 1600 in de 1v1-arenadivisie.',
    },
    pvp_arena_1v1_1750: {
      name: 'Rivaal van het Colosseum',
      desc: 'Bereik een rating van 1750 in de 1v1-arenadivisie.',
    },
    pvp_arena_1v1_1900: {
      name: 'Gladiator',
      desc: 'Bereik een rating van 1900 in de 1v1-arenadivisie.',
      title: 'Gladiator',
    },
    pvp_arena_2v2_1600: {
      name: 'Twee Man Sterk',
      desc: 'Bereik een rating van 1600 in de 2v2-arenadivisie.',
    },
    pvp_arena_2v2_1750: {
      name: 'Geducht Duo',
      desc: 'Bereik een rating van 1750 in de 2v2-arenadivisie.',
    },
    pvp_arena_2v2_1900: {
      name: 'Perfect Samenspel',
      desc: 'Bereik een rating van 1900 in de 2v2-arenadivisie.',
    },
    pvp_duel_first_win: { name: 'Dat Lossen We Buiten Op', desc: 'Win een duel.' },
    pvp_duel_grace: {
      name: 'Een Les in Nederigheid',
      desc: 'Verlies een duel met je waardigheid grotendeels intact.',
    },
    pvp_vcup_first_match: {
      name: 'Het Veld Op',
      desc: 'Speel een volledige Dalbeker-wedstrijd op het Zeugveld uit, winst of verlies.',
    },
    pvp_vcup_first_win: {
      name: 'Het Eerste Zilverwerk',
      desc: 'Win een geklasseerde Dalbeker-wedstrijd.',
    },
    pvp_vcup_wins_10: {
      name: 'Doorgewinterde Zwijnenballer',
      desc: 'Win 10 geklasseerde Dalbeker-wedstrijden.',
    },
    pvp_vcup_wins_25: {
      name: 'Zwijnenbal-Legende',
      desc: 'Win 25 geklasseerde Dalbeker-wedstrijden.',
      title: 'Zwijnenbal-Legende',
    },
    pvp_vcup_first_goal: {
      name: 'De Ban Gebroken',
      desc: 'Scoor een doelpunt in een geklasseerde Dalbeker-wedstrijd.',
    },
    pvp_vcup_hat_trick: {
      name: 'Hattrickheld',
      desc: 'Scoor drie doelpunten in een enkele geklasseerde Dalbeker-wedstrijd, in de 3v3-divisie of groter.',
    },
    pvp_vcup_golden_goal: {
      name: 'Gouden Moment',
      desc: 'Scoor de golden goal die een geklasseerde Dalbeker-wedstrijd beslist.',
    },
    pvp_vcup_first_save: {
      name: 'Veilige Handen',
      desc: 'Verricht een redding als keeper in een geklasseerde Dalbeker-wedstrijd.',
    },
    pvp_vcup_clean_sheet: {
      name: 'De Nul Gehouden',
      desc: 'Win een geklasseerde Dalbeker-wedstrijd als keeper zonder een doelpunt tegen te krijgen.',
    },
    pvp_vcup_guild_win: {
      name: 'Voor het Vaandel',
      desc: 'Win een geklasseerde Dalbeker-wedstrijd, aangetreden onder het vaandel van je gilde.',
    },
    pvp_fiesta_first_bout: {
      name: 'Ongenode Gast',
      desc: 'Vecht een volledige 2v2 Fiesta-partij uit, winst of verlies.',
    },
    pvp_fiesta_first_win: {
      name: 'De Gangmaker van de Fiesta',
      desc: 'Win een 2v2 Fiesta-partij.',
    },
    pvp_fiesta_double: {
      name: 'Dubbelslag',
      desc: 'Scoor twee Fiesta-uitschakelingen binnen vier seconden.',
    },
    pvp_fiesta_shutdown: {
      name: 'Spelbreker',
      desc: 'Schakel een Fiesta-tegenstander uit die een reeks van drie of meer heeft lopen.',
    },
    pvp_fiesta_full_build: {
      name: 'Gekleed voor de Gelegenheid',
      desc: 'Win een Fiesta-partij met een vastgezette versterking uit elk van de drie golven.',
    },
    pvp_fiesta_powerups: {
      name: 'Van Alles Eén',
      desc: 'Pak elk van de vier power-ups in de ring minstens één keer: Snelheidsduivel, Kolos, Maanlaarzen en Berserker.',
    },
    pvp_fiesta_five_kills: {
      name: 'De Kar Trekken',
      desc: 'Scoor vijf uitschakelingen in een enkele Fiesta-partij.',
    },
    soc_first_party: { name: 'Samen Sterker', desc: 'Vorm een groep met een andere speler.' },
    soc_full_house: {
      name: 'Full House',
      desc: 'Zuiver een kerker met een voltallige groep van vijf.',
    },
    soc_guild_joined: { name: 'Onder Eén Vaandel', desc: 'Word lid van een gilde.' },
    soc_guild_founded: { name: 'De Veerpen van de Stichter', desc: 'Sticht je eigen gilde.' },
    soc_first_trade: { name: 'Een Eerlijke Ruil', desc: 'Voltooi een ruil met een andere speler.' },
    soc_first_sale: {
      name: 'Open voor Zaken',
      desc: 'Strijk de munten van je eerste verkoop op de Wereldmarkt op.',
    },
    soc_steady_custom: {
      name: 'Vaste Klandizie',
      desc: 'Strijk een levenstotaal van 10 goud op uit je verkopen op de Wereldmarkt.',
    },
    soc_market_magnate: {
      name: 'Marktmagnaat',
      desc: 'Strijk een levenstotaal van 100 goud op uit je verkopen op de Wereldmarkt.',
      title: 'Magnaat',
    },
    soc_by_ravens_wing: {
      name: 'Op Ravenwieken',
      desc: 'Verstuur een Ravenpost-brief met munten of een pakket.',
    },
    soc_room_for_more: { name: 'Ruimte voor Meer', desc: 'Koop je eerste bankuitbreiding.' },
    soc_gilded_strongbox: {
      name: 'De Vergulde Geldkist',
      desc: 'Koop elke bankuitbreiding die de thesauriers je willen verkopen.',
    },
    soc_meet_bursar: {
      name: 'Op Fernando Vertrouwen Wij',
      desc: 'Betuig je respect aan Thesaurier Fernando, hoeder van De Vergulde Geldkist in Oostbeek.',
    },
    soc_pocket_money: {
      name: 'Zakgeld',
      desc: 'Maak een levenstotaal van 1 goud aan munten buit.',
    },
    soc_heavy_purse: {
      name: 'Een Zware Buidel',
      desc: 'Maak een levenstotaal van 10 goud aan munten buit.',
    },
    soc_wyrms_hoard: {
      name: 'Een Wurmschat',
      desc: 'Maak een levenstotaal van 100 goud aan munten buit.',
    },
    soc_civic_duty: { name: 'Burgerplicht', desc: 'Wijs je eerste stadsfocuspunt toe.' },
    exp_long_road_north: {
      name: 'De Lange Weg naar het Noorden',
      desc: 'Bezoek alle drie de hoofdnederzettingen: Oostbeek, Veenbrug en Hoogwacht.',
    },
    exp_vale_wayfarer: {
      name: 'Doler van het Dal',
      desc: 'Bezoek alle elf benoemde plekken van het Oostbeekdal.',
    },
    exp_marsh_wayfarer: {
      name: 'Doler van het Moeras',
      desc: 'Bezoek alle acht benoemde plekken van het Slijkveenmoeras.',
    },
    exp_peaks_wayfarer: {
      name: 'Doler van de Hoogten',
      desc: 'Bezoek alle tien benoemde plekken van de Doorntop-Hoogten.',
    },
    exp_world_traveler: {
      name: 'Wereldreiziger',
      desc: 'Behaal de Doler-daad van alle drie de zones.',
      title: 'de Doler',
    },
    exp_something_shiny: {
      name: 'Iets Glinsterends',
      desc: 'Raap een fonkelend voorwerp op van de grond.',
    },
    exp_first_ore: { name: 'De Eerste Ader', desc: 'Oogst je eerste ertsader.' },
    exp_first_timber: { name: 'Van Onderen!', desc: 'Oogst je eerste houtvindplaats.' },
    exp_first_herb: { name: 'Groene Vingers', desc: 'Oogst je eerste kruidenvindplaats.' },
    feat_era_cap: {
      name: 'Kind van het Eerste Tijdperk',
      desc: 'Bereikte level 20 toen het Eerste Tijdperk nog het huidige was.',
    },
    feat_book_complete: { name: 'Het Hele Boek', desc: 'Behaal elke daad in het Boek der Daden.' },
    feat_brightwood_relic: {
      name: 'Helderwoud Herdacht',
      desc: 'Bewaar een relikwie van het oude Helderwoud: het Doornhuid-Wambuis of de Monarchenkroon.',
    },
    hid_saul_footnote: {
      name: 'Een Voetnoot in de Geschiedenis',
      desc: 'Viel Saul de Kroniekschrijver negen keer zonder ophouden lastig.',
      title: 'de Voetnoot',
    },
    hid_gilded_tour: {
      name: 'De Vergulde Rondgang',
      desc: 'Deed zaken met alle drie de filialen van De Vergulde Geldkist.',
    },
    hid_fall_death: {
      name: 'Zwaartekracht Wint Altijd',
      desc: 'Gestorven aan een lang gesprek met de grond.',
    },
    hid_keepers_toll_twice: {
      name: 'De Hoeder Int Tweemaal',
      desc: 'Gestorven terwijl de Tol van de Hoeder nog op je drukte.',
    },
    hid_roll_hundred: {
      name: 'Zuivere Honderd',
      desc: 'Rolde een perfecte 100 met een gewone /roll.',
    },
    hid_yumi_cheer: {
      name: "Yumi's Grootste Fan",
      desc: 'Juichte midden in een partij voor Yumi, waar ze je kon horen.',
    },
    hid_bountiful_coffer: {
      name: 'De Paarse Koffer',
      desc: 'Kraakte een Weelderige Koffer voordat hij kon vastlopen.',
    },
    hid_companion_save: {
      name: 'Niet Zolang Zij Waakt',
      desc: 'Je delve-metgezel sleepte een gevallen groepsgenoot weer overeind.',
    },
    hid_codfather: {
      name: 'Opgenomen in de Familie',
      desc: 'Sleepte De Kabeljauwvader uit de Diepveen-Ondiepten.',
    },
    prog_crown_below: {
      name: 'De Kroon Beneden',
      desc: 'Volg de kroon van de rusteloze knekelvelden tot aan de tombe van Koning Nythraxis en volbreng Het Einde van de Gesel.',
    },
    prog_mere_at_rest: {
      name: 'Het Meer in Ruste',
      desc: 'Zie de wacht van Getijdenwaker Ondrel Vane door tot het einde: het koor tot zwijgen gebracht, de Bleekkronkel geveld en de Verdronken Maan ter ruste gelegd.',
    },
    prog_callused_hands: {
      name: 'Eeltige Handen',
      desc: 'Voltooi Een Ambacht voor Elke Hand en verdien je eerste eelt in de ambachten van Oostbeek.',
    },
    prog_tools_of_the_trade: {
      name: 'Gereedschap van het Vak',
      desc: 'Voltooi een aan een werkstation gebonden ambachtswerk in het ambachtscentrum van Hoogwacht.',
    },
    dgn_nythraxis_crypt: {
      name: 'Wat de Crypte Bewaarde',
      desc: 'Trotseer de Verlaten Crypte en herwin beide sluitsteenhelften en het oude dagboek uit de greep van haar wachters.',
    },
    chr_marsh_first_cast: {
      name: 'Alen in het Riet',
      desc: 'Vang een vis in de wateren van Slijkveenmoeras.',
    },
  },
  pl_PL: {
    prog_first_steps: {
      name: 'Pierwsze Kroki',
      desc: 'Osiągnij poziom 2 i postaw pierwszy krok na długiej drodze.',
    },
    prog_finding_your_feet: {
      name: 'Pewny Grunt',
      desc: 'Osiągnij poziom 5; dzicz wydaje się już odrobinę mniejsza.',
    },
    prog_double_digits: {
      name: 'Dwie Cyfry',
      desc: 'Osiągnij poziom 10 i odblokuj swoje talenty.',
    },
    prog_the_long_middle: { name: 'Długi Środek Drogi', desc: 'Osiągnij poziom 15.' },
    prog_level_cap: { name: 'Widok ze Szczytu', desc: 'Osiągnij poziom 20, maksymalny poziom.' },
    prog_well_rested: {
      name: 'Dobrze Wypoczęty',
      desc: 'Zatrzymaj się w gospodzie, aż zdobędziesz doświadczenie za wypoczynek.',
    },
    prog_talented: { name: 'Dobrze Wydany Punkt', desc: 'Wydaj swój pierwszy punkt talentu.' },
    prog_specialized: {
      name: 'Deklaracja Zamiarów',
      desc: 'Wybierz specjalizację i naucz się jej sztandarowej zdolności.',
    },
    prog_deep_roots: {
      name: 'Głębokie Korzenie',
      desc: 'Wydaj punkt talentu na talent z ostatniego rzędu.',
    },
    prog_full_build: {
      name: 'Pełna Jedenastka',
      desc: 'Wydaj wszystkie jedenaście punktów talentów w jednej rozpisce.',
    },
    prog_veteran: {
      name: 'Weteran',
      desc: 'Zdobądź łącznie 250 000 punktów doświadczenia.',
      title: 'Weteran',
    },
    prog_champion: {
      name: 'Mistrz',
      desc: 'Zdobądź łącznie 500 000 punktów doświadczenia.',
      title: 'Mistrz',
    },
    prog_paragon: {
      name: 'Wzór cnót',
      desc: 'Zdobądź łącznie 1 000 000 punktów doświadczenia.',
      title: 'Wzór cnót',
    },
    prog_mythic: {
      name: 'Mityczny',
      desc: 'Zdobądź łącznie 2 500 000 punktów doświadczenia.',
      title: 'Mityczny',
    },
    prog_eternal: {
      name: 'Wieczny',
      desc: 'Zdobądź łącznie 5 000 000 punktów doświadczenia.',
      title: 'Wieczny',
    },
    prog_prestige: {
      name: 'Od Nowa',
      desc: 'Osiągnij maksymalny poziom, zapełnij pasek raz jeszcze i odbierz rangę prestiżu 1.',
    },
    prog_prestige_5: { name: 'Stare Nawyki', desc: 'Osiągnij rangę prestiżu 5.' },
    prog_prestige_10: { name: 'Perpetuum Mobile', desc: 'Osiągnij rangę prestiżu 10.' },
    prog_first_harvest: {
      name: 'Plony Pola',
      desc: 'Zbierz plon ze swojego pierwszego źródła surowców.',
    },
    prog_mining_100: { name: 'Ruda we Krwi', desc: 'Osiągnij 100 biegłości w Górnictwie.' },
    prog_logging_100: { name: 'Rębacz Twardzieli', desc: 'Osiągnij 100 biegłości w Drwalnictwie.' },
    prog_herbalism_100: { name: 'Mistrz Łąk', desc: 'Osiągnij 100 biegłości w Zielarstwie.' },
    prog_master_gatherer: {
      name: 'Mistrz Zbieractwa',
      desc: 'Osiągnij 100 biegłości w Górnictwie, Drwalnictwie i Zielarstwie.',
    },
    prog_first_craft: { name: 'Własnoręczna Robota', desc: 'Ukończ swój pierwszy udany wyrób.' },
    prog_craft_specialist: {
      name: 'Tajniki Fachu',
      desc: 'Osiągnij 75 umiejętności w dowolnym rzemiośle i odblokuj atuty jego specjalizacji.',
    },
    prog_around_the_ring: {
      name: 'Dookoła Kręgu',
      desc: 'Osiągnij 25 umiejętności w pięciu różnych rzemiosłach.',
    },
    cmb_first_blood: { name: 'Pierwsza Krew', desc: 'Pokonaj swojego pierwszego wroga.' },
    cmb_slayer: { name: 'Pogromca', desc: 'Pokonaj 1000 wrogów.' },
    cmb_legion_of_one: { name: 'Jednoosobowy Legion', desc: 'Pokonaj 10 000 wrogów.' },
    cmb_heavy_hitter: { name: 'Ciężka Ręka', desc: 'Zadaj łącznie 500 000 obrażeń.' },
    cmb_critical_eye: { name: 'Krytyczne Oko', desc: 'Zadaj 500 trafień krytycznych.' },
    cmb_giantslayer: {
      name: 'Pogromca Olbrzymów',
      desc: 'Zadaj ostateczny cios wrogowi o co najmniej pięć poziomów wyższemu od ciebie.',
    },
    cmb_first_fall: {
      name: 'Otrzep Się i Wstań',
      desc: 'Zgiń po raz pierwszy; zdarza się najlepszym.',
    },
    dgn_hollow_crypt: {
      name: 'Łamacz Krypt',
      desc: 'Pokonaj Morthena Grobowego Wołacza w Wydrążonej Krypcie.',
    },
    dgn_sunken_bastion: {
      name: 'Fogbinder Rozpętany',
      desc: 'Pokonaj Vaela Fogbindera w Zatopionym Bastionie.',
    },
    dgn_drowned_temple: {
      name: 'Utopić Księżyc',
      desc: 'Pokonaj Ysolei, Awatara Utopionego Księżyca, w Zatopionej Świątyni.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Żmij z Głębin',
      desc: 'Pokonaj Korzula Grobowego Żmija w Sanktuarium Grobowego Żmija.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Heroiczna: Wydrążona Krypta',
      desc: 'Pokonaj Morthena Grobowego Wołacza w Wydrążonej Krypcie na heroicznym poziomie trudności.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Heroiczny: Zatopiony Bastion',
      desc: 'Pokonaj Vaela Fogbindera w Zatopionym Bastionie na heroicznym poziomie trudności.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Heroiczna: Zatopiona Świątynia',
      desc: 'Pokonaj Ysolei, Awatara Utopionego Księżyca, w Zatopionej Świątyni na heroicznym poziomie trudności.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Heroiczne: Sanktuarium Grobowego Żmija',
      desc: 'Pokonaj Korzula Grobowego Żmija w Sanktuarium Grobowego Żmija na heroicznym poziomie trudności.',
    },
    dgn_nythraxis: {
      name: 'Koniec Plagi',
      desc: 'Pokonaj Nythraxisa, Plagę Ciernistego Szczytu, za zapieczętowanymi królewskimi wrotami.',
    },
    dgn_nythraxis_heroic: {
      name: 'Heroiczny: Koniec Plagi',
      desc: 'Pokonaj Nythraxisa, Plagę Ciernistego Szczytu, na heroicznym poziomie trudności.',
    },
    dgn_thornpeak_rounds: {
      name: 'Wielki Obchód',
      desc: 'Oczyść Wydrążoną Kryptę, Zatopiony Bastion, Zatopioną Świątynię i Sanktuarium Grobowego Żmija.',
    },
    dgn_deepward: {
      name: 'Strażnik Głębin',
      desc: 'Zdobądź każdy loch, rajd i obie wyprawy na heroicznym poziomie trudności.',
    },
    dgn_mark_circuit: {
      name: 'Pełny Obieg',
      desc: 'Zdobądź znaki heroiczne ze wszystkich czterech heroicznych lochów w ciągu jednego dnia.',
    },
    dgn_boss_clears_50: {
      name: 'Za Pięćdziesiątymi Drzwiami',
      desc: 'Pokonaj 50 finałowych bossów lochów.',
    },
    dgn_morthen_flawless: {
      name: 'Poszło Jak po Kościach',
      desc: 'Pokonaj Morthena Grobowego Wołacza na heroicznym poziomie trudności tak, by nikt z drużyny nie zginął.',
    },
    dgn_morthen_trio: {
      name: 'W Trójkę Przeciw Mogile',
      desc: 'Pokonaj Morthena Grobowego Wołacza w składzie liczącym najwyżej trzech graczy.',
    },
    dgn_olen_arc: {
      name: 'Wymiń Żniwiarza',
      desc: 'Pokonaj Komandora Rycerzy Olena tak, by jego Kosiący łuk nie trafił nikogo poza jego bieżącym celem.',
    },
    dgn_vael_thralls: {
      name: 'Niczyj Niewolnik',
      desc: 'Pokonaj Vaela Fogbindera, gdy wszyscy przyzwani przez niego Utopieni Niewolnicy zostali już zgładzeni.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Pomioty, Co do Jednego',
      desc: 'Pokonaj Ysolei, gdy wszystkie przyzwane przez nią Księżycowe Pomioty zostały już zgładzone.',
    },
    dgn_ysolei_flawless: {
      name: 'Suche Oczy',
      desc: 'Pokonaj Ysolei, Awatara Utopionego Księżyca, na heroicznym poziomie trudności tak, by nikt z drużyny nie zginął.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Zostańcie w Grobach',
      desc: 'Pokonaj Wielkiego Nekromantę Velkhara tak, by każdy Wskrzeszony Kościochód został zniszczony, zanim on sam padnie.',
    },
    dgn_korzul_flawless: {
      name: 'Żmijobójca',
      desc: 'Pokonaj Korzula Grobowego Żmija na heroicznym poziomie trudności tak, by nikt z drużyny nie zginął.',
      title: 'Żmijobójca',
    },
    dgn_sanctum_speed: {
      name: 'Sprint przez Sanktuarium',
      desc: 'Pokonaj Korzula Grobowego Żmija w ciągu 15 minut od zajęcia Sanktuarium Grobowego Żmija przez twoją drużynę.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Przed Królem Nie Klękamy',
      desc: 'Pokonaj Nythraxisa tak, by Grobołam nie trafił nikogo poza jego bieżącym celem.',
    },
    dgn_nythraxis_wardens: {
      name: 'Strażnicy Kamieni Ochronnych',
      desc: 'Pokonaj Nythraxisa tak, by każdy Nieśmiertelny Szał został przerwany, zanim uderzy.',
    },
    dgn_nythraxis_deathless: {
      name: 'Nikt Bardziej Nieśmiertelny',
      desc: 'Pokonaj Nythraxisa, Plagę Ciernistego Szczytu, na heroicznym poziomie trudności tak, by ani jeden rajdowiec nie zginął.',
      title: 'Nieśmiertelny',
    },
    cmb_thunzharr: {
      name: 'Góra Runęła',
      desc: 'Powal Thunzharra, Budzący się Szczyt, przy Burzowej Turni.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Łamacz Szczytów',
      desc: 'Powal Thunzharra, Budzący się Szczyt, nie ginąc od twojego pierwszego ciosu aż po jego ostatni oddech.',
      title: 'Łamacz Szczytów',
    },
    cmb_thunzharr_ten: {
      name: 'Górski Nawyk',
      desc: 'Powal Thunzharra, Budzący się Szczyt, dziesięć razy.',
    },
    dlv_reliquary: { name: 'Goniec z Relikwiarza', desc: 'Oczyść Zawalony Relikwiarz.' },
    dlv_reliquary_heroic: {
      name: 'Heroiczny: Zawalony Relikwiarz',
      desc: 'Oczyść Zawalony Relikwiarz na poziomie heroicznym.',
    },
    dlv_litany: { name: 'Uciszyć Litanię', desc: 'Oczyść Utopioną Litanię.' },
    dlv_litany_heroic: {
      name: 'Heroiczna: Utopiona Litania',
      desc: 'Oczyść Utopioną Litanię na poziomie heroicznym.',
    },
    dlv_lore_journal: {
      name: 'Marginalia',
      desc: 'Odblokuj wszystkie pięć wpisów w dzienniku wypraw.',
    },
    dlv_companion_max: {
      name: 'Prawdziwych przyjaciół poznaje się w głębinie',
      desc: 'Doprowadź towarzyszkę wypraw do najwyższej rangi.',
    },
    dlv_companions_both: {
      name: 'Obie latarnie płoną',
      desc: 'Doprowadź obie towarzyszki wypraw, Akolitkę Tessę i Eddę Trzcinoręką, do najwyższej rangi.',
    },
    dlv_clears_50: { name: 'Pięćdziesiąt sążni', desc: 'Ukończ 50 wypraw.' },
    dlv_solo_heroic: {
      name: 'Dwoje to już tłum',
      desc: 'Oczyść wyprawę na poziomie heroicznym bez żadnego innego gracza, tylko ty i twoja towarzyszka.',
    },
    dlv_tumbler_premium: {
      name: 'Ścieżka Zastawek, opanowana',
      desc: 'Otwórz strzeżoną skrzynię relikwiarza przy najwyższej stawce, bezbłędnie i za jednym jedynym podejściem.',
    },
    dlv_rite_flawless: {
      name: 'Co do słowa',
      desc: 'Ukończ Obrzęd Utopionego Relikwiarza, nie popełniając ani jednego błędu.',
    },
    dlv_varric_ringers: {
      name: 'Dzwony milkną',
      desc: 'Pokonaj Diakona Varrica tak, aby każdy wskrzeszony przez niego Pogrzebowy Dzwonnik poległ przed nim.',
    },
    dlv_nhalia_bells: {
      name: 'Uciszyciel Dzwonów',
      desc: 'Pokonaj Siostrę Nhalię, Utopiony Kantyk, nie pozwalając, by Bijący Dzwon trafił kogokolwiek z drużyny.',
      title: 'Uciszyciel Dzwonów',
    },
    chr_vale_chapter_i: {
      name: 'Kronika Doliny, rozdział I',
      desc: 'Ukończ pierwszy rozdział kroniki Saula: pierwsze posługi w Eastbrook, rozeznanie w Dolinie i pierwszy smak tutejszych rzemiosł.',
    },
    chr_vale_chapter_ii: {
      name: 'Kronika Doliny, rozdział II',
      desc: 'Ukończ drugi rozdział kroniki Saula: wytęp bandytów, murloki i kopalniane szkodniki, rozegraj mecz na Maciorowym Błoniu i staw czoła Relikwiarzowi.',
    },
    chr_vale_chapter_iii: {
      name: 'Kronika Doliny',
      desc: 'Doprowadź historię Doliny do końca: Grobowy Wołacz zdemaskowany, Wydrążona Krypta oczyszczona, a każda z osławionych zgróz Doliny powalona.',
      title: 'z Doliny',
    },
    chr_vale_gatherer: {
      name: 'Z darów ziemi',
      desc: 'Pozyskaj żyłę rudy, drzewostan i kępę ziół w Dolinie Wschodniego Strumienia.',
    },
    chr_vale_first_cast: {
      name: 'Coś siedzi w Jeziorze Lustrzanym',
      desc: 'Złów rybę w wodach Doliny Wschodniego Strumienia.',
    },
    chr_vale_packbreaker: {
      name: 'Pogromca Watahy',
      desc: 'Zabij 3 Leśne Wilki w ciągu 10 sekund.',
    },
    chr_vale_cup_debut: {
      name: 'Pretendent do Miedzianego Wiadra',
      desc: 'Wyjdź na boisko i dotknij piłki w meczu Pucharu Doliny na Maciorowym Błoniu.',
    },
    chr_vale_rares: {
      name: 'Zgrozy Doliny',
      desc: 'Zabij pięć osławionych zgróz Doliny Wschodniego Strumienia: Starego Szaropaszczego, Moggera, Grixa Tunelowego Króla, Kapitana Verlana i Widmowiąża Maldreca.',
    },
    chr_marsh_chapter_i: {
      name: 'Kronika Trzęsawiska, rozdział I',
      desc: 'Ukończ pierwszy rozdział kroniki Osrica Fenna: odpowiedz na zbiórkę przy Moście na Trzęsawisku, zabezpiecz groblę i poznaj kształt mokradeł.',
    },
    chr_marsh_chapter_ii: {
      name: 'Kronika Trzęsawiska, rozdział II',
      desc: 'Ukończ drugi rozdział kroniki Osrica Fenna: wypal gniazda wdów, złóż utopionych na spoczynek, wyciągnij Dorsznego Ojca z wody i staw czoła Litanii.',
    },
    chr_marsh_chapter_iii: {
      name: 'Kronika Mokrzawia',
      desc: 'Doprowadź historię mokradeł do końca: obóz kultu rozbity, Fogbinder uciszony w Zatopionym Bastionie, a każda z osławionych zgróz mgły powalona.',
      title: 'z Mokrzawia',
    },
    chr_marsh_gatherer: {
      name: 'Bagienne zbiory',
      desc: 'Pozyskaj żyłę rudy, drzewostan i kępę ziół na Trzęsawisku Mokrzawia.',
    },
    chr_marsh_unburst: {
      name: 'Nie stój w zarodnikach',
      desc: 'Zabij 8 Bagiennych obrzęklaków i ani razu nie daj się złapać w wybuch ich Żrących Zarodników.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Najpierw uzdrowiciel',
      desc: 'W Obozowisku Grobowych Przyzywaczy zabij Grobowego Uzdrowiciela, zanim zginie którykolwiek z kultystów pod jego opieką.',
    },
    chr_marsh_rares: {
      name: 'Imiona we mgle',
      desc: 'Zabij trzy osławione zgrozy Trzęsawiska Mokrzawia: Bagnopaszczego Nienasyconego, Mulzęba Utopionego i Siostrę Nhalię.',
    },
    chr_peaks_chapter_i: {
      name: 'Kronika Wyżyn, rozdział I',
      desc: 'Ukończ pierwszy rozdział kroniki Zenzie: oczyść trakt na grani, opróżnij nory i poznaj każdą ścieżkę, której strzeże Wysoka Strażnica.',
    },
    chr_peaks_chapter_ii: {
      name: 'Kronika Wyżyn, rozdział II',
      desc: 'Ukończ drugi rozdział kroniki Zenzie: rozbij Obóz Wojenny Drogmara, odczytaj budzącą się burzę i stań tam, gdzie jarzy się Migotliwa Toń.',
    },
    chr_peaks_chapter_iii: {
      name: 'Kronika Ciernistego Szczytu',
      desc: 'Doprowadź historię góry do końca: Kult Żmija rozbity, Sanktuarium uciszone, Budzący się Szczyt powalony, a każda z osławionych zgróz turni pokonana.',
      title: 'z Ciernistego Szczytu',
    },
    chr_peaks_sparring: {
      name: 'Musztra na murach',
      desc: 'Zadaj łącznie 1000 punktów obrażeń manekinowi treningowemu nad Wysoką Strażnicą.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Zimna woda, zimniejsze światło',
      desc: 'Złów rybę z Migotliwej Toni.',
    },
    chr_peaks_moongate: {
      name: 'Przez zimną bramę',
      desc: 'Przejdź przez księżycową bramę na brzegu Migotliwej Toni.',
    },
    chr_peaks_waking_witness: {
      name: 'Góra, która chodzi',
      desc: 'Ujrzyj na własne oczy Thunzharra, Budzący się Szczyt, gdy przemierza górę.',
    },
    chr_peaks_rares: {
      name: 'Imiona wyryte w skale',
      desc: 'Zabij cztery osławione zgrozy Wyżyn Ciernistego Szczytu: Sztygara z Żelaznej Żyły, Brutoka Czaszkokrusza, Voskara Żaroskrzydłego i Szpikowładcę Varkasa.',
    },
    col_discovery_25: {
      name: 'Chomik',
      desc: 'Odkryj 25 różnych przedmiotów (przedmiot liczy się, gdy po raz pierwszy trafi w twoje posiadanie).',
    },
    col_discovery_75: { name: 'Sroka', desc: 'Odkryj 75 różnych przedmiotów.' },
    col_discovery_150: {
      name: 'Gabinet osobliwości',
      desc: 'Odkryj 150 różnych przedmiotów.',
      title: 'Kustosz',
    },
    col_discovery_250: { name: 'Wielki katalog', desc: 'Odkryj 250 różnych przedmiotów.' },
    col_first_rare: {
      name: 'Coś niebieskiego',
      desc: 'Zdobądź swój pierwszy przedmiot rzadkiej jakości.',
    },
    col_first_epic: {
      name: 'Zrodzony w purpurze',
      desc: 'Zdobądź swój pierwszy przedmiot epickiej jakości.',
    },
    col_first_legendary: {
      name: 'Szczęście w kolorze pomarańczy',
      desc: 'Zdobądź swój pierwszy przedmiot legendarnej jakości.',
    },
    col_set_vale_arcanist: {
      name: 'Regalia Arkanisty z Doliny',
      desc: 'Odkryj każdą część Regaliów Arkanisty z Doliny.',
    },
    col_set_boundstone_vanguard: {
      name: 'Awangarda Spętanego Kamienia',
      desc: 'Odkryj każdą część Awangardy Spętanego Kamienia.',
    },
    col_set_greyjaw_stalker: {
      name: 'Oporządzenie Tropiciela Szaroszczękiego',
      desc: 'Odkryj każdą część Oporządzenia Tropiciela Szaroszczękiego.',
    },
    col_set_deathlord: {
      name: 'Rynsztunek Bojowy Barrowlorda',
      desc: 'Odkryj każdą część Rynsztunku Bojowego Barrowlorda.',
    },
    col_set_wyrmshadow: { name: 'Szaty Nightfang', desc: 'Odkryj każdą część Szat Nightfang.' },
    col_set_necromancers: {
      name: 'Odzienie Mournweave',
      desc: 'Odkryj każdą część Odzienia Mournweave.',
    },
    col_set_crownforged: {
      name: 'Regalia Bonewrought',
      desc: 'Odkryj każdą część Regaliów Bonewrought.',
    },
    col_set_nighttalon: { name: 'Futro Direfang', desc: 'Odkryj każdą część Futra Direfang.' },
    col_set_soulflame: {
      name: 'Regalia Wraithfire',
      desc: 'Odkryj każdą część Regaliów Wraithfire.',
    },
    col_set_stormcallers: { name: 'Szaty Galecall', desc: 'Odkryj każdą część Szat Galecall.' },
    col_seven_regalia: {
      name: 'Siedmioraka garderoba',
      desc: 'Odkryj każdą część wszystkich siedmiu epickich rodzin pancerzy.',
      title: 'Olśniewający',
    },
    col_true_colors: {
      name: 'Prawdziwe barwy',
      desc: 'Stań do boju w dowolnym wyglądzie innym niż domyślny dla twojej klasy.',
    },
    col_all_slots: {
      name: 'Wystrojony na jedenastkę',
      desc: 'Miej jednocześnie założony przedmiot w każdym z jedenastu miejsc ekwipunku.',
    },
    col_quartermaster_buyout: {
      name: 'Stały klient',
      desc: 'Odkryj wszystkie dziesięć przedmiotów z zapasów Kwatermistrza Vexa.',
    },
    col_glimmerfin: { name: 'Promyk nadziei', desc: 'Złów Lśniącopłetwego karpia koi.' },
    col_full_creel: {
      name: 'Pełen kosz',
      desc: 'Odkryj wszystkie sześć pospolitych ryb z wód Doliny, Trzęsawiska i Wyżyn.',
    },
    col_junk_drawer: {
      name: 'Szuflada z rupieciami',
      desc: 'Odkryj 10 różnych przedmiotów lichej jakości.',
    },
    pvp_arena_first_match: {
      name: 'Piasek w butach',
      desc: 'Stocz rankingowe starcie w Popielnym Koloseum, w dowolnej z lig.',
    },
    pvp_arena_first_win: {
      name: 'Ryk trybun',
      desc: 'Wygraj rankingowe starcie na arenie, w dowolnej z lig.',
    },
    pvp_arena_1v1_1600: {
      name: 'Pretendent Koloseum',
      desc: 'Osiągnij 1600 punktów rankingowych w arenowej lidze 1v1.',
    },
    pvp_arena_1v1_1750: {
      name: 'Rywal Koloseum',
      desc: 'Osiągnij 1750 punktów rankingowych w arenowej lidze 1v1.',
    },
    pvp_arena_1v1_1900: {
      name: 'Gladiator',
      desc: 'Osiągnij 1900 punktów rankingowych w arenowej lidze 1v1.',
      title: 'Gladiator',
    },
    pvp_arena_2v2_1600: {
      name: 'W dwójce siła',
      desc: 'Osiągnij 1600 punktów rankingowych w arenowej lidze 2v2.',
    },
    pvp_arena_2v2_1750: {
      name: 'Groźny duet',
      desc: 'Osiągnij 1750 punktów rankingowych w arenowej lidze 2v2.',
    },
    pvp_arena_2v2_1900: {
      name: 'Zgranie doskonałe',
      desc: 'Osiągnij 1900 punktów rankingowych w arenowej lidze 2v2.',
    },
    pvp_duel_first_win: { name: 'Załatwmy to na zewnątrz', desc: 'Wygraj pojedynek.' },
    pvp_duel_grace: {
      name: 'Lekcja pokory',
      desc: 'Przegraj pojedynek, ocalając niemal całą godność.',
    },
    pvp_vcup_first_match: {
      name: 'Buty na murawie',
      desc: 'Rozegraj pełny mecz Pucharu Doliny na Maciorowym Błoniu, wygrany czy przegrany.',
    },
    pvp_vcup_first_win: {
      name: 'Pierwsze trofeum',
      desc: 'Wygraj rankingowy mecz Pucharu Doliny.',
    },
    pvp_vcup_wins_10: {
      name: 'Wyjadacz dziczego balonu',
      desc: 'Wygraj 10 rankingowych meczów Pucharu Doliny.',
    },
    pvp_vcup_wins_25: {
      name: 'Legenda dziczego balonu',
      desc: 'Wygraj 25 rankingowych meczów Pucharu Doliny.',
      title: 'Legenda dziczego balonu',
    },
    pvp_vcup_first_goal: {
      name: 'Na listę strzelców',
      desc: 'Zdobądź gola w rankingowym meczu Pucharu Doliny.',
    },
    pvp_vcup_hat_trick: {
      name: 'Bohater hat-tricka',
      desc: 'Zdobądź trzy gole w jednym rankingowym meczu Pucharu Doliny, w lidze 3v3 lub większej.',
    },
    pvp_vcup_golden_goal: {
      name: 'Złota chwila',
      desc: 'Strzel złotego gola, który rozstrzyga rankingowy mecz Pucharu Doliny.',
    },
    pvp_vcup_first_save: {
      name: 'Pewne ręce',
      desc: 'Obroń strzał jako bramkarz w rankingowym meczu Pucharu Doliny.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Mur nie do przebicia',
      desc: 'Wygraj rankingowy mecz Pucharu Doliny jako bramkarz, nie wpuszczając ani jednego gola.',
    },
    pvp_vcup_guild_win: {
      name: 'Za sztandar!',
      desc: 'Wygraj rankingowy mecz Pucharu Doliny, grając pod sztandarem swojej gildii.',
    },
    pvp_fiesta_first_bout: {
      name: 'Nieproszony gość',
      desc: 'Stocz pełne starcie Fiesty 2v2, wygrane czy przegrane.',
    },
    pvp_fiesta_first_win: { name: 'Dusza Fiesty', desc: 'Wygraj starcie Fiesty 2v2.' },
    pvp_fiesta_double: {
      name: 'Podwójny kłopot',
      desc: 'Zalicz dwa powalenia w Fieście w ciągu czterech sekund.',
    },
    pvp_fiesta_shutdown: {
      name: 'Koniec imprezy',
      desc: 'Powal w Fieście przeciwnika, który ma serię trzech lub więcej powaleń.',
    },
    pvp_fiesta_full_build: {
      name: 'Strój na okazję',
      desc: 'Wygraj starcie Fiesty, mając zatwierdzone ulepszenie z każdej z trzech fal.',
    },
    pvp_fiesta_powerups: {
      name: 'Po jednym z każdego',
      desc: 'Podnieś przynajmniej raz każde z czterech wzmocnień ringu: Demona Prędkości, Kolosa, Księżycowe Buty i Berserkera.',
    },
    pvp_fiesta_five_kills: {
      name: 'Cała impreza na barkach',
      desc: 'Zalicz pięć powaleń w jednym starciu Fiesty.',
    },
    soc_first_party: { name: 'Razem raźniej', desc: 'Dołącz do drużyny z innym graczem.' },
    soc_full_house: { name: 'Pełen skład', desc: 'Ukończ loch w pełnej, pięcioosobowej drużynie.' },
    soc_guild_joined: { name: 'Pod jednym sztandarem', desc: 'Zostań członkiem gildii.' },
    soc_guild_founded: { name: 'Pióro założyciela', desc: 'Załóż własną gildię.' },
    soc_first_trade: { name: 'Uczciwa wymiana', desc: 'Dokonaj wymiany z innym graczem.' },
    soc_first_sale: {
      name: 'Otwarcie interesu',
      desc: 'Odbierz monety ze swojej pierwszej sprzedaży na Światowym Rynku.',
    },
    soc_steady_custom: {
      name: 'Stały utarg',
      desc: 'Zgromadź łącznie 10 sztuk złota ze swoich sprzedaży na Światowym Rynku.',
    },
    soc_market_magnate: {
      name: 'Magnat rynku',
      desc: 'Zgromadź łącznie 100 sztuk złota ze swoich sprzedaży na Światowym Rynku.',
      title: 'Magnat',
    },
    soc_by_ravens_wing: {
      name: 'Na kruczych skrzydłach',
      desc: 'Wyślij Kruczą Pocztą list z monetami lub paczką.',
    },
    soc_room_for_more: {
      name: 'Miejsce się znajdzie',
      desc: 'Kup swoje pierwsze rozszerzenie skarbca.',
    },
    soc_gilded_strongbox: {
      name: 'Złocona Szkatuła',
      desc: 'Wykup każde rozszerzenie skarbca, jakie tylko skarbnicy zgodzą się ci sprzedać.',
    },
    soc_meet_bursar: {
      name: 'Ufamy Fernandowi',
      desc: 'Złóż uszanowanie Skarbnikowi Fernandowi, opiekunowi Złoconej Szkatuły w Eastbrook.',
    },
    soc_pocket_money: {
      name: 'Kieszonkowe',
      desc: 'Zdobądź z łupów łącznie 1 sztukę złota w monetach.',
    },
    soc_heavy_purse: {
      name: 'Ciężka sakiewka',
      desc: 'Zdobądź z łupów łącznie 10 sztuk złota w monetach.',
    },
    soc_wyrms_hoard: {
      name: 'Skarb żmija',
      desc: 'Zdobądź z łupów łącznie 100 sztuk złota w monetach.',
    },
    soc_civic_duty: {
      name: 'Obywatelski obowiązek',
      desc: 'Przydziel swój pierwszy punkt rozwoju miasta.',
    },
    exp_long_road_north: {
      name: 'Długa droga na północ',
      desc: 'Odwiedź wszystkie trzy główne osady: Eastbrook, Most na Trzęsawisku i Wysoką Strażnicę.',
    },
    exp_vale_wayfarer: {
      name: 'Wędrowiec Doliny',
      desc: 'Odwiedź wszystkie jedenaście nazwanych miejsc Doliny Wschodniego Strumienia.',
    },
    exp_marsh_wayfarer: {
      name: 'Wędrowiec Trzęsawiska',
      desc: 'Odwiedź wszystkie osiem nazwanych miejsc Trzęsawiska Mokrzawia.',
    },
    exp_peaks_wayfarer: {
      name: 'Wędrowiec Wyżyn',
      desc: 'Odwiedź wszystkie dziesięć nazwanych miejsc Wyżyn Ciernistego Szczytu.',
    },
    exp_world_traveler: {
      name: 'Obieżyświat',
      desc: 'Zdobądź czyn wędrowca każdej z trzech krain.',
      title: 'Wędrowiec',
    },
    exp_something_shiny: { name: 'Błyskotka', desc: 'Podnieś z ziemi migoczący przedmiot.' },
    exp_first_ore: {
      name: 'Kilofem w ziemię!',
      desc: 'Wydobądź surowce ze swojego pierwszego złoża rudy.',
    },
    exp_first_timber: {
      name: 'Uwaga, drzewo!',
      desc: 'Pozyskaj swoje pierwsze stanowisko drewna.',
    },
    exp_first_herb: { name: 'Ręka do zieleni', desc: 'Zbierz swoją pierwszą kępę ziół.' },
    feat_era_cap: {
      name: 'Dziecię Pierwszej Ery',
      desc: 'Poziom 20 osiągnięty, gdy trwała jeszcze Pierwsza Era.',
    },
    feat_book_complete: { name: 'Od deski do deski', desc: 'Zdobądź każdy czyn w Księdze Czynów.' },
    feat_brightwood_relic: {
      name: 'Pamięci Jasnego Boru',
      desc: 'Zachowaj relikt dawnego Jasnego Boru: Kaftan z ciernistej skóry lub Koronę monarchy.',
    },
    hid_saul_footnote: {
      name: 'Przypis do historii',
      desc: 'Saul Kronikarz zniósł od ciebie dziewięć zaczepek bez chwili przerwy.',
      title: 'Przypis',
    },
    hid_gilded_tour: {
      name: 'Złocona wycieczka',
      desc: 'Interesy załatwione we wszystkich trzech oddziałach Złoconej Szkatuły.',
    },
    hid_fall_death: {
      name: 'Grawitacja zawsze wygrywa',
      desc: 'Śmierć po długiej rozmowie z ziemią.',
    },
    hid_keepers_toll_twice: {
      name: 'Strażnik pobiera dwa razy',
      desc: 'Śmierć, gdy Myto Strażnika wciąż na tobie ciążyło.',
    },
    hid_roll_hundred: { name: 'Czysta setka', desc: 'Wyrzucone idealne 100 na zwykłym /roll.' },
    hid_yumi_cheer: {
      name: 'Fanklub Yumi',
      desc: 'Wiwaty dla Yumi w samym środku walki, tam gdzie mogła cię usłyszeć.',
    },
    hid_bountiful_coffer: {
      name: 'Purpurowy kufer',
      desc: 'Obfity Kufer rozpracowany, nim zdążył się zaciąć.',
    },
    hid_companion_save: {
      name: 'Nie na jej warcie',
      desc: 'Twoja towarzyszka wyprawy postawiła powalonego kompana z powrotem na nogi.',
    },
    hid_codfather: {
      name: 'Witamy w rodzinie',
      desc: 'Dorszny Ojciec wyciągnięty z Płycizn Głębokiego Trzęsawiska.',
    },
    prog_crown_below: {
      name: 'Korona w Głębi',
      desc: 'Podążaj za koroną od niespokojnych pól kości aż do grobowca króla Nythraxisa i doprowadź Kres Plagi do końca.',
    },
    prog_mere_at_rest: {
      name: 'Toń Ukojona',
      desc: "Dotrwaj do końca warty Ondrela Vane'a: chór uciszony, Bladozwój zgładzony, a Utopiony Księżyc złożony do snu.",
    },
    prog_callused_hands: {
      name: 'Spracowane Dłonie',
      desc: 'Ukończ Fach dla Każdej Ręki i zarób pierwszy odcisk w fachach Eastbrook.',
    },
    prog_tools_of_the_trade: {
      name: 'Narzędzia Fachu',
      desc: 'Ukończ wytwarzanie wymagające stanowiska w rzemieślniczym zapleczu Wysokiej Strażnicy.',
    },
    dgn_nythraxis_crypt: {
      name: 'Co Kryła Krypta',
      desc: 'Zapuść się do Opuszczonej Krypty i odzyskaj od jej strażników obie połowy zwornika oraz starożytny pamiętnik.',
    },
    chr_marsh_first_cast: {
      name: 'Węgorze w trzcinach',
      desc: 'Złów rybę w wodach Trzęsawiska Mokrzawia.',
    },
  },
  pt_BR: {
    prog_first_steps: {
      name: 'Primeiros Passos',
      desc: 'Alcance o nível 2 e dê o primeiro passo em uma longa estrada.',
    },
    prog_finding_your_feet: {
      name: 'Pegando o Jeito',
      desc: 'Alcance o nível 5; as terras selvagens já parecem um pouco menores.',
    },
    prog_double_digits: {
      name: 'Dois Dígitos',
      desc: 'Alcance o nível 10 e desbloqueie seus talentos.',
    },
    prog_the_long_middle: { name: 'O Longo Meio do Caminho', desc: 'Alcance o nível 15.' },
    prog_level_cap: { name: 'A Vista do Topo', desc: 'Alcance o nível 20, o nível máximo.' },
    prog_well_rested: {
      name: 'Bem Descansado',
      desc: 'Acomode-se em uma estalagem até acumular experiência de descanso.',
    },
    prog_talented: { name: 'Um Ponto Bem Gasto', desc: 'Gaste seu primeiro ponto de talento.' },
    prog_specialized: {
      name: 'Declaração de Intenções',
      desc: 'Escolha uma especialização e aprenda sua habilidade emblemática.',
    },
    prog_deep_roots: {
      name: 'Raízes Profundas',
      desc: 'Gaste um ponto de talento em um talento da fileira final.',
    },
    prog_full_build: {
      name: 'O Onze Titular',
      desc: 'Gaste todos os onze pontos de talento em uma única build.',
    },
    prog_veteran: {
      name: 'Veterano',
      desc: 'Acumule 250.000 de experiência ao longo da vida.',
      title: 'Veterano',
    },
    prog_champion: {
      name: 'Campeão',
      desc: 'Acumule 500.000 de experiência ao longo da vida.',
      title: 'Campeão',
    },
    prog_paragon: {
      name: 'Paragon',
      desc: 'Acumule 1.000.000 de experiência ao longo da vida.',
      title: 'Paragon',
    },
    prog_mythic: {
      name: 'Mítico',
      desc: 'Acumule 2.500.000 de experiência ao longo da vida.',
      title: 'Mítico',
    },
    prog_eternal: {
      name: 'Eterno',
      desc: 'Acumule 5.000.000 de experiência ao longo da vida.',
      title: 'Eterno',
    },
    prog_prestige: {
      name: 'Começar de Novo',
      desc: 'Alcance o nível máximo, encha a barra mais uma vez e reivindique o posto de prestígio 1.',
    },
    prog_prestige_5: { name: 'Velhos Hábitos', desc: 'Alcance o posto de prestígio 5.' },
    prog_prestige_10: { name: 'Movimento Perpétuo', desc: 'Alcance o posto de prestígio 10.' },
    prog_first_harvest: { name: 'Frutos do Campo', desc: 'Colha seu primeiro ponto de coleta.' },
    prog_mining_100: {
      name: 'Minério no Sangue',
      desc: 'Alcance 100 de proficiência em Mineração.',
    },
    prog_logging_100: {
      name: 'Talhador de Cerne',
      desc: 'Alcance 100 de proficiência em Lenharia.',
    },
    prog_herbalism_100: {
      name: 'Mestre da Campina',
      desc: 'Alcance 100 de proficiência em Herborismo.',
    },
    prog_master_gatherer: {
      name: 'Mestre Coletor',
      desc: 'Alcance 100 de proficiência em Mineração, Lenharia e Herborismo.',
    },
    prog_first_craft: { name: 'Feito à Mão', desc: 'Conclua sua primeira criação bem-sucedida.' },
    prog_craft_specialist: {
      name: 'Segredos do Ofício',
      desc: 'Alcance 75 de perícia em um único ofício e desbloqueie suas vantagens de especialização.',
    },
    prog_around_the_ring: {
      name: 'A Volta do Anel',
      desc: 'Alcance 25 de perícia em cinco ofícios diferentes.',
    },
    cmb_first_blood: { name: 'Primeiro Sangue', desc: 'Derrote seu primeiro inimigo.' },
    cmb_slayer: { name: 'Matador', desc: 'Derrote 1.000 inimigos.' },
    cmb_legion_of_one: { name: 'Legião de Um Só', desc: 'Derrote 10.000 inimigos.' },
    cmb_heavy_hitter: { name: 'Mão Pesada', desc: 'Cause 500.000 de dano no total.' },
    cmb_critical_eye: { name: 'Olho Crítico', desc: 'Acerte 500 golpes críticos.' },
    cmb_giantslayer: {
      name: 'Mata-Gigantes',
      desc: 'Dê o golpe fatal em um inimigo pelo menos cinco níveis acima do seu.',
    },
    cmb_first_fall: {
      name: 'Levanta, Sacode a Poeira',
      desc: 'Morra pela primeira vez; acontece até com os melhores.',
    },
    dgn_hollow_crypt: {
      name: 'Quebra-Criptas',
      desc: 'Derrote Morthen o Gravecaller na Cripta Vazia.',
    },
    dgn_sunken_bastion: {
      name: 'Fogbinder Desatado',
      desc: 'Derrote Vael, o Fogbinder, no Bastião Submerso.',
    },
    dgn_drowned_temple: {
      name: 'Afogando a Lua',
      desc: 'Derrote Ysolei, Avatar da Lua Afogada, no Templo Afogado.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'O Wyrm Lá Embaixo',
      desc: 'Derrote Korzul o Gravewyrm no Santuário do Gravewyrm.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Heroico: A Cripta Vazia',
      desc: 'Derrote Morthen o Gravecaller na Cripta Vazia na dificuldade Heroica.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Heroico: O Bastião Submerso',
      desc: 'Derrote Vael, o Fogbinder, no Bastião Submerso na dificuldade Heroica.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Heroico: O Templo Afogado',
      desc: 'Derrote Ysolei, Avatar da Lua Afogada, no Templo Afogado na dificuldade Heroica.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Heroico: Santuário do Gravewyrm',
      desc: 'Derrote Korzul o Gravewyrm no Santuário do Gravewyrm na dificuldade Heroica.',
    },
    dgn_nythraxis: {
      name: 'Flagelo Nunca Mais',
      desc: 'Derrote Nythraxis, Flagelo de Thornpeak, além da porta real selada.',
    },
    dgn_nythraxis_heroic: {
      name: 'Heroico: Flagelo Nunca Mais',
      desc: 'Derrote Nythraxis, Flagelo de Thornpeak, na dificuldade Heroica.',
    },
    dgn_thornpeak_rounds: {
      name: 'Fazendo a Ronda',
      desc: 'Limpe a Cripta Vazia, o Bastião Submerso, o Templo Afogado e o Santuário do Gravewyrm.',
    },
    dgn_deepward: {
      name: 'Guarda das Profundezas',
      desc: 'Conquiste todas as masmorras, a raide e as duas incursões na dificuldade Heroica.',
    },
    dgn_mark_circuit: {
      name: 'O Circuito Completo',
      desc: 'Ganhe Marcas Heroicas das quatro masmorras Heroicas em um único dia.',
    },
    dgn_boss_clears_50: {
      name: 'Cinquenta Portas Depois',
      desc: 'Derrote 50 chefes finais de masmorra.',
    },
    dgn_morthen_flawless: {
      name: 'Nenhum Osso Fora do Lugar',
      desc: 'Derrote Morthen o Gravecaller na dificuldade Heroica sem que nenhum membro do grupo morra.',
    },
    dgn_morthen_trio: {
      name: 'Três Contra a Cova',
      desc: 'Derrote Morthen o Gravecaller com três jogadores ou menos.',
    },
    dgn_olen_arc: {
      name: 'Desvie do Ceifador',
      desc: 'Derrote o Cavaleiro-comandante Olen sem que o Arco Ceifante dele atinja ninguém além do alvo atual.',
    },
    dgn_vael_thralls: {
      name: 'Nenhum Servo Meu',
      desc: 'Derrote Vael, o Fogbinder, com todos os Servos afogados que ele convoca já mortos.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Até a Última Cria da Lua',
      desc: 'Derrote Ysolei com todas as Crias da Lua que ela convoca já mortas.',
    },
    dgn_ysolei_flawless: {
      name: 'Olhos Secos',
      desc: 'Derrote Ysolei, Avatar da Lua Afogada, na dificuldade Heroica sem que nenhum membro do grupo morra.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Fiquem Enterrados',
      desc: 'Derrote o Grande necromante Velkhar com todos os Andarilhos de ossos erguidos destruídos antes de ele cair.',
    },
    dgn_korzul_flawless: {
      name: 'Mata-Wyrm',
      desc: 'Derrote Korzul o Gravewyrm na dificuldade Heroica sem que nenhum membro do grupo morra.',
      title: 'Mata-Wyrm',
    },
    dgn_sanctum_speed: {
      name: 'Corrida no Santuário',
      desc: 'Derrote Korzul o Gravewyrm em até 15 minutos após seu grupo reivindicar o Santuário do Gravewyrm.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Perante Rei Nenhum',
      desc: 'Derrote Nythraxis sem que o Quebra-Túmulos atinja ninguém além do alvo atual dele.',
    },
    dgn_nythraxis_wardens: {
      name: 'Guardiões das Pedras de Guarda',
      desc: 'Derrote Nythraxis com toda Fúria Imortal interrompida antes de acertar.',
    },
    dgn_nythraxis_deathless: {
      name: 'Mais Imortal, Impossível',
      desc: 'Derrote Nythraxis, Flagelo de Thornpeak, na dificuldade Heroica sem que um único membro da raide morra.',
      title: 'o Imortal',
    },
    cmb_thunzharr: {
      name: 'A Montanha Caiu',
      desc: 'Derrube Thunzharr, o Pico Desperto, em Stormcrag.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Quebra-Picos',
      desc: 'Derrube Thunzharr, o Pico Desperto, sem morrer do seu primeiro golpe ao último suspiro dele.',
      title: 'Quebra-Picos',
    },
    cmb_thunzharr_ten: {
      name: 'Hábito de Montanhas',
      desc: 'Derrube Thunzharr, o Pico Desperto, dez vezes.',
    },
    dlv_reliquary: { name: 'Incursor do Relicário', desc: 'Limpe o Relicário Desmoronado.' },
    dlv_reliquary_heroic: {
      name: 'Heroico: O Relicário Desmoronado',
      desc: 'Limpe o Relicário Desmoronado no nível Heroico.',
    },
    dlv_litany: { name: 'Cale a Ladainha', desc: 'Limpe a Ladainha Afogada.' },
    dlv_litany_heroic: {
      name: 'Heroico: A Ladainha Afogada',
      desc: 'Limpe a Ladainha Afogada no nível Heroico.',
    },
    dlv_lore_journal: {
      name: 'Marginália',
      desc: 'Desbloqueie todas as cinco entradas do diário de incursão.',
    },
    dlv_companion_max: {
      name: 'Uma Amiga nas Profundezas',
      desc: 'Eleve uma companheira de incursão ao posto mais alto dela.',
    },
    dlv_companions_both: {
      name: 'Duas Lanternas Acesas',
      desc: 'Eleve as duas companheiras de incursão, a Acólita Tessa e Edda Reedhand, ao posto mais alto delas.',
    },
    dlv_clears_50: { name: 'Cinquenta Braças', desc: 'Complete 50 incursões.' },
    dlv_solo_heroic: {
      name: 'Dois Já É Demais',
      desc: 'Limpe uma incursão de nível Heroico sem nenhum outro jogador, apenas você e sua companheira.',
    },
    dlv_tumbler_premium: {
      name: 'O Caminho dos Pinos, Dominado',
      desc: 'Abra um baú protegido do relicário na aposta mais alta, sem falhas em sua única tentativa.',
    },
    dlv_rite_flawless: {
      name: 'Sem Tirar Nem Pôr',
      desc: 'Complete o Rito do Relicário Afogado sem um único erro.',
    },
    dlv_varric_ringers: {
      name: 'Os Sinos Emudecem',
      desc: 'Derrote o Diácono Varric com todos os Sineiros Fúnebres que ele ergue já abatidos.',
    },
    dlv_nhalia_bells: {
      name: 'Aquieta-Sinos',
      desc: 'Derrote a Irmã Nhalia, o Cântico Afogado, sem que nenhum membro do grupo seja atingido por um Sino Badalante.',
      title: 'Aquieta-Sinos',
    },
    chr_vale_chapter_i: {
      name: 'Crônica do Vale, Capítulo I',
      desc: 'Termine o primeiro capítulo da crônica de Saul: as primeiras tarefas de Eastbrook, o traçado do Vale e um primeiro gosto de seus ofícios.',
    },
    chr_vale_chapter_ii: {
      name: 'Crônica do Vale, Capítulo II',
      desc: 'Termine o segundo capítulo da crônica de Saul: bandidos, murlocs e pragas da mina exterminados, o Sowfield disputado e o Relicário enfrentado.',
    },
    chr_vale_chapter_iii: {
      name: 'Crônica do Vale',
      desc: 'Acompanhe a história do Vale até o fim: o Gravecaller desmascarado, a Cripta Vazia purificada e cada terror nomeado do Vale abatido.',
      title: 'do Vale',
    },
    chr_vale_gatherer: {
      name: 'Vivendo da Terra',
      desc: 'Colha um veio de minério, um bosque de madeira e um canteiro de ervas no Vale de Eastbrook.',
    },
    chr_vale_first_cast: {
      name: 'Algo no Lago Espelho',
      desc: 'Pesque um peixe nas águas do Vale de Eastbrook.',
    },
    chr_vale_packbreaker: {
      name: 'Quebra-Alcateia',
      desc: 'Mate 3 Lobos da floresta em 10 segundos.',
    },
    chr_vale_cup_debut: {
      name: 'Candidato ao Balde de Cobre',
      desc: 'Entre em campo e toque na bola em uma partida da Copa do Vale no Sowfield.',
    },
    chr_vale_rares: {
      name: 'Terrores do Vale',
      desc: 'Mate os cinco terrores nomeados do Vale de Eastbrook: Velho Greyjaw, Mogger, Grix o Rei dos Túneis, Capitão Verlan e Maldrec o Atador-de-espectros.',
    },
    chr_marsh_chapter_i: {
      name: 'Crônica do Pântano, Capítulo I',
      desc: 'Termine o primeiro capítulo da crônica de Osric Fenn: atenda à convocação de Fenbridge, proteja a passagem elevada e aprenda o feitio do brejo.',
    },
    chr_marsh_chapter_ii: {
      name: 'Crônica do Pântano, Capítulo II',
      desc: 'Termine o segundo capítulo da crônica de Osric Fenn: as viúvas expulsas a fogo, os afogados postos para descansar, o Bacalhau-Padrinho fisgado e a Ladainha enfrentada.',
    },
    chr_marsh_chapter_iii: {
      name: 'Crônica de Mirefen',
      desc: 'Acompanhe a história do brejo até o fim: o acampamento do culto desfeito, o Fogbinder silenciado no Bastião Submerso e cada terror nomeado da névoa abatido.',
      title: 'de Mirefen',
    },
    chr_marsh_gatherer: {
      name: 'Coleta em Fenbridge',
      desc: 'Colha um veio de minério, um bosque de madeira e um canteiro de ervas no Pântano de Mirefen.',
    },
    chr_marsh_unburst: {
      name: 'Não Fique nos Esporos',
      desc: 'Mate 8 Inchaços do brejo sem ser apanhado pela explosão de seus Esporos Cáusticos.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Cale a Cura',
      desc: 'No Acampamento Gravecaller, mate um Restaurador Gravecaller antes de qualquer um dos cultistas aos cuidados dele.',
    },
    chr_marsh_rares: {
      name: 'Nomes na Névoa',
      desc: 'Mate os três terrores nomeados do Pântano de Mirefen: Mirejaw, o Voraz; Sloomtooth o Afogado; e a Irmã Nhalia.',
    },
    chr_peaks_chapter_i: {
      name: 'Crônica dos Picos, Capítulo I',
      desc: 'Termine o primeiro capítulo da crônica de Zenzie: limpe a estrada da crista, esvazie as tocas e conheça cada caminho que Highwatch guarda.',
    },
    chr_peaks_chapter_ii: {
      name: 'Crônica dos Picos, Capítulo II',
      desc: 'Termine o segundo capítulo da crônica de Zenzie: desfaça o acampamento de guerra de Drogmar, decifre a tempestade que desperta e pise onde o Glimmermere reluz.',
    },
    chr_peaks_chapter_iii: {
      name: 'Crônica de Thornpeak',
      desc: 'Acompanhe a história da montanha até o fim: o Culto do Wyrm desfeito, o Santuário silenciado, o Pico Desperto derrubado e cada terror nomeado dos penhascos abatido.',
      title: 'de Thornpeak',
    },
    chr_peaks_sparring: {
      name: 'Treino de Muralha',
      desc: 'Cause 1.000 de dano total ao Boneco de Treino acima de Highwatch.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Água Fria, Luz Mais Fria',
      desc: 'Pesque um peixe no Glimmermere.',
    },
    chr_peaks_moongate: {
      name: 'Pelo Portão Frio',
      desc: 'Atravesse o portão lunar na margem do Glimmermere.',
    },
    chr_peaks_waking_witness: {
      name: 'A Montanha Que Anda',
      desc: 'Ponha os olhos em Thunzharr, o Pico Desperto, enquanto ele caminha pela montanha.',
    },
    chr_peaks_rares: {
      name: 'Nomes Talhados na Rocha',
      desc: 'Mate os quatro terrores nomeados das Alturas de Thornpeak: o Capataz Veio de Ferro, Brutok Quebra-crânios, Voskar Asa-de-brasa e o Senhor da Medula Varkas.',
    },
    col_discovery_25: {
      name: 'Acumulador',
      desc: 'Descubra 25 itens diferentes (um item conta na primeira vez que entra em sua posse).',
    },
    col_discovery_75: { name: 'Pega Ladra', desc: 'Descubra 75 itens diferentes.' },
    col_discovery_150: {
      name: 'Gabinete de Curiosidades',
      desc: 'Descubra 150 itens diferentes.',
      title: 'o Curador',
    },
    col_discovery_250: { name: 'O Grande Catálogo', desc: 'Descubra 250 itens diferentes.' },
    col_first_rare: { name: 'Algo Azul', desc: 'Adquira seu primeiro item de qualidade rara.' },
    col_first_epic: {
      name: 'Nascido na Púrpura',
      desc: 'Adquira seu primeiro item de qualidade épica.',
    },
    col_first_legendary: {
      name: 'Que Laranja a Sua!',
      desc: 'Adquira seu primeiro item de qualidade lendária.',
    },
    col_set_vale_arcanist: {
      name: 'Regália do Arcanista do Vale',
      desc: 'Descubra cada peça da Regália do Arcanista do Vale.',
    },
    col_set_boundstone_vanguard: {
      name: 'Vanguarda Pedra-vínculo',
      desc: 'Descubra cada peça da Vanguarda Pedra-vínculo.',
    },
    col_set_greyjaw_stalker: {
      name: 'Equipamento do Espreitador de Greyjaw',
      desc: 'Descubra cada peça do Equipamento do Espreitador de Greyjaw.',
    },
    col_set_deathlord: {
      name: 'Equipamento de Batalha Barrowlord',
      desc: 'Descubra cada peça do Equipamento de Batalha Barrowlord.',
    },
    col_set_wyrmshadow: {
      name: 'Vestimentas Nightfang',
      desc: 'Descubra cada peça das Vestimentas Nightfang.',
    },
    col_set_necromancers: {
      name: 'Traje Mournweave',
      desc: 'Descubra cada peça do Traje Mournweave.',
    },
    col_set_crownforged: {
      name: 'Regália Bonewrought',
      desc: 'Descubra cada peça da Regália Bonewrought.',
    },
    col_set_nighttalon: { name: 'Pele Direfang', desc: 'Descubra cada peça da Pele Direfang.' },
    col_set_soulflame: {
      name: 'Regália Wraithfire',
      desc: 'Descubra cada peça da Regália Wraithfire.',
    },
    col_set_stormcallers: {
      name: 'Vestimentas Galecall',
      desc: 'Descubra cada peça das Vestimentas Galecall.',
    },
    col_seven_regalia: {
      name: 'O Guarda-Roupa Sétuplo',
      desc: 'Descubra cada peça de todas as sete famílias de armaduras épicas.',
      title: 'o Resplandecente',
    },
    col_true_colors: {
      name: 'Cores Verdadeiras',
      desc: 'Entre em campo vestindo qualquer aparência que não seja a padrão da sua classe.',
    },
    col_all_slots: {
      name: 'Dos Pés aos Onze',
      desc: 'Tenha um item equipado em cada um dos onze espaços de equipamento ao mesmo tempo.',
    },
    col_quartermaster_buyout: {
      name: 'Cliente Preferencial',
      desc: 'Descubra todas as dez peças do estoque heroico do Intendente Vex.',
    },
    col_glimmerfin: {
      name: 'Lampejo de Esperança',
      desc: 'Pesque um Koi de nadadeiras cintilantes.',
    },
    col_full_creel: {
      name: 'Cesto Cheio',
      desc: 'Descubra todos os seis pescados comuns das águas do Vale, do Pântano e das Alturas.',
    },
    col_junk_drawer: {
      name: 'A Gaveta de Tralhas',
      desc: 'Descubra 10 itens diferentes de qualidade ruim.',
    },
    pvp_arena_first_match: {
      name: 'Areia nas Botas',
      desc: 'Dispute uma partida ranqueada no Coliseu das Cinzas, em qualquer uma das chaves.',
    },
    pvp_arena_first_win: {
      name: 'A Multidão Ruge',
      desc: 'Vença uma partida ranqueada de arena em qualquer uma das chaves.',
    },
    pvp_arena_1v1_1600: {
      name: 'Contendor do Coliseu',
      desc: 'Alcance 1600 de classificação na chave 1v1 da arena.',
    },
    pvp_arena_1v1_1750: {
      name: 'Rival do Coliseu',
      desc: 'Alcance 1750 de classificação na chave 1v1 da arena.',
    },
    pvp_arena_1v1_1900: {
      name: 'Gladiador',
      desc: 'Alcance 1900 de classificação na chave 1v1 da arena.',
      title: 'Gladiador',
    },
    pvp_arena_2v2_1600: {
      name: 'Força em Dobro',
      desc: 'Alcance 1600 de classificação na chave 2v2 da arena.',
    },
    pvp_arena_2v2_1750: {
      name: 'Dupla Temível',
      desc: 'Alcance 1750 de classificação na chave 2v2 da arena.',
    },
    pvp_arena_2v2_1900: {
      name: 'Parceria Perfeita',
      desc: 'Alcance 1900 de classificação na chave 2v2 da arena.',
    },
    pvp_duel_first_win: { name: 'Resolva Lá Fora', desc: 'Vença um duelo.' },
    pvp_duel_grace: {
      name: 'Uma Lição de Humildade',
      desc: 'Perca um duelo com a dignidade quase intacta.',
    },
    pvp_vcup_first_match: {
      name: 'Chuteiras no Gramado',
      desc: 'Jogue uma partida completa da Copa do Vale no Sowfield, vencendo ou perdendo.',
    },
    pvp_vcup_first_win: {
      name: 'A Primeira Taça',
      desc: 'Vença uma partida ranqueada da Copa do Vale.',
    },
    pvp_vcup_wins_10: {
      name: 'Javalibolista Tarimbado',
      desc: 'Vença 10 partidas ranqueadas da Copa do Vale.',
    },
    pvp_vcup_wins_25: {
      name: 'Lenda do Javalibol',
      desc: 'Vença 25 partidas ranqueadas da Copa do Vale.',
      title: 'Lenda do Javalibol',
    },
    pvp_vcup_first_goal: {
      name: 'Estreia no Placar',
      desc: 'Marque um gol em uma partida ranqueada da Copa do Vale.',
    },
    pvp_vcup_hat_trick: {
      name: 'Herói do Hat-Trick',
      desc: 'Marque três gols em uma única partida ranqueada da Copa do Vale, na chave 3v3 ou maior.',
    },
    pvp_vcup_golden_goal: {
      name: 'Momento de Ouro',
      desc: 'Marque o gol de ouro que decide uma partida ranqueada da Copa do Vale.',
    },
    pvp_vcup_first_save: {
      name: 'Mãos Seguras',
      desc: 'Faça uma defesa como goleiro em uma partida ranqueada da Copa do Vale.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Aqui Não Passa Nada',
      desc: 'Vença uma partida ranqueada da Copa do Vale como goleiro sem sofrer nenhum gol.',
    },
    pvp_vcup_guild_win: {
      name: 'Pelo Estandarte',
      desc: 'Vença uma partida ranqueada da Copa do Vale disputada sob o estandarte da sua guilda.',
    },
    pvp_fiesta_first_bout: {
      name: 'Penetra na Festa',
      desc: 'Dispute um confronto 2v2 completo da Fiesta, vencendo ou perdendo.',
    },
    pvp_fiesta_first_win: { name: 'A Alma da Fiesta', desc: 'Vença um confronto 2v2 da Fiesta.' },
    pvp_fiesta_double: {
      name: 'Dose Dupla de Encrenca',
      desc: 'Consiga dois abates na Fiesta em até quatro segundos.',
    },
    pvp_fiesta_shutdown: {
      name: 'Estraga-Prazeres',
      desc: 'Abata um adversário da Fiesta que esteja em uma sequência de três ou mais.',
    },
    pvp_fiesta_full_build: {
      name: 'Vestido para a Ocasião',
      desc: 'Vença um confronto da Fiesta com um aprimoramento garantido de todas as três ondas.',
    },
    pvp_fiesta_powerups: {
      name: 'Um de Cada',
      desc: 'Pegue cada um dos quatro power-ups do ringue pelo menos uma vez: Demônio da Velocidade, Colosso, Botas Lunares e Berserker.',
    },
    pvp_fiesta_five_kills: {
      name: 'Carregando a Festa nas Costas',
      desc: 'Consiga cinco abates em um único confronto da Fiesta.',
    },
    soc_first_party: { name: 'Juntos É Melhor', desc: 'Entre em um grupo com outro jogador.' },
    soc_full_house: {
      name: 'Casa Cheia',
      desc: 'Conclua uma masmorra com um grupo completo de cinco.',
    },
    soc_guild_joined: { name: 'Sob o Mesmo Estandarte', desc: 'Torne-se membro de uma guilda.' },
    soc_guild_founded: { name: 'A Pena do Fundador', desc: 'Funde a sua própria guilda.' },
    soc_first_trade: { name: 'Troca Justa', desc: 'Conclua uma troca com outro jogador.' },
    soc_first_sale: {
      name: 'Aberto para Negócios',
      desc: 'Recolha as moedas da sua primeira venda no Mercado Mundial.',
    },
    soc_steady_custom: {
      name: 'Freguesia Fiel',
      desc: 'Recolha um total vitalício de 10 de ouro em vendas no Mercado Mundial.',
    },
    soc_market_magnate: {
      name: 'Magnata do Mercado',
      desc: 'Recolha um total vitalício de 100 de ouro em vendas no Mercado Mundial.',
      title: 'Magnata',
    },
    soc_by_ravens_wing: {
      name: 'Nas Asas do Corvo',
      desc: 'Envie uma carta pelo Correio do Corvo levando moedas ou uma encomenda.',
    },
    soc_room_for_more: { name: 'Espaço para Mais', desc: 'Compre sua primeira expansão de banco.' },
    soc_gilded_strongbox: {
      name: 'A Arca Dourada',
      desc: 'Compre cada expansão de banco que os tesoureiros tiverem à venda.',
    },
    soc_meet_bursar: {
      name: 'Em Fernando Confiamos',
      desc: 'Apresente seus respeitos ao Tesoureiro Fernando, guardião da Arca Dourada em Eastbrook.',
    },
    soc_pocket_money: {
      name: 'Dinheiro no Bolso',
      desc: 'Saqueie um total vitalício de 1 de ouro em moedas.',
    },
    soc_heavy_purse: {
      name: 'Bolsa Pesada',
      desc: 'Saqueie um total vitalício de 10 de ouro em moedas.',
    },
    soc_wyrms_hoard: {
      name: 'O Tesouro de um Wyrm',
      desc: 'Saqueie um total vitalício de 100 de ouro em moedas.',
    },
    soc_civic_duty: { name: 'Dever Cívico', desc: 'Aloque seu primeiro ponto de Foco da Cidade.' },
    exp_long_road_north: {
      name: 'A Longa Estrada para o Norte',
      desc: 'Visite os três povoados principais: Eastbrook, Fenbridge e Highwatch.',
    },
    exp_vale_wayfarer: {
      name: 'Andarilho do Vale',
      desc: 'Visite todos os onze locais nomeados do Vale de Eastbrook.',
    },
    exp_marsh_wayfarer: {
      name: 'Andarilho do Pântano',
      desc: 'Visite todos os oito locais nomeados do Pântano de Mirefen.',
    },
    exp_peaks_wayfarer: {
      name: 'Andarilho das Alturas',
      desc: 'Visite todos os dez locais nomeados das Alturas de Thornpeak.',
    },
    exp_world_traveler: {
      name: 'Viajante do Mundo',
      desc: 'Conquiste o feito de andarilho das três zonas.',
      title: 'o Andarilho',
    },
    exp_something_shiny: { name: 'Algo Brilhante', desc: 'Pegue um objeto cintilante do chão.' },
    exp_first_ore: { name: 'Golpeie a Terra', desc: 'Colete seu primeiro veio de minério.' },
    exp_first_timber: { name: 'Madeira!', desc: 'Colete seu primeiro ponto de madeira.' },
    exp_first_herb: { name: 'Dedo Verde', desc: 'Colha seu primeiro ponto de ervas.' },
    feat_era_cap: {
      name: 'Cria da Primeira Era',
      desc: 'Alcançou o nível 20 enquanto a Primeira Era estava em vigor.',
    },
    feat_book_complete: {
      name: 'O Livro Inteiro',
      desc: 'Conquiste cada feito do Livro dos Feitos.',
    },
    feat_brightwood_relic: {
      name: 'Brightwood na Lembrança',
      desc: 'Guarde uma relíquia da velha Brightwood: o Gibão de couro de sarça ou a Coroa do Monarca.',
    },
    hid_saul_footnote: {
      name: 'Uma Nota de Rodapé na História',
      desc: 'Importunou Saul, o Cronista, nove vezes, sem parar.',
      title: 'a Nota de Rodapé',
    },
    hid_gilded_tour: {
      name: 'A Turnê Dourada',
      desc: 'Fez negócios com as três agências da Arca Dourada.',
    },
    hid_fall_death: {
      name: 'A Gravidade Sempre Vence',
      desc: 'Morreu de uma longa conversa com o chão.',
    },
    hid_keepers_toll_twice: {
      name: 'O Guardião Cobra Duas Vezes',
      desc: 'Morreu enquanto o Tributo do Guardião ainda pesava sobre você.',
    },
    hid_roll_hundred: { name: 'Cem Natural', desc: 'Rolou um 100 perfeito em um /roll comum.' },
    hid_yumi_cheer: {
      name: 'Maior Fã da Yumi',
      desc: 'Torceu por Yumi onde ela podia ouvir você, em plena luta.',
    },
    hid_bountiful_coffer: {
      name: 'O Baú Púrpura',
      desc: 'Abriu um Baú Farto antes que ele pudesse emperrar.',
    },
    hid_companion_save: {
      name: 'Não no Turno Dela',
      desc: 'Sua companheira de incursão reergueu um companheiro de grupo caído.',
    },
    hid_codfather: {
      name: 'Entrou para a Família',
      desc: 'Tirou O Bacalhau-Padrinho dos Baixios de Deepfen.',
    },
    prog_crown_below: {
      name: 'A Coroa Sob a Terra',
      desc: 'Siga a coroa desde os campos de ossos inquietos até a tumba do Rei Nythraxis e conclua O Fim do Flagelo.',
    },
    prog_mere_at_rest: {
      name: 'O Lago em Repouso',
      desc: 'Acompanhe até o fim a vigília de Ondrel Vane: o coro silenciado, o Anel Pálido abatido e a Lua Afogada posta em repouso.',
    },
    prog_callused_hands: {
      name: 'Mãos Calejadas',
      desc: 'Complete Um Ofício para Cada Mão e ganhe seu primeiro calo nos ofícios de Eastbrook.',
    },
    prog_tools_of_the_trade: {
      name: 'Ferramentas do Ofício',
      desc: 'Conclua uma criação que exige uma estação no polo de ofícios de Highwatch.',
    },
    dgn_nythraxis_crypt: {
      name: 'O Que a Cripta Guardava',
      desc: 'Enfrente a Cripta abandonada e recupere de seus guardiões as duas metades da pedra-chave e o diário antigo.',
    },
    chr_marsh_first_cast: {
      name: 'Enguias nos Juncos',
      desc: 'Pesque um peixe nas águas do Pântano de Mirefen.',
    },
  },
  ru_RU: {
    prog_first_steps: {
      name: 'Первые шаги',
      desc: 'Достигните 2-го уровня и сделайте первый шаг на долгом пути.',
    },
    prog_finding_your_feet: {
      name: 'Твёрдо на ногах',
      desc: 'Достигните 5-го уровня: дикие земли уже кажутся чуть меньше.',
    },
    prog_double_digits: {
      name: 'Второй десяток',
      desc: 'Достигните 10-го уровня и откройте таланты.',
    },
    prog_the_long_middle: { name: 'Долгая середина', desc: 'Достигните 15-го уровня.' },
    prog_level_cap: { name: 'Вид с вершины', desc: 'Достигните 20-го уровня, предела развития.' },
    prog_well_rested: {
      name: 'Как следует отдохнув',
      desc: 'Устройтесь в таверне и оставайтесь там, пока не заработаете опыт отдыха.',
    },
    prog_talented: { name: 'Очко, вложенное с умом', desc: 'Потратьте первое очко талантов.' },
    prog_specialized: {
      name: 'Заявление о намерениях',
      desc: 'Выберите специализацию и изучите её коронную способность.',
    },
    prog_deep_roots: {
      name: 'Глубокие корни',
      desc: 'Вложите очко талантов в талант последнего ряда.',
    },
    prog_full_build: {
      name: 'Все одиннадцать',
      desc: 'Потратьте все одиннадцать очков талантов в рамках одной сборки.',
    },
    prog_veteran: {
      name: 'Ветеран',
      desc: 'Накопите 250 000 опыта за всё время игры.',
      title: 'Ветеран',
    },
    prog_champion: {
      name: 'Чемпион',
      desc: 'Накопите 500 000 опыта за всё время игры.',
      title: 'Чемпион',
    },
    prog_paragon: {
      name: 'Образец',
      desc: 'Накопите 1 000 000 опыта за всё время игры.',
      title: 'Образец',
    },
    prog_mythic: {
      name: 'Мифический',
      desc: 'Накопите 2 500 000 опыта за всё время игры.',
      title: 'Мифический',
    },
    prog_eternal: {
      name: 'Вечный',
      desc: 'Накопите 5 000 000 опыта за всё время игры.',
      title: 'Вечный',
    },
    prog_prestige: {
      name: 'Начать заново',
      desc: 'Достигните предела развития, заполните полосу опыта ещё раз и получите 1-й ранг престижа.',
    },
    prog_prestige_5: { name: 'Старые привычки', desc: 'Достигните 5-го ранга престижа.' },
    prog_prestige_10: { name: 'Вечный двигатель', desc: 'Достигните 10-го ранга престижа.' },
    prog_first_harvest: {
      name: 'Плоды земли',
      desc: 'Соберите ресурсы со своего первого источника добычи.',
    },
    prog_mining_100: { name: 'Руда в крови', desc: 'Доведите навык горного дела до 100.' },
    prog_logging_100: { name: 'Рубщик сердцевины', desc: 'Доведите навык лесозаготовки до 100.' },
    prog_herbalism_100: { name: 'Хозяин луга', desc: 'Доведите навык травничества до 100.' },
    prog_master_gatherer: {
      name: 'Мастер-собиратель',
      desc: 'Доведите до 100 навыки горного дела, лесозаготовки и травничества.',
    },
    prog_first_craft: { name: 'Ручная работа', desc: 'Успешно создайте своё первое изделие.' },
    prog_craft_specialist: {
      name: 'Секреты ремесла',
      desc: 'Доведите до 75 навык любого из ремёсел и откройте бонусы его специализации.',
    },
    prog_around_the_ring: {
      name: 'По кругу ремёсел',
      desc: 'Доведите навык до 25 в пяти разных ремёслах.',
    },
    cmb_first_blood: { name: 'Первая кровь', desc: 'Одолейте своего первого врага.' },
    cmb_slayer: { name: 'Истребитель', desc: 'Одолейте 1000 врагов.' },
    cmb_legion_of_one: { name: 'Легион из одного', desc: 'Одолейте 10 000 врагов.' },
    cmb_heavy_hitter: { name: 'Тяжёлая рука', desc: 'Нанесите 500 000 суммарного урона.' },
    cmb_critical_eye: { name: 'Намётанный глаз', desc: 'Нанесите 500 критических ударов.' },
    cmb_giantslayer: {
      name: 'Убийца великанов',
      desc: 'Нанесите смертельный удар врагу, который как минимум на пять уровней выше вас.',
    },
    cmb_first_fall: {
      name: 'Отряхнись и вставай',
      desc: 'Погибните в первый раз: такое случается и с лучшими из нас.',
    },
    dgn_hollow_crypt: {
      name: 'Сокрушитель крипты',
      desc: 'Одолейте Мортена Могильного Зова в Пустой крипте.',
    },
    dgn_sunken_bastion: {
      name: 'Вязатель развязан',
      desc: 'Одолейте Ваэля Вязателя Тумана в Затонувшем бастионе.',
    },
    dgn_drowned_temple: {
      name: 'Утопить луну',
      desc: 'Одолейте Изолею, Воплощение Утонувшей луны, в Утонувшем храме.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Вирм внизу',
      desc: 'Одолейте Корзула Могильного Вирма в Святилище Могильного Вирма.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Героизм: Пустая крипта',
      desc: 'Одолейте Мортена Могильного Зова в Пустой крипте на героической сложности.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Героизм: Затонувший бастион',
      desc: 'Одолейте Ваэля Вязателя Тумана в Затонувшем бастионе на героической сложности.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Героизм: Утонувший храм',
      desc: 'Одолейте Изолею, Воплощение Утонувшей луны, в Утонувшем храме на героической сложности.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Героизм: Святилище Могильного Вирма',
      desc: 'Одолейте Корзула Могильного Вирма в Святилище Могильного Вирма на героической сложности.',
    },
    dgn_nythraxis: {
      name: 'Бича больше нет',
      desc: 'Одолейте Нитраксиса, Бича Торнпика, за запечатанной королевской дверью.',
    },
    dgn_nythraxis_heroic: {
      name: 'Героизм: Бича больше нет',
      desc: 'Одолейте Нитраксиса, Бича Торнпика, на героической сложности.',
    },
    dgn_thornpeak_rounds: {
      name: 'Полный обход',
      desc: 'Зачистите Пустую крипту, Затонувший бастион, Утонувший храм и Святилище Могильного Вирма.',
    },
    dgn_deepward: {
      name: 'Страж глубин',
      desc: 'Покорите каждое подземелье, рейд и обе вылазки на героической сложности.',
    },
    dgn_mark_circuit: {
      name: 'Полный круг',
      desc: 'Получите Героические знаки во всех четырёх героических подземельях за один день.',
    },
    dgn_boss_clears_50: {
      name: 'Пятьдесят дверей позади',
      desc: 'Одолейте 50 финальных боссов подземелий.',
    },
    dgn_morthen_flawless: {
      name: 'Костьми не ляжем',
      desc: 'Одолейте Мортена Могильного Зова на героической сложности так, чтобы никто из группы не погиб.',
    },
    dgn_morthen_trio: {
      name: 'Трое против могилы',
      desc: 'Одолейте Мортена Могильного Зова группой не более чем из трёх игроков.',
    },
    dgn_olen_arc: {
      name: 'Увернуться от жнеца',
      desc: 'Одолейте рыцаря-командора Олена так, чтобы его «Жатвенная дуга» не задела никого, кроме его текущей цели.',
    },
    dgn_vael_thralls: {
      name: 'Рабов не держим',
      desc: 'Одолейте Ваэля Вязателя Тумана так, чтобы каждый призванный им Утопший раб был сражён до его падения.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Всё отродье до последнего',
      desc: 'Одолейте Изолею так, чтобы каждое призванное ею Лунное отродье было сражено до её падения.',
    },
    dgn_ysolei_flawless: {
      name: 'Сухие глаза',
      desc: 'Одолейте Изолею, Воплощение Утонувшей луны, на героической сложности так, чтобы никто из группы не погиб.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Лежи, где закопали',
      desc: 'Одолейте верховного некроманта Велхара так, чтобы каждый Поднятый костеход был уничтожен до его падения.',
    },
    dgn_korzul_flawless: {
      name: 'Вирмоборец',
      desc: 'Одолейте Корзула Могильного Вирма на героической сложности так, чтобы никто из группы не погиб.',
      title: 'Вирмоборец',
    },
    dgn_sanctum_speed: {
      name: 'Спринт по святилищу',
      desc: 'Одолейте Корзула Могильного Вирма в течение 15 минут после того, как ваша группа заняла Святилище Могильного Вирма.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Не преклоним колен',
      desc: 'Одолейте Нитраксиса так, чтобы «Гробокрушитель» ни разу не задел никого, кроме его текущей цели.',
    },
    dgn_nythraxis_wardens: {
      name: 'Хранители обереговых камней',
      desc: 'Одолейте Нитраксиса так, чтобы каждая «Бессмертная ярость» была прервана до того, как обрушится.',
    },
    dgn_nythraxis_deathless: {
      name: 'Бессмертнее не бывает',
      desc: 'Одолейте Нитраксиса, Бича Торнпика, на героической сложности так, чтобы ни один участник рейда не погиб.',
      title: 'Бессмертный',
    },
    cmb_thunzharr: {
      name: 'Гора пала',
      desc: 'Повергните Тунзарра, Пробуждающегося пика, у Грозового Утеса.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Крушитель пиков',
      desc: 'Повергните Тунзарра, Пробуждающегося пика, ни разу не погибнув с вашего первого удара и до его последнего вздоха.',
      title: 'Крушитель пиков',
    },
    cmb_thunzharr_ten: {
      name: 'Привычка к горам',
      desc: 'Повергните Тунзарра, Пробуждающегося пика, десять раз.',
    },
    dlv_reliquary: { name: 'Ходок в Реликварий', desc: 'Пройдите Обрушившийся Реликварий.' },
    dlv_reliquary_heroic: {
      name: 'Героизм: Обрушившийся Реликварий',
      desc: 'Пройдите Обрушившийся Реликварий на героическом уровне.',
    },
    dlv_litany: { name: 'Утишить Литанию', desc: 'Пройдите Утонувшую Литанию.' },
    dlv_litany_heroic: {
      name: 'Героизм: Утонувшая Литания',
      desc: 'Пройдите Утонувшую Литанию на героическом уровне.',
    },
    dlv_lore_journal: {
      name: 'Заметки на полях',
      desc: 'Откройте все пять записей журнала вылазок.',
    },
    dlv_companion_max: {
      name: 'Друг познаётся в глубине',
      desc: 'Поднимите спутницу вылазок до её высшего ранга.',
    },
    dlv_companions_both: {
      name: 'Оба фонаря горят',
      desc: 'Поднимите обеих спутниц вылазок, Послушницу Тессу и Эдду Тростниковую Руку, до высшего ранга.',
    },
    dlv_clears_50: { name: 'Пятьдесят саженей', desc: 'Завершите 50 вылазок.' },
    dlv_solo_heroic: {
      name: 'Третий лишний',
      desc: 'Пройдите вылазку героического уровня без других игроков: только вы и ваша спутница.',
    },
    dlv_tumbler_premium: {
      name: 'Путь отмычки пройден',
      desc: 'Вскройте запечатанный оберегами сундук реликвария на высшей ставке, без единой ошибки с единственной попытки.',
    },
    dlv_rite_flawless: {
      name: 'Слово в слово',
      desc: 'Завершите Обряд Утонувшего Реликвария, не допустив ни единой ошибки.',
    },
    dlv_varric_ringers: {
      name: 'Колокола умолкают',
      desc: 'Одолейте Дьякона Варрика, когда все поднятые им Погребальные звонари уже перебиты.',
    },
    dlv_nhalia_bells: {
      name: 'Усмиритель колоколов',
      desc: 'Одолейте Сестру Нхалию, Утонувшую Песнь, так, чтобы ни один член отряда не попал под удар Звонящего Колокола.',
      title: 'Усмиритель колоколов',
    },
    chr_vale_chapter_i: {
      name: 'Летопись Долины, глава I',
      desc: 'Завершите первую главу летописи Саула: первые поручения Истврука, просторы Долины и первая проба её ремёсел.',
    },
    chr_vale_chapter_ii: {
      name: 'Летопись Долины, глава II',
      desc: 'Завершите вторую главу летописи Саула: бандиты, илогривые скрытни и рудничные твари перебиты, на Свином поле сыграно, и совершена вылазка в Реликварий.',
    },
    chr_vale_chapter_iii: {
      name: 'Летопись Истврукской долины',
      desc: 'Доведите историю Долины до конца: Могильный Зов разоблачён, Пустая крипта очищена, и все именные ужасы Долины повержены.',
      title: 'из Долины',
    },
    chr_vale_gatherer: {
      name: 'Кормиться с земли',
      desc: 'Добудьте руду из жилы, древесину с делянки и травы с поляны в Истврукской долине.',
    },
    chr_vale_first_cast: {
      name: 'Что-то в Зеркальном озере',
      desc: 'Поймайте рыбу в водах Истврукской долины.',
    },
    chr_vale_packbreaker: { name: 'Гроза стаи', desc: 'Убейте 3 лесных волков за 10 секунд.' },
    chr_vale_cup_debut: {
      name: 'Претендент на Медное ведро',
      desc: 'Выйдите на поле и коснитесь мяча в матче Кубка Долины на Свином поле.',
    },
    chr_vale_rares: {
      name: 'Ужасы Долины',
      desc: 'Сразите пятерых именных ужасов Истврукской долины: Старого Серочелюста, Моггера, Капитана Верлана, Малдрека Пленителя призраков и Грикса, Короля туннелей.',
    },
    chr_marsh_chapter_i: {
      name: 'Летопись Топи, глава I',
      desc: 'Завершите первую главу летописи Осрика Фенна: ответьте на фенбриджский сбор, обезопасьте гать и узнайте очертания топи.',
    },
    chr_marsh_chapter_ii: {
      name: 'Летопись Топи, глава II',
      desc: 'Завершите вторую главу летописи Осрика Фенна: вдовы выкурены, утопшие упокоены, Крестная треска выужена, и совершена вылазка в Литанию.',
    },
    chr_marsh_chapter_iii: {
      name: 'Летопись Мирефенской топи',
      desc: 'Доведите историю топи до конца: лагерь культа разгромлен, Вязатель Тумана умолк в Затонувшем бастионе, и все именные ужасы туманов повержены.',
      title: 'из Мирефена',
    },
    chr_marsh_gatherer: {
      name: 'Фенбриджский промысел',
      desc: 'Добудьте руду из жилы, древесину с делянки и травы с поляны в Мирефенской топи.',
    },
    chr_marsh_unburst: {
      name: 'Не стойте в спорах',
      desc: 'Убейте 8 болотных раздутней, ни разу не попав под взрыв их Едких спор.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Тише, лекарь',
      desc: 'В лагере Могильного Зова убейте Лекаря Могильного Зова прежде, чем падёт любой из культистов, которых он врачует.',
    },
    chr_marsh_rares: {
      name: 'Имена в тумане',
      desc: 'Сразите трёх именных ужасов Мирефенской топи: Миреджо Ненасытного, Слумтуса Утопшего и Сестру Налию.',
    },
    chr_peaks_chapter_i: {
      name: 'Летопись Высот, глава I',
      desc: 'Завершите первую главу летописи Зензи: расчистите хребтовую дорогу, опустошите норы и изучите каждую тропу, которую стережёт Хайвотч.',
    },
    chr_peaks_chapter_ii: {
      name: 'Летопись Высот, глава II',
      desc: 'Завершите вторую главу летописи Зензи: разгромите военный лагерь Дрогмара, разгадайте пробуждающуюся бурю и встаньте там, где светится Глиммермир.',
    },
    chr_peaks_chapter_iii: {
      name: 'Летопись Терновых высот',
      desc: 'Доведите историю горы до конца: Культ Вирма разбит, Святилище умолкло, Пробуждающийся пик низвергнут, и все именные ужасы утёсов повержены.',
      title: 'с Торнпика',
    },
    chr_peaks_sparring: {
      name: 'Учения у стены',
      desc: 'Нанесите тренировочному манекену над Хайвотчем в общей сложности 1000 единиц урона.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Вода холодна, свет холоднее',
      desc: 'Поймайте рыбу в Глиммермире.',
    },
    chr_peaks_moongate: {
      name: 'Сквозь холодные врата',
      desc: 'Пройдите сквозь лунные врата на берегу Глиммермира.',
    },
    chr_peaks_waking_witness: {
      name: 'Гора, которая ходит',
      desc: 'Узрите Тунзарра, Пробуждающегося пика, пока он шагает по горе.',
    },
    chr_peaks_rares: {
      name: 'Имена, высеченные в скале',
      desc: 'Сразите четырёх именных ужасов Терновых высот: Прораба Железной жилы, Брутока Сокрушителя черепов, Воскара Жарокрыла и Владыку костного мозга Варкаса.',
    },
    col_discovery_25: {
      name: 'Хомяк',
      desc: 'Найдите 25 разных предметов (предмет засчитывается, когда впервые оказывается у вас).',
    },
    col_discovery_75: { name: 'Сорока', desc: 'Найдите 75 разных предметов.' },
    col_discovery_150: {
      name: 'Кунсткамера',
      desc: 'Найдите 150 разных предметов.',
      title: 'Хранитель древностей',
    },
    col_discovery_250: { name: 'Большой каталог', desc: 'Найдите 250 разных предметов.' },
    col_first_rare: { name: 'Синяя птица', desc: 'Получите свой первый предмет редкого качества.' },
    col_first_epic: {
      name: 'Рождённый в пурпуре',
      desc: 'Получите свой первый предмет эпического качества.',
    },
    col_first_legendary: {
      name: 'Оранжевое настроение',
      desc: 'Получите свой первый предмет легендарного качества.',
    },
    col_set_vale_arcanist: {
      name: 'Регалии долинного арканиста',
      desc: 'Найдите все части Регалий долинного арканиста.',
    },
    col_set_boundstone_vanguard: {
      name: 'Авангард Связанного камня',
      desc: 'Найдите все части Авангарда Связанного камня.',
    },
    col_set_greyjaw_stalker: {
      name: 'Снаряжение охотника на Серую Челюсть',
      desc: 'Найдите все части Снаряжения охотника на Серую Челюсть.',
    },
    col_set_deathlord: {
      name: 'Боевое снаряжение Владыки Кургана',
      desc: 'Найдите все части Боевого снаряжения Владыки Кургана.',
    },
    col_set_wyrmshadow: {
      name: 'Облачение Ночного Клыка',
      desc: 'Найдите все части Облачения Ночного Клыка.',
    },
    col_set_necromancers: {
      name: 'Одеяние Скорбного плетения',
      desc: 'Найдите все части Одеяния Скорбного плетения.',
    },
    col_set_crownforged: {
      name: 'Костокованые регалии',
      desc: 'Найдите все части Костокованых регалий.',
    },
    col_set_nighttalon: {
      name: 'Шкура Лютого Клыка',
      desc: 'Найдите все части Шкуры Лютого Клыка.',
    },
    col_set_soulflame: {
      name: 'Регалии Призрачного пламени',
      desc: 'Найдите все части Регалий Призрачного пламени.',
    },
    col_set_stormcallers: {
      name: 'Облачение Зова Бури',
      desc: 'Найдите все части Облачения Зова Бури.',
    },
    col_seven_regalia: {
      name: 'Семикратный гардероб',
      desc: 'Найдите все части всех семи эпических комплектов брони.',
      title: 'Блистательный',
    },
    col_true_colors: {
      name: 'Истинное обличье',
      desc: 'Выйдите в мир в любом облике, отличном от исходного для вашего класса.',
    },
    col_all_slots: {
      name: 'На все одиннадцать',
      desc: 'Наденьте предметы сразу во все одиннадцать ячеек экипировки.',
    },
    col_quartermaster_buyout: {
      name: 'Почётный покупатель',
      desc: 'Найдите все десять предметов из запасов Интенданта Векса.',
    },
    col_glimmerfin: {
      name: 'Проблеск надежды',
      desc: 'Поймайте карпа кои с мерцающими плавниками.',
    },
    col_full_creel: {
      name: 'Полный садок',
      desc: 'Найдите все шесть обычных уловов из вод Долины, Топи и Высот.',
    },
    col_junk_drawer: {
      name: 'Ящик с хламом',
      desc: 'Найдите 10 разных предметов низкого качества.',
    },
    pvp_arena_first_match: {
      name: 'Песок в сапогах',
      desc: 'Сразитесь в рейтинговом матче в Пепельном Колизее, в любом из двух форматов.',
    },
    pvp_arena_first_win: {
      name: 'Рёв трибун',
      desc: 'Одержите победу в рейтинговом матче арены в любом из двух форматов.',
    },
    pvp_arena_1v1_1600: {
      name: 'Претендент Колизея',
      desc: 'Наберите 1600 рейтинга в формате арены 1 на 1.',
    },
    pvp_arena_1v1_1750: {
      name: 'Соперник Колизея',
      desc: 'Наберите 1750 рейтинга в формате арены 1 на 1.',
    },
    pvp_arena_1v1_1900: {
      name: 'Гладиатор',
      desc: 'Наберите 1900 рейтинга в формате арены 1 на 1.',
      title: 'Гладиатор',
    },
    pvp_arena_2v2_1600: {
      name: 'Сила двоих',
      desc: 'Наберите 1600 рейтинга в формате арены 2 на 2.',
    },
    pvp_arena_2v2_1750: {
      name: 'Грозная двойка',
      desc: 'Наберите 1750 рейтинга в формате арены 2 на 2.',
    },
    pvp_arena_2v2_1900: {
      name: 'Безупречный тандем',
      desc: 'Наберите 1900 рейтинга в формате арены 2 на 2.',
    },
    pvp_duel_first_win: { name: 'Выйдем, поговорим', desc: 'Одержите победу в дуэли.' },
    pvp_duel_grace: {
      name: 'Урок смирения',
      desc: 'Проиграйте дуэль, почти не уронив достоинства.',
    },
    pvp_vcup_first_match: {
      name: 'Выход на поле',
      desc: 'Отыграйте полный матч Кубка Долины на Свином поле, победный или нет.',
    },
    pvp_vcup_first_win: { name: 'Первый трофей', desc: 'Выиграйте рейтинговый матч Кубка Долины.' },
    pvp_vcup_wins_10: {
      name: 'Бывалый кабанболист',
      desc: 'Выиграйте 10 рейтинговых матчей Кубка Долины.',
    },
    pvp_vcup_wins_25: {
      name: 'Легенда кабанбола',
      desc: 'Выиграйте 25 рейтинговых матчей Кубка Долины.',
      title: 'Легенда кабанбола',
    },
    pvp_vcup_first_goal: {
      name: 'Счёт открыт',
      desc: 'Забейте гол в рейтинговом матче Кубка Долины.',
    },
    pvp_vcup_hat_trick: {
      name: 'Герой хет-трика',
      desc: 'Забейте три гола за один рейтинговый матч Кубка Долины в формате 3 на 3 или крупнее.',
    },
    pvp_vcup_golden_goal: {
      name: 'Золотой миг',
      desc: 'Забейте золотой гол, решающий исход рейтингового матча Кубка Долины.',
    },
    pvp_vcup_first_save: {
      name: 'Надёжные руки',
      desc: 'Отразите удар в роли вратаря в рейтинговом матче Кубка Долины.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Мимо меня не пройдёт',
      desc: 'Выиграйте рейтинговый матч Кубка Долины в роли вратаря, не пропустив ни одного гола.',
    },
    pvp_vcup_guild_win: {
      name: 'За знамя!',
      desc: 'Выиграйте рейтинговый матч Кубка Долины, сыгранный под знаменем вашей гильдии.',
    },
    pvp_fiesta_first_bout: {
      name: 'Незваный гость',
      desc: 'Отыграйте полный бой Фиесты 2 на 2, победный или нет.',
    },
    pvp_fiesta_first_win: { name: 'Душа Фиесты', desc: 'Победите в бою Фиесты 2 на 2.' },
    pvp_fiesta_double: {
      name: 'Двойной удар',
      desc: 'Уложите двух противников в Фиесте в пределах четырёх секунд.',
    },
    pvp_fiesta_shutdown: {
      name: 'Гроза праздника',
      desc: 'Уложите в Фиесте противника с серией из трёх и более побед.',
    },
    pvp_fiesta_full_build: {
      name: 'Одет по случаю',
      desc: 'Победите в бою Фиесты с закреплённым усилением из каждой из трёх волн.',
    },
    pvp_fiesta_powerups: {
      name: 'Всего по одному',
      desc: 'Подберите каждое из четырёх усилений ринга хотя бы по разу: Демон скорости, Колосс, Лунные сапоги и Берсерк.',
    },
    pvp_fiesta_five_kills: {
      name: 'Вся вечеринка на мне',
      desc: 'Уложите пятерых противников за один бой Фиесты.',
    },
    soc_first_party: { name: 'Вместе веселее', desc: 'Вступите в группу с другим игроком.' },
    soc_full_house: { name: 'Аншлаг', desc: 'Пройдите подземелье полной группой из пяти человек.' },
    soc_guild_joined: { name: 'Под одним знаменем', desc: 'Станьте членом гильдии.' },
    soc_guild_founded: { name: 'Перо основателя', desc: 'Создайте собственную гильдию.' },
    soc_first_trade: { name: 'Честный обмен', desc: 'Завершите обмен с другим игроком.' },
    soc_first_sale: {
      name: 'Лавка открыта',
      desc: 'Заберите монеты со своей первой продажи на Мировом рынке.',
    },
    soc_steady_custom: {
      name: 'Постоянная клиентура',
      desc: 'Соберите в общей сложности 10 золотых с ваших продаж на Мировом рынке.',
    },
    soc_market_magnate: {
      name: 'Рыночный магнат',
      desc: 'Соберите в общей сложности 100 золотых с ваших продаж на Мировом рынке.',
      title: 'Магнат',
    },
    soc_by_ravens_wing: {
      name: 'На крыле ворона',
      desc: 'Отправьте Вороньей почтой письмо с монетами или посылкой.',
    },
    soc_room_for_more: { name: 'Место ещё найдётся', desc: 'Купите своё первое расширение банка.' },
    soc_gilded_strongbox: {
      name: 'Золочёный сундук',
      desc: 'Выкупите все расширения банка, какие только предложат казначеи.',
    },
    soc_meet_bursar: {
      name: 'На Фернандо уповаем',
      desc: 'Засвидетельствуйте почтение казначею Фернандо, хранителю Золочёного сундука в Иствруке.',
    },
    soc_pocket_money: {
      name: 'Карманные деньги',
      desc: 'Добудьте в общей сложности 1 золотой звонкой монетой.',
    },
    soc_heavy_purse: {
      name: 'Тяжёлый кошель',
      desc: 'Добудьте в общей сложности 10 золотых звонкой монетой.',
    },
    soc_wyrms_hoard: {
      name: 'Сокровищница вирма',
      desc: 'Добудьте в общей сложности 100 золотых звонкой монетой.',
    },
    soc_civic_duty: {
      name: 'Гражданский долг',
      desc: 'Вложите своё первое очко городского развития.',
    },
    exp_long_road_north: {
      name: 'Долгая дорога на север',
      desc: 'Посетите все три узловых поселения: Истврук, Фенбридж и Хайвотч.',
    },
    exp_vale_wayfarer: {
      name: 'Странник Долины',
      desc: 'Посетите все одиннадцать именованных мест Истврукской долины.',
    },
    exp_marsh_wayfarer: {
      name: 'Странник Топи',
      desc: 'Посетите все восемь именованных мест Мирефенской топи.',
    },
    exp_peaks_wayfarer: {
      name: 'Странник Высот',
      desc: 'Посетите все десять именованных мест Терновых высот.',
    },
    exp_world_traveler: {
      name: 'Повидавший мир',
      desc: 'Заслужите деяние странника каждой из трёх зон.',
      title: 'Странник',
    },
    exp_something_shiny: {
      name: 'Что-то блестящее',
      desc: 'Подберите с земли сверкающий предмет.',
    },
    exp_first_ore: { name: 'Вгрызайся в землю', desc: 'Разработайте свою первую рудную жилу.' },
    exp_first_timber: { name: 'Поберегись!', desc: 'Соберите древесину со своей первой делянки.' },
    exp_first_herb: { name: 'Лёгкая рука', desc: 'Соберите травы со своих первых зарослей.' },
    feat_era_cap: {
      name: 'Дитя Первой эры',
      desc: 'Вы достигли 20-го уровня, пока Первая эра ещё длилась.',
    },
    feat_book_complete: {
      name: 'От корки до корки',
      desc: 'Получите каждое деяние в Книге деяний.',
    },
    feat_brightwood_relic: {
      name: 'Память о Брайтвуде',
      desc: 'Сохраните реликвию старого Брайтвуда: Колет из терновой шкуры или Корону Монарха.',
    },
    hid_saul_footnote: {
      name: 'Сноска в истории',
      desc: 'Вы донимали летописца Саула девять раз без передышки.',
      title: 'Сноска',
    },
    hid_gilded_tour: {
      name: 'Золочёное турне',
      desc: 'Вы вели дела со всеми тремя отделениями Золочёного сундука.',
    },
    hid_fall_death: {
      name: 'Гравитация всегда побеждает',
      desc: 'Вы погибли от долгого разговора с землёй.',
    },
    hid_keepers_toll_twice: {
      name: 'Хранитель взимает дважды',
      desc: 'Вы погибли, пока на вас ещё лежала Дань Хранителя.',
    },
    hid_roll_hundred: {
      name: 'Чистая сотня',
      desc: 'Вы выбросили ровно 100 обычной командой /roll.',
    },
    hid_yumi_cheer: {
      name: 'Главный поклонник Юми',
      desc: 'Вы подбодрили Юми посреди боя там, где она могла вас услышать.',
    },
    hid_bountiful_coffer: {
      name: 'Пурпурный ларец',
      desc: 'Вы вскрыли Щедрый ларец, прежде чем его заклинило.',
    },
    hid_companion_save: {
      name: 'Не в её смену',
      desc: 'Ваша спутница по вылазке подняла павшего соратника на ноги.',
    },
    hid_codfather: {
      name: 'Теперь ты в семье',
      desc: 'Вы вытащили Крестную треску из Отмелей Глубокой Топи.',
    },
    prog_crown_below: {
      name: 'Корона под землёй',
      desc: 'Проследуйте за короной от беспокойных костяных полей до гробницы короля Нитраксиса и доведите задание «Конец Бича» до конца.',
    },
    prog_mere_at_rest: {
      name: 'Омут обретает покой',
      desc: 'Доведите дозор Ондрела Вейна до конца: хор умолк, Бледное Кольцо сражено, а Утонувшая луна упокоена.',
    },
    prog_callused_hands: {
      name: 'Мозолистые руки',
      desc: 'Завершите задание «Ремесло для каждой руки» и натрите первую мозоль в ремёслах Истврука.',
    },
    prog_tools_of_the_trade: {
      name: 'Орудия ремесла',
      desc: 'Завершите изделие, требующее станка, в ремесленном центре Хайвотча.',
    },
    dgn_nythraxis_crypt: {
      name: 'Что хранил склеп',
      desc: 'Отважьтесь войти в Заброшенный склеп и добудьте у его стражей обе половины ключ-камня и древний дневник.',
    },
    chr_marsh_first_cast: {
      name: 'Угри в камышах',
      desc: 'Поймайте рыбу в водах Мирефенской топи.',
    },
  },
  sv_SE: {
    prog_first_steps: {
      name: 'Första stegen',
      desc: 'Nå nivå 2 och ta ditt första steg på en lång väg.',
    },
    prog_finding_your_feet: {
      name: 'Varm i kläderna',
      desc: 'Nå nivå 5; vildmarken ser redan lite mindre ut.',
    },
    prog_double_digits: { name: 'Tvåsiffrigt', desc: 'Nå nivå 10 och lås upp dina talanger.' },
    prog_the_long_middle: { name: 'Den långa mitten', desc: 'Nå nivå 15.' },
    prog_level_cap: { name: 'Utsikten från toppen', desc: 'Nå nivå 20, den högsta nivån.' },
    prog_well_rested: {
      name: 'Utvilad',
      desc: 'Slå dig till ro på ett värdshus tills du har tjänat in utvilad erfarenhet.',
    },
    prog_talented: { name: 'En väl spenderad poäng', desc: 'Spendera din första talangpoäng.' },
    prog_specialized: {
      name: 'Avsiktsförklaring',
      desc: 'Välj en specialisering och lär dig dess signaturförmåga.',
    },
    prog_deep_roots: {
      name: 'Djupa rötter',
      desc: 'Lägg en talangpoäng i en talang på den nedersta raden.',
    },
    prog_full_build: {
      name: 'Hela elvan',
      desc: 'Lägg alla elva talangpoäng på ett och samma bygge.',
    },
    prog_veteran: {
      name: 'Veteran',
      desc: 'Tjäna sammanlagt 250 000 erfarenhet.',
      title: 'Veteran',
    },
    prog_champion: {
      name: 'Mästare',
      desc: 'Tjäna sammanlagt 500 000 erfarenhet.',
      title: 'Mästare',
    },
    prog_paragon: {
      name: 'Förebild',
      desc: 'Tjäna sammanlagt 1 000 000 erfarenhet.',
      title: 'Förebild',
    },
    prog_mythic: {
      name: 'Mytisk',
      desc: 'Tjäna sammanlagt 2 500 000 erfarenhet.',
      title: 'Mytisk',
    },
    prog_eternal: { name: 'Evig', desc: 'Tjäna sammanlagt 5 000 000 erfarenhet.', title: 'Evig' },
    prog_prestige: {
      name: 'Börja om',
      desc: 'Nå den högsta nivån, fyll mätaren en gång till och gör anspråk på prestigerang 1.',
    },
    prog_prestige_5: { name: 'Gamla vanor', desc: 'Nå prestigerang 5.' },
    prog_prestige_10: { name: 'Evighetsmaskinen', desc: 'Nå prestigerang 10.' },
    prog_first_harvest: { name: 'Markens frukter', desc: 'Skörda din första fyndighet.' },
    prog_mining_100: { name: 'Malm i blodet', desc: 'Nå 100 i färdigheten Gruvdrift.' },
    prog_logging_100: { name: 'Kärnvedshuggare', desc: 'Nå 100 i färdigheten Timmerhuggning.' },
    prog_herbalism_100: { name: 'Ängens mästare', desc: 'Nå 100 i färdigheten Örtkunskap.' },
    prog_master_gatherer: {
      name: 'Mästersamlare',
      desc: 'Nå 100 i färdigheterna Gruvdrift, Timmerhuggning och Örtkunskap.',
    },
    prog_first_craft: { name: 'Handgjort', desc: 'Slutför ditt första lyckade hantverk.' },
    prog_craft_specialist: {
      name: 'Yrkeshemligheter',
      desc: 'Nå 75 i skicklighet i ett valfritt hantverk och lås upp dess specialiseringsförmåner.',
    },
    prog_around_the_ring: {
      name: 'Runt ringen',
      desc: 'Nå 25 i skicklighet i fem olika hantverk.',
    },
    cmb_first_blood: { name: 'Första blodet', desc: 'Besegra din första fiende.' },
    cmb_slayer: { name: 'Dräpare', desc: 'Besegra 1 000 fiender.' },
    cmb_legion_of_one: { name: 'En mans legion', desc: 'Besegra 10 000 fiender.' },
    cmb_heavy_hitter: { name: 'Tungviktare', desc: 'Utdela sammanlagt 500 000 skada.' },
    cmb_critical_eye: { name: 'Kritiskt öga', desc: 'Utdela 500 kritiska träffar.' },
    cmb_giantslayer: {
      name: 'Jättedräpare',
      desc: 'Utdela dödsstöten mot en fiende som är minst fem nivåer över dig.',
    },
    cmb_first_fall: {
      name: 'Borsta av dig',
      desc: 'Dö för första gången; det händer de bästa av oss.',
    },
    dgn_hollow_crypt: {
      name: 'Kryptbrytaren',
      desc: 'Besegra Morthen Gravkallaren i Den ihåliga kryptan.',
    },
    dgn_sunken_bastion: {
      name: 'Dimman lättar',
      desc: 'Besegra Vael Fogbindern i Den sjunkna bastionen.',
    },
    dgn_drowned_temple: {
      name: 'Att dränka månen',
      desc: 'Besegra Ysolei, den dränkta månens avatar, i Det dränkta templet.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Lindormen i djupet',
      desc: 'Besegra Korzul Gravlindormen i Gravlindormens helgedom.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Heroisk: Den ihåliga kryptan',
      desc: 'Besegra Morthen Gravkallaren i Den ihåliga kryptan på heroisk svårighetsgrad.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Heroisk: Den sjunkna bastionen',
      desc: 'Besegra Vael Fogbindern i Den sjunkna bastionen på heroisk svårighetsgrad.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Heroisk: Det dränkta templet',
      desc: 'Besegra Ysolei, den dränkta månens avatar, i Det dränkta templet på heroisk svårighetsgrad.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Heroisk: Gravlindormens helgedom',
      desc: 'Besegra Korzul Gravlindormen i Gravlindormens helgedom på heroisk svårighetsgrad.',
    },
    dgn_nythraxis: {
      name: 'Ett gissel mindre',
      desc: 'Besegra Nythraxis, Törntoppens gissel, bortom den förseglade kungliga dörren.',
    },
    dgn_nythraxis_heroic: {
      name: 'Heroisk: Ett gissel mindre',
      desc: 'Besegra Nythraxis, Törntoppens gissel, på heroisk svårighetsgrad.',
    },
    dgn_thornpeak_rounds: {
      name: 'På rond',
      desc: 'Rensa Den ihåliga kryptan, Den sjunkna bastionen, Det dränkta templet och Gravlindormens helgedom.',
    },
    dgn_deepward: {
      name: 'Djupvärn',
      desc: 'Erövra varje fängelsehål, raiden och båda delverna på heroisk svårighetsgrad.',
    },
    dgn_mark_circuit: {
      name: 'Hela varvet',
      desc: 'Förtjäna heroiska märken från alla fyra heroiska fängelsehål på en och samma dag.',
    },
    dgn_boss_clears_50: {
      name: 'Femtio dörrar djupare',
      desc: 'Besegra 50 slutbossar i fängelsehål.',
    },
    dgn_morthen_flawless: {
      name: 'Benfritt',
      desc: 'Besegra Morthen Gravkallaren på heroisk svårighetsgrad utan att någon gruppmedlem dör.',
    },
    dgn_morthen_trio: {
      name: 'Tre mot graven',
      desc: 'Besegra Morthen Gravkallaren med tre eller färre spelare.',
    },
    dgn_olen_arc: {
      name: 'Kliv undan lien',
      desc: 'Besegra Riddarkommendör Olen utan att hans Skördebåge träffar någon annan än hans nuvarande mål.',
    },
    dgn_vael_thralls: {
      name: 'Träldomens slut',
      desc: 'Besegra Vael Fogbindern med varje Drunknad träl han kallar på redan dräpt.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Vartenda månyngel',
      desc: 'Besegra Ysolei med varje Månyngel hon kallar på redan dräpt.',
    },
    dgn_ysolei_flawless: {
      name: 'Torra ögon',
      desc: 'Besegra Ysolei, den dränkta månens avatar, på heroisk svårighetsgrad utan att någon gruppmedlem dör.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Ligg kvar i graven',
      desc: 'Besegra Stornekromantiker Velkhar med varje Uppstånden benvandrare förstörd innan han själv faller.',
    },
    dgn_korzul_flawless: {
      name: 'Lindormsfällaren',
      desc: 'Besegra Korzul Gravlindormen på heroisk svårighetsgrad utan att någon gruppmedlem dör.',
      title: 'Lindormsfällaren',
    },
    dgn_sanctum_speed: {
      name: 'Helgedomssprinten',
      desc: 'Besegra Korzul Gravlindormen inom 15 minuter efter att din grupp gjort anspråk på Gravlindormens helgedom.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Böj knä för ingen',
      desc: 'Besegra Nythraxis utan att Gravbrytaren någonsin träffar någon annan än hans nuvarande mål.',
    },
    dgn_nythraxis_wardens: {
      name: 'Skyddsstenarnas väktare',
      desc: 'Besegra Nythraxis med varje Odödligt raseri brutet innan det hinner slå.',
    },
    dgn_nythraxis_deathless: {
      name: 'Ingen mer odödlig',
      desc: 'Besegra Nythraxis, Törntoppens gissel, på heroisk svårighetsgrad utan att en enda raidmedlem dör.',
      title: 'den Odödliga',
    },
    cmb_thunzharr: {
      name: 'Berget föll',
      desc: 'Fäll Thunzharr, den vaknande toppen, vid Stormklinten.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Toppbrytaren',
      desc: 'Fäll Thunzharr, den vaknande toppen, utan att dö från ditt första slag till hans sista andetag.',
      title: 'Toppbrytaren',
    },
    cmb_thunzharr_ten: {
      name: 'Bergsvana',
      desc: 'Fäll Thunzharr, den vaknande toppen, tio gånger.',
    },
    dlv_reliquary: { name: 'Relikvarielöpare', desc: 'Rensa Det rasade relikvariet.' },
    dlv_reliquary_heroic: {
      name: 'Heroisk: Det rasade relikvariet',
      desc: 'Rensa Det rasade relikvariet på heroisk nivå.',
    },
    dlv_litany: { name: 'Tysta litanian', desc: 'Rensa Den dränkta litanian.' },
    dlv_litany_heroic: {
      name: 'Heroisk: Den dränkta litanian',
      desc: 'Rensa Den dränkta litanian på heroisk nivå.',
    },
    dlv_lore_journal: {
      name: 'Marginalanteckningar',
      desc: 'Lås upp alla fem anteckningar i delve-dagboken.',
    },
    dlv_companion_max: {
      name: 'En vän i djupet',
      desc: 'För en delve-följeslagare till hennes högsta rang.',
    },
    dlv_companions_both: {
      name: 'Båda lyktorna tända',
      desc: 'För båda delve-följeslagarna, Akolyten Tessa och Edda Reedhand, till deras högsta rang.',
    },
    dlv_clears_50: { name: 'Femtio famnar', desc: 'Fullborda 50 delve-vändor.' },
    dlv_solo_heroic: {
      name: 'Två är en för mycket',
      desc: 'Rensa en delve på heroisk nivå utan någon annan spelare, bara du och din följeslagare.',
    },
    dlv_tumbler_premium: {
      name: 'Tillhållarens väg, bemästrad',
      desc: 'Öppna en skyddad relikvariekista vid högsta insats, felfritt på ditt enda försök.',
    },
    dlv_rite_flawless: {
      name: 'Ordagrant',
      desc: 'Fullborda den dränkta relikvarieriten utan ett enda misstag.',
    },
    dlv_varric_ringers: {
      name: 'Klockorna tystnar',
      desc: 'Besegra Diakon Varric när varje begravningsringare han väcker redan är dräpt.',
    },
    dlv_nhalia_bells: {
      name: 'Klockstillare',
      desc: 'Besegra Syster Nhalia, den dränkta lovsången, utan att någon gruppmedlem träffas av en klämtande klocka.',
      title: 'Klockstillare',
    },
    chr_vale_chapter_i: {
      name: 'Dalskrönikan, kapitel I',
      desc: 'Avsluta det första kapitlet i Sauls krönika: Östbäcks första ärenden, kunskap om hur dalen ligger och en första smak av dess näringar.',
    },
    chr_vale_chapter_ii: {
      name: 'Dalskrönikan, kapitel II',
      desc: 'Avsluta det andra kapitlet i Sauls krönika: banditer, murlocker och gruvans ohyra nedgjorda, Suggfältet spelat och relikvariet trotsat.',
    },
    chr_vale_chapter_iii: {
      name: 'Dalens krönika',
      desc: 'Följ dalens hela berättelse till slutet: Gravkallaren avslöjad, Den ihåliga kryptan rensad och dalens alla namnkunniga fasor nedlagda.',
      title: 'av Dalen',
    },
    chr_vale_gatherer: {
      name: 'Vad marken ger',
      desc: 'Skörda en malmåder, en virkesdunge och en örttäppa i Östbäcksdalen.',
    },
    chr_vale_first_cast: {
      name: 'Något i Spegelsjön',
      desc: 'Fånga en fisk ur Östbäcksdalens vatten.',
    },
    chr_vale_packbreaker: { name: 'Flockbrytare', desc: 'Dräp 3 skogsvargar inom 10 sekunder.' },
    chr_vale_cup_debut: {
      name: 'Kopparspannens utmanare',
      desc: 'Gå ut på planen och rör bollen i en Dalcupsmatch på Suggfältet.',
    },
    chr_vale_rares: {
      name: 'Dalens fasor',
      desc: 'Dräp Östbäcksdalens fem namnkunniga fasor: Gamle Gråkäft, Mogger, Grix Tunnelkungen, Kapten Verlan och Vålnadsbindare Maldrec.',
    },
    chr_marsh_chapter_i: {
      name: 'Träskkrönikan, kapitel I',
      desc: 'Avsluta det första kapitlet i Osric Fenns krönika: hörsamma Kärrbros mönstring, säkra vägbanken och lär känna kärrets skepnad.',
    },
    chr_marsh_chapter_ii: {
      name: 'Träskkrönikan, kapitel II',
      desc: 'Avsluta det andra kapitlet i Osric Fenns krönika: änkorna utrökta, de drunknade lagda till ro, Torskfadern landad och litanian trotsad.',
    },
    chr_marsh_chapter_iii: {
      name: 'Dykärrets krönika',
      desc: 'Följ kärrets hela berättelse till slutet: kultlägret krossat, Fogbindern tystad i Den sjunkna bastionen och dimmans alla namnkunniga fasor nedlagda.',
      title: 'av Dykärret',
    },
    chr_marsh_gatherer: {
      name: 'Skörd vid Kärrbron',
      desc: 'Skörda en malmåder, en virkesdunge och en örttäppa i Dykärrsträsket.',
    },
    chr_marsh_unburst: {
      name: 'Stå inte i sporerna',
      desc: 'Dräp 8 kärrpösare utan att bli fångad i utbrottet från deras Frätande sporer.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Tysta helandet',
      desc: 'Dräp en gravkallarhelare i Gravkallarlägret innan någon av kultisterna den vårdar faller.',
    },
    chr_marsh_rares: {
      name: 'Namn i dimman',
      desc: 'Dräp Dykärrsträskets tre namnkunniga fasor: Kärrkäft den glupske, Sloomtooth den drunknade och Syster Nhalia.',
    },
    chr_peaks_chapter_i: {
      name: 'Höjdkrönikan, kapitel I',
      desc: 'Avsluta det första kapitlet i Zenzies krönika: rensa åsvägen, töm gryten och lär dig varje stig som Högvakten vaktar.',
    },
    chr_peaks_chapter_ii: {
      name: 'Höjdkrönikan, kapitel II',
      desc: 'Avsluta det andra kapitlet i Zenzies krönika: krossa Drogmars krigsläger, tyd den vaknande stormen och stå där Skimmertjärnen glöder.',
    },
    chr_peaks_chapter_iii: {
      name: 'Törntoppens krönika',
      desc: 'Följ bergets hela berättelse till slutet: Lindormskulten krossad, helgedomen tystad, den vaknande toppen fälld och klippornas alla namnkunniga fasor nedlagda.',
      title: 'av Törntoppen',
    },
    chr_peaks_sparring: {
      name: 'Murövningar',
      desc: 'Tillfoga träningsdockan ovanför Högvakten sammanlagt 1 000 skada.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Kallt vatten, kallare ljus',
      desc: 'Fånga en fisk ur Skimmertjärnen.',
    },
    chr_peaks_moongate: {
      name: 'Genom den kalla porten',
      desc: 'Kliv genom månporten vid Skimmertjärnens strand.',
    },
    chr_peaks_waking_witness: {
      name: 'Berget som vandrar',
      desc: 'Få syn på Thunzharr, den vaknande toppen, medan han skrider fram över berget.',
    },
    chr_peaks_rares: {
      name: 'Namn ristade i klippan',
      desc: 'Dräp Törntoppshöjdernas fyra namnkunniga fasor: Järnådersförmannen, Brutok Skallkrossare, Voskar Glödvingen och Märgherre Varkas.',
    },
    col_discovery_25: {
      name: 'Hamstrare',
      desc: 'Upptäck 25 olika föremål (ett föremål räknas första gången det någonsin hamnar i din ägo).',
    },
    col_discovery_75: { name: 'Skata', desc: 'Upptäck 75 olika föremål.' },
    col_discovery_150: {
      name: 'Kuriosakabinett',
      desc: 'Upptäck 150 olika föremål.',
      title: 'Intendenten',
    },
    col_discovery_250: { name: 'Den stora katalogen', desc: 'Upptäck 250 olika föremål.' },
    col_first_rare: {
      name: 'Något blått',
      desc: 'Skaffa ditt första föremål av sällsynt kvalitet.',
    },
    col_first_epic: {
      name: 'Född i purpurn',
      desc: 'Skaffa ditt första föremål av episk kvalitet.',
    },
    col_first_legendary: {
      name: 'Tur att den är orange',
      desc: 'Skaffa ditt första föremål av legendarisk kvalitet.',
    },
    col_set_vale_arcanist: {
      name: 'Dalarkanistens regalier',
      desc: 'Upptäck varje del av Dalarkanistens regalier.',
    },
    col_set_boundstone_vanguard: {
      name: 'Bundstensförtruppen',
      desc: 'Upptäck varje del av Bundstensförtruppen.',
    },
    col_set_greyjaw_stalker: {
      name: 'Gråkäftssmygarens utrustning',
      desc: 'Upptäck varje del av Gråkäftssmygarens utrustning.',
    },
    col_set_deathlord: {
      name: 'Barrowlords stridsutrustning',
      desc: 'Upptäck varje del av Barrowlords stridsutrustning.',
    },
    col_set_wyrmshadow: {
      name: 'Nightfang-skrud',
      desc: 'Upptäck varje del av Nightfang-skruden.',
    },
    col_set_necromancers: {
      name: 'Mournweave-klädnad',
      desc: 'Upptäck varje del av Mournweave-klädnaden.',
    },
    col_set_crownforged: {
      name: 'Bonewrought-regalier',
      desc: 'Upptäck varje del av Bonewrought-regalierna.',
    },
    col_set_nighttalon: { name: 'Direfang-päls', desc: 'Upptäck varje del av Direfang-pälsen.' },
    col_set_soulflame: {
      name: 'Wraithfire-regalier',
      desc: 'Upptäck varje del av Wraithfire-regalierna.',
    },
    col_set_stormcallers: {
      name: 'Galecall-skrud',
      desc: 'Upptäck varje del av Galecall-skruden.',
    },
    col_seven_regalia: {
      name: 'Den sjufaldiga garderoben',
      desc: 'Upptäck varje del av alla sju episka rustningsfamiljer.',
      title: 'den praktfulla',
    },
    col_true_colors: {
      name: 'Rätta färger',
      desc: 'Gå i fält iklädd ett annat utseende än din klass förvalda.',
    },
    col_all_slots: {
      name: 'Uppklädd till elvorna',
      desc: 'Ha ett föremål utrustat i alla elva utrustningsplatser samtidigt.',
    },
    col_quartermaster_buyout: {
      name: 'Stamkund',
      desc: 'Upptäck alla tio delar av den heroiska kvartersmästarens utbud.',
    },
    col_glimmerfin: { name: 'Ett skimmer av hopp', desc: 'Fånga en skimmerfenad koi.' },
    col_full_creel: {
      name: 'Full fiskekorg',
      desc: 'Upptäck alla sex vanliga fångster ur dalens, träskets och höjdernas vatten.',
    },
    col_junk_drawer: { name: 'Skräplådan', desc: 'Upptäck 10 olika föremål av usel kvalitet.' },
    pvp_arena_first_match: {
      name: 'Sand i stövlarna',
      desc: 'Utkämpa en rankad match i Askans colosseum, i valfri division.',
    },
    pvp_arena_first_win: {
      name: 'Publiken jublar',
      desc: 'Vinn en rankad arenamatch i valfri division.',
    },
    pvp_arena_1v1_1600: {
      name: 'Colosseets utmanare',
      desc: 'Nå 1600 i rating i arenans 1 mot 1-division.',
    },
    pvp_arena_1v1_1750: {
      name: 'Colosseets rival',
      desc: 'Nå 1750 i rating i arenans 1 mot 1-division.',
    },
    pvp_arena_1v1_1900: {
      name: 'Gladiator',
      desc: 'Nå 1900 i rating i arenans 1 mot 1-division.',
      title: 'Gladiator',
    },
    pvp_arena_2v2_1600: {
      name: 'Två man starka',
      desc: 'Nå 1600 i rating i arenans 2 mot 2-division.',
    },
    pvp_arena_2v2_1750: {
      name: 'Fruktad duo',
      desc: 'Nå 1750 i rating i arenans 2 mot 2-division.',
    },
    pvp_arena_2v2_1900: {
      name: 'Perfekta parhästar',
      desc: 'Nå 1900 i rating i arenans 2 mot 2-division.',
    },
    pvp_duel_first_win: { name: 'Ta det utanför', desc: 'Vinn en duell.' },
    pvp_duel_grace: {
      name: 'En läxa i ödmjukhet',
      desc: 'Förlora en duell med värdigheten någorlunda i behåll.',
    },
    pvp_vcup_first_match: {
      name: 'Stövlar på planen',
      desc: 'Spela färdigt en hel Dalcupsmatch på Suggfältet, oavsett vinst eller förlust.',
    },
    pvp_vcup_first_win: { name: 'Första bucklan', desc: 'Vinn en rankad Dalcupsmatch.' },
    pvp_vcup_wins_10: {
      name: 'Rutinerad vildsvinsbollare',
      desc: 'Vinn 10 rankade Dalcupsmatcher.',
    },
    pvp_vcup_wins_25: {
      name: 'Vildsvinsbollslegend',
      desc: 'Vinn 25 rankade Dalcupsmatcher.',
      title: 'Vildsvinsbollslegend',
    },
    pvp_vcup_first_goal: {
      name: 'Målkontot öppnat',
      desc: 'Gör ett mål i en rankad Dalcupsmatch.',
    },
    pvp_vcup_hat_trick: {
      name: 'Hattrickhjälte',
      desc: 'Gör tre mål i en och samma rankade Dalcupsmatch, i 3 mot 3-divisionen eller större.',
    },
    pvp_vcup_golden_goal: {
      name: 'Gyllene ögonblick',
      desc: 'Gör det gyllene mål som avgör en rankad Dalcupsmatch.',
    },
    pvp_vcup_first_save: {
      name: 'Säkra händer',
      desc: 'Gör en räddning som målvakt i en rankad Dalcupsmatch.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Här kommer inget förbi',
      desc: 'Vinn en rankad Dalcupsmatch som målvakt utan att släppa in ett mål.',
    },
    pvp_vcup_guild_win: {
      name: 'För baneret',
      desc: 'Vinn en rankad Dalcupsmatch spelad under ditt gilles baner.',
    },
    pvp_fiesta_first_bout: {
      name: 'Objuden gäst',
      desc: 'Utkämpa en hel 2 mot 2-drabbning i Fiestan, oavsett vinst eller förlust.',
    },
    pvp_fiesta_first_win: {
      name: 'Festens medelpunkt',
      desc: 'Vinn en 2 mot 2-drabbning i Fiestan.',
    },
    pvp_fiesta_double: {
      name: 'Två flugor i en smäll',
      desc: 'Fäll två motståndare i Fiestan inom fyra sekunder.',
    },
    pvp_fiesta_shutdown: {
      name: 'Glädjedödare',
      desc: 'Fäll en Fiestamotståndare som är inne på en svit om tre eller fler.',
    },
    pvp_fiesta_full_build: {
      name: 'Klädd för tillfället',
      desc: 'Vinn en Fiestadrabbning med en förstärkning låst från var och en av de tre vågorna.',
    },
    pvp_fiesta_powerups: {
      name: 'En av varje',
      desc: 'Plocka upp var och en av ringens fyra kraftbonusar minst en gång: Fartdemon, Koloss, Månkängor och Bärsärk.',
    },
    pvp_fiesta_five_kills: {
      name: 'Bär hela festen',
      desc: 'Fäll fem motståndare i en och samma Fiestadrabbning.',
    },
    soc_first_party: {
      name: 'Bättre tillsammans',
      desc: 'Gå med i en grupp med en annan spelare.',
    },
    soc_full_house: { name: 'Fullt hus', desc: 'Rensa ett fängelsehål med en full grupp om fem.' },
    soc_guild_joined: { name: 'Under samma baner', desc: 'Bli medlem i ett gille.' },
    soc_guild_founded: { name: 'Grundarens fjäderpenna', desc: 'Grunda ett eget gille.' },
    soc_first_trade: { name: 'Ärligt byte', desc: 'Genomför en handel med en annan spelare.' },
    soc_first_sale: {
      name: 'Öppet för affärer',
      desc: 'Hämta ut mynten från din första försäljning på Världsmarknaden.',
    },
    soc_steady_custom: {
      name: 'Stadig kundkrets',
      desc: 'Hämta ut sammanlagt 10 guld från dina försäljningar på Världsmarknaden.',
    },
    soc_market_magnate: {
      name: 'Marknadsmagnat',
      desc: 'Hämta ut sammanlagt 100 guld från dina försäljningar på Världsmarknaden.',
      title: 'Magnaten',
    },
    soc_by_ravens_wing: {
      name: 'På korpens vingar',
      desc: 'Skicka ett korppostbrev med mynt eller ett paket.',
    },
    soc_room_for_more: { name: 'Plats för mer', desc: 'Köp din första valvutbyggnad.' },
    soc_gilded_strongbox: {
      name: 'Förgyllda kassakistan',
      desc: 'Köp varje valvutbyggnad som kamrerarna är villiga att sälja dig.',
    },
    soc_meet_bursar: {
      name: 'Vår Fernando är oss en väldig borg',
      desc: 'Visa din aktning för kamrer Fernando, Förgyllda kassakistans väktare i Östbäck.',
    },
    soc_pocket_money: { name: 'Fickpengar', desc: 'Plundra sammanlagt 1 guld i mynt.' },
    soc_heavy_purse: { name: 'Tung börs', desc: 'Plundra sammanlagt 10 guld i mynt.' },
    soc_wyrms_hoard: { name: 'En lindorms skatt', desc: 'Plundra sammanlagt 100 guld i mynt.' },
    soc_civic_duty: { name: 'Medborgerlig plikt', desc: 'Placera din första stadsfokuspoäng.' },
    exp_long_road_north: {
      name: 'Den långa vägen norrut',
      desc: 'Besök alla tre huvudorterna: Östbäck, Kärrbron och Högvakten.',
    },
    exp_vale_wayfarer: {
      name: 'Dalens vägfarare',
      desc: 'Besök alla elva namngivna platser i Östbäcksdalen.',
    },
    exp_marsh_wayfarer: {
      name: 'Träskets vägfarare',
      desc: 'Besök alla åtta namngivna platser i Dykärrsträsket.',
    },
    exp_peaks_wayfarer: {
      name: 'Höjdernas vägfarare',
      desc: 'Besök alla tio namngivna platser i Törntoppshöjderna.',
    },
    exp_world_traveler: {
      name: 'Världsresenär',
      desc: 'Fullborda vägfararbedriften i alla tre zonerna.',
      title: 'Vägfararen',
    },
    exp_something_shiny: {
      name: 'Något som glimmar',
      desc: 'Plocka upp ett gnistrande föremål från marken.',
    },
    exp_first_ore: { name: 'Hugg i berget', desc: 'Skörda din första malmådra.' },
    exp_first_timber: { name: 'Träd faller!', desc: 'Skörda ditt första timmerbestånd.' },
    exp_first_herb: { name: 'Gröna fingrar', desc: 'Skörda ditt första örtstånd.' },
    feat_era_cap: {
      name: 'Första erans barn',
      desc: 'Nådde nivå 20 medan Första eran ännu rådde.',
    },
    feat_book_complete: {
      name: 'Hela boken',
      desc: 'Fullborda varenda bedrift i Bedrifternas bok.',
    },
    feat_brightwood_relic: {
      name: 'Till minne av Ljusskogen',
      desc: 'Bevara en relik från den gamla Ljusskogen: Snårhudsjackan eller Monarkens krona.',
    },
    hid_saul_footnote: {
      name: 'En fotnot i historien',
      desc: 'Tjatade på krönikören Saul nio gånger utan uppehåll.',
      title: 'Fotnoten',
    },
    hid_gilded_tour: {
      name: 'Den förgyllda rundturen',
      desc: 'Gjorde affärer med alla tre filialerna av Förgyllda kassakistan.',
    },
    hid_fall_death: {
      name: 'Tyngdlagen vinner alltid',
      desc: 'Dog av ett långt samtal med marken.',
    },
    hid_keepers_toll_twice: {
      name: 'Väktaren kräver dubbelt',
      desc: 'Dog medan Väktarens tull ännu vilade tungt på dig.',
    },
    hid_roll_hundred: {
      name: 'Naturlig hundra',
      desc: 'Slog en perfekt 100 på ett vanligt /roll.',
    },
    hid_yumi_cheer: {
      name: 'Yumis största beundrare',
      desc: 'Hejade på Yumi där hon kunde höra dig, mitt under en drabbning.',
    },
    hid_bountiful_coffer: {
      name: 'Purpurskrinet',
      desc: 'Knäckte ett Givmilt skrin innan det hann gå i baklås.',
    },
    hid_companion_save: {
      name: 'Inte på hennes vakt',
      desc: 'Din delveföljeslagare drog en fallen gruppkamrat på fötter igen.',
    },
    hid_codfather: {
      name: 'Upptagen i familjen',
      desc: 'Drog upp Torskfadern ur Djupkärrsgrunden.',
    },
    prog_crown_below: {
      name: 'Kronan därnere',
      desc: 'Följ kronan från de rastlösa benfälten till kung Nythraxis grav och fullborda Gisslets slut.',
    },
    prog_mere_at_rest: {
      name: 'Tjärnen till ro',
      desc: 'Följ tidväktaren Ondrel Vanes vaka till dess slut: kören tystad, Blekringeln dräpt och den dränkta månen lagd till ro.',
    },
    prog_callused_hands: {
      name: 'Valkiga händer',
      desc: 'Slutför Ett yrke för varje hand och förtjäna din första valk i Östbäcks hantverk.',
    },
    prog_tools_of_the_trade: {
      name: 'Yrkets verktyg',
      desc: 'Slutför ett stationsbundet hantverk vid Högvaktens hantverksnav.',
    },
    dgn_nythraxis_crypt: {
      name: 'Vad kryptan gömde',
      desc: 'Trotsa Den övergivna kryptan och återta båda nyckelstenshalvorna och den uråldriga dagboken från dess väktare.',
    },
    chr_marsh_first_cast: {
      name: 'Ålar i vassen',
      desc: 'Fånga en fisk ur Dykärrsträskets vatten.',
    },
  },
  tr_TR: {
    prog_first_steps: {
      name: 'İlk Adımlar',
      desc: '2. seviyeye ulaş ve uzun bir yolun ilk adımını at.',
    },
    prog_finding_your_feet: {
      name: 'Ayaklar Alışıyor',
      desc: '5. seviyeye ulaş; yaban şimdiden biraz daha küçük görünüyor.',
    },
    prog_double_digits: {
      name: 'Çift Haneler',
      desc: '10. seviyeye ulaş ve yeteneklerinin kilidini aç.',
    },
    prog_the_long_middle: { name: 'Yolun Uzun Ortası', desc: '15. seviyeye ulaş.' },
    prog_level_cap: { name: 'Zirveden Manzara', desc: 'Seviye tavanı olan 20. seviyeye ulaş.' },
    prog_well_rested: {
      name: 'Dinlenmiş ve Dinç',
      desc: 'Dinlenmiş tecrübe kazanana kadar bir hana yerleş.',
    },
    prog_talented: { name: 'Yerini Bulan Puan', desc: 'İlk yetenek puanını harca.' },
    prog_specialized: {
      name: 'Niyet Beyanı',
      desc: 'Bir uzmanlık seç ve onun imza yeteneğini öğren.',
    },
    prog_deep_roots: {
      name: 'Derin Kökler',
      desc: 'Son sıradaki bir yeteneğe yetenek puanı harca.',
    },
    prog_full_build: {
      name: 'On Birin Tamamı',
      desc: 'On bir yetenek puanının tamamını tek bir dizilişe harca.',
    },
    prog_veteran: {
      name: 'Kıdemli',
      desc: 'Ömür boyu toplam 250.000 tecrübe puanı kazan.',
      title: 'Kıdemli',
    },
    prog_champion: {
      name: 'Şampiyon',
      desc: 'Ömür boyu toplam 500.000 tecrübe puanı kazan.',
      title: 'Şampiyon',
    },
    prog_paragon: {
      name: 'Erdem Timsali',
      desc: 'Ömür boyu toplam 1.000.000 tecrübe puanı kazan.',
      title: 'Erdem Timsali',
    },
    prog_mythic: {
      name: 'Efsanevi',
      desc: 'Ömür boyu toplam 2.500.000 tecrübe puanı kazan.',
      title: 'Efsanevi',
    },
    prog_eternal: {
      name: 'Ebedi',
      desc: 'Ömür boyu toplam 5.000.000 tecrübe puanı kazan.',
      title: 'Ebedi',
    },
    prog_prestige: {
      name: 'Baştan Al',
      desc: 'Seviye tavanına ulaş, çubuğu bir kez daha doldur ve 1. prestij rütbesini al.',
    },
    prog_prestige_5: { name: 'Eski Alışkanlıklar', desc: '5. prestij rütbesine ulaş.' },
    prog_prestige_10: { name: 'Devridaim', desc: '10. prestij rütbesine ulaş.' },
    prog_first_harvest: { name: 'Tarlanın Meyveleri', desc: 'İlk toplama kaynağını hasat et.' },
    prog_mining_100: { name: 'Kanında Cevher Var', desc: 'Madencilikte 100 yetkinliğe ulaş.' },
    prog_logging_100: { name: 'Öz Odun Baltacısı', desc: 'Odunculukta 100 yetkinliğe ulaş.' },
    prog_herbalism_100: {
      name: 'Çayırların Efendisi',
      desc: 'Şifalı Otçulukta 100 yetkinliğe ulaş.',
    },
    prog_master_gatherer: {
      name: 'Usta Toplayıcı',
      desc: 'Madencilik, Odunculuk ve Şifalı Otçulukta 100 yetkinliğe ulaş.',
    },
    prog_first_craft: { name: 'El Emeği Göz Nuru', desc: 'İlk başarılı üretimini tamamla.' },
    prog_craft_specialist: {
      name: 'Meslek Sırları',
      desc: 'Herhangi bir zanaatta 75 beceriye ulaş ve uzmanlık avantajlarının kilidini aç.',
    },
    prog_around_the_ring: {
      name: 'Halkayı Dolaşmak',
      desc: 'Beş farklı zanaatta 25 beceriye ulaş.',
    },
    cmb_first_blood: { name: 'İlk Kan', desc: 'İlk düşmanını alt et.' },
    cmb_slayer: { name: 'Kıyıcı', desc: '1.000 düşman alt et.' },
    cmb_legion_of_one: { name: 'Tek Kişilik Ordu', desc: '10.000 düşman alt et.' },
    cmb_heavy_hitter: { name: 'Eli Ağır', desc: 'Toplam 500.000 hasar ver.' },
    cmb_critical_eye: { name: 'Kritik Göz', desc: '500 kritik vuruş isabet ettir.' },
    cmb_giantslayer: {
      name: 'Devkıran',
      desc: 'Senden en az beş seviye yüksek bir düşmana son darbeyi indir.',
    },
    cmb_first_fall: {
      name: 'Silkelen ve Kalk',
      desc: 'İlk kez öl; en iyilerimizin bile başına gelir.',
    },
    dgn_hollow_crypt: { name: 'Mezarkıran', desc: "Oyuk Mezar'da Mezarçağıran Morthen'i alt et." },
    dgn_sunken_bastion: {
      name: 'Sisin Bağı Çözüldü',
      desc: "Batık Kale'de Fogbinder Vael'i alt et.",
    },
    dgn_drowned_temple: {
      name: "Ay'ı Boğmak",
      desc: "Boğulmuş Tapınak'ta Ysolei, Boğulmuş Ay'ın Avatarı'nı alt et.",
    },
    dgn_gravewyrm_sanctum: {
      name: 'Aşağıdaki Ejder',
      desc: "Mezarejderi Mabedi'nde Mezarejderi Korzul'u alt et.",
    },
    dgn_hollow_crypt_heroic: {
      name: 'Kahramanca: Oyuk Mezar',
      desc: "Oyuk Mezar'da Mezarçağıran Morthen'i Kahramanca zorlukta alt et.",
    },
    dgn_sunken_bastion_heroic: {
      name: 'Kahramanca: Batık Kale',
      desc: "Batık Kale'de Fogbinder Vael'i Kahramanca zorlukta alt et.",
    },
    dgn_drowned_temple_heroic: {
      name: 'Kahramanca: Boğulmuş Tapınak',
      desc: "Boğulmuş Tapınak'ta Ysolei, Boğulmuş Ay'ın Avatarı'nı Kahramanca zorlukta alt et.",
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Kahramanca: Mezarejderi Mabedi',
      desc: "Mezarejderi Mabedi'nde Mezarejderi Korzul'u Kahramanca zorlukta alt et.",
    },
    dgn_nythraxis: {
      name: 'Artık Bela Yok',
      desc: "Mühürlü kraliyet kapısının ardında Nythraxis, Dikenzirve Belası'nı alt et.",
    },
    dgn_nythraxis_heroic: {
      name: 'Kahramanca: Artık Bela Yok',
      desc: "Nythraxis, Dikenzirve Belası'nı Kahramanca zorlukta alt et.",
    },
    dgn_thornpeak_rounds: {
      name: 'Devriye Turu',
      desc: "Oyuk Mezar'ı, Batık Kale'yi, Boğulmuş Tapınak'ı ve Mezarejderi Mabedi'ni temizle.",
    },
    dgn_deepward: {
      name: 'Derinlerin Bekçisi',
      desc: 'Tüm zindanları, akını ve her iki mağara seferini Kahramanca zorlukta fethet.',
    },
    dgn_mark_circuit: {
      name: 'Tam Tur',
      desc: 'Dört Kahramanca zindanın hepsinden tek bir günde Kahramanca Nişan kazan.',
    },
    dgn_boss_clears_50: { name: 'Ellinci Kapı', desc: "50 zindan sonu boss'unu alt et." },
    dgn_morthen_flawless: {
      name: 'Kemiğimiz Bile Kırılmadı',
      desc: "Hiçbir grup üyesi ölmeden Mezarçağıran Morthen'i Kahramanca zorlukta alt et.",
    },
    dgn_morthen_trio: {
      name: 'Mezara Karşı Üç Kişi',
      desc: "Mezarçağıran Morthen'i en fazla üç oyuncuyla alt et.",
    },
    dgn_olen_arc: {
      name: "Azrail'e Çalım",
      desc: "Şövalye-Komutan Olen'i, Biçen Yay'ı mevcut hedefinden başka kimseye isabet etmeden alt et.",
    },
    dgn_vael_thralls: {
      name: 'Bana Köle Sökmez',
      desc: "Fogbinder Vael'i, çağırdığı her Boğulmuş Köle çoktan öldürülmüşken alt et.",
    },
    dgn_ysolei_moonspawn: {
      name: 'Son Ay Dölüne Dek',
      desc: "Ysolei'yi, çağırdığı her Ay Dölü çoktan öldürülmüşken alt et.",
    },
    dgn_ysolei_flawless: {
      name: 'Gözler Kupkuru',
      desc: "Hiçbir grup üyesi ölmeden Ysolei, Boğulmuş Ay'ın Avatarı'nı Kahramanca zorlukta alt et.",
    },
    dgn_velkhar_bonewalkers: {
      name: 'Gömülü Kalın',
      desc: "Yüce Nekromcu Velkhar'ı, o düşmeden önce her Diriltilmiş Kemikyürüyen yok edilmişken alt et.",
    },
    dgn_korzul_flawless: {
      name: 'Ejderdeviren',
      desc: "Hiçbir grup üyesi ölmeden Mezarejderi Korzul'u Kahramanca zorlukta alt et.",
      title: 'Ejderdeviren',
    },
    dgn_sanctum_speed: {
      name: 'Mabet Koşusu',
      desc: "Grubunun Mezarejderi Mabedi'ni almasından itibaren 15 dakika içinde Mezarejderi Korzul'u alt et.",
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Hiçbir Krala Diz Çökme',
      desc: "Nythraxis'i, Kabirkıran mevcut hedefinden başka kimseye asla isabet etmeden alt et.",
    },
    dgn_nythraxis_wardens: {
      name: 'Koruma Taşlarının Bekçileri',
      desc: "Nythraxis'i, her Ölümsüz Öfke daha inmeden kırılmışken alt et.",
    },
    dgn_nythraxis_deathless: {
      name: 'Daha Ölümsüzü Yok',
      desc: "Tek bir akıncı bile ölmeden Nythraxis, Dikenzirve Belası'nı Kahramanca zorlukta alt et.",
      title: 'Ölümsüz',
    },
    cmb_thunzharr: {
      name: 'Dağ Devrildi',
      desc: "Fırtınakaya'da Thunzharr, Uyanan Zirve'yi yere ser.",
    },
    cmb_thunzharr_unbroken: {
      name: 'Zirvekıran',
      desc: "İlk darbenden onun son nefesine dek hiç ölmeden Thunzharr, Uyanan Zirve'yi yere ser.",
      title: 'Zirvekıran',
    },
    cmb_thunzharr_ten: {
      name: 'Dağ Devirme Alışkanlığı',
      desc: "Thunzharr, Uyanan Zirve'yi on kez yere ser.",
    },
    dlv_reliquary: { name: 'Emanetlik Akıncısı', desc: "Çökmüş Emanetlik'i temizle." },
    dlv_reliquary_heroic: {
      name: 'Kahramanca: Çökmüş Emanetlik',
      desc: "Çökmüş Emanetlik'i Kahramanca kademesinde temizle.",
    },
    dlv_litany: { name: 'Litanyayı Sustur', desc: "Boğulmuş Litanya'yı temizle." },
    dlv_litany_heroic: {
      name: 'Kahramanca: Boğulmuş Litanya',
      desc: "Boğulmuş Litanya'yı Kahramanca kademesinde temizle.",
    },
    dlv_lore_journal: {
      name: 'Derkenar',
      desc: 'Mağara seferi günlüğündeki beş kaydın tümünün kilidini aç.',
    },
    dlv_companion_max: {
      name: 'Derinlerde Bir Dost',
      desc: 'Bir mağara seferi yoldaşını en yüksek rütbesine çıkar.',
    },
    dlv_companions_both: {
      name: 'İki Fener de Yanıyor',
      desc: "Her iki mağara seferi yoldaşını da, Çömez Tessa ile Edda Reedhand'i, en yüksek rütbelerine çıkar.",
    },
    dlv_clears_50: { name: 'Elli Kulaç', desc: '50 mağara seferi tamamla.' },
    dlv_solo_heroic: {
      name: 'İki Kişilik Kalabalık',
      desc: 'Kahramanca kademesindeki bir mağara seferini başka hiçbir oyuncu olmadan, yalnızca sen ve yoldaşınla temizle.',
    },
    dlv_tumbler_premium: {
      name: 'Çilingirin Yolu, Ustalıkla',
      desc: 'Korumalı bir emanetlik sandığını en yüksek bahiste, tek denemende hiç hata yapmadan aç.',
    },
    dlv_rite_flawless: {
      name: 'Harfi Harfine',
      desc: "Boğulmuş Emanetlik Ayini'ni tek bir hata bile yapmadan tamamla.",
    },
    dlv_varric_ringers: {
      name: 'Çanlar Susar',
      desc: "Diyakoz Varric'i, dirilttiği her Cenaze Çancısı çoktan öldürülmüşken yen.",
    },
    dlv_nhalia_bells: {
      name: 'Çan Susturan',
      desc: "Boğulmuş İlahi Rahibe Nhalia'yı, hiçbir grup üyesine Çalan Çan çarpmadan yen.",
      title: 'Çan Susturan',
    },
    chr_vale_chapter_i: {
      name: 'Vadi Vakayinamesi, I. Bölüm',
      desc: "Saul'un vakayinamesinin ilk bölümünü bitir: Doğudere'nin ilk ayak işlerini gör, Vadi'nin yolunu yordamını öğren ve zanaatlarının ilk tadına bak.",
    },
    chr_vale_chapter_ii: {
      name: 'Vadi Vakayinamesi, II. Bölüm',
      desc: "Saul'un vakayinamesinin ikinci bölümünü bitir: haydutları, murlocları ve maden haşaratını hakla, Domuz Tarlası'nda sahaya çık ve Emanetlik'e göğüs ger.",
    },
    chr_vale_chapter_iii: {
      name: "Vadi'nin Vakayinamesi",
      desc: "Vadi'nin hikâyesini sonuna dek götür: Mezarçağıran'ın maskesini düşür, Oyuk Mezar'ı arındır ve Vadi'nin adı bilinen her dehşetini yere ser.",
      title: 'Vadili',
    },
    chr_vale_gatherer: {
      name: 'Toprağın Bereketi',
      desc: "Doğudere Vadisi'nde bir cevher damarı, bir kesimlik ağaç ve bir şifalı ot öbeği topla.",
    },
    chr_vale_first_cast: {
      name: "Ayna Gölü'nde Bir Şey Var",
      desc: "Doğudere Vadisi'nin sularından bir balık tut.",
    },
    chr_vale_packbreaker: { name: 'Sürü Kıran', desc: '10 saniye içinde 3 Orman Kurdu öldür.' },
    chr_vale_cup_debut: {
      name: 'Bakır Kova Adayı',
      desc: "Domuz Tarlası'ndaki bir Vadi Kupası maçında sahaya çık ve topa dokun.",
    },
    chr_vale_rares: {
      name: "Vadi'nin Dehşetleri",
      desc: "Doğudere Vadisi'nin adı bilinen beş dehşetini öldür: İhtiyar Greyjaw, Mogger, Tünelkral Grix, Kaptan Verlan ve Hayaletbağlayan Maldrec.",
    },
    chr_marsh_chapter_i: {
      name: 'Bataklık Vakayinamesi, I. Bölüm',
      desc: "Osric Fenn'in vakayinamesinin ilk bölümünü bitir: Bataklık Köprüsü'nün seferberlik çağrısına koş, geçit yolunu güvene al ve bataklığın yolunu yordamını öğren.",
    },
    chr_marsh_chapter_ii: {
      name: 'Bataklık Vakayinamesi, II. Bölüm',
      desc: "Osric Fenn'in vakayinamesinin ikinci bölümünü bitir: dulları yuvalarından yakıp çıkar, boğulmuşları huzura erdir, Morina Baba'yı kıyıya çıkar ve Litanya'ya göğüs ger.",
    },
    chr_marsh_chapter_iii: {
      name: "Mirefen'in Vakayinamesi",
      desc: "Bataklığın hikâyesini sonuna dek götür: tarikat kampını dağıt, Fogbinder'ı Batık Kale'de sustur ve sisin adı bilinen her dehşetini yere ser.",
      title: 'Mirefenli',
    },
    chr_marsh_gatherer: {
      name: 'Bataklık Köprüsü Hasadı',
      desc: "Mirefen Bataklığı'nda bir cevher damarı, bir kesimlik ağaç ve bir şifalı ot öbeği topla.",
    },
    chr_marsh_unburst: {
      name: 'Sporların İçinde Durma',
      desc: 'Yakıcı Sporlar patlamasına yakalanmadan 8 Bataklık Şişkini öldür.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Şifayı Sustur',
      desc: "Mezar Çağıran Kampı'nda, bir Mezarçağıran Şifacısı'nı baktığı tarikatçıların herhangi birinden önce öldür.",
    },
    chr_marsh_rares: {
      name: 'Sisin Namlıları',
      desc: "Mirefen Bataklığı'nın adı bilinen üç dehşetini öldür: Doymak Bilmez Mirejaw, Boğulmuş Sloomtooth ve Rahibe Nhalia.",
    },
    chr_peaks_chapter_i: {
      name: 'Tepeler Vakayinamesi, I. Bölüm',
      desc: "Zenzie'nin vakayinamesinin ilk bölümünü bitir: sırt yolunu temizle, oyukları boşalt ve Yüksek Gözcü'nün koruduğu her patikayı öğren.",
    },
    chr_peaks_chapter_ii: {
      name: 'Tepeler Vakayinamesi, II. Bölüm',
      desc: "Zenzie'nin vakayinamesinin ikinci bölümünü bitir: Drogmar'ın Savaş Kampı'nı dağıt, uyanan fırtınayı oku ve Işıltıgöl'ün parıldadığı yerde dur.",
    },
    chr_peaks_chapter_iii: {
      name: "Dikenzirve'nin Vakayinamesi",
      desc: "Dağın hikâyesini sonuna dek götür: Ejder Tarikatı'nı çökert, Mabet'i sustur, Uyanan Zirve'yi devir ve kayalıkların adı bilinen her dehşetini yere ser.",
      title: 'Dikenzirveli',
    },
    chr_peaks_sparring: {
      name: 'Sur Talimi',
      desc: "Yüksek Gözcü'nün üstündeki antrenman kuklasına toplam 1.000 hasar ver.",
    },
    chr_peaks_glimmer_cast: {
      name: 'Soğuk Su, Daha Soğuk Işık',
      desc: "Işıltıgöl'den bir balık tut.",
    },
    chr_peaks_moongate: {
      name: 'Soğuk Geçitten',
      desc: 'Işıltıgöl kıyısındaki ay geçidinden geç.',
    },
    chr_peaks_waking_witness: {
      name: 'Yürüyen Dağ',
      desc: "Thunzharr, Uyanan Zirve'yi dağı arşınlarken kendi gözlerinle gör.",
    },
    chr_peaks_rares: {
      name: 'Kayaya Kazınan Adlar',
      desc: "Dikenzirve Tepeleri'nin adı bilinen dört dehşetini öldür: Demirdamar Ustabaşı, Brutok Kafataşıezen, Korkanat Voskar ve İlikbeyi Varkas.",
    },
    col_discovery_25: {
      name: 'İstifçi',
      desc: '25 farklı eşya keşfet (bir eşya, eline ilk geçtiği anda sayılır).',
    },
    col_discovery_75: { name: 'Saksağan', desc: '75 farklı eşya keşfet.' },
    col_discovery_150: {
      name: 'Nadire Kabinesi',
      desc: '150 farklı eşya keşfet.',
      title: 'Küratör',
    },
    col_discovery_250: { name: 'Büyük Katalog', desc: '250 farklı eşya keşfet.' },
    col_first_rare: { name: 'Mavi Boncuk', desc: 'Nadir kalitede ilk eşyanı edin.' },
    col_first_epic: { name: 'Mor Doğan', desc: 'Destansı kalitede ilk eşyanı edin.' },
    col_first_legendary: {
      name: 'Turnayı Turuncusundan',
      desc: 'Efsanevi kalitede ilk eşyanı edin.',
    },
    col_set_vale_arcanist: {
      name: 'Vadi Ezoteristinin Kisvesi',
      desc: "Vadi Ezoteristinin Kisvesi'nin her parçasını keşfet.",
    },
    col_set_boundstone_vanguard: {
      name: 'Bağlıtaş Öncüsü',
      desc: "Bağlıtaş Öncüsü'nün her parçasını keşfet.",
    },
    col_set_greyjaw_stalker: {
      name: 'Greyjaw Avcısı Takımı',
      desc: "Greyjaw Avcısı Takımı'nın her parçasını keşfet.",
    },
    col_set_deathlord: {
      name: 'Barrowlord Savaş Teçhizatı',
      desc: "Barrowlord Savaş Teçhizatı'nın her parçasını keşfet.",
    },
    col_set_wyrmshadow: {
      name: 'Nightfang Urbaları',
      desc: "Nightfang Urbaları'nın her parçasını keşfet.",
    },
    col_set_necromancers: {
      name: 'Mournweave Kıyafeti',
      desc: "Mournweave Kıyafeti'nin her parçasını keşfet.",
    },
    col_set_crownforged: {
      name: 'Bonewrought Kisvesi',
      desc: "Bonewrought Kisvesi'nin her parçasını keşfet.",
    },
    col_set_nighttalon: {
      name: 'Direfang Postu',
      desc: "Direfang Postu'nun her parçasını keşfet.",
    },
    col_set_soulflame: {
      name: 'Wraithfire Kisvesi',
      desc: "Wraithfire Kisvesi'nin her parçasını keşfet.",
    },
    col_set_stormcallers: {
      name: 'Galecall Urbaları',
      desc: "Galecall Urbaları'nın her parçasını keşfet.",
    },
    col_seven_regalia: {
      name: 'Yedi Kat Gardırop',
      desc: 'Yedi destansı zırh ailesinin tamamının her parçasını keşfet.',
      title: 'İhtişamlı',
    },
    col_true_colors: {
      name: 'Asıl Rengini Göster',
      desc: 'Sınıfının varsayılan görünümü dışında herhangi bir görünümle sahaya çık.',
    },
    col_all_slots: {
      name: 'On Bir Dirhem Bir Çekirdek',
      desc: 'Aynı anda on bir ekipman yuvasının tamamında birer eşya kuşanmış ol.',
    },
    col_quartermaster_buyout: {
      name: 'Gedikli Müşteri',
      desc: "Kahramanca Levazımcısı'nın tezgâhındaki on parçanın tamamını keşfet.",
    },
    col_glimmerfin: { name: 'Umut Pırıltısı', desc: 'Bir Pırıltıyüzgeç Koi tut.' },
    col_full_creel: {
      name: 'Dolu Sepet',
      desc: "Vadi'nin, Bataklık'ın ve Tepeler'in sularındaki altı yaygın avın tümünü keşfet.",
    },
    col_junk_drawer: { name: 'Ivır Zıvır Çekmecesi', desc: 'Kötü kalitede 10 farklı eşya keşfet.' },
    pvp_arena_first_match: {
      name: 'Çizmelerindeki Kum',
      desc: "Kül Kolezyumu'nda, iki ligden herhangi birinde dereceli bir maça çık.",
    },
    pvp_arena_first_win: {
      name: 'Tribünler Kükrüyor',
      desc: 'İki ligden herhangi birinde dereceli bir arena maçı kazan.',
    },
    pvp_arena_1v1_1600: { name: 'Kolezyum Namzedi', desc: '1v1 arena liginde 1600 puana ulaş.' },
    pvp_arena_1v1_1750: { name: 'Kolezyum Hasmı', desc: '1v1 arena liginde 1750 puana ulaş.' },
    pvp_arena_1v1_1900: {
      name: 'Gladyatör',
      desc: '1v1 arena liginde 1900 puana ulaş.',
      title: 'Gladyatör',
    },
    pvp_arena_2v2_1600: { name: 'İki Kişilik Ordu', desc: '2v2 arena liginde 1600 puana ulaş.' },
    pvp_arena_2v2_1750: { name: 'Korkunç İkili', desc: '2v2 arena liginde 1750 puana ulaş.' },
    pvp_arena_2v2_1900: { name: 'Kusursuz Ortaklık', desc: '2v2 arena liginde 1900 puana ulaş.' },
    pvp_duel_first_win: { name: 'Bunu Dışarıda Halledelim', desc: 'Bir düello kazan.' },
    pvp_duel_grace: {
      name: 'Tevazu Dersi',
      desc: 'Onurunu büyük ölçüde koruyarak bir düello kaybet.',
    },
    pvp_vcup_first_match: {
      name: 'Sahaya İlk Adım',
      desc: "Kazan ya da kaybet, Domuz Tarlası'nda bir Vadi Kupası maçını sonuna kadar oyna.",
    },
    pvp_vcup_first_win: { name: 'İlk Kupa', desc: 'Dereceli bir Vadi Kupası maçı kazan.' },
    pvp_vcup_wins_10: {
      name: 'Domuztopunun Eski Kurdu',
      desc: '10 dereceli Vadi Kupası maçı kazan.',
    },
    pvp_vcup_wins_25: {
      name: 'Domuztopu Efsanesi',
      desc: '25 dereceli Vadi Kupası maçı kazan.',
      title: 'Domuztopu Efsanesi',
    },
    pvp_vcup_first_goal: { name: 'Siftah', desc: 'Dereceli bir Vadi Kupası maçında gol at.' },
    pvp_vcup_hat_trick: {
      name: 'Hat-Trick Kahramanı',
      desc: '3v3 ya da daha büyük ligde, tek bir dereceli Vadi Kupası maçında üç gol at.',
    },
    pvp_vcup_golden_goal: {
      name: 'Altın An',
      desc: 'Dereceli bir Vadi Kupası maçının kaderini belirleyen altın golü at.',
    },
    pvp_vcup_first_save: {
      name: 'Güvenli Eller',
      desc: 'Dereceli bir Vadi Kupası maçında kaleci olarak bir kurtarış yap.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Bu Kaleden Geçilmez',
      desc: 'Dereceli bir Vadi Kupası maçını kaleci olarak gol yemeden kazan.',
    },
    pvp_vcup_guild_win: {
      name: 'Sancak İçin',
      desc: 'Loncanın sancağı altında katıldığın dereceli bir Vadi Kupası maçını kazan.',
    },
    pvp_fiesta_first_bout: {
      name: 'Davetsiz Misafir',
      desc: 'Kazan ya da kaybet, eksiksiz bir 2v2 Fiesta müsabakasında dövüş.',
    },
    pvp_fiesta_first_win: { name: "Fiesta'nın Neşesi", desc: 'Bir 2v2 Fiesta müsabakası kazan.' },
    pvp_fiesta_double: {
      name: 'Çifte Bela',
      desc: "Fiesta'da dört saniye içinde rakiplerini iki kez yere ser.",
    },
    pvp_fiesta_shutdown: {
      name: 'Oyunbozan',
      desc: "Fiesta'da, serisi üçe ya da daha fazlasına ulaşmış bir rakibi yere ser.",
    },
    pvp_fiesta_full_build: {
      name: 'Tepeden Tırnağa Hazır',
      desc: 'Üç dalganın her birinden birer takviye kilitlenmiş halde bir Fiesta müsabakası kazan.',
    },
    pvp_fiesta_powerups: {
      name: 'Her Şeyden Bir Tane',
      desc: 'Dört ring güçlendirmesinin her birini en az bir kez kap: Hız Şeytanı, Kolos, Ay Botları ve Cinnet.',
    },
    pvp_fiesta_five_kills: {
      name: 'Partiyi Sırtlayan',
      desc: 'Tek bir Fiesta müsabakasında rakiplerini beş kez yere ser.',
    },
    soc_first_party: {
      name: 'Birlikten Kuvvet Doğar',
      desc: 'Başka bir oyuncuyla aynı gruba katıl.',
    },
    soc_full_house: { name: 'Tam Kadro', desc: 'Beş kişilik tam bir grupla bir zindanı temizle.' },
    soc_guild_joined: { name: 'Tek Sancak Altında', desc: 'Bir loncaya üye ol.' },
    soc_guild_founded: { name: 'Kurucunun Tüy Kalemi', desc: 'Kendi loncanı kur.' },
    soc_first_trade: { name: 'Adil Bir Takas', desc: 'Başka bir oyuncuyla bir takası tamamla.' },
    soc_first_sale: {
      name: 'Dükkân Açıldı',
      desc: 'İlk Dünya Pazarı satışından kazandığın parayı tahsil et.',
    },
    soc_steady_custom: {
      name: 'Gedikli Müşteriler',
      desc: 'Dünya Pazarı satışlarından ömür boyu toplam 10 altın tahsil et.',
    },
    soc_market_magnate: {
      name: 'Pazar Kodamanı',
      desc: 'Dünya Pazarı satışlarından ömür boyu toplam 100 altın tahsil et.',
      title: 'Kodaman',
    },
    soc_by_ravens_wing: {
      name: 'Kuzgun Kanadıyla',
      desc: 'Para ya da paket taşıyan bir Kuzgun Postası mektubu gönder.',
    },
    soc_room_for_more: { name: 'Daha Fazlasına Yer Var', desc: 'İlk banka genişletmeni satın al.' },
    soc_gilded_strongbox: {
      name: 'Yaldızlı Kasa',
      desc: 'Veznedarların sana satacağı her banka genişletmesini satın al.',
    },
    soc_meet_bursar: {
      name: "Fernando'ya Emanet",
      desc: "Doğudere'de Yaldızlı Kasa'nın bekçisi Veznedar Fernando'ya saygılarını sun.",
    },
    soc_pocket_money: {
      name: 'Cep Harçlığı',
      desc: 'Ömür boyu toplamda 1 altın değerinde para yağmala.',
    },
    soc_heavy_purse: {
      name: 'Ağır Kese',
      desc: 'Ömür boyu toplamda 10 altın değerinde para yağmala.',
    },
    soc_wyrms_hoard: {
      name: 'Ejder İstifi',
      desc: 'Ömür boyu toplamda 100 altın değerinde para yağmala.',
    },
    soc_civic_duty: { name: 'Vatandaşlık Görevi', desc: 'İlk kasaba odak puanını ata.' },
    exp_long_road_north: {
      name: 'Kuzeye Giden Uzun Yol',
      desc: 'Üç merkez yerleşimin hepsini ziyaret et: Doğudere, Bataklık Köprüsü ve Yüksek Gözcü.',
    },
    exp_vale_wayfarer: {
      name: 'Vadinin Seyyahı',
      desc: "Doğudere Vadisi'nin adı bilinen on bir yerinin tamamını ziyaret et.",
    },
    exp_marsh_wayfarer: {
      name: 'Bataklığın Seyyahı',
      desc: "Mirefen Bataklığı'nın adı bilinen sekiz yerinin tamamını ziyaret et.",
    },
    exp_peaks_wayfarer: {
      name: 'Tepelerin Seyyahı',
      desc: "Dikenzirve Tepeleri'nin adı bilinen on yerinin tamamını ziyaret et.",
    },
    exp_world_traveler: {
      name: 'Cihan Seyyahı',
      desc: 'Üç bölgenin de seyyah yiğitliğini kazan.',
      title: 'Seyyah',
    },
    exp_something_shiny: { name: 'Parlak Bir Şey', desc: 'Işıldayan bir nesneyi yerden al.' },
    exp_first_ore: { name: 'Kazmayı Toprağa Vur', desc: 'İlk cevher kaynağını topla.' },
    exp_first_timber: { name: 'Ağaç Devriliyor!', desc: 'İlk odun kaynağını topla.' },
    exp_first_herb: { name: 'Bereketli Eller', desc: 'İlk şifalı ot kaynağını topla.' },
    feat_era_cap: {
      name: 'Birinci Çağın Evladı',
      desc: 'Birinci Çağ hüküm sürerken 20. seviyeye ulaştın.',
    },
    feat_book_complete: {
      name: 'Kitabın Tamamı',
      desc: "Yiğitlikler Kitabı'ndaki her yiğitliği kazan.",
    },
    feat_brightwood_relic: {
      name: "Parlakorman'ın Anısına",
      desc: "Eski Parlakorman'dan kalma bir yadigârı sakla: Dikenpost Cepken ya da Hükümdar'ın Tacı.",
    },
    hid_saul_footnote: {
      name: 'Tarihe Düşülen Dipnot',
      desc: "Vakanüvis Saul'u ara vermeden dokuz kez rahatsız ettin.",
      title: 'Dipnot',
    },
    hid_gilded_tour: {
      name: 'Yaldızlı Tur',
      desc: "Yaldızlı Kasa'nın üç şubesinin üçüyle de iş yaptın.",
    },
    hid_fall_death: {
      name: 'Yerçekimi Hep Kazanır',
      desc: 'Yerle girdiğin uzun bir sohbetin sonunda öldün.',
    },
    hid_keepers_toll_twice: {
      name: 'Bekçi İki Kez Tahsil Eder',
      desc: "Bekçi'nin Bedeli hâlâ üzerindeyken öldün.",
    },
    hid_roll_hundred: {
      name: 'Doğal Yüzlük',
      desc: 'Sıradan bir /roll atışında kusursuz bir 100 tutturdun.',
    },
    hid_yumi_cheer: {
      name: "Yumi'nin Bir Numaralı Hayranı",
      desc: "Müsabakanın tam ortasında, Yumi'nin seni duyabileceği bir yerde ona tezahürat yaptın.",
    },
    hid_bountiful_coffer: {
      name: 'Mor Sandık',
      desc: "Bir Bereket Sandığı'nı sıkışmasına fırsat vermeden kırıp açtın.",
    },
    hid_companion_save: {
      name: 'Onun Nöbetinde Asla',
      desc: 'Mağara seferi yoldaşın, yere serilen bir grup arkadaşını ayağa kaldırdı.',
    },
    hid_codfather: {
      name: 'Aileye Katıldın',
      desc: "Morina Baba'yı Derinbataklık Sığlıkları'ndan çekip çıkardın.",
    },
    prog_crown_below: {
      name: 'Aşağıdaki Taç',
      desc: "Huzursuz kemik tarlalarından Kral Nythraxis'in kabrine dek tacın izini sür ve Belanın Sonu görevini tamamla.",
    },
    prog_mere_at_rest: {
      name: 'Durulan Göl',
      desc: "Ondrel Vane'in nöbetini sonuna dek götür: koroyu sustur, Solgunkıvrım'ı öldür ve Boğulmuş Ay'ı huzura erdir.",
    },
    prog_callused_hands: {
      name: 'Nasırlı Eller',
      desc: "Her Ele Bir Zanaat görevini tamamla ve Doğudere'nin zanaatlarında ilk nasırını kazan.",
    },
    prog_tools_of_the_trade: {
      name: 'Alet İşler, El Övünür',
      desc: 'Yüksek Gözcü zanaat merkezinde tezgâh gerektiren bir üretimi tamamla.',
    },
    dgn_nythraxis_crypt: {
      name: 'Mahzenin Sakladığı',
      desc: "Terk Edilmiş Mahzen'e meydan oku ve muhafızlarından kilit taşının iki yarısı ile Kadim Günlük'ü geri al.",
    },
    chr_marsh_first_cast: {
      name: 'Sazlıktaki Yılanbalıkları',
      desc: "Mirefen Bataklığı'nın sularından bir balık tut.",
    },
  },
  vi_VN: {
    prog_first_steps: {
      name: 'Những Bước Đầu Tiên',
      desc: 'Đạt cấp 2 và đặt bước chân đầu tiên lên một con đường dài.',
    },
    prog_finding_your_feet: {
      name: 'Vững Đôi Chân',
      desc: 'Đạt cấp 5; chốn hoang dã trông đã nhỏ đi đôi chút.',
    },
    prog_double_digits: { name: 'Hai Chữ Số', desc: 'Đạt cấp 10 và mở khóa thiên phú của bạn.' },
    prog_the_long_middle: { name: 'Chặng Giữa Đằng Đẵng', desc: 'Đạt cấp 15.' },
    prog_level_cap: { name: 'Cảnh Sắc Từ Đỉnh Cao', desc: 'Đạt cấp 20, cấp tối đa.' },
    prog_well_rested: {
      name: 'Ngơi Nghỉ Trọn Vẹn',
      desc: 'Nghỉ chân tại quán trọ cho đến khi bạn tích được kinh nghiệm nghỉ ngơi.',
    },
    prog_talented: { name: 'Một Điểm Đáng Giá', desc: 'Tiêu điểm thiên phú đầu tiên của bạn.' },
    prog_specialized: {
      name: 'Tuyên Bố Chí Hướng',
      desc: 'Chọn một hệ phái và học kỹ năng đặc trưng của hệ phái ấy.',
    },
    prog_deep_roots: {
      name: 'Rễ Cắm Sâu',
      desc: 'Tiêu một điểm thiên phú vào một thiên phú thuộc hàng cuối.',
    },
    prog_full_build: {
      name: 'Trọn Bộ Mười Một',
      desc: 'Tiêu trọn cả mười một điểm thiên phú vào một lối xây dựng duy nhất.',
    },
    prog_veteran: {
      name: 'Kỳ Cựu',
      desc: 'Tích lũy 250,000 điểm kinh nghiệm trọn đời.',
      title: 'Kỳ Cựu',
    },
    prog_champion: {
      name: 'Nhà Vô Địch',
      desc: 'Tích lũy 500,000 điểm kinh nghiệm trọn đời.',
      title: 'Nhà Vô Địch',
    },
    prog_paragon: {
      name: 'Tinh Hoa',
      desc: 'Tích lũy 1,000,000 điểm kinh nghiệm trọn đời.',
      title: 'Tinh Hoa',
    },
    prog_mythic: {
      name: 'Huyền Thoại',
      desc: 'Tích lũy 2,500,000 điểm kinh nghiệm trọn đời.',
      title: 'Huyền Thoại',
    },
    prog_eternal: {
      name: 'Vĩnh Hằng',
      desc: 'Tích lũy 5,000,000 điểm kinh nghiệm trọn đời.',
      title: 'Vĩnh Hằng',
    },
    prog_prestige: {
      name: 'Khởi Đầu Lại',
      desc: 'Đạt cấp tối đa, lấp đầy thanh kinh nghiệm thêm một lần nữa, và nhận bậc Uy Danh 1.',
    },
    prog_prestige_5: { name: 'Thói Quen Cũ', desc: 'Đạt bậc Uy Danh 5.' },
    prog_prestige_10: { name: 'Chuyển Động Vĩnh Cửu', desc: 'Đạt bậc Uy Danh 10.' },
    prog_first_harvest: {
      name: 'Hoa Trái Đồng Nội',
      desc: 'Thu hoạch điểm thu thập đầu tiên của bạn.',
    },
    prog_mining_100: {
      name: 'Quặng Trong Huyết Quản',
      desc: 'Đạt 100 điểm thành thạo Khai Khoáng.',
    },
    prog_logging_100: { name: 'Kẻ Đốn Lõi Gỗ', desc: 'Đạt 100 điểm thành thạo Đốn Gỗ.' },
    prog_herbalism_100: {
      name: 'Bậc Thầy Đồng Cỏ',
      desc: 'Đạt 100 điểm thành thạo Thảo Dược Học.',
    },
    prog_master_gatherer: {
      name: 'Bậc Thầy Thu Thập',
      desc: 'Đạt 100 điểm thành thạo trong Khai Khoáng, Đốn Gỗ, và Thảo Dược Học.',
    },
    prog_first_craft: {
      name: 'Làm Bằng Đôi Tay',
      desc: 'Hoàn thành lượt chế tác thành công đầu tiên của bạn.',
    },
    prog_craft_specialist: {
      name: 'Bí Mật Nhà Nghề',
      desc: 'Đạt 75 điểm kỹ năng trong bất kỳ một nghề chế tác nào và mở khóa các đặc quyền chuyên môn của nghề ấy.',
    },
    prog_around_the_ring: {
      name: 'Một Vòng Quanh Xưởng',
      desc: 'Đạt 25 điểm kỹ năng trong năm nghề chế tác khác nhau.',
    },
    cmb_first_blood: { name: 'Vết Máu Đầu Tiên', desc: 'Đánh bại kẻ địch đầu tiên của bạn.' },
    cmb_slayer: { name: 'Kẻ Tàn Sát', desc: 'Đánh bại 1,000 kẻ địch.' },
    cmb_legion_of_one: { name: 'Một Người Một Quân Đoàn', desc: 'Đánh bại 10,000 kẻ địch.' },
    cmb_heavy_hitter: { name: 'Tay Đấm Hạng Nặng', desc: 'Gây tổng cộng 500,000 sát thương.' },
    cmb_critical_eye: { name: 'Con Mắt Chí Mạng', desc: 'Tung 500 đòn chí mạng.' },
    cmb_giantslayer: {
      name: 'Kẻ Diệt Khổng Lồ',
      desc: 'Tung đòn kết liễu một kẻ địch cao hơn bạn ít nhất năm cấp.',
    },
    cmb_first_fall: {
      name: 'Phủi Bụi Đứng Dậy',
      desc: 'Chết lần đầu tiên; đến những người giỏi nhất cũng từng như thế.',
    },
    dgn_hollow_crypt: {
      name: 'Kẻ Phá Hầm Mộ',
      desc: 'Đánh bại Morthen Kẻ Gọi Mộ trong Hầm Mộ Rỗng.',
    },
    dgn_sunken_bastion: {
      name: 'Màn Sương Cởi Trói',
      desc: 'Đánh bại Vael Fogbinder trong Pháo Đài Chìm.',
    },
    dgn_drowned_temple: {
      name: 'Dìm Trăng Đáy Nước',
      desc: 'Đánh bại Ysolei, Hóa Thân Nguyệt Chết Chìm, trong Ngôi Đền Chết Chìm.',
    },
    dgn_gravewyrm_sanctum: {
      name: 'Cự Long Bên Dưới',
      desc: 'Đánh bại Korzul Mộ Long trong Thánh Đường Mộ Long.',
    },
    dgn_hollow_crypt_heroic: {
      name: 'Anh Hùng: Hầm Mộ Rỗng',
      desc: 'Đánh bại Morthen Kẻ Gọi Mộ trong Hầm Mộ Rỗng ở độ khó Anh Hùng.',
    },
    dgn_sunken_bastion_heroic: {
      name: 'Anh Hùng: Pháo Đài Chìm',
      desc: 'Đánh bại Vael Fogbinder trong Pháo Đài Chìm ở độ khó Anh Hùng.',
    },
    dgn_drowned_temple_heroic: {
      name: 'Anh Hùng: Ngôi Đền Chết Chìm',
      desc: 'Đánh bại Ysolei, Hóa Thân Nguyệt Chết Chìm, trong Ngôi Đền Chết Chìm ở độ khó Anh Hùng.',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: 'Anh Hùng: Thánh Đường Mộ Long',
      desc: 'Đánh bại Korzul Mộ Long trong Thánh Đường Mộ Long ở độ khó Anh Hùng.',
    },
    dgn_nythraxis: {
      name: 'Tai Họa Chấm Dứt',
      desc: 'Đánh bại Nythraxis, Tai Họa Đỉnh Gai, phía sau cánh cửa hoàng gia niêm phong.',
    },
    dgn_nythraxis_heroic: {
      name: 'Anh Hùng: Tai Họa Chấm Dứt',
      desc: 'Đánh bại Nythraxis, Tai Họa Đỉnh Gai, ở độ khó Anh Hùng.',
    },
    dgn_thornpeak_rounds: {
      name: 'Đảo Đủ Một Vòng',
      desc: 'Dọn sạch Hầm Mộ Rỗng, Pháo Đài Chìm, Ngôi Đền Chết Chìm, và Thánh Đường Mộ Long.',
    },
    dgn_deepward: {
      name: 'Trấn Giữ Vực Sâu',
      desc: 'Chinh phục mọi hầm ngục, raid, và cả hai hang sâu ở độ khó Anh Hùng.',
    },
    dgn_mark_circuit: {
      name: 'Trọn Một Vòng Đua',
      desc: 'Kiếm Dấu Ấn Anh Hùng từ cả bốn hầm ngục Anh Hùng trong cùng một ngày.',
    },
    dgn_boss_clears_50: { name: 'Năm Mươi Cánh Cửa Sâu', desc: 'Đánh bại 50 trùm cuối hầm ngục.' },
    dgn_morthen_flawless: {
      name: 'Không Ai Bỏ Xương Lại',
      desc: 'Đánh bại Morthen Kẻ Gọi Mộ ở độ khó Anh Hùng mà không một thành viên tổ đội nào tử trận.',
    },
    dgn_morthen_trio: {
      name: 'Ba Người Chống Nấm Mồ',
      desc: 'Đánh bại Morthen Kẻ Gọi Mộ với ba người chơi trở xuống.',
    },
    dgn_olen_arc: {
      name: 'Né Bước Tử Thần',
      desc: 'Đánh bại Hiệp Sĩ Chỉ Huy Olen mà Vòng Chém Gặt của hắn không đánh trúng ai ngoài mục tiêu hiện tại của hắn.',
    },
    dgn_vael_thralls: {
      name: 'Đừng Hòng Bắt Nô Lệ',
      desc: 'Đánh bại Vael Fogbinder khi mọi Nô Lệ Chết Chìm hắn triệu gọi đều đã bị giết từ trước.',
    },
    dgn_ysolei_moonspawn: {
      name: 'Không Sót Một Nguyệt Sinh',
      desc: 'Đánh bại Ysolei khi mọi Nguyệt Sinh nàng triệu gọi đều đã bị giết từ trước.',
    },
    dgn_ysolei_flawless: {
      name: 'Mắt Ráo Hoảnh',
      desc: 'Đánh bại Ysolei, Hóa Thân Nguyệt Chết Chìm, ở độ khó Anh Hùng mà không một thành viên tổ đội nào tử trận.',
    },
    dgn_velkhar_bonewalkers: {
      name: 'Cứ Nằm Yên Dưới Mộ',
      desc: 'Đánh bại Đại Tử Linh Sư Velkhar khi mọi Xác Xương Hồi Sinh đều bị tiêu diệt trước lúc hắn gục ngã.',
    },
    dgn_korzul_flawless: {
      name: 'Kẻ Đốn Long',
      desc: 'Đánh bại Korzul Mộ Long ở độ khó Anh Hùng mà không một thành viên tổ đội nào tử trận.',
      title: 'Kẻ Đốn Long',
    },
    dgn_sanctum_speed: {
      name: 'Nước Rút Thánh Đường',
      desc: 'Đánh bại Korzul Mộ Long trong vòng 15 phút kể từ khi tổ đội của bạn tiến chiếm Thánh Đường Mộ Long.',
    },
    dgn_nythraxis_gravebreaker: {
      name: 'Không Quỳ Trước Vua Nào',
      desc: 'Đánh bại Nythraxis mà Phá Mộ không hề đánh trúng ai ngoài mục tiêu hiện tại của hắn.',
    },
    dgn_nythraxis_wardens: {
      name: 'Người Giữ Đá Hộ Trận',
      desc: 'Đánh bại Nythraxis khi mọi đợt Cuồng Nộ Bất Tử đều bị phá trước khi kịp giáng xuống.',
    },
    dgn_nythraxis_deathless: {
      name: 'Không Ai Bất Tử Hơn',
      desc: 'Đánh bại Nythraxis, Tai Họa Đỉnh Gai, ở độ khó Anh Hùng mà không một thành viên raid nào tử trận.',
      title: 'Kẻ Bất Tử',
    },
    cmb_thunzharr: {
      name: 'Núi Đã Đổ',
      desc: 'Hạ gục Thunzharr, Đỉnh Núi Thức Giấc, tại Vách Bão.',
    },
    cmb_thunzharr_unbroken: {
      name: 'Kẻ Phá Đỉnh',
      desc: 'Hạ gục Thunzharr, Đỉnh Núi Thức Giấc, mà không chết lần nào từ đòn đầu tiên của bạn đến hơi thở cuối cùng của hắn.',
      title: 'Kẻ Phá Đỉnh',
    },
    cmb_thunzharr_ten: {
      name: 'Thói Quen Hạ Núi',
      desc: 'Hạ gục Thunzharr, Đỉnh Núi Thức Giấc, mười lần.',
    },
    dlv_reliquary: { name: 'Chân Chạy Thánh Tích', desc: 'Quét sạch Thánh Tích Sụp Đổ.' },
    dlv_reliquary_heroic: {
      name: 'Anh Hùng: Thánh Tích Sụp Đổ',
      desc: 'Quét sạch Thánh Tích Sụp Đổ ở bậc Anh Hùng.',
    },
    dlv_litany: { name: 'Bặt Tiếng Kinh Cầu', desc: 'Quét sạch Kinh Cầu Chết Chìm.' },
    dlv_litany_heroic: {
      name: 'Anh Hùng: Kinh Cầu Chết Chìm',
      desc: 'Quét sạch Kinh Cầu Chết Chìm ở bậc Anh Hùng.',
    },
    dlv_lore_journal: { name: 'Ghi Chú Bên Lề', desc: 'Mở khóa cả năm mục của nhật ký hang sâu.' },
    dlv_companion_max: {
      name: 'Bạn Nơi Vực Sâu',
      desc: 'Nâng một bạn đồng hành hang sâu lên bậc cao nhất của cô ấy.',
    },
    dlv_companions_both: {
      name: 'Hai Ngọn Đèn Cùng Sáng',
      desc: 'Nâng cả hai bạn đồng hành hang sâu, Tế Đồ Tessa và Edda Reedhand, lên bậc cao nhất.',
    },
    dlv_clears_50: { name: 'Năm Mươi Sải Sâu', desc: 'Hoàn thành 50 chuyến hang sâu.' },
    dlv_solo_heroic: {
      name: 'Hai Người Đã Đủ Chật',
      desc: 'Quét sạch một hang sâu bậc Anh Hùng không cùng người chơi nào khác, chỉ bạn và bạn đồng hành của mình.',
    },
    dlv_tumbler_premium: {
      name: 'Tinh Thông Đường Chốt Khóa',
      desc: 'Mở một rương thánh tích trấn phù ở mức cược cao nhất, hoàn hảo ngay trong lần thử duy nhất.',
    },
    dlv_rite_flawless: {
      name: 'Thuộc Làu Từng Chữ',
      desc: 'Hoàn thành Nghi Lễ Thánh Tích Chết Chìm mà không một lần sai sót.',
    },
    dlv_varric_ringers: {
      name: 'Chuông Ngừng Ngân',
      desc: 'Đánh bại Chấp Sự Varric khi mọi Kẻ Rung Chuông Tang Lễ hắn dựng dậy đều đã bị diệt từ trước.',
    },
    dlv_nhalia_bells: {
      name: 'Kẻ Lặng Chuông',
      desc: 'Đánh bại Sơ Nhalia, Bản Thánh Ca Chết Chìm, mà không một thành viên tổ đội nào bị Chuông Ngân Vang đánh trúng.',
      title: 'Kẻ Lặng Chuông',
    },
    chr_vale_chapter_i: {
      name: 'Biên Niên Sử Thung Lũng, Chương I',
      desc: 'Hoàn thành chương đầu trong biên niên sử của Saul: những việc vặt mở màn ở Đông Khê, nắm rõ địa thế Thung Lũng, và nếm chút hương vị đầu tiên của các nghề nơi đây.',
    },
    chr_vale_chapter_ii: {
      name: 'Biên Niên Sử Thung Lũng, Chương II',
      desc: 'Hoàn thành chương thứ hai trong biên niên sử của Saul: dẹp yên lũ cướp, đám murloc và loài sâu bọ trong mỏ, so tài trên Sân Heo Nái, và liều mình bước vào Thánh Tích Sụp Đổ.',
    },
    chr_vale_chapter_iii: {
      name: 'Trọn Bộ Biên Niên Sử Thung Lũng',
      desc: 'Theo trọn câu chuyện của Thung Lũng: Kẻ Gọi Mộ bị lột mặt nạ, Hầm Mộ Rỗng được thanh tẩy, và mọi nỗi kinh hoàng hữu danh của Thung Lũng đều bị hạ gục.',
      title: 'Xứ Thung Lũng',
    },
    chr_vale_gatherer: {
      name: 'Sống Nhờ Đất Mẹ',
      desc: 'Thu hoạch một mạch quặng, một cụm gỗ và một khóm thảo dược tại Thung Lũng Đông Khê.',
    },
    chr_vale_first_cast: {
      name: 'Có Gì Dưới Hồ Gương',
      desc: 'Câu một con cá từ vùng nước của Thung Lũng Đông Khê.',
    },
    chr_vale_packbreaker: { name: 'Kẻ Phá Bầy', desc: 'Hạ 3 Sói Rừng trong vòng 10 giây.' },
    chr_vale_cup_debut: {
      name: 'Kẻ Tranh Xô Đồng',
      desc: 'Ra sân và chạm bóng trong một trận Cúp Thung Lũng tại Sân Heo Nái.',
    },
    chr_vale_rares: {
      name: 'Nỗi Kinh Hoàng Thung Lũng',
      desc: 'Hạ năm nỗi kinh hoàng hữu danh của Thung Lũng Đông Khê: Lão Greyjaw, Mogger, Grix Vua Đường Hầm, Đội Trưởng Verlan và Kẻ Buộc Oan Hồn Maldrec.',
    },
    chr_marsh_chapter_i: {
      name: 'Biên Niên Sử Đầm Lầy, Chương I',
      desc: 'Hoàn thành chương đầu trong biên niên sử của Osric Fenn: đáp lời hiệu triệu Cầu Đầm, giữ vững đường đắp cao, và thuộc lòng hình hài đầm lầy.',
    },
    chr_marsh_chapter_ii: {
      name: 'Biên Niên Sử Đầm Lầy, Chương II',
      desc: 'Hoàn thành chương thứ hai trong biên niên sử của Osric Fenn: đốt sạch ổ nhện góa phụ, đưa những kẻ chết chìm về yên nghỉ, kéo được Cá Bố Già lên bờ, và liều mình bước vào Kinh Cầu Chết Chìm.',
    },
    chr_marsh_chapter_iii: {
      name: 'Trọn Bộ Biên Niên Sử Bùn Sâu',
      desc: 'Theo trọn câu chuyện của đầm lầy: doanh trại giáo phái bị đập tan, Fogbinder phải bặt tiếng trong Pháo Đài Chìm, và mọi nỗi kinh hoàng hữu danh của màn sương đều bị hạ gục.',
      title: 'Xứ Bùn Sâu',
    },
    chr_marsh_gatherer: {
      name: 'Lượm Lặt Cầu Đầm',
      desc: 'Thu hoạch một mạch quặng, một cụm gỗ và một khóm thảo dược tại Đầm Lầy Bùn Sâu.',
    },
    chr_marsh_unburst: {
      name: 'Chớ Đứng Trong Bào Tử',
      desc: 'Hạ 8 Quái Phình Đầm Lầy mà không dính đợt nổ Bào Tử Ăn Mòn của chúng.',
    },
    chr_marsh_hush_the_mending: {
      name: 'Chặn Tay Thầy Chữa',
      desc: 'Tại Doanh Trại Triệu Mộ, hạ một Thầy Chữa Gọi Mộ trước bất kỳ tín đồ nào hắn đang chăm sóc.',
    },
    chr_marsh_rares: {
      name: 'Danh Xưng Trong Sương',
      desc: 'Hạ ba nỗi kinh hoàng hữu danh của Đầm Lầy Bùn Sâu: Mirejaw Háu Đói, Sloomtooth Kẻ Chết Chìm và Sơ Nhalia.',
    },
    chr_peaks_chapter_i: {
      name: 'Biên Niên Sử Cao Nguyên, Chương I',
      desc: 'Hoàn thành chương đầu trong biên niên sử của Zenzie: dọn sạch đường sườn núi, quét rỗng những hang đào, và thuộc từng lối đi mà Vọng Đài Cao canh giữ.',
    },
    chr_peaks_chapter_ii: {
      name: 'Biên Niên Sử Cao Nguyên, Chương II',
      desc: 'Hoàn thành chương thứ hai trong biên niên sử của Zenzie: đập tan Trại Chiến của Drogmar, đọc hiểu cơn bão đang thức giấc, và đứng nơi Hồ Lung Linh tỏa sáng.',
    },
    chr_peaks_chapter_iii: {
      name: 'Trọn Bộ Biên Niên Sử Đỉnh Gai',
      desc: 'Theo trọn câu chuyện của ngọn núi: Long Giáo bị đập tan, Thánh Đường Mộ Long phải bặt tiếng, Đỉnh Núi Thức Giấc bị quật ngã, và mọi nỗi kinh hoàng hữu danh của vách đá đều bị hạ gục.',
      title: 'Xứ Đỉnh Gai',
    },
    chr_peaks_sparring: {
      name: 'Luyện Đòn Trên Tường',
      desc: 'Gây tổng cộng 1.000 sát thương lên Hình Nộm Tập Luyện phía trên Vọng Đài Cao.',
    },
    chr_peaks_glimmer_cast: {
      name: 'Nước Lạnh, Ánh Sáng Còn Lạnh Hơn',
      desc: 'Câu một con cá từ Hồ Lung Linh.',
    },
    chr_peaks_moongate: {
      name: 'Qua Cánh Cổng Giá Lạnh',
      desc: 'Bước qua nguyệt môn bên bờ Hồ Lung Linh.',
    },
    chr_peaks_waking_witness: {
      name: 'Ngọn Núi Biết Đi',
      desc: 'Tận mắt nhìn thấy Thunzharr, Đỉnh Núi Thức Giấc khi hắn sải bước trên núi.',
    },
    chr_peaks_rares: {
      name: 'Những Cái Tên Khắc Vào Vách Đá',
      desc: 'Hạ bốn nỗi kinh hoàng hữu danh của Cao Nguyên Đỉnh Gai: Quản Đốc Mạch Sắt, Brutok Nghiền Sọ, Voskar Cánh Tàn Lửa và Lãnh Chúa Tủy Varkas.',
    },
    col_discovery_25: {
      name: 'Chuột Gom Đồ',
      desc: 'Khám phá 25 món đồ khác nhau (mỗi món được tính vào lần đầu tiên nó về tay bạn).',
    },
    col_discovery_75: { name: 'Chim Ác Là', desc: 'Khám phá 75 món đồ khác nhau.' },
    col_discovery_150: {
      name: 'Tủ Kỳ Trân',
      desc: 'Khám phá 150 món đồ khác nhau.',
      title: 'Người Giữ Kỳ Trân',
    },
    col_discovery_250: { name: 'Đại Danh Mục', desc: 'Khám phá 250 món đồ khác nhau.' },
    col_first_rare: {
      name: 'Chút Gì Xanh Biếc',
      desc: 'Sở hữu món đồ phẩm chất hiếm đầu tiên của bạn.',
    },
    col_first_epic: {
      name: 'Sinh Ra Trong Sắc Tía',
      desc: 'Sở hữu món đồ phẩm chất sử thi đầu tiên của bạn.',
    },
    col_first_legendary: {
      name: 'Số Đỏ Màu Cam',
      desc: 'Sở hữu món đồ phẩm chất huyền thoại đầu tiên của bạn.',
    },
    col_set_vale_arcanist: {
      name: 'Vương Phục Bí Thuật Sư Thung Lũng',
      desc: 'Khám phá đủ mọi món của bộ Vương Phục Bí Thuật Sư Thung Lũng.',
    },
    col_set_boundstone_vanguard: {
      name: 'Tiên Phong Đá Trói',
      desc: 'Khám phá đủ mọi món của bộ Tiên Phong Đá Trói.',
    },
    col_set_greyjaw_stalker: {
      name: 'Bộ Đồ Kẻ Rình Greyjaw',
      desc: 'Khám phá đủ mọi món của Bộ Đồ Kẻ Rình Greyjaw.',
    },
    col_set_deathlord: {
      name: 'Chiến Giáp Barrowlord',
      desc: 'Khám phá đủ mọi món của bộ Chiến Giáp Barrowlord.',
    },
    col_set_wyrmshadow: {
      name: 'Lễ Phục Nightfang',
      desc: 'Khám phá đủ mọi món của bộ Lễ Phục Nightfang.',
    },
    col_set_necromancers: {
      name: 'Y Phục Mournweave',
      desc: 'Khám phá đủ mọi món của bộ Y Phục Mournweave.',
    },
    col_set_crownforged: {
      name: 'Vương Phục Bonewrought',
      desc: 'Khám phá đủ mọi món của bộ Vương Phục Bonewrought.',
    },
    col_set_nighttalon: { name: 'Bộ Da Direfang', desc: 'Khám phá đủ mọi món của Bộ Da Direfang.' },
    col_set_soulflame: {
      name: 'Vương Phục Wraithfire',
      desc: 'Khám phá đủ mọi món của bộ Vương Phục Wraithfire.',
    },
    col_set_stormcallers: {
      name: 'Lễ Phục Galecall',
      desc: 'Khám phá đủ mọi món của bộ Lễ Phục Galecall.',
    },
    col_seven_regalia: {
      name: 'Tủ Áo Bảy Bộ',
      desc: 'Khám phá đủ mọi món của cả bảy dòng giáp sử thi.',
      title: 'Lộng Lẫy',
    },
    col_true_colors: {
      name: 'Bản Sắc Riêng',
      desc: 'Ra trận với một diện mạo khác với diện mạo mặc định của lớp nhân vật bạn.',
    },
    col_all_slots: {
      name: 'Mười Một Phân Vẹn Mười Một',
      desc: 'Trang bị đồ ở cả mười một ô trang bị cùng một lúc.',
    },
    col_quartermaster_buyout: {
      name: 'Khách Quen Hạng Nhất',
      desc: 'Khám phá đủ cả mười món hàng của Quân Nhu Trưởng Vex.',
    },
    col_glimmerfin: { name: 'Tia Hy Vọng Lấp Lánh', desc: 'Câu được một con Cá Koi Vây Lấp Lánh.' },
    col_full_creel: {
      name: 'Giỏ Cá Đầy Ắp',
      desc: 'Khám phá đủ sáu loại cá thường từ vùng nước của Thung Lũng, Đầm Lầy và Cao Nguyên.',
    },
    col_junk_drawer: {
      name: 'Ngăn Kéo Đồ Đồng Nát',
      desc: 'Khám phá 10 món đồ phẩm chất kém khác nhau.',
    },
    pvp_arena_first_match: {
      name: 'Cát Trong Đôi Giày',
      desc: 'Đấu một trận xếp hạng tại Đấu Trường Tro Tàn, ở nhánh đấu bất kỳ.',
    },
    pvp_arena_first_win: {
      name: 'Khán Đài Gầm Vang',
      desc: 'Thắng một trận đấu trường xếp hạng ở nhánh đấu bất kỳ.',
    },
    pvp_arena_1v1_1600: {
      name: 'Ứng Viên Đấu Trường',
      desc: 'Đạt 1600 điểm xếp hạng ở nhánh đấu trường 1v1.',
    },
    pvp_arena_1v1_1750: {
      name: 'Kình Địch Đấu Trường',
      desc: 'Đạt 1750 điểm xếp hạng ở nhánh đấu trường 1v1.',
    },
    pvp_arena_1v1_1900: {
      name: 'Giác Đấu Sĩ',
      desc: 'Đạt 1900 điểm xếp hạng ở nhánh đấu trường 1v1.',
      title: 'Giác Đấu Sĩ',
    },
    pvp_arena_2v2_1600: {
      name: 'Song Kiếm Hợp Bích',
      desc: 'Đạt 1600 điểm xếp hạng ở nhánh đấu trường 2v2.',
    },
    pvp_arena_2v2_1750: {
      name: 'Cặp Đôi Đáng Gờm',
      desc: 'Đạt 1750 điểm xếp hạng ở nhánh đấu trường 2v2.',
    },
    pvp_arena_2v2_1900: {
      name: 'Ăn Ý Tuyệt Đối',
      desc: 'Đạt 1900 điểm xếp hạng ở nhánh đấu trường 2v2.',
    },
    pvp_duel_first_win: { name: 'Ra Ngoài Giải Quyết', desc: 'Thắng một trận đấu tay đôi.' },
    pvp_duel_grace: {
      name: 'Bài Học Khiêm Nhường',
      desc: 'Thua một trận đấu tay đôi mà thể diện vẫn gần như nguyên vẹn.',
    },
    pvp_vcup_first_match: {
      name: 'Đôi Giày Chạm Cỏ',
      desc: 'Chơi trọn vẹn một trận Cúp Thung Lũng tại Sân Heo Nái, dù thắng hay thua.',
    },
    pvp_vcup_first_win: {
      name: 'Chiếc Cúp Đầu Tay',
      desc: 'Thắng một trận Cúp Thung Lũng xếp hạng.',
    },
    pvp_vcup_wins_10: { name: 'Cầu Thủ Dạn Dày', desc: 'Thắng 10 trận Cúp Thung Lũng xếp hạng.' },
    pvp_vcup_wins_25: {
      name: 'Huyền Thoại Bóng Heo Rừng',
      desc: 'Thắng 25 trận Cúp Thung Lũng xếp hạng.',
      title: 'Huyền Thoại Bóng Heo Rừng',
    },
    pvp_vcup_first_goal: {
      name: 'Khai Nòng',
      desc: 'Ghi một bàn thắng trong một trận Cúp Thung Lũng xếp hạng.',
    },
    pvp_vcup_hat_trick: {
      name: 'Người Hùng Hat-trick',
      desc: 'Ghi ba bàn trong cùng một trận Cúp Thung Lũng xếp hạng, ở nhánh 3v3 trở lên.',
    },
    pvp_vcup_golden_goal: {
      name: 'Khoảnh Khắc Vàng',
      desc: 'Ghi bàn thắng vàng định đoạt một trận Cúp Thung Lũng xếp hạng.',
    },
    pvp_vcup_first_save: {
      name: 'Đôi Tay Vững Vàng',
      desc: 'Cản phá một pha bóng trong vai thủ môn ở một trận Cúp Thung Lũng xếp hạng.',
    },
    pvp_vcup_clean_sheet: {
      name: 'Đừng Hòng Qua Được Ta',
      desc: 'Thắng một trận Cúp Thung Lũng xếp hạng trong vai thủ môn mà không để thủng lưới bàn nào.',
    },
    pvp_vcup_guild_win: {
      name: 'Vì Màu Cờ Sắc Áo',
      desc: 'Thắng một trận Cúp Thung Lũng xếp hạng khi ra sân dưới kỳ hiệu bang hội của bạn.',
    },
    pvp_fiesta_first_bout: {
      name: 'Khách Không Mời',
      desc: 'Đấu trọn một trận Fiesta 2v2, dù thắng hay thua.',
    },
    pvp_fiesta_first_win: { name: 'Linh Hồn Của Bữa Tiệc', desc: 'Thắng một trận Fiesta 2v2.' },
    pvp_fiesta_double: {
      name: 'Họa Vô Đơn Chí',
      desc: 'Ghi hai pha hạ gục trong Fiesta chỉ trong bốn giây.',
    },
    pvp_fiesta_shutdown: {
      name: 'Kẻ Phá Đám',
      desc: 'Hạ gục một đối thủ Fiesta đang trên chuỗi ba mạng trở lên.',
    },
    pvp_fiesta_full_build: {
      name: 'Chỉnh Tề Dự Tiệc',
      desc: 'Thắng một trận Fiesta sau khi chốt món tăng cường ở cả ba đợt.',
    },
    pvp_fiesta_powerups: {
      name: 'Mỗi Thứ Một Chút',
      desc: 'Nhặt đủ cả bốn món tăng lực trên võ đài ít nhất một lần: Quỷ Tốc Độ, Người Khổng Lồ, Giày Mặt Trăng và Kẻ Cuồng Chiến.',
    },
    pvp_fiesta_five_kills: {
      name: 'Gánh Cả Bữa Tiệc',
      desc: 'Ghi năm pha hạ gục trong cùng một trận Fiesta.',
    },
    soc_first_party: { name: 'Có Nhau Vẫn Hơn', desc: 'Gia nhập một tổ đội cùng người chơi khác.' },
    soc_full_house: {
      name: 'Kín Đội Hình',
      desc: 'Dọn sạch một hầm ngục với tổ đội đủ năm người.',
    },
    soc_guild_joined: { name: 'Dưới Một Ngọn Cờ', desc: 'Trở thành thành viên của một bang hội.' },
    soc_guild_founded: {
      name: 'Ngòi Bút Khai Hội',
      desc: 'Tự tay sáng lập một bang hội của riêng bạn.',
    },
    soc_first_trade: {
      name: 'Thuận Mua Vừa Bán',
      desc: 'Hoàn tất một giao dịch với người chơi khác.',
    },
    soc_first_sale: {
      name: 'Mở Hàng',
      desc: 'Nhận tiền từ món hàng đầu tiên bạn bán được trên Chợ Thế Giới.',
    },
    soc_steady_custom: {
      name: 'Buôn May Bán Đắt',
      desc: 'Thu về tổng cộng trọn đời 10 vàng từ các món hàng bạn bán trên Chợ Thế Giới.',
    },
    soc_market_magnate: {
      name: 'Trùm Thương Trường',
      desc: 'Thu về tổng cộng trọn đời 100 vàng từ các món hàng bạn bán trên Chợ Thế Giới.',
      title: 'Đại Thương Gia',
    },
    soc_by_ravens_wing: {
      name: 'Theo Cánh Quạ Đen',
      desc: 'Gửi một lá thư qua đường Quạ Thư kèm theo tiền hoặc bưu kiện.',
    },
    soc_room_for_more: {
      name: 'Còn Chỗ Chứa Thêm',
      desc: 'Mua lần mở rộng ngân hàng đầu tiên của bạn.',
    },
    soc_gilded_strongbox: {
      name: 'Két Sắt Mạ Vàng',
      desc: 'Mua hết mọi lần mở rộng ngân hàng mà các thủ quỹ chịu bán cho bạn.',
    },
    soc_meet_bursar: {
      name: 'Niềm Tin Đặt Nơi Fernando',
      desc: 'Đến bái kiến Thủ Quỹ Fernando, người trông coi Két Sắt Mạ Vàng ở Đông Khê.',
    },
    soc_pocket_money: {
      name: 'Tiền Tiêu Vặt',
      desc: 'Nhặt được tổng cộng trọn đời 1 vàng tiền xu.',
    },
    soc_heavy_purse: {
      name: 'Hầu Bao Nặng Trĩu',
      desc: 'Nhặt được tổng cộng trọn đời 10 vàng tiền xu.',
    },
    soc_wyrms_hoard: {
      name: 'Kho Báu Của Rồng',
      desc: 'Nhặt được tổng cộng trọn đời 100 vàng tiền xu.',
    },
    soc_civic_duty: {
      name: 'Nghĩa Vụ Công Dân',
      desc: 'Phân bổ điểm trọng tâm thị trấn đầu tiên của bạn.',
    },
    exp_long_road_north: {
      name: 'Đường Dài Lên Phương Bắc',
      desc: 'Ghé thăm cả ba khu định cư trung tâm: Đông Khê, Cầu Đầm và Vọng Đài Cao.',
    },
    exp_vale_wayfarer: {
      name: 'Lữ Khách Thung Lũng',
      desc: 'Ghé thăm đủ mười một địa danh của Thung Lũng Đông Khê.',
    },
    exp_marsh_wayfarer: {
      name: 'Lữ Khách Đầm Lầy',
      desc: 'Ghé thăm đủ tám địa danh của Đầm Lầy Bùn Sâu.',
    },
    exp_peaks_wayfarer: {
      name: 'Lữ Khách Cao Nguyên',
      desc: 'Ghé thăm đủ mười địa danh của Cao Nguyên Đỉnh Gai.',
    },
    exp_world_traveler: {
      name: 'Kẻ Chu Du Thiên Hạ',
      desc: 'Lập kỳ công lữ khách của cả ba vùng đất.',
      title: 'Lữ Khách',
    },
    exp_something_shiny: {
      name: 'Thứ Gì Đó Lấp Lánh',
      desc: 'Nhặt một vật thể lấp lánh trên mặt đất.',
    },
    exp_first_ore: { name: 'Cuốc Vỡ Đất', desc: 'Thu hoạch mạch quặng đầu tiên của bạn.' },
    exp_first_timber: { name: 'Cây Đổ Đấy!', desc: 'Thu hoạch cụm gỗ đầu tiên của bạn.' },
    exp_first_herb: { name: 'Mát Tay', desc: 'Thu hoạch bụi thảo dược đầu tiên của bạn.' },
    feat_era_cap: {
      name: 'Đứa Con Của Kỷ Nguyên Thứ Nhất',
      desc: 'Đã đạt cấp 20 khi Kỷ Nguyên Thứ Nhất vẫn còn hiện hành.',
    },
    feat_book_complete: {
      name: 'Trọn Vẹn Cả Cuốn Sách',
      desc: 'Lập mọi kỳ công trong Sách Kỳ Công.',
    },
    feat_brightwood_relic: {
      name: 'Ký Ức Rừng Sáng',
      desc: 'Giữ một di vật của Rừng Sáng xưa: Áo Da Gai Góc hoặc Vương Miện Quân Vương.',
    },
    hid_saul_footnote: {
      name: 'Cước Chú Trong Sử Sách',
      desc: 'Đã quấy rầy Sử Quan Saul chín lần liền không ngơi nghỉ.',
      title: 'Cước Chú',
    },
    hid_gilded_tour: {
      name: 'Chuyến Tham Quan Mạ Vàng',
      desc: 'Đã giao dịch với cả ba chi nhánh của Két Sắt Mạ Vàng.',
    },
    hid_fall_death: {
      name: 'Trọng Lực Luôn Thắng',
      desc: 'Đã bỏ mạng vì một cuộc chuyện trò quá dài với mặt đất.',
    },
    hid_keepers_toll_twice: {
      name: 'Người Canh Giữ Thu Phí Hai Lần',
      desc: 'Đã bỏ mạng khi Cái Giá Của Người Canh Giữ vẫn còn đè nặng lên bạn.',
    },
    hid_roll_hundred: {
      name: 'Trăm Điểm Tròn Trĩnh',
      desc: 'Đã đổ ra đúng 100 hoàn hảo với một lệnh /roll thường.',
    },
    hid_yumi_cheer: {
      name: 'Người Hâm Mộ Cuồng Nhiệt Nhất Của Yumi',
      desc: 'Đã cổ vũ cho Yumi ở nơi cô nàng nghe thấy bạn, ngay giữa trận đấu.',
    },
    hid_bountiful_coffer: {
      name: 'Chiếc Rương Tím',
      desc: 'Đã cạy mở một Rương Hậu Hĩnh trước khi nó kịp kẹt khóa.',
    },
    hid_companion_save: {
      name: 'Có Cô Ấy Ở Đây',
      desc: 'Người bạn đồng hành hang sâu của bạn đã kéo một đồng đội gục ngã đứng dậy trở lại.',
    },
    hid_codfather: {
      name: 'Gia Nhập Gia Đình',
      desc: 'Đã lôi được Cá Bố Già lên khỏi Vũng Cạn Đầm Sâu.',
    },
    prog_crown_below: {
      name: 'Vương Miện Dưới Lòng Đất',
      desc: 'Lần theo vương miện từ bãi xương bất an đến lăng mộ của Vua Nythraxis và theo nhiệm vụ Hồi Kết Của Tai Họa đến tận cùng.',
    },
    prog_mere_at_rest: {
      name: 'Mặt Hồ Yên Nghỉ',
      desc: 'Theo cuộc canh giữ của Ondrel Vane đến hồi kết: dàn hợp ca câm lặng, Cuộn Nhợt bị hạ, và Nguyệt Chết Chìm được yên nghỉ.',
    },
    prog_callused_hands: {
      name: 'Đôi Tay Chai Sạn',
      desc: 'Hoàn thành nhiệm vụ Một Nghề Cho Mỗi Bàn Tay và kiếm vết chai đầu tiên trong các nghề của Đông Khê.',
    },
    prog_tools_of_the_trade: {
      name: 'Dụng Cụ Nhà Nghề',
      desc: 'Hoàn thành một lượt chế tác đòi hỏi trạm chế tác tại khu chế tác Vọng Đài Cao.',
    },
    dgn_nythraxis_crypt: {
      name: 'Điều Hầm Mộ Cất Giữ',
      desc: 'Dấn thân vào Hầm Mộ Hoang Phế và thu hồi cả hai nửa đá khóa cùng cuốn nhật ký cổ xưa từ những kẻ canh giữ nơi ấy.',
    },
    chr_marsh_first_cast: {
      name: 'Lươn Trong Lau Sậy',
      desc: 'Câu một con cá từ vùng nước của Đầm Lầy Bùn Sâu.',
    },
  },
  zh_CN: {
    prog_first_steps: { name: '千里之行', desc: '达到2级，在漫漫长路上迈出你的第一步。' },
    prog_finding_your_feet: { name: '站稳脚跟', desc: '达到5级；荒野看上去已经小了一些。' },
    prog_double_digits: { name: '迈入两位数', desc: '达到10级，解锁你的天赋。' },
    prog_the_long_middle: { name: '漫长中途', desc: '达到15级。' },
    prog_level_cap: { name: '会当凌绝顶', desc: '达到20级，也就是等级上限。' },
    prog_well_rested: { name: '养精蓄锐', desc: '在旅店中安顿下来，直到获得休息经验。' },
    prog_talented: { name: '花得其所', desc: '花费你的第一点天赋点。' },
    prog_specialized: { name: '志向已定', desc: '选择一门专精，并习得它的招牌技能。' },
    prog_deep_roots: { name: '根深蒂固', desc: '将一点天赋点投入最后一排的天赋。' },
    prog_full_build: { name: '满打满算', desc: '将全部十一点天赋点投入同一套天赋配置。' },
    prog_veteran: { name: '老兵', desc: '生涯累计获得250,000点经验。', title: '老兵' },
    prog_champion: { name: '冠军', desc: '生涯累计获得500,000点经验。', title: '冠军' },
    prog_paragon: { name: '典范', desc: '生涯累计获得1,000,000点经验。', title: '典范' },
    prog_mythic: { name: '神话', desc: '生涯累计获得2,500,000点经验。', title: '神话' },
    prog_eternal: { name: '永恒', desc: '生涯累计获得5,000,000点经验。', title: '永恒' },
    prog_prestige: { name: '从头再来', desc: '达到等级上限，再次填满经验条，获得转生1阶。' },
    prog_prestige_5: { name: '积习难改', desc: '达到转生5阶。' },
    prog_prestige_10: { name: '永动不息', desc: '达到转生10阶。' },
    prog_first_harvest: { name: '田野的馈赠', desc: '采收你的第一处采集点。' },
    prog_mining_100: { name: '血脉藏矿', desc: '采矿熟练度达到100点。' },
    prog_logging_100: { name: '直取心木', desc: '伐木熟练度达到100点。' },
    prog_herbalism_100: { name: '草甸之主', desc: '草药学熟练度达到100点。' },
    prog_master_gatherer: { name: '采集大师', desc: '采矿、伐木与草药学的熟练度均达到100点。' },
    prog_first_craft: { name: '亲手所制', desc: '完成你的第一次成功制造。' },
    prog_craft_specialist: {
      name: '独门手艺',
      desc: '将任意一门工艺的技能提升至75点，解锁它的专精特长。',
    },
    prog_around_the_ring: { name: '环行百艺', desc: '在五门不同的工艺上各达到25点技能。' },
    cmb_first_blood: { name: '第一滴血', desc: '击败你的第一个敌人。' },
    cmb_slayer: { name: '杀戮者', desc: '击败1,000个敌人。' },
    cmb_legion_of_one: { name: '一人军团', desc: '击败10,000个敌人。' },
    cmb_heavy_hitter: { name: '势大力沉', desc: '累计造成500,000点伤害。' },
    cmb_critical_eye: { name: '致命慧眼', desc: '打出500次致命一击。' },
    cmb_giantslayer: { name: '屠巨者', desc: '对一个至少比你高出五级的敌人打出最后一击。' },
    cmb_first_fall: { name: '掸土再战', desc: '迎来你的第一次死亡；再强的英雄也难免此劫。' },
    dgn_hollow_crypt: { name: '破墓者', desc: '在空洞墓穴中击败唤墓者莫森。' },
    dgn_sunken_bastion: { name: '雾散缚解', desc: '在沉没堡垒中击败缚雾者维尔。' },
    dgn_drowned_temple: { name: '月沉水底', desc: '在溺亡神殿中击败“伊索蕾，溺月化身”。' },
    dgn_gravewyrm_sanctum: { name: '地底之龙', desc: '在墓龙圣所中击败墓龙科祖尔。' },
    dgn_hollow_crypt_heroic: {
      name: '英雄：空洞墓穴',
      desc: '在英雄难度的空洞墓穴中击败唤墓者莫森。',
    },
    dgn_sunken_bastion_heroic: {
      name: '英雄：沉没堡垒',
      desc: '在英雄难度的沉没堡垒中击败缚雾者维尔。',
    },
    dgn_drowned_temple_heroic: {
      name: '英雄：溺亡神殿',
      desc: '在英雄难度的溺亡神殿中击败“伊索蕾，溺月化身”。',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: '英雄：墓龙圣所',
      desc: '在英雄难度的墓龙圣所中击败墓龙科祖尔。',
    },
    dgn_nythraxis: { name: '灾祸不再', desc: '穿过封印的王室之门，击败“尼思拉克西斯，荆峰之灾”。' },
    dgn_nythraxis_heroic: {
      name: '英雄：灾祸不再',
      desc: '在英雄难度下击败“尼思拉克西斯，荆峰之灾”。',
    },
    dgn_thornpeak_rounds: {
      name: '例行巡礼',
      desc: '通关空洞墓穴、沉没堡垒、溺亡神殿与墓龙圣所。',
    },
    dgn_deepward: {
      name: '深境尽守',
      desc: '在英雄难度下征服每一座地下城、团队副本以及两处探秘。',
    },
    dgn_mark_circuit: {
      name: '全线贯通',
      desc: '在同一天内从全部四座英雄难度地下城赢得英雄徽记。',
    },
    dgn_boss_clears_50: { name: '五十重门', desc: '击败50个地下城最终首领。' },
    dgn_morthen_flawless: {
      name: '尸骨无存',
      desc: '在英雄难度下击败唤墓者莫森，全程无一名队友死亡。',
    },
    dgn_morthen_trio: { name: '三人敌墓', desc: '以三名或更少的玩家击败唤墓者莫森。' },
    dgn_olen_arc: {
      name: '侧身避镰',
      desc: '击败骑士指挥官奥伦，且他的收割弧斩从未击中当前目标以外的任何人。',
    },
    dgn_vael_thralls: { name: '绝不为奴', desc: '击败缚雾者维尔时，他召来的溺亡奴仆已尽数被斩。' },
    dgn_ysolei_moonspawn: { name: '月孽尽除', desc: '击败伊索蕾时，她召来的月之孽生已尽数被斩。' },
    dgn_ysolei_flawless: {
      name: '眼中无泪',
      desc: '在英雄难度下击败“伊索蕾，溺月化身”，全程无一名队友死亡。',
    },
    dgn_velkhar_bonewalkers: {
      name: '长眠勿起',
      desc: '击败大死灵法师维尔卡，且所有复生骨行者都在他倒下之前被摧毁。',
    },
    dgn_korzul_flawless: {
      name: '屠龙者',
      desc: '在英雄难度下击败墓龙科祖尔，全程无一名队友死亡。',
      title: '屠龙者',
    },
    dgn_sanctum_speed: {
      name: '圣所竞速',
      desc: '在你的队伍进驻墓龙圣所后的15分钟内击败墓龙科祖尔。',
    },
    dgn_nythraxis_gravebreaker: {
      name: '绝不称臣',
      desc: '击败尼思拉克西斯，且他的碎墓从未击中当前目标以外的任何人。',
    },
    dgn_nythraxis_wardens: {
      name: '护符石守护者',
      desc: '击败尼思拉克西斯，且每一次不死之怒都在落下之前被破除。',
    },
    dgn_nythraxis_deathless: {
      name: '我们才是不死者',
      desc: '在英雄难度下击败“尼思拉克西斯，荆峰之灾”，全程无一名团队成员死亡。',
      title: '不死者',
    },
    cmb_thunzharr: { name: '山岳倾颓', desc: '在风暴岩击倒“桑扎尔，觉醒之峰”。' },
    cmb_thunzharr_unbroken: {
      name: '碎峰者',
      desc: '击倒“桑扎尔，觉醒之峰”，从你的第一击到他的最后一息全程不死。',
      title: '碎峰者',
    },
    cmb_thunzharr_ten: { name: '屠山成习', desc: '将“桑扎尔，觉醒之峰”击倒十次。' },
    dlv_reliquary: { name: '圣物库探路人', desc: '通关坍塌的圣物库。' },
    dlv_reliquary_heroic: { name: '英雄：坍塌的圣物库', desc: '以英雄级通关坍塌的圣物库。' },
    dlv_litany: { name: '噤声连祷', desc: '通关溺亡连祷。' },
    dlv_litany_heroic: { name: '英雄：溺亡连祷', desc: '以英雄级通关溺亡连祷。' },
    dlv_lore_journal: { name: '页边批注', desc: '解锁探秘日志的全部五条记录。' },
    dlv_companion_max: { name: '深处有友', desc: '将一位探秘伙伴培养至最高阶。' },
    dlv_companions_both: {
      name: '双灯同明',
      desc: '将侍僧泰莎与艾达·芦手两位探秘伙伴都培养至最高阶。',
    },
    dlv_clears_50: { name: '五十英寻', desc: '完成 50 次探秘。' },
    dlv_solo_heroic: {
      name: '二人成军',
      desc: '在没有其他玩家的情况下通关一场英雄级探秘，只有你和你的伙伴。',
    },
    dlv_tumbler_premium: {
      name: '锁簧之道，臻于大成',
      desc: '以最高赌注开启一只设有护符封印的圣物库宝箱，仅此一次尝试，完美无误。',
    },
    dlv_rite_flawless: { name: '一字不差', desc: '完成溺亡圣物库仪式，全程没有一处失误。' },
    dlv_varric_ringers: {
      name: '钟声止息',
      desc: '击败执事瓦里克时，他唤起的每一个丧葬鸣钟者都已先行伏诛。',
    },
    dlv_nhalia_bells: {
      name: '止钟人',
      desc: '击败“娜哈莉亚修女，溺亡的圣歌”，且没有任何队员被鸣钟击中。',
      title: '止钟人',
    },
    chr_vale_chapter_i: {
      name: '溪谷编年史·第一章',
      desc: '完成绍尔编年史的第一章：办完东溪的最初差事，摸清溪谷的山川地势，初尝这里的行当滋味。',
    },
    chr_vale_chapter_ii: {
      name: '溪谷编年史·第二章',
      desc: '完成绍尔编年史的第二章：剿平强盗、鱼人与矿坑害虫，在母猪场上赛过一场，并闯过圣物库。',
    },
    chr_vale_chapter_iii: {
      name: '溪谷编年史·全卷',
      desc: '见证溪谷故事的始末：揭穿唤墓者的真面目，涤净空洞墓穴，将溪谷每一个恶名之敌尽数讨灭。',
      title: '溪谷之子',
    },
    chr_vale_gatherer: { name: '靠山吃山', desc: '在东溪谷采集一处矿脉、一片林木与一丛草药。' },
    chr_vale_first_cast: { name: '镜湖有物', desc: '在东溪谷的水域钓起一条鱼。' },
    chr_vale_packbreaker: { name: '破群者', desc: '在 10 秒内斩杀 3 只森林狼。' },
    chr_vale_cup_debut: { name: '铜桶新秀', desc: '在母猪场进行的溪谷杯比赛中登场并触到球。' },
    chr_vale_rares: {
      name: '溪谷群凶',
      desc: '斩杀东溪谷的五大恶名之敌：老灰颚、莫格、隧道之王格里克斯、维尔兰队长与缚魂者玛尔德雷克。',
    },
    chr_marsh_chapter_i: {
      name: '泥沼编年史·第一章',
      desc: '完成奥斯里克·芬恩编年史的第一章：响应芬桥集结令，守住堤道，摸清沼泽的地势轮廓。',
    },
    chr_marsh_chapter_ii: {
      name: '泥沼编年史·第二章',
      desc: '完成奥斯里克·芬恩编年史的第二章：焚净寡妇蛛，安葬溺亡死者，钓起鳕鱼教父，并闯过溺亡连祷。',
    },
    chr_marsh_chapter_iii: {
      name: '泥沼编年史·全卷',
      desc: '见证沼泽故事的始末：捣毁邪教营地，在沉没堡垒中让缚雾者噤声，将雾中每一个恶名之敌尽数讨灭。',
      title: '泥沼之子',
    },
    chr_marsh_gatherer: { name: '芬桥采撷', desc: '在泥沼湿地采集一处矿脉、一片林木与一丛草药。' },
    chr_marsh_unburst: {
      name: '不要站在孢子里',
      desc: '斩杀 8 只沼泽臃肿兽，且从未被它们的腐蚀孢子爆裂波及。',
    },
    chr_marsh_hush_the_mending: {
      name: '让医者噤声',
      desc: '在唤墓者营地中，抢在它照料的任何教徒倒下之前斩杀一名唤墓者医者。',
    },
    chr_marsh_rares: {
      name: '雾中恶名',
      desc: '斩杀泥沼湿地的三大恶名之敌：贪食者泥颚、溺亡者涝牙与娜莉娅修女。',
    },
    chr_peaks_chapter_i: {
      name: '荆峰编年史·第一章',
      desc: '完成赞茜编年史的第一章：肃清山脊道路，扫空地洞，认熟高望镇守的每一条山径。',
    },
    chr_peaks_chapter_ii: {
      name: '荆峰编年史·第二章',
      desc: '完成赞茜编年史的第二章：捣毁德罗格玛战争营地，参透正在苏醒的风暴，站上微光湖泛光之处。',
    },
    chr_peaks_chapter_iii: {
      name: '荆峰编年史·全卷',
      desc: '见证高山故事的始末：击溃龙教，肃清墓龙圣所，扳倒觉醒之峰，将峭壁间每一个恶名之敌尽数讨灭。',
      title: '荆峰之子',
    },
    chr_peaks_sparring: { name: '城墙操练', desc: '对高望上方的训练假人造成总计 1,000 点伤害。' },
    chr_peaks_glimmer_cast: { name: '水冷，光更冷', desc: '在微光湖钓起一条鱼。' },
    chr_peaks_moongate: { name: '穿过冰冷之门', desc: '踏入微光湖岸边的月门。' },
    chr_peaks_waking_witness: {
      name: '行走的高山',
      desc: '亲眼目睹“桑扎尔，觉醒之峰”阔步行于山间。',
    },
    chr_peaks_rares: {
      name: '刻在峭壁上的名字',
      desc: '斩杀荆峰高地的四大恶名之敌：铁脉工头、碎颅者布鲁托克、炽翼沃斯卡与髓王瓦尔卡斯。',
    },
    col_discovery_25: {
      name: '囤积鼠',
      desc: '发现 25 件不同的物品（一件物品在首次归你所有时即被计入）。',
    },
    col_discovery_75: { name: '喜鹊', desc: '发现 75 件不同的物品。' },
    col_discovery_150: { name: '珍奇柜', desc: '发现 150 件不同的物品。', title: '馆长' },
    col_discovery_250: { name: '万物名录', desc: '发现 250 件不同的物品。' },
    col_first_rare: { name: '一抹湛蓝', desc: '获得你的第一件稀有品质物品。' },
    col_first_epic: { name: '紫气东来', desc: '获得你的第一件史诗品质物品。' },
    col_first_legendary: { name: '橙心如意', desc: '获得你的第一件传说品质物品。' },
    col_set_vale_arcanist: { name: '溪谷奥法师装束', desc: '发现溪谷奥法师装束的每一个部件。' },
    col_set_boundstone_vanguard: { name: '缚石先锋', desc: '发现缚石先锋的每一个部件。' },
    col_set_greyjaw_stalker: { name: '灰颚潜猎者行装', desc: '发现灰颚潜猎者行装的每一个部件。' },
    col_set_deathlord: { name: '冢主战装', desc: '发现冢主战装的每一个部件。' },
    col_set_wyrmshadow: { name: '夜牙法衣', desc: '发现夜牙法衣的每一个部件。' },
    col_set_necromancers: { name: '哀织衣装', desc: '发现哀织衣装的每一个部件。' },
    col_set_crownforged: { name: '骨铸装束', desc: '发现骨铸装束的每一个部件。' },
    col_set_nighttalon: { name: '恐牙毛皮', desc: '发现恐牙毛皮的每一个部件。' },
    col_set_soulflame: { name: '魂焰装束', desc: '发现魂焰装束的每一个部件。' },
    col_set_stormcallers: { name: '唤风法衣', desc: '发现唤风法衣的每一个部件。' },
    col_seven_regalia: {
      name: '七重衣橱',
      desc: '发现全部七个史诗护甲系列的每一个部件。',
      title: '辉煌者',
    },
    col_true_colors: { name: '真我本色', desc: '穿着你职业默认之外的任意外观登场。' },
    col_all_slots: { name: '十一分讲究', desc: '让全部十一个装备栏位同时都有装备。' },
    col_quartermaster_buyout: { name: '老主顾', desc: '发现军需官维克斯所售的全部十件货品。' },
    col_glimmerfin: { name: '一线微光', desc: '钓起一条微光鳍锦鲤。' },
    col_full_creel: { name: '满载鱼篓', desc: '发现来自溪谷、湿地与高地水域的全部六种常见渔获。' },
    col_junk_drawer: { name: '杂物抽屉', desc: '发现 10 件不同的粗糙品质物品。' },
    pvp_arena_first_match: { name: '靴中黄沙', desc: '在灰烬竞技场打一场评级赛，任一组别皆可。' },
    pvp_arena_first_win: { name: '满场喝彩', desc: '在任一组别中赢下一场竞技场评级赛。' },
    pvp_arena_1v1_1600: { name: '竞技场挑战者', desc: '在竞技场1v1组别中将评级提升至1600。' },
    pvp_arena_1v1_1750: { name: '竞技场劲敌', desc: '在竞技场1v1组别中将评级提升至1750。' },
    pvp_arena_1v1_1900: {
      name: '角斗士',
      desc: '在竞技场1v1组别中将评级提升至1900。',
      title: '角斗士',
    },
    pvp_arena_2v2_1600: { name: '二人同心', desc: '在竞技场2v2组别中将评级提升至1600。' },
    pvp_arena_2v2_1750: { name: '绝命双煞', desc: '在竞技场2v2组别中将评级提升至1750。' },
    pvp_arena_2v2_1900: { name: '天作之合', desc: '在竞技场2v2组别中将评级提升至1900。' },
    pvp_duel_first_win: { name: '门外了断', desc: '赢得一场决斗。' },
    pvp_duel_grace: { name: '谦逊一课', desc: '输掉一场决斗，体面大致还在。' },
    pvp_vcup_first_match: { name: '踏上赛场', desc: '在母猪场完整打完一场溪谷杯比赛，无论胜负。' },
    pvp_vcup_first_win: { name: '首座奖杯', desc: '赢得一场溪谷杯评级赛。' },
    pvp_vcup_wins_10: { name: '野猪球老手', desc: '赢得10场溪谷杯评级赛。' },
    pvp_vcup_wins_25: { name: '野猪球传奇', desc: '赢得25场溪谷杯评级赛。', title: '野猪球传奇' },
    pvp_vcup_first_goal: { name: '首开纪录', desc: '在溪谷杯评级赛中攻入一球。' },
    pvp_vcup_hat_trick: { name: '帽子戏法', desc: '在3v3或更大组别的单场溪谷杯评级赛中攻入3球。' },
    pvp_vcup_golden_goal: { name: '黄金一刻', desc: '射入决定一场溪谷杯评级赛胜负的金球。' },
    pvp_vcup_first_save: { name: '一双稳手', desc: '在溪谷杯评级赛中担任守门员并完成一次扑救。' },
    pvp_vcup_clean_sheet: {
      name: '此路不通',
      desc: '担任守门员赢下一场溪谷杯评级赛，且一球不失。',
    },
    pvp_vcup_guild_win: {
      name: '为了旗帜',
      desc: '以你所在公会的旗帜出战，赢得一场溪谷杯评级赛。',
    },
    pvp_fiesta_first_bout: { name: '不请自来', desc: '完整打完一场2v2狂欢乱斗，无论胜负。' },
    pvp_fiesta_first_win: { name: '狂欢之魂', desc: '赢得一场2v2狂欢乱斗。' },
    pvp_fiesta_double: { name: '祸不单行', desc: '在4秒内于狂欢乱斗中完成两次击倒。' },
    pvp_fiesta_shutdown: {
      name: '扫兴大师',
      desc: '在狂欢乱斗中击倒一名连续击倒数已达3次或更多的对手。',
    },
    pvp_fiesta_full_build: {
      name: '盛装出席',
      desc: '在全部三波增益中各锁定一项，随后赢下一场狂欢乱斗。',
    },
    pvp_fiesta_powerups: {
      name: '样样来一份',
      desc: '将擂台上的四种强化道具各拾取至少一次：极速恶魔、巨像、月靴与狂战士。',
    },
    pvp_fiesta_five_kills: { name: '全场我来扛', desc: '在单场狂欢乱斗中完成5次击倒。' },
    soc_first_party: { name: '结伴同行', desc: '与另一名玩家组成队伍。' },
    soc_full_house: { name: '满堂彩', desc: '以五人满编队伍通关一座地下城。' },
    soc_guild_joined: { name: '同旗之下', desc: '成为一个公会的成员。' },
    soc_guild_founded: { name: '创立者之笔', desc: '创立一个属于你自己的公会。' },
    soc_first_trade: { name: '公平交易', desc: '与另一名玩家完成一笔交易。' },
    soc_first_sale: { name: '开张大吉', desc: '领取你在世界市场首笔成交的货款。' },
    soc_steady_custom: { name: '细水长流', desc: '从你的世界市场销售中生涯累计收取10金币。' },
    soc_market_magnate: {
      name: '市场巨贾',
      desc: '从你的世界市场销售中生涯累计收取100金币。',
      title: '巨贾',
    },
    soc_by_ravens_wing: { name: '凭鸦之翼', desc: '寄出一封附带钱币或包裹的渡鸦邮件。' },
    soc_room_for_more: { name: '还能再装', desc: '购买你的第一次银行扩容。' },
    soc_gilded_strongbox: { name: '镀金保险箱', desc: '买下司库们愿意卖给你的每一次银行扩容。' },
    soc_meet_bursar: {
      name: '吾信费尔南多',
      desc: '前去拜会司库费尔南多，东溪镀金保险箱的看守人。',
    },
    soc_pocket_money: { name: '零花钱', desc: '生涯累计拾取1金币的钱币。' },
    soc_heavy_purse: { name: '沉甸甸的钱袋', desc: '生涯累计拾取10金币的钱币。' },
    soc_wyrms_hoard: { name: '巨龙的宝藏', desc: '生涯累计拾取100金币的钱币。' },
    soc_civic_duty: { name: '公民义务', desc: '分配你的第一个城镇专注点。' },
    exp_long_road_north: { name: '北上长路', desc: '造访全部三座主城：东溪、芬桥与高望。' },
    exp_vale_wayfarer: { name: '溪谷远行者', desc: '造访东溪谷的全部11处具名之地。' },
    exp_marsh_wayfarer: { name: '湿地远行者', desc: '造访泥沼湿地的全部8处具名之地。' },
    exp_peaks_wayfarer: { name: '高地远行者', desc: '造访荆峰高地的全部10处具名之地。' },
    exp_world_traveler: {
      name: '周游世界',
      desc: '赢得全部三个区域的远行者功绩。',
      title: '远行者',
    },
    exp_something_shiny: { name: '闪光之物', desc: '从地上捡起一件闪闪发光的物品。' },
    exp_first_ore: { name: '凿开大地', desc: '采集你的第一处矿石点。' },
    exp_first_timber: { name: '顺山倒！', desc: '采集你的第一处木材点。' },
    exp_first_herb: { name: '绿手指', desc: '采集你的第一处草药点。' },
    feat_era_cap: { name: '第一纪元之子', desc: '在第一纪元仍为当前纪元时达到20级。' },
    feat_book_complete: { name: '全书功成', desc: '赢得功绩之书中的每一项功绩。' },
    feat_brightwood_relic: {
      name: '铭记明木',
      desc: '保有一件旧日明木的遗物：棘皮皮衣或君主之冠。',
    },
    hid_saul_footnote: {
      name: '历史的注脚',
      desc: '缠了编年史者绍尔9次，中途未曾停歇。',
      title: '注脚',
    },
    hid_gilded_tour: { name: '镀金巡礼', desc: '与镀金保险箱的全部三家分号都做过生意。' },
    hid_fall_death: { name: '重力永胜', desc: '死于与地面的一场漫长对话。' },
    hid_keepers_toll_twice: { name: '看守者二度收账', desc: '在看守者的代价仍压在你身上时死去。' },
    hid_roll_hundred: { name: '天生一百', desc: '在一次普通的 /roll 中掷出完美的100点。' },
    hid_yumi_cheer: { name: '由美的头号粉丝', desc: '在比赛正酣时，于由美听得见的地方为她欢呼。' },
    hid_bountiful_coffer: { name: '紫色宝匣', desc: '赶在丰饶宝匣卡死之前将它撬开。' },
    hid_companion_save: { name: '有她看着呢', desc: '你的探秘伙伴把一名倒下的队友重新拉了起来。' },
    hid_codfather: { name: '加入家族', desc: '将鳕鱼教父从深沼浅滩中拖了上来。' },
    prog_crown_below: {
      name: '地底王冠',
      desc: '追随那顶王冠，从骸骨不宁的荒地一路走到尼思拉克西斯王的陵墓，将“灾祸之终”进行到底。',
    },
    prog_mere_at_rest: {
      name: '湖水安眠',
      desc: '陪守潮者翁德雷尔守望到底：唱诗班归于沉寂，苍盘者授首，溺月安然长眠。',
    },
    prog_callused_hands: {
      name: '磨出老茧',
      desc: '完成“人手一艺”，在东溪的各行手艺中磨出你的第一个老茧。',
    },
    prog_tools_of_the_trade: {
      name: '吃饭的家伙',
      desc: '在高望的制造工坊完成一次需要工作台的制造。',
    },
    dgn_nythraxis_crypt: {
      name: '墓穴深藏之物',
      desc: '闯入废弃墓穴，从其守卫者手中取回墓穴钥石的上下两半与古老日记。',
    },
    chr_marsh_first_cast: { name: '苇丛藏鳗', desc: '在泥沼湿地的水域钓起一条鱼。' },
  },
  zh_TW: {
    prog_first_steps: { name: '最初的腳步', desc: '達到2級，在漫漫長路上踏出你的第一步。' },
    prog_finding_your_feet: { name: '站穩腳步', desc: '達到5級；荒野在你眼中已經小了一些。' },
    prog_double_digits: { name: '邁入兩位數', desc: '達到10級並解鎖你的天賦。' },
    prog_the_long_middle: { name: '漫漫中程', desc: '達到15級。' },
    prog_level_cap: { name: '頂峰風光', desc: '達到20級，也就是等級上限。' },
    prog_well_rested: { name: '充分休息', desc: '在旅店安歇，直到獲得充分休息經驗值。' },
    prog_talented: { name: '用在刀口上', desc: '花費你的第一點天賦點數。' },
    prog_specialized: { name: '志向宣言', desc: '選擇一項專精並習得其招牌技能。' },
    prog_deep_roots: { name: '根深柢固', desc: '將一點天賦點數投入最後一列的天賦。' },
    prog_full_build: { name: '十一點全滿', desc: '將全部十一點天賦點數投入同一套配置。' },
    prog_veteran: { name: '老兵', desc: '生涯累計獲得250,000點經驗值。', title: '老兵' },
    prog_champion: { name: '冠軍', desc: '生涯累計獲得500,000點經驗值。', title: '冠軍' },
    prog_paragon: { name: '典範', desc: '生涯累計獲得1,000,000點經驗值。', title: '典範' },
    prog_mythic: { name: '神話', desc: '生涯累計獲得2,500,000點經驗值。', title: '神話' },
    prog_eternal: { name: '永恆', desc: '生涯累計獲得5,000,000點經驗值。', title: '永恆' },
    prog_prestige: { name: '重新啟程', desc: '達到等級上限，再次填滿經驗條，並取得威望階級1。' },
    prog_prestige_5: { name: '積習難改', desc: '達到威望階級5。' },
    prog_prestige_10: { name: '永動不息', desc: '達到威望階級10。' },
    prog_first_harvest: { name: '田野的果實', desc: '採收你的第一個採集點。' },
    prog_mining_100: { name: '血中礦脈', desc: '採礦熟練度達到100。' },
    prog_logging_100: { name: '心材伐手', desc: '伐木熟練度達到100。' },
    prog_herbalism_100: { name: '百草宗師', desc: '草藥學熟練度達到100。' },
    prog_master_gatherer: { name: '採集大師', desc: '採礦、伐木與草藥學的熟練度皆達到100。' },
    prog_first_craft: { name: '親手打造', desc: '完成你的第一次成功製作。' },
    prog_craft_specialist: { name: '不傳之秘', desc: '任一工藝技能達到75，並解鎖其專精特長。' },
    prog_around_the_ring: { name: '環座巡禮', desc: '五種不同工藝的技能各達到25。' },
    cmb_first_blood: { name: '首開殺戒', desc: '擊敗你的第一個敵人。' },
    cmb_slayer: { name: '殺戮者', desc: '擊敗1,000個敵人。' },
    cmb_legion_of_one: { name: '一人成軍', desc: '擊敗10,000個敵人。' },
    cmb_heavy_hitter: { name: '出手千鈞', desc: '累計造成500,000點傷害。' },
    cmb_critical_eye: { name: '致命之眼', desc: '打出500次致命一擊。' },
    cmb_giantslayer: { name: '屠巨者', desc: '對高出你至少五級的敵人打出最後一擊。' },
    cmb_first_fall: {
      name: '拍拍塵土再出發',
      desc: '迎來你的第一次死亡；再出色的冒險者也難免如此。',
    },
    dgn_hollow_crypt: { name: '破墓者', desc: '在空洞墓穴擊敗喚墓者莫森。' },
    dgn_sunken_bastion: { name: '霧散縛解', desc: '在沉沒堡壘擊敗縛霧者維爾。' },
    dgn_drowned_temple: { name: '溺月終溺', desc: '在溺亡神殿擊敗「伊索蕾，溺月化身」。' },
    dgn_gravewyrm_sanctum: { name: '地底之龍', desc: '在墓龍聖所擊敗墓龍科祖爾。' },
    dgn_hollow_crypt_heroic: {
      name: '英雄：空洞墓穴',
      desc: '以英雄難度在空洞墓穴擊敗喚墓者莫森。',
    },
    dgn_sunken_bastion_heroic: {
      name: '英雄：沉沒堡壘',
      desc: '以英雄難度在沉沒堡壘擊敗縛霧者維爾。',
    },
    dgn_drowned_temple_heroic: {
      name: '英雄：溺亡神殿',
      desc: '以英雄難度在溺亡神殿擊敗「伊索蕾，溺月化身」。',
    },
    dgn_gravewyrm_sanctum_heroic: {
      name: '英雄：墓龍聖所',
      desc: '以英雄難度在墓龍聖所擊敗墓龍科祖爾。',
    },
    dgn_nythraxis: {
      name: '災禍止息',
      desc: '在封印的王室之門後，擊敗「尼思拉克西斯，荊峰之災」。',
    },
    dgn_nythraxis_heroic: {
      name: '英雄：災禍止息',
      desc: '以英雄難度擊敗「尼思拉克西斯，荊峰之災」。',
    },
    dgn_thornpeak_rounds: {
      name: '逐一登門',
      desc: '通關空洞墓穴、沉沒堡壘、溺亡神殿與墓龍聖所。',
    },
    dgn_deepward: { name: '深淵之衛', desc: '以英雄難度征服每一座地城、團隊副本，以及兩座秘探。' },
    dgn_mark_circuit: { name: '全套巡迴', desc: '在同一天內從全部四座英雄地城獲得英雄徽記。' },
    dgn_boss_clears_50: { name: '五十扇門之後', desc: '擊敗50個地城最終首領。' },
    dgn_morthen_flawless: {
      name: '屍骨無存',
      desc: '以英雄難度擊敗喚墓者莫森，且沒有任何隊伍成員死亡。',
    },
    dgn_morthen_trio: { name: '三人抗墓', desc: '以三名或更少的玩家擊敗喚墓者莫森。' },
    dgn_olen_arc: {
      name: '側身避鐮',
      desc: '擊敗騎士指揮官奧倫，且他的收割弧斬從未擊中其當前目標以外的任何人。',
    },
    dgn_vael_thralls: {
      name: '奴僕一個不留',
      desc: '擊敗縛霧者維爾時，他召喚的所有溺亡奴僕都已被斬殺。',
    },
    dgn_ysolei_moonspawn: {
      name: '月之裔一個不剩',
      desc: '擊敗伊索蕾時，她召喚的所有月之裔都已被斬殺。',
    },
    dgn_ysolei_flawless: {
      name: '無淚可流',
      desc: '以英雄難度擊敗「伊索蕾，溺月化身」，且沒有任何隊伍成員死亡。',
    },
    dgn_velkhar_bonewalkers: {
      name: '乖乖入土',
      desc: '擊敗大死靈法師維爾卡，且每一個復生骨行者都在他倒下之前被摧毀。',
    },
    dgn_korzul_flawless: {
      name: '屠龍者',
      desc: '以英雄難度擊敗墓龍科祖爾，且沒有任何隊伍成員死亡。',
      title: '屠龍者',
    },
    dgn_sanctum_speed: {
      name: '聖所衝刺',
      desc: '在你的隊伍進駐墓龍聖所後的15分鐘內擊敗墓龍科祖爾。',
    },
    dgn_nythraxis_gravebreaker: {
      name: '不向王者屈膝',
      desc: '擊敗尼思拉克西斯，且他的「破墓」從未擊中其當前目標以外的任何人。',
    },
    dgn_nythraxis_wardens: {
      name: '護符石的守護者',
      desc: '擊敗尼思拉克西斯，且每一次「不死之怒」都在落下之前被破除。',
    },
    dgn_nythraxis_deathless: {
      name: '不死莫過於此',
      desc: '以英雄難度擊敗「尼思拉克西斯，荊峰之災」，且沒有任何團隊成員死亡。',
      title: '不死者',
    },
    cmb_thunzharr: { name: '山嶽傾頹', desc: '在風暴岩擊倒「桑扎爾，覺醒之峰」。' },
    cmb_thunzharr_unbroken: {
      name: '碎峰者',
      desc: '擊倒「桑扎爾，覺醒之峰」，且從你出手的第一擊到他的最後一口氣，你不曾死亡。',
      title: '碎峰者',
    },
    cmb_thunzharr_ten: { name: '屠山成癖', desc: '擊倒「桑扎爾，覺醒之峰」十次。' },
    dlv_reliquary: { name: '聖物庫行者', desc: '清剿崩塌的聖物庫。' },
    dlv_reliquary_heroic: { name: '英雄：崩塌的聖物庫', desc: '以英雄層級清剿崩塌的聖物庫。' },
    dlv_litany: { name: '止息連禱', desc: '清剿溺亡連禱。' },
    dlv_litany_heroic: { name: '英雄：溺亡連禱', desc: '以英雄層級清剿溺亡連禱。' },
    dlv_lore_journal: { name: '頁邊眉批', desc: '解鎖秘探日誌的全部五則記述。' },
    dlv_companion_max: { name: '深處的摯友', desc: '將一名秘探同伴培養至她的最高階級。' },
    dlv_companions_both: {
      name: '雙燈皆明',
      desc: '將兩名秘探同伴，侍僧泰莎與艾達·蘆手，都培養至最高階級。',
    },
    dlv_clears_50: { name: '五十噚深', desc: '完成 50 次秘探。' },
    dlv_solo_heroic: {
      name: '二人足矣',
      desc: '在沒有其他玩家的情況下清剿一場英雄層級的秘探，只有你和你的同伴。',
    },
    dlv_tumbler_premium: {
      name: '鎖簧之道，臻於化境',
      desc: '在最高賭注下開啟一口設有結界的聖物庫寶箱，僅有的一次嘗試毫無失誤。',
    },
    dlv_rite_flawless: { name: '一字不差', desc: '完成溺亡聖物庫儀式，全程沒有一次失誤。' },
    dlv_varric_ringers: {
      name: '鐘聲止息',
      desc: '擊敗執事瓦瑞克時，他喚起的每一名喪儀鳴鐘者都已被斬殺。',
    },
    dlv_nhalia_bells: {
      name: '止鐘者',
      desc: '擊敗娜哈莉亞修女，溺亡的聖歌，且沒有任何隊伍成員被鳴鐘擊中。',
      title: '止鐘者',
    },
    chr_vale_chapter_i: {
      name: '溪谷編年史，第一章',
      desc: '完成紹爾編年史的第一章：辦妥東溪最初的差事、認識溪谷的地勢，並初嘗當地的百工。',
    },
    chr_vale_chapter_ii: {
      name: '溪谷編年史，第二章',
      desc: '完成紹爾編年史的第二章：剿平強盜、魚人與礦坑害獸，在母豬場出賽，並闖過聖物庫。',
    },
    chr_vale_chapter_iii: {
      name: '溪谷編年史全卷',
      desc: '見證溪谷故事的始末：揭穿喚墓者的真面目、滌淨空洞墓穴，並剷除溪谷每一個有名有姓的惡煞。',
      title: '溪谷之譽',
    },
    chr_vale_gatherer: { name: '靠山吃山', desc: '在東溪谷採集一處礦脈、一處林木與一叢草藥。' },
    chr_vale_first_cast: { name: '鏡湖有物', desc: '在東溪谷的水域釣起一條魚。' },
    chr_vale_packbreaker: { name: '狼群剋星', desc: '在 10 秒內斬殺 3 隻森林狼。' },
    chr_vale_cup_debut: { name: '銅桶新秀', desc: '在母豬場的溪谷盃比賽中上場並觸球。' },
    chr_vale_rares: {
      name: '溪谷惡煞',
      desc: '斬殺東溪谷五個有名有姓的惡煞：老灰顎、莫格、隧道之王葛瑞克斯、維爾蘭隊長與縛魂者瑪爾德雷克。',
    },
    chr_marsh_chapter_i: {
      name: '泥沼編年史，第一章',
      desc: '完成奧斯里克·芬恩編年史的第一章：響應芬橋的集結令、守穩堤道，並摸清沼地的輪廓。',
    },
    chr_marsh_chapter_ii: {
      name: '泥沼編年史，第二章',
      desc: '完成奧斯里克·芬恩編年史的第二章：燒盡寡婦蛛、讓溺亡死者安息、釣起鱈魚教父，並闖過連禱。',
    },
    chr_marsh_chapter_iii: {
      name: '泥沼編年史全卷',
      desc: '見證沼地故事的始末：搗毀邪教營地、在沉沒堡壘讓縛霧者噤聲，並剷除迷霧中每一個有名有姓的惡煞。',
      title: '泥沼之譽',
    },
    chr_marsh_gatherer: { name: '芬橋採拾', desc: '在泥沼濕地採集一處礦脈、一處林木與一叢草藥。' },
    chr_marsh_unburst: {
      name: '別站在孢子裡',
      desc: '斬殺 8 隻沼澤腫脹獸，且不被其腐蝕孢子的爆裂波及。',
    },
    chr_marsh_hush_the_mending: {
      name: '先誅醫者',
      desc: '在喚墓者營地中，趕在一名喚墓者醫者所照料的任何教徒倒下之前，先將這名醫者斬殺。',
    },
    chr_marsh_rares: {
      name: '霧中之名',
      desc: '斬殺泥沼濕地三個有名有姓的惡煞：貪食者泥顎、溺亡者澇牙與娜莉亞修女。',
    },
    chr_peaks_chapter_i: {
      name: '荊峰編年史，第一章',
      desc: '完成贊西編年史的第一章：肅清山脊道路、掃空地穴，並認熟高望所守望的每一條路徑。',
    },
    chr_peaks_chapter_ii: {
      name: '荊峰編年史，第二章',
      desc: '完成贊西編年史的第二章：攻破德羅格瑪的戰爭營地、看懂正在甦醒的風暴，並站上微光湖生輝之地。',
    },
    chr_peaks_chapter_iii: {
      name: '荊峰編年史全卷',
      desc: '見證山嶽故事的始末：擊潰龍教、讓聖所歸於沉寂、擊倒覺醒之峰，並剷除峭壁間每一個有名有姓的惡煞。',
      title: '荊峰之譽',
    },
    chr_peaks_sparring: { name: '城牆操練', desc: '對高望上方的訓練假人造成總計 1,000 點傷害。' },
    chr_peaks_glimmer_cast: { name: '水寒，光更寒', desc: '在微光湖釣起一條魚。' },
    chr_peaks_moongate: { name: '穿過寒門', desc: '穿過微光湖畔的月門。' },
    chr_peaks_waking_witness: {
      name: '行走的山嶽',
      desc: '親眼目睹桑扎爾，覺醒之峰跨行山間的身影。',
    },
    chr_peaks_rares: {
      name: '刻在峭壁上的名字',
      desc: '斬殺荊峰高地四個有名有姓的惡煞：鐵脈工頭、碎顱者布魯托克、熾翼沃斯卡與髓王瓦爾卡斯。',
    },
    col_discovery_25: {
      name: '囤積鼠',
      desc: '發現 25 種不同的物品（每件物品在首次歸你所有時計入）。',
    },
    col_discovery_75: { name: '喜鵲', desc: '發現 75 種不同的物品。' },
    col_discovery_150: { name: '珍奇櫃', desc: '發現 150 種不同的物品。', title: '館長' },
    col_discovery_250: { name: '萬物總錄', desc: '發現 250 種不同的物品。' },
    col_first_rare: { name: '一抹湛藍', desc: '獲得你的第一件稀有品質物品。' },
    col_first_epic: { name: '紫氣東來', desc: '獲得你的第一件史詩品質物品。' },
    col_first_legendary: { name: '橙心如意', desc: '獲得你的第一件傳說品質物品。' },
    col_set_vale_arcanist: { name: '溪谷秘法師華服', desc: '發現溪谷秘法師華服的每一個部件。' },
    col_set_boundstone_vanguard: { name: '縛石先鋒', desc: '發現縛石先鋒的每一個部件。' },
    col_set_greyjaw_stalker: { name: '灰顎潛獵者裝束', desc: '發現灰顎潛獵者裝束的每一個部件。' },
    col_set_deathlord: { name: '塚陵領主戰裝', desc: '發現塚陵領主戰裝的每一個部件。' },
    col_set_wyrmshadow: { name: '夜牙法衣', desc: '發現夜牙法衣的每一個部件。' },
    col_set_necromancers: { name: '哀織衣裝', desc: '發現哀織衣裝的每一個部件。' },
    col_set_crownforged: { name: '骨鑄華服', desc: '發現骨鑄華服的每一個部件。' },
    col_set_nighttalon: { name: '厲牙毛皮', desc: '發現厲牙毛皮的每一個部件。' },
    col_set_soulflame: { name: '怨焰華服', desc: '發現怨焰華服的每一個部件。' },
    col_set_stormcallers: { name: '喚風法衣', desc: '發現喚風法衣的每一個部件。' },
    col_seven_regalia: {
      name: '七重華櫥',
      desc: '發現全部七個史詩護甲系列的每一個部件。',
      title: '絢爛者',
    },
    col_true_colors: { name: '本色登場', desc: '穿上職業預設以外的任一外觀上場。' },
    col_all_slots: { name: '十一分體面', desc: '同時在全部十一個裝備欄位裝上物品。' },
    col_quartermaster_buyout: { name: '老主顧', desc: '發現軍需官維克斯所販售的全部十件貨品。' },
    col_glimmerfin: { name: '一線微光', desc: '釣起一條微光鰭錦鯉。' },
    col_full_creel: { name: '滿簍而歸', desc: '發現溪谷、沼澤與高地水域的全部六種常見漁獲。' },
    col_junk_drawer: { name: '雜物抽屜', desc: '發現 10 種不同的粗糙品質物品。' },
    pvp_arena_first_match: { name: '靴中之沙', desc: '在灰燼競技場打一場積分賽，任一組別皆可。' },
    pvp_arena_first_win: { name: '歡聲雷動', desc: '在任一組別贏得一場競技場積分賽。' },
    pvp_arena_1v1_1600: { name: '競技場挑戰者', desc: '在 1v1 競技場組別達到 1600 積分。' },
    pvp_arena_1v1_1750: { name: '競技場勁敵', desc: '在 1v1 競技場組別達到 1750 積分。' },
    pvp_arena_1v1_1900: {
      name: '劍鬥士',
      desc: '在 1v1 競技場組別達到 1900 積分。',
      title: '劍鬥士',
    },
    pvp_arena_2v2_1600: { name: '二人成軍', desc: '在 2v2 競技場組別達到 1600 積分。' },
    pvp_arena_2v2_1750: { name: '悍勇雙煞', desc: '在 2v2 競技場組別達到 1750 積分。' },
    pvp_arena_2v2_1900: { name: '天作之合', desc: '在 2v2 競技場組別達到 1900 積分。' },
    pvp_duel_first_win: { name: '到外頭解決', desc: '贏得一場決鬥。' },
    pvp_duel_grace: { name: '謙遜的一課', desc: '輸掉一場決鬥，尊嚴大致無損。' },
    pvp_vcup_first_match: { name: '踏上球場', desc: '在母豬場完整打完一場溪谷盃比賽，無論勝負。' },
    pvp_vcup_first_win: { name: '首座獎盃', desc: '贏得一場溪谷盃積分賽。' },
    pvp_vcup_wins_10: { name: '野豬球老手', desc: '贏得 10 場溪谷盃積分賽。' },
    pvp_vcup_wins_25: { name: '野豬球傳奇', desc: '贏得 25 場溪谷盃積分賽。', title: '野豬球傳奇' },
    pvp_vcup_first_goal: { name: '首開紀錄', desc: '在溪谷盃積分賽中射進一球。' },
    pvp_vcup_hat_trick: {
      name: '帽子戲法英雄',
      desc: '在單場溪谷盃積分賽中射進三球（限 3v3 或更大的組別）。',
    },
    pvp_vcup_golden_goal: { name: '黃金時刻', desc: '射進決定一場溪谷盃積分賽勝負的黃金一球。' },
    pvp_vcup_first_save: { name: '穩健雙手', desc: '在溪谷盃積分賽中以守門員身分完成一次撲救。' },
    pvp_vcup_clean_sheet: {
      name: '一夫當關',
      desc: '以守門員身分贏得一場溪谷盃積分賽，且未失一球。',
    },
    pvp_vcup_guild_win: {
      name: '為了旗幟',
      desc: '以你公會的旗幟名義出賽，並贏得一場溪谷盃積分賽。',
    },
    pvp_fiesta_first_bout: { name: '不請自來', desc: '完整打完一場 2v2 嘉年華對決，無論勝負。' },
    pvp_fiesta_first_win: { name: '嘉年華的靈魂人物', desc: '贏得一場 2v2 嘉年華對決。' },
    pvp_fiesta_double: { name: '雙重打擊', desc: '在四秒內完成兩次嘉年華擊倒。' },
    pvp_fiesta_shutdown: { name: '掃興鬼', desc: '擊倒一名連續擊倒數達三次或以上的嘉年華對手。' },
    pvp_fiesta_full_build: {
      name: '盛裝赴會',
      desc: '在三波強化各鎖定一項的情況下，贏得一場嘉年華對決。',
    },
    pvp_fiesta_powerups: {
      name: '樣樣來一份',
      desc: '把四種擂台強化道具各拾取至少一次：速度惡魔、巨像、月亮靴與狂戰士。',
    },
    pvp_fiesta_five_kills: { name: '全場我來扛', desc: '在單場嘉年華對決中完成五次擊倒。' },
    soc_first_party: { name: '結伴同行', desc: '與另一名玩家組成隊伍。' },
    soc_full_house: { name: '五人滿座', desc: '以五人滿編隊伍通關一座地城。' },
    soc_guild_joined: { name: '同旗之下', desc: '成為公會的一員。' },
    soc_guild_founded: { name: '創會者之筆', desc: '創立一個屬於你自己的公會。' },
    soc_first_trade: { name: '公平交易', desc: '與另一名玩家完成一筆交易。' },
    soc_first_sale: { name: '開張大吉', desc: '領取你在世界市場首筆成交的貨款。' },
    soc_steady_custom: { name: '細水長流', desc: '從你的世界市場銷售累計領取 10 金幣。' },
    soc_market_magnate: {
      name: '市場巨賈',
      desc: '從你的世界市場銷售累計領取 100 金幣。',
      title: '巨賈',
    },
    soc_by_ravens_wing: { name: '鴉翼傳書', desc: '寄出一封附有錢幣或包裹的鴉郵信件。' },
    soc_room_for_more: { name: '還裝得下', desc: '購買你的第一項銀行擴充。' },
    soc_gilded_strongbox: { name: '鍍金保險箱', desc: '買下司庫們願意賣給你的每一項銀行擴充。' },
    soc_meet_bursar: {
      name: '信託費爾南多',
      desc: '向司庫費爾南多致意：他是東溪鍍金保險箱的看守人。',
    },
    soc_pocket_money: { name: '零用錢', desc: '累計拾取 1 金幣的錢幣。' },
    soc_heavy_purse: { name: '沉甸甸的錢袋', desc: '累計拾取 10 金幣的錢幣。' },
    soc_wyrms_hoard: { name: '巨龍的寶藏', desc: '累計拾取 100 金幣的錢幣。' },
    soc_civic_duty: { name: '公民義務', desc: '分配你的第一點城鎮發展點數。' },
    exp_long_road_north: { name: '北上長路', desc: '造訪全部三座主城：東溪、芬橋與高望。' },
    exp_vale_wayfarer: { name: '溪谷遠行者', desc: '造訪東溪谷全部十一處具名地點。' },
    exp_marsh_wayfarer: { name: '濕地遠行者', desc: '造訪泥沼濕地全部八處具名地點。' },
    exp_peaks_wayfarer: { name: '高地遠行者', desc: '造訪荊峰高地全部十處具名地點。' },
    exp_world_traveler: {
      name: '行遍天下',
      desc: '贏得全部三個區域的遠行者功績。',
      title: '遠行者',
    },
    exp_something_shiny: { name: '閃亮的小東西', desc: '從地上撿起一件閃閃發亮的物品。' },
    exp_first_ore: { name: '開鑿大地', desc: '採集你的第一處礦石採集點。' },
    exp_first_timber: { name: '樹倒啦！', desc: '採集你的第一處木材採集點。' },
    exp_first_herb: { name: '綠手指', desc: '採集你的第一處草藥採集點。' },
    feat_era_cap: { name: '第一紀元之子', desc: '於第一紀元尚為當世紀元時達到 20 級。' },
    feat_book_complete: { name: '全書在握', desc: '贏得功績之書中的每一項功績。' },
    feat_brightwood_relic: {
      name: '猶記明木',
      desc: '保有一件昔日明木林地的遺物：棘皮皮衣或君主之冠。',
    },
    hid_saul_footnote: {
      name: '歷史的註腳',
      desc: '不停歇地糾纏了編年史者紹爾九次。',
      title: '註腳',
    },
    hid_gilded_tour: { name: '鍍金巡禮', desc: '與鍍金保險箱的全部三家分號都做過生意。' },
    hid_fall_death: { name: '重力不敗', desc: '死於與地面的一番長談。' },
    hid_keepers_toll_twice: { name: '守護者二度收帳', desc: '在「守護者的代價」仍纏身時死去。' },
    hid_roll_hundred: { name: '天賜滿百', desc: '在一次普通的 /roll 中擲出完美的 100。' },
    hid_yumi_cheer: {
      name: '由美的頭號粉絲',
      desc: '在比賽進行中，於由美聽得見你的地方為她歡呼。',
    },
    hid_bountiful_coffer: { name: '紫色寶匣', desc: '在豐饒寶匣卡死之前將它撬開。' },
    hid_companion_save: { name: '有她看著呢', desc: '你的秘探同伴把一名倒下的隊友重新拉了起來。' },
    hid_codfather: { name: '入了家族', desc: '把鱈魚教父從深沼淺灘中拖上岸。' },
    prog_crown_below: {
      name: '地底之冠',
      desc: '追隨王冠的蹤跡，從不寧的骸骨之地直至尼思拉克西斯王的陵墓，將「災禍之終」進行到底。',
    },
    prog_mere_at_rest: {
      name: '安息之湖',
      desc: '陪伴守潮者翁德瑞爾·韋恩守望到最後：唱詩班已被噤聲，蒼盤者已被斬殺，溺月終獲安息。',
    },
    prog_callused_hands: {
      name: '雙手成繭',
      desc: '完成「人人有手藝」，在東溪的百工行當中磨出你的第一個厚繭。',
    },
    prog_tools_of_the_trade: {
      name: '吃飯的傢伙',
      desc: '在高望的工藝樞紐完成一次需要工作臺的製作。',
    },
    dgn_nythraxis_crypt: {
      name: '墓穴深藏之物',
      desc: '勇闖廢棄墓穴，從其守衛手中奪回墓穴鑰石的上下兩半與古老日記。',
    },
    chr_marsh_first_cast: { name: '蘆葦間有鰻', desc: '在泥沼濕地的水域釣起一條魚。' },
  },
};

// Dialect desc overrides layered over the aliased base table in deed_i18n.ts:
// the two dialects render the delve feature with their own established noun
// (fr_CA excavation, es_ES Profundidad, both locked by their shipped delveUi
// strings), so the deed descs naming that feature diverge with them. Only the
// diverging entries appear here; everything else inherits the base table.
export const DEED_LOCALE_DIALECT_OVERRIDES: Record<'es_ES' | 'fr_CA', DeedLocaleTable> = {
  es_ES: {
    dgn_deepward: {
      name: 'Guarda de las Profundidades',
      desc: 'Conquista cada mazmorra, la banda y las dos Profundidades en dificultad heroica.',
    },
    dlv_lore_journal: {
      name: 'Notas al margen',
      desc: 'Desbloquea las cinco entradas del diario de Profundidad.',
    },
    dlv_companion_max: {
      name: 'Una amiga en las profundidades',
      desc: 'Lleva a una compañera de Profundidad a su rango más alto.',
    },
    dlv_companions_both: {
      name: 'Ambas linternas encendidas',
      desc: 'Lleva a las dos compañeras de Profundidad, la Acólita Tessa y Edda Reedhand, a su rango más alto.',
    },
    dlv_clears_50: { name: 'Cincuenta brazas', desc: 'Completa 50 Profundidades.' },
    dlv_solo_heroic: {
      name: 'Dos son multitud',
      desc: 'Limpia una Profundidad de nivel Heroico sin ningún otro jugador: solo tú y tu compañera.',
    },
    hid_companion_save: {
      name: 'No mientras ella vigile',
      desc: 'Tu compañera de Profundidad puso de nuevo en pie a un aliado caído.',
    },
  },
  fr_CA: {
    dgn_deepward: {
      name: 'Gardien des profondeurs',
      desc: 'Triomphez de chaque donjon, du raid et des deux excavations en difficulté héroïque.',
    },
    dlv_lore_journal: {
      name: 'Marginalia',
      desc: "Débloquer les cinq entrées du journal d'excavation.",
    },
    dlv_companion_max: {
      name: 'Une amie des profondeurs',
      desc: "Hisser une compagne d'excavation à son rang le plus élevé.",
    },
    dlv_clears_50: { name: 'Cinquante brasses', desc: 'Terminer 50 excavations.' },
  },
};
