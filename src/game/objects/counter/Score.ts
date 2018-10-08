import BaseCounter from './BaseCounter'

class Score extends BaseCounter {
  constructor (startingScore = 0) {
    super(startingScore)
  }

  _emit (): void {
    super._emit('score change')
  }
}

export default Score
export { Score }
