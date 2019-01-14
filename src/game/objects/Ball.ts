import Phaser, { Physics, Math as PhaserMath } from 'phaser'
import Particles from '@/game/Particles'
import { Direction } from '@/game/globals'

type EmitterDict = { [index: string]: ParticleEmitter[] }

class Ball extends Physics.Arcade.Image {
  private readonly velocityFactor: number
  private readonly angularVelocity: number
  private readonly world: ArcadePhysics.World
  private readonly emitters: EmitterDict

  constructor (scene: Scene, x: number, y: number) {
    super(scene, x, y, 'other', 'ball')
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

  setupEmitters (scene: Scene): EmitterDict {
    const emitters: EmitterDict = {}

    emitters.explosion = ['small', 'medium', 'big'].map(type =>
      Particles.managers.stars[type].createEmitter({
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
      Particles.managers.puff.createEmitter({
        active: false,
        blendMode: Phaser.BlendModes.SCREEN,
        speed: 15,
        scale: { start: 0.5, end: 0.7 },
        lifespan: 600,
        alpha: 0.15
      })
    ]

    return emitters
  }

  show (): void {
    this.setVisible(true)
  }

  hide (): void {
    this.setVisible(false)
  }

  disablePhysics (): void {
    this.disableBody(true) // object still visible
  }

  disableFull (): void {
    this.disableBody(true, true) // disable & hide
  }

  fadeKill (): Promise<void> {
    return this.fadeOut().then(() => this.disableFull())
  }

  fadeOut (): Promise<void> {
    return this.fade(0, 'Quad.easeOut')
  }

  fadeIn (): Promise<void> {
    this.show() // in case it was hidden before
    this.setAlpha(0)
    return this.fade(1, 'Quad.easeIn')
  }

  private fade (
    alpha: number, ease: string, duration: number = 250
  ): Promise<void> {
    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: this,
        alpha,
        ease,
        duration,
        onComplete: resolve
      })
    })
  }

  explode (): void {
    Object.values(this.emitters.explosion).forEach(emitter => {
      emitter.resume()
      emitter.explode(60, this.x, this.y)
    })
    this.disableFull()
  }

  explodeBottom (): void {
    Object.values(this.emitters.explosion).forEach(emitter => {
      emitter.resume()
      emitter.setAngle(this.explosionAngleRange(this.body.velocity.angle()))
      emitter.explode(60, this.x, this.world.bounds.height - 4)
    })
    this.disableFull()
  }

  private explosionAngleRange (radians: number): { min: number, max: number } {
    type ShiftFunc = (base: number, amount: number, limit: number) => number

    let deg: number = PhaserMath.RadToDeg(radians)
    const shiftFunc: ShiftFunc =
      deg > 270 ? PhaserMath.MinSub : PhaserMath.MaxAdd
    deg = shiftFunc(deg, 20, 270) // shift range towards center up
    return this.particleAngleRange(deg, 140)
  }

  private particleAngleRange (deg: number, spreadRange: number):
    { min: number, max: number } {
    return {
      min: deg - spreadRange / 2,
      max: deg + spreadRange / 2
    }
  }

  setVelocityFromAngle (angleRad: number): void {
    this.setVelocity(
      Math.cos(angleRad) * this.velocityFactor,
      Math.sin(angleRad) * this.velocityFactor
    )
  }

  stop (): void {
    this.setVelocity(0)
  }

  set spin (spinDirection: Direction) {
    const sign = spinDirection === Direction.Left ? -1 : +1
    this.setAngularVelocity(sign * this.angularVelocity)
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
