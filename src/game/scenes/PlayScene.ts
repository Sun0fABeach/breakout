import Phaser, { Scene } from 'phaser'
import Ball from '@/game/objects/Ball'
import Paddle from '@/game/objects/Paddle'
import Blocks from '@/game/objects/Blocks'
import Levels from '@/game/Levels'
import Audio from '@/game/Audio'
import Particles from '@/game/Particles'
import { Direction, keys } from '@/game/globals'
import Store, { GameState } from '@/game/Store'

export default class PlayScene extends Scene {
  private prefabs: { [index: string]: any }
  private readonly ballPaddleOffset: { x: number, y: number }
  private readonly scoreMultBump: number

  constructor () {
    super({ key: 'PlayScene' })

    this.ballPaddleOffset = { x: 0, y: 0 }
    this.scoreMultBump = 0.5
    this.prefabs = {} // filled in create()
  }

  create (): void {
    this.add.image(400, 300, 'other', 'sky')
    this.prefabs.paddle = new Paddle(this, 400, 550)
    this.prefabs.cursor = this.input.keyboard.createCursorKeys()

    Audio.init(this)
    Particles.init(this)
    Blocks.init(this)
    Levels.init(this)

    Store.changeGameState(GameState.PrePlay)
    Store.onGameStateChange(GameState.StartPlay, () => {
      Audio.play('letsGo')
      this.setupPlay()
    })
    Store.onGameStateChange(GameState.RestartPlay, () => {
      Audio.play('letsGo')
      this.restart()
    })

    // play sound slightly into bounce-in animation of start button
    setTimeout(() => Audio.play('swish'), 325)
  }

  private setupPlay (): void {
    const ball = new Ball(this, 400, 300)

    this.prefabs.paddle.setupBallCollider(ball, this.bounceBallOffPaddle)

    const blocks: Blocks = Levels.next()
    blocks.setupBallCollider(ball, this.blockHit.bind(this))

    this.prefabs = { ball, blocks, ...this.prefabs }

    this.putBallOnPaddle()
    this.physics.world.on('worldbounds', this.ballHitWorldBounds, this)

    this.initPauseHandling()
    this.fadeIn(ball, ...blocks.all)

    Store.changeGameState(GameState.Running)
  }

  private initPauseHandling (): void {
    this.activatePauseButton()
    Store.onGameStateChange(GameState.Paused, this.pause.bind(this))
  }

  private activatePauseButton (): void {
    this.input.keyboard.on(
      keys.pause,
      () => Store.changeGameState(GameState.Paused)
    )
  }

  private deactivatePauseButton (): void {
    // @ts-ignore - no need to pass fn argument here
    this.input.keyboard.removeListener(keys.pause)
  }

  private pause (): void {
    this.scene.pause()
    this.scene.run('PauseScene')
  }

  private deactivateCursorButtons (): void {
    Object.values(this.prefabs.cursor as Phaser.Input.Keyboard.Key[])
      .forEach((button: Phaser.Input.Keyboard.Key) => {
        // @ts-ignore reset is not a static function
        button.reset()
        button.preventDefault = false
        button.enabled = false
      })
  }

  private activateCursorButtons (): void {
    Object.values(this.prefabs.cursor as Phaser.Input.Keyboard.Key[])
      .forEach((button: Phaser.Input.Keyboard.Key) => {
        button.preventDefault = true
        button.enabled = true
      })
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
    Audio.play('wooden')
    this.setBallVelocity(
      Phaser.Math.Angle.Between(paddle.x, paddle.y, ball.x, ball.y)
    )
    ball.spin = Direction[ball.x < paddle.x ? 'Left' : 'Right']
    Store.resetScoreMultiplier()
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

  private ballHitWorldBounds (
    ballBody: PhysicsBody,
    up: boolean, down: boolean, left: boolean, right: boolean
  ): void {
    if (down) {
      this.loseLife()
    } else {
      // call like this to enable multiple layered thuds:
      Audio.play('thud')
      this.prefabs.ball.puff(up, false, left, right)
      this.spinBallOnCollision({ up, right, down, left, none: false })
    }
  }

  private blockHit (ball: Ball, block: PhysicsSprite, points: number): void {
    const { blocks } = this.prefabs

    Store.bumpScore(points)

    if (blocks.allHit) {
      Audio.play('gong')
      ball.explode()

      if (Levels.hasNext()) {
        this.transitionNextLevel()
      } else {
        this.gameOver(true)
      }
    } else {
      this.spinBallOnCollision(ball.body.touching)
      Store.bumpScoreMultiplier(this.scoreMultBump)
      Audio.play(block.getData('strength') === 0 ? 'ding' : 'dong')
    }
  }

  private transitionNextLevel (
    reset: Boolean = false, timeoutBase: number = 1000
  ): Promise<void> {
    this.deactivatePauseButton()

    Store.resetScoreMultiplier()

    setTimeout(() => {
      Store[reset ? 'resetLevel' : 'nextLevel']()
      Store.changeGameState(GameState.NextLevel) // shows next level text
    }, timeoutBase)

    setTimeout(() => {
      Store.changeGameState(GameState.Running) // hides next level text
    }, timeoutBase + 1000)

    return new Promise(resolve => {
      setTimeout(() => {
        this.setupNextBlocks()
        this.putBallOnPaddle()
        this.prefabs.ball.fadeIn()
        this.activatePauseButton()
        resolve()
      }, timeoutBase + 1000)
    })
  }

  private setupNextBlocks (): Blocks | null {
    const nextBlocks: Blocks = Levels.next()

    if (nextBlocks instanceof Blocks) {
      nextBlocks.setupBallCollider(this.prefabs.ball, this.blockHit.bind(this))
      this.fadeIn(...nextBlocks.all)
      this.prefabs.blocks = nextBlocks
    }
    return nextBlocks
  }

  private loseLife (): void {
    const { ball } = this.prefabs

    Audio.play('explosion')
    ball.explodeBottom()
    Store.resetScoreMultiplier()
    Store.loseLife()

    if (Store.lives === 0) {
      this.gameOver()
    } else {
      ball.show()
      this.putBallOnPaddle()
    }
  }

  private gameOver (won: boolean = false): void {
    this.deactivatePauseButton()

    setTimeout(() => { // wait for ball explosion to quiet down
      this.deactivateCursorButtons()
      if (won) {
        Store.changeGameState(GameState.Won)
        setTimeout(() => Audio.play('ohYeah'), 750)
      } else {
        Store.changeGameState(GameState.Lost)
        setTimeout(() => Audio.play('ohNo'), 750)
      }
    }, won ? 1250 : 500)
  }

  private async restart (): Promise<void> {
    await this.prefabs.blocks.fadeKillAll()
    Store.resetLives()
    Store.resetScore()
    await this.transitionNextLevel(true, 500)
    this.activateCursorButtons()
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
