import comms from '@/vuePhaserComms'

class Score {
  constructor (startingScore = 0) {
    this._startingScore = startingScore
    this._scoreCurrent = this._startingScore
    this._emit()
  }

  increment (val) {
    this._scoreCurrent += val
    this._emit()
  }

  reset () {
    this._scoreCurrent = this._startingScore
    this._emit()
  }

  _emit () {
    comms.emit('score change', this._scoreCurrent)
  }

  get number () {
    return this._scoreCurrent
  }
}

export default Score
export { Score }
