import Phaser, { Physics } from 'phaser'

class Ball extends Physics.Arcade.Image {
  constructor (scene, x, y) {
    super(scene, x, y, 'ball')
    this._startingAngle = 315
    this._velocityFactor = 400
    this._angularVelocity = 200
    this._scene = scene

    /* game object not registered with scene and it's body is not enabled when 
       it is *not* constructed via scene factory */
    scene.physics.world.enableBody(this, Physics.Arcade.DYNAMIC_BODY)
    scene.add.existing(this)
    this.setCollideWorldBounds(true)
    this.body.onWorldBounds = true // enable worldbounds event
    this.setBounce(1)

    this._emitters = this.setupEmitters(scene)
  }

  setupEmitters(scene) {
    const emitterConf = {
      active: false,
      blendMode: 'SCREEN',
      speed: { min: 50, max: 500 }, 
      scale: { start: 1, end: 0 },
      lifespan: 3000,
      gravityY: 300,
      bounds: scene.physics.world.bounds,
      collideTop: false,
      bounce: 0.5
    }

    return ['Small', 'Medium', 'Big'].map(type => 
      scene.add.particles(`particleStar${type}`).createEmitter(emitterConf)
    )
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

  kill (reset_cb=undefined) {
    this.explode()
    this.disableFull()
    if(reset_cb) {
      reset_cb()
    }
  }

  explode() {
    Object.values(this._emitters).forEach(emitter => {
      emitter.resume()
      emitter.setAngle(this.explosionAngleRange(this.body.velocity.angle()))
      emitter.explode(60, this.x, this.y)
    })
  }

  explosionAngleRange(radians) {
    let deg = Phaser.Math.RadToDeg(radians)
    const shiftFunc = deg > 270 ? Phaser.Math.MinSub : Phaser.Math.MaxAdd
    deg = shiftFunc(deg, 20, 270) // shift range towards center up

    const spreadDegRange = 140
    return { 
      min: deg - spreadDegRange/2,
      max: deg + spreadDegRange/2
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
