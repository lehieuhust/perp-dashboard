import useSWR from "swr";

import { getVolumeQuery } from "../utils/query";
import { perpetualStatsFetcher } from "../utils/fetcher";
import HeroChart from "../components/HeroChart";
import Details from "../components/Details";
import Spinner from "../components/Spinner";
import Layout from "../components/Layout";

export default function Home() {
  const { data } = useSWR(getVolumeQuery, perpetualStatsFetcher);

  return (
    <Layout>
      <div className="min-h-screen">
        <title>
          Analytics Dashboard for Perpetual Protocol (PERP) Traders 🔥 |
          PerpTerminal
        </title>
        <meta
          name="description"
          content="Analytics on all your Perpetual Protocol (PERP) trades. PerpTerminal assists traders to make more informed trading decisions by allowing access to various analytics."
        />
        <main className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 ">
          {data ? (
            <>
              <HeroChart data={data?.perpetualDayDatas} />
              <Details />
            </>
          ) : (
            <Spinner />
          )}
        </main>
      </div>
    </Layout>
  );
}
