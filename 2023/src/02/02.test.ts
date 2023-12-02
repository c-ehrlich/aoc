import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './02'

const { default: example } = await import(`./example.txt`)

describe('Day 2', () => {
  it('Part One', () => {
    const res = partOne(parse(example))
    expect(res).toEqual(8)
  })

  it('Part Two', () => {
    const res = partTwo(parse(example))
    expect(res).toEqual(2286)
  })
})
