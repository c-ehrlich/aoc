import { assert, describe, it } from "vitest";
import { FileSystem, solve07a, solve07b } from "./day07";

describe("day07", () => {
  it("input", () => {
    const expectedOutput = `- / (dir)
  - b.txt (file, size=14848514)
  - c.dat (file, size=8504156)
  - a (dir)
    - f (file, size=29116)
    - g (file, size=2557)
    - h.lst (file, size=62596)
    - e (dir)
      - i (file, size=584)
  - d (dir)
    - d.ext (file, size=5626152)
    - d.log (file, size=8033020)
    - j (file, size=4060174)
    - k (file, size=7214296)
`;
    const sampleFileSystem = new FileSystem("07/sample.txt");
    assert.equal(sampleFileSystem.printDir(), expectedOutput);
  });
  it("solve07a", () => {
    const sampleData = [0];
    assert.equal(0, 0);
  });
  it("solve07b", () => {
    const sampleData = [0];
    assert.equal(0, 0);
  });
});
