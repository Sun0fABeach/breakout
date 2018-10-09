import Phaser, { Physics, Math as PhaserMath } from 'phaser'
import { managers as particleManagers } from '@/game/particleManagers'

type Emitter = Phaser.GameObjects.Particles.ParticleEmitter
type EmitterDict = { [index: string]: Emitter[] }

class Ball extends Physics.Arcade.Image {
  private readonly velocityFactor: number
  private readonly angularVelocity: number
  private readonly world: Phaser.Physics.Arcade.World
  private readonly emitters: EmitterDict

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ball')
    this.velocityFactor = 400
    this.angularVelocity = 200
    this.world = scene.physics.world

    /* game object not registered with scene and it's body is not enabled when
       it is *not* constructed via scene factory */
    this.world.enableBody(this, Physics.Arcade.DYNAMIC_BODY)
    scene.add.existing(this)
    this.setCollideWorldBounds(true)
    this.body.onWorldBounds = true // enable worldbounds event
    this.setBounce(1)

    this.emitters = this.setupEmitters(scene)
  }

  setupEmitters (scene: Phaser.Scene): EmitterDict {
    const emitters: EmitterDict = {}

    emitters.explosion = ['small', 'medium', 'big'].map(type =>
      particleManagers.stars[type].createEmitter({
        active: false,
        blendMode: Phaser.BlendModes.SCREEN,
        speed: { min: 50, max: 500 },
        scale: { start: 1, end: 0 },
        lifespan: 3000,
        gravityY: 300,
        bounds: this.world.bounds,
        collideTop: false,
        bounce: 0.5
      })
    )
    emitters.puff = [
      particleManagers.puff.createEmitter({
        active: false,
        blendMode: Phaser.BlendModes.SCREEN,
        speed: 15,
        scale: { start: 0.05, end: 0.07 },
        lifespan: 600,
        alpha: 0.15
      })
    ]

    return emitters
  }

  show (): void {
    this.setTexture('ball')
    this.enableBody(false, 0, 0, false, true) // just show, don't enable body
  }

  disablePhysics (): void {
    this.disableBody(true) // object still visible
  }

  disableFull (): void {
    this.disableBody(true, true) // disable & hide
  }

  setVelocityFromAngle (angleRad: number): void {
    super.setVelocity(
      Math.cos(angleRad) * this.velocityFactor,
      Math.sin(angleRad) * this.velocityFactor
    )
  }

  stop (): void {
    this.setVelocity(0)
  }

  set spin (spinDirection: string) {
    const sign = spinDirection === 'left' ? -1 : +1
    this.setAngularVelocity(sign * this.angularVelocity)
  }

  kill (callback?: () => any): void {
    this.explode()
    this.disableFull()
    if (callback) {
      callback()
    }
  }

  explode (): void {
    Object.values(this.emitters.explosion).forEach(emitter => {
      emitter.resume()
      emitter.setAngle(this.explosionAngleRange(this.body.velocity.angle()))
      emitter.explode(60, this.x, this.y)
    })
  }

  explosionAngleRange (radians: number): { min: number, max: number } {
    type ShiftFunc = (base: number, amount: number, limit: number) => number

    let deg: number = PhaserMath.RadToDeg(radians)
    const shiftFunc: ShiftFunc =
      deg > 270 ? PhaserMath.MinSub : PhaserMath.MaxAdd
    deg = shiftFunc(deg, 20, 270) // shift range towards center up
    return this.particleAngleRange(deg, 140)
  }

  puff (up: boolean, down: boolean, left: boolean, right: boolean): void {
    let directionDeg: number
    let coords: [number, number]
    const worldWidth: number = this.world.bounds.width
    const worldheight: number = this.world.bounds.height

    if (down) {
      directionDeg = 270
      coords = [ this.x, worldheight - 1 ]
    } else if (left) {
      directionDeg = 360
      coords = [ 1, this.y ]
    } else if (up) {
      directionDeg = 90
      coords = [ this.x, 1 ]
    } else if (right) {
      directionDeg = 180
      coords = [ worldWidth - 1, this.y ]
    }

    Object.values(this.emitters.puff).forEach(emitter => {
      emitter.resume()
      emitter.setAngle(this.particleAngleRange(directionDeg, 180))
      emitter.explode(2, ...coords)
    })
  }

  particleAngleRange (deg: number, spreadRange: number):
    { min: number, max: number } {
    return {
      min: deg - spreadRange / 2,
      max: deg + spreadRange / 2
    }
  }

  get velocityX (): number {
    return this.body.velocity.x
  }

  get velocityY (): number {
    return this.body.velocity.y
  }

  get halfHeight (): number {
    return this.displayHeight / 2
  }

  get halfWidth (): number {
    return this.displayWidth / 2
  }
}

export default Ball
export { Ball }
