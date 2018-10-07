type ParticleManager =
  Phaser.GameObjects.Particles.ParticleEmitterManager
type ManagerDict = { [index : string] : ParticleManager }

interface Managers {
  stars : ManagerDict,
  puff : ParticleManager
}

let managers : Managers

function init (scene : Phaser.Scene) {
  const stars : ManagerDict = ['Small', 'Medium', 'Big'].reduce(
    (res : ManagerDict, type : string) => {
      res[type.toLowerCase()] = scene.add.particles(`particleStar${type}`)
      return res
    }, {}
  )
  const puff : ParticleManager = scene.add.particles('puff')

  managers = { stars, puff }
}

export { init, managers }
