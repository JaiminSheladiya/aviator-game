import React, { useState } from "react";
import GameBoard from "./GameBoard";
import { useAviator } from "../../store/aviator";
import AccessDenied from "../AccessDenied";
import { Assets } from "pixi.js";
import { urls } from "../../utils/urls";
import Splash from "../pixicomp/Splash";
import { Game_Global_Vars, initBet6, loadSound, playSound } from "../../utils";
import TopLogoBar from "../TopLogoBar";
import RuleModal from "../RuleDialog";
import SettingModal from "../SettingModal";
import HistoryModal from "../HistoryModal";
import axios from "axios";
import { getUserBalance } from "../../api/universeCasino";
import { useSocket } from "../../providers/SocketProvider";

const API_BASE = "https://universeexchapi.com/casinoapp/exchange";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRUb2tlbiI6IlUyRnNkR1ZrWDE5K21vOVJGcTgxK0p3RFg3dTgyeXhIS0xWNmx3NUxUYzlDVXBOcml1THZkSUFMNE5YYlVHb2c2YmU1b0dqbDR0azhWMS81Rllad2hKZkJmaUxmc0JuZTNxZmx3cEl6SE1ZdVljUWlta3ZSQjRyVldzNzVJR0ErbFFDT0phSXdTMXRqU2tqWWR6YkU4Vk1ONDVmQVlvUWZkczh4V3dleHp5OGVDU0I1bzc3YnFOMnlsVHRCVDR5YmgxaGFkbUFPWDMvN3pnSjYzUFpicHhVWnNEOEdNNzdGNWtYUU9jYU40M1VqVTBVcVUwdXFsK0NkL3RZTER4ZVVXOFFUTEdza1dockQySUJLUXcvaEJySDZxQm9JajZ1Vk9aRm5vMmlMVXhWaU1hTlpvd3NTTWV1ckwwRVlVL3lmbTgzTnlGS0xaVXZFeXd5a0dncnhXdGxsT2dhMnRDUGx2a1l6REdIWlpFbHZENEprOWxKM1R6dnAxRzRpb1ZpbCIsImlhdCI6MTc1MzgxNjQ2N30.VeN0v2UhdqWjLaZQ8GDLK79EQYxbq_IgEcHWDN9MgxY";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

const Aviator = () => {
  const {
    isConnected,
    isAuthenticated,
    balance,
    marketData,
    lastBetResult,
    sendMessage,
    connect,
  } = useSocket();

  const { aviatorState, setAviatorState } = useAviator();
  const [loaded, setLoaded] = useState(false);
  const [openGame, setOpenGame] = useState(false);
  console.log("openGame: ", openGame);
  const [marketId, setMarketId] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const [bet6, setBet6] = useState<string[]>(initBet6);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  React.useEffect(() => {
    Game_Global_Vars.betValue = [bet6[0], bet6[0]];
  }, [bet6]);
  React.useEffect(() => {
    if (openGame && aviatorState.fxChecked) {
      if (aviatorState.game_anim_status === "ANIM_CRASHED") playSound("flew");
      if (aviatorState.game_anim_status === "ANIM_STARTED") playSound("take");
    }
  }, [aviatorState.game_anim_status]);

  React.useEffect(() => {
    // Load assets with error handling
    loadSound();
    Assets.load(urls)
      .then(() => {
        setLoaded(true);
      })
      .catch((error) => {
        // console.log(
        //   "Asset loading failed, but continuing with dummy data:",
        //   error
        // );
        setLoaded(true);
      });

    // Fetch real user balance from API
    const fetchUserBalanceAndSet = async () => {
      try {
        const balance = await getUserBalance();
        setAviatorState((prev) => ({
          ...prev,
          balance,
          auth: true,
          token: "<hidden>", // Optionally store token if needed
        }));
      } catch (e) {
        console.log("Error fetching user balance:", e);
        setAviatorState((prev) => ({ ...prev, auth: true }));
      }
    };

    fetchUserBalanceAndSet();

    // WebSocket integration
    // let socket: WebSocket | null = null;
    // let heartbeatInterval: NodeJS.Timeout | null = null;
    // function handleSocketMessage(data: any) {
    //   console.log("data: ===>>>", data);
    //   if (data.type === "balance_update") {
    //     setAviatorState((prev) => ({ ...prev, balance: data.balance }));
    //   } else if (data.type === "bet_result") {
    //     console.log("Bet result:", data);
    //     // Optionally show a snackbar/notification here
    //   } else if (data.type === "market_update") {
    //     console.log("Market update received:", data);
    //     if (data.marketId) {
    //       console.log("Setting marketId to:", data.marketId);
    //       setMarketId(data.marketId);
    //     }
    //   } else {
    //     console.log("Socket message:", data);
    //   }
    // }
    // socket = connectCasinoWebSocket(handleSocketMessage);
    // Add connection status logging
    // socket.onopen = (event) => {
    //   console.log("WebSocket connected successfully", event);
    //   socket?.send(
    //     JSON.stringify({
    //       type: "auth",
    //       token: `Bearer ${TOKEN}`,
    //     })
    //   );
    //   setWsConnected(true);
    // };
    // socket.onerror = (error) => {
    //   console.error("WebSocket connection error:", error);
    //   setWsConnected(false);
    // };
    // socket.onclose = (event) => {
    //   console.log("WebSocket disconnected:", event.code, event.reason);
    //   setWsConnected(false);
    // };
    // socket.onmessage = (event) => {
    //   console.log("event: ===>>>", event);
    // };
    // Heartbeat every 30s
    // heartbeatInterval = setInterval(() => {
    //   if (socket && socket.readyState === WebSocket.OPEN) {
    //     socket.send(JSON.stringify({ type: "market_update" }));
    //   }
    // }, 5000);

    // return () => {
    //   // Cleanup if needed
    //   if (socket) socket.close();
    //   if (heartbeatInterval) clearInterval(heartbeatInterval);
    // };

    connect();
  }, []);

  // Manual balance refresh function for testing
  const refreshBalance = async () => {
    try {
      const balance = await getUserBalance();
      setAviatorState((prev) => ({ ...prev, balance }));
      console.log("Balance refreshed:", balance);
    } catch (e) {
      console.log("Error refreshing balance:", e);
    }
  };

  return (
    <>
      <TopLogoBar
        loaded={loaded}
        setSettingModalOpen={setSettingModalOpen}
        setHistoryModalOpen={setHistoryModalOpen}
        setRuleModalOpen={setRuleModalOpen}
      />
      {/* Debug UI for development */}
      {/* {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            background: "#333",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          <div>WS: {wsConnected ? "🟢 Connected" : "🔴 Disconnected"}</div>
          <div>Market ID: {marketId || "None"}</div>
          <button
            onClick={refreshBalance}
            style={{
              marginTop: "5px",
              padding: "2px 8px",
              background: "#666",
              border: "none",
              color: "white",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Refresh Balance
          </button>
        </div>
      )} */}
      {aviatorState.auth ? (
        openGame && loaded ? (
          <GameBoard bet6={bet6} marketId={marketId} />
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
