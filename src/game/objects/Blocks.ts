import { Physics, GameObjects, Geom } from 'phaser'
import Particles from '@/game/Particles'
import Ball from '@/game/objects/Ball'
import PointsText from '@/game/objects/text/PointsText'
import Store from '@/game/Store'
import {
  map, concat, reduce, each, compact, values, method, flatten, every, some
} from 'lodash-es'

type Block = PhysicsSprite
type tiledBlockData = {
  readonly name: string,
  readonly value: number | boolean
}
type CollisionCb = (
  ball: Ball,
  block: PhysicsSprite,
  points: number
) => any

const emitterQuantity: number = 20

const blockColors: string[] = [
  'Green', 'Grey', 'Purple', 'Red', 'Yellow', 'Blue'
]
const blockVariants: string[] = ['', 'Strong', 'Speed']
const blockGroupNames: string[] = reduce(blockVariants,
  (res: string[], variant: string) =>
    concat(res, map(blockColors, (name: string) => `block${name}${variant}`)),
  []
)

class Blocks {
  static emitters: ParticleEmitter[]
  private readonly blockGroups: BlockGroup[]

  /* needs to be called before constructing instances! */
  static init (scene: Scene): void {
    Blocks.emitters = map(['small', 'medium'], (type: string) =>
      Particles.managers.stars[type].createEmitter({
        on: false,
        blendMode: Phaser.BlendModes.SCREEN,
        scale: { start: 0.8, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: emitterQuantity
      })
    )
  }

  constructor (scene: Scene, tilemap: Phaser.Tilemaps.Tilemap) {
    const pointsTextGroup = new GameObjects.Group(scene, {
      classType: PointsText
    })

    this.blockGroups = compact(map(blockGroupNames, (spriteName: string) => {
      const blocks: GameObjects.Sprite[] = tilemap.createFromObjects(
        'Blocks', spriteName, { key: 'spritesheet', frame: spriteName }
      )
      if (blocks.length === 0) {
        return null
      }
      each(blocks, (block: GameObjects.Sprite) => {
        this.normalizeTiledObjectData(block)
        scene.physics.world.enableBody(block, Physics.Arcade.STATIC_BODY)
      })
      return new BlockGroup(scene, blocks as Block[], pointsTextGroup)
    }))
  }

  private normalizeTiledObjectData (block: GameObjects.Sprite): void {
    each(values(block.data.list), (entry: tiledBlockData, idx: number) => {
      block.setData(entry.name, entry.value)
      block.data.remove(idx.toString())
    })
  }

  killAll (): void {
    each(this.blockGroups, method('killAll'))
  }

  fadeKillAll (): Promise<(void | Promise<void>)[]> {
    return Promise.all(map(this.blockGroups, (group: BlockGroup) =>
      new Promise(async resolve => {
        await group.fadeKillAll()
        resolve()
      })
    ))
  }

  reset (): void {
    each(this.blockGroups, method('reset'))
  }

  setupBallCollider (ball: Ball, callback: CollisionCb): void {
    each(this.blockGroups, method('setupBallCollider', ball, callback))
  }

  setBallForCollider (ball: Ball): void {
    each(this.blockGroups, method('setBallForCollider', ball))
  }

  get all (): Block[] {
    return flatten(map(this.blockGroups, 'blocks'))
  }

  get allHit (): boolean {
    return every(this.blockGroups, 'allHit')
  }
}

class BlockGroup extends Physics.Arcade.StaticGroup {
  private ballCollider: Collider | null

  constructor (
    scene: Scene,
    blocks: Block[],
    private readonly pointsTextGroup: GameObjects.Group
  ) {
    super(scene.physics.world, scene, blocks)
    each(blocks, this.prepareBlock)
    this.ballCollider = null
  }

