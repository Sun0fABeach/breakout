import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'
import PauseScene from '@/game/scenes/PauseScene'

function launch (width: number, height: number): void {
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
    scene: [BootScene, PlayScene, PauseScene]
  })
}

export default launch
export { launch }
