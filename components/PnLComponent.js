import { useEffect, useState } from "react";
import useMarginTradingContract from "./../utils/contract-hooks";

export function calculatePositionPnl(
  side,
  positionSize,
  closingMarketPrice,
  entryPrice
) {
  if (isLongPosition(side))
    return (closingMarketPrice - entryPrice) * positionSize;
  return (entryPrice - closingMarketPrice) * positionSize;
}

export function calculateRoi(pnl, margin) {
  if (margin === 0) return 0;
  return (pnl / margin) * 100;
}

export function parsePositionFigureToNumber(figure) {
  return figure
    ? typeof figure === "string"
      ? parseFloat(figure)
      : figure
    : 0;
}

export const PnLComponent = ({ record, isHistory, ROIOnly, PnLOnly }) => {
  const [entryPrice, setEntryPrice] = useState(0);
  const [pnl, setPnL] = useState(0);
  const [ROI, setROI] = useState(0);
  const { getEntryPriceDefault } = useMarginTradingContract();

  useEffect(() => {
    setInterval(async () => {
      const price = await getEntryPriceDefault();
      setEntryPrice(price * 10 ** -6);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!record) return;
    let calculatedPnl = parsePositionFigureToNumber(record.pnl);
    if (!isHistory) {
      calculatedPnl = calculatePositionPnl(
        record.side,
        parsePositionFigureToNumber(record.size),
        entryPrice,
        parsePositionFigureToNumber(record.entryPrice)
      );
    }

    setPnL(calculatedPnl);
    setROI(
      calculateRoi(calculatedPnl, parsePositionFigureToNumber(record.margin))
    );
  }, [entryPrice, record, isHistory]);

  const renderReturnedComponent = () => {
    if (ROIOnly) {
      return `${Number(ROI.toFixed(3))}%`;
    } else if (PnLOnly) {
      return `${Number(pnl.toFixed(5))} USDT`;
    } else {
      return `${Number(pnl.toFixed(5))}(${Number(ROI.toFixed(3))}%)`;
    }
  };

  return (
    <div style={{ color: pnl > 0 ? "#58CCB6" : "#ed6e72" }}>
      {renderReturnedComponent()}
    </div>
  );
};
