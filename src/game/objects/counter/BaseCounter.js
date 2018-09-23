import comms from '@/vuePhaserComms'

class BaseCounter {
  constructor (total) {
    this._countTotal = total
    this._countCurrent = this._countTotal
    this._emit()
  }

  increment (val = 1) {
    this._countCurrent += val
    this._emit()
  }

  decrement (val = 1) {
    this._countCurrent -= val
    this._emit()
  }

  reset () {
    this._countCurrent = this._countTotal
    this._emit()
  }

  _emit (eventName = 'count change') {
    comms.emit(eventName, this._countCurrent)
  }

  get number () {
    return this._countCurrent
  }
}

export default BaseCounter
export { BaseCounter }
