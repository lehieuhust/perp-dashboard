import { useEffect, useMemo, useRef } from "react";

import { SUPPORTED_RESOLUTIONS } from "./constants";
import { subscribeOnStream, unsubscribeFromStream } from "./streaming";

const configurationData = {
  supported_resolutions: Object.keys(SUPPORTED_RESOLUTIONS),
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  reset_cache_timeout: 100,
};

export const EXCHANGE_NAME = "OraiDEX";

export default function useTVDatafeed({ dataProvider }) {
  const resetCacheRef = useRef();
  const activeTicker = useRef();
  const tvDataProvider = useRef();
  const shouldRefetchBars = useRef(false);
  const lastBarsCache = new Map();

  useEffect(() => {
    if (dataProvider && tvDataProvider.current !== dataProvider) {
      tvDataProvider.current = dataProvider;
    }
  }, [dataProvider]);

  return useMemo(() => {
    return {
      resetCache: function () {
        shouldRefetchBars.current = true;
        resetCacheRef.current?.();
        shouldRefetchBars.current = false;
      },
      datafeed: {
        onReady: (callback) => {
          setTimeout(() => callback(configurationData));
        },
        resolveSymbol(symbolName, onSymbolResolvedCallback) {
          const symbolInfo = {
            name: symbolName,
            type: "crypto",
            description: symbolName,
            ticker: symbolName,
            session: "24x7",
            minmov: 1,
            pricescale: 100,
            timezone: "Etc/UTC",
            has_intraday: true,
            has_daily: true,
            currency_code: symbolName?.split("/")[1],
            visible_plots_set: "ohlc",
            data_status: "streaming",
            exchange: EXCHANGE_NAME,
            has_empty_bars: true,
          };
          setTimeout(() => onSymbolResolvedCallback(symbolInfo));
        },

        async getBars(
          symbolInfo,
          resolution,
          periodParams,
          onHistoryCallback,
          onErrorCallback
        ) {
          if (!SUPPORTED_RESOLUTIONS[resolution]) {
            return onErrorCallback("[getBars] Invalid resolution");
          }
          const { ticker } = symbolInfo;
          if (activeTicker.current !== ticker) {
            activeTicker.current = ticker;
          }
          try {
            if (!ticker) {
              onErrorCallback("Invalid ticker!");
              return;
            }

            const bars = await tvDataProvider.current?.getBars(
              "orai - orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh", // TODO:
              ticker,
              resolution,
              periodParams,
              shouldRefetchBars.current
            );

            if (periodParams.firstDataRequest) {
              lastBarsCache.set(symbolInfo.full_name, {
                ...bars[bars.length - 1],
              });
            }

            const noData = !bars || (bars && bars?.length === 0);
            onHistoryCallback(bars, { noData });

            shouldRefetchBars.current = false;
          } catch (e) {
            onErrorCallback("Unable to load historical data!");
          }
        },
        async subscribeBars(
          symbolInfo,
          resolution,
          onRealtimeCallback,
          subscribeUID,
          onResetCacheNeededCallback
        ) {
          subscribeOnStream(
            symbolInfo,
            resolution,
            onRealtimeCallback,
            subscribeUID,
            onResetCacheNeededCallback,
            lastBarsCache.get(symbolInfo.full_name)
          );
        },
        unsubscribeBars: (subscriberUID) => {
          unsubscribeFromStream(subscriberUID);
        },
      },
    };
  }, []); // TODO:
}
