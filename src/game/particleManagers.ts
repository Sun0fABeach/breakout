type ManagerDict = { [index: string]: ParticleEmitterManager }

interface Managers {
  stars: ManagerDict,
  puff: ParticleEmitterManager
}

let managers: Managers

function init (scene: Scene): void {
  const stars: ManagerDict = ['Small', 'Medium', 'Big'].reduce(
    (res: ManagerDict, type: string) => {
      res[type.toLowerCase()] = scene.add.particles(`particleStar${type}`)
      return res
    }, {}
  )
  const puff: ParticleEmitterManager = scene.add.particles('puff')

  managers = { stars, puff }
}

export { init, managers }
