import React from "react";
import { X } from "lucide-react";

interface Bet {
  time: string;
  date: string;
  amount: number;
  multiplier: string;
  cashout?: number;
  won: boolean;
}

const dummyBets: Bet[] = [
  {
    time: "00:56",
    date: "22-07-25",
    amount: 16.35,
    multiplier: "3.48x",
    won: false,
  },
  {
    time: "00:55",
    date: "22-07-25",
    amount: 12.1,
    multiplier: "1.06x",
    won: false,
  },
  {
    time: "00:55",
    date: "22-07-25",
    amount: 8.17,
    multiplier: "1.06x",
    won: false,
  },
  {
    time: "00:55",
    date: "22-07-25",
    amount: 4.08,
    multiplier: "1.24x",
    won: false,
  },
  {
    time: "00:55",
    date: "22-07-25",
    amount: 12.1,
    multiplier: "1.24x",
    won: false,
  },
  {
    time: "00:55",
    date: "22-07-25",
    amount: 12.1,
    multiplier: "2.21x",
    cashout: 26.75,
    won: true,
  },
  {
    time: "00:54",
    date: "22-07-25",
    amount: 8.17,
    multiplier: "2.07x",
    cashout: 16.93,
    won: true,
  },
  {
    time: "00:54",
    date: "22-07-25",
    amount: 9.16,
    multiplier: "1.75x",
    cashout: 16.03,
    won: true,
  },
  {
    time: "00:53",
    date: "22-07-25",
    amount: 8.17,
    multiplier: "8.20x",
    won: false,
  },
  {
    time: "00:53",
    date: "22-07-25",
    amount: 9.16,
    multiplier: "2.04x",
    cashout: 18.68,
    won: true,
  },
];

const MyBetHistoryModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-8">
      <div className="bg-[#1b1c1d] w-full max-w-[500px] rounded-xl text-white shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2c2d30]">
          <span className="text-base font-semibold">MY BET HISTORY</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table Header */}
        <div className="px-6 py-2 text-sm text-gray-400 font-medium flex justify-between border-b border-[#2c2d30]">
          <div className="w-[30%]">Date</div>
          <div className="w-[30%] text-center">Bet USD X</div>
          <div className="w-[30%] text-right">Cash out USD</div>
        </div>

        {/* Bet List */}
        <div className="max-h-[360px] overflow-y-auto">
          {dummyBets.map((bet, index) => (
            <div
              key={index}
              className={`px-6 py-2 flex justify-between items-center text-sm ${
                bet.won ? "bg-green-800 bg-opacity-70" : "bg-[#1b1c1d]"
              } ${index !== dummyBets.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: "#2c2d30" }}
            >
              {/* Date */}
              <div className="w-[30%] text-gray-300 leading-tight">
                <div>{bet.time}</div>
                <div className="text-xs text-gray-500">{bet.date}</div>
              </div>

              {/* Bet + X */}
              <div className="w-[30%] text-center font-medium">
                <div className={`${bet.won ? "text-white" : "text-gray-300"}`}>
                  {bet.amount.toFixed(2)}
                </div>
                <div
                  className={`text-xs font-semibold inline-block mt-1 px-2 py-0.5 rounded-full ${
                    bet.multiplier.includes("x")
                      ? bet.multiplier === "1.06x"
                        ? "text-blue-400 bg-black bg-opacity-30"
                        : "text-purple-400 bg-black bg-opacity-30"
                      : ""
                  }`}
                >
                  {bet.multiplier}
                </div>
              </div>

              {/* Cashout */}
              <div className="w-[30%] text-right text-white text-sm">
                {bet.cashout ? (
                  <span className="font-semibold">
                    {bet.cashout.toFixed(2)}
                  </span>
                ) : (
                  <div className="text-green-400 flex justify-end items-center gap-1">
                    ✅ {/* Replace with icon if needed */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="px-6 py-4 border-t border-[#2c2d30] bg-[#1b1c1d]">
          <button className="w-full bg-[#2c2d30] text-gray-400 text-sm py-2 rounded-full hover:bg-[#3a3b3c] transition">
            Load more
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBetHistoryModal;
