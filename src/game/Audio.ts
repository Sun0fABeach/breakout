import Store from '@/game/Store'

class Audio {
  private static scene: Scene
  private static readonly volumes: { [index: string]: number } = {
    thud: 0.4,
    wooden: 0.6,
    explosion: 0.16,
    ding: 0.5,
    dong: 0.9,
    punch: 0.2,
    letsGo: 0.7,
    ohNo: 0.4,
    ohYeah: 0.7,
    swish: 1.0,
    gong: 0.7
  }

  static init (scene: Scene) {
    Audio.scene = scene
  }

  static play (name: string, vol?: number): void {
    if (Store.muted) {
      return
    }
    const volume: number = vol === undefined ? Audio.volumes[name] : vol
    Audio.scene.sound.playAudioSprite('audiosprite', name, { volume })
  }
}

export default Audio
export { Audio }
