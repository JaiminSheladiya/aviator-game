import React, { Dispatch, SetStateAction } from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { openFullscreen, testMobile } from "../../utils";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#393939",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#E59407",
  },
}));

const Splash = ({
  loaded,
  setOpenGame,
}: {
  loaded: boolean;
  setOpenGame: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="flex flex-col gap-10 w-full items-center text-white justify-center"
      style={{ height: "calc(100vh - 50px)" }}
    >
      <div className="flex flex-col gap-4 items-center justify-center">
        {/* Simple plane icon */}
        <div className="w-[243px] h-[105px] -rotate-[25deg] flex items-center justify-center">
          <div className="w-20 h-10 bg-[#E59407] rounded-lg relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#FFB432] rounded-full"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-[#FFB432] rounded-full"></div>
          </div>
        </div>

        {/* Aviator text */}
        <div className="w-[200px] text-center">
          <h1 className="text-4xl font-bold text-[#E59407]">AVIATOR</h1>
          <p className="text-sm text-gray-400 mt-2">Crash Game</p>
        </div>
      </div>
      {loaded ? (
        <button
          onClick={() => {
            setOpenGame(true);
            if (!testMobile().iPhone) openFullscreen();
          }}
          className="px-8 py-2 text-lg rounded-full border border-[#fff] bg-gradient-to-b from-[#E59407] to-[#412900] uppercase font-bold"
        >
          Start
        </button>
      ) : (
        <div className="w-60 py-4">
          <BorderLinearProgress />
        </div>
      )}
    </div>
  );
};
export default Splash;
