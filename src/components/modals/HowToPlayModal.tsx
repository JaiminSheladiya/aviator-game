import React from "react";
import { X } from "lucide-react";
import bet from "../../assets/01-bet.svg";
import watch from "../../assets/02-watch.svg";
import cashout from "../../assets/03-cashout.svg";

const HowToPlayModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start sm:p-[1.75rem] p-[.5rem]">
      <div className="bg-[#f5a623] w-full max-w-[500px] rounded-xl text-black relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center py-2 px-4 bg-[#e69308] border-b border-black">
          <h2 className="text-[16px] text-[#5f3816]">HOW TO PLAY?</h2>
          <button onClick={onClose} className="text-[#49290c]">
            <X size={20} strokeWidth={3} />
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
            className="w-full border-none"
          />
        </div>

        {/* Steps Section */}
        <div className="bg-[#f5a623] p-4 space-y-4 text-black text-sm">
          {[
            {
              num: "01",
              icon: bet,
              text: "Make a bet, or even two at same time and wait for the round to start.",
            },
            {
              num: "02",
              icon: watch,
              text: "Look after the lucky plane. Your win is bet multiplied by a coefficient of lucky plane.",
            },
            {
              num: "03",
              icon: cashout,
              text: "Cash Out before plane flies away and money is yours!",
            },
          ].map((step, idx) => (
            <div key={idx} className="flex gap-0 items-start">
              <div className="flex-shrink-0 flex flex-col items-center justify-center  text-[#5f3816] font-bold h-[40px] text-[18px] mr-1">
                {step.num}
              </div>
              <div className="flex-1 flex gap-4 items-start">
                {/* <span className="text-lg">{step.icon}</span> */}
                <img src={step.icon} alt="img" className="h-[40px]" />
                <p className="text-[#5f3816]">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center text-center text-[.875rem] py-2  text-[#5f3816] bg-[#e69308] h-[45px]">
          <p>detailed rules</p>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;
