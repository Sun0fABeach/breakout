import { Scene } from 'phaser'

/* import assets via require, so Typescript doesn't complain. */

const spriteAtlas = require('@/game/assets/images/spritesheet.json')
const spriteSheet = require('@/game/assets/images/spritesheet.png')

const thudOGG = require('@/game/assets/sounds/thud.ogg')
const thudMP3 = require('@/game/assets/sounds/thud.mp3')
const explosionOGG = require('@/game/assets/sounds/explosion.ogg')
const explosionMP3 = require('@/game/assets/sounds/explosion.mp3')
const woodenOGG = require('@/game/assets/sounds/wooden.ogg')
const woodenMP3 = require('@/game/assets/sounds/wooden.mp3')
const dingOGG = require('@/game/assets/sounds/ding.ogg')
const dingMP3 = require('@/game/assets/sounds/ding.mp3')
const letsGoOGG = require('@/game/assets/sounds/lets-go.ogg')
const letsGoMP3 = require('@/game/assets/sounds/lets-go.mp3')
const ohNoOGG = require('@/game/assets/sounds/oh-no.ogg')
const ohNoMP3 = require('@/game/assets/sounds/oh-no.mp3')
const ohYeahOGG = require('@/game/assets/sounds/oh-yeah.ogg')
const ohYeahMP3 = require('@/game/assets/sounds/oh-yeah.mp3')
const swishOGG = require('@/game/assets/sounds/swish.ogg')
const swishMP3 = require('@/game/assets/sounds/swish.mp3')
const gongOGG = require('@/game/assets/sounds/gong.ogg')
const gongMP3 = require('@/game/assets/sounds/gong.mp3')

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload (): void {
    this.load.atlas('sprites', spriteSheet, spriteAtlas)

    this.load.audio('thud', [thudMP3, thudOGG])
    this.load.audio('explosion', [explosionMP3, explosionOGG])
    this.load.audio('wooden', [woodenMP3, woodenOGG])
    this.load.audio('ding', [dingMP3, dingOGG])
    this.load.audio('letsGo', [letsGoMP3, letsGoOGG])
    this.load.audio('ohNo', [ohNoMP3, ohNoOGG])
    this.load.audio('ohYeah', [ohYeahMP3, ohYeahOGG])
    this.load.audio('swish', [swishMP3, swishOGG])
    this.load.audio('gong', [gongMP3, gongOGG])
  }

  create (): void {
    this.scene.start('PlayScene')
  }
}
