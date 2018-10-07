class Audio {
  _scene: Phaser.Scene
  _volumes: { [index: string]: number }

  constructor (scene: Phaser.Scene) {
    this._scene = scene
    this._volumes = {
      thud: 0.4,
      wooden: 0.6,
      explosion: 0.16,
      ding: 0.5
    }
  }

  play (name: string, vol?: number) {
    const volume: number = vol === undefined ? this._volumes[name] : vol
    this._scene.sound.play(name, { volume })
  }
}

export default Audio
export { Audio }
