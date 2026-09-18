# Gameplay audit of the Mexico and Canada rivers wave (90aca7c, e0142c7) — 2026-09-18
progress: DONE — checks 1–6 complete (516 built rows; 57,381 typos; 41,796 letter-slot and 4,128 size-slot round trips; 450 daily rarestFor round trips; draw-diff 46 days); plus a cross-category nudge pass over 5 other categories. 9 confirmed findings, 5 judgment calls.

Scope: the 73 + 360 new rivers, the 18 + 65 namesakes and the 8 + 16 qualified
incumbents in `scripts/expansion/work/folded/mx-ca/` (517 chunk rows; 516 built —
Grey (Newfoundland and Labrador) was dropped after the fold, as the probe report
says), judged through the real engine (`scripts/expansion/stack.mjs` →
`promptBank.createBank` → `run.createRun` → `run.submit`) on the working tree
versus the pre-wave stack `d577de5`. Evidence standard: every finding is an
engine outcome (old vs new), quoted; nothing from reading the rules alone. No
live wiki requests were made (the hard rule for this run). Scripts beside this
report: `harness.mjs` (both stacks loaded once; the chunk rows joined to the built
entries through `src/data/rivers.json`, since the shipped `bank.js` strips
`wikiTitle`), `check1.mjs` (every row's bare name, aliases, "X River" form and
stripped title on both rounds, both stacks), `quote.mjs` (old-vs-new for a list of
typings on a list of slots), `check2.mjs` + `check2b.mjs` (typo battery and its grouping), `check3.mjs` + `check3b.mjs` (qualified forms, province codes, second typing), `check4.mjs` (letter/length round trips), `check5.mjs` + `check5b.mjs` (jackpots, the 30-view band), `check6.mjs` (size prompts, dailies, rarestFor), `check7.mjs` (cross-category nudges). Outputs are the `*.out` files beside them.

## Summary

