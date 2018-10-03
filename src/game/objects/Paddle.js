import { GameObjects } from 'phaser'

class Paddle extends GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, x, y)
    this._img = scene.add.image(0, 0, 'paddle')
    this.add(this._img)
    this.setSize(this._img.displayWidth, this._img.displayHeight)

    scene.add.existing(this)
    scene.physics.world.enable(this)
    this.body.setCollideWorldBounds(true)
    this.body.immovable = true

    this._scene = scene
    this._mountedBall = null
    this._ballCollider = null
  }

  setupBallCollider (ball, callback) {
    this._ballCollider = this._scene.physics.add.collider(
      ball, this, callback, null, this._scene
    )
  }

  setBallForCollider (ball) {
    this._ballCollider.object1 = ball
  }

  mountBall (ball) {
    this._mountedBall = ball
    this.add(ball)
  }

  removeBall () {
    this.remove(this._mountedBall, true) // calls destroy on ball object
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
