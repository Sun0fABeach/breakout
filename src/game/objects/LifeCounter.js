import comms from '@/vuePhaserComms'

class LifeCounter {
  constructor (lives = 3) {
    this._livesTotal = lives
    this._livesCurrent = this._livesTotal
    this._emit()
  }

  decrement () {
    this._livesCurrent--
    this._emit()
  }

  reset () {
    this._livesCurrent = this._livesTotal
    this._emit()
  }

  _emit () {
    comms.emit('life change', this._livesCurrent)
  }

  get number () {
    return this._livesCurrent
  }
}

export default LifeCounter
export { LifeCounter }
