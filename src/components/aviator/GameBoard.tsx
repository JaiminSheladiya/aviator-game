import { ChangeEvent, useEffect, useRef, useState } from "react";
import BetAutoSwitch from "./BetAutoSwitch";
import {
  betAutoStateType,
  betBoardAllItemType,
  betBoardMyItemType,
  betPlaceStatusType,
  cashingStatusType,
  dimensionType,
} from "../../@types";
import PIXIComponent from "../pixicomp";
import { useAviator } from "../../store/aviator";
import {
  Game_Global_Vars,
  doDelay,
  getHistoryItemColor,
  initBet6,
  playSound,
  setStateTemplate,
} from "../../utils";
import SnackBar from "../SnackBar";
import SwitchButton from "../SwitchButton";
import AutoBetModal from "../AutoBetModal";
import BetBoard from "./BetBoard";
import CustomSnackBar from "../CustomSnackBar";

const AVATAR_URLS = [
  // DiceBear Avatars (open source)
  "https://api.dicebear.com/7.x/identicon/svg?seed=",
  "https://api.dicebear.com/7.x/bottts/svg?seed=",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=",
  "https://api.dicebear.com/7.x/thumbs/svg?seed=",
];
function randomUsername() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const first = chars[Math.floor(Math.random() * chars.length)];
  const last = Math.floor(Math.random() * 10);
  const mid = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${first}***${last}`;
}
function randomAvatar(seed: string) {
  const base = AVATAR_URLS[Math.floor(Math.random() * AVATAR_URLS.length)];
  return base + encodeURIComponent(seed);
}
const dummyUsers = [
  "/avatars/av-1.png",
  "/avatars/av-2.png",
  "/avatars/av-3.png",
];
const GameBoard = ({ bet6 }: { bet6: string[] }) => {
  const { aviatorState, setAviatorState } = useAviator();
  const [autoPlayingIndex, setAutoPlayingIndex] = useState(0);
  const [snackState, setSnackState] = useState({
    open: false,
    msg: "",
  });
  const [modalAutoPlayOpen, modalAutoPlaySetOpen] = useState(false);
  const [rotate, setRotate] = useState(0);

  const [trigParachute, setTrigParachute] = useState({ uniqId: 0, isMe: true });

  const [crashHistory, setCrashHistory] = useState<string[]>([
    "1.25x",
    "2.15x",
    "1.85x",
    "3.45x",
    "1.12x",
  ]);
  const [crashAnim, setCrashAnim] = useState<boolean>(false);
  const [crashColor, setCrashColor] = useState<string[]>([]);
  const [pixiDimension, setPixiDimension] = useState<dimensionType>({
    width: 0,
    height: 400,
  });
  const pixi_ref = useRef<HTMLDivElement>(null);
  const footer_ref = useRef<HTMLDivElement>(null);

  const [betButtonCount, setBetButtonCount] = useState(2);
  const [curPayout, setCurPayout] = useState(0);

  const [pendingBet, setPendingBet] = useState<boolean[]>([false, false]);
  const [allowedBet, setAllowedBet] = useState(false);
  const [betAutoState, setBetAutoState] = useState<betAutoStateType[]>([
    "bet",
    "bet",
  ]);
  const [betValue, setBetValue] = useState<string[]>([
    initBet6[0],
    initBet6[0],
  ]);
  const [cashedWin, setCashedWin] = useState<number[]>([0, 0]);
  const [enabledAutoCashOut, setEnabledAutoCashOut] = useState<boolean[]>([
    false,
    false,
  ]);
  const [autoCashVal, setAutoCashVal] = useState<string[]>(["1.45", "1.45"]);
  const [betPlaceStatus, setBetPlaceStatus] = useState<betPlaceStatusType[]>([
    "none",
    "none",
  ]);
  const [cashingStatus, setCashingStatus] = useState<cashingStatusType[]>([
    "none",
    "none",
  ]);
  const [betBoardAllItem, setBetBoardAllItem] = useState<betBoardAllItemType[]>(
    []
  );

  const [cashes, setCashes] = useState<{ payout: number; win: number }[]>([]);

  // Add new state for previous rounds and all users
  const [previousRounds, setPreviousRounds] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const crashAudioRef = useRef<HTMLAudioElement | null>(null);

  const [progress, setProgress] = useState(100);

  const _setBetValue = (
    val: string | ((prev: string) => string),
    i: number
  ) => {
    if (typeof val === "string") {
      Game_Global_Vars.betValue[i] = val;
      setBetValue((prev) => {
        const new_val = [...prev];
        new_val[i] = val;
        return new_val;
      });
    } else {
      setBetValue((prev) => {
        const new_val = [...prev];
        new_val[i] = val(prev[i]);
        Game_Global_Vars.betValue = new_val;
        return new_val;
      });
    }
  };

  const _setBetPlaceStatus = (
    val: betPlaceStatusType | betPlaceStatusType[],
    i: number
  ) => {
    if (typeof val === "object") {
      Game_Global_Vars.betPlaceStatus = val;
      setBetPlaceStatus(val);
    } else {
      Game_Global_Vars.betPlaceStatus[i] = val;
      setBetPlaceStatus(setStateTemplate(val, i));
    }
  };

  const _setCashingStatus = (val: cashingStatusType, i: number) => {
    Game_Global_Vars.cashingStatus[i] = val;
    setCashingStatus(setStateTemplate(val, i));
  };

  const _setPendingBet = (val: boolean | boolean[], i: number) => {
    if (typeof val === "boolean") {
      setPendingBet(setStateTemplate(val, i));
    } else {
      setPendingBet(val);
    }
  };

  const _setEnabledAutoCashOut = (val: boolean, i: number) => {
    setEnabledAutoCashOut(setStateTemplate(val, i));
  };

  const _setAutoCashVal = (val: string, i: number) => {
    setAutoCashVal(setStateTemplate(val, i));
  };

  const _setCashedWin = (val: number, i: number) => {
    setCashedWin(setStateTemplate(val, i));
  };

  const cancelAutoPlay = (i: number) => {
    setAviatorState((prev) => {
      const v = prev.RemainedAutoPlayCount;
      v[i] = 0;
      return { ...prev, RemainedAutoPlayCount: v };
    });
  };

  const handleBetValueChange = (
    e: ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.target.value.endsWith(".")) {
      _setBetValue(e.target.value, i);
    } else {
      _setBetValue(
        Math.max(
          10,
          Math.round(parseFloat(e.target.value) * 100) / 100
        ).toString(),
        i
      );
    }
  };

  const modifyBetValue = (amount: number, i: number) => {
    _setBetValue((prev) => {
      const new_val = parseInt(prev);
      return `${Math.max(new_val + amount, 10)}`;
    }, i);
  };

  const doBet = async (i: number) => {
    console.log(
      "doBet called for index:",
      i,
      "allowedBet:",
      Game_Global_Vars.allowedBet
    );
    if (!Game_Global_Vars.allowedBet) return;
    _setBetPlaceStatus("placing", i);
    Game_Global_Vars.cashStarted[i] = false;
    _setCashingStatus("none", i);

    // Simulate bet placement
    await doDelay(1000);

    // Simulate successful bet
    _setBetPlaceStatus("success", i);
    setAviatorState((prev) => ({
      ...prev,
      balance: prev.balance - parseFloat(betValue[i]),
    }));

    // Add dummy bet to board
    const dummyBet: betBoardAllItemType = {
      gameCrashId: Date.now(),
      username: "Player",
      betAmount: parseFloat(betValue[i]),
    };
    setBetBoardAllItem((prev) => [dummyBet, ...prev]);
    console.log("Bet placed successfully for index:", i);
  };

  const handleBet = async (i: number) => {
    console.log(
      "handleBet called for index:",
      i,
      "allowedBet:",
      Game_Global_Vars.allowedBet
    );
    if (Game_Global_Vars.allowedBet) {
      await doBet(i);
    } else {
      _setPendingBet(true, i);
      Game_Global_Vars.pendingBet[i] = true;
      console.log("Bet queued for next round");
    }
  };

  const cancelBet = async (i: number) => {
    if (Game_Global_Vars.pendingBet[i]) {
      _setPendingBet(false, i);
      Game_Global_Vars.pendingBet[i] = false;
    } else {
      // Simulate bet cancellation
      _setBetPlaceStatus("none", i);
      setAviatorState((prev) => ({
        ...prev,
        balance: prev.balance + parseFloat(betValue[i]),
      }));
    }
    if (aviatorState.RemainedAutoPlayCount[i] > 0) {
      cancelAutoPlay(i);
    }
  };

  useEffect(() => {
    setCrashColor(crashHistory.map((item) => getHistoryItemColor(item)));
  }, [crashHistory]);

  useEffect(() => {
    if (aviatorState.game_anim_status === "WAITING") {
      setProgress(100);
      const totalDuration = 5000; // 5 seconds
      const intervalMs = 20;
      const decrement = 100 / (totalDuration / intervalMs);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - decrement;
        });
      }, intervalMs);
      return () => clearInterval(interval);
    }
  }, [aviatorState.game_anim_status]);

  const handleCashOut = async (i: number, auto?: boolean) => {
    console.log(
      "handleCashOut called for index:",
      i,
      "curPayout:",
      curPayout,
      "betValue:",
      betValue[i]
    );
    if (Game_Global_Vars.cashStarted[i]) return;
    Game_Global_Vars.cashStarted[i] = true;
    _setCashingStatus("caching", i);

    // Simulate cashout
    await doDelay(1000);

    const winAmount = curPayout * parseFloat(betValue[i]);
    console.log(
      "Win amount calculated:",
      winAmount,
      "curPayout:",
      curPayout,
      "betValue:",
      betValue[i]
    );

    setAviatorState((prev) => ({
      ...prev,
      balance: prev.balance + winAmount,
    }));
    _setCashedWin(winAmount, i);
    _setCashingStatus("success", i);
    _setBetPlaceStatus("none", i);

    // Update bet board to show cashout
    setBetBoardAllItem((prev) =>
      prev.map((bet) => {
        if (bet.gameCrashId === Date.now() - i) {
          // Simple way to identify the bet
          return { ...bet, cashout: winAmount, crashedAt: curPayout };
        }
        return bet;
      })
    );

    // playSound("win");
    console.log(
      "Cashout completed successfully. New balance:",
      aviatorState.balance + winAmount
    );
  };

  const handleResize = () => {
    const width = Math.min(
      aviatorState.dimension.width,
      pixi_ref.current?.clientWidth || 0
    );

    // Mobile check: set height to 240px if on mobile
    const isMobile = window.innerWidth < 600;
    const height = isMobile
      ? 240
      : Math.max(
          150,
          window.innerHeight -
            (footer_ref.current?.clientHeight || 0) -
            150 -
            (width > 1392 ? 0 : 10)
        );

    console.log("width, height: ", { width, height });
    setPixiDimension({ width, height });
    setAviatorState((prev) => {
      const new_width = prev.dimension.width;
      const new_height = (new_width * height) / width;
      return {
        ...prev,
        dimension: {
          width: new_width,
          height: new_height,
        },
      };
    });
  };

  // Dummy game simulation
  useEffect(() => {
    const simulateGame = () => {
      // Generate dummy users for this round
      const userCount = 30 + Math.floor(Math.random() * 10);
      const users: any[] = [];
      for (let i = 0; i < userCount; i++) {
        const username = randomUsername();
        users.push({
          username,
          avatar: randomAvatar(username),
        });
      }
      // Always include "You"
      users[0] = {
        username: "You",
        avatar: randomAvatar("You"),
        isYou: true,
      };
      setAllUsers(users);

      // Waiting phase
      setAviatorState((prev) => ({ ...prev, game_anim_status: "WAITING" }));
      setAllowedBet(false);
      Game_Global_Vars.allowedBet = false;
      _setBetPlaceStatus(["none", "none"], 0);
      setCashingStatus(["none", "none"]);
      setCashedWin([0, 0]);
      setBetBoardAllItem([]);

      setTimeout(() => {
        // Betting phase
        setAllowedBet(true);
        Game_Global_Vars.allowedBet = true;
        setAviatorState((prev) => ({ ...prev, game_anim_status: "WAITING" }));
        setTimeout(async () => {
          if (Game_Global_Vars.pendingBet[0]) {
            await doBet(0);
          }
          if (Game_Global_Vars.pendingBet[1]) {
            await doBet(1);
          }
          _setPendingBet([false, false], 0);
          Game_Global_Vars.pendingBet = [false, false];
        }, 100);

        setTimeout(() => {
          // Flying phase
          setAllowedBet(false);
          Game_Global_Vars.allowedBet = false;
          setAviatorState((prev) => ({
            ...prev,
            game_anim_status: "ANIM_STARTED",
          }));
          if (aviatorState.fxChecked) playSound("take");
          // Simulate payout increase
          let payout = 1.0;
          const payoutInterval = setInterval(() => {
            payout += 0.1;
            setCurPayout(payout);
            Game_Global_Vars.curPayout = payout;
            // Live update dummy bets: randomly cash out some users
            if (Math.random() < 0.1 && payout > 1.1) {
              // Pick a random user who hasn't cashed out
              const notCashed = users.filter((u) => !u.cashedOut && !u.isYou);
              if (notCashed.length > 0) {
                const winner =
                  notCashed[Math.floor(Math.random() * notCashed.length)];
                winner.cashedOut = true;
                winner.cashoutX = payout.toFixed(2);
                winner.win = 100 * parseFloat(winner.cashoutX);
                setBetBoardAllItem((prev) => [
                  ...prev,
                  {
                    gameCrashId: Date.now() + Math.random(),
                    username: winner.username,
                    betAmount: 100,
                    crashedAt: parseFloat(winner.cashoutX),
                    cashout: winner.win,
                    avatar: winner.avatar,
                    isWinner: true,
                  },
                ]);
              }
            }
            // Random crash
            if (Math.random() < 0.02) {
              clearInterval(payoutInterval);
              setTimeout(() => {
                // Crash phase
                setCrashHistory((prev) => [`${payout.toFixed(2)}x`, ...prev]);
                setCrashAnim(true);
                if (aviatorState.fxChecked) playCrashSound();
                if (aviatorState.fxChecked) playSound("flew");
                setTimeout(() => setCrashAnim(false), 1000);

                setAviatorState((prev) => ({
                  ...prev,
                  game_anim_status: "ANIM_CRASHED",
                }));
                // playSound("flew");
                // Store previous round
                setPreviousRounds((prev) => [
                  {
                    result: payout.toFixed(2),
                    bets: betBoardAllItem,
                  },
                  ...prev.slice(0, 9),
                ]);
                setTimeout(() => {
                  // Reset for next round
                  setCurPayout(0);
                  Game_Global_Vars.curPayout = 0;
                  _setBetPlaceStatus(["none", "none"], 0);
                  setCashingStatus(["none", "none"]);
                  setCashedWin([0, 0]);
                  simulateGame();
                }, 3000);
              }, 100);
            }
          }, 100);
        }, 5000);
      }, 2000);
    };

    simulateGame();
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    const rotateInterval = setInterval(
      () => setRotate((prev) => prev + 10),
      100
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(rotateInterval);
    };
  }, []);

  useEffect(() => {
    // Play or stop background music based on aviatorState.musicChecked and set volume from aviatorState.vol
    if (aviatorState.musicChecked) {
      if (!bgMusicRef.current) {
        bgMusicRef.current = new Audio("/sounds/bg_music.mp3");
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = (aviatorState.vol ?? 50) / 100;
        bgMusicRef.current.play();
      } else {
        bgMusicRef.current.volume = (aviatorState.vol ?? 50) / 100;
        bgMusicRef.current.play();
      }
    } else {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    }
    return () => {
      // Stop music when GameBoard unmounts
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
        bgMusicRef.current = null;
      }
    };
  }, [aviatorState.musicChecked]);

  useEffect(() => {
    // Play or stop background music based on aviatorState.musicChecked and set volume from aviatorState.vol
    if (aviatorState.musicChecked) {
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = (aviatorState.vol ?? 50) / 100;
      }
    }
  }, [aviatorState.musicChecked, aviatorState.vol]);

  useEffect(() => {
    // Stop any currently playing crash sound if FX is turned off
    if (!aviatorState.fxChecked && crashAudioRef.current) {
      crashAudioRef.current.pause();
      crashAudioRef.current.currentTime = 0;
      crashAudioRef.current = null;
    }
  }, [aviatorState.fxChecked]);

  const playCrashSound = () => {
    // Play sprite_audio.mp3 when game_anim_status is ANIM_CRASHED
    if (!crashAudioRef.current && aviatorState.fxChecked) {
      crashAudioRef.current = new Audio("/sounds/sprite_audio.mp3");
      crashAudioRef.current.volume = 1.0;
      crashAudioRef.current.currentTime = 2.5; // Start from 3 seconds
      crashAudioRef.current.play();
      crashAudioRef.current.onended = () => {
        crashAudioRef.current = null;
      };
    }
  };

  return (
    <div
      className="flex overflow-auto"
      style={{ height: "calc(100vh - 50px)" }}
    >
      <CustomSnackBar cashes={cashes} setCashes={setCashes} />
      <div
        className="w-[460px] hidden lg:block h-full"
        style={{ marginTop: "0.2rem" }}
      >
        <BetBoard />
      </div>
      <div className="flex flex-col gap-0 w-full bg-[#171717] p-2 text-white overflow-auto pb-0">
        <div className="flex justify-between items-center">
          <div className="score-bomb flex gap-x-2 w-full flex-wrap pr-4 h-[26px] overflow-y-hidden">
            {crashHistory.map((item, i) => (
              <span
                key={i}
                style={{ color: crashColor[i] }}
                className={`${
                  i === 0 && crashAnim ? "animate-pinRight" : ""
                } block px-3 py-1 rounded-full bg-gray-900 font-bold text-[11px] 3xl:text-[15px]`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div
          className="mt-0 sm:mt-4 text-center text-sm font-bold w-full rounded-t-[20px] border border-[#e59407]"
          style={{
            background: "rgba(229, 148, 7, .8)",
          }}
        >
          FUN MODE
        </div>

        <div
          className={`flex justify-center w-full relative`}
          style={{
            height: pixiDimension.height,
          }}
          ref={pixi_ref}
        >
          <div className="absolute bottom-8 right-2 bg-[#2c2d30] p-1 pr-2 rounded-full">
            <div className="flex items-center gap-2 text-xs">
              <div className="flex -space-x-2">
                {dummyUsers.map((u, i) => (
                  <img
                    key={i}
                    src={u}
                    alt="avatar"
                    width={24}
                    height={24}
                    className="rounded-full border border-[#28a90a] bg-[#232325]"
                    // onError={(e) => (e.currentTarget.src = PLACEHOLDER_AVATAR)}
                    style={{ zIndex: 10 - i }}
                  />
                ))}
              </div>
              <div>138</div>
            </div>
          </div>
          <div
            className="flex flex-col gap-10 absolute top-0 justify-center items-center"
            style={{
              height: pixiDimension.height,
              display:
                aviatorState.game_anim_status !== "ANIM_STARTED"
                  ? "flex"
                  : "none",
              gap: pixiDimension.height < 200 ? 2 : 40,
            }}
          >
            <div
              style={{
                display:
                  aviatorState.game_anim_status === "WAITING"
                    ? "block"
                    : "none",
                // width: Math.min(pixiDimension.width, pixiDimension.height) / 4,
              }}
            >
              <div className="flex flex-col items-center justify-center w-[300px] rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-4">
                    <img src="/vimaan-logo.png" alt="vimaan" className="h-10" />

                    <div className="w-px h-10 bg-gray-300" />

                    <img
                      src="/vimaan-plane.png"
                      alt="vimaan plane"
                      className="h-10 rotate-[340deg]"
                    />
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 h-2 bg-gray-700 rounded w-[250px]">
                    <div
                      className={`h-2 bg-red-600 rounded ${
                        progress > 0 ? "transition-all duration-100" : ""
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center px-4 py-2 lg:px-8 lg:py-2 rounded-lg">
              <p className="text-white uppercase text-[21px] lg:text-[30px]">
                {aviatorState.game_anim_status === "ANIM_CRASHED" &&
                  "Flew away"}
              </p>
              {aviatorState.game_anim_status === "ANIM_CRASHED" && (
                <p className="text-[#d0011b] font-bold text-[42px] leading-[42px] lg:text-[100px] lg:leading-[100px]">
                  {curPayout.toFixed(2)}x
                </p>
              )}
            </div>
          </div>
          <PIXIComponent
            pixiDimension={pixiDimension}
            curPayout={curPayout}
            trigParachute={trigParachute}
          />
        </div>
        <div
          className="flex flex-col w-full"
          style={{ marginTop: "1.25rem" }}
          ref={footer_ref}
        >
          <div
            className={`grid grid-cols-1 gap-2 relative ${
              betButtonCount === 1 ? "" : "lg:grid-cols-2"
            }`}
          >
            <button
              onClick={() => {
                setBetButtonCount((prev) => (prev === 1 ? 2 : 1));
                setTimeout(handleResize, 500);
              }}
              disabled={betPlaceStatus[1] === "success" || pendingBet[1]}
              className={`absolute right-1 top-1 rounded-full bg-[#171717] w-6 h-6 pb-[2px] flex justify-center items-center text-lg cursor-pointer disabled:opacity-30`}
            >
              {betButtonCount === 1 ? (
                <span>+</span>
              ) : (
                <span className="text-xs">&#8212;</span>
              )}
            </button>
            {[0, 1].map((item, i) => (
              <div
                key={i}
                className={`flex flex-col justify-start items-center gap-1 lg:gap-4 w-full rounded-lg bg-gradient-to-b from-[#1C1C1C] to-black p-4 ${
                  betPlaceStatus[i] === "success" || pendingBet[i]
                    ? allowedBet || pendingBet[i]
                      ? "border border-red-700"
                      : "border border-orange-500"
                    : ""
                } ${i === 1 && betButtonCount === 1 ? "hidden" : ""}`}
                style={{ background: "#1b1c1d" }}
              >
                <BetAutoSwitch
                  disabled={aviatorState.RemainedAutoPlayCount[i] > 0}
                  betAuto={{
                    betAutoState: betAutoState[i],
                    setBetAutoState: (val: betAutoStateType) =>
                      setBetAutoState((prev) => {
                        const new_state = [...prev];
                        new_state[i] = val;
                        return new_state;
                      }),
                  }}
                />
                <div className="w-full md:w-auto flex gap-2">
                  <div className="flex flex-col w-[42%] lg:w-[165px] 3xl:w-[260px] h-full">
                    <div
                      className="flex justify-between items-center text-[10px] 3xl:text-xl w-full h-[27px] 3xl:h-[54px] bg-[#171717] rounded-full px-2"
                      style={{
                        fontFamily: "Roboto",
                        paddingBlock: "1rem",
                      }}
                    >
                      <button
                        disabled={
                          betPlaceStatus[i] === "success" || pendingBet[i]
                        }
                        onClick={() => modifyBetValue(-10, i)}
                        className="flex justify-center items-center w-6 h-6 3xl:w-9 3xl:h-9 text-white font-bold text-base 3xl:text-xl rounded-full bg-[#3e3e3e]"
                      >
                        −
                      </button>
                      <input
                        disabled={
                          betPlaceStatus[i] === "success" || pendingBet[i]
                        }
                        onChange={(e) => handleBetValueChange(e, i)}
                        value={betValue[i]}
                        type="string"
                        className="w-[30px] lg:w-[70px] 3xl:w-[150px] bg-[#171717] text-center text-[13px] 3xl:text-[26px]"
                      />
                      <button
                        disabled={
                          betPlaceStatus[i] === "success" || pendingBet[i]
                        }
                        onClick={() => modifyBetValue(10, i)}
                        className="flex justify-center items-center w-6 h-6 3xl:w-9 3xl:h-9 text-white font-bold text-base 3xl:text-xl rounded-full bg-[#3e3e3e]"
                      >
                        +
                      </button>
                    </div>
                    <div
                      className="grid grid-cols-2 gap-1 w-full h-[40px] 3xl:h-[78px]"
                      style={{ marginTop: "0.3rem" }}
                    >
                      {bet6.map((item, j) => (
                        <button
                          disabled={
                            betPlaceStatus[i] === "success" || pendingBet[i]
                          }
                          key={j}
                          onClick={() => _setBetValue(`${item}`, i)}
                          className="flex justify-center items-center bg-[#171717] rounded-lg gap-[2px] w-full h-[25px] 3xl:h-9 text-[13px] 3xl:text-[26px]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  {betPlaceStatus[i] === "success" || pendingBet[i] ? (
                    pendingBet[i] ? (
                      // <div className="flex flex-col justify-center items-center text-xs w-[100px] lg:w-[160px] 3xl:w-[395px]">
                      <button
                        onClick={() => cancelBet(i)}
                        className="flex flex-col w-full h-full   rounded-[14px] 3xl:rounded-[30px] bg-red-600 hover:bg-red-700 border border-red-500 justify-center items-center font-bold transition-colors"
                      >
                        <span className="text-white text-xs mt-1 opacity-90">
                          Waiting for next round
                        </span>
                        <span className="text-white text-lg mt-2 font-bold leading-none">
                          Cancel
                        </span>
                      </button>
                    ) : (
                      // </div>
                      <button
                        onClick={() => handleCashOut(i, false)}
                        className="flex flex-col w-[100px] lg:w-[160px] h-[80px] 3xl:w-[395px] 3xl:h-[142px] rounded-[14px] 3xl:rounded-[30px] bg-gradient-to-b from-[#E59407] to-[#412900]  justify-center items-center font-bold border border-[#FFB432]/50 hover:opacity-80"
                      >
                        <h4 className="text-[16px] 3xl:text-[42px] leading-[20px] 3xl:leading-[42px] uppercase">
                          {cashingStatus[i] === "none"
                            ? "Cash Out"
                            : cashingStatus[i] === "caching"
                            ? "Cashing Out..."
                            : cashingStatus[i] === "success"
                            ? `Cashed ${cashedWin[i]}`
                            : "Failed"}
                        </h4>
                        {cashingStatus[i] === "none" && (
                          <h4 className="text-[20px]">
                            {(curPayout * parseFloat(betValue[i])).toFixed(2)}
                          </h4>
                        )}
                        {cashingStatus[i] === "none" && (
                          <p className="text-xs text-green-400">
                            {curPayout.toFixed(2)}x
                          </p>
                        )}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleBet(i)}
                      // disabled={!allowedBet || betPlaceStatus[i] !== "none"}
                      className={`disabled:opacity-30 flex flex-col min-w-[58%] lg:min-w-[180px] h-[90px] 3xl:w-[395px] 3xl:h-[142px] rounded-[14px] 3xl:rounded-[30px] bg-[#28a909] justify-center items-center border border-white hover:opacity-80`}
                    >
                      <p className="text-[22px] 3xl:text-[42px] leading-[20px] 3xl:leading-[42px]">
                        Bet
                      </p>
                      <p className="text-[22px]">{betValue[i]} USD</p>
                    </button>
                  )}
                </div>
                {betAutoState[i] === "auto" ? (
                  <div className="flex justify-between gap-2 items-center min-w-[300px]">
                    <button
                      onClick={() => {
                        if (aviatorState.RemainedAutoPlayCount[i] < 1) {
                          modalAutoPlaySetOpen(true);
                          setAutoPlayingIndex(i);
                        } else {
                          cancelAutoPlay(i);
                          _setEnabledAutoCashOut(false, i);
                          Game_Global_Vars.enabledAutoCashOut[i] = false;
                        }
                      }}
                      className={`flex w-[72px] lg:w-[96px] h-[24px] 3xl:w-[212px] 3xl:h-[48px] rounded-full ${
                        aviatorState.RemainedAutoPlayCount[i] > 0
                          ? "bg-red-700"
                          : "bg-gradient-to-b from-[#07BDE5] to-[#07BDE588]"
                      }   justify-center items-center font-bold border border-[#9FEEFF] text-[10px] lg:text-[12px] uppercase`}
                    >
                      {aviatorState.RemainedAutoPlayCount[i] > 0
                        ? `Stop (${aviatorState.RemainedAutoPlayCount[i]})`
                        : "AutoPlay"}
                    </button>
                    <div className="flex gap-1 items-center">
                      <span className="text-[#939393] min-w-[20px] text-[12px] lg:text-sm text-center">
                        Auto Cash Out
                      </span>
                      <SwitchButton
                        disabled={
                          betPlaceStatus[i] === "success" || pendingBet[i]
                        }
                        checked={enabledAutoCashOut[i]}
                        onChange={(_, checked) => {
                          _setEnabledAutoCashOut(checked, i);
                          Game_Global_Vars.enabledAutoCashOut[i] = checked;
                        }}
                      />
                      <div className="flex gap-1 px-3 py-[2px] rounded-full bg-[#1F1F1F]">
                        <input
                          disabled={!enabledAutoCashOut}
                          readOnly={
                            betPlaceStatus[i] === "success" || pendingBet[i]
                          }
                          type="text"
                          value={autoCashVal[i]}
                          onChange={(e) => {
                            const val =
                              e.target.value.replace(/[^\d.]/g, "").trim() ||
                              "1";
                            _setAutoCashVal(val, i);
                            Game_Global_Vars.autoCashVal[i] = val;
                          }}
                          size={1}
                          className="bg-transparent w-12 outline-none disabled:text-[#888] text-center"
                        />
                        <span
                          className={`inline-block ${
                            enabledAutoCashOut ? "text-white" : "text-[#888]"
                          }`}
                        >
                          x
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="" style={{ width: 10, height: 0 }} />
                )}
              </div>
            ))}
          </div>
          <SnackBar snackState={snackState} setSnackState={setSnackState} />
          <AutoBetModal
            modalOpen={modalAutoPlayOpen}
            modalSetOpen={modalAutoPlaySetOpen}
            autoPlayingIndex={autoPlayingIndex}
          />
        </div>
        <div className="w-full lg:hidden h-full">
          <BetBoard />
        </div>
      </div>
    </div>
  );
};
export default GameBoard;
