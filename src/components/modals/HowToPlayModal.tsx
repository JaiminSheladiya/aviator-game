import React from "react";
import { X } from "lucide-react";

const HowToPlayModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-8">
      <div className="bg-[#f5a623] w-full max-w-3xl rounded-xl text-black relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#f5a623] border-b border-black">
          <h2 className="text-lg font-semibold">HOW TO PLAY?</h2>
          <button onClick={onClose} className="text-black hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Embedded Video */}
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/PZejs3XDCSY"
            title="How to play Aviator"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-[320px] border-none"
          />
        </div>

        {/* Steps Section */}
        <div className="bg-[#f5a623] px-6 py-6 space-y-4 text-black text-sm">
          {[
            {
              num: "01",
              icon: "💸",
              text: "Make a bet, or even two at same time and wait for the round to start.",
            },
            {
              num: "02",
              icon: "✈️",
              text: "Look after the lucky plane. Your win is bet multiplied by a coefficient of lucky plane.",
            },
            {
              num: "03",
              icon: "🏆",
              text: "Cash Out before plane flies away and money is yours!",
            },
          ].map((step, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-8 h-8 bg-white text-black font-bold rounded-full">
                {step.num}
              </div>
              <div className="flex-1 flex gap-2 items-start">
                <span className="text-lg">{step.icon}</span>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-black bg-[#f5a623] py-2 border-t border-black">
          detailed rules
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;
