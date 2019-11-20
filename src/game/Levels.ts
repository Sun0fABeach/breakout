import Blocks from '@/game/objects/Blocks'
import { numLevels } from '@/game/globals'
import Store from '@/game/Store'
import { each, range } from 'lodash-es'

class Levels {
  private static scene: Scene
  private static readonly tileMaps: Phaser.Tilemaps.Tilemap[] = []

  static init (scene: Scene): void {
    Levels.scene = scene
    each(range(1, numLevels + 1), idx => {
      Levels.tileMaps[idx] = scene.add.tilemap(`blocksLvl${idx}`)
    })
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