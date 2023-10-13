import { request } from "graphql-request";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export function fetcher(query) {
  return request(
    "https://api.thegraph.com/subgraphs/name/perpetual-protocol/perp-position-subgraph",
    query
  );
}
export function perpetualStatsFetcher(query, variables) {
  return request(
    "https://api.thegraph.com/subgraphs/name/vipineth/perpetual-protocol-stats",
    query,
    variables
  );
}

export const getFutureCandleInfo = async ({ pair, tf, startTime, endTime }) => {
  const params = new URLSearchParams({ pair, tf, startTime, endTime });
  try {
    return await urlFetcher(SERVER_URL + "/v1/future/candles/?" + params);
  } catch {
    return { data: [] };
  }
};

export const urlFetcher = (...args) => fetch(...args).then((res) => res.json());
