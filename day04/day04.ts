const input = await Bun.stdin.text();

const ROLL_CHAR = "@";
const NON_ROLL_CHAR = ".";
const MAX_ADJACENT_ROLLS = 4;

function adjacentOnly(s: string | undefined, colIndex: number) {
  if (!s) {
    return undefined;
  }
  return s.substring(colIndex - 1, colIndex + 2);
}

function rollsInRow(row: string | undefined) {
  if (!row) return 0;
  return [...row].filter((c) => c === ROLL_CHAR).length;
}

function removeRollFromRow(row: string, colIndex: number) {
  if (row[colIndex] !== ROLL_CHAR) {
    throw new Error(`unexpected non-roll at column ${colIndex} in row: ${row}`);
  }
  return [...row]
    .map((c, index) => (index === colIndex ? NON_ROLL_CHAR : c))
    .join("");
}

function isAccessibleRoll(
  rows: string[],
  rowIndex: number,
  colIndex: number,
): boolean {
  const row = rows[rowIndex];
  if (!row) {
    throw new Error("row undefined");
  }
  if (row[colIndex] !== ROLL_CHAR) {
    return false;
  }

  const rowAbove = adjacentOnly(rows[rowIndex - 1], colIndex);
  const rowBelow = adjacentOnly(rows[rowIndex + 1], colIndex);
  const currentRow = (row[colIndex - 1] || "") + (row[colIndex + 1] || "");

  return (
    rollsInRow(rowAbove) + rollsInRow(rowBelow) + rollsInRow(currentRow) <
    MAX_ADJACENT_ROLLS
  );
}

function removeAccessibleRolls(rows: string[]) {
  const accessibleRows: [number, number][] = [];
  let rowIndex, colIndex;
  // Find all accessible rolls
  for (rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    for (colIndex = 0; colIndex < (rows[0] as string).length; colIndex++) {
      if (isAccessibleRoll(rows, rowIndex, colIndex)) {
        accessibleRows.push([rowIndex, colIndex]);
      }
    }
  }
  const sum = accessibleRows.length;
  // Remove all accessible rolls
  for (const [rowIndex, colIndex] of accessibleRows) {
    rows[rowIndex] = removeRollFromRow(rows[rowIndex] as string, colIndex);
  }
  return { newRows: rows, rowsRemoved: sum };
}

let rows = input.split("\n").slice(0, -1);
let total = 0;

while (true) {
  const { newRows, rowsRemoved } = removeAccessibleRolls(rows);
  if (rowsRemoved === 0) {
    break;
  }
  total += rowsRemoved;
  rows = newRows;
}

console.log(total);
