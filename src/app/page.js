import React from 'react';
import OrderForm from '@/components/orderForm';
import OrderBookTables from '@/components/orderBook';
import SpreadChart from '@/components/spreadChart';
import DepthChart from '@/components/depthChart';
import Navbar from '@/components/navBar';

export default function HomePage() {
  return (
    <div className="min-h-screen p-4 bg-black">
      <Navbar />

      {/* Grid layout */}
      <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Order Form */}
        <section className="bg-[#000003] p-4 rounded md:col-span-1 lg:col-span-1">
          <OrderForm />
        </section>

        {/* Order Book */}
        <section className="bg-[#000003] p-4 rounded md:col-span-2 lg:col-span-2">
          <OrderBookTables />
        </section>

        {/* Future Order Table + Charts */}
        <section className="p-4 rounded flex flex-col gap-4 md:col-span-3 lg:col-span-1">
          <div className="flex flex-col gap-4 h-full">
            <div className="bg-[#141d18] p-3 rounded">
              <h3 className="text-white text-sm mb-1">Spread</h3>
              <SpreadChart />
            </div>
            <div className="bg-[#141d18] p-3 rounded">
              <h3 className="text-white text-sm mb-1">Market Depth</h3>
              <DepthChart />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}