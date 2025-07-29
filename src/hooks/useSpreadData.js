import { useEffect, useState, useRef } from "react";



	// Each time spread changes, the useEffect sees a new value and updates.
	// The hook doesn’t rely on bestBid/bestAsk directly anymore — just the spread, already computed.
export default function useSpreadHistory(spread, interval = 1000, maxEntries = 60) {
  const [spreadHistory, setSpreadHistory] = useState([]);
  const spreadRef = useRef(spread);

  // Keep ref in sync
  useEffect(() => {
    spreadRef.current = spread;
  }, [spread]);

  useEffect(() => {
    const id = setInterval(() => {
      const currentSpread = spreadRef.current;

      // Logging to confirm we're getting correct spread
      console.log("Current Spread inside interval:", currentSpread);

      if (currentSpread != null) {
        const time = new Date().toLocaleTimeString();
        setSpreadHistory(prev => {
          const newEntry = { time, spread: currentSpread.toFixed(2) };
          const updated = [...prev, newEntry];
          if (updated.length > maxEntries) updated.shift();
          console.log("Updated Spread History:", updated);
          return updated;
        });
      }
    }, interval);

    return () => clearInterval(id);
  }, [interval, maxEntries]);

  return spreadHistory;
}