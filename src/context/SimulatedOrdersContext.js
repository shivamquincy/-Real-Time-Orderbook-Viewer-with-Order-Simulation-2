'use client';
import { createContext, useContext, useState } from 'react';

const SimulatedOrdersContext = createContext();

export const SimulatedOrdersProvider = ({ children }) => {
  const [simulatedOrders, setSimulatedOrders] = useState([]);

  return (
    <SimulatedOrdersContext.Provider value={{ simulatedOrders, setSimulatedOrders }}>
      {children}
    </SimulatedOrdersContext.Provider>
  );
};

export const useSimulatedOrders = () => useContext(SimulatedOrdersContext);