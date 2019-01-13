import Phaser, { Scene } from 'phaser'
import Ball from '@/game/objects/Ball'
import Paddle from '@/game/objects/Paddle'
import Blocks from '@/game/objects/Blocks'
import Levels from '@/game/Levels'
import Audio from '@/game/Audio'
import { init as particlesInit } from '@/game/particleManagers'
import { Direction, keys } from '@/game/globals'
import store, { GameState } from '@/store'
import { changeGameState, addGameStateHandler } from './stateHelpers'

export default class PlayScene extends Scene {
  private prefabs: { [index: string]: any }
  private readonly ballPaddleOffset: { x: number, y: number }
  private readonly audio: Audio
  private readonly levels: Levels

  constructor () {
    super({ key: 'PlayScene' })

    /* init these objects here, since they don't need to wait for phaser */
    this.ballPaddleOffset = { x: 0, y: 0 }
    this.audio = new Audio(this)
    this.levels = new Levels(this)
    this.prefabs = {} // filled in create()
  }

  create (): void {
    this.add.image(400, 300, 'other', 'sky')
    this.prefabs.paddle = new Paddle(this, 400, 550)
    this.prefabs.cursor = this.input.keyboard.createCursorKeys()

    changeGameState(GameState.PrePlay)
    addGameStateHandler(GameState.StartPlay, () => {
      this.audio.play('letsGo')
      this.setupPlay()
    })
    addGameStateHandler(GameState.RestartPlay, () => {
      this.audio.play('letsGo')
      this.restart()
    })

    // play sound slightly into bounce-in animation of start button
    setTimeout(() => this.audio.play('swish'), 325)
  }

  private setupPlay (): void {
    particlesInit(this)

    const ball = new Ball(this, 400, 300)

    this.prefabs.paddle.setupBallCollider(ball, this.bounceBallOffPaddle)

    this.levels.init()
    const blocks = this.levels.next() as Blocks // this will not be null
    blocks.setupBallCollider(ball, this.blockHit.bind(this))

    this.prefabs = { ball, blocks, ...this.prefabs }

    this.putBallOnPaddle()
    this.physics.world.on('worldbounds', this.ballHitWorldBounds, this)

    this.initPauseHandling()
    this.fadeIn(ball, ...blocks.all)

    changeGameState(GameState.Running)
  }

  private fadeIn (...objects: { alpha: number }[]): void {
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
    addGameStateHandler(GameState.Paused, this.pause.bind(this))
  }

  private activatePauseButton (): void {
    this.input.keyboard.on(
      keys.pause,
      () => changeGameState(GameState.Paused)
    )
  }

  private pause (): void {
    this.scene.pause()
    this.scene.run('PauseScene')
  }

  private restart (): void {
    ['Lives', 'Score'].forEach(counter => store.commit('reset' + counter))
    this.prefabs.blocks.reset()
    this.putBallOnPaddle()
    this.prefabs.ball.fadeIn()
    this.activatePauseButton()
    changeGameState(GameState.Running)
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

    store.commit('bumpScore', points)
    this.spinBallOnCollision(ball.body.touching)
    blocks.bumpScoreMultiplier()
    blocks.killBlock(block)

    if (blocks.allHit) {
      ball.explode()
      this.gameOver(true)
      this.audio.play('gong')
    } else {
      this.audio.play('ding')
    }
  }

  private loseLife (): void {
    const { ball } = this.prefabs

    this.audio.play('explosion')
    this.prefabs.blocks.resetScoreMultiplier()
    store.commit('loseLife')
    ball.explodeBottom()
    if (store.state.lives === 0) {
      this.gameOver()
    } else {
      ball.show()
      this.putBallOnPaddle()
    }
  }

  private gameOver (won: boolean = false): void {
    // @ts-ignore - no need to pass fn argument here
    this.input.keyboard.removeListener(keys.pause)

    setTimeout(() => { // wait for ball explosion to quiet down
      if (won) {
        changeGameState(GameState.Won)
        setTimeout(() => this.audio.play('ohYeah'), 750)
      } else {
        changeGameState(GameState.Lost)
        setTimeout(() => this.audio.play('ohNo'), 750)
      }
    }, won ? 1250 : 500)
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
