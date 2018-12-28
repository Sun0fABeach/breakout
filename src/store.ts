import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

enum GameState {
  None,
  PrePlay,
  StartPlay,
  RestartPlay,
  Running,
  Paused,
  Lost,
  Won
}

export default new Vuex.Store({
  state: {
    gameState: GameState.None,
    paused: false,
    score: 0,
    scoreMultiplier: 1,
    lives: 3
  },
  mutations: {
    changeGameState (state, newGameState: GameState) {
      state.gameState = newGameState
    },
    pause (state, active: boolean) {
      state.paused = active
    },
    bumpScore (state, val) {
      state.score += val
    },
    resetScore (state) {
      state.score = 0
    },
    bumpScoreMultiplier (state, val) {
      state.scoreMultiplier += val
    },
    resetScoreMultiplier (state) {
      state.scoreMultiplier = 1
    },
    loseLife (state) {
      state.lives--
    },
    resetLives (state) {
      state.lives = 3
    }
  }
})

export { GameState }
