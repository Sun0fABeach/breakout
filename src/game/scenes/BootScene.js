import { Scene } from 'phaser'

import sky from '@/game/assets/sky.png'

import paddle from '@/game/assets/paddleRed.png'
import ball from '@/game/assets/ballGrey.png'

import blockGreen from '@/game/assets/blockGreen.png'
import blockGrey from '@/game/assets/blockGrey.png'
import blockPurple from '@/game/assets/blockPurple.png'
import blockRed from '@/game/assets/blockRed.png'
import blockYellow from '@/game/assets/blockYellow.png'

import particleStarSmall from '@/game/assets/particles/starSmall.png'
import particleStarMedium from '@/game/assets/particles/starMedium.png'
import particleStarBig from '@/game/assets/particles/starBig.png'
import puff from '@/game/assets/particles/whitePuff.png'

import thudOGG from '@/game/assets/sounds/thud.ogg'
import thudMP3 from '@/game/assets/sounds/thud.mp3'
import explosionOGG from '@/game/assets/sounds/explosion.ogg'
import explosionMP3 from '@/game/assets/sounds/explosion.mp3'
import woodenOGG from '@/game/assets/sounds/wooden.ogg'
import woodenMP3 from '@/game/assets/sounds/wooden.mp3'
import dingOGG from '@/game/assets/sounds/ding.ogg'
import dingMP3 from '@/game/assets/sounds/ding.mp3'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
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

  create () {
    this.scene.start('PlayScene')
  }
}
