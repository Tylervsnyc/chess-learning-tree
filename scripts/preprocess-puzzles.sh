#!/bin/bash

# Preprocess Lichess puzzle database into organized smaller files
# Usage: ./preprocess-puzzles.sh /path/to/lichess_db_puzzle.csv

SOURCE_FILE="${1:-/Users/tyler.schwartz/Downloads/lichess_db_puzzle.csv}"
OUTPUT_DIR="/Users/tyler.schwartz/chess-learning-tree/data/puzzles-by-rating"

echo "Source: $SOURCE_FILE"
echo "Output: $OUTPUT_DIR"
echo ""

# Check if source exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Error: Source file not found: $SOURCE_FILE"
    exit 1
fi

# Create output directory structure
mkdir -p "$OUTPUT_DIR"

echo "Step 1: Splitting by rating bands..."
echo "This may take a few minutes for 5.6M puzzles..."
echo ""

# Rating bands matching your curriculum levels
# Level 1: 400-800 (Beginner)
# Level 2: 800-1200 (Intermediate)
# Level 3: 1200-1600 (Advanced Beginner)
# Level 4: 1600-2000 (Intermediate+)
# Level 5: 2000+ (Advanced)

awk -F',' 'NR==1 {header=$0; next}
{
    rating = $4
    if (rating >= 400 && rating < 800) file = "0400-0800"
    else if (rating >= 800 && rating < 1200) file = "0800-1200"
    else if (rating >= 1200 && rating < 1600) file = "1200-1600"
    else if (rating >= 1600 && rating < 2000) file = "1600-2000"
    else if (rating >= 2000) file = "2000-plus"
    else next

    outfile = "'"$OUTPUT_DIR"'/" file ".csv"
    if (!seen[file]++) print header > outfile
    print >> outfile
}' "$SOURCE_FILE"

echo "Rating split complete. File counts:"
wc -l "$OUTPUT_DIR"/*.csv
echo ""

echo "Step 2: Splitting each rating band by theme..."

# Function to split a rating file by themes
split_by_theme() {
    local rating_file="$1"
    local rating_name=$(basename "$rating_file" .csv)
    local theme_dir="$OUTPUT_DIR/$rating_name"

    mkdir -p "$theme_dir"

    echo "  Processing $rating_name..."

    # Key themes for chess learning curriculum
    themes=(
        "mateIn1"
        "mateIn2"
        "fork"
        "pin"
        "skewer"
        "defensiveMove"
        "discoveredAttack"
        "hangingPiece"
        "sacrifice"
        "promotion"
        "backRankMate"
        "deflection"
        "attraction"
        "clearance"
        "interference"
        "trappedPiece"
        "exposedKing"
        "quietMove"
        "advancedPawn"
        "endgame"
        "rookEndgame"
        "pawnEndgame"
        "bishopEndgame"
        "knightEndgame"
        "queenEndgame"
    )

    for theme in "${themes[@]}"; do
        awk -F',' -v theme="$theme" -v outdir="$theme_dir" '
        NR==1 {header=$0; next}
        $8 ~ theme {
            outfile = outdir "/" theme ".csv"
            if (!seen++) print header > outfile
            print >> outfile
        }' "$rating_file"
    done

    # Count files created
    local count=$(ls -1 "$theme_dir"/*.csv 2>/dev/null | wc -l)
    echo "    Created $count theme files"
}

# Process each rating band
for rating_file in "$OUTPUT_DIR"/*.csv; do
    if [ -f "$rating_file" ]; then
        split_by_theme "$rating_file"
    fi
done

echo ""
echo "Done! Structure created:"
echo ""
find "$OUTPUT_DIR" -name "*.csv" | head -20
echo "..."
echo ""
echo "Total files:"
find "$OUTPUT_DIR" -name "*.csv" | wc -l
