"use client";
import React, { useEffect } from "react";
import useOrderBookWebSocket from "@/hooks/useOrderBook";
import { useSimulatedOrders } from "@/context/SimulatedOrdersContext";

const calculateTotal = (entries) => {
  let runningTotal = 0;
  return entries.map((entry) => {
    runningTotal += parseFloat(entry.amount) || 0;
    const amountInK = (parseFloat(entry.amount) / 1000).toFixed(2);
    const totalInK = (runningTotal / 1000).toFixed(2);
    return {
      ...entry,
      amount: `${amountInK}k`,
      total: `${totalInK}k`,
    };
  });
};

function padArray(arr, desiredLength, padWith = { price: "--", amount: 0, total: 0 }) {
  if (arr.length >= desiredLength) return arr.slice(0, desiredLength);
  return [...arr, ...Array(desiredLength - arr.length).fill(padWith)];
}

const mergeOrders = (live, simulated, side) => {
  const merged = [...live];

  simulated
    .filter((o) => o.side.toLowerCase() === side.toLowerCase())
    .forEach((order) => {
      merged.push({
        price: order.price,
        amount: order.quantity,
        isSimulated: true,
      });
    });

  // Sort: Bids = descending, Asks = ascending
  merged.sort((a, b) =>
    side.toLowerCase() === "buy"
      ? parseFloat(b.price) - parseFloat(a.price)
      : parseFloat(a.price) - parseFloat(b.price)
  );

  return merged;
};

const OrderBookTables = () => {
  const orderBook = useOrderBookWebSocket("BTC-PERPETUAL");
  const loading = !orderBook?.bids || !orderBook?.asks;
  const error = !orderBook ? "Failed to load order book" : null;

  const { simulatedOrders, setSimulatedOrders } = useSimulatedOrders();

  // Auto-remove expired simulated orders based on delay and timestamp
  useEffect(() => {
    if (simulatedOrders.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setSimulatedOrders((prevOrders) =>
        prevOrders.filter(order => now - order.timestamp < order.delay * 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [simulatedOrders, setSimulatedOrders]);

  const asksRaw = orderBook.asks || [];
  const bidsRaw = orderBook.bids || [];

  const asks = asksRaw
    .filter(([status]) => status !== "delete")
    .map(([_, price, amount]) => ({ price, amount }));

  const bids = bidsRaw
    .filter(([status]) => status !== "delete")
    .map(([_, price, amount]) => ({ price, amount }));

  const mergedBids = padArray(mergeOrders(bids, simulatedOrders, "buy"), 15);
  const mergedAsks = padArray(mergeOrders(asks, simulatedOrders, "sell"), 15);

  const bidsWithTotal = calculateTotal(mergedBids);
  const asksWithTotal = calculateTotal(mergedAsks);

  const lowestBid =
    mergedBids.length > 0 ? mergedBids[mergedBids.length - 1].price : "--";
  const highestAsk = mergedAsks.length > 0 ? mergedAsks[0].price : "--";

  if (loading) return <div className="text-white p-4">Loading order book...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="bg-[#141d18] p-6 rounded-2xl shadow-xl text-white w-full">
      <div className="mb-2">
        <h1 className="text-xl font-bold mb-1">Order Book</h1>
        <div className="text-xs text-gray-400 mb-3">
          Price in USD, Amount in contracts (cts, shown in k), Total in contracts (cts, shown in k)
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-green-400">Lowest Bid: {lowestBid}</span>
          <span className="text-red-400">Highest Ask: {highestAsk}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bids */}
        <div>
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-xs text-white">
                <th>Price (USDT)</th>
                <th>Amount (Cts.)</th>
                <th>Total (Cts.)</th>
              </tr>
            </thead>
            <tbody>
              {bidsWithTotal.map((bid, i) => (
                <tr
                  key={i}
                  className={`rounded-md ${
                    bid.isSimulated ? "bg-green-800/30" : "bg-black/20"
                  }`}
                >
                  <td className="px-3 py-1 text-green-400">{bid.price}</td>
                  <td className="px-3 py-1">{bid.amount}</td>
                  <td className="px-3 py-1">{bid.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Asks */}
        <div>
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-xs text-white">
                <th>Price (USD)</th>
                <th>Amount (cts, k)</th>
                <th>Total (cts, k)</th>
              </tr>
            </thead>
            <tbody>
              {asksWithTotal.map((ask, i) => (
                <tr
                  key={i}
                  className={`rounded-md ${
                    ask.isSimulated ? "bg-red-800/30" : "bg-black/20"
                  }`}
                >
                  <td className="px-3 py-1 text-red-400">{ask.price}</td>
                  <td className="px-3 py-1">{ask.amount}</td>
                  <td className="px-3 py-1">{ask.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderBookTables;