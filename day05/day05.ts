const input = await Bun.stdin.text();

const [ranges, ingredients] = input.split("\n\n");

const rangeFuncs = (ranges as string).split("\n").map((s) => {
  const [min, max] = s.split("-").map(Number) as [number, number];
  return (x: number) => x >= min && x <= max;
});

const singleRangeFunc = (x: number) =>
  rangeFuncs.reduce((acc, currFunc) => acc || currFunc(x), false);

const ingredientNumbers = (ingredients as string).split("\n").map(Number);

const ret = ingredientNumbers.filter(singleRangeFunc).length;

console.log(ret);
