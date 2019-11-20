import Dexie from 'dexie'
import { map, sortBy, reverse } from 'lodash-es'

interface ScoreData {
  name: string,
  score: number
}

interface RankedScoreData extends ScoreData {
  rank: number
}

const scoresDb: Dexie = new Dexie('highscores')
scoresDb.version(1).stores({ highscores: '++' })

async function getRankedHighscores (): Promise<RankedScoreData[]> {
  const scores: ScoreData[] = await scoresDb.table('highscores').toArray()
  return map(reverse(sortBy(scores, 'score')),
    (entry: ScoreData, idx: number) => ({
      ...entry, rank: idx + 1
    })
  )
}

async function addHighscore (newScore: ScoreData): Promise<void> {
  await scoresDb.table('highscores').add(newScore)
}

export { ScoreData, RankedScoreData }
export default { getRankedHighscores, addHighscore }
