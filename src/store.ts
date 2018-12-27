import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    paused: false,
    gameState: null
  },
  mutations: {
    pause (state, active) {
      state.paused = active
    },
    changeGameState (state, newGameState) {
      state.gameState = newGameState
    }
  }
})
