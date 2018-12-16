import { Scene } from 'phaser'

/* import assets via require, so Typescript doesn't complain. */

const sky = require('@/game/assets/sky.png')

const paddle = require('@/game/assets/paddleRed.png')
const ball = require('@/game/assets/ballGrey.png')

const blockGreen = require('@/game/assets/blockGreen.png')
const blockGrey = require('@/game/assets/blockGrey.png')
const blockPurple = require('@/game/assets/blockPurple.png')
const blockRed = require('@/game/assets/blockRed.png')
const blockYellow = require('@/game/assets/blockYellow.png')

const particleStarSmall = require('@/game/assets/particles/starSmall.png')
const particleStarMedium = require('@/game/assets/particles/starMedium.png')
const particleStarBig = require('@/game/assets/particles/starBig.png')
const puff = require('@/game/assets/particles/whitePuff.png')

const thudOGG = require('@/game/assets/sounds/thud.ogg')
const thudMP3 = require('@/game/assets/sounds/thud.mp3')
const explosionOGG = require('@/game/assets/sounds/explosion.ogg')
const explosionMP3 = require('@/game/assets/sounds/explosion.mp3')
const woodenOGG = require('@/game/assets/sounds/wooden.ogg')
const woodenMP3 = require('@/game/assets/sounds/wooden.mp3')
const dingOGG = require('@/game/assets/sounds/ding.ogg')
const dingMP3 = require('@/game/assets/sounds/ding.mp3')

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload (): void {
    this.load.image('sky', sky)
    this.load.image('paddle', paddle)
    this.load.image('ball', ball)
    this.load.image('particleStarSmall', particleStarSmall)
    this.load.image('particleStarMedium', particleStarMedium)
    this.load.image('particleStarBig', particleStarBig)
    this.load.image('puff', puff)

    this.load.image('blockGreen', blockGreen)
    this.load.image('blockGrey', blockGrey)
    this.load.image('blockPurple', blockPurple)
    this.load.image('blockRed', blockRed)
    this.load.image('blockYellow', blockYellow)

    this.load.audio('thud', [thudMP3, thudOGG])
    this.load.audio('explosion', [explosionMP3, explosionOGG])
    this.load.audio('wooden', [woodenMP3, woodenOGG])
    this.load.audio('ding', [dingMP3, dingOGG])
  }

  create (): void {
    this.scene.start('PlayScene')
  }
}
