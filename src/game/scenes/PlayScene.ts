import Phaser, { Scene } from 'phaser'
import comms from '@/vuePhaserComms'
import Ball from '@/game/objects/Ball'
import Paddle from '@/game/objects/Paddle'
import Blocks from '@/game/objects/Blocks'
import GameOver from '@/game/objects/text/GameOver'
import LifeCounter from '@/game/objects/counter/LifeCounter'
import Score from '@/game/objects/counter/Score'
import Audio from '@/game/audio'
import { init as particlesInit } from '@/game/particleManagers'
import { Direction, keys } from '@/game/globals'

export default class PlayScene extends Scene {
  private prefabs: { [index: string]: any }
  private readonly ballPaddleOffset: { x: number, y: number }
  private readonly lifeCounter: LifeCounter
  private readonly score: Score
  private readonly audio: Audio

  constructor () {
    super({ key: 'PlayScene' })

    /* init these objects here, since they don't need to wait for phaser */
    this.ballPaddleOffset = { x: 0, y: 0 }
    this.score = new Score(0)
    this.lifeCounter = new LifeCounter(3)
    this.audio = new Audio(this)
    this.prefabs = {} // filled in create()
  }

  create (): void {
    this.add.image(400, 300, 'sky')

    /**
     * weird: this call has to happen right before ball init. if I put
     * this.add.image() in between, the particles will be invisible! -.-
     */
    particlesInit(this)

    const ball = new Ball(this, 400, 300)

    const paddle = new Paddle(this, 400, 550)
    paddle.setupBallCollider(ball, this.bounceBallOffPaddle)
    const blocks = new Blocks(this)
    blocks.setupBallCollider(ball, this.blockHit.bind(this))

    this.physics.world.on('worldbounds', this.ballHitWorldBounds, this)

    const gameOver = new GameOver(this)
    const cursor: Phaser.Input.Keyboard.CursorKeys =
      this.input.keyboard.createCursorKeys()

    this.initPauseHandling()
    comms.on('restart', this.restart.bind(this))

    this.prefabs = { ball, paddle, blocks, gameOver, cursor }
    this.putBallOnPaddle()
  }

  initPauseHandling () {
    this.scene.launch('PauseScene').pause('PauseScene')

    this.input.keyboard.on(keys.pause, () => {
      this.pause()
      comms.emit('pauseKey') // emitted for control panel to adjust
    })

    comms.on('pause', () => this.pause())
  }

  pause (): void {
    this.scene.pause()
    this.scene.resume('PauseScene')
  }

  restart (): void {
    this.score.reset()
    this.lifeCounter.reset()
    this.prefabs.blocks.reset()
    this.prefabs.ball.show()
    this.putBallOnPaddle()
    this.prefabs.gameOver.hide()
  }

  putBallOnPaddle (): void {
    const { ball, paddle } = this.prefabs

    ball.disablePhysics()
    paddle.mountBall(ball)

    const sign = Phaser.Math.Between(0, 1) === 0 ? -1 : +1 // left or right
    this.ballPaddleOffset.x = sign * paddle.halfWidth / 3
    this.ballPaddleOffset.y = -(paddle.halfHeight + ball.halfHeight - 1)
    ball.setPosition(this.ballPaddleOffset.x, this.ballPaddleOffset.y)
  }

  launchBallFromPaddle (): void {
    const { paddle, blocks } = this.prefabs

    paddle.removeBall(true) // destroys ball object
    const ball = new Ball(this,
      paddle.x + this.ballPaddleOffset.x,
      paddle.y + this.ballPaddleOffset.y
    )
    this.prefabs.ball = ball

    this.bounceBallOffPaddle(ball, paddle)
    paddle.setBallForCollider(ball)
    blocks.setBallForCollider(ball)
  }

  bounceBallOffPaddle (ball: Ball, paddle: Paddle): void {
    this.audio.play('wooden')
    this.setBallVelocity(
      Phaser.Math.Angle.Between(paddle.x, paddle.y, ball.x, ball.y)
    )
    ball.spin = Direction[ball.x < paddle.x ? 'Left' : 'Right']
    this.prefabs.blocks.resetScoreMultiplier()
  }

  setBallVelocity (angleRad: number): void {
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
    this.prefabs.ball.setVelocityFromAngle(angleRad)
  }

  ballHitWorldBounds (
    ballBody: PhysicsBody,
    up: boolean, down: boolean, left: boolean, right: boolean
  ): void {
    if (down) {
      this.loseLife()
    } else {
      // call like this to enable multiple layered thuds:
      this.audio.play('thud')
      this.prefabs.ball.puff(up, false, left, right)
      this.spinBallOnCollision({ up, right, down, left, none: false })
    }
  }

  blockHit (ball: Ball, block: PhysicsSprite, points: number): void {
    this.prefabs.blocks.killBlock(block)
    this.audio.play('ding')
    this.score.increment(points)
    this.prefabs.blocks.bumpScoreMultiplier()
    this.spinBallOnCollision(ball.body.touching)
  }

  loseLife (): void {
    const { ball, gameOver } = this.prefabs

    this.audio.play('explosion')
    this.prefabs.blocks.resetScoreMultiplier()
    this.lifeCounter.decrement()
    if (this.lifeCounter.number === 0) {
      ball.kill()
      gameOver.show(() => comms.emit('game over'))
    } else {
      ball.kill(() => {
        ball.show()
        this.putBallOnPaddle()
      })
    }
  }

  spinBallOnCollision ({ up, right, down, left }: ArcadeBodyCollision): void {
    const ball: Ball = this.prefabs.ball

    if (up) {
      // goes left -> spin right
      // goes right -> spin left
      ball.spin = Direction[ball.velocityX < 0 ? 'Right' : 'Left']
    } else if (right) {
      // goes up -> spin right
      // goes down -> spin left
      ball.spin = Direction[ball.velocityY < 0 ? 'Right' : 'Left']
    } else if (down) {
      // goes left -> spin left
      // goes right -> spin right
      ball.spin = Direction[ball.velocityX < 0 ? 'Left' : 'Right']
    } else if (left) {
      // goes up -> spin left
      // goes down -> spin right
      ball.spin = Direction[ball.velocityY < 0 ? 'Left' : 'Right']
    }
  }

  update (): void {
    const { paddle, gameOver, cursor } = this.prefabs

    if (gameOver.visible) {
      return
    }

    if (paddle.ballMounted && cursor.space.isDown) {
      this.launchBallFromPaddle()
    }

    const pixelChange: number = 5

    if (cursor.left.isDown) {
      paddle.x -= pixelChange
    } else if (cursor.right.isDown) {
      paddle.x += pixelChange
    }
  }
}
