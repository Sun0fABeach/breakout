import BaseText from './BaseText'

class GameOver extends BaseText {
  _worldCenter: { x: number, y: number }

  constructor (scene: Phaser.Scene) {
    super(scene, 0, 0, 'Game Over', '4rem')
    const worldDimensions: { width: number, height: number } =
      scene.physics.world.bounds
    this._worldCenter = {
      x: worldDimensions.width / 2,
      y: worldDimensions.height / 2
    }
    this.setPosition(this._worldCenter.x, this._worldCenter.y)
    this.setOrigin(0.5)
  }

  show (finishCb?: () => any): void {
    this.setScale(0)

    this._scene.tweens.add({
      targets: this,
      scaleX: 1.3,
      scaleY: 1.3,
      angle: 360 * 2,
      ease: 'Power1',
      duration: 500,
      onComplete: () => {
        this.setShadow(0, 0, 'lightGrey', 6)
        this._scene.tweens.add({
          targets: this,
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: 'Linear',
          onComplete: finishCb
        })
      }
    })

    super.show()
  }
}

export default GameOver
export { GameOver }
