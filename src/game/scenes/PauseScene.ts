import { Scene } from 'phaser'
import { keys } from '@/game/globals'
import { GameState } from '@/store'
import StateAction from '@/game/StateAction'

export default class PauseScene extends Scene {
  constructor () {
    super({ key: 'PauseScene' })
  }

  create (): void {
    this.input.keyboard.on(
      keys.pause,
      () => StateAction.change(GameState.Running)
    )
    StateAction.addHandler(GameState.Running, this.resume.bind(this))
  }

  private resume (): void {
    this.scene.pause()
    this.scene.resume('PlayScene')
  }
}
