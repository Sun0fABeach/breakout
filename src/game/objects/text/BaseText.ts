import { GameObjects } from 'phaser'

abstract class BaseText extends GameObjects.Text {
  _scene: Phaser.Scene

  constructor (
    scene: Phaser.Scene, x: number, y: number,
    text: string, fontSize: string
  ) {
    super(scene, x, y, text, { fontSize, fontFamily: 'Courier New' })

    this.hide()
    scene.add.existing(this)
    this._scene = scene
  }

  hide (): void {
    this.setVisible(false)
  }

  show (): void {
    this.setVisible(true)
  }
}

export default BaseText
export { BaseText }
