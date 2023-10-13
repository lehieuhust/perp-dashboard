import { CHART_PERIODS } from "./constants";

export function getObjectKeyFromValue(value, object) {
  return Object.keys(object).find((key) => object[key] === value);
}

export function formatTimeInBarToMs(bar) {
  return {
    ...bar,
    time: bar.time * 1000,
    volume: bar.volume / 1e6,
  };
}

export function getCurrentCandleTime(period) {
  const periodSeconds = CHART_PERIODS[period];
  return Math.floor(Date.now() / 1000 / periodSeconds) * periodSeconds;
}

// Fill bar gaps with empty time
export function fillBarGaps(bars, periodSeconds) {
  if (bars.length < 2) return bars;

  const newBars = [bars[0]];
  let prevTime = bars[0].time;

  for (let i = 1; i < bars.length; i++) {
    const { time, open } = bars[i];
    if (prevTime) {
      const numBarsToFill = Math.floor((time - prevTime) / periodSeconds) - 1;
      for (let j = numBarsToFill; j > 0; j--) {
        const newBar = {
          time: time - j * periodSeconds,
          open,
          close: open,
          high: open * 1.0003,
          low: open * 0.9996,
        };
        newBars.push(newBar);
      }
    }
    prevTime = time;
    newBars.push(bars[i]);
  }

  return newBars;
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
  };
}

export function parseChannelFromPair(pair) {
  return (DATA_PAIRS = [
    {
      id: 1,
      symbol: "ORAI/USDT",
      slippage: "0.0000000000000000",
      from: "orai",
      to: ROOT_ENV.REACT_APP_USDT_CONTRACT,
      created_at: "2023-04-05T08:03:00.654Z",
      updated_at: "2023-04-05T08:03:00.654Z",
      price_decimal: 6,
      info: "orai - " + ROOT_ENV.REACT_APP_USDT_CONTRACT,
    },
  ].find((p) => p.info === pair)?.symbol);
}

export function roundTime(timeIn, interval) {
  const roundTo = interval * 60 * 1000;

  const dateOut = Math.round(timeIn.getTime() / roundTo) * roundTo;
  return dateOut / 1000;
}
