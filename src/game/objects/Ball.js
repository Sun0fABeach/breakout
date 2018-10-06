import Phaser, { Physics } from 'phaser'
import { managers as particleManagers } from '@/game/particleManagers'

class Ball extends Physics.Arcade.Image {
  constructor (scene, x, y) {
    super(scene, x, y, 'ball')
    this._startingAngle = 315
    this._velocityFactor = 400
    this._angularVelocity = 200
    this._scene = scene
    this._world = scene.physics.world

    /* game object not registered with scene and it's body is not enabled when
       it is *not* constructed via scene factory */
    this._world.enableBody(this, Physics.Arcade.DYNAMIC_BODY)
    scene.add.existing(this)
    this.setCollideWorldBounds(true)
    this.body.onWorldBounds = true // enable worldbounds event
    this.setBounce(1)

    this._emitters = this.setupEmitters(scene)
  }

  setupEmitters (scene) {
    const emitters = {}

    emitters.explosion = ['small', 'medium', 'big'].map(type =>
      particleManagers.stars[type].createEmitter({
        active: false,
        blendMode: 'SCREEN',
        speed: { min: 50, max: 500 },
        scale: { start: 1, end: 0 },
        lifespan: 3000,
        gravityY: 300,
        bounds: this._world.bounds,
        collideTop: false,
        bounce: 0.5
      })
    )
    emitters.puff = [
      particleManagers.puff.createEmitter({
        active: false,
        blendMode: 'SCREEN',
        speed: 15,
        scale: { start: 0.05, end: 0.07 },
        lifespan: 600,
        alpha: 0.15
      })
    ]

    return emitters
  }

  show () {
    this.setTexture('ball')
    this.enableBody(false, 0, 0, false, true) // just show, don't enable body
  }

  disablePhysics () {
    this.disableBody(true) // object still visible
  }

  disableFull () {
    this.disableBody(true, true) // disable & hide
  }

  setVelocityFromAngle (angleRad) {
    super.setVelocity(
      Math.cos(angleRad) * this._velocityFactor,
      Math.sin(angleRad) * this._velocityFactor
    )
  }

  stop () {
    this.setVelocity(0)
  }

  set spin (spinDirection) {
    const sign = spinDirection === 'left' ? -1 : +1
    this.setAngularVelocity(sign * this._angularVelocity)
  }

  kill (resetCb = undefined) {
    this.explode()
    this.disableFull()
    if (resetCb) {
      resetCb()
    }
  }

  explode () {
    Object.values(this._emitters.explosion).forEach(emitter => {
      emitter.resume()
      emitter.setAngle(this.explosionAngleRange(this.body.velocity.angle()))
      emitter.explode(60, this.x, this.y)
    })
  }

  explosionAngleRange (radians) {
    let deg = Phaser.Math.RadToDeg(radians)
    const shiftFunc = deg > 270 ? Phaser.Math.MinSub : Phaser.Math.MaxAdd
    deg = shiftFunc(deg, 20, 270) // shift range towards center up
    return this.particleAngleRange(deg, 140)
  }

  puff (up, down, left, right) {
    let directionDeg, coords
    const worldWidth = this._world.bounds.width
    const worldheight = this._world.bounds.height

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

    Object.values(this._emitters.puff).forEach(emitter => {
      emitter.resume()
      emitter.setAngle(this.particleAngleRange(directionDeg, 180))
      emitter.explode(2, ...coords)
    })
  }

  particleAngleRange (deg, spreadRange) {
    return {
      min: deg - spreadRange / 2,
      max: deg + spreadRange / 2
    }
  }

  get velocityX () {
    return this.body.velocity.x
  }

  get velocityY () {
    return this.body.velocity.y
  }

  get halfHeight () {
    return this.displayHeight / 2
  }

  get halfWidth () {
    return this.displayWidth / 2
  }
}

export default Ball
export { Ball }
