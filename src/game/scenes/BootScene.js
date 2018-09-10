import { Scene } from 'phaser'
import sky from '@/game/assets/sky.png'
import paddle from '@/game/assets/paddleRed.png'
import ball from '@/game/assets/ballGrey.png'
import particleStarSmall from '@/game/assets/particleStarSmall.png'
import particleStarMedium from '@/game/assets/particleStarMedium.png'
import particleStarBig from '@/game/assets/particleStarBig.png'
import thudOGG from '@/game/assets/sounds/thud.ogg'
import thudMP3 from '@/game/assets/sounds/thud.mp3'
import explosionOGG from '@/game/assets/sounds/explosion.ogg'
import explosionMP3 from '@/game/assets/sounds/explosion.mp3'
import woodenOGG from '@/game/assets/sounds/wooden.ogg'
import woodenMP3 from '@/game/assets/sounds/wooden.mp3'

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
    this.load.audio('thud', [thudMP3, thudOGG])
    this.load.audio('explosion', [explosionMP3, explosionOGG])
    this.load.audio('wooden', [woodenMP3, woodenOGG])
  }

  create () {
    this.scene.start('PlayScene')
  }
}
