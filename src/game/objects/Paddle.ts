import { GameObjects } from 'phaser'
import Ball from '@/game/objects/Ball'

type PhysicsBody = Phaser.Physics.Arcade.Body

class Paddle extends GameObjects.Container {
  _img : Phaser.GameObjects.Image
  _scene : Phaser.Scene
  _mountedBall : Ball | null
  _ballCollider : Phaser.Physics.Arcade.Collider | null

  constructor (scene : Phaser.Scene, x : number, y : number) {
    super(scene, x, y)
    this._img = scene.add.image(0, 0, 'paddle')
    this.add(this._img)
    this.setSize(this._img.displayWidth, this._img.displayHeight)

    scene.add.existing(this)
    scene.physics.world.enable(this)
    const body : PhysicsBody = this.body as PhysicsBody
    body.setCollideWorldBounds(true)
    body.immovable = true

    this._scene = scene
    this._mountedBall = null
    this._ballCollider = null
  }

  setupBallCollider (ball : Ball, callback : ArcadePhysicsCallback) {
    this._ballCollider = this._scene.physics.add.collider(
      ball, this, callback, undefined, this._scene
    )
  }

  setBallForCollider (ball : Ball) {
    // @ts-ignore
    this._ballCollider.object1 = ball
  }

  mountBall (ball : Ball) {
    this._mountedBall = ball
    this.add(ball)
  }

  removeBall (destroyBall : boolean = false) {
    this.remove(this._mountedBall as Ball, destroyBall)
    this._mountedBall = null
  }

  get ballMounted () {
    return this._mountedBall !== null
  }

  get halfHeight () {
    return this._img.displayHeight / 2
  }

  get halfWidth () {
    return this._img.displayWidth / 2
  }
}

export default Paddle
export { Paddle }
