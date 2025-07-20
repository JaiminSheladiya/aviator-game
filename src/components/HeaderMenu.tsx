import React from "react";
import { Switch, Slider } from "@mui/material";
import {
  FaRegStar,
  FaHistory,
  FaGamepad,
  FaQuestionCircle,
  FaBook,
  FaBalanceScale,
  FaDoorOpen,
  FaUserCircle,
} from "react-icons/fa";

const DummyIcon = ({ icon: Icon }: { icon: any }) => (
  <Icon className="text-white text-base" />
);

const HeaderMenu = ({
  loaded,
  scaleFactor,
  visible,
  setVisible,
  maxH,
  openSettingModal,
  openHistoryModal,
  openRuleDialog,
}: {
  loaded: boolean;
  scaleFactor: number;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  maxH: number;
  openSettingModal: () => void;
  openHistoryModal: () => void;
  openRuleDialog: () => void;
}) => {
  const [musicChecked, setMusicChecked] = React.useState(true);
  const [soundChecked, setSoundChecked] = React.useState(false);
  const [animationChecked, setAnimationChecked] = React.useState(false);

  return (
    <div
      className="absolute right-0 top-[100%] w-80 z-50 rounded-lg overflow-hidden shadow-lg transition-all"
      style={{
        display: visible ? "block" : "none",
        scale: `${scaleFactor * 0.035}`,
        maxHeight: maxH / (Math.max(scaleFactor, 0.1) * 0.035),
      }}
    >
      <div className="bg-[#3E3E43] text-white flex flex-col gap-[2px]">
        {/* Avatar + Username */}
        <div className="flex justify-between items-center px-4 py-3 bg-[#2F3033]">
          <div className="flex items-center gap-3">
            <img
              src="/aviator-logo.svg"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="font-semibold">demo_64510</div>
          </div>
          <button className="text-sm text-gray-400 hover:text-white">
            Change Avatar
          </button>
        </div>

        {/* Toggle Options */}
        {[
          { label: "Sound", state: soundChecked, setState: setSoundChecked },
          { label: "Music", state: musicChecked, setState: setMusicChecked },
          {
            label: "Animation",
            state: animationChecked,
            setState: setAnimationChecked,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center px-4 py-3 bg-[#1B1C1D] hover:bg-[#2B1C1D] transition-all"
          >
            <span>{item.label}</span>
            <Switch
              size="small"
              checked={item.state}
              onChange={() => item.setState(!item.state)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#EFAC01",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#EFAC01",
                },
              }}
            />
          </div>
        ))}

        {/* Menu Items */}
        {[
          { label: "Free Bets", icon: FaRegStar },
          {
            label: "My Bet History",
            icon: FaHistory,
            onClick: openHistoryModal,
          },
          { label: "Game Limits", icon: FaGamepad },
          { label: "How To Play", icon: FaQuestionCircle },
          { label: "Game Rules", icon: FaBook, onClick: openRuleDialog },
          { label: "Provably Fair Settings", icon: FaBalanceScale },
          { label: "Game Room: Room #2", icon: FaDoorOpen },
        ].map(({ label, icon, onClick }) => (
          <div
            key={label}
            onClick={() => {
              setVisible(false);
              onClick?.();
            }}
            className="flex items-center justify-between px-4 py-3 bg-[#1B1C1D] hover:bg-[#2B1C1D] cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <DummyIcon icon={icon} />
              <span>{label}</span>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="text-center py-2 text-sm text-gray-400 bg-[#2F3033]">
          Home
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
