const input = await Bun.stdin.text();

const [rangeInput, _] = input.split("\n\n");

function countRange([min, max]: [number, number]): number {
  return max - min + 1;
}

const ranges: [number, number][] = (rangeInput as string)
  .split("\n")
  .map((s) => {
    return s.split("-").map(Number) as [number, number];
  })
  .sort(([minA, maxA], [minB, maxB]) => {
    const minDiff = minA - minB;
    if (minDiff === 0) {
      return maxA - maxB;
    }
    return minDiff;
  });

let total = 0;

for (let i = 0; i < ranges.length; i++) {
  const range = ranges[i];
  if (range === undefined) {
    throw new Error("wat");
  }
  const [min, max] = range;
  const prev = ranges[i - 1];
  if (prev && min >= prev[0] && max <= prev[1]) {
    // Full overlap
    ranges[i] = prev;
    continue;
  } else if (prev && max <= prev[1]) {
    // Underlap
    ranges[i] = prev;
    continue;
  } else if (prev && min <= prev[1]) {
    // Partial overlap
    const newRange: [number, number] = [prev[1] + 1, max];
    ranges[i] = newRange;
    const added = countRange(newRange);
    total += added;
  } else {
    // Unchanged min/max
    const added = countRange([min, max]);
    total += added;
  }
}

console.log(total);
