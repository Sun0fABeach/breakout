import { Scene } from 'phaser'
import { numLevels } from '@/game/globals'

/* import assets via require, so Typescript doesn't complain. */

const spriteAtlas = require('@/game/assets/images/spritesheet.json')
const spriteSheet = require('@/game/assets/images/spritesheet.png')
const audioSpriteAtlas = require('@/game/assets/sounds/audiosprite.json')
const audioSpriteSheetOGG = require('@/game/assets/sounds/audiosprite.ogg')
const audioSpriteSheetMP3 = require('@/game/assets/sounds/audiosprite.mp3')

const blocks: string[] = []

for (let i = 1; i <= numLevels; ++i) {
  // blocks[i] = require(`@/game/assets/blocksDebug.json`)
  blocks[i] = require(`@/game/assets/blocksLvl${i}.json`)
}

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload (): void {
    for (let i = 1; i <= numLevels; ++i) {
      this.load.tilemapTiledJSON(`blocksLvl${i}`, blocks[i])
    }
    this.load.atlas(
      'spritesheet',
      spriteSheet,
      spriteAtlas
    )
    this.load.audioSprite(
      'audiosprites',
      audioSpriteAtlas,
      [audioSpriteSheetOGG, audioSpriteSheetMP3]
    )
  }

  create (): void {
    this.scene.start('PlayScene')
  }
}
