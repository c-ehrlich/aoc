type Color = 'red' | 'green' | 'blue'
type ColorMap = {
  [key in Color]?: number
}

export function parse(input: string) {
  return input.split('\n').map(game =>
    game
      .replace(/Game (\d+): /, '')
      .split('; ')
      .map(round => {
        const colorMap: ColorMap = {}
        const colors = round.split(', ').map(color => {
          const [unparsedCount, colorValue] = color.split(' ')
          colorMap[colorValue as Color] = parseInt(unparsedCount!)
        })
        return colorMap
      })
  )
}

const LIMITS: Required<ColorMap> = {
  red: 12,
  green: 13,
  blue: 14
}

export function partOne(input: ReturnType<typeof parse>) {
  let res = 0

  for (const [i, round] of input.entries()) {
    const gameIdx = i + 1
    let failed = false

    for (const game of round) {
      if (
        (game.red ?? 0) > LIMITS.red ||
        (game.green ?? 0) > LIMITS.green ||
        (game.blue ?? 0) > LIMITS.blue
      ) {
        failed = true
        break
      }
    }

    if (!failed) {
      res += gameIdx
    }
  }

  return res
}

export function partTwo(input: ReturnType<typeof parse>) {
  let res = 0

  for (const round of input) {
    let required: Required<ColorMap> = { red: 0, green: 0, blue: 0 }

    for (const game of round) {
      required.red = Math.max(required.red, game.red ?? 0)
      required.green = Math.max(required.green, game.green ?? 0)
      required.blue = Math.max(required.blue, game.blue ?? 0)
    }

    res += required.red * required.green * required.blue
  }

  return res
}