  private prepareBlock (block: Block): void {
    if (block.getData('strength') > 1) {
      block.setTint(0xffffff, 0x333333, 0x333333, 0xffffff)
    }
    const body = block.body as ArcadePhysics.StaticBody
    body.updateFromGameObject() // might be transformed in tiled, so adjust body
  }

  setupBallCollider (ball: Ball, callback: CollisionCb): void {
    const self: BlockGroup = this

    this.ballCollider = this.scene.physics.add.collider(
      ball,
      this,
      function (this: Scene, ball: GameObject, block: GameObject) {
        const points: number = block.getData('value') * Store.scoreMultiplier
        self.handleHit(block as Block, ball as Ball, points)
        // eslint-disable-next-line standard/no-callback-literal
        callback(ball as Ball, block as Block, points)
      },
      undefined,
      this.scene
    )
  }

  setBallForCollider (ball: Ball): void {
    // @ts-ignore
    this.ballCollider.object1 = ball
  }

  private handleHit (block: Block, ball: Ball, points: number): void {
    this.showPoints(block, points)

    let strength: number = block.getData('strength')
    if (strength === 1) {
      this.emitHitParticles(block)
      this.fadeKillBlock(block)
    } else {
      block.clearTint()
      block.setTexture('spritesheet', block.frame.name.replace('Strong', ''))
    }
    block.setData('strength', strength - 1)

    if (block.getData('accelerates')) {
      ball.increaseSpeed()
      ball.activateTail()
    }
  }

  private killBlock (toKill: Block): void {
    toKill.body.enable = false
    this.killAndHide(toKill)
  }

  private async fadeKillBlock (toKill: Block): Promise<void> {
    toKill.body.enable = false
    await this.fadeOut(toKill)
    this.killBlock(toKill)
  }

  killAll (): void {
    let alive: Block
    while ((alive = this.getFirstAlive()) !== null) {
      this.killBlock(alive)
    }
  }

  async fadeKillAll (
    duration: number = 500,
    easing: string = 'Linear'
  ): Promise<void> {
    await this.fadeOut(this.blocks, duration, easing)
    this.killAll()
  }

  private fadeOut (
    blocks: Block | Block[],
    duration: number = 300,
    easing: string = 'Expo.easeOut'
  ): Promise<void> {
    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: blocks,
        alpha: 0,
        ease: easing,
        duration: duration,
        onComplete: resolve
      })
    })
  }

  private emitHitParticles (block: Block): void {
    const isSpeedBlock: boolean = !!block.getData('accelerates')

    each(Blocks.emitters, (emitter: ParticleEmitter) => {
      emitter.setEmitZone({
        type: 'edge',
        source: isSpeedBlock ? this.speedBlockBounds(block) : block.getBounds(),
        quantity: emitterQuantity
      })
      // @ts-ignore - no need to pass arguments here
      emitter.explode()
    })
  }

  private speedBlockBounds (block: Block): Geom.Polygon {
    const { x: left, y: top, right, bottom }: Phaser.Geom.Rectangle =
      block.getBounds()
    const { halfWidth, halfHeight }: { halfWidth: number, halfHeight: number } =
      block.body

    return new Geom.Polygon([
      new Geom.Point(left + halfWidth, top),
      new Geom.Point(right, top + halfHeight),
      new Geom.Point(left + halfWidth, bottom),
      new Geom.Point(left, top + halfHeight),
      new Geom.Point(left + halfWidth, top),
    ])
  }

  private showPoints (block: Block, points: number): void {
    const pointsText: PointsText = this.pointsTextGroup.getFirstDead(true)
    // for some reason, pointsText not created active == true by group
    pointsText.setActive(true)
    pointsText.setDisplay(block.x, block.y, points)
    pointsText.show().then(() => this.pointsTextGroup.killAndHide(pointsText))
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

  get allHit (): boolean {
    return !some(this.blocks, 'body.enable')
  }

  get blocks (): Block[] {
    return this.getChildren() as Block[]
  }
}

export default Blocks
export { Blocks }
