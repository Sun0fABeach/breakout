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

  static next (): Blocks | null {
    if (store.state.level === numLevels) {
      return null
    }
    store.commit('nextLevel')
    return new Blocks(Levels.scene, Levels.tileMaps[store.state.level])
  }

  static reset (): Blocks {
    store.commit('resetLevel')
    return Levels.next() as Blocks // will not be null
  }
}

export default Levels
export { Levels }