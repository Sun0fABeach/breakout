import { GameObjects } from 'phaser'

class BaseText extends GameObjects.Text {
  constructor (scene, x, y, text, fontSize) {
    super(scene, x, y, text, { fontSize, fontFamily: 'Courier New' })

    this.hide()
    scene.add.existing(this)
    this._scene = scene
  }

  hide () {
    this.setVisible(false)
  }

  show () {
    this.setVisible(true)
  }
}

export default BaseText
export { BaseText }
