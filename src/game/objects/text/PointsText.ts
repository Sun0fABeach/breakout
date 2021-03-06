import BaseText from './BaseText'
import Phaser from 'phaser'

class PointsText extends BaseText {
  constructor (scene: Scene) {
    super(scene, 0, 0, '', {
      fontSize: '1.25rem',
      fontFamily: 'Arial',
      color: '#fff',
      strokeThickness: 0.5
    })
    this.setOrigin(0.5)
  }

  setDisplay (x: number, y: number, points: number): void {
    this.setText(points.toString())
    this.setPosition(x, y)
  }

  show (): Promise<undefined> {
    return new Promise(resolve => {
      this.setAlpha(1)
      super.show()

      this.scene.tweens.add({
        targets: this,
        y: this.y - 10,
        ease: Phaser.Math.Easing.Linear,
        duration: 800,
        onComplete: () => {
          this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 300,
            ease: Phaser.Math.Easing.Linear,
            onComplete: resolve
          })
        }
      })
    })
  }
}

export default PointsText
export { PointsText }
