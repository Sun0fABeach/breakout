import comms from '@/vuePhaserComms'

abstract class BaseCounter {
  private countCurrent: number

  constructor (private readonly countTotal: number) {
    this.countCurrent = countTotal
    this.emit()
  }

  increment (val: number = 1): void {
    this.countCurrent += val
    this.emit()
  }

  decrement (val: number = 1): void {
    this.countCurrent -= val
    this.emit()
  }

  reset (): void {
    this.countCurrent = this.countTotal
    this.emit()
  }

  protected emit (eventName: string = 'count change'): void {
    comms.emit(eventName, this.countCurrent)
  }

  get number (): number {
    return this.countCurrent
  }
}

export default BaseCounter
export { BaseCounter }
