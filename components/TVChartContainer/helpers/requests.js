import { getFutureCandleInfo } from "../../../utils/fetcher";

export const getTokenChartPrice = async (pair, periodParams, resolution) => {
  try {
    const res = await getFutureCandleInfo({
      pair,
      startTime: Math.round(periodParams.from / 60),
      endTime: Math.round(periodParams.to / 60),
      tf: resolution,
    });

    return res;
  } catch (e) {
    console.error("GetTokenChartPrice", e);
    return [];
  }
};
