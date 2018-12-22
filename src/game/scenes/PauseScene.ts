import { Scene } from 'phaser'
import comms from '@/vuePhaserComms'
import { keys } from '@/game/globals'

export default class PauseScene extends Scene {
  constructor () {
    super({ key: 'PauseScene' })
  }

  create (): void {
    this.input.keyboard.on(keys.pause, () => comms.emit('resume'))
    comms.on('resume', this.resume.bind(this))
  }

  private resume (): void {
    this.scene.pause()
    this.scene.resume('PlayScene')
  }
}
