import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './01'

const { default: example } = await import(`./example.txt`)
const { default: exampleB } = await import(`./exampleB.txt`)

describe('Day 1', () => {
  it('Part One', () => {
    const res = partOne(parse(example))
    expect(res).toEqual(142)
  })

  it('Part Two', () => {
    const res = partTwo(parse(exampleB))
    expect(res).toEqual(281)
  })
})
