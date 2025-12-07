const input = await Bun.stdin.text();

const opFunc = {
  "*": (x: number, y: number) => x * y,
  "+": (x: number, y: number) => x + y,
};

function rotate(data: (number | string)[][]): (number | string)[][] {
  let ret: number[][] = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i] as number[];
    for (let j = 0; j < row.length; j++) {
      if (!ret[j]) {
        ret[j] = [];
      }
      // @ts-ignore
      ret[j][i] = row[j];
    }
  }
  return ret;
}

const ret = rotate(
  input
    .split("\n")
    .slice(0, -1)
    .map((s) => s.split(/\s/).filter((s) => s)),
)
  .map((row) => {
    const op = row.pop() as "*" | "+";
    const func = opFunc[op];
    const nums = row.map(Number);
    return nums.reduce((acc, value) => func(acc, value), op === "*" ? 1 : 0);
  })
  .reduce((x, y) => x + y, 0);

console.log(ret);
