const input = await Bun.stdin.text();

function findLargestJoltage(
  batteries: { value: number; index: number }[],
): number {
  const batteriesDesc = batteries.sort((a, b) => b.value - a.value);
  const first = batteriesDesc.find(
    ({ index }) => index !== batteriesDesc.length - 1,
  );
  if (!first) throw Error("first missing");
  const second = batteriesDesc.find(({ index }) => index > first.index);
  if (!second) throw Error("second missing");
  return Number(String(first.value) + String(second.value));
}

const ret = input
  .split("\n")
  .slice(0, -1)
  .map((bank) =>
    findLargestJoltage(
      [...bank].map((value, index) => ({ value: Number(value), index })),
    ),
  )
  .reduce((a, b) => a + b, 0);

console.log(ret);
