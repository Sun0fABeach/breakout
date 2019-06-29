import { Physics, GameObjects, Geom } from 'phaser'
import Particles from '@/game/Particles'
import Ball from '@/game/objects/Ball'
import PointsText from '@/game/objects/text/PointsText'
import Store from '@/game/Store'

type Block = PhysicsSprite
type BlockDef = {
  readonly type: string,
  readonly value: number,
  readonly strength: number,
  readonly accelerates?: boolean
}
type CollisionCb = (
  ball: Ball,
  block: PhysicsSprite,
  points: number
) => any

const emitterQuantity: number = 20

class Blocks {
  static emitters: ParticleEmitter[]
  private readonly blockGroups: BlockGroup[]
  private static types: BlockDef[] = [
    { type: 'Green', value: 250, strength: 1 },
    { type: 'Grey', value: 200, strength: 1 },
    { type: 'Purple', value: 150, strength: 1 },
    { type: 'Red', value: 100, strength: 1 },
    { type: 'Yellow', value: 50, strength: 1 },
    { type: 'GreenStrong', value: 250, strength: 2 },
    { type: 'GreyStrong', value: 200, strength: 2 },
    { type: 'PurpleStrong', value: 150, strength: 2 },
    { type: 'RedStrong', value: 100, strength: 2 },
    { type: 'YellowStrong', value: 50, strength: 2 },
    { type: 'GreenSpeed', value: 300, strength: 1, accelerates: true },
    { type: 'GreySpeed', value: 250, strength: 1, accelerates: true },
    { type: 'PurpleSpeed', value: 200, strength: 1, accelerates: true },
    { type: 'RedSpeed', value: 150, strength: 1, accelerates: true },
    { type: 'YellowSpeed', value: 100, strength: 1, accelerates: true }
  ]

  constructor (
    scene: Scene,
    tilemap: Phaser.Tilemaps.Tilemap
  ) {
    const pointsTextGroup = new GameObjects.Group(scene, {
      classType: PointsText
    })

    this.blockGroups = Blocks.types.map((blockDef: BlockDef) => {
      const spriteName: string = 'block' + blockDef.type
      const blocks: GameObjects.Sprite[] = tilemap.createFromObjects(
        'Blocks', spriteName, { key: 'spritesheet', frame: spriteName }
      )
      blocks.forEach((block: GameObjects.Sprite) => {
        scene.physics.world.enableBody(block, Physics.Arcade.STATIC_BODY)
      })
      return new BlockGroup(scene, blocks as Block[], blockDef, pointsTextGroup)
    })
  }

  /* needs to be called before constructing instances! */
  static init (scene: Scene): void {
    Blocks.emitters = ['small', 'medium'].map(type =>
      Particles.managers.stars[type].createEmitter({
        active: false,
        blendMode: Phaser.BlendModes.SCREEN,
        scale: { start: 0.8, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: emitterQuantity
      })
    )
  }

  killAll (): void {
    this.blockGroups.forEach(group => group.killAll())
  }

  fadeKillAll (): Promise<(void | Promise<void>)[]> {
    return Promise.all(this.blockGroups.map(group =>
      new Promise(async resolve => {
        await group.fadeKillAll()
        resolve()
      })
    ))
  }

  reset (): void {
    this.blockGroups.forEach(group => group.reset())
  }

  setupBallCollider (ball: Ball, callback: CollisionCb): void {
    this.blockGroups.forEach(group => group.setupBallCollider(ball, callback))
  }

  setBallForCollider (ball: Ball): void {
    this.blockGroups.forEach(group => group.setBallForCollider(ball))
  }

  get all (): Block[] {
    return this.blockGroups.reduce(
      (acc: Block[], group: BlockGroup) => acc.concat(group.blocks), []
    )
  }

  get allHit (): boolean {
    return this.blockGroups.every(group => group.allHit)
  }
}

class BlockGroup extends Physics.Arcade.StaticGroup {
  private ballCollider: Collider | null
  private readonly scoreVal: number

  constructor (
    scene: Scene,
    blocks: Block[],
    blockDef: BlockDef,
    private readonly pointsTextGroup: GameObjects.Group
  ) {
    super(scene.physics.world, scene, blocks)
    blocks.forEach((block: Block) => this.prepareBlock(block, blockDef))
    this.ballCollider = null
    this.scoreVal = blockDef.value
  }

  private prepareBlock (
    block: Block, { strength, accelerates }: BlockDef
  ): void {
    block.setData('strength', strength)
    if (strength > 1) {
      block.setTint(0xffffff, 0x333333, 0x333333, 0xffffff)
    }
    if (accelerates) {
      block.setData('accelerates', true)
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
        self.handleHit(block as Block, ball as Ball)
        // eslint-disable-next-line standard/no-callback-literal
        callback(
          ball as Ball,
          block as Block,
          self.scoreVal * Store.scoreMultiplier
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

  private handleHit (block: Block, ball: Ball): void {
    this.showPoints(block, this.points * Store.scoreMultiplier)

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

    Blocks.emitters.forEach(emitter => {
      emitter.setEmitZone({
        type: 'edge',
        source: isSpeedBlock ? this.speedBlockBounds(block) : block.getBounds(),
        quantity: emitterQuantity
      })
      emitter.resume()
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
    return this.blocks.every((block: Block) => !block.body.enable)
  }

  get points (): number {
    return this.scoreVal
  }

  get blocks (): Block[] {
    return this.getChildren() as Block[]
  }
}

export default Blocks
export { Blocks }
