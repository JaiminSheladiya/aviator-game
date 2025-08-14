import * as React from "react";
import SwitchButton from "./SwitchButton";
import { Slider } from "@mui/material";
import {
  closeFullscreen,
  openFullscreen,
  playSound,
  setVolume,
  stopSound,
  testMobile,
} from "../utils";
import { useAviator } from "../store/aviator";
import HeaderMenu from "./HeaderMenu";

const TopLogoBar = ({
  loaded,
  setSettingModalOpen,
  setHistoryModalOpen,
  setRuleModalOpen,
}: {
  loaded: boolean;
  setSettingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHistoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { aviatorState } = useAviator();
  const [scale, setScale] = React.useState(1);
  const [w_factor, set_w_factor] = React.useState(0);
  const [showMenu, setShowMenu] = React.useState(false);
  const header_ref = React.useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = React.useState(100);

  // const [fullScreen, setFullScreen] = React.useState(false);

  // const handleFullScreen = () => {
  //   setFullScreen(document.fullscreenElement !== null);
  // };

  const handleResize = () => {
    set_w_factor(window.innerWidth > 1024 ? 32 : 24);
    setTimeout(() => {
      setMaxH(window.innerHeight - (header_ref.current?.clientHeight || 100));
    }, 100);
    const { mobile } = testMobile();
    if (mobile) {
      setScale(window.devicePixelRatio / window.innerWidth > 400 ? 3 : 1);
    } else {
      setScale(window.devicePixelRatio);
    }
  };
  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    // handleFullScreen();
    // window.addEventListener("fullscreenchange", handleFullScreen);
    return () => {
      window.removeEventListener("resize", handleResize);
      // window.removeEventListener("fullscreenchange", handleFullScreen);
    };
  }, []);

  return (
    <>
      {
        <div className="w-full bg-[#1B1C1D] text-white relative">
          <div
            className="flex justify-between items-center w-full "
            ref={header_ref}
            style={{ padding: (w_factor / scale) * 0.2 }}
          >
            {/* <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E59407] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                BG
              </div>
              <span className="text-white font-bold">Gaming</span>
            </div> */}
            <img
              src="/vimaan-logo.png"
              alt="Aviator Logo"
              className="w-8 h-8 object-contain"
              style={{ transform: `scale(2.5)`, marginLeft: "2rem" }}
            />
            <div className="flex " style={{ gap: (w_factor / scale) * 0.3 }}>
              <div
                className="flex gap-1 sm:gap-2 justify-center font-semibold items-center"
                style={{ fontSize: "14px", color: "#9B9C9E" }}
              >
                {/* <div className="w-4 h-4 bg-[#E59407] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div> */}
                <span style={{ color: "#28A909" }}>
                  {aviatorState.balance
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })
                    .substring(1)}
                </span>{" "}
                USD
              </div>
              <div
                className=" rounded-full bg-[#3E3E43]"
                style={{ width: 3 }}
              />
              <div
                onClick={() => {
                  setShowMenu((prev) => !prev);
                }}
                className="flex flex-col justify-between items-center self-center cursor-pointer rounded-sm hover:bg-[#2e2e2e] transition-all ease-in-out scale-[0.8] sm:scale-100"
                style={{
                  width: (w_factor / scale) * 1.0,
                  height: (w_factor / scale) * 0.8,
                  paddingLeft: (w_factor / scale) * 0.1,
                  paddingRight: (w_factor / scale) * 0.1,
                  paddingTop: (w_factor / scale) * 0.14,
                  paddingBottom: (w_factor / scale) * 0.14,
                }}
              >
                <div
                  className="w-full rounded-full"
                  style={{
                    height: (w_factor / scale) * 0.1,
                    background: "rgb(155, 156, 158)",
                  }}
                />
                <div
                  className="w-full rounded-full"
                  style={{
                    height: (w_factor / scale) * 0.1,
                    background: "rgb(155, 156, 158)",
                  }}
                />
                <div
                  className="w-full rounded-full"
                  style={{
                    height: (w_factor / scale) * 0.1,
                    background: "rgb(155, 156, 158)",
                  }}
                />
              </div>
              <div
                className=" rounded-full bg-[#3E3E43]"
                style={{
                  width: 3,
                  display: testMobile().iPhone ? "none" : "block",
                }}
              />
            </div>
          </div>
          <div
            onClick={() => setShowMenu(false)}
            className="w-full absolute top-[100%] bg-transparent cursor-pointer"
            style={{
              display: showMenu ? "block" : "none",
              height: "calc(100vh - 50px)",
            }}
          ></div>
          {/* <HeaderMenu
            loaded={loaded}
            scaleFactor={w_factor / scale}
            visible={showMenu}
            setVisible={setShowMenu}
            maxH={maxH}
            openSettingModal={() => setSettingModalOpen(true)}
            openHistoryModal={() => setHistoryModalOpen(true)}
            openRuleDialog={() => setRuleModalOpen(true)}
          /> */}

          <HeaderMenu isOpen={showMenu} setIsOpen={setShowMenu} />
        </div>
      }
    </>
  );
};
export default TopLogoBar;
