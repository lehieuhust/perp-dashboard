import Stats from "./Stats";
import { getSmallNumber } from "../utils/helper";
import Spinner from "./Spinner";
import TVChartContainer from "./TVChartContainer/TVChartContainer";

export default function HeroChart({ data }) {
  if (data) {
    const parsedData =
      data?.map((one) => {
        let date = one.date; // The 0 there is the key, which sets the date to the epoch
        let volumeUSD = Number(getSmallNumber(one.volumeUSD));
        return { ...one, volumeUSD, date };
      }) || null;

    return (
      <div className="mt-8 lg:grid lg:grid-cols-3 lg:gap-4 space-y-10 lg:space-y-0">
        <div className="bg-white rounded-lg shadow col-span-2">
          <div className="rounded-lg h-full">
            <TVChartContainer />
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

  return <Spinner />;
}
