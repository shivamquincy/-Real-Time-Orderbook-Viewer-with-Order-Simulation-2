"use client";
import React, { createContext, useContext, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import useOrderBookWebSocket from '@/hooks/useOrderBook';

const data = [
  { price: 99, bid: 0, ask: 40 },
  { price: 100, bid: 50, ask: 35 },
  { price: 101, bid: 100, ask: 30 },
  { price: 102, bid: 150, ask: 25 },
  { price: 103, bid: 200, ask: 20 },
  { price: 104, bid: 250, ask: 15 },
  { price: 105, bid: 300, ask: 10 },
];

const DepthChart = () => {
const orderBook = useOrderBookWebSocket('BTC-PERPETUAL');
   const asksRaw = orderBook.asks || [];
const bidsRaw = orderBook.bids || [];
console.log(asksRaw, bidsRaw);

  return (
    <div className="w-full h-96 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="bid"
            stroke="#00C49F"
            strokeWidth={2}
            dot={false}
            name="Bids"
          />
          <Line
            type="monotone"
            dataKey="ask"
            stroke="#FF4D4F"
            strokeWidth={2}
            dot={false}
            name="Asks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepthChart;