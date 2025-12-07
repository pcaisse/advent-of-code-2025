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

function unskipped(batteries: Battery[]) {
  return batteries.filter(({ skip }) => !skip);
}

function processBatteries(batteries: Battery[]): Battery[] {
  let remainingSkips = batteries.length - numDigits;

  if (remainingSkips === 0) {
    return unskipped(batteries);
  }

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
  };

  for (let i = 0; i < batteries.length; i++) {
    const currBattery = batteries[i];
    const prevBattery = batteries[i - 1];
    if (
      currBattery &&
      prevBattery &&
      !prevBattery.skip &&
      currBattery.value > prevBattery.value
    ) {
      skipBattery(prevBattery, "regular", currBattery);
      const newBatteries = unskipped(batteries);
      return processBatteries(newBatteries);
    }
  }
  return unskipped(batteries);
}

function findLargestJoltage(batteries: Battery[]): number {
  const ret = processBatteries(batteries).slice(0, numDigits);

  if (ret.length !== numDigits) {
    throw new Error(`has incorrect length of ${ret.length}`);
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
