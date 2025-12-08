const input = await Bun.stdin.text();

type Position = [rowIndex: number, colIndex: number];

const rowWidth = input.indexOf("\n") + 1;
const numRows = [...input].filter((c) => c === "\n").length;

function indexToPosition(index: number): Position {
  return [Math.floor(index / rowWidth), index % rowWidth];
}

const start: Position = indexToPosition(input.indexOf("S"));

const allValuePositions: [string, Position][] = [...input].map(
  (value, index) => [value, indexToPosition(index)] as [string, Position],
);

const splitters: Position[] = allValuePositions
  .filter(([value]) => value === "^")
  .map(([_, position]) => position);

function moveLeftOneCol(pos: Position): Position {
  return [pos[0], pos[1] - 1];
}

function moveRightOneCol(pos: Position): Position {
  return [pos[0], pos[1] + 1];
}

function moveDownOneRow(pos: Position): Position {
  return [pos[0] + 1, pos[1]];
}

const serializePos = (pos: Position): string => JSON.stringify(pos);
const deserializePos = (s: string): Position => JSON.parse(s);

function memoize(fn: (...args: any[]) => any) {
  const cache = new Map();
  return function (...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return JSON.parse(cache.get(key));
    } else {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }
  };
}

function walk() {
  const cachedWalk = memoize(
    (beamPosition: string, rowIndex: number): number => {
      if (rowIndex === numRows) {
        return 1;
      }
      const nextBeamPos = serializePos(
        moveDownOneRow(deserializePos(beamPosition)),
      );
      const nextRowIndex = rowIndex + 1;
      const splitterWasHit =
        splitterPositions.has(nextBeamPos) &&
        deserializePos(nextBeamPos)[0] === nextRowIndex;
      const newLeftBeamPos = serializePos(
        moveLeftOneCol(deserializePos(nextBeamPos)),
      );
      const newRightBeamPos = serializePos(
        moveRightOneCol(deserializePos(nextBeamPos)),
      );
      return splitterWasHit
        ? // Beam hit splitter, need to split!
          cachedWalk(newLeftBeamPos, nextRowIndex) +
            cachedWalk(newRightBeamPos, nextRowIndex)
        : // Beam continues downward one more row
          cachedWalk(nextBeamPos, nextRowIndex);
    },
  );
  return cachedWalk;
}

const startBeam: string = serializePos(moveDownOneRow(start));
const splitterPositions = new Set<string>(
  splitters.map((value) => serializePos(value)),
);

const numTimelines = walk()(startBeam, 1);
console.log(numTimelines);
