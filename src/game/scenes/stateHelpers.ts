import store, { GameState } from '@/store'

function changeGameState (newState: GameState) {
  store.commit('changeGameState', newState)
}

interface stateChangeObj {
  type: string,
  payload: GameState
}

function addGameStateHandler (state: GameState, handler: () => void) {
  store.subscribe(({ type, payload: newState }: stateChangeObj) => {
    if (type === 'changeGameState' && newState === state) {
      handler()
    }
  })
}

export {
  changeGameState,
  addGameStateHandler
}
