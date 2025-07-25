import React, { useState } from "react";
import {
  Volume2,
  Music,
  Zap,
  Star,
  RotateCcw,
  Camera,
  HelpCircle,
  FileText,
  Shield,
  Grid3X3,
  Home,
  User,
} from "lucide-react";
import FreeBetsModal from "./modals/FreeBetsModal";
import MyBetHistoryModal from "./modals/MyBetHistoryModal";
import GameLimitsModal from "./modals/GameLimitsModal";
import ProvablyFairModal from "./modals/ProvablyFairModal";
import HowToPlayModal from "./modals/HowToPlayModal";
import { useAviator } from "../store/aviator";
import ChangeAvatarModal from "./modals/ChangeAvatarModal";

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  hasToggle?: boolean;
  isEnabled?: boolean;
  onToggle?: () => void;
}

interface RegularMenuItem {
  icon: React.ReactElement;
  label: string;
}

const DropdownComponent: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  // Use global aviatorState for sound/music toggles
  const { aviatorState, setAviatorState } = useAviator();
  // Remove local state for sound/music
  // const [soundEnabled, setSoundEnabled] = useState<boolean>(false); // Disabled in image
  // const [musicEnabled, setMusicEnabled] = useState<boolean>(true); // Enabled in image
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(true); // Enabled in image
  const [showFreeBetsModal, setShowFreeBetsModal] = useState(false);
  const [showBetHistory, setShowBetHistory] = useState(false);
  const [showGameLimitsModal, setShowGameLimitsModal] = useState(false);
  const [showProvablyFairModal, setShowProvablyFairModal] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(1); // default avatar #1

  const getAvatarUrl = (id: number) => `/avatars/av-${id}.png`;
  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Volume2 size={16} />,
      label: "Sound",
      hasToggle: true,
      isEnabled: aviatorState.fxChecked,
      onToggle: () =>
        setAviatorState((prev) => ({ ...prev, fxChecked: !prev.fxChecked })),
    },
    {
      icon: <Music size={16} />,
      label: "Music",
      hasToggle: true,
      isEnabled: aviatorState.musicChecked,
      onToggle: () =>
        setAviatorState((prev) => ({
          ...prev,
          musicChecked: !prev.musicChecked,
        })),
    },
    {
      icon: <Zap size={16} />,
      label: "Animation",
      hasToggle: true,
      isEnabled: animationEnabled,
      onToggle: () => setAnimationEnabled(!animationEnabled),
    },
  ];

  const regularMenuItems: (RegularMenuItem & { onClick?: () => void })[] = [
    {
      icon: <Star size={16} />,
      label: "Free Bets",
      onClick: () => setShowFreeBetsModal(true),
    },
    {
      icon: <RotateCcw size={16} />,
      label: "My Bet History",
      onClick: () => setShowBetHistory(true),
    },
    {
      icon: <Camera size={16} />,
      label: "Game Limits",
      onClick: () => setShowGameLimitsModal(true),
    },
    {
      icon: <HelpCircle size={16} />,
      label: "How To Play",
      onClick: () => setShowHowToPlayModal(true),
    },
    { icon: <FileText size={16} />, label: "Game Rules" },
    {
      icon: <Shield size={16} />,
      label: "Provably Fair Settings",
      onClick: () => setShowProvablyFairModal(true),
    },
    { icon: <Grid3X3 size={16} />, label: "Game Room: Room #1" },
  ];

  return (
    // <div className="bg-gray-900 p-8 min-h-screen flex items-start justify-center">
    <div className="relative">
      {/* Trigger Button */}
      {/* <button
          onClick={toggleDropdown}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          {isOpen ? "Close Menu" : "Open Menu"}
        </button> */}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-2 mt-2 w-80 bg-[#1b1c1d] border border-gray-700 rounded-lg shadow-2xl z-50">
          {/* User section */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <img
                  src={getAvatarUrl(selectedAvatarId)}
                  alt="Current Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <span
                className="text-white font-medium text-base"
                style={{ fontSize: "14px" }}
              >
                demo_31525
              </span>
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="flex items-center border border-[#2c2d30] rounded-full px-2 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <div className="border border-[#2c2d30] rounded-full p-1">
                <User size={18} />
              </div>
              <span
                className="ml-2 text-sm leading-[1rem] pr-2"
                style={{ fontSize: "12px" }}
              >
                Change
                <br />
                Avatar
              </span>
            </button>
          </div>

          {/* Toggle items */}
          <div className="border-b border-gray-700">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-4 py-2.5 hover:bg-gray-750 transition-colors cursor-pointer ${
                  index !== menuItems.length - 1 ? "border-b" : ""
                }`}
                style={{ borderColor: "#2c2d30" }}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-400 w-4">{item.icon}</div>
                  <span
                    className="text-white font-normal text-base"
                    style={{ fontSize: "14px" }}
                  >
                    {item.label}
                  </span>
                </div>

                <button
                  onClick={item.onToggle}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    item.isEnabled ? "bg-gray-400" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 rounded-full transition-transform top-0.5 ${
                      item.isEnabled
                        ? "translate-x-6 bg-gray-200"
                        : "translate-x-0.5 bg-gray-600"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Spacer div */}
          <div className="h-4 bg-[#2c2d30]"></div>

          {/* Regular menu items */}
          <div>
            {regularMenuItems.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick}
                className={`flex items-center px-4 py-2.5 hover:bg-gray-750 transition-colors cursor-pointer ${
                  index !== regularMenuItems.length - 1 ? "border-b" : ""
                }`}
                style={{ borderColor: "#2c2d30" }}
              >
                <div className="text-gray-400 w-4 mr-3">{item.icon}</div>
                <span
                  className="text-white font-normal text-base"
                  style={{ fontSize: "14px" }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Home section with different background */}
          <div className="bg-gray-750 rounded-b-lg" onClick={()=>window.location.href = '/'}>
            <div className="flex items-center justify-center px-4 py-3 cursor-pointer bg-[#2c2d30] rounded-b-lg transition-colors">
              <Home size={16} className="text-gray-400 mr-2" />
              <span
                className="text-gray-400 font-normal text-base"
                style={{ fontSize: "14px" }}
              >
                Home
              </span>
            </div>
          </div>
        </div>
      )}
      <FreeBetsModal
        isOpen={showFreeBetsModal}
        onClose={() => setShowFreeBetsModal(false)}
      />
      <MyBetHistoryModal
        isOpen={showBetHistory}
        onClose={() => setShowBetHistory(false)}
      />
      <GameLimitsModal
        isOpen={showGameLimitsModal}
        onClose={() => setShowGameLimitsModal(false)}
      />
      <ProvablyFairModal
        isOpen={showProvablyFairModal}
        onClose={() => setShowProvablyFairModal(false)}
      />
      <HowToPlayModal
        isOpen={showHowToPlayModal}
        onClose={() => setShowHowToPlayModal(false)}
      />
      <ChangeAvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        selectedId={selectedAvatarId}
        onSelect={(id) => setSelectedAvatarId(id)}
      />
    </div>
    // </div>
  );
};

export default DropdownComponent;
