// Opening Registry — curriculum order, colors, metadata
// Source of truth for the /openings hub and detail pages.
// Curriculum order from data/openings/curriculum-plan.md

export interface OpeningConfig {
  slug: string
  name: string
  subtitle: string
  moves: string         // Key opening moves shown on cards
  description: string   // Longer description for detail page hero
  side: 'white' | 'black'
  category: '1.e4' | '1.d4'
  color: string         // Primary color
  colorDark: string     // Dark accent
  colorLight: string    // Light accent (for gradients)
  // Ghost piece for detail hero (Unicode)
  ghostPiece: string
  // SVG icon type for puck
  icon: 'bishop' | 'knight' | 'pawn' | 'rook' | 'queen' | 'king' | 'lightning' | 'shield'
  // Whether this opening has lessons built (data files exist)
  hasData: boolean
  // Curriculum position (1-10)
  order: number
  // Main line info for detail page
  mainLine: {
    name: string
    subtitle: string
  }
  // Variations for detail page
  variations: {
    name: string
    subtitle: string
    icon: 'bishop' | 'knight' | 'pawn' | 'rook' | 'queen' | 'king' | 'lightning' | 'shield'
    hasData: boolean
  }[]
}

// SVG paths for chess piece icons (white fill, viewBox 0 0 45 45)
export const PIECE_SVGS = {
  bishop: {
    viewBox: '0 0 45 45',
    paths: [
      'M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z',
    ],
    circles: [{ cx: 22.5, cy: 8, r: 3 }],
    extraPaths: [
      'M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z',
    ],
  },
  knight: {
    viewBox: '0 0 45 45',
    paths: [
      'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21',
      'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3',
    ],
  },
  pawn: {
    viewBox: '0 0 45 45',
    paths: [
      'M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z',
    ],
  },
  rook: {
    viewBox: '0 0 45 45',
    paths: [
      'M9 39h27v-3H9v3zM12 36v-4h21v4H12zM14 29.5v-13h17v13H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11zM12.5 32l1.5-2.5h17l1.5 2.5z',
    ],
  },
  queen: {
    viewBox: '0 0 45 45',
    paths: [
      'M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z',
      'M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z',
    ],
  },
  king: {
    viewBox: '0 0 45 45',
    paths: [
      'M22.5 11.63V6M20 8h5',
      'M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5',
      'M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7',
    ],
  },
  // Small icons for variations
  lightning: {
    viewBox: '0 0 24 24',
    paths: [],
    polygons: [{ points: '13,2 3,14 12,14 11,22 21,10 12,10 13,2' }],
  },
  shield: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    ],
  },
} as const

