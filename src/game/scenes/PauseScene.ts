import { Scene } from 'phaser'
import store from '@/store'
import { keys } from '@/game/globals'

export default class PauseScene extends Scene {
  constructor () {
    super({ key: 'PauseScene' })
  }

  create (): void {
    this.input.keyboard.on(
      keys.pause,
      () => store.commit('changeGameState', 'running')
    )
    store.subscribe(({ type, payload: newState }) => {
      if (type === 'changeGameState' && newState === 'running') {
        this.resume()
      }
    })
  }

  private resume (): void {
    this.scene.pause()
    this.scene.resume('PlayScene')
  }
}
