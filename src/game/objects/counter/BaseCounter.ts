import comms from '@/vuePhaserComms'

abstract class BaseCounter {
  private countCurrent: number

  constructor (private readonly countTotal: number) {
    this.countCurrent = countTotal
    this._emit()
  }

  increment (val: number = 1): void {
    this.countCurrent += val
    this._emit()
  }

  decrement (val: number = 1): void {
    this.countCurrent -= val
    this._emit()
  }

  reset (): void {
    this.countCurrent = this.countTotal
    this._emit()
  }

  _emit (eventName: string = 'count change'): void {
    comms.emit(eventName, this.countCurrent)
  }

  get number (): number {
    return this.countCurrent
  }
}

export default BaseCounter
export { BaseCounter }
