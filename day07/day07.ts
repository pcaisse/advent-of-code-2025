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

function walk(
  beamPositions: Set<string>,
  splitterPositions: Set<string>,
  rowIndex: number,
  numRows: number,
  numSplits: number,
): number {
  const currentBeamPositions = new Set<string>(beamPositions);
  currentBeamPositions.forEach((beamPos) => {
    const nextBeamPos = serializePos(moveDownOneRow(deserializePos(beamPos)));
    if (deserializePos(nextBeamPos)[0] !== rowIndex) {
      // Only consider beams on this row
      return;
    }
    if (splitterPositions.has(nextBeamPos)) {
      // Beam hit splitter, need to split!
      beamPositions.add(
        serializePos(moveLeftOneCol(deserializePos(nextBeamPos))),
      );
      beamPositions.add(
        serializePos(moveRightOneCol(deserializePos(nextBeamPos))),
      );
      numSplits++;
    } else {
      // Beam continues downward one more row
      beamPositions.add(nextBeamPos);
    }
  });
  if (rowIndex === numRows) {
    return numSplits;
  }
  return walk(
    beamPositions,
    splitterPositions,
    rowIndex + 1,
    numRows,
    numSplits,
  );
}

const startBeams = new Set<string>([serializePos(moveDownOneRow(start))]);
const startSplitters = new Set<string>(
  splitters.map((value) => serializePos(value)),
);

const numSplits = walk(startBeams, startSplitters, 1, numRows, 0);
console.log(numSplits);
