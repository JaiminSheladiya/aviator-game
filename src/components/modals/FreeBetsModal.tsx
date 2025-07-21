import React from "react";
import { X, Archive } from "lucide-react";

const FreeBetsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-8">

      <div
        className="bg-[#1b1c1d] w-full max-w-[500px] rounded-xl text-white shadow-xl p-6 relative"
        style={{ fontFamily: "sans-serif" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-lg font-semibold mb-4">FREE BETS MANAGEMENT</div>

        {/* Cash Option */}
        <div className="border border-green-500 rounded-md py-2 px-4 flex items-center mb-4 text-sm text-white">
          <div className="w-3 h-3 rounded-full border-2 border-green-500 bg-green-500 mr-2" />
          Play with cash
        </div>

        {/* Archive Button */}
        <div className="flex justify-end mb-4">
          <button className="flex items-center gap-1 border border-[#2c2d30] text-gray-400 text-xs px-3 py-1.5 rounded-md">
            <Archive size={14} />
            Archive
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center text-center text-gray-400">
          <svg
            width="60"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
            <path d="M16 3v4"></path>
            <path d="M8 3v4"></path>
            <path d="M3 11h18"></path>
            <path d="M12 17l1.5-4.5L12 9l-1.5 3.5L12 17z"></path>
          </svg>
          <p className="text-sm mt-2">No Active Free Bets. Yet!</p>
        </div>
      </div>
    </div>
  );
};

export default FreeBetsModal;
