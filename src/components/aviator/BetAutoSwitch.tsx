import { betAutoStateType } from "../../@types";

const BetAutoButton = ({
  disabled,
  title,
  onClick,
  isActive,
}: {
  disabled: boolean;
  title: string;
  onClick: () => void;
  isActive: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex justify-center items-center w-[90px] lg:w-[90px] h-[24px] lg:h-[28px] rounded-full text-[8px] lg:text-lg z-10 disabled:opacity-80 disabled:cursor-not-allowed ${
        isActive ? "text-white" : "text-gray-400"
      }`}
      style={{ fontSize: "0.8rem" }}
    >
      {title}
    </button>
  );
};

const BetAutoSwitch = ({
  disabled,
  betAuto: { betAutoState, setBetAutoState },
}: {
  disabled: boolean;
  betAuto: {
    betAutoState: betAutoStateType;
    setBetAutoState: (val: betAutoStateType) => void;
  };
}) => {
  const handleBetClick = () => {
    setBetAutoState("bet");
  };
  const handleAutoClick = () => {
    setBetAutoState("auto");
  };
  return (
    <div className="flex gap-1 rounded-full relative bg-[#141516] p-1 w-[200px] h-[32px]">
      <div
        className={`absolute top-1 w-[90px] lg:w-[90px] h-[24px] lg:h-[28px] rounded-full bg-gradient-to-b from-[#2c2d30] to-[#2c2d30] transition-all ease-in-out ${
          betAutoState === "bet"
            ? ""
            : "translate-x-[94px] lg:translate-x-[94px]"
        } `}
      ></div>
      <BetAutoButton
        disabled={disabled}
        onClick={handleBetClick}
        title="Bet"
        isActive={betAutoState === "bet"}
      />
      <BetAutoButton
        disabled={disabled}
        onClick={handleAutoClick}
        title="Auto"
        isActive={betAutoState === "auto"}
      />
    </div>
  );
};
export default BetAutoSwitch;
