import { Scene } from 'phaser'
import { numLevels } from '@/game/globals'
import { range, each } from 'lodash-es'

/* import assets via require, so Typescript doesn't complain. */

const spriteAtlas = require('@/game/assets/images/spritesheet.json')
const spriteSheet = require('@/game/assets/images/spritesheet.png')
const audioSpriteAtlas = require('@/game/assets/sounds/audiosprite.json')
const audioSpriteSheetOGG = require('@/game/assets/sounds/audiosprite.ogg')
const audioSpriteSheetMP3 = require('@/game/assets/sounds/audiosprite.mp3')

const blocks: string[] = []

each(range(1, numLevels + 1), idx => {
  // blocks[idx] = require(`@/game/assets/blocksDebug.json`)
  blocks[idx] = require(`@/game/assets/blocksLvl${idx}.json`)
})

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload (): void {
    each(range(1, numLevels + 1), idx => {
      /* this will trigger a warning "can't load external tilesets", which can
       * be ignored. we get the tiles from a separate spritesheet. */
      this.load.tilemapTiledJSON(`blocksLvl${idx}`, blocks[idx])
    })
    this.load.atlas(
      'spritesheet',
      spriteSheet,
      spriteAtlas
    )
    this.load.audioSprite(
      'audiosprite',
      audioSpriteAtlas,
      [audioSpriteSheetOGG, audioSpriteSheetMP3]
    )
  }

  create (): void {
    this.scene.start('PlayScene')
  }
}
