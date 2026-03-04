#!/bin/bash
# Clean build cache — run this if the dev server won't start
echo "♟ Cleaning build cache..."
rm -rf .next
echo "♟ Done! Run 'npm run dev' to restart."
