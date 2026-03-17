#!/bin/bash
# Batch download masters data for all 10 openings
# Each download takes ~1-3 minutes depending on tree depth
# Output goes to data/opening-builds/{slug}-L1/masters.json

set -e

SCRIPT="scripts/openings/download-masters.ts"

echo "=== Batch downloading masters data for all openings ==="
echo ""

# 1. Italian Game (White)
echo ">>> [1/10] Italian Game"
npx tsx $SCRIPT --slug italian --level 1 --side white --moves "1.e4 e5 2.Nf3 Nc6 3.Bc4"
echo ""

# 2. Pirc Defense (Black)
echo ">>> [2/10] Pirc Defense"
npx tsx $SCRIPT --slug pirc --level 1 --side black --moves "1.e4 d6 2.d4 Nf6"
echo ""

# 3. Ruy Lopez (White)
echo ">>> [3/10] Ruy Lopez"
npx tsx $SCRIPT --slug ruy-lopez --level 1 --side white --moves "1.e4 e5 2.Nf3 Nc6 3.Bb5"
echo ""

# 4. Sicilian Defense (Black)
echo ">>> [4/10] Sicilian Defense"
npx tsx $SCRIPT --slug sicilian --level 1 --side black --moves "1.e4 c5"
echo ""

# 5. French Defense (Black)
echo ">>> [5/10] French Defense"
npx tsx $SCRIPT --slug french --level 1 --side black --moves "1.e4 e6 2.d4 d5"
echo ""

# 6. Scotch Game (White)
echo ">>> [6/10] Scotch Game"
npx tsx $SCRIPT --slug scotch --level 1 --side white --moves "1.e4 e5 2.Nf3 Nc6 3.d4"
echo ""

# 7. Caro-Kann (Black)
echo ">>> [7/10] Caro-Kann"
npx tsx $SCRIPT --slug caro-kann --level 1 --side black --moves "1.e4 c6"
echo ""

# 8. King's Gambit (White)
echo ">>> [8/10] King's Gambit"
npx tsx $SCRIPT --slug kings-gambit --level 1 --side white --moves "1.e4 e5 2.f4"
echo ""

# 9. London System (White)
echo ">>> [9/10] London System"
npx tsx $SCRIPT --slug london --level 1 --side white --moves "1.d4 d5 2.Bf4"
echo ""

# 10. King's Indian (Black)
echo ">>> [10/10] King's Indian"
npx tsx $SCRIPT --slug kings-indian --level 1 --side black --moves "1.d4 Nf6 2.c4 g6"
echo ""

# 11. Pirc Austrian Attack (Black)
echo ">>> [11/11] Pirc Austrian Attack"
npx tsx $SCRIPT --slug pirc-austrian --level 1 --side black --moves "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4"
echo ""

echo "=== All downloads complete! ==="
echo "Masters data saved to data/opening-builds/*/masters.json"
