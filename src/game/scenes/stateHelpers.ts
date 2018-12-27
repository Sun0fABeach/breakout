import store from '@/store'

function changeGameState (newState: string) {
  store.commit('changeGameState', newState)
}

interface stateChangeObj {
  type: string,
  payload: string
}

function addGameStateHandler (state: string, handler: () => void) {
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
