class Audio {
  private readonly volumes: { [index: string]: number }

  constructor (private readonly scene: Scene) {
    this.volumes = {
      thud: 0.4,
      wooden: 0.6,
      explosion: 0.16,
      ding: 0.5,
      letsGo: 0.7,
      ohNo: 0.4,
      ohYeah: 0.6
    }
  }

  play (name: string, vol?: number): void {
    const volume: number = vol === undefined ? this.volumes[name] : vol
    this.scene.sound.play(name, { volume })
  }
}

export default Audio
export { Audio }
