const input = await Bun.stdin.text();

const opFunc = {
  "*": (x: number, y: number) => x * y,
  "+": (x: number, y: number) => x + y,
};

function rotate(data: (number | string)[][]): (number | string)[][] {
  let ret: number[][] = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i] as (number | string)[];
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

const rawData = input.split("\n").slice(0, -1);

const data = rawData.map((s) => s.split(""));

// Figure out column widths since they are variable
const splitData = rawData.map((s) => s.match(/\S+/g) || []);
const rotatedSplitData = rotate(splitData);
const isSeparatorColumnLookup: boolean[] = (rotatedSplitData as string[][])
  .map(
    (cols) =>
      cols.reduce(
        (largest, current) =>
          current.length > largest.length ? current : largest,
        "",
      ).length,
  )
  // This is a bit wasteful since we only need to store the separator columns
  .flatMap((value) => [...new Array(value)].map((_) => false).concat([true]));

const processedData = data.map((row) =>
  row
    .map((value, index) => (isSeparatorColumnLookup[index] ? "|" : value))
    .join("")
    .split("|"),
);

const rotatedProcessedData = rotate(processedData);

const ret = rotatedProcessedData
  .map((row) => {
    const op = (row.pop() as string).trim() as "*" | "+";
    const func = opFunc[op];
    const rowArray = (row as string[]).map((s) => [...s]);
    const rotatedRowArray = rotate(rowArray);
    const rotatedRow = rotatedRowArray.map((row) => row.join(""));
    const nums = rotatedRow.map(Number);
    return nums.reduce((acc, value) => func(acc, value), op === "*" ? 1 : 0);
  })
  .reduce((x, y) => x + y, 0);

console.log(ret);
