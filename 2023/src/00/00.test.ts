import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './00'

const { default: example } = await import(`./example.txt`)

describe('Day 12', () => {
  it('Part One', async () => {
    const res = partOne(parse(example))
    expect(res).toEqual(['a', 'b'])
  })

  it('Part Two', () => {
    const res = partTwo(parse(example))
    expect(res).toEqual([1, 1])
  })
})
