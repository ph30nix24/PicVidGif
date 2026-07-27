export const KB_VARIANTS = [
  { fromScale: 1.18, toScale: 1.0,  fromX:  '4%', toX: '-4%', fromY:  '3%', toY: '-2%' },
  { fromScale: 1.0,  toScale: 1.18, fromX: '-3%', toX:  '3%', fromY: '-2%', toY:  '3%' },
  { fromScale: 1.14, toScale: 1.04, fromX:  '0%', toX:  '5%', fromY:  '4%', toY: '-1%' },
  { fromScale: 1.06, toScale: 1.20, fromX:  '3%', toX: '-3%', fromY: '-3%', toY:  '2%' },
  { fromScale: 1.12, toScale: 1.0,  fromX: '-4%', toX:  '2%', fromY:  '1%', toY: '-4%' },
];

export const BG_TILES = [
  // Row block 1 (rows 1–2)
  { src: '/lake_dock.png',   col: '1 / 2', row: '1 / 3', kb: 0 },   // tall portrait
  { src: '/astronaut.png',   col: '2 / 4', row: '1 / 2', kb: 1 },   // wide landscape
  { src: '/jellyfish.png',   col: '4 / 5', row: '1 / 3', kb: 2 },   // tall portrait
  { src: '/neon_city.png',   col: '5 / 6', row: '1 / 2', kb: 3 },   // small square
  // Row block 2 (row 2)
  { src: '/cute_cat.png',    col: '2 / 3', row: '2 / 3', kb: 4 },   // small square
  { src: '/galaxy_sky.png',  col: '3 / 4', row: '2 / 3', kb: 0 },   // small square
  { src: '/dark_forest.png', col: '5 / 6', row: '2 / 4', kb: 1 },   // tall portrait
  // Row block 3 (row 3)
  { src: '/sports_car.png',  col: '1 / 3', row: '3 / 4', kb: 2 },   // wide landscape
  { src: '/underwater.png',  col: '3 / 5', row: '3 / 4', kb: 3 },   // wide landscape
  // Row block 4 (row 4)
  { src: '/swirl.png',       col: '1 / 2', row: '4 / 5', kb: 4 },   // small square
  { src: '/sunset.png',      col: '2 / 4', row: '4 / 5', kb: 0 },   // wide
  { src: '/neon_city.png',   col: '4 / 6', row: '4 / 5', kb: 1 },   // wide
];