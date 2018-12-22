import BaseCounter from './BaseCounter'

class Score extends BaseCounter {
  constructor (startingScore = 0) {
    super(startingScore)
  }

  emit (): void {
    super.emit('score change')
  }
}

export default Score
export { Score }
