import React, { useState } from "react";
import { X } from "lucide-react";

interface Bet {
  time: string;
  date: string;
  amount: number;
  multiplier: string;
  cashout?: number;
  won: boolean;
}

// Expanded dummy data (more than 10)
const dummyBets: Bet[] = [
  // original 10
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
  // 10 more dummy entries
  {
    time: "00:52",
    date: "22-07-25",
    amount: 10.0,
    multiplier: "1.50x",
    won: false,
  },
  {
    time: "00:51",
    date: "22-07-25",
    amount: 15.5,
    multiplier: "2.00x",
    cashout: 31.0,
    won: true,
  },
  {
    time: "00:50",
    date: "22-07-25",
    amount: 11.1,
    multiplier: "2.30x",
    cashout: 25.5,
    won: true,
  },
  {
    time: "00:49",
    date: "22-07-25",
    amount: 7.2,
    multiplier: "1.10x",
    won: false,
  },
  {
    time: "00:48",
    date: "22-07-25",
    amount: 9.9,
    multiplier: "3.00x",
    cashout: 29.7,
    won: true,
  },
  {
    time: "00:47",
    date: "22-07-25",
    amount: 6.6,
    multiplier: "1.20x",
    won: false,
  },
  {
    time: "00:46",
    date: "22-07-25",
    amount: 13.3,
    multiplier: "2.50x",
    cashout: 33.25,
    won: true,
  },
  {
    time: "00:45",
    date: "22-07-25",
    amount: 5.5,
    multiplier: "4.00x",
    won: false,
  },
  {
    time: "00:44",
    date: "22-07-25",
    amount: 14.2,
    multiplier: "1.80x",
    cashout: 25.56,
    won: true,
  },
  {
    time: "00:43",
    date: "22-07-25",
    amount: 12.5,
    multiplier: "3.00x",
    won: false,
  },
];

const MyBetHistoryModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [visibleCount, setVisibleCount] = useState(10); // initial 10
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-8">
      <div className="bg-[#1b1c1d] w-full max-w-[500px] rounded-xl text-white shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-[#242424] border-b border-[#2c2d30]">
          <span className="text-base font-semibold">MY BET HISTORY</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table Header */}
        <div className="px-6 py-2 text-[11px] text-[#7b7b7b] font-medium flex justify-between border-b border-[#2c2d30]">
          <div className="w-[30%]">Date</div>
          <div className="w-[30%] text-left">Bet USD X</div>
          <div className="w-[30%] text-right">Cash out USD</div>
        </div>

        {/* Bet List */}
        <div className="max-h-[360px] overflow-y-auto">
          {dummyBets.slice(0, visibleCount).map((bet, index) => (
            <div
              key={index}
              className={`mx-2 py-1 px-1 flex justify-between items-center text-sm ${
                bet.won ? "bg-green-800 bg-opacity-70" : "bg-[#101112]"
              } ${index !== visibleCount - 1 ? "border-b" : ""}`}
              style={{ borderColor: "#2c2d30", borderRadius: "8px" }}
            >
              <div className="w-[30%] leading-tight text-white text-[11px]">
                <div>{bet.time}</div>
                <div>{bet.date}</div>
              </div>

              <div className="w-[30%] text-center font-small flex items-center justify-center">
                <div className="text-[#bbbfc5]">{bet.amount.toFixed(2)}</div>
                <div
                  className={`text-xs font-semibold px-2 py-0.5 ml-2 rounded-full w- ${
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

              <div className="w-[30%] text-right text-white text-[12px]">
                {bet.cashout ? (
                  <span className="font-small">
                    {bet.cashout.toFixed(2)}
                  </span>
                ) : (
                  <div className="text-green-400 flex justify-end items-center gap-1">
                    <img
                      src="/icon-provabyfair.svg"
                      alt="checkmark"
                      className="w-4 h-4"
                    />
                    <img src="/share.svg" alt="checkmark" className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {visibleCount < dummyBets.length ? (
            <div className="px-6 py-4 border-t border-[#2c2d30] bg-[#1b1c1d]">
              <button
                className="w-full bg-[#2c2d30] text-gray-400 text-sm py-2 rounded-full hover:bg-[#3a3b3c] transition"
                onClick={handleLoadMore}
              >
                Load more
              </button>
            </div>
          ) : (
            <div className="py-2 border-t border-[#2c2d30] bg-[#1b1c1d]"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBetHistoryModal;
