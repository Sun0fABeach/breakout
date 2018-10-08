import comms from '@/vuePhaserComms'

abstract class BaseCounter {
  _countTotal: number
  _countCurrent: number

  constructor (total: number) {
    this._countTotal = total
    this._countCurrent = this._countTotal
    this._emit()
  }

  increment (val: number = 1): void {
    this._countCurrent += val
    this._emit()
  }

  decrement (val: number = 1): void {
    this._countCurrent -= val
    this._emit()
  }

  reset (): void {
    this._countCurrent = this._countTotal
    this._emit()
  }

  _emit (eventName: string = 'count change'): void {
    comms.emit(eventName, this._countCurrent)
  }

  get number (): number {
    return this._countCurrent
  }
}

export default BaseCounter
export { BaseCounter }
