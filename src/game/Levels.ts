import Blocks from '@/game/objects/Blocks'
import { numLevels } from '@/game/globals'

class Levels {
  private currentLvl: number
  private readonly tileMaps: Phaser.Tilemaps.Tilemap[]

  constructor (private readonly scene: Scene) {
    this.currentLvl = 0
    this.tileMaps = []
  }

  init (): void {
    for (let i: number = 1; i <= numLevels; ++i) {
      this.tileMaps[i] = this.scene.add.tilemap(`blocksLvl${i}`)
    }
  }

  next (): Blocks | null {
    if (this.currentLvl === numLevels) {
      return null
    }
    this.currentLvl++
    return new Blocks(this.scene, this.tileMaps[this.currentLvl])
  }

  reset (): Blocks {
    this.currentLvl = 0
    return this.next() as Blocks // will not be null
  }
}

export default Levels
export { Levels }