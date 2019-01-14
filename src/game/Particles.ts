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
        res[type.toLowerCase()] = scene.add.particles('other', `star${type}`)
        return res
      }, {}
    )
    const puff: ParticleEmitterManager = scene.add.particles('other', 'puff')

    Particles.managers = { stars, puff }
  }
}

export default Particles
export { Particles }
