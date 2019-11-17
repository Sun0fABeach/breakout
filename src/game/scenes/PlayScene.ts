import { Scene } from 'phaser'
import Ball from '@/game/objects/Ball'
import Paddle from '@/game/objects/Paddle'
import Blocks from '@/game/objects/Blocks'
import Levels from '@/game/Levels'
import Audio from '@/game/Audio'
import Particles from '@/game/Particles'
import { Direction, keys } from '@/game/globals'
import Store, { GameState } from '@/game/Store'

export default class PlayScene extends Scene {
  private prefabs: { [index: string]: any } = {} // filled in create()
  private readonly scoreMultBump: number = 0.5

  constructor () {
    super({ key: 'PlayScene' })
  }

  create (): void {
    Audio.init(this)
    Particles.init(this) // needs to come before Blocks.init
    Blocks.init(this)
    Levels.init(this)

    const worldDimensions = this.physics.world.bounds

    this.add.image(
      worldDimensions.width / 2,
      worldDimensions.height / 2,
      'spritesheet',
      'sky'
    )
    this.prefabs.paddle = new Paddle( // shown on start screen
      this,
      worldDimensions.width / 2,
      worldDimensions.height - 50
    )

    this.prefabs.cursor = this.input.keyboard.createCursorKeys()

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
    const { paddle } = this.prefabs
    const ball = new Ball(this, 0, 0)

    paddle.mountBall(ball)
    paddle.setupBallCollider(ball, this.bounceBallOffPaddle)

    const blocks: Blocks = Levels.next()
    blocks.setupBallCollider(ball, this.blockHit.bind(this))

    this.prefabs = { ball, blocks, ...this.prefabs }

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
    this.modifyCursorButtons((button: KeyboardKey) => {
      // @ts-ignore reset is not a static function
      button.reset()
      button.preventDefault = false
      button.enabled = false
    })
  }

  private activateCursorButtons (): void {
    this.modifyCursorButtons((button: KeyboardKey) => {
      button.preventDefault = true
      button.enabled = true
    })
  }

  private modifyCursorButtons (
    callback: { (button: KeyboardKey): void }
  ): void {
    Object.values(this.prefabs.cursor as KeyboardKey[]).forEach(callback)
  }

  private launchBallFromPaddle (): void {
    const { paddle, blocks } = this.prefabs

    const newBall = paddle.detachBall()

    this.bounceBallOffPaddle(newBall, paddle)
    paddle.setBallForCollider(newBall)
    blocks.setBallForCollider(newBall)

    this.prefabs.ball = newBall
  }

  private bounceBallOffPaddle (ball: Ball, paddle: Paddle): void {
    Audio.play('wooden')
    paddle.bounceBallOff(ball)
    ball.spin = Direction[ball.x < paddle.x ? 'Left' : 'Right']
    Store.resetScoreMultiplier()
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
      const ball: Ball = this.prefabs.ball
      ball.puff(up, false, left, right)
      ball.spinOnCollision({ up, right, down, left, none: false })
      ball.adjustTail()
    }
  }

  private blockHit (ball: Ball, block: PhysicsSprite, points: number): void {
    const { blocks } = this.prefabs

    Store.bumpScore(points)

    if (blocks.allHit) {
      Audio.play('gong')
      ball.deactivateTail()
      ball.explode()

      if (Levels.hasNext()) {
        this.transitionNextLevel()
      } else {
        this.gameOver(true)
      }
    } else {
      ball.spinOnCollision(ball.body.touching)
      ball.adjustTail()
      if (block.getData('accelerates')) {
        Audio.play('punch')
        Store.bumpScoreMultiplier(this.scoreMultBump * 2)
      } else {
        Audio.play(block.getData('strength') === 0 ? 'ding' : 'dong')
        Store.bumpScoreMultiplier(this.scoreMultBump)
      }
    }
  }

  private transitionNextLevel (
    reset: Boolean = false, timeoutBase: number = 1000
  ): Promise<void> {
    this.deactivatePauseButton()

    Store.resetScoreMultiplier()

    // reset of level num not delayed -> in sync with other sidebar num resets
    reset ? Store.resetLevel() : setTimeout(Store.nextLevel, timeoutBase)

    setTimeout(() => {
      Store.changeGameState(GameState.NextLevel) // shows next level text
    }, timeoutBase)

    setTimeout(() => {
      Store.changeGameState(GameState.Running) // hides next level text
    }, timeoutBase + 1000)

    return new Promise(resolve => {
      setTimeout(() => {
        const { ball, paddle } = this.prefabs
        this.setupNextBlocks()
        paddle.mountBall(ball)
        if (reset) {
          paddle.fadeIn()
        }
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
    const { ball, paddle } = this.prefabs

    Audio.play('explosion')
    ball.deactivateTail()
    ball.explodeBottom()
    Store.resetScoreMultiplier()
    Store.loseLife()

    if (Store.lives === 0) {
      paddle.explode()
      paddle.resetPosition()
      this.gameOver()
    } else {
      paddle.mountBall(ball)
    }
  }

  private gameOver (won: boolean = false): void {
    this.deactivatePauseButton()
    if (!won) { // paddle explodes, so deactivate right away
      this.deactivateCursorButtons()
    }

    setTimeout(() => { // wait for ball explosion to quiet down
      if (won) {
        this.deactivateCursorButtons()
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
