import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface ScoreData {
  name: string,
  score: number
}

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
    highscores: [] as ScoreData[],
    gameState: GameState.None,
    paused: false,
    ...baseVals
  },
  mutations: {
    changeGameState (state, newGameState: GameState) {
      state.gameState = newGameState
    },

    pause (state, active: boolean) {
      state.paused = active
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
    },

    addHighscore (state, scoreData: ScoreData) {
      state.highscores.push(scoreData)
    }
  }
})

export { GameState }
