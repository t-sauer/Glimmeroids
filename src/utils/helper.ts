/**
 * Random Number between 2 numbers
 */
export function randomNumBetween(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

/**
 * Random Number between 2 numbers excluding a certain range
 */
export function randomNumBetweenExcluding(min: number, max: number, exMin: number, exMax: number) {
  let random = randomNumBetween(min, max);
  while (random > exMin && random < exMax) {
    random = Math.random() * (max - min + 1) + min;
  }
  return random;
}

/**
 * Rotate point around center on certain angle
 */
export function rotatePoint(p: {x: number, y: number}, center: {x: number, y: number}, angle: number) {
  return {
    x: ((p.x - center.x) * Math.cos(angle) - (p.y - center.y) * Math.sin(angle)) + center.x,
    y: ((p.x - center.x) * Math.sin(angle) + (p.y - center.y) * Math.cos(angle)) + center.y
  };
}

/**
 * Generates vertices for asteroid polygon with certain count and radius
 */
export function asteroidVertices(count: number, rad: number): Array<{x: number, y: number}> {
  let p = [];
  for (let i = 0; i < count; i++) {
    p[i] = {
      x: (-Math.sin((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad,
      y: (-Math.cos((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad
    };
  }
  return p;
}
