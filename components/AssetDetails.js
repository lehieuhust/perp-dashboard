import useSWR from "swr";
import { perpetualStatsFetcher } from "../utils/fetcher";
import { ammLatestTransaction } from "../utils/query";
import Transactions from "./Transactions";

export default function AssetDetails({ asset }) {
  const { data } = useSWR(
    () => asset && ammLatestTransaction(asset),
    perpetualStatsFetcher
  );

  return <Transactions heading="Latest Positions" data={data?.transactions} />;
}
