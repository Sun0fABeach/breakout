import store, { GameState } from '@/store'

interface stateChangeObj {
  readonly type: string,
  readonly payload: GameState
}

class Store {
  /** getters **/
  static get muted (): boolean {
    return store.state.muted
  }
  static get level (): number {
    return store.state.level
  }
  static get lives (): number {
    return store.state.lives
  }
  static get scoreMultiplier (): number {
    return store.state.scoreMultiplier
  }

  /** listeners to state changes **/
  static onGameStateChange (state: GameState, handler: () => void) {
    store.subscribe(({ type, payload: newState }: stateChangeObj) => {
      if (type === 'changeGameState' && newState === state) {
        handler()
      }
    })
  }

  /** mutations **/
  static changeGameState (newState: GameState): void {
    store.commit('changeGameState', newState)
  }

  static toggleMute (): void {
    store.commit('toggleMute')
  }

  static bumpScore (points: number): void {
    store.commit('bumpScore', points)
  }

  static resetScore (): void {
    store.commit('resetScore')
  }

  static bumpScoreMultiplier (bump: number): void {
    store.commit('bumpScoreMultiplier', bump)
  }

  static resetScoreMultiplier (): void {
    store.commit('resetScoreMultiplier')
  }

  static nextLevel (): void {
    store.commit('nextLevel')
  }

  static resetLevel (): void {
    store.commit('resetLevel')
  }

  static loseLife (): void {
    store.commit('loseLife')
  }

  static resetLives (): void {
    store.commit('resetLives')
  }
}

export default Store
export { Store, GameState }
