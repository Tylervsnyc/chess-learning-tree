// Fetches a player's monthly game archives from the chess.com public API and
// caches each month as raw JSON (gitignored). Default player: witty_alien,
// cached under data/witty-games/. Any other player: PLAYER=<username>, cached
// under data/player-games/<username>/.
// Usage: [PLAYER=hikaru] npx tsx scripts/witty/fetch-archives.ts [monthsBack=24]
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PLAYER as USER, GAMES_DIR as OUT } from './lib/player'

const UA = 'chesspath-opening-research/1.0'
const monthsBack = parseInt(process.argv[2] ?? '24', 10)

async function get(url: string) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

async function main() {
  mkdirSync(OUT, { recursive: true })
  const { archives } = (await get(`https://api.chess.com/pub/player/${USER}/games/archives`)) as { archives: string[] }
  const recent = archives.slice(-monthsBack)
  console.log(`Fetching ${recent.length} of ${archives.length} archives (last ${monthsBack} months)...`)
  let games = 0
  for (const url of recent) {
    const m = url.split('/').slice(-2).join('-') // YYYY-MM
    const file = join(OUT, `${m}.json`)
    if (existsSync(file)) {
      const cached = require(file)
      games += cached.games?.length ?? 0
      console.log(`  ${m}: cached (${cached.games?.length ?? 0})`)
      continue
    }
    const data = (await get(url)) as { games: any[] }
    writeFileSync(file, JSON.stringify(data))
    games += data.games.length
    console.log(`  ${m}: ${data.games.length} games`)
  }
  console.log(`Done. ~${games} games cached in ${OUT}`)
}
main().catch(e => { console.error(e); process.exit(1) })
