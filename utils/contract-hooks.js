import {
  MarginedEngineQueryClient,
  MarginedVammQueryClient,
} from "@oraichain/oraimargin-contracts-sdk";

const ENGINE_CONTRACT = process.env.NEXT_PUBLIC_ENGINE_CONTRACT;
const VAMM_CONTRACT = process.env.NEXT_PUBLIC_VAMM_CONTRACT;

export const LIMIT = 25;

const generateMsgGetPosition = ({ startAfter }) => {
  const res = {
    positions: {
      vamm: VAMM_CONTRACT,
      filter: "none",
      order_by: 2,
      limit: LIMIT,
    },
  };

  if (startAfter) res.positions.start_after = startAfter;

  return res;
};

const useMarginTradingContract = () => {
  const getPositions = async (startAfter) => {
    const vammEngine = new MarginedEngineQueryClient(
      window.client,
      ENGINE_CONTRACT
    );

    const data = await vammEngine.positions(
      generateMsgGetPosition({ startAfter }).positions
    );

    return data;
  };

  const getPositionById = async (positionId) => {
    const vammEngine = new MarginedEngineQueryClient(
      window.client,
      ENGINE_CONTRACT
    );
    try {
      return vammEngine.position({ positionId, vamm: VAMM_CONTRACT });
    } catch (err) {
      console.log("err", err);
      return;
    }
  };

  const getEntryPriceDefault = async () => {
    const vamm = new MarginedVammQueryClient(window.client, VAMM_CONTRACT);
    return vamm.spotPrice();
  };

  return {
    getPositions,
    getPositionById,
    getEntryPriceDefault,
  };
};

export default useMarginTradingContract;
