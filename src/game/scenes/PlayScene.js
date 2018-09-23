import Phaser, { Scene } from 'phaser'
import comms from '@/vuePhaserComms'
import Ball from '@/game/objects/Ball'
import Paddle from '@/game/objects/Paddle'
import Blocks from '@/game/objects/Blocks'
import GameOver from '@/game/objects/text/GameOver'
import LifeCounter from '@/game/objects/LifeCounter'
import Score from '@/game/objects/Score'
import Audio from '@/game/audio'

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })

    this.lifeCounter = null
    this.gameOver = null

    this.blocks = null
    this.paddle = null
    this.ball = null
    this.ballPaddleOffset = { x: 0, y: 0 }

    this.colliders = {
      ballPaddle: null,
      ballBlock: null
    }

    this.audio = null
    this.cursor = null

    this.score = new Score(0)
  }

  create () {
    this.add.image(400, 300, 'sky')

    this.ball = new Ball(this, 400, 300)
    this.paddle = new Paddle(this, 400, 550)
    this.colliders.ballPaddle = this.physics.add.collider(
      this.ball, this.paddle, this.bounceBallOffPaddle, null, this
    )
    this.blocks = new Blocks(this)
    this.colliders.ballBlock = this.physics.add.collider(
      this.ball, this.blocks, this.blockHit, null, this
    )

    this.putBallOnPaddle()
    this.physics.world.on('worldbounds', this.ballHitWorldBounds, this)

    this.lifeCounter = new LifeCounter(3)
    this.gameOver = new GameOver(this)

    this.audio = new Audio(this)
    this.cursor = this.input.keyboard.createCursorKeys()

    comms.on('pause', () => this.scene.pause())
    comms.on('resume', () => this.scene.resume())
    comms.on('restart', this.restart.bind(this))
  }

  restart () {
    this.score.reset()
    this.ball.show()
    this.putBallOnPaddle()
    this.blocks.reset()
    this.gameOver.hide()
    this.lifeCounter.reset()
  }

  putBallOnPaddle () {
    this.ball.disablePhysics()
    this.paddle.mountBall(this.ball)

    const sign = Phaser.Math.Between(0, 1) === 0 ? -1 : +1 // left or right
    this.ballPaddleOffset.x = sign * this.paddle.halfWidth / 3
    this.ballPaddleOffset.y = -(this.paddle.halfHeight + this.ball.halfHeight - 1)
    this.ball.setPosition(this.ballPaddleOffset.x, this.ballPaddleOffset.y)
  }

  launchBallFromPaddle () {
    this.paddle.removeBall(this.ball)
    this.ball = new Ball(this,
      this.paddle.x + this.ballPaddleOffset.x,
      this.paddle.y + this.ballPaddleOffset.y
    )

    this.bounceBallOffPaddle(this.ball, this.paddle)
    this.colliders.ballPaddle.object1 = this.ball
    this.colliders.ballBlock.object1 = this.ball
  }

  bounceBallOffPaddle (ball, paddle) {
    this.audio.play('wooden')
    this.setBallVelocity(
      Phaser.Math.Angle.Between(paddle.x, paddle.y, ball.x, ball.y)
    )
    ball.spin = ball.x < paddle.x ? 'left' : 'right'
  }

  setBallVelocity (angleRad) {
    /* if the angle is too horizontal, adjust it a
       little to make the ball go slightly upwards */
    const flatRight = 0
    const flatLeft = 3.141593
    const tolerance = 0.008726 // 0.5 degrees
    if (Phaser.Math.Within(angleRad, flatRight, tolerance)) {
      angleRad = -tolerance
    } else if (Phaser.Math.Within(Math.abs(angleRad), flatLeft, tolerance)) {
      angleRad = -(flatLeft - tolerance)
    }
    this.ball.setVelocityFromAngle(angleRad)
  }

  ballHitWorldBounds (ballBody, up, down, left, right) {
    if (down) {
      this.loseLife()
    } else {
      // call like this to enable multiple layered thuds:
      this.audio.play('thud')
      this.adjustBallSpinAfterWorldBoundsCollision(up, left, right)
    }
  }

  blockHit (ball, block) {
    this.blocks.killBlock(block)
    this.audio.play('ding')
    this.score.increment(100)
  }

  loseLife () {
    this.audio.play('explosion')
    this.lifeCounter.decrement()
    if (this.lifeCounter.number === 0) {
      this.ball.kill()
      this.gameOver.show(() => comms.emit('game over'))
    } else {
      this.ball.kill(() => {
        this.ball.show()
        this.putBallOnPaddle()
      })
    }
  }

  adjustBallSpinAfterWorldBoundsCollision (upperWall, leftWall, rightWall) {
    let spinDirection
    if (upperWall) {
      // goes left -> spin right
      // goes right -> spin left
      spinDirection = this.ball.velocityX < 0 ? 'right' : 'left'
    } else if (leftWall) {
      // goes up -> spin left
      // goes down -> spin right
      spinDirection = this.ball.velocityY < 0 ? 'left' : 'right'
    } else if (rightWall) {
      // goes up -> spin right
      // goes down -> spin left
      spinDirection = this.ball.velocityY < 0 ? 'right' : 'left'
    }
    this.ball.spin = spinDirection
  }

  centerScale (obj, scale) {
    const worldDimensions = this.physics.world.bounds
    obj.setScale(scale)
    obj.setPosition(
      worldDimensions.width / 2 - obj.displayWidth / 2,
      worldDimensions.height / 2 - obj.displayHeight / 2
    )
  }

  update () {
    if (this.gameOver.visible) {
      return
    }

    if (this.paddle.ballMounted && this.cursor.space.isDown) {
      this.launchBallFromPaddle()
    }

    const pixelChange = 5

    if (this.cursor.left.isDown) {
      this.paddle.x -= pixelChange
    } else if (this.cursor.right.isDown) {
      this.paddle.x += pixelChange
    }
  }
}
