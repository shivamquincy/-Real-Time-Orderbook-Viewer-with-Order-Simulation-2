// src/app/layout.jsx
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#000003] text-white min-h-screen">
  {children}
</body>
    </html>
  );
}