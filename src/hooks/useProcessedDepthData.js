import { useEffect, useState, useRef } from "react";

export default function useProcessedDepthData(bidsRaw, asksRaw, throttleMs = 500) {
  const [depthData, setDepthData] = useState([]);

  // Keep refs for latest raw bids/asks to avoid re-processing on every render
  const bidsRef = useRef([]);
  const asksRef = useRef([]);

  // Update refs on raw data change
  useEffect(() => {
    bidsRef.current = bidsRaw;
  }, [bidsRaw]);

  useEffect(() => {
    asksRef.current = asksRaw;
  }, [asksRaw]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Process bids
      const sortedBids = [...bidsRef.current].sort((a, b) => b[1] - a[1]);
      let cumulativeBid = 0;
      const bidsProcessed = sortedBids.map(([type, price, quantity]) => {
        cumulativeBid += quantity;
        return { price, bid: cumulativeBid };
      });

      // Process asks
      const sortedAsks = [...asksRef.current].sort((a, b) => a[1] - b[1]);
      let cumulativeAsk = 0;
      const asksProcessed = sortedAsks.map(([type, price, quantity]) => {
        cumulativeAsk += quantity;
        return { price, ask: cumulativeAsk };
      });

      // Merge bids and asks by price
      const merged = [...bidsProcessed, ...asksProcessed]
        .sort((a, b) => a.price - b.price)
        .reduce((acc, curr) => {
          const existing = acc.find((item) => item.price === curr.price);
          if (existing) {
            return acc.map((item) =>
              item.price === curr.price ? { ...item, ...curr } : item
            );
          }
          return [...acc, curr];
        }, []);

      setDepthData(merged);
    }, throttleMs);

    return () => clearInterval(interval);
  }, [throttleMs]);

  return depthData;
}