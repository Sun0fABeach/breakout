import BaseText from './BaseText'

class GameOver extends BaseText {
  private readonly worldCenter: { x: number, y: number }

  constructor (scene: Scene) {
    super(scene, 0, 0, 'Game Over', {
      fontSize: '4rem',
      fontFamily: 'Courier New'
    })

    const worldDimensions: { width: number, height: number } =
      scene.physics.world.bounds
    this.worldCenter = {
      x: worldDimensions.width / 2,
      y: worldDimensions.height / 2
    }
    this.setPosition(this.worldCenter.x, this.worldCenter.y)
    this.setOrigin(0.5)
  }

  show (finishCb?: () => any): void {
    this.setScale(0)

    this.scene.tweens.add({
      targets: this,
      scaleX: 1.3,
      scaleY: 1.3,
      angle: 360 * 2,
      ease: 'Power1',
      duration: 500,
      onComplete: () => {
        this.setShadow(0, 0, 'lightGrey', 6)
        this.scene.tweens.add({
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
