import { Physics, GameObjects } from 'phaser'
import { managers as particleManagers } from '@/game/particleManagers'
import comms from '@/vuePhaserComms'
import Ball from '@/game/objects/Ball'
import PointsText from '@/game/objects/text/PointsText'

type Block = PhysicsSprite
type CollisionCb = (
  ball: Ball,
  block: PhysicsSprite,
  points: number
) => any

class Blocks {
  private readonly blockGroups: BlockGroup[]
  private readonly pointsTextGroup: GameObjects.Group
  private readonly emitters: ParticleEmitter[]
  private scoreMult : number

  constructor (private readonly scene: Scene) {
    const padX = 100
    const padY = 50
    const colGap = 100
    const rowGap = 50
    const numCols = 7

    this.scoreMult = 1

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
      return new BlockGroup(this, scene, config, blockDef.value)
    })

    this.pointsTextGroup = new GameObjects.Group(scene, {
      classType: PointsText
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

  killBlock (toKill: Block): void {
    const containerGroup: BlockGroup | undefined = this.blockGroups.find(
      group => group.contains(toKill)
    )
    if (!containerGroup) {
      return
    }
    toKill.body.enable = false
    this.emitHitParticles(toKill)
    this.showPoints(toKill, containerGroup.points * this.scoreMultiplier)
    this.fadeOut(toKill).then(() => containerGroup.killBlock(toKill))
  }

  fadeOut (block: Block): Promise<undefined> {
    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: block,
        alpha: 0,
        ease: 'Expo.easeOut',
        duration: 300,
        onComplete: resolve
      })
    })
  }

  emitHitParticles (block: Block): void {
    this.emitters.forEach(emitter => {
      emitter.setEmitZone({
        type: 'edge',
        source: block.getBounds(),
        quantity: 20
      })
      emitter.resume()
      // @ts-ignore - no need to pass arguments here
      emitter.explode()
    })
  }

  showPoints (block: Block, points: number) {
    const pointsText: PointsText = this.pointsTextGroup.getFirstDead(true)
    // for some reason, pointsText not created active == true by group
    pointsText.setActive(true)
    const blockCenter: Phaser.Math.Vector2 = block.body.center
    pointsText.setDisplay(blockCenter.x, blockCenter.y, points)
    pointsText.show().then(() => this.pointsTextGroup.killAndHide(pointsText))
  }

  reset (): void {
    this.blockGroups.forEach(group => group.reset())
    this.resetScoreMultiplier()
  }

  setupBallCollider (ball: Ball, callback: CollisionCb): void {
    this.blockGroups.forEach(group => group.setupBallCollider(ball, callback))
  }

  setBallForCollider (ball: Ball): void {
    this.blockGroups.forEach(group => group.setBallForCollider(ball))
  }

  bumpScoreMultiplier (): void {
    this.scoreMult += 0.5
    this.emitScoreMultiplier()
  }

  resetScoreMultiplier (): void {
    this.scoreMult = 1
    this.emitScoreMultiplier()
  }

  emitScoreMultiplier (): void {
    comms.emit('multiplier change', this.scoreMult)
  }

  get scoreMultiplier (): number {
    return this.scoreMult
  }

  get all (): PhysicsSprite[] {
    return this.blockGroups.reduce(
      (acc: PhysicsSprite[], group: BlockGroup) => {
        return acc.concat(group.getChildren() as PhysicsSprite[])
      }, [])
  }
}

class BlockGroup extends Physics.Arcade.StaticGroup {
  private ballCollider: Collider | null

  constructor (
    private readonly master: Blocks,
    scene: Scene,
    config: GroupCreateConfig,
    private readonly scoreVal: number
  ) {
    super(scene.physics.world, scene)
    this.createFromConfig(config)
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
      this.scene.tweens.add({
        targets: dead,
        alpha: 1, // got set to 0 by fade out
        ease: 'Expo.easeInOut',
        duration: 1500
      })
    }
  }

  setupBallCollider (ball: Ball, callback: CollisionCb): void {
    const self: BlockGroup = this
    this.ballCollider = this.scene.physics.add.collider(
      ball,
      this,
      function (this: Scene, ball: GameObject, block: GameObject) {
        // eslint-disable-next-line standard/no-callback-literal
        callback(
          ball as Ball,
          block as PhysicsSprite,
          self.scoreVal * self.master.scoreMultiplier
        )
      },
      undefined,
      this.scene
    )
  }

  setBallForCollider (ball: Ball): void {
    // @ts-ignore
    this.ballCollider.object1 = ball
  }

  get points (): number {
    return this.scoreVal
  }
}

export default Blocks
export { Blocks }
