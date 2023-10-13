import useSWR from "swr";

import { perpetualStatsFetcher } from "../utils/fetcher";
import { latestTransaction } from "../utils/query";
import Transactions from "./Transactions";

export default function Details() {
  let { data } = useSWR(latestTransaction, perpetualStatsFetcher);

  return (
    <div>
      <Transactions heading="Latest Transactions" data={data?.transactions} />
    </div>
  );
}
