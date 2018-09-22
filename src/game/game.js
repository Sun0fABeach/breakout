import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'

function launch (width, height) {
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
