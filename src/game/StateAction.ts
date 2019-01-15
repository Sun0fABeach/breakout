import store, { GameState } from '@/store'

interface stateChangeObj {
  readonly type: string,
  readonly payload: GameState
}

class StateAction {
  static change (newState: GameState) {
    store.commit('changeGameState', newState)
  }

  static addHandler (state: GameState, handler: () => void) {
    store.subscribe(({ type, payload: newState }: stateChangeObj) => {
      if (type === 'changeGameState' && newState === state) {
        handler()
      }
    })
  }
}

export default StateAction
export { StateAction }
