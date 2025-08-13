import React from "react";

interface CashoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  cashoutData: {
    cashOutAtMultiplier: string;
    cashout: number;
    stake: number;
  };
}

const CashoutSuccessModal: React.FC<CashoutSuccessModalProps> = ({
  isOpen,
  onClose,
  cashoutData,
}) => {
  // Auto-close after 4 seconds
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { cashOutAtMultiplier, cashout, stake } = cashoutData;
  const winAmount = cashout - stake;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center animate-fadeIn"
      style={{ paddingTop: "1rem" }}
    >
      <div className="relative animate-scaleIn w-[90%] max-w-[25rem]">
        {/* Main Banner - Single Dark Green Capsule */}
        <div className="bg-[#004a00] rounded-full border border-[#28A909] shadow-2xl p-1 relative">
          {/* Grid Layout: 45% Cashout | 45% Win USD | 10% Close Button */}
          <div className="grid grid-cols-[45%_45%_10%] items-center gap-2">
            {/* Left Section - Cashout Text (45%) */}
            <div className="text-white text-center">
              <div className="text-xs font-normal mb-1 text-gray-100">
                You have cashed out!
              </div>
              <div className="text-2xl font-medium text-white">
                {cashOutAtMultiplier}x
              </div>
            </div>

            {/* Middle Section - Win USD Inner Capsule (45%) */}
            <div className="bg-[#28A909] rounded-full px-3 py-1 relative w-full">
              <div className="text-xs font-medium text-white text-center">
                Win USD
              </div>
              <div className="text-lg font-bold text-white text-center">
                {winAmount.toFixed(2)}
              </div>

              {/* Decorative Stars - Inside the capsule */}
              <div className="absolute top-1 left-2 animate-pulse">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
              <div
                className="absolute bottom-1 left-2 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
            </div>

            {/* Right Section - Close Button (10%) */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
              >
                <span className="text-lg font-bold text-gray-400">×</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashoutSuccessModal;
