import fs from "fs";
// required fuel: mass, /3, round down, -2
function part1(filename: string) {
  const modules = fs
    .readFileSync("./input.txt", "utf8")
    .split("\n")
    .map((n) => parseInt(n));
  const fuel = modules.map((module) => {
    const divided = module / 3;
    const floored = Math.floor(divided);
    const subbed = floored - 2;
    return subbed;
  });
  const totalFuel = fuel.reduce((a, b) => a + b, 0);
  console.log(totalFuel);
}

function part2(filename: string) {
  const modules = fs
    .readFileSync(filename, "utf8")
    .split("\n")
    .map((n) => [parseInt(n)]);
  const fuel = modules.map((module) => {
    while (module[module.length - 1] > 0) {
      const divided = module[module.length - 1] / 3;
      const floored = Math.floor(divided);
      const subbed = floored - 2;
      if (subbed > 0) {
        module.push(subbed);
      } else {
        break;
      }
    }
    module.shift();
    return module.reduce((a, b) => a + b, 0);
  });
  const totalFuel = fuel.reduce((a, b) => a + b, 0);
  console.log(totalFuel);
}

part1("./input.txt");
part2("./sample.txt");
part2("./input.txt");
