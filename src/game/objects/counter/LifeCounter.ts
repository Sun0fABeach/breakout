import BaseCounter from './BaseCounter'

class LifeCounter extends BaseCounter {
  constructor (lives = 3) {
    super(lives)
  }

  emit (): void {
    super.emit('life change')
  }
}

export default LifeCounter
export { LifeCounter }
