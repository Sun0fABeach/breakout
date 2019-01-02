import { Scene } from 'phaser'

/* import assets via require, so Typescript doesn't complain. */

const spriteAtlas = require('@/game/assets/images/spritesheet.json')
const spriteSheet = require('@/game/assets/images/spritesheet.png')
const audioSpriteAtlas = require('@/game/assets/sounds/audiosprite.json')
const audioSpriteSheetOGG = require('@/game/assets/sounds/audiosprite.ogg')
const audioSpriteSheetMP3 = require('@/game/assets/sounds/audiosprite.mp3')

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload (): void {
    this.load.atlas(
      'sprites',
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