// Curriculum-ordered openings (1-10)
export const OPENINGS_REGISTRY: OpeningConfig[] = [
  // === 1.e4 OPENINGS ===
  {
    slug: 'italian',
    name: 'Italian Game',
    subtitle: 'A natural attacking e4 opening for White',
    moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4',
    description: 'The natural attacking opening. Develop, control the center, and target f7.',
    side: 'white',
    category: '1.e4',
    color: '#58CC02',
    colorDark: '#3FA802',
    colorLight: '#76d530',
    ghostPiece: '♗',
    icon: 'bishop',
    hasData: true,
    order: 1,
    mainLine: {
      name: 'Giuoco Piano',
      subtitle: '3...Bc5 — the quiet game · 9 lessons',
    },
    variations: [
      { name: 'Fried Liver Attack', subtitle: 'The classic trap — Nxf7', icon: 'lightning', hasData: false },
      { name: 'Two Knights Defense', subtitle: '3...Nf6 — counterattack the center', icon: 'knight', hasData: false },
      { name: 'Evans Gambit', subtitle: '4.b4 — sacrifice a pawn for tempo', icon: 'pawn', hasData: false },
    ],
  },
  {
    slug: 'pirc-defense',
    name: 'Pirc Defense',
    subtitle: 'A flexible hypermodern defense against e4',
    moves: '1.e4 d6 2.d4 Nf6',
    description: 'One setup against everything. Fianchetto, stay flexible, and strike back.',
    side: 'black',
    category: '1.e4',
    color: '#14B89A',
    colorDark: '#0E8F7A',
    colorLight: '#2ED4B0',
    ghostPiece: '♞',
    icon: 'knight',
    hasData: true,
    order: 2,
    mainLine: {
      name: 'Classical System',
      subtitle: '4.Nf3 Bg7 — develop and fianchetto · 9 lessons',
    },
    variations: [
      { name: 'Austrian Attack', subtitle: '4.f4 — White goes all-in', icon: 'lightning', hasData: true },
      { name: '150 Attack', subtitle: '4.Be3 — quiet but dangerous', icon: 'shield', hasData: false },
    ],
  },
  {
    slug: 'ruy-lopez',
    name: 'Ruy Lopez',
    subtitle: 'The classic positional e4 opening for White',
    moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5',
    description: 'The Spanish Game. 500 years old, still the king of openings.',
    side: 'white',
    category: '1.e4',
    color: '#FF9600',
    colorDark: '#E07800',
    colorLight: '#FFB347',
    ghostPiece: '♗',
    icon: 'bishop',
    hasData: true,
    order: 3,
    mainLine: {
      name: 'Morphy Defense',
      subtitle: '3...a6 4.Ba4 — the main battleground · 9 lessons',
    },
    variations: [
      { name: 'Exchange Variation', subtitle: '4.Bxc6 — simplify early', icon: 'bishop', hasData: false },
      { name: 'Berlin Defense', subtitle: '3...Nf6 — the Berlin Wall', icon: 'knight', hasData: false },
      { name: 'Marshall Attack', subtitle: '8...d5 — legendary gambit', icon: 'lightning', hasData: false },
    ],
  },
  {
    slug: 'sicilian',
    name: 'Sicilian Defense',
    subtitle: 'The sharpest counter-fighting defense against e4',
    moves: '1.e4 c5',
    description: 'The fighting choice against 1.e4. Each variation is its own world.',
    side: 'black',
    category: '1.e4',
    color: '#FF4B4B',
    colorDark: '#C82F2F',
    colorLight: '#FF6B6B',
    ghostPiece: '♞',
    icon: 'knight',
    hasData: true,
    order: 4,
    mainLine: {
      name: 'Open Sicilian',
      subtitle: '2.Nf3 d6 3.d4 — the main battlefield · 9 lessons',
    },
    variations: [
      { name: 'Dragon Variation', subtitle: '5...g6 — fianchetto the bishop', icon: 'knight', hasData: false },
      { name: 'Najdorf Variation', subtitle: '5...a6 — the most popular', icon: 'lightning', hasData: false },
      { name: 'Sveshnikov Variation', subtitle: '5...e5 — fight for d5', icon: 'knight', hasData: false },
      { name: 'Alapin Variation', subtitle: '2.c3 — solid alternative', icon: 'shield', hasData: false },
    ],
  },
  {
    slug: 'french',
    name: 'French Defense',
    subtitle: 'A solid, strategic defense against e4',
    moves: '1.e4 e6 2.d4 d5',
    description: 'Build a wall with e6, fight for the center with d5. Solid, strategic, and full of counterattacking chances.',
    side: 'black',
    category: '1.e4',
    color: '#F59E0B',
    colorDark: '#D97706',
    colorLight: '#FBBF24',
    ghostPiece: '♟',
    icon: 'pawn',
    hasData: true,
    order: 5,
    mainLine: {
      name: 'Classical Variation',
      subtitle: '3.Nc3 Nf6 4.Bg5 Be7 — the main battleground · 10 lessons',
    },
    variations: [
      { name: 'Winawer Variation', subtitle: '3...Bb4 — pin the knight', icon: 'bishop', hasData: false },
      { name: 'Tarrasch Variation', subtitle: '3.Nd2 — avoid doubled pawns', icon: 'knight', hasData: false },
    ],
  },
  // Coming Soon 1.e4
  {
    slug: 'scotch',
    name: 'Scotch Game',
    subtitle: 'An aggressive center-opening system for White',
    moves: '1.e4 e5 2.Nf3 Nc6 3.d4',
    description: 'Open the center immediately and fight for the initiative.',
    side: 'white',
    category: '1.e4',
    color: '#FFC800',
    colorDark: '#CC9E00',
    colorLight: '#ffd22e',
    ghostPiece: '♖',
    icon: 'rook',
    hasData: true,
    order: 7,
    mainLine: { name: 'Classical Scotch', subtitle: '3...exd4 4.Nxd4 — open the center · 9 lessons' },
    variations: [
      { name: 'Schmidt Variation', subtitle: '4...d5 — counter-gambit the center', icon: 'knight', hasData: false },
      { name: 'Steinitz Variation', subtitle: '4...Qh4 — queen sortie', icon: 'queen', hasData: false },
    ],
  },
  {
    slug: 'caro-kann',
    name: 'Caro-Kann',
    subtitle: 'A rock-solid low-theory defense against e4',
    moves: '1.e4 c6',
    description: 'Rock-solid defense with a clear plan. Easy to learn, hard to crack.',
    side: 'black',
    category: '1.e4',
    color: '#2FCBEF',
    colorDark: '#20A8D0',
    colorLight: '#54d4f2',
    ghostPiece: '♟',
    icon: 'shield',
    hasData: true,
    order: 8,
    mainLine: { name: 'Classical Variation', subtitle: '3...Bf5 — develop the bishop first' },
    variations: [],
  },
  {
    slug: 'kings-gambit',
    name: "King's Gambit",
    subtitle: 'The most aggressive gambit opening for White',
    moves: '1.e4 e5 2.f4',
    description: 'The most aggressive opening. Sacrifice f4 to rip open the center.',
    side: 'white',
    category: '1.e4',
    color: '#E03030',
    colorDark: '#B02020',
    colorLight: '#F05050',
    ghostPiece: '♔',
    icon: 'lightning',
    hasData: true,
    order: 10,
    mainLine: { name: 'King\'s Knight Gambit', subtitle: '2...exf4 3.Nf3 — the romantic attack · 9 lessons' },
    variations: [
      { name: 'Fischer Defense', subtitle: '3...d5 — counter-gambit the center', icon: 'knight', hasData: false },
      { name: 'Cunningham Defense', subtitle: '3...Be7 — tricky bishop check', icon: 'bishop', hasData: false },
    ],
  },
  // === 1.d4 OPENINGS ===
  {
    slug: 'london',
    name: 'London System',
    subtitle: 'A simple, reliable d4 system for White',
    moves: '1.d4 d5 2.Bf4',
    description: 'Simple, solid, and reliable. One setup to handle anything.',
    side: 'white',
    category: '1.d4',
    color: '#9060D8',
    colorDark: '#7040B0',
    colorLight: '#B080E8',
    ghostPiece: '♗',
    icon: 'pawn',
    hasData: true,
    order: 5,
    mainLine: {
      name: 'Standard Setup',
      subtitle: 'Bf4 + e3 + Nf3 — the pyramid · 9 lessons',
    },
    variations: [
      { name: 'vs King\'s Indian', subtitle: '...Nf6, ...g6 — handle the fianchetto', icon: 'knight', hasData: false },
      { name: 'vs ...c5', subtitle: 'Counter-strike the center', icon: 'shield', hasData: false },
    ],
  },
  {
    slug: 'queens-gambit',
    name: "Queen's Gambit Declined",
    subtitle: 'The principled classical defense against d4',
    moves: '1.d4 d5 2.c4 e6',
    description: 'The most principled response to 1.d4. Solid, strategic, timeless.',
    side: 'black',
    category: '1.d4',
    color: '#FF6B8B',
    colorDark: '#D85070',
    colorLight: '#FF8DA6',
    ghostPiece: '♛',
    icon: 'pawn',
    hasData: false,
    order: 6,
    mainLine: { name: 'Orthodox Defense', subtitle: '3.Nc3 Nf6 4.Bg5 Be7' },
    variations: [],
  },
  {
    slug: 'kings-indian',
    name: "King's Indian",
    subtitle: 'A dynamic counterattacking defense against d4',
    moves: '1.d4 Nf6 2.c4 g6',
    description: 'Let White build the center, then blow it up. The ultimate counterattack.',
    side: 'black',
    category: '1.d4',
    color: '#1CB0F6',
    colorDark: '#1490D0',
    colorLight: '#45bef8',
    ghostPiece: '♞',
    icon: 'knight',
    hasData: true,
    order: 9,
    mainLine: { name: 'Classical Variation', subtitle: '5...0-0 6.Be2 e5' },
    variations: [],
  },
]

// Helper: find opening by slug
export function getOpeningBySlug(slug: string) {
  return OPENINGS_REGISTRY.find(o => o.slug === slug)
}
