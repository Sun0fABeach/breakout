import Blocks from '@/game/objects/Blocks'
import { numLevels } from '@/game/globals'
import Store from '@/game/Store'

class Levels {
  private static scene: Scene
  private static readonly tileMaps: Phaser.Tilemaps.Tilemap[] = []

  static init (scene: Scene): void {
    Levels.scene = scene
    for (let i: number = 1; i <= numLevels; ++i) {
      Levels.tileMaps[i] = scene.add.tilemap(`blocksLvl${i}`)
    }
  }

  static hasNext (): Boolean {
    return Store.level < numLevels
  }

  static next (): Blocks {
    return new Blocks(Levels.scene, Levels.tileMaps[Store.level])
  }
}

export default Levels
export { Levels }