import Stats from "./Stats";
import BarChart from "./BarChart";
import ChartHeader from "./ChartHeader";
import { useState } from "react";
import { getSmallNumber } from "../utils/helper";
import fromUnixTime from "date-fns/fromUnixTime";
import Spinner from "./Spinner";

let OPTIONS = {
  "7D": 7,
  "30D": 30,
  "90D": 90,
  "180D": 180,
  Max: 1000,
};

export default function HeroChart({ data }) {
  let [range, setRange] = useState(90);

  if (!data) return <Spinner />;

  let parsedData =
    data?.map((one) => {
      let date = fromUnixTime(one.date); // The 0 there is the key, which sets the date to the epoch
      let volumeUSD = Number(getSmallNumber(one.volumeUSD));
      return { ...one, volumeUSD, date };
    }) || null;

  return (
    <div className="mt-8 md:grid md:grid-cols-3 md:gap-4 space-y-10 md:space-y-0">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 col-span-2">
        <div className="rounded-lg h-96">
          <ChartHeader setRange={setRange} OPTIONS={OPTIONS} range={range} />
          <BarChart range={range} data={parsedData} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg px-5 py-6 sm:px-6 mt-8 sm:mt-0">
        <div className="rounded-lg">
          <Stats data={parsedData} />
        </div>
      </div>
    </div>
  );
}
