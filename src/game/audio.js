class Audio {
  constructor (scene) {
    this._scene = scene
    this._volumes = {
      thud: 0.4,
      wooden: 0.6,
      explosion: 0.16,
      ding: 0.5
    }
  }

  play (name, vol = undefined) {
    const volume = vol === undefined ? this._volumes[name] : vol
    this._scene.sound.play(name, { volume })
  }
}

export default Audio
export { Audio }
