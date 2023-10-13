import useSWR from "swr";
import { useEffect, useState } from "react";

import { perpetualStatsFetcher } from "../utils/fetcher";
import { latestTransaction } from "../utils/query";
import useMarginTradingContract, { LIMIT } from "./../utils/contract-hooks";
import Transactions from "./Transactions";
import { formatDataPositionContract } from "../utils/helper";
import { getPaginationPosition } from "../utils/helper";

export default function Details() {
  let { data } = useSWR(latestTransaction, perpetualStatsFetcher);
  const { getPositions } = useMarginTradingContract();
  const [nextPageId, setNextPageId] = useState("");
  const [positions, setPositions] = useState([]);

  const loadMore = () => {
    if (positions.length === LIMIT)
      setNextPageId(getPaginationPosition(positions));
  };

  useEffect(() => {
    const init = async () => {
      const res = await getPositions(nextPageId);
      setPositions(
        formatDataPositionContract(res, {
          price_decimal: 6,
          symbol: "ORAI/USDT",
        })
      );
    };
    init();
  }, [nextPageId]);

  return (
    <div className="mt-6">
      <Transactions heading="Latest Positions" data={positions} />
    </div>
  );
}
