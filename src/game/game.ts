import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'
import PauseScene from '@/game/scenes/PauseScene'

function launch (
  containerId: string, width: number, height: number
): Phaser.Game {
  // eslint-disable-next-line
  return new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    parent: containerId,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: [BootScene, PlayScene, PauseScene]
  })
}

export default launch
export { launch }
