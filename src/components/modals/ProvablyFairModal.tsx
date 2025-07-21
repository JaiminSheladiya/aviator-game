import React from "react";
import { X, Info } from "lucide-react";

const ProvablyFairModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-8">
      <div className="bg-[#1b1c1d] w-full max-w-2xl rounded-xl text-white shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2c2d30]">
          <span className="text-base font-semibold">
            PROVABLY FAIR SETTINGS
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        <div className="px-6 pt-4 text-sm text-gray-400">
          This game uses Provably Fair technology to determine game result. This
          tool gives you the ability to change your seed and check fairness of
          the game.
        </div>

        <div className="px-6 mt-6 space-y-6 pb-6">
          {/* Client Seed Section */}
          <div>
            <div className="flex items-center gap-2 text-white font-medium mb-1">
              <span>🖥️ Client (your) seed:</span>
              <a
                href="#"
                className="text-red-400 text-sm flex items-center gap-1"
              >
                <Info size={14} /> What is Provably Fair
              </a>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              Round result is determined form combination of server seed and
              first 3 bets of the round.
            </div>

            <div className="bg-black rounded-md px-4 py-3 text-green-400 flex justify-between items-center text-sm">
              <span>Random on every new game</span>
              <span className="text-white font-mono">xFq2mLG2S7uHhdLHxsmH</span>
              <button className="ml-2 text-gray-400 hover:text-white">
                📋
              </button>
            </div>

            <div className="mt-2 bg-[#2c2d30] rounded-md px-4 py-3 text-gray-500 flex justify-between items-center text-sm">
              <span>Enter manually</span>
              <span className="opacity-50">RNJjNwVbqaOsgi6XlBxu-0</span>
              <button disabled className="ml-2 text-gray-500">
                CHANGE
              </button>
            </div>
          </div>

          {/* Server Seed Section */}
          <div>
            <div className="flex items-center gap-2 text-white font-medium mb-2">
              <span>🖧 Server seed SHA256:</span>
            </div>
            <div className="bg-black text-white font-mono px-4 py-3 rounded-md break-all text-sm">
              2f2c450a4acbd49b0870de9bc71c34810b9ab21175939e4d1b2480ec82aad171
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#1b1c1d] text-center text-sm text-gray-500 border-t border-[#2c2d30]">
          You can check fairness of each bet from bets history
        </div>
      </div>
    </div>
  );
};

export default ProvablyFairModal;
