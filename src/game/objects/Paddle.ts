import { GameObjects } from 'phaser'
import Ball from '@/game/objects/Ball'
import Particles from '@/game/Particles'

type CollisionCb = (ball: Ball, paddle: Paddle) => any

class Paddle extends GameObjects.Container {
  private readonly baseCoords: { x: number, y: number}
  private readonly mountedBallOffset: { x: number, y: number } = { x: 0, y: 0 }
  private mountedBall: Ball | null
  private ballCollider: Collider | null
  private readonly img: GameObjects.Image
  private readonly emitters: ParticleEmitter[]

  constructor (scene: Scene, x: number, y: number) {
    super(scene, x, y)

    this.baseCoords = { x, y }

    this.img = scene.add.image(0, 0, 'spritesheet', 'paddle')
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

  bounceBallOff (ball: Ball): void {
    ball.resetSpeed(false)
    ball.setVelocityFromAngle(this.ballLaunchAngle(ball))
  }

  private ballLaunchAngle (ball: Ball): number {
    let angleRad: number = Phaser.Math.Angle.Between(
      this.x, this.y, ball.x, ball.y
    )
    /* if the angle is too horizontal, adjust it a
       little to make the ball go slightly upwards */
    const flatRight: number = 0
    const flatLeft: number = 3.141593
    const tolerance: number = 0.008726 // 0.5 degrees
    if (Phaser.Math.Within(angleRad, flatRight, tolerance)) {
      angleRad = -tolerance
    } else if (Phaser.Math.Within(Math.abs(angleRad), flatLeft, tolerance)) {
      angleRad = -(flatLeft - tolerance)
    }
    return angleRad
  }

  setBallForCollider (ball: Ball): void {
    // @ts-ignore
    this.ballCollider.object1 = ball
  }

  mountBall (ball: Ball): void {
    ball.disableFull()
    this.add(ball)

    const sign = Phaser.Math.Between(0, 1) === 0 ? -1 : +1 // left or right
    this.mountedBallOffset.x = sign * this.halfWidth / 3
    this.mountedBallOffset.y = -(this.halfHeight + ball.halfHeight - 1)
    ball.setPosition(this.mountedBallOffset.x, this.mountedBallOffset.y)
    ball.fadeIn()

    this.mountedBall = ball
  }

  detachBall (): Ball {
    this.remove(this.mountedBall!, true) // also destroys ball
    this.mountedBall = null

    return new Ball(this.scene,
      this.x + this.mountedBallOffset.x,
      this.y + this.mountedBallOffset.y
    )
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
