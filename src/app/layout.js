// src/app/layout.jsx
import './globals.css';
import { SimulatedOrdersProvider } from '@/context/SimulatedOrdersContext';

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <body className="bg-[#000003] text-white min-h-screen">
         <SimulatedOrdersProvider>
  {children}
     </SimulatedOrdersProvider>
</body>
    </html>

  );
}