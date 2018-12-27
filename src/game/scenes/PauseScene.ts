import { Scene } from 'phaser'
import { keys } from '@/game/globals'
import { changeGameState, addGameStateHandler } from './stateHelpers'

export default class PauseScene extends Scene {
  constructor () {
    super({ key: 'PauseScene' })
  }

  create (): void {
    this.input.keyboard.on(
      keys.pause,
      () => changeGameState('running')
    )
    addGameStateHandler('running', this.resume.bind(this))
  }

  private resume (): void {
    this.scene.pause()
    this.scene.resume('PlayScene')
  }
}
