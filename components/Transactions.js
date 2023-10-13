import fromUnixTime from "date-fns/fromUnixTime";
import { format } from "date-fns";
import Link from "next/link";

import { PnLComponent } from "./../components/PnLComponent";

export default function Transactions({ heading = "", data }) {
  if (!data) return "Loading";

  return (
    <div className="">
      <h3 className="py-5 text-lg font-bold text-gray-700">{heading}</h3>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <THead />
                {data?.map((d) => (
                  <TBody {...d} key={d.id} />
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TBody(props) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      <tr key={props.amm}>
        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
          {format(fromUnixTime(props.blockTime), "Pp")}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
          {props.symbol}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-md text-gray-800">
          {props?.side === "sell" ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              Short
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Long
            </span>
          )}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-md text-gray-800">
          {props.direction}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-md text-gray-800">
          {props?.leverage}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-md text-gray-800">
          {Number(props?.size.toFixed(4))}
        </td>

        <td className="px-6 py-3 whitespace-nowrap text-md text-gray-800">
          {Number(props?.margin.toFixed(4))}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-md text-gray-800">
          {Number(props?.entryPrice.toFixed(4))}
        </td>

        <td className="px-6 py-3 whitespace-nowrap text-md text-gray-800">
          {props?.entryPrice.toFixed(4)}
          <PnLComponent />
        </td>

        <td className="px-6 py-3 whitespace-nowrap text-md text-gray-800">
          <Link href={`https://scan.orai.io/account/${props.trader}`}>
            <a className="underline">
              {`${props.trader?.slice(0, 4)}......${props.trader?.slice(-5)}`}
            </a>
          </Link>
        </td>
      </tr>
    </tbody>
  );
}

function THead() {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Time
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Symbol
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Side
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Type
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Leverage
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Size
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Initial Amount
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Entry Price
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          PNL(ROI%)
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Trader
        </th>
      </tr>
    </thead>
  );
}
