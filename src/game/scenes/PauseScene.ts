import { Scene } from 'phaser'
import { keys } from '@/game/globals'
import Store, { GameState } from '@/game/Store'

export default class PauseScene extends Scene {
  constructor () {
    super({ key: 'PauseScene' })
  }

  create (): void {
    this.input.keyboard.on(
      keys.pause,
      () => Store.changeGameState(GameState.Running)
    )
    Store.onGameStateChange(GameState.Running, this.resume.bind(this))
  }

  private resume (): void {
    this.scene.pause()
    this.scene.resume('PlayScene')
  }
}
