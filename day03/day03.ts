const input = await Bun.stdin.text();

interface Battery {
  value: number;
  index: number;
  skip: boolean;
}

const numDigits = 12;

const debug = false;

function formatBatteries(batteries: Battery[]) {
  return batteries.map(({ value }) => String(value)).join("");
}

function processBatteries(batteries: Battery[]): Battery[] {
  let remainingSkips = batteries.length - numDigits;

  const skipBattery = (
    battery: Battery,
    label: string,
    currBattery: Battery,
  ) => {
    if (debug) {
      console.log(
        "skipping",
        label,
        battery,
        `because its value of ${battery.value} is less than or equal to ${currBattery.value}`,
        currBattery,
      );
    }
    battery.skip = true;
    remainingSkips--;
  };

  for (let i = 0; i < batteries.length; i++) {
    const currBattery = batteries[i];
    const prevBattery = batteries[i - 1];
    if (
      remainingSkips > 0 &&
      currBattery &&
      prevBattery &&
      !prevBattery.skip &&
      currBattery.value >= prevBattery.value
    ) {
      skipBattery(prevBattery, "regular", currBattery);
      // TODO: Figure out issue with "backwards skipping" where fixing up skips that result from
      // non-immediate repeated number (sequences of numbers that become repeated after other
      // numbers are skipped) are not handled correctly.
      for (let j = i - 1; j >= 0; j--) {
        const pastBattery = batteries[j];
        if (
          remainingSkips > 0 &&
          pastBattery &&
          !pastBattery.skip &&
          currBattery.value > pastBattery.value
        ) {
          skipBattery(pastBattery, "past", currBattery);
        }
      }
    }
  }
  return batteries.filter(({ skip }) => !skip);
}

function findLargestJoltage(batteries: Battery[]): number {
  const ret = processBatteries(batteries);

  const unskippedBatteries = batteries.filter(({ skip }) => !skip);
  if (unskippedBatteries.length !== numDigits) {
    console.log("unskippedBatteries", formatBatteries(unskippedBatteries));
    throw new Error(
      `unskippedBatteries has incorrect length of ${unskippedBatteries.length}`,
    );
  }

  return Number(formatBatteries(ret));
}

const ret = input
  .split("\n")
  .slice(0, -1)
  .map((bank) =>
    findLargestJoltage(
      [...bank].map((value, index) => ({
        value: Number(value),
        index,
        skip: false,
      })),
    ),
  )
  .reduce((a, b) => a + b, 0);

console.log(ret);
