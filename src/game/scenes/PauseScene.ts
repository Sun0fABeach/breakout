import { Scene } from 'phaser'
import comms from '@/vuePhaserComms'
import { keys } from '@/game/globals'

export default class PauseScene extends Scene {
  constructor () {
    super({ key: 'PauseScene' })
  }

  create (): void {
    this.input.keyboard.on(keys.pause, () => {
      this.resume()
      comms.emit('pauseKey') // emitted for control panel to adjust
    })
    comms.on('resume', () => this.resume())
  }

  resume (): void {
    this.scene.pause()
    this.scene.resume('PlayScene')
  }
}
