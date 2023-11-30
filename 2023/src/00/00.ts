export function parse(input: string) {
  return input
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.split('\n')
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.split('\n').map(_line => 1)
}

console.log()
