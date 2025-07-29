"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import useOrderBookWebSocket from "@/hooks/useOrderBook";
import useProcessedDepthData from "@/hooks/useProcessedDepthData";

const MAX_POINTS = 50;

const DepthChart = () => {
  const orderBook = useOrderBookWebSocket("BTC-PERPETUAL");
  const asksRaw = orderBook.asks || [];
  const bidsRaw = orderBook.bids || [];

  const processedData = useProcessedDepthData(bidsRaw, asksRaw, 500);
  const lastTradePrice =
    bidsRaw.length && asksRaw.length
      ? (bidsRaw[0].price + asksRaw[0].price) / 2
      : null;
      console.log(lastTradePrice);

  const [chartData, setChartData] = useState([]);
  const bufferRef = useRef([]);

  useEffect(() => {
    if (!processedData || processedData.length === 0) return;

    // Add new snapshot to buffer
    bufferRef.current = [...processedData];

    const filtered = bufferRef.current
      .filter((entry) => entry.price && (entry.bid || entry.ask))
      .sort((a, b) => a.price - b.price)
      .slice(-MAX_POINTS);

    setChartData(filtered);
  }, [processedData]);

  return (
    <div className="w-full h-96 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C49F" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF4D4F" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#FF4D4F" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Area with gradient underlines */}
          <Area
            type="monotone"
            dataKey="bid"
            stroke={false}
            fill="url(#bidGradient)"
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="ask"
            stroke={false}
            fill="url(#askGradient)"
            dot={false}
            isAnimationActive={false}
          />

          {/* Crisp top edge lines */}
          <Line
            type="monotone"
            dataKey="bid"
            stroke="#00C49F"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="Bids"
          />
          <Line
            type="monotone"
            dataKey="ask"
            stroke="#FF4D4F"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="Asks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepthChart;