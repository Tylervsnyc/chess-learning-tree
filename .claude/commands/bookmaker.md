# Bookmaker

Pull live win probabilities from Polymarket for the 2026 Candidates Tournament and update the data river.

## Input

Optional context from Tyler: $ARGUMENTS (e.g., "round 4 just finished", or empty)

## Critical Rules

1. **DO NOT change player colors.** Colors are locked in `PLAYERS` array in `DataRiverDailyReel.tsx` and must match all previously published videos. Never edit the `PLAYERS` array.
2. **DO NOT change player order.** The `LOCKED_ORDER` array in `DataRiverDailyReel.tsx` controls river stream layout. Never modify it — changing it flips the visual pattern and breaks continuity with published videos.
3. **Only append data.** The only things you should add to `DataRiverDailyReel.tsx` are: new entries in `ROUND_RESULTS` and `ROUND_MOODS`. Touch nothing else.
4. **Verify before rendering.** Extract a frame from the previous round's video and the new render at the same frame number. Compare visually — the river pattern for existing rounds must look identical.
5. **Colors in `tournament_data.json` must match `DataRiverDailyReel.tsx`.** If they ever diverge, the reel file is the source of truth (it's what the published videos used).

## Step 1: Fetch latest game results

Run `python3 datariver/fetch_results.py --check` to see if there are new results. If there are, run `python3 datariver/fetch_results.py` to update `tournament_data.json`.

## Step 2: Pull odds from Polymarket

Fetch the **latest price** for each player's YES token from the Polymarket CLOB API:

```
https://clob.polymarket.com/prices-history?market={token_id}&interval=1w&fidelity=60
```

Use the **last data point** from each response — that's the current post-round price.

Token IDs (YES tokens, in tournament_data.json player order):
```
Caruana:   14829621941083159651863477321061978452774030546975338313116596920203613092617
Nakamura:  46418472856296711220843845567536478074766367714000934578997814903271205741534
Sindarov:  25974117173143282465831864213768365067438237026386714875375351752280507594229
Pragg:     13185355485422531804057109644308809167352430788332144471624649386327092848805
Wei Yi:    73132403039451649472496206940057588412644650865168141345159538671447003268980
Giri:      105727031350943266015958993593007492099932164675992712855112807129566469080985
Bluebaum:  6543722851451134329703465144370100375167485214680706933163458100899570901801
Esipenko:  1947881929074144760122167718002567580020044719649342561847441358580047285368
```

## Step 3: Normalize and update bookmaker_odds.json

Convert raw prices to percentages, normalize each round to sum to 100. **Only add the new round** — do not modify existing round entries. Write to `datariver/bookmaker_odds.json`:

```json
{
  "0": [31, 20, 14, 11, 10, 9, 2, 3],
  "1": [40, 11, 18, 17, 8, 3, 2, 1]
}
```

Array order matches tournament_data.json players: Caruana, Nakamura, Sindarov, Pragg, Wei Yi, Giri, Blübaum, Esipenko. Must sum to 100. No extra fields.

## Step 4: Update Remotion round results

**Only append** to `ROUND_RESULTS` and `ROUND_MOODS` in `remotion/DataRiverDailyReel.tsx`. Do not touch anything else in the file.

- `ROUND_RESULTS`: Add the new round's games as `[white_idx, black_idx, white_score, black_score]`
- `ROUND_MOODS`: Add a mood that fits the round's drama (see existing entries for examples)

Player indices: 0=Caruana, 1=Nakamura, 2=Sindarov, 3=Pragg, 4=Wei Yi, 5=Giri, 6=Blübaum, 7=Esipenko

## Step 5: Verify and render

1. Run `python3 datariver/generate_daily.py`
2. Run `npx tsc --noEmit` to verify TypeScript compiles
3. Render: `npx remotion render remotion/index.ts DataRiverDaily out/data-river-rX.mp4`
4. **Visual check**: Extract a frame from the previous video and the new one at the same frame number. Compare to confirm the river pattern is identical for existing rounds. If it's different, something broke — do not deliver.
5. Open the video for Tyler to review.

Report the updated odds table to Tyler.
