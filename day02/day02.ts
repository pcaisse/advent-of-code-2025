function invalid(x: number): boolean {
  const s = String(x);
  for (let i = 1; i <= Math.floor(s.length / 2); i++) {
    const pattern = s.substring(0, i);
    const n = Math.floor(s.length / pattern.length);
    if (pattern.repeat(n) === s) {
      return true;
    }
  }
  return false;
}

const input = await Bun.stdin.text();

const ret = input
  .split(",")
  .flatMap((s) => {
    const [start, end] = s.split("-").map(Number) as [number, number];
    return [...Array(end - start + 1)].map((_, i) => i + start);
  })
  .filter(invalid)
  .map(Number)
  .reduce((a, b) => a + b, 0);

console.log(ret);
