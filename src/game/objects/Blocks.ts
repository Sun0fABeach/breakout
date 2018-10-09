import { Physics } from 'phaser'
import { managers as particleManagers } from '@/game/particleManagers'
import Ball from '@/game/objects/Ball'

import ArcadePhysics = Phaser.Physics.Arcade
type Emitter = Phaser.GameObjects.Particles.ParticleEmitter
type Block = ArcadePhysics.Sprite
type GameObj = Phaser.GameObjects.GameObject
type CollisionCb = (
  ball: Ball,
  block: ArcadePhysics.Sprite,
  points: number
) => any

class Blocks {
  private readonly blockGroups: BlockGroup[]
  private readonly emitters: Emitter[]

  constructor (scene: Phaser.Scene) {
    const padX = 100
    const padY = 50
    const colGap = 100
    const rowGap = 50
    const numCols = 7

    this.blockGroups = [
      { type: 'Green', value: 250 },
      { type: 'Grey', value: 200 },
      { type: 'Purple', value: 150 },
      { type: 'Red', value: 100 },
      { type: 'Yellow', value: 50 }
    ].map((blockDef, idx) => {
      const config: GroupCreateConfig = {
        key: 'block' + blockDef.type,
        repeat: numCols - 1,
        setXY: {
          x: padX, y: padY + rowGap * idx, stepX: colGap
        }
      }
      return new BlockGroup(scene, config, blockDef.value)
    })

    this.emitters = ['small', 'medium'].map(type =>
      particleManagers.stars[type].createEmitter({
        active: false,
        blendMode: Phaser.BlendModes.SCREEN,
        scale: { start: 0.8, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: 20
      })
    )
  }

  killBlock (toKill: Block) {
    const containerGroup: BlockGroup | undefined = this.blockGroups.find(
      group => group.contains(toKill)
    )
    if (!containerGroup) {
      return
    }
    containerGroup.killBlock(toKill)
    this.emitters.forEach(emitter => {
      emitter.setEmitZone({
        type: 'edge',
        source: toKill.getBounds(),
        quantity: 20
      })
      emitter.resume()
      // @ts-ignore - no need to pass arguments here
      emitter.explode()
    })
  }

  reset () {
    this.blockGroups.forEach(group => group.reset())
  }

  setupBallCollider (ball: Ball, callback: CollisionCb) {
    this.blockGroups.forEach(group => group.setupBallCollider(ball, callback))
  }

  setBallForCollider (ball: Ball) {
    this.blockGroups.forEach(group => group.setBallForCollider(ball))
  }
}

class BlockGroup extends Physics.Arcade.StaticGroup {
  private readonly scoreVal: number
  private ballCollider: ArcadePhysics.Collider | null

  constructor (
    scene: Phaser.Scene, config: GroupCreateConfig, scoreVal: number
  ) {
    super(scene.physics.world, scene)
    this.createFromConfig(config)

    this.scoreVal = scoreVal
    this.ballCollider = null
  }

  killBlock (block: Block): void {
    this.killAndHide(block)
    block.body.enable = false
  }

  reset (): void {
    for (
      let dead: Block = this.getFirstDead(); dead; dead = this.getFirstDead()
    ) {
      dead.setActive(true)
      dead.setVisible(true)
      dead.body.enable = true
    }
  }

  setupBallCollider (ball: Ball, callback: CollisionCb): void {
    const scoreVal = this.scoreVal
    this.ballCollider = this.scene.physics.add.collider(
      ball,
      this,
      function (this: Phaser.Scene, ball: GameObj, block: GameObj) {
        // eslint-disable-next-line standard/no-callback-literal
        callback(ball as Ball, block as ArcadePhysics.Sprite, scoreVal)
      },
      undefined,
      this.scene
    )
  }

  setBallForCollider (ball: Ball): void {
    // @ts-ignore
    this.ballCollider.object1 = ball
  }
}

export default Blocks
export { Blocks }
