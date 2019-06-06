type ManagerDict = { [index: string]: ParticleEmitterManager }

interface Managers {
  readonly stars: ManagerDict,
  readonly puff: ParticleEmitterManager
}

class Particles {
  static managers: Managers

  static init (scene: Scene): void {
    const stars: ManagerDict = ['Small', 'Medium', 'Big'].reduce(
      (res: ManagerDict, type: string) => {
        const key = type.toLowerCase()
        res[key] = scene.add.particles('spritesheet', `star${type}`)
        res[key].depth = Infinity
        return res
      }, {}
    )
    const puff: ParticleEmitterManager = scene.add.particles(
      'spritesheet', 'puff'
    )
    puff.depth = Infinity

    Particles.managers = { stars, puff }
  }
}

export default Particles
export { Particles }
