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

    this._ball = null
  }

  mountBall (ball) {
    this._ball = ball
    this.add(ball)
  }

  removeBall () {
    this.remove(this._ball, true) // calls destroy on ball object
    this._ball = null
  }

  get ballMounted () {
    return this._ball !== null
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
