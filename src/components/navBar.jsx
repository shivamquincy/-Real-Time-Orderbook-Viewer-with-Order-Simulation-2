import React from 'react';
import { Settings } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-[#141d18] text-white px-6 py-3 mb-4 shadow-md rounded-2xl">
      {/* Left: Stylized Text */}
      <div className="text-lg font-bold tracking-wide text-green-400">
        VAM <span className="text-white">Charts</span>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex-1 flex justify-center gap-10 text-sm font-medium text-gray-300">
        <span className="hover:text-green-400 transition-colors duration-200 cursor-pointer">Trade</span>
        <span className="hover:text-green-400 transition-colors duration-200 cursor-pointer">Data</span>
        <span className="hover:text-green-400 transition-colors duration-200 cursor-pointer">Portfolio</span>
      </div>

      {/* Right: Creator tag and Settings */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-1 hover:text-green-400 transition-colors duration-200 cursor-pointer">
          <span className="bg-green-400 text-black px-2 py-0.5 rounded-full font-bold">V</span>
          <span>Created by VAM</span>
        </div>
        <Settings className="w-4 h-4 cursor-pointer hover:text-green-400 transition-colors duration-200" />
      </div>
    </nav>
  );
}