import BaseText from './BaseText'

class LifeCounter extends BaseText {
  constructor (scene) {
    super(scene, 10, 10, '', '1.5rem')
    this._livesTotal = 2
    this._livesCurrent = this._livesTotal
    this.setText()
  }

  loseLife () {
    this._livesCurrent--
    this.setText()
  }

  reset () {
    this._livesCurrent = this._livesTotal
    this.setText()
  }

  show () {
    this.setText()
    super.show()
  }

  setText () {
    super.setText(`Lives: ${this._livesCurrent}`)
  }

  get atZero () {
    return this._livesCurrent === 0
  }
}

export default LifeCounter
export { LifeCounter }
