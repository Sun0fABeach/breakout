import Dexie from 'dexie'

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
  scores.sort((a: ScoreData, b: ScoreData) =>
    a.score < b.score ? 1 : a.score > b.score ? -1 : 0
  )
  return scores.map((entry: ScoreData, idx: number) => ({
    ...entry, rank: idx + 1
  }))
}

async function addHighscore (newScore: ScoreData): Promise<void> {
  await scoresDb.table('highscores').add(newScore)
}

export { ScoreData, RankedScoreData }
export default { getRankedHighscores, addHighscore }
