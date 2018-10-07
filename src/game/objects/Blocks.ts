import { Physics } from 'phaser'
import { managers as particleManagers } from '@/game/particleManagers'
import Ball from '@/game/objects/Ball'

type Emitter = Phaser.GameObjects.Particles.ParticleEmitter
type Block = Phaser.Physics.Arcade.Sprite
type CollisionCb = (
  ball: Phaser.GameObjects.GameObject,
  block: Phaser.GameObjects.GameObject,
  points: number
) => any

class Blocks {
  _blockGroups : BlockGroup[]
  _emitters : Emitter[]

  constructor (scene : Phaser.Scene) {
    const padX = 100
    const padY = 50
    const colGap = 100
    const rowGap = 50
    const numCols = 7

    this._blockGroups = [
      { type: 'Green', value: 250 },
      { type: 'Grey', value: 200 },
      { type: 'Purple', value: 150 },
      { type: 'Red', value: 100 },
      { type: 'Yellow', value: 50 }
    ].map((blockDef, idx) => {
      const config : GroupCreateConfig = {
        key: 'block' + blockDef.type,
        repeat: numCols - 1,
        setXY: {
          x: padX, y: padY + rowGap * idx, stepX: colGap
        }
      }
      return new BlockGroup(scene, config, blockDef.value)
    })

    this._emitters = ['small', 'medium'].map(type =>
      particleManagers.stars[type].createEmitter({
        active: false,
        blendMode: Phaser.BlendModes.SCREEN,
        scale: { start: 0.8, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: 20
      })
    )
  }

  killBlock (toKill : Block) {
    const containerGroup : BlockGroup | undefined = this._blockGroups.find(
      group => group.contains(toKill)
    )
    if (!containerGroup) {
      return
    }
    containerGroup.killBlock(toKill)
    this._emitters.forEach(emitter => {
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
    this._blockGroups.forEach(group => group.reset())
  }

  setupBallCollider (ball : Ball, callback : CollisionCb) {
    this._blockGroups.forEach(group => group.setupBallCollider(ball, callback))
  }

  setBallForCollider (ball : Ball) {
    this._blockGroups.forEach(group => group.setBallForCollider(ball))
  }
}

class BlockGroup extends Physics.Arcade.StaticGroup {
  _scene : Phaser.Scene
  _scoreVal : number
  _ballCollider : Phaser.Physics.Arcade.Collider | null

  constructor (
    scene : Phaser.Scene, config : GroupCreateConfig, scoreVal : number
  ) {
    super(scene.physics.world, scene)
    this.createFromConfig(config)

    this._scene = scene
    this._scoreVal = scoreVal
    this._ballCollider = null
  }

  killBlock (block : Block) {
    this.killAndHide(block)
    block.body.enable = false
  }

  reset () {
    for (
      let dead : Block = this.getFirstDead(); dead; dead = this.getFirstDead()
    ) {
      dead.setActive(true)
      dead.setVisible(true)
      dead.body.enable = true
    }
  }

  setupBallCollider (ball : Ball, callback : CollisionCb) {
    this._ballCollider = this._scene.physics.add.collider(
      ball,
      this,
      (ball, block) => callback(ball, block, this._scoreVal),
      undefined,
      this._scene
    )
  }

  setBallForCollider (ball : Ball) {
    // @ts-ignore
    this._ballCollider.object1 = ball
  }
}

export default Blocks
export { Blocks }
