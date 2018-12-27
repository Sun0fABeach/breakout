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
    paused: false,
    gameState: GameState.None
  },
  mutations: {
    pause (state, active: boolean) {
      state.paused = active
    },
    changeGameState (state, newGameState: GameState) {
      state.gameState = newGameState
    }
  }
})

export { GameState }
