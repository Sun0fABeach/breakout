import { Scene } from 'phaser'

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'StartScene' })
  }

  create (): void {
    this.add.image(400, 300, 'sky')

    this.scene.start('PlayScene')
  }
}
