import { transform } from 'lodash-es'

type ManagerDict = { [index: string]: ParticleEmitterManager }

interface Managers {
  readonly stars: ManagerDict,
  readonly puff: ParticleEmitterManager
}

class Particles {
  static managers: Managers

  static init (scene: Scene): void {
    const stars: ManagerDict = transform(['Small', 'Medium', 'Big'],
      (res: ManagerDict, type: string) => {
        const key = type.toLowerCase()
        res[key] = scene.add.particles('spritesheet', `star${type}`)
        res[key].depth = Infinity
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
