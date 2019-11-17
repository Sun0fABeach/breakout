import Phaser, { Physics, Math as PhaserMath } from 'phaser'
import Particles from '@/game/Particles'
import { Direction } from '@/game/globals'

type EmitterDict = { [index: string]: ParticleEmitter[] }

class Ball extends Physics.Arcade.Image {
  private speed: number // in pixels per second
  private readonly speedBase: number = 350
  private readonly speedIncrease: number = 100
  private readonly angularVelocity: number = 200
  private readonly tailParticleSpeed: number = 100
  private readonly world: ArcadePhysics.World
  private readonly emitters: EmitterDict

  constructor (scene: Scene, x: number, y: number) {
    super(scene, x, y, 'spritesheet', 'ball')
    this.world = scene.physics.world
    this.speed = this.speedBase

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
        on: false,
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
        on: false,
        blendMode: Phaser.BlendModes.SCREEN,
        speed: 15,
        scale: { start: 0.5, end: 0.7 },
        lifespan: 600,
        alpha: 0.15
      })
    ]
    emitters.tail = ['small', 'medium'].map(type =>
      Particles.managers.stars[type].createEmitter({
        on: false,
        blendMode: Phaser.BlendModes.ADD,
        radial: false,
        scale: { start: 1, end: 0, ease: 'Power3' },
        lifespan: 1000,
        tint: [ 0xffff00, 0xff0000, 0x00ff00 ],
        gravityY: -200
      })
    )

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
      emitter.explode(60, this.x, this.y)
    })
    this.disableFull()
  }

  explodeBottom (): void {
    Object.values(this.emitters.explosion).forEach(emitter => {
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
      Math.cos(angleRad) * this.speed,
      Math.sin(angleRad) * this.speed
    )
  }

  increaseSpeed (): void {
    this.setSpeed(this.speed + this.speedIncrease)
  }

  resetSpeed (): void {
    this.setSpeed(this.speedBase)
  }

  private setSpeed (newSpeed: number): void {
    this.speed = newSpeed
    this.body.velocity.normalize().scale(newSpeed)
  }

  activateTail (): void {
    this.emitters.tail.forEach(emitter => {
      emitter.start()
      emitter.startFollow(this)
    })
    this.adjustTail()
  }

  deactivateTail (): void {
    this.emitters.tail.forEach(emitter => {
      emitter.stop()
      emitter.stopFollow()
    })
  }

  adjustTail (): void {
    const currentVector = new PhaserMath.Vector2(this.body.velocity)
    currentVector.normalize()
    const speedX: number = currentVector.x * this.tailParticleSpeed
    const speedY: number = currentVector.y * this.tailParticleSpeed
    this.emitters.tail.forEach(emitter => {
      emitter.setSpeedX({ min: -speedY, max: speedY })
      emitter.setSpeedY({ min: -speedX, max: speedX })
    })
  }

  stop (): void {
    this.setVelocity(0)
  }

  spinOnCollision ({ up, right, down, left }: ArcadeBodyCollision): void {
    if (up) {
      // goes left -> spin right
      // goes right -> spin left
      this.spin = Direction[this.velocityX < 0 ? 'Right' : 'Left']
    } else if (right) {
      // goes up -> spin right
      // goes down -> spin left
      this.spin = Direction[this.velocityY < 0 ? 'Right' : 'Left']
    } else if (down) {
      // goes left -> spin left
      // goes right -> spin right
      this.spin = Direction[this.velocityX < 0 ? 'Left' : 'Right']
    } else if (left) {
      // goes up -> spin left
      // goes down -> spin right
      this.spin = Direction[this.velocityY < 0 ? 'Left' : 'Right']
    }
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

    this.emitters.puff.forEach(emitter => {
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
