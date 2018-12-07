import { Scene } from 'phaser'
import comms from '@/vuePhaserComms'

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'StartScene' })
  }

  create (): void {
    this.add.image(400, 300, 'sky')

    comms.emit('start scene', true)
    comms.once('play scene', () => this.scene.start('PlayScene'))
  }
}
