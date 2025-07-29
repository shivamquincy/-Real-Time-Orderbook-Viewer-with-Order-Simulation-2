import React from 'react';
import OrderForm from '@/components/orderForm';
import OrderBookTables from '@/components/orderBook';
import SpreadChart from '@/components/spreadChart';
import DepthChart from '@/components/depthChart';


export default function HomePage() {
  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center gap-2">
        <img
          src="/file1.png"
          alt="Vam Charts Logo"
          className="w-40 h-35 "
        />
      </div>

      {/* Grid layout */}
      <main className="grid grid-cols-4 gap-4">
        {/* Order Form */}
        <section className="col-span-1 bg-[#000003] p-4 rounded">
          <OrderForm />
        </section>

        {/* Order Book */}
        <section className="col-span-2 bg-[#000003] p-4 rounded">
          <OrderBookTables />
        </section>

        {/* Future Order Table + Charts */}
        <section className="col-span-1 bg-[#000003] p-4 rounded flex flex-col gap-4">
          {/* Placeholder for Future Order Table */}


          {/* Charts */}
          <div className="h-1/2 flex flex-col gap-4">
            <div>
              <h3 className="text-white text-sm mb-1">Spread</h3>
              <SpreadChart />
            </div>
            <div>
              <h3 className="text-white text-sm mb-1">Market Depth</h3>
              <DepthChart />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}