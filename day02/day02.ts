function invalid(s: string) {
  return s.slice(0, s.length / 2) === s.slice(s.length / 2, s.length);
}

const input = await Bun.stdin.text();

const ret = input
  .split(",")
  .flatMap((s) => {
    const [start, end] = s.split("-").map(Number) as [number, number];
    return [...Array(end - start + 1)].map((_, i) => String(i + start));
  })
  .filter(invalid)
  .map(Number)
  .reduce((a, b) => a + b, 0);

console.log(ret);
