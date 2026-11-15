// Which chess.com player the research scripts read. Default is witty_alien
// (the original trick-weapon arsenal, cached in data/witty-games/). Set
// PLAYER=<username> to research anyone else; their games cache under
// data/player-games/<username>/ (gitignored).
import { join } from 'path'

export const PLAYER = (process.env.PLAYER ?? 'witty_alien').toLowerCase()
export const GAMES_DIR = PLAYER === 'witty_alien'
  ? join(process.cwd(), 'data', 'witty-games')
  : join(process.cwd(), 'data', 'player-games', PLAYER)
export const TIME_CLASS = process.env.TIME_CLASS?.toLowerCase() || null
