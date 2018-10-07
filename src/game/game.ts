import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'

function launch (width: number, height: number) {
  // eslint-disable-next-line
  new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    parent: 'phaser-game-surface',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: [BootScene, PlayScene]
  })
}

export default launch
export { launch }