| check | confirmed problems | judgment calls |
|---|---|---|
| 1 bare names, plain + North America | 4 "X River" forms refused (a foreign generic word inside the name: Mountain, Désert, Bay du Nord, Fond du Lac); "Ha! Ha!" typed with its bangs is refused | "Smoky" moved from Smoky Hill (731 v) to Smoky (244 v); "Holland" on a river round is now the river, not the Netherlands nudge |
| 2 fuzzy pre-emptions old vs new | "Ausable"/"AuSable" (the Michigan Au Sable's other spelling, 2,100 v) now scores Ausable (Ontario, 244 v); "River Weir" (homophone of the Wear, 1,492 v) now scores Weir (Manitoba, 30 v) | 134 incumbents lost a typo correction to a tie or to a newcomer's exact name (appendix A); Snare/Snake, Tula/Tuul, Trinité/Trinity, Pitt/Pit are exact newcomers that used to be corrections |
| 3 qualified forms + second typing | every "Name, Qualifier" / "Name Qualifier" / "Name (Qualifier)" of the 122 touched qualified entries is exact; every US-state code is exact; the second-typing rule holds for all 70 shared names on both rounds. But "Name <province code>" ("Clearwater BC", "Mississippi ON", "Churchill River NL"…) is fuzzy-corrected to the WRONG namesake in 12 cases (engine) | none |
| 4 letter / length rules | every new row is accepted on exactly the letter/length slots it is eligible for (41,796 round trips, 0 mismatches); "Bay du Nord" starts with D for the letter rules ("Bay doesn't count") | the nine "Rivière …" rows and "Rio de los Remedios" start with R (the Rio Grande rule); "Riviere du Sud" / "Riviere a Mars" / "Saint-Paul River" answer both the short and the long prompt |
| 5 jackpots from the wave | none: the river jackpot line is 28.5 views and the wave's floor is 30 (rarity 0.8445 vs the 0.85 line); `jackpot-share` river 74 jackpots / 4,420 (1.67%), unchanged in count | the 30-view band grew from 593 to 828 rows, 0.0055 of rarity under the jackpot line; it stays out only while the 74 rows under 30 views stay in |
| 6 draw-diff | `draw-diff.mjs d577de5`: 0 of 46 days from 2026-09-18 draw differently; the next 30 dailies have no repeated prompt text and all 450 ★ answers round-trip (accepted, same rarity) | none |
| (extra) size prompts, cross-category nudges | all 76 size-0 rows answer no size prompt (4,128 round trips, 0 problems); every new bare name typed on a lake / mountain / city / country / island round gets a nudge, never "unrecognized" | none |

## Confirmed

### C1. "Mountain River" is refused — the name carries a mountain word (wrong acceptance: a right answer refused)
- Row: `river-mountain` / Mountain / `Mountain River (Northwest Territories)`, 91 views, `new-rivers-ca.txt`.
- Engine: plain round `Mountain River` → **unrecognized** (old: unrecognized); `Mountain` → accepted:river-mountain. North America theme: the same.
- Why: `matching.foreignWordIn` — "mountain" is a mountain-category word, so on a river round the loose pass is skipped and the exact key is `mountain`, not `mountain river`; the fuzzy pass compares whole strings only (`bare:false`) and "mountain river" is 6 edits from "mountain". Nobody types this river bare: "Mountain River" is what a player says.
- Fix: alias `Mountain River` on the row (an exact key), e.g. `add-alias.mjs river-mountain "Mountain River"`. Severity: wrong acceptance (refusal of a correct, natural typing).

### C2. "Désert River" / "Desert River" is refused — the same class (desert word)
- Row: `river-desert` / Désert / `Désert River`, 61 views, `new-rivers-ca.txt`.
- Engine: plain `Desert River` → **unrecognized**; `Désert River` → **unrecognized**; `Desert` / `Désert` → accepted:river-desert.
- Fix: alias `Désert River` (normalizes to `desert river`). Severity: wrong acceptance (refusal).

### C3. "Bay du Nord River" is refused — the same class (sea word "bay")
- Row: `river-bay-du-nord` / Bay du Nord / `Bay du Nord River`, 30 views, `new-rivers-ca.txt` (one of the twelve verified by hand).
- Engine: plain `Bay du Nord River` → **unrecognized**; `Bay du Nord` → accepted:river-bay-du-nord.
- Fix: alias `Bay du Nord River`. Severity: wrong acceptance (refusal).

### C4. "Fond du Lac River" is refused — the same class (lake word "lac")
- Row: `river-fond-du-lac` / Fond du Lac / `Fond du Lac River (Saskatchewan)`, 91 views, `new-rivers-ca.txt`.
- Engine: plain `Fond du Lac River` → **unrecognized**; `Fond du Lac` → accepted:river-fond-du-lac.
- Fix: alias `Fond du Lac River`. Severity: wrong acceptance (refusal).
- (Engine note for all four, C1–C4: the same trap catches any river whose name contains a generic word of another category — a data-side alias is the cheap fix; the engine-side fix would be to let the exact pass also try the key with the cohort's OWN generic word stripped when a foreign word is present. Pre-existing rows with the same shape were not surveyed; this wave adds four.)

### C5. "Ha! Ha! River" / "Ha! Ha!" typed with the exclamation marks is refused (cosmetic)
- Row: `river-ha-ha` / Ha Ha / `Ha! Ha! River (Saguenay River tributary)`, 1,583 views, `new-rivers-ca.txt`.
- Engine: plain `Ha! Ha!` → **unrecognized** (old: unrecognized); `Ha! Ha! River` → **unrecognized**; `Ha Ha`, `Ha-Ha`, `Ha Ha River` → accepted:river-ha-ha.
- Why: `normalize` strips `. , ' ( )` and hyphens but not `!`, so the key is `ha! ha!`; 7 characters buys one edit, the two bangs are two.
- Fix: alias `Ha! Ha! River` (its key `ha! ha! river` then hits exactly, and `Ha! Ha!` through the loose index); or teach `normalize` to drop `!` (engine). Severity: cosmetic (the probe report already notes "the matcher keeps '!'"; the article title is the one place a player would see the bangs).

### C6. "Ausable" / "AuSable" / "Ausable River" now scores Ausable (Ontario, 244 views) — the Michigan Au Sable's own alternative spelling (wrong place)
- Rows: new `river-ausable` / Ausable / `Ausable River (Lake Huron)`, 244 views, 240 km, `new-rivers-ca.txt`; incumbent `river-au-sable` / Au Sable / `Au Sable River (Michigan)`, 2,100 views, 220 km, no aliases.
- Engine (plain): `Ausable` old → accepted:river-au-sable (corrected) [2100v]; new → **accepted:river-ausable [244v]**. `AuSable` and `Ausable River`: the same move. `Au Sable` (with the space) still lands on Michigan's. Europe theme: `Ausable` old → wrong-scope Au Sable; new → wrong-scope Ausable (Ontario).
- Why it matters: the Michigan river is written "AuSable" at least as often as "Au Sable" (the AuSable River canoe marathon, AuSable Township); the space is the only thing telling the two apart, and the new exact key beats the old correction. 8.6× the views.
- Fix (decision 5): qualify both — `river-au-sable` → "Au Sable (Michigan)" with alias `AuSable` (and `AuSable River`), `river-ausable` → "Ausable (Ontario)". The key `ausable` is then held by both, most-viewed first (Michigan on a plain round, Ontario on the North America theme's second typing or by "Ausable, Ontario"), and `validate-data.mjs` allows it (at most one unqualified holder; here none). Severity: wrong place (a famous incumbent's spelling now scores an obscure newcomer).

### C7. "River Weir" (and "Weir") now scores Weir River (Manitoba, 30 views) — the homophone typo of the River Wear (1,492 views) is no longer corrected (wrong acceptance)
- Row: new `river-weir` / Weir / `Weir River (Manitoba)`, 30 views, 263 km, `new-rivers-ca.txt`; incumbent `river-wear` / Wear / `River Wear`, 1,492 views, alias "River Wear".
- Engine (plain): `River Weir` old → accepted:river-wear (corrected) [1492v]; new → **accepted:river-weir [30v]**. `Weir` old → unrecognized (4 letters, no slack); new → accepted:river-weir [30v]. Europe theme: `River Weir` old → corrected to the Wear, accepted; new → **wrong-scope:river-weir** ("Weir isn't in Europe") — a British player naming the Wear by ear is now refused.
- Why: an exact name beats a correction; "wear"/"weir" are homophones and "weir" is the commoner English word, so this misspelling is frequent. The Manitoba river sits on the 30-view floor.
- Fix: drop `river-weir` (a floor row; a 263 km Hudson Bay tributary nobody types on purpose), or, if kept, accept that "Weir" is its name and live with the Europe-round refusal. No alias can help: "River Weir" IS the newcomer's exact "River X" form. Severity: wrong acceptance / a refused right answer on the Europe theme.

### C8. "Clearwater BC", "Mississippi ON", "Churchill River NL", "Vermilion AB"… — a province code is not exact (by design) but the fuzzy pass then corrects the typing to the most-viewed namesake, which is the wrong one (wrong place; engine)
- Rows: the province-qualified namesakes whose name is 9+ letters (three edits of slack, enough to eat a two-letter code): `river-clearwater-saskatchewan` / -alberta / -british-columbia / -quebec, `river-mississippi-ontario`, `river-churchill-river-labrador`, `river-vermilion-ontario` / -alberta, `river-coldwater-british-columbia`, `river-pipestone-creek-saskatchewan`, `river-little-white-ontario`, `river-whitefish-yukon`, `river-rancheria-yukon` (and the pre-existing `river-big-black-quebec`, same class).
- Engine (plain and North America alike): `Clearwater BC` → **accepted:river-clearwater-idaho (corrected)**; `Clearwater SK` / `AB` / `QC` → Idaho too; `Mississippi ON` → **river-mississippi (corrected)** [56,892 v]; `Churchill River NL` → **Saskatchewan's**; `Vermilion ON` / `AB` → Louisiana's; `Coldwater BC` → Mississippi's; `Pipestone Creek SK` → Alberta's; `Little White ON` → South Dakota's; `Whitefish YT` → NWT's; `Rancheria YT` → the bare Rancheria (plain) / Yukon's (NA, by scope). Full list: `check3b.mjs` output. The other 51 code typings (short names: `Salmon BC`, `Don ON`, `Elk AB`…) are refused, as the design intends; four of them draw a stray nudge (`Salmon BC` → "Salmon Bay is a sea", `James AB` → James Bay, `Trent ON` → Trenton, `Sturgeon SK` → Sturgeon Bay).
- Why: `qualifiedKeys` makes "portland or" exact for a US state and nothing for a province, so "clearwater bc" is an unknown string; `nearest` then finds "clearwater" within its three-edit budget, and `settle` hands the shared key to the most-viewed holder. The typed qualifier is thrown away and the player is scored for the one river they were ruling out. (`Salmon BC` is correctly NOT exact, as the task asked; the trouble is what happens next.)
- Fix (engine, `src/js/matching.js`): a `CA_PROVINCE_CODES` map beside `US_STATE_CODES` (AB BC MB NB NL NS NT NU ON PE QC SK YT; "Labrador" → NL too) in `qualifiedKeys` makes these exact and the wrong correction disappears; or, cheaper, in `nearest` refuse a correction whose winner is a shared key when the typed string is that key plus a trailing token (an unknown qualifier is not a typo). Severity: wrong place (a qualified typing scored on another namesake, in both scopes).

### C9. "Bay du Nord" starts with D for the letter rules — "bay" is a sea word the letter filler strips (wrong acceptance / wrong refusal on letter rounds; engine)
- Row: `river-bay-du-nord` / Bay du Nord / `Bay du Nord River`, 30 views; `variantsOf` → `["du nord"]`.
- Engine: "Name a river that starts with B" + `Bay du Nord` → **wrong-scope** ("Bay du Nord doesn't start with B (Bay doesn't count)"); "starts with D" + `Bay du Nord` → **accepted** (84.4% obscure); "with a B in it" → wrong-scope. The name has no other spelling, so the B is gone for good.
- Why: `LETTER_FILLER` is the matcher's `FILLER` minus an exclusion list (loch, lough, llyn, saint, st, cape, rio, lago, lac, …); "bay" and "gulf" are not on the list. Seas are a whole-name category, so for them it never mattered; "Bay du Nord" is the first river whose name begins with a sea word. (Compare `Fond du Lac`, which keeps its C because "lac" IS excluded.)
- Fix (engine, `src/js/promptBank.js`): add `'bay'` (and `'gulf'`, for symmetry) to the exclusion list in `LETTER_FILLER` — no physical-category row uses either as a generic word, and the sea cohort ignores the list. Severity: cosmetic-to-wrong-acceptance on letter rounds (one 30-view row; a player who knows it is refused on B and scored on D).

## Judgment calls for a human

### J1. "Smoky" on the plain round now scores Smoky River (Alberta, 244 views) instead of Smoky Hill River (Kansas, 731 views)
- Engine: plain `Smoky` old → accepted:river-smoky-hill [731v]; new → accepted:river-smoky [244v]. `Smoky Hill` still lands on Smoky Hill on both. North America theme: the same move.
- By design: an exact name beats another entry's loose form ("hill" is filler), and the probe report says the bare "Smoky" went in beside Smoky Hill's loose form on purpose. The ratio is 3.0× in Smoky Hill's favour, right at the fame line, and Smoky River is the proper bare name of a 492 km river — leaving it is defensible. Flagged because a player who meant Smoky Hill now gets a (rarer, better-paying) river they did not name.
- Every other bare-name move found by `check1.mjs` (Blue Creek, Pembina, Sturgeon, Anderson, Sixteen Mile Creek, Pipestone Creek, Willow, George) goes to a MORE-viewed holder, or is the incumbent under its new qualified id at the same views (Verde, Salado, Salinas, Blanco, Escondido, San Pedro, Santa Maria, Churchill River, St. Mary, Clearwater, Eagle, Rouge, Indian, Coldwater, Poplar, Fawn, Little White, Grey) — no hijack of a famous incumbent: `Mississippi`, `Thames`, `Don`, `Severn`, `Seine`, `Humber`, `Trent`, `Mersey`, `Medway`, `Nith`, `Boyne`, `Welland`, `Salmon`, `Atoyac` (→ Balsas), `Sacramento`, `San Juan`, `San Miguel`, `Elk`, `Beaver`, `Vermilion`, `Leaf`, `White`, `Wind`, `James`, `Red Deer`, `Bow`, `Fraser`, `Hayes`, `Swan`, `Black`, `Snake`, `South`, `Saint-Paul`, `Pine`, `Crooked` all land where they did before (quote1.out). On the North America theme `Thames` → Thames (Ontario) 1,735 v (old: Thames (Connecticut) 1,278 v), `Trent` → Trent (Ontario) 396 v (old: North Carolina 183 v), and `Don`/`Severn`/`Seine`/`Humber`/`Mersey`/`Medway`/`Nith`/`Boyne`/`Welland` go from "isn't in North America" to the Canadian namesake — the intended effect.

### J2. Bare words that used to nudge to another cohort now score a new river (by design, listed for the record)
- `Holland` on a river round: old → elsewhere:country (the Netherlands' alias); new → accepted Holland River (244 v). `Montreal` old → elsewhere:city; new → Montreal River (Algoma). `Battle`, `Dog`, `Sheep`, `Bull`, `Adams` old → a mountain nudge; `Cat`, `Fir`, `Horn`, `Fire`, `Whale` old → an island nudge; `Ram`, `Ross`, `Perry`, `Cree`, `Limestone`, `Gull`, `Whitefish`, `Saint Jean` old → a lake nudge; `York`, `Sutton`, `Richardson`, `Crowe` (was a typo of Crewe) old → a city nudge. All now accept the river. `run.js` only second-guesses a CITY against a capital/country/island (`CONFUSABLE`), so a river round settles these by category — the documented design. "Holland" is the one a human might want to look at: the Netherlands has ~three orders of magnitude more views, and "Holland" typed on a river round may be a player who has confused the prompt; but the same is true of "Saint Paul", which the design explicitly keeps.

### J3. Exact newcomers that used to be spelling corrections of a more famous river (by design — exact beats fuzzy — but each one is a real place a typo now lands on)
| typed | old (d577de5) | new | ratio |
|---|---|---|---|
| `Snare` | corrected → Snake River (13,911 v) | accepted Snare (NWT, 61 v, 400 km) | 228× |
| `Tula River` | corrected → Tuul (alias "Tola River", 1,248 v) | accepted Tula (Mexico, 122 v, size 0) | 10× |
| `Trinite` / `Trinité` | corrected → Trinity (Texas, 4,292 v) | accepted Trinité (Quebec, 30 v, 82 km) | 143× |
| `Pitt River` | corrected → Pit (California, 731 v) | accepted Pitt (BC, 244 v, 100 km) | 3× |
| `Babine` | corrected → Sabine (1,735 v) | accepted Babine (BC, 91 v) | 19× |
| `Reindeer River` | corrected → Red Deer (974 v) | accepted Reindeer (Saskatchewan, 30 v) | 32× |
| `Altar` | corrected → Altaelva (244 v) | accepted Altar (Sonora, 30 v) | 8× |
| `Carrot` / `Dease` / `Bridge` / `Kovik` / `Grass` / `Thomsen` / `Conestogo` / `Ross River` / `Florido` / `Christina` / `Sabinas` / `Calderon` | corrected → Carron / Pease / Bride / Kavik / Grasse / Thomson / Conestoga / Cross / Florida River / Christian / Salinas / Calder (Europe round) | accepted the newcomer | ≤ 15× |
- The probe report listed most of these as "fuzzy rows that fix autocorrections", i.e. intended. The ones a human should weigh: **Snare** (a player who types "Snare" on a plain round almost certainly meant the Snake, 228× more viewed; Snare is a 400 km NWT river at 61 views — keep it, but know the Snake's typo budget lost this word), **Tula** (the Tuul is also transliterated "Tula"; if a human confirms that from the article — not checkable offline — make the Mexican one "Tula (Hidalgo)" and give the Tuul the alias "Tula", which `validate` allows with one unqualified holder), and **Trinité** (30 views; "Trinite" is a plausible French-keyboard or dropped-y typing of Trinity). Pitt/Pit is fine: "Pitt River" is the BC river's real name and the ratio is 3×.

### J4. 134 incumbents lost a one-edit typo correction to a tie (appendix A lists every one, with the typos)
- The mechanism: `nearest` refuses two equally close candidates, so every newcomer within an incumbent's edit budget turns some typos of the incumbent into "unrecognized" — the natural cost of 433 more names. The famous casualties (1,000+ views): Thames' French/German aliases ("tamese", "thomse" → Tamesí, Thomsen), Brazos ("razos" → Ramos), Wharfe ("whare", "whafe" → Whale), Moskva ("muskva" → Muskwa), Teesta ("teetsa" → Tetsa), Aras, Weser ("wesir" → Weir), Saint John ("saint jehn" → Saint-Jean), Au Sable ("a sable" → Ausable), Helmand ("holmand" → Holland), Spey ("speey" → Speed), Sabine ("abine" → Babine), Jamuna ("jamana" → Jamapa), Salinas ("sainas" → Sabinas), Reuss, Holston ("holton", "hoston" → Horton), Saar's "Sarre".
- On a themed round whose subset holds the incumbent but not the newcomer, the correction survives: Europe + `Whare` → Wharfe, `Muskva` → Moskva, `Tamese` → Thames, `Wolland` → Welland all still land (quote3.out). What a themed round does lose is the HINT for an out-of-scope incumbent: Europe + `Holton` old → wrong-scope "Holston isn't in Europe", new → plain unrecognized, because `run.submit` re-judges an unrecognized answer on the whole cohort (`wide`) and the tie Holston/Horton there is final; `Teetsa` (Teesta) the same. Neither could have scored on that round, so the cost is the hint, not an acceptance. On the plain round the tie IS the cost: "holton" scored Holston before and scores nothing now.
- No typo of any incumbent went to a DIFFERENT wrong river: the "accepted a newcomer" cases are exactly the exact-name cases in J3 and C6–C7; every other regression is a tie.

### J5. What the letter rules see in the wave's awkward names (all by the documented rules; listed so a human can disagree)
- The nine Quebec "Rivière …" rows kept whole start with **R** and end with their last word: Riviere du Sud (r…d), Riviere du Loup (r…p), Riviere aux Sables (r…s), Riviere aux Mélèzes, Riviere aux Outardes, Riviere du Chêne, Riviere du Moulin, Riviere à Mars, Riviere du Nord — `LETTER_FILLER` deliberately keeps "riviere" (the Rio Grande rule; the task's premise that river/riviere are both letter filler is half right: "river" is, "riviere" is not). "Rio de los Remedios" starts with R the same way. Engine: "starts with R" + `Riviere du Sud` → accepted, + `Du Sud` → accepted (the loose typing lands on the same entry); "starts with S" → wrong-scope for both. Consistent, if a little odd for "du Sud".
- Length rules are generous both ways by design: `Riviere du Sud` answers "short" (its matcher-bare form "du sud" is 5) AND "long" ("riviere du sud" is 12); so do Riviere à Mars and Saint-Paul River (Quebec) ("paul" / "saint paul river"). `Du Sud` typed on the long round is refused with the length hint (judged as typed) — correct.
- Creeks: `Tecate Creek` → "tecate" (starts T, ends E, not short: 6); `Black Creek` → "black" (short, ends K — "creek" is letter-only filler); `Twelve Mile Creek` → "twelve mile" (long); `Eagle Creek` → "eagle"; `Mess Creek` → "mess" (short, double).
- Single words: Again / Cat / Dog / Fir / Ram / Pic / Rae / Ha Ha are short (Ha Ha = "haha", 4). `Mountain` and `Désert` are all-filler names and keep their full spelling (start with M / D). `Kuunajuk` carries "ellice" from its alias, so it starts with E or K and ends with E or K. `St. Mary` starts with S ("st" is kept, like Saint Lucia). `Bell-Irving`, `Jacques-Cartier`, `Sainte-Anne`, `L'Assomption` (`river-l-assomption`) fold their hyphens/apostrophes and read as one name.
- Eligibility after the wave: starts-with S 555 / 4,420 (12.6%), B 346, C 345, M 316 — nothing near `MAX_ELIGIBLE_SHARE_LETTER` (60%); short 1,540 (34.8%), long 772, double 828; Q (10) and X (3) are unchanged and X stays under `MIN_ELIGIBLE` as before.

### Checks 5 and 6 for the record (clean)
- `jackpot-share.mjs --list=river`: line 28.5 views; 74 jackpots (1.67%), all pre-existing (Mecaya 7, Aquio 9, Bodoquero 11 … the 74 rows under 30 views). No wave row is at or under the line: 235 of the 516 sit at exactly 30 views (rarity 0.8445), 144 at 61–100, 113 at 101–300, 24 above 300. `check5b.mjs`: the cohort's 30-view band is now 828 rows (was 593). The jackpot-share header's warning applies: if the 74 rows under 30 views were ever dropped, lmin would rise to 30 and the whole band would become jackpots at once — a reason to keep those 74, or to lower the floor deliberately, never to trim from the bottom.
- Size prompts (`check6.mjs`): eligibility matches the figure for every new row on all eight river size slots (4,128 judgments); the 76 size-0 rows (44 + 11 Mexico, 17 + 4 Canada — the probe reports say 48 and 36 admitted; the difference is the rows the later `--taken-only` and drop passes removed, a data-audit matter) are refused on both "longer than" and "shorter than". Longer than 1,000 km gains one row (Aguanaval, 1,081); longer than 500 km gains 20.
- `draw-diff.mjs d577de5`: 0 of 46 days differ. The next 30 dailies (`check6.mjs`, `src/js/seed.js` keys 2026-09-18 … 2026-10-17): no day repeats a prompt text; all 450 prompts' `rarestFor` answers are accepted by their own prompt at the same rarity. The 21 distinct river prompts they draw and their ★: plain → Mecaya (7 v); North America → Epizetka (11 v); longer than 500 km → Casanare (22 v); longer than 1,000 → Itapecuru; 3,000 → Juruá; 5,000 → Ob; Europe → Don (France) (30 v — a qualified ★, typed as "Don (France)" it lands); British Isles → Ballisodare; Siberia → Nadym; Africa → Lofa; India → Torsa; Mesopotamia → Tigris; starts with A / T → Aquio / Tagagawik; ends in U → Ajaju; with an E / H / T → Mecaya / High Island Creek / Epizetka; short → Aquio; double letter → Willow (Minnesota) (13 v — the incumbent qualified this wave; the qualified spelling round-trips). No wave row is a ★ anywhere in the next 30 days, as the views floor predicts. Every river theme, region and size slot's ★ round-trips too (37 slots).
- Cross-category (`check7.mjs`): each of the 516 names typed on a lake, mountain, city, country and island round → the river nudge in 449–480 cases per category, the famous same-name holder elsewhere in the rest (Montreal / York / Sutton / Clearwater / Red Deer → the city; Sacramento / Annapolis / Santo Domingo → the capital; Hood → Mount Hood; Holland → the Netherlands; Antigua → the country), or an accepted entry when the other cohort really holds the name (35 lakes, 19 mountains, 32 cities, 41 islands, 5 countries). Zero "unrecognized".

### Check 3 for the record (clean)
- `check3.mjs`: 122 qualified entries touched by the wave (98 namesake rows + 24 incumbents that gained a qualifier). "Name, Qualifier", "Name Qualifier" and "Name (Qualifier)" → exact on the plain round for all 366 forms (0 problems); the 17 US-state codes ("Salinas CA", "Blanco TX", "Verde AZ", "Clearwater ID", "Eagle CO", "Rouge MI", "Indian FL", "Coldwater MS", "Poplar MT", "Fawn MI", "Little White SD", "Pipestone Creek SD", "Willow MN", "Sixteen Mile Creek MT", "San Pedro AZ", "Santa Maria AZ", "Blue Creek ID") → exact.
- Second typing: for each of the 70 shared bare names, typing it holders+1 times in one run gives the holders most-viewed first, then a duplicate — on the plain round (Thames → Thames (Ontario) → Thames (Connecticut) → duplicate; Don → Don (Ontario) → Don (Yorkshire) → Don (Aberdeenshire) → Don (France); Salmon → Idaho → BC → New Brunswick → Vancouver Island → Alaska; Verde → Arizona → Jalisco → Oaxaca → San Luis Potosí; Atoyac → Balsas → Oaxaca → Guerrero; Elk ×6, Sturgeon ×5, Clearwater ×5, Beaver ×4, San Juan ×4…) and on the North America theme, where the out-of-scope holders drop out (Thames → Ontario → Connecticut → duplicate; Don / Severn / Seine → the Canadian one → duplicate; Salado → Mexico → duplicate). Grey (New Zealand) is a sole holder with a qualifier (the probe report says so); the only visible effect is the summary line "Grey (New Zealand)".

## Not reached / not checkable offline

- Whether the Tuul River's article lists "Tula" as a spelling (J3) — needs the live article; decide from the article before qualifying Tula.
- Whether "AuSable" is on the Michigan article as an alternative name (C6) — the fix does not depend on it (the typing lands on the wrong river either way), but the alias text should follow the article.
- The full matcher battery of the brief's check 5 was run as generated typos of incumbents (57,381) plus the wave's own forms; hand-written "realistic" misspellings beyond one edit (e.g. "Thaimes", "Missisipi") were not separately typed — the one-edit generator covers the drop/double/swap/vowel classes, not two-letter errors.
- Pre-existing rows with the C1–C4 shape (a river whose name carries another category's generic word, e.g. "Lake Fork", "Mountain Fork", "Bay …") were not surveyed; only the wave's four were found. A grep of `src/data/rivers.json` names against `WORD_CATEGORY` would list them in a minute.
- Brief checks 1–4 in full (every alias, every theme membership, region tags) belong to the data audit and were only touched where the gameplay checks passed through them: every alias in the chunk files landed (check 1 typed them), and the North America theme accepted every wave row (check 1, NA column), so the theme membership is complete for the wave.

## Appendix A — every incumbent whose typo correction the wave took (check 2; `check2.mjs`, `check2b.mjs`)

Typos generated per incumbent spelling: each letter dropped, each doubled, each adjacent pair swapped, each vowel replaced (57,381 typings over the 1,889 spellings that are within two edits of a new key or have 1,000+ views). "tie" = the new stack refuses the typing as equally close to two places; "accepted:X" = the typing is now X's exact name. Namesake moves (the typo now corrects to the same name's more-viewed holder) are excluded.

| incumbent (old spelling) | views | typo(s) the old stack corrected | new outcome | newcomer(s) within reach |
|---|---|---|---|---|
| Tamise | 32479 | "tamese", "tamisi" | tie x2 | river-tamesi |
| Themse | 32479 | "thomse" | tie x1 | river-thomsen, river-thames-ontario |
| Brazos | 6118 | "razos" | tie x1 | river-ramos |
| Wharfe | 6027 | "whafe", "whare" | tie x2 | river-whale |
| Moskva | 3379 | "muskva" | tie x1 | river-muskwa |
| Teesta | 3196 | "teetsa" | tie x1 | river-tetsa |
| Aras | 2679 | "arass" | tie x1 | river-aros, river-adams, river-rat, river-grass, river-ram, river-rae |
| Weser | 2527 | "wesir" | tie x1 | river-desert, river-weir |
| Saint John | 2527 | "saint jehn" | tie x1 | river-saint-jean, river-horn, river-don-ontario |
| Au Sable | 2100 | "a sable", "au able" | tie x2 | river-ausable, river-riviere-aux-sables |
| Helmand | 1857 | "holmand" | tie x1 | river-holland, river-welland-ontario |
| Spey | 1826 | "speey" | tie x1 | river-speed, river-soper |
| Sabine | 1735 | "abine" | tie x1 | river-sabinas, river-babine, river-seine-manitoba, river-seine-ontario |
| River Wear | 1492 | "river weir" | accepted:river-weir [30v] x1 | river-dean, river-saint-jean, river-weir, river-leaf-quebec |
| Jamuna | 1431 | "jamana" | tie x1 | river-jamapa |
| Salinas | 1309 | "sainas" | tie x1 | river-sabinas, river-salinas-guatemala |
| Tola River | 1248 | "tula river" | accepted:river-tula [122v] x1 | river-tula, river-tonala, river-toad, river-tuya |
| Reuss | 1096 | "rauss", "reoss" | tie x2 | river-raush, river-ross |
| Holston | 1035 | "hoston", "holton" | tie x2 | river-horton |
| Sarre | 1035 | "srare" | tie x1 | river-snare |
| Terek | 974 | "treek" | tie x1 | river-tree |
| Selenga | 944 | "selega", "selegna" | tie x2 | river-selegua |
| Tanana | 913 | "tonana", "tanaan" | tie x2 | river-tonala, river-canaan |
| Welland | 883 | "wolland" | tie x1 | river-holland, river-welland-ontario |
| Tugela | 791 | "tuela", "tugla" | tie x2 | river-tula |
| Pit River | 731 | "pitt river" | accepted:river-pitt [244v] x1 | river-pitt, river-pic, river-rat, river-cat, river-fir, river-nith-ontario, river-pine-british-columbia |
| Watauga | 670 | "wataga" | tie x1 | river-gataga |
| Carson | 639 | "carsen" | tie x1 | river-carmen, river-carrot |
| Cross | 639 | "rcoss" | tie x1 | river-aros, river-crowe, river-grass, river-ross |
| Cross River | 639 | "ross river" | accepted:river-ross [30v] x1 | river-aros, river-crowe, river-grass, river-ross |
| Conestoga | 609 | "conestog", "conestoge", "conestogi", "conestogo" | tie x4; accepted:river-conestogo [122v] x1 | river-conestogo |
| Tolka | 578 | "tulka" | tie x1 | river-tula, river-kopka |
| Tiete | 578 | "tiette" | tie x1 | river-tree, river-miette |
| Swale | 548 | "wsale" | tie x1 | river-cuale, river-stave, river-snare, river-whale, river-swan-river-manitoba, river-snake-river-yukon |
| Sele | 548 | "seele" | tie x1 | river-keele, river-bell, river-shell, river-steel, river-elk-british-columbia, river-seine-manitoba, river-seine-ontario, river-elk-alberta |
| Weber | 548 | "webir" | tie x1 | river-weir |
| Georges | 548 | "georgs", "georgse" | tie x2 | river-george |
| Talas | 517 | "tulas" | tie x1 | river-tula |
| Mattole | 517 | "mattle" | tie x1 | river-battle |
| Deben | 517 | "deban" | tie x1 | river-dean |
| Hotan | 487 | "hoton" | tie x1 | river-horton, river-horn |
| Trave | 426 | "rtave", "treve" | tie x2 | river-stave, river-tree, river-raven, river-rae |
| Moraca | 426 | "morica", "morace" | tie x2 | river-morice |
| Barwon | 426 | "borwon" | tie x1 | river-bowron |
| Kavik | 426 | "kevik", "kivik", "kovik", "kuvik" | tie x3; accepted:river-kovik [30v] x1 | river-kovik |
| Caledon | 396 | "caldeon" | tie x1 | river-calderon |
| Thelon | 365 | "theon", "thelo" | tie x2 | river-theo |
| Moore | 365 | "moora" | tie x1 | river-moira, river-noire-outaouais, river-noire-monteregie |
| Aller | 335 | "allar" | tie x1 | river-altar |
| Koros | 335 | "karos" | tie x1 | river-aros, river-bobos |
| Kobuk | 335 | "kobik" | tie x1 | river-kovik |
| Traun | 274 | "troun" | tie x1 | river-trout-british-columbia, river-trout-northwest-territories |
| Natisone | 274 | "natione", "natison" | tie x2 | river-nation |
| Kiewa | 274 | "kaewa", "kiawa" | tie x2 | river-kipawa, river-kakwa |
| Tellico | 274 | "ellico" | tie x1 | river-kuunajuk |
| Hornad | 244 | "hornd" | tie x1 | river-hornaday, river-horn |
| Kalamas | 244 | "alamas" | tie x1 | river-alamar |
| Bruneau | 244 | "braneau" | tie x1 | river-brazeau, river-bouleau |
| Uele | 244 | "ueele" | tie x1 | river-cuale, river-keele, river-bell, river-elk-british-columbia, river-elk-alberta |
| Thomson | 244 | "thomsn", "thomsan", "thomsen", "thomsin" | tie x4; accepted:river-thomsen [91v] x1 | river-thomsen |
| Thomson River | 244 | "thomsen river" | accepted:river-thomsen [91v] x1 | river-thomsen |
| Alta | 244 | "altaa" | tie x1 | river-altar, river-laja |
| Magra | 213 | "mogra" | tie x1 | river-moira, river-st-mary-british-columbia |
| Belice | 213 | "elice", "eblice" | tie x2 | river-kuunajuk |
| Besos | 213 | "bosos" | tie x1 | river-bobos |
| Maule | 213 | "muale" | tie x1 | river-cuale, river-eagle-yukon, river-eagle-british-columbia, river-saint-paul-river-quebec |
| Baraboo | 213 | "bariboo" | tie x1 | river-cariboo |
| Maurice | 213 | "murice", "mourice", "marice", "maorice" | tie x4 | river-morice |
| Carron | 183 | "carren", "carro" | tie x2 | river-carmen, river-carrot |
| Creuse | 183 | "crese", "creue" | tie x2 | river-cree |
| Hondo | 183 | "honod" | tie x1 | river-hood |
| Agano | 183 | "agaon", "agana", "agani" | tie x3 | river-agawa, river-again |
| Buller | 183 | "bullr" | tie x1 | river-bull |
| Scarpe | 152 | "scare" | tie x1 | river-snare |
| Tamega | 152 | "tamegi" | tie x1 | river-tamesi |
| Otava | 152 | "otave" | tie x1 | river-stave |
| Pite | 152 | "pitte" | tie x1 | river-pitt, river-pic, river-fire, river-nith-ontario, river-white-ontario, river-pine-british-columbia |
| Belly | 152 | "belyl" | tie x1 | river-bull, river-bell |
| Grasse | 152 | "grase", "grases", "grass", "grassa" | tie x6; accepted:river-grass [91v] x1 | river-grass |
| Geul | 122 | "geull" | tie x1 | river-gull-haliburton, river-gull-thunder-bay, river-bell, river-saint-paul-river-quebec |
| Maggia | 122 | "maggie" | tie x1 | river-magpie-quebec, river-magpie-ontario |
| Dalaman | 122 | "alaman" | tie x1 | river-alamar |
| Horyn | 122 | "hoyrn", "horny" | tie x2 | river-horton, river-horn |
| Chitina | 122 | "chutina", "chitine" | tie x2 | river-christina, river-chutine |
| Stewart | 122 | "stwart", "stuwart", "steart" | tie x3 | river-stuart |
| Siak | 122 | "ssiak" | tie x1 | river-yaak, river-asiak, river-swan-river-manitoba, river-snake-river-yukon |
| Florida River | 122 | "florido river" | accepted:river-florido [30v] x1 | river-florido |
| Feale | 122 | "fuale", "feele" | tie x2 | river-cuale, river-keele, river-dease, river-whale, river-eagle-yukon, river-eagle-british-columbia |
| Pellice | 91 | "epllice", "pllice" | tie x2 | river-kuunajuk |
| Ciane | 91 | "cuane" | tie x1 | river-cuale, river-cains, river-pine-british-columbia |
| Cares | 91 | "caros" | tie x1 | river-aros, river-carmen, river-cains, river-cree, river-james-alberta, river-hayes-nunavut |
| Orlice | 91 | "erlice" | tie x1 | river-morice, river-kuunajuk |
| Tvertsa | 91 | "tertsa", "tvetsa" | tie x2 | river-tetsa |
| Chorna | 91 | "chorn" | tie x1 | river-horn |
| Aguan | 91 | "agaun", "agaan", "agian", "aguin" | tie x4 | river-again |
| Barron | 91 | "borron" | tie x1 | river-carrot, river-bowron |
| Alamosa | 91 | "elamosa" | tie x1 | river-eramosa |
| Belle | 91 | "belel" | tie x1 | river-bull, river-keele, river-bell |
| Koyuk | 91 | "koyik" | tie x1 | river-kovik |
| Weiser | 91 | "weisr" | tie x1 | river-weir |
| Bride | 91 | "bridde", "bridee" | tie x2 | river-bridge |
| Nairn | 91 | "noirn" | tie x1 | river-noire-outaouais, river-nation, river-noire-monteregie |
| Treene | 91 | "treee" | tie x1 | river-tree, river-trent-ontario |
| Stoer | 91 | "soter" | tie x1 | river-soper, river-steel |
| Cele | 61 | "ceele" | tie x1 | river-cuale, river-keele, river-bell, river-cree, river-elk-british-columbia, river-elk-alberta |
| Dranse | 61 | "drase" | tie x1 | river-dease |
| Trotus | 61 | "trous", "trouts", "trotu" | tie x3 | river-trout-british-columbia, river-trout-northwest-territories |
| Tuloma | 61 | "tulma", "tuloa" | tie x2 | river-tula |
| Blanda | 61 | "blinda", "bland" | tie x2 | river-blanco-veracruz, river-blind |
| Itaya | 61 | "ituya" | tie x1 | river-tuya |
| Ailette | 61 | "aiette" | tie x1 | river-miette |
| Anglin | 61 | "aglin" | tie x1 | river-again |
| Bruche | 61 | "broche" | tie x1 | river-croche |
| Thouet | 61 | "thout" | tie x1 | river-trout-british-columbia, river-trout-northwest-territories |
| Fiora | 30 | "fiore" | tie x1 | river-moira, river-fir, river-fire |
| Blanice | 30 | "blancie" | tie x1 | river-blanco-veracruz, river-blanche |
| Topla | 30 | "tupla" | tie x1 | river-tula, river-tonala, river-kopka, river-poplar-manitoba |
| Canoas | 30 | "canaas" | tie x1 | river-canaan |
| Christian | 30 | "christin", "christina", "christia" | tie x2; accepted:river-christina [61v] x1 | river-christina |
| King Salmon | 30 | "kig salmon" | tie x1 | river-big-salmon |
| Little White | 30 | "little whate" | tie x1 | river-little-whale, river-little-white-ontario |
| Lieser | 30 | "liesre" | tie x1 | river-lievre |
| Trebel | 30 | "treel", "trebe" | tie x2 | river-tree |
| Arros | 30 | "raros", "arors" | tie x2 | river-aros, river-ramos, river-carrot |
| Boulogne | 30 | "boulonge" | tie x1 | river-coulonge |
| Chere | 30 | "chree" | tie x1 | river-cree |
| Cure | 30 | "curee" | tie x1 | river-cuale, river-cree, river-fire |
| Cere | 30 | "ceree" | tie x1 | river-verde-jalisco, river-verde-oaxaca, river-verde-san-luis-potosi, river-tree, river-cree, river-fire |
| Touch | 30 | "toach", "toich", "tooch" | tie x3 | river-torch, river-south-river-ontario |
| Gallo | 30 | "gullo" | tie x1 | river-gull-haliburton, river-gull-thunder-bay |
| Vanan | 30 | "vanaan" | tie x1 | river-canaan |
| Gakona | 23 | "gakina" | tie x1 | river-nakina |
| Dog Salmon | 20 | "dig salmon" | tie x1 | river-big-salmon |
| Herron | 20 | "horron" | tie x1 | river-horton |
