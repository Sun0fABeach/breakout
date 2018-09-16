import { Physics } from 'phaser'

class Blocks extends Physics.Arcade.StaticGroup {
  constructor (scene) {
    super(scene.physics.world, scene)

    const padX = 100
    const padY = 50
    const colGap = 100
    const rowGap = 50
    const numCols = 7

    const groupConfigs = [
      'Green', 'Grey', 'Purple', 'Red', 'Yellow'
    ].map((color, idx) => {
      return {
        key: 'block' + color,
        repeat: numCols - 1,
        setXY: {
          x: padX, y: padY + rowGap * idx, stepX: colGap
        }
      }
    })

    this.createMultiple(groupConfigs)
  }
}

export default Blocks
export { Blocks }
