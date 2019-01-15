import Blocks from '@/game/objects/Blocks'
import { numLevels } from '@/game/globals'

class Levels {
  private static scene: Scene
  private static current: number = 0
  private static readonly tileMaps: Phaser.Tilemaps.Tilemap[] = []

  static init (scene: Scene): void {
    Levels.scene = scene
    for (let i: number = 1; i <= numLevels; ++i) {
      Levels.tileMaps[i] = scene.add.tilemap(`blocksLvl${i}`)
    }
  }

  static next (): Blocks | null {
    if (Levels.current === numLevels) {
      return null
    }
    Levels.current++
    return new Blocks(Levels.scene, Levels.tileMaps[Levels.current])
  }

  static reset (): Blocks {
    Levels.current = 0
    return Levels.next() as Blocks // will not be null
  }
}

export default Levels
export { Levels }