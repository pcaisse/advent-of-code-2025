function normalize(x: number) {
  const n = x % 100;
  return n < 0 ? n + 100 : n;
}

const input = await Bun.stdin.text();
const start = 50;

const directionOp = {
  L: (x: number, y: number) => x - y,
  R: (x: number, y: number) => x + y,
};

const ret = input
  .split("\n")
  .slice(0, -1)
  .map(
    ([direction, ...x]) =>
      ({ direction, value: Number(x.join("")) }) as {
        direction: "L" | "R";
        value: number;
      },
  )
  .reduce(
    ({ pos, count }, { direction, value }) => {
      const op = directionOp[direction];
      const rawValue = op(pos, value);
      const newPos = normalize(rawValue);
      const atZeroCount = newPos === 0 ? 1 : 0;
      const pastZeroCount =
        rawValue < 0
          ? Math.ceil(Math.abs(rawValue / 100)) -
            // avoid over-counting when we start on zero
            (pos === 0 ? 1 : 0)
          : rawValue > 100
            ? Math.floor(rawValue / 100) -
              // avoid over-counting when we end on zero
              (newPos === 0 ? 1 : 0)
            : 0;
      return {
        pos: newPos,
        count: count + atZeroCount + pastZeroCount,
      };
    },
    { pos: start, count: 0 },
  );

console.log(ret);
