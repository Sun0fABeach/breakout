enum Direction {
  Up, Down, Left, Right
}

const keys: { readonly [index: string]: string } = {
  pause: 'keydown_P',
  restart: 'keydown_R'
}

const numLevels: number = 4

export {
  Direction,
  keys,
  numLevels
}
