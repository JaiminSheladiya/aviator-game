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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start sm:p-[1.75rem] p-[.5rem]">
      <div className="bg-[#1b1c1d] w-full max-w-[500px] rounded-xl text-white shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center py-2 px-4 border-b border-[#2c2d30] bg-[#2c2d30]">
          <span className="text-base ">GAME LIMITS</span>
          <button onClick={onClose} className="text-[#97a4ae] hover:text-white">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Limits List */}
        <div className="px-4 py-8">
          <div className="border border-[#2c2d30] rounded-lg [&>*:nth-child(n+2)]:border-t [&>*:nth-child(n+2)]:border-[#2c2d30]">
            {[
              { label: "Minimum bet USD:", value: "0.10" },
              { label: "Maximum bet USD:", value: "100.00" },
              { label: "Maximum win for one bet USD:", value: "10,000.00" },
            ].map(({ label, value }, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-2 py-1"
              >
                <span className="text-sm text-gray-300">{label}</span>
                <span className="bg-[#123405] border border-[#427f00] text-white px-2 py-0 text-sm rounded-[30px]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLimitsModal;
