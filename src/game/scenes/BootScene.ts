import { Scene } from 'phaser'

/* import assets via require, so Typescript doesn't complain. */

const spriteAtlasBlocks = require('@/game/assets/images/spritesheetBlocks.json')
const spriteSheetBlocks = require('@/game/assets/images/spritesheetBlocks.png')
const spriteAtlasOther = require('@/game/assets/images/spritesheetOther.json')
const spriteSheetOther = require('@/game/assets/images/spritesheetOther.png')
const audioSpriteAtlas = require('@/game/assets/sounds/audiosprite.json')
const audioSpriteSheetOGG = require('@/game/assets/sounds/audiosprite.ogg')
const audioSpriteSheetMP3 = require('@/game/assets/sounds/audiosprite.mp3')

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload (): void {
    this.load.atlas(
      'blocks',
      spriteSheetBlocks,
      spriteAtlasBlocks
    )
    this.load.atlas(
      'other',
      spriteSheetOther,
      spriteAtlasOther
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
