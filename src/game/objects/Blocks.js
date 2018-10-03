import { Physics } from 'phaser'

class Blocks {
  constructor (scene) {
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
      const config = {
        key: 'block' + blockDef.type,
        repeat: numCols - 1,
        setXY: {
          x: padX, y: padY + rowGap * idx, stepX: colGap
        }
      }
      return new BlockGroup(scene, config, blockDef.value)
    })
  }

  killBlock (block) {
    this._blockGroups.find(group => group.contains(block)).killBlock(block)
  }

  reset () {
    this._blockGroups.forEach(group => group.reset())
  }

  setupBallCollider (ball, callback) {
    this._blockGroups.forEach(group => group.setupBallCollider(ball, callback))
  }

  setBallForCollider (ball) {
    this._blockGroups.forEach(group => group.setBallForCollider(ball))
  }
}

class BlockGroup extends Physics.Arcade.StaticGroup {
  constructor (scene, config, scoreVal) {
    super(scene.physics.world, scene)
    this.createFromConfig(config)

    this._scene = scene
    this._scoreVal = scoreVal
    this._ballCollider = null
  }

  killBlock (block) {
    this.killAndHide(block)
    block.body.enable = false
  }

  reset () {
    for (let dead = this.getFirstDead(); dead; dead = this.getFirstDead()) {
      dead.setActive(true)
      dead.setVisible(true)
      dead.body.enable = true
    }
  }

  setupBallCollider (ball, callback) {
    this._ballCollider = this._scene.physics.add.collider(
      ball,
      this,
      (ball, block) => callback(ball, block, this._scoreVal),
      null,
      this._scene
    )
  }

  setBallForCollider (ball) {
    this._ballCollider.object1 = ball
  }
}

export default Blocks
export { Blocks }
