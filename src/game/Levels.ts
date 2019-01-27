import Blocks from '@/game/objects/Blocks'
import { numLevels } from '@/game/globals'
import store from '@/store'

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
    return store.state.level < numLevels
  }

  static next (): Blocks {
    return new Blocks(Levels.scene, Levels.tileMaps[store.state.level])
  }
}

export default Levels
export { Levels }