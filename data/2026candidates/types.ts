export interface Player {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  rating: number;
  photo: string; // path in /public/2026candidates/players/
  points: number; // tournament points (updated each round)
  todayResult?: 0 | 0.5 | 1; // today's round result
}

export interface Arrow {
  from: string; // square e.g. "e2"
  to: string;   // square e.g. "e4"
  color?: string;
}

export interface Moment {
  title: string;           // e.g. "The Bishop Sacrifice"
  moveNumber: number;
  fen: string;
  eval: number;            // centipawns, positive = white advantage
  lastMove?: { from: string; to: string };
  arrows: Arrow[];
  comment?: string;        // talking point for Tyler
}

export interface GameConfig {
  id: string;
  round: number;
  date: string;
  white: string;  // player id
  black: string;  // player id
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  moments: Moment[];
  pgn?: string;   // full PGN for reference
}

export type Tournament = 'open' | 'womens';
