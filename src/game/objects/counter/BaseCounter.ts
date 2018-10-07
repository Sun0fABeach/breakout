import comms from '@/vuePhaserComms'

class BaseCounter {
  _countTotal : number
  _countCurrent : number

  constructor (total : number) {
    this._countTotal = total
    this._countCurrent = this._countTotal
    this._emit()
  }

  increment (val : number = 1) {
    this._countCurrent += val
    this._emit()
  }

  decrement (val : number = 1) {
    this._countCurrent -= val
    this._emit()
  }

  reset () {
    this._countCurrent = this._countTotal
    this._emit()
  }

  _emit (eventName : string = 'count change') {
    comms.emit(eventName, this._countCurrent)
  }

  get number () {
    return this._countCurrent
  }
}

export default BaseCounter
export { BaseCounter }
