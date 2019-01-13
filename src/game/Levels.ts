import Blocks from '@/game/objects/Blocks'
import { numLevels } from '@/game/globals'

class Levels {
  private current: number
  private readonly tileMaps: Phaser.Tilemaps.Tilemap[]

  constructor (private readonly scene: Scene) {
    this.current = 0
    this.tileMaps = []
  }

  init (): void {
    for (let i: number = this.current; i <= numLevels; ++i) {
      this.tileMaps[i] = this.scene.add.tilemap(`blocksLvl${i}`)
    }
  }

  next (): Blocks | null {
    if (this.current === numLevels) {
      return null
    }
    this.current++
    return new Blocks(this.scene, this.tileMaps[this.current])
  }

  reset (): Blocks {
    this.current = 0
    return this.next() as Blocks // will not be null
  }
}

export default Levels
export { Levels }