enum Direction {
  Up, Down, Left, Right
}

const keys: { readonly [index: string]: string } = {
  mute: 'keydown_M',
  pause: 'keydown_P',
  restart: 'keydown_R'
}

const numLevels: number = 5

export {
  Direction,
  keys,
  numLevels
}
