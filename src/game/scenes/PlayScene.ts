import Phaser, { Scene } from 'phaser'
import comms from '@/vuePhaserComms'
import Ball from '@/game/objects/Ball'
import Paddle from '@/game/objects/Paddle'
import Blocks from '@/game/objects/Blocks'
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
    this.prefabs.paddle = new Paddle(this, 400, 550)
    this.prefabs.cursor = this.input.keyboard.createCursorKeys()

    comms.emit('pre play')
    comms.once('start play', this.setupPlay.bind(this))
  }

  private setupPlay (): void {
    particlesInit(this)

    const ball = new Ball(this, 400, 300)

    this.prefabs.paddle.setupBallCollider(ball, this.bounceBallOffPaddle)
    const blocks = new Blocks(this)
    blocks.setupBallCollider(ball, this.blockHit.bind(this))

    this.prefabs = { ball, blocks, ...this.prefabs }

    this.putBallOnPaddle()
    this.physics.world.on('worldbounds', this.ballHitWorldBounds, this)

    this.initPauseHandling()
    this.setupInitialFadeIn(ball, ...blocks.all)
  }

  private setupInitialFadeIn (...objects: { alpha: number }[]): void {
    objects.forEach(obj => {
      obj.alpha = 0
      this.tweens.add({
        targets: obj,
        alpha: 1,
        ease: 'Expo.easeInOut',
        duration: 1250
      })
    })
  }

  private initPauseHandling (): void {
    this.activatePauseButton()
    comms.on('pause', this.pause.bind(this))
  }

  private activatePauseButton (): void {
    this.input.keyboard.on(keys.pause, () => comms.emit('pause'))
  }

  private pause (): void {
    this.scene.pause()
    this.scene.run('PauseScene')
  }

  private restart (): void {
    this.score.reset()
    this.lifeCounter.reset()
    this.prefabs.blocks.reset()
    this.putBallOnPaddle()
    this.prefabs.ball.fadeIn()
    this.activatePauseButton()
  }

  private putBallOnPaddle (): void {
    const { ball, paddle } = this.prefabs

    ball.disableFull()
    paddle.mountBall(ball)

    const sign = Phaser.Math.Between(0, 1) === 0 ? -1 : +1 // left or right
    this.ballPaddleOffset.x = sign * paddle.halfWidth / 3
    this.ballPaddleOffset.y = -(paddle.halfHeight + ball.halfHeight - 1)
    ball.setPosition(this.ballPaddleOffset.x, this.ballPaddleOffset.y)
    ball.fadeIn()
  }

  private launchBallFromPaddle (): void {
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

  private bounceBallOffPaddle (ball: Ball, paddle: Paddle): void {
    this.audio.play('wooden')
    this.setBallVelocity(
      Phaser.Math.Angle.Between(paddle.x, paddle.y, ball.x, ball.y)
    )
    ball.spin = Direction[ball.x < paddle.x ? 'Left' : 'Right']
    this.prefabs.blocks.resetScoreMultiplier()
  }

  private setBallVelocity (angleRad: number): void {
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

  private ballHitWorldBounds (
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

  private blockHit (ball: Ball, block: PhysicsSprite, points: number): void {
    const { blocks } = this.prefabs

    this.audio.play('ding')
    this.score.increment(points)
    this.spinBallOnCollision(ball.body.touching)
    blocks.bumpScoreMultiplier()
    blocks.killBlock(block).then(() => {
      if (blocks.allDead) {
        ball.fadeKill().then(() => this.gameOver(true))
      }
    })
  }

  private loseLife (): void {
    const { ball } = this.prefabs

    this.audio.play('explosion')
    this.prefabs.blocks.resetScoreMultiplier()
    this.lifeCounter.decrement()
    ball.explode()
    if (this.lifeCounter.number === 0) {
      this.gameOver()
    } else {
      ball.show()
      this.putBallOnPaddle()
    }
  }

  private gameOver (won: boolean = false): void {
    // @ts-ignore - no need to pass fn argument here
    this.input.keyboard.removeListener(keys.pause)
    comms.emit('game over', won)
    comms.once('start play', this.restart.bind(this))
  }

  private spinBallOnCollision (
    { up, right, down, left }: ArcadeBodyCollision
  ): void {
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
    const { paddle, cursor } = this.prefabs

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
