import { GameObjects } from 'phaser'

abstract class BaseText extends GameObjects.Text {
  constructor (
    scene: Scene, x: number, y: number,
    text: string, config: Object
  ) {
    super(scene, x, y, text, config)

    this.hide()
    scene.add.existing(this)
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
