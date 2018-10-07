import BaseCounter from './BaseCounter'

class LifeCounter extends BaseCounter {
  constructor (lives = 3) {
    super(lives)
  }

  _emit () {
    super._emit('life change')
  }
}

export default LifeCounter
export { LifeCounter }
