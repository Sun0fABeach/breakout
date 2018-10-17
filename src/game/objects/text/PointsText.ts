import BaseText from './BaseText'

class PointsText extends BaseText {
  constructor (scene: Scene) {
    super(scene, 0, 0, '', {
      fontSize: '1.25rem',
      fontFamily: 'monospace',
      color: '#fff'
    })
    this.setOrigin(0.5)
  }

  setDisplay (x: number, y: number, points: number): void {
    this.setText(points.toString())
    this.setPosition(x, y)
  }

  show (callback?: () => any): void {
    super.show()
    if (callback) {
      callback()
    }
  }
}

export default PointsText
export { PointsText }
