export function formatTimestamp(timestamp: number) {
  const currentTime = Date.now();
  const timeDiff = timestamp - currentTime;
  let absTimeDiff = Math.abs(timeDiff);

  const timeUnits = [
    { unit: "year", divisor: 31536000000 },
    { unit: "month", divisor: 2592000000 },
    { unit: "week", divisor: 604800000 },
    { unit: "day", divisor: 86400000 },
    { unit: "hour", divisor: 3600000 },
    { unit: "minute", divisor: 60000 },
    { unit: "second", divisor: 1000 },
  ];

  for (const unitInfo of timeUnits) {
    if (absTimeDiff > unitInfo.divisor) {
      absTimeDiff /= unitInfo.divisor;
      const unitCount = Math.round(absTimeDiff);
      const pluralSuffix = unitCount > 1 ? "s" : "";
      const timeDescription = `${unitCount} ${unitInfo.unit}${pluralSuffix}`;
      return timeDiff >= 0
        ? `${timeDescription} from now`
        : `${timeDescription} ago`;
    }
  }

  return new Date(timestamp).toLocaleString();
}
