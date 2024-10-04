export function getConvertedDuration(beforeTime: bigint): string {
  const now = process.hrtime.bigint();
  const timeDifference = now - beforeTime;
  const nanoseconds = Number(timeDifference);

  let timeMessage: string = "";

  if (nanoseconds >= 60e9) {
    // Convert to minutes (1 minute = 60e9 nanoseconds)
    const minutes = (nanoseconds / 60e9).toFixed(2);
    timeMessage = `| ${minutes}min`;
  } else if (nanoseconds >= 1e9) {
    // Convert to seconds
    const seconds = (nanoseconds / 1e9).toFixed(2);
    timeMessage = `| ${seconds}s`;
  } else if (nanoseconds >= 1e6) {
    // Convert to milliseconds
    const milliseconds = (nanoseconds / 1e6).toFixed(2);
    timeMessage = `| ${milliseconds}ms`;
  } else if (nanoseconds >= 1e3) {
    // Convert nanoseconds to milliseconds as a fraction
    const fractionOfMilliseconds = (nanoseconds / 1e6).toFixed(4); // Keep more precision for a better fraction
    timeMessage = `| ${fractionOfMilliseconds}ms`;
  } else {
    // Convert nanoseconds to milliseconds as a very small fraction
    const verySmallFractionOfMilliseconds = (nanoseconds / 1e6).toFixed(6); // Even more precision for a very small fraction
    timeMessage = `| ${verySmallFractionOfMilliseconds}ms`;
  }

  return timeMessage;
}
