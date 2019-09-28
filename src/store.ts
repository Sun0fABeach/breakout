import Vue from 'vue'
import Vuex from 'vuex'
import scoresDb, { ScoreData, RankedScoreData } from '@/scoresDb'

Vue.use(Vuex)

enum GameState {
  None,
  PrePlay,
  StartPlay,
  RestartPlay,
  NextLevel,
  Running,
  Paused,
  Lost,
  Won
}

/* dict of base values to which states (with same name) can be reset */
const baseVals = {
  score: 0,
  scoreMultiplier: 1,
  lives: 3,
  level: 1
}

export default new Vuex.Store({
  state: {
    gameState: GameState.None,
    paused: false,
    muted: false,
    ...baseVals
  },
  actions: {
    async getRankedHighscores (): Promise<RankedScoreData[]> {
      return scoresDb.getRankedHighscores()
    },
    async addHighscore (context, toAdd: ScoreData): Promise<void> {
      await scoresDb.addHighscore(toAdd)
    }
  },
  mutations: {
    changeGameState (state, newGameState: GameState) {
      state.gameState = newGameState
    },

    pause (state, active: boolean) {
      state.paused = active
    },
    toggleMute (state) {
      state.muted = !state.muted
    },
    bumpScore (state, val: number) {
      state.score += val
    },
    resetScore (state) {
      state.score = baseVals.score
    },
    bumpScoreMultiplier (state, val: number) {
      state.scoreMultiplier += val
    },
    resetScoreMultiplier (state) {
      state.scoreMultiplier = baseVals.scoreMultiplier
    },
    loseLife (state) {
      state.lives--
    },
    resetLives (state) {
      state.lives = baseVals.lives
    },
    nextLevel (state) {
      state.level++
    },
    resetLevel (state) {
      state.level = baseVals.level
    }
  }
})

export { GameState }
