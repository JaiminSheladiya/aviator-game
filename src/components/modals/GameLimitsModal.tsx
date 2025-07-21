import React from "react";
import { X } from "lucide-react";

const GameLimitsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-8">
      <div className="bg-[#1b1c1d] w-full max-w-sm rounded-xl text-white shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2c2d30]">
          <span className="text-base font-semibold">GAME LIMITS</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Limits List */}
        <div className="p-6 space-y-4">
          {[
            { label: "Minimum bet USD:", value: "0.10" },
            { label: "Maximum bet USD:", value: "100.00" },
            { label: "Maximum win for one bet USD:", value: "10,000.00" },
          ].map(({ label, value }, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border border-[#2c2d30] px-4 py-2 rounded-lg"
            >
              <span className="text-sm text-gray-300">{label}</span>
              <span className="bg-green-800 text-white px-3 py-1 text-sm rounded-md">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameLimitsModal;
