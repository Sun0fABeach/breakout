import { GameObjects } from 'phaser'
import Ball from '@/game/objects/Ball'

type CollisionCb = (this: Scene, ball: Ball, paddle: Paddle) => any

class Paddle extends GameObjects.Container {
  private readonly img: GameObjects.Image
  private mountedBall: Ball | null
  private ballCollider: Collider | null

  constructor (scene: Scene, x: number, y: number) {
    super(scene, x, y)
    this.img = scene.add.image(0, 0, 'sprites', 'paddle')
    this.add(this.img)
    this.setSize(this.img.displayWidth, this.img.displayHeight)

    scene.add.existing(this)
    scene.physics.world.enable(this)
    const body: PhysicsBody = this.body as PhysicsBody
    body.setCollideWorldBounds(true)
    body.immovable = true

    this.mountedBall = null
    this.ballCollider = null
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
