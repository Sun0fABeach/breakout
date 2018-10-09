class Audio {
  private readonly scene: Phaser.Scene
  private readonly volumes: { [index: string]: number }

  constructor (scene: Phaser.Scene) {
    this.scene = scene
    this.volumes = {
      thud: 0.4,
      wooden: 0.6,
      explosion: 0.16,
      ding: 0.5
    }
  }

  play (name: string, vol?: number): void {
    const volume: number = vol === undefined ? this.volumes[name] : vol
    this.scene.sound.play(name, { volume })
  }
}

export default Audio
export { Audio }
