import React, { useState } from "react";
import GameBoard from "./GameBoard";
import { useAviator } from "../../store/aviator";
import AccessDenied from "../AccessDenied";
import { Assets } from "pixi.js";
import { urls } from "../../utils/urls";
import Splash from "../pixicomp/Splash";
import { Game_Global_Vars, initBet6, loadSound } from "../../utils";
import TopLogoBar from "../TopLogoBar";
import RuleModal from "../RuleDialog";
import SettingModal from "../SettingModal";
import HistoryModal from "../HistoryModal";

const Aviator = () => {
  const { aviatorState, setAviatorState } = useAviator();
  const [loaded, setLoaded] = useState(false);
  console.log("loaded: ", loaded);
  const [openGame, setOpenGame] = useState(false);

  const [bet6, setBet6] = useState<string[]>(initBet6);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  React.useEffect(() => {
    Game_Global_Vars.betValue = [bet6[0], bet6[0]];
  }, [bet6]);

  React.useEffect(() => {
    // Load assets with error handling
    Assets.load(urls)
      .then(() => {
        console.log("Assets loaded successfully");
        setLoaded(true);
      })
      .catch((error) => {
        console.log(
          "Asset loading failed, but continuing with dummy data:",
          error
        );
        setLoaded(true);
      });

    // Set up dummy data instead of real API calls
    const setupDummyData = async () => {
      try {
        // Simulate API response with dummy data
        const dummyConfig = {
          data: {
            data: {
              config: {
                chips: [100, 200, 300, 400, 500, 600, 700, 800],
              },
            },
            maxStake: 10000,
            minStake: 100,
            user: {
              account: {
                balance: 5000,
              },
            },
          },
        };

        localStorage.setItem(
          "bet6",
          JSON.stringify(
            dummyConfig.data.data.config.chips
              .slice(0, 4)
              .map((item: number) => `${item}`)
          )
        );
        Game_Global_Vars.stake = {
          max: dummyConfig.data.maxStake,
          min: dummyConfig.data.minStake,
        };
        setAviatorState((prev) => ({
          ...prev,
          balance: dummyConfig.data.user.account.balance,
          auth: true,
          token: "dummy-token",
        }));

        // Generate dummy hash
        Game_Global_Vars.hash =
          "dummy-hash-" + Math.random().toString(36).substr(2, 9);

        // loadSound();
      } catch (e) {
        console.log("Error in dummy setup:", e);
        setAviatorState((prev) => ({ ...prev, auth: true })); // Still allow access
      }
    };

    setupDummyData();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      <TopLogoBar
        loaded={loaded}
        setSettingModalOpen={setSettingModalOpen}
        setHistoryModalOpen={setHistoryModalOpen}
        setRuleModalOpen={setRuleModalOpen}
      />
      {aviatorState.auth ? (
        openGame && loaded ? (
          <GameBoard bet6={bet6} />
        ) : (
          <Splash loaded={loaded} setOpenGame={setOpenGame} />
        )
      ) : (
        <AccessDenied />
      )}
      <RuleModal open={ruleModalOpen} setOpen={setRuleModalOpen} />
      <SettingModal
        open={settingModalOpen}
        setOpen={setSettingModalOpen}
        bet6={{ bet6, setBet6 }}
      />
      <HistoryModal
        loaded={loaded}
        open={historyModalOpen}
        setOpen={setHistoryModalOpen}
      />
    </>
  );
};
export default Aviator;
