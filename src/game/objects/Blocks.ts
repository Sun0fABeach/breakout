import { Physics, GameObjects } from 'phaser'
import Particles from '@/game/Particles'
import Ball from '@/game/objects/Ball'
import PointsText from '@/game/objects/text/PointsText'
import Store from '@/game/Store'

type Block = PhysicsSprite
type BlockDef = {
  readonly type: string,
  readonly value: number,
  readonly strength: number
}
type CollisionCb = (
  ball: Ball,
  block: PhysicsSprite,
  points: number
) => any

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
    { type: 'YellowStrong', value: 50, strength: 2 }
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
      const blocks: GameObject[] = tilemap.createFromObjects(
        'Blocks', spriteName, { key: 'blocks', frame: spriteName }
      )
      blocks.forEach((block: GameObject) => {
        scene.physics.world.enableBody(block, Physics.Arcade.STATIC_BODY)
      })
      return new BlockGroup(
        scene, blocks, blockDef.value, blockDef.strength, pointsTextGroup
      )
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
        quantity: 20
      })
    )
  }

  killAll (): void {
    this.blockGroups.forEach(group => group.killAll())
  }

  fadeKillAll (): Promise<{}[]> {
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

  get all (): PhysicsSprite[] {
    return this.blockGroups.reduce(
      (acc: PhysicsSprite[], group: BlockGroup) => {
        return acc.concat(group.getChildren() as PhysicsSprite[])
      }, []
    )
  }

  get allHit (): boolean {
    return this.blockGroups.every(group => group.allHit)
  }
}

class BlockGroup extends Physics.Arcade.StaticGroup {
  private ballCollider: Collider | null

  constructor (
    scene: Scene,
    blocks: GameObject[],
    private readonly scoreVal: number,
    strength: number,
    private readonly pointsTextGroup: GameObjects.Group
  ) {
    super(scene.physics.world, scene, blocks)
    blocks.forEach((block: GameObject) =>
      this.prepareBlock(block as Block, strength)
    )
    this.ballCollider = null
  }

  private prepareBlock (block: Block, strength: number): void {
    block.setData('strength', strength)
    if (strength > 1) {
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
        self.handleHit(block as Block)
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

  private handleHit (block: Block): void {
    this.showPoints(block, this.points * Store.scoreMultiplier)

    let strength: number = block.getData('strength')
    if (strength === 1) {
      this.emitHitParticles(block)
      this.fadeKillBlock(block)
    } else {
      block.clearTint()
      block.setTexture('blocks', block.frame.name.replace('Strong', ''))
      block.setData('strength', strength - 1)
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
    for (
      let alive: Block = this.getFirstAlive();
      alive !== null;
      alive = this.getFirstAlive()
    ) {
      this.killBlock(alive)
    }
  }

  async fadeKillAll (
    duration: number = 500,
    easing: string = 'Linear'
  ): Promise<void> {
    await this.fadeOut(this.getChildren(), duration, easing)
    this.killAll()
  }

  private fadeOut (
    blocks: GameObject | GameObject[],
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
    Blocks.emitters.forEach(emitter => {
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
    const children: Block[] = this.getChildren() as Block[]
    return children.every((block: Block) => !block.body.enable)
  }

  get points (): number {
    return this.scoreVal
  }
}

export default Blocks
export { Blocks }
