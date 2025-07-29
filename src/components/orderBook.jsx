"use client";
import React, { useEffect } from "react";
import useOrderBookWebSocket from "@/hooks/useOrderBook";

 const calculateTotal = (entries) => {
    let runningTotal = 0;
    return entries.map((entry) => {
      runningTotal += parseFloat(entry.amount);
      const amountInK = (parseFloat(entry.amount) / 1000).toFixed(2);
      const totalInK = (runningTotal / 1000).toFixed(2);
      return {
        price: entry.price,
        amount: `${amountInK}k`,
        total: `${totalInK}k`,
      };
    });
  };

function padArray(arr, desiredLength, padWith = { price: '--', amount: 0 }) {
  if (arr.length >= desiredLength) return arr.slice(0, desiredLength);
  return [...arr, ...Array(desiredLength - arr.length).fill(padWith)];
}


const OrderBookTables = () => {
  const orderBook = useOrderBookWebSocket('BTC-PERPETUAL');
  const loading = !orderBook || !orderBook.bids || !orderBook.asks;
  const error = !orderBook ? "Failed to load order book" : null;

  // useEffect(() => {
  //   console.log('📥 Component orderBook:', orderBook);
  // }, [orderBook]);


  const asksRaw = orderBook.asks || [];
const bidsRaw = orderBook.bids || [];

const asksMappedFiltered = asksRaw
  .filter(([status]) => status !== 'delete')
  .map(([status, price, amount]) => ({ price, amount }));

const bidsMappedFiltered = bidsRaw
  .filter(([status]) => status !== 'delete')
  .map(([status, price, amount]) => ({ price, amount }));

const asksMapped = padArray(asksMappedFiltered, 15);
const bidsMapped = padArray(bidsMappedFiltered, 15);

const asksWithTotal = calculateTotal(asksMapped);
const bidsWithTotal = calculateTotal(bidsMapped);

const lowestBid = bidsMapped.length > 0 ? bidsMapped[bidsMapped.length - 1].price : "--";
const highestAsk = asksMapped.length > 0 ? asksMapped[0].price : "--";



  
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
          {/* <h2 className="text-green-400 text-lg mb-2 font-semibold">Bids</h2> */}
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
                <tr key={i} className="bg-black/20 rounded-md">
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
          {/* <h2 className="text-red-400 text-lg mb-2 font-semibold">Asks</h2> */}
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
                <tr key={i} className="bg-black/20 rounded-md">
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