"use client";
import useOrderBookWebSocket from '@/hooks/useOrderBook';
import useSpreadHistory from '@/hooks/useSpreadData';
import React, { createContext, useContext, useState } from 'react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const spreadData = [
//   { time: "09:00", spread: 1.2 },
//   { time: "09:10", spread: 1.5 },
//   { time: "09:20", spread: 1.3 },
//   { time: "09:30", spread: 1.8 },
//   { time: "09:40", spread: 1.0 },
//   { time: "09:50", spread: 0.9 },
//   { time: "10:00", spread: 1.4 },
// ];



const SpreadChart = () => {
 const orderBook = useOrderBookWebSocket('BTC-PERPETUAL');
   const asksRaw = orderBook.asks || [];
const bidsRaw = orderBook.bids || [];
// console.log("this is asks raw");
// console.log(asksRaw);
// console.log("this is bids raw");
// console.log(bidsRaw);
const bestBid = bidsRaw[0] ? parseFloat(bidsRaw[0][1]) : null;
const bestAsk = asksRaw[0] ? parseFloat(asksRaw[0][1]) : null;
// console.log('🔥 Order Book Data' , asksRaw, bidsRaw);
// console.log(bestBid);
// console.log(bestAsk);
const spread = (bestAsk && bestBid) ? (bestAsk - bestBid) : null;
// console.log(spread);


  const spreadHistory = useSpreadHistory(spread, 1000, 60);
  // console.log(spreadHistory);
  const spreadData = spreadHistory.map(entry => ({
    time: entry.time,
    spread: parseFloat(entry.spread),
  }));

  return (
    <div className="w-full h-96 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={spreadData}>
          <defs>
            <linearGradient id="colorSpread" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4bcc68" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4bcc68" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="spread"
            stroke="#4bcc69"
            fillOpacity={1}
            fill="url(#colorSpread)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpreadChart;