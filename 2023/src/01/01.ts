export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: ReturnType<typeof parse>) {
  const out = input.reduce((acc, curr) => {
    let firstNum = 0
    let lastNum = 0
    for (let i = 0; i < curr.length; i++) {
      const digit = parseInt(curr[i]!)
      if (!isNaN(digit)) {
        firstNum = digit
        break
      }
    }
    for (let i = curr.length - 1; i >= 0; i--) {
      const digit = parseInt(curr[i]!)
      if (!isNaN(digit)) {
        lastNum = digit
        break
      }
    }
    return acc + firstNum * 10 + lastNum
  }, 0)
  return out
}

const NUMBER_STRINGS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
]

function p2GetFirstDigit(str: string) {
  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i]!)
    if (!isNaN(digit)) {
      return digit
    }
    for (let j = 0; j < NUMBER_STRINGS.length; j++) {
      if (str.substr(i).startsWith(NUMBER_STRINGS[j]!)) {
        return j + 1
      }
    }
  }
  return 0
}

function p2GetLastDigit(str: string) {
  for (let i = str.length - 1; i >= 0; i--) {
    const digit = parseInt(str[i]!)
    if (!isNaN(digit)) {
      return digit
    }
    for (let j = 0; j < NUMBER_STRINGS.length; j++) {
      if (str.substr(i).startsWith(NUMBER_STRINGS[j]!)) {
        return j + 1
      }
    }
  }
  return 0
}

export function partTwo(input: ReturnType<typeof parse>) {
  const out = input.reduce((acc, curr, idx) => {
    const firstNum = p2GetFirstDigit(curr)
    const lastNum = p2GetLastDigit(curr)

    return acc + firstNum * 10 + lastNum
  }, 0)
  return out
}
