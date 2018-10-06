const managers = {
  stars: {},
  puff: null
}

function init (scene) {
  ['Small', 'Medium', 'Big'].forEach(type => {
    managers.stars[type.toLowerCase()] = scene.add.particles(
      `particleStar${type}`
    )
  })

  managers.puff = scene.add.particles('puff')
}

export { init, managers }
