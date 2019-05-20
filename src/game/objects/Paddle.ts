import { GameObjects } from 'phaser'
import Ball from '@/game/objects/Ball'
import Particles from '@/game/Particles'

type CollisionCb = (this: Scene, ball: Ball, paddle: Paddle) => any

class Paddle extends GameObjects.Container {
  private readonly baseCoords: { x: number, y: number}
  private readonly img: GameObjects.Image
  private mountedBall: Ball | null
  private ballCollider: Collider | null
  private readonly emitters: ParticleEmitter[]

  constructor (scene: Scene, x: number, y: number) {
    super(scene, x, y)
    this.baseCoords = { x, y }
    this.img = scene.add.image(0, 0, 'other', 'paddle')
    this.add(this.img)
    this.setSize(this.img.displayWidth, this.img.displayHeight)

    scene.add.existing(this)
    scene.physics.world.enable(this)
    const body: PhysicsBody = this.body as PhysicsBody
    body.setCollideWorldBounds(true)
    body.immovable = true

    this.mountedBall = null
    this.ballCollider = null

    this.emitters = this.setupEmitters(scene)
  }

  setupEmitters (scene: Scene): ParticleEmitter[] {
    return ['small', 'medium', 'big'].map(type =>
      Particles.managers.stars[type].createEmitter({
        active: false,
        blendMode: Phaser.BlendModes.SCREEN,
        speed: { min: 100, max: 400 },
        scale: { start: 1, end: 0 },
        lifespan: 3000,
        gravityY: 200,
        bounds: scene.physics.world.bounds,
        bounce: 0.5
      })
    )
  }

  setupBallCollider (ball: Ball, callback: CollisionCb): void {
    this.ballCollider = this.scene.physics.add.collider(
      ball, this, callback as ArcadePhysicsCallback, undefined, this.scene
    )
  }

  setBallForCollider (ball: Ball): void {
    // @ts-ignore
    this.ballCollider.object1 = ball
  }

  mountBall (ball: Ball): void {
    this.mountedBall = ball
    this.add(ball)
  }

  removeBall (destroyBall: boolean = false): void {
    this.remove(this.mountedBall!, destroyBall)
    this.mountedBall = null
  }

  explode (): void {
    this.setAlpha(0)
    this.emitters.forEach(emitter => {
      emitter.setEmitZone({
        type: 'edge',
        source: this.getBounds(),
        quantity: 100
      })
      emitter.resume()
      // @ts-ignore - no need to pass more arguments here
      emitter.explode(100)
    })
  }

  fadeIn (): Promise<void> {
    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: this,
        alpha: 1,
        ease: 'Quad.easeIn',
        duration: 250,
        onComplete: resolve
      })
    })
  }

  resetPosition (): void {
    this.setPosition(this.baseCoords.x, this.baseCoords.y)
  }

  get ballMounted (): boolean {
    return this.mountedBall !== null
  }

  get halfHeight (): number {
    return this.img.displayHeight / 2
  }

  get halfWidth (): number {
    return this.img.displayWidth / 2
  }
}

export default Paddle
export { Paddle }
