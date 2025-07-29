import { useEffect, useState } from 'react';

export default function useOrderBookWebSocket(instrument = 'BTC-PERPETUAL') {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    const socket = new WebSocket('wss://www.deribit.com/ws/api/v2');
    console.log('📡 Connecting to Deribit WebSocket...');

    socket.onopen = () => {
      console.log('✅ WebSocket connected');

      // Request one-time snapshot
      socket.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'public/get_order_book',
        params: {
          instrument_name: instrument
        }
      }));

      // Subscribe to live updates
      socket.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'public/subscribe',
        params: {
          channels: [`book.${instrument}.100ms`]
        }
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Uncomment for debugging this
      // console.log('📩 WebSocket message:', data);

      // Initial snapshot
      if (data.result && data.result.bids && data.result.asks) {
        const { bids, asks } = data.result;
        setOrderBook({
          bids: bids.slice(0, 15),
          asks: asks.slice(0, 15),
        });
      }

      // Live updates
      if (data.method === 'subscription' && data.params?.data) {
        const { bids, asks } = data.params.data;
        setOrderBook({
          bids: bids.slice(0, 15),
          asks: asks.slice(0, 15),
        });
      }
    };

    socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, [instrument]);

  return orderBook;
}