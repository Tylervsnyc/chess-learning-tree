import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const REVIEWS_FILE = join(process.cwd(), 'data', 'puzzle-reviews.json');

export interface PuzzleReview {
  puzzleId: string;
  decision: 'approved' | 'rejected' | 'maybe';
  assignedTheme: string | null;
  originalThemes: string;
  rating: number;
  notes: string;
  reviewedAt: string;
}

interface ReviewsData {
  reviews: PuzzleReview[];
  criteria: Record<string, string[]>; // theme -> criteria notes
}

function loadReviews(): ReviewsData {
  if (!existsSync(REVIEWS_FILE)) {
    return { reviews: [], criteria: {} };
  }
  try {
    const content = readFileSync(REVIEWS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { reviews: [], criteria: {} };
  }
}

function saveReviews(data: ReviewsData): void {
  writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2));
}

// GET - fetch all reviews
export async function GET() {
  const data = loadReviews();
  return NextResponse.json(data);
}

// POST - save a new review
export async function POST(request: NextRequest) {
  try {
    const review: PuzzleReview = await request.json();
    review.reviewedAt = new Date().toISOString();

    const data = loadReviews();

    // Update or add review
    const existingIndex = data.reviews.findIndex(r => r.puzzleId === review.puzzleId);
    if (existingIndex >= 0) {
      data.reviews[existingIndex] = review;
    } else {
      data.reviews.push(review);
    }

    saveReviews(data);

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to save review: ${error}` },
      { status: 500 }
    );
  }
}
