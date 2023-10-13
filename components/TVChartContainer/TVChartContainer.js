import { useEffect, useRef, useState } from "react";
import { useLocalStorage, useMedia } from "react-use";

import {
  SUPPORTED_RESOLUTIONS,
  TV_CHART_RELOAD_INTERVAL,
} from "./helpers/constants";
import useTVDatafeed from "./helpers/useTVDatafeed";
import { TVDataProvider } from "./helpers/TVDataProvider";
import { getObjectKeyFromValue } from "./helpers/utils";
import { SaveLoadAdapter } from "./SaveLoadAdapter";
import {
  defaultChartProps,
  DEFAULT_PERIOD,
  disabledFeaturesOnMobile,
  LIGHT_BACKGROUND_CHART,
} from "./config";

export function useLocalStorageSerializeKey(key, value, opts) {
  key = JSON.stringify(key);
  return useLocalStorage(key, value, opts);
}

export default function TVChartContainer() {
  const chartContainerRef = useRef();
  const tvWidgetRef = useRef();
  const [chartDataLoading, setChartDataLoading] = useState(false);
  const [tvCharts, setTvCharts] = useLocalStorage(
    "TV_SAVE_LOAD_CHARTS_KEY",
    []
  );
  const { datafeed, resetCache } = useTVDatafeed({
    dataProvider: new TVDataProvider(),
  });
  const isMobile = useMedia("(max-width: 550px)");

  const [period, setPeriod] = useLocalStorageSerializeKey(
    ["ORAI/USDT", "Chart-period"],
    DEFAULT_PERIOD
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.setItem(
          "TV_CHART_RELOAD_TIMESTAMP_KEY",
          Date.now().toString()
        );
      } else {
        const tvReloadTimestamp = Number(
          localStorage.getItem("TV_CHART_RELOAD_TIMESTAMP_KEY")
        );
        if (
          tvReloadTimestamp &&
          Date.now() - tvReloadTimestamp > TV_CHART_RELOAD_INTERVAL
        ) {
          if (resetCache) {
            resetCache();
            tvWidgetRef.current?.activeChart().resetData();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetCache]);

  useEffect(() => {
    const widgetOptions = {
      debug: false,
      symbol: "ORAI/USDT", // Using ref to avoid unnecessary re-renders on symbol change and still have access to the latest symbol
      datafeed: datafeed,
      theme: "Light",
      container: chartContainerRef.current,
      library_path: defaultChartProps.library_path,
      locale: defaultChartProps.locale,
      loading_screen: {
        backgroundColor: LIGHT_BACKGROUND_CHART,
        foregroundColor: LIGHT_BACKGROUND_CHART,
      },
      enabled_features: defaultChartProps.enabled_features,
      disabled_features: isMobile
        ? defaultChartProps.disabled_features.concat(disabledFeaturesOnMobile)
        : defaultChartProps.disabled_features,
      client_id: defaultChartProps.clientId,
      user_id: defaultChartProps.userId,
      fullscreen: defaultChartProps.fullscreen,
      autosize: defaultChartProps.autosize,
      custom_css_url: defaultChartProps.custom_css_url,
      overrides: defaultChartProps.overrides,
      interval: getObjectKeyFromValue(period, SUPPORTED_RESOLUTIONS),
      favorites: defaultChartProps.favorites,
      custom_formatters: defaultChartProps.custom_formatters,
      save_load_adapter: new SaveLoadAdapter(
        "ORAI/USDT",
        tvCharts,
        setTvCharts
      ),
      studies: [],
      timeframe: "1M",
      time_scale: {
        min_bar_spacing: 15,
      },
      time_frames: [
        { text: "6m", resolution: "6h", description: "6 Months" },
        { text: "1m", resolution: "1h", description: "1 Month" },
        { text: "2w", resolution: "1h", description: "2 Weeks" },
        { text: "1w", resolution: "1h", description: "1 Week" },
        { text: "1d", resolution: "15", description: "1 Day" },
      ],
    };
    tvWidgetRef.current = new window.TradingView.widget(widgetOptions);
    tvWidgetRef.current.onChartReady(function () {
      tvWidgetRef.current.applyOverrides({
        "paneProperties.background": LIGHT_BACKGROUND_CHART,
        "paneProperties.backgroundType": "solid",
      });

      tvWidgetRef.current
        ?.activeChart()
        .onIntervalChanged()
        .subscribe(null, (interval) => {
          if (SUPPORTED_RESOLUTIONS[interval]) {
            const period = SUPPORTED_RESOLUTIONS[interval];
            setPeriod(period);
          }
        });

      tvWidgetRef.current?.activeChart().dataReady(() => {
        setChartDataLoading(false);
      });
    });

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
        setChartDataLoading(true);
      }
    };
  }, []);

  return (
    <div className="chart-container">
      <div
        className="chart-content"
        style={{ width: chartDataLoading ? "0%" : "100%" }}
        ref={chartContainerRef}
      />
    </div>
  );
}
