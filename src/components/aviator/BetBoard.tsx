import React, { useState, useEffect, useRef } from "react";
import { betBoardAllItemType } from "../../@types";

const GREEN_WIN_BG = "#23391a";
const GREEN_PROGRESS = "#7be22a";
const PURPLE_X = "#a259f7";
const BLUE_X = "#07BDE5";
const DARK_BG = "#18191b";
const ROW_BG = "#141516";
const AVATAR_SIZE = 32;
const PLACEHOLDER_AVATAR =
  "https://api.dicebear.com/7.x/identicon/svg?seed=placeholder";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals = 2) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function getDummyUsers(count: number) {
  const avatars = [
    "https://api.dicebear.com/7.x/identicon/svg?seed=airplane",
    "https://api.dicebear.com/7.x/identicon/svg?seed=robot",
    "https://api.dicebear.com/7.x/identicon/svg?seed=cat",
    "https://api.dicebear.com/7.x/identicon/svg?seed=dog",
    "https://api.dicebear.com/7.x/identicon/svg?seed=fox",
    "https://api.dicebear.com/7.x/identicon/svg?seed=owl",
    "https://api.dicebear.com/7.x/identicon/svg?seed=lion",
    "https://api.dicebear.com/7.x/identicon/svg?seed=monkey",
    "https://api.dicebear.com/7.x/identicon/svg?seed=parrot",
    "https://api.dicebear.com/7.x/identicon/svg?seed=car",
    "https://api.dicebear.com/7.x/identicon/svg?seed=clover",
    "https://api.dicebear.com/7.x/identicon/svg?seed=money",
    "https://api.dicebear.com/7.x/identicon/svg?seed=duck",
    "https://api.dicebear.com/7.x/identicon/svg?seed=mask",
    "https://api.dicebear.com/7.x/identicon/svg?seed=pumpkin",
    "https://api.dicebear.com/7.x/identicon/svg?seed=chips",
    "https://api.dicebear.com/7.x/identicon/svg?seed=grape",
    "https://api.dicebear.com/7.x/identicon/svg?seed=orange",
    "https://api.dicebear.com/7.x/identicon/svg?seed=lemon",
    "https://api.dicebear.com/7.x/identicon/svg?seed=watermelon",
  ];
  const users = [];
  for (let i = 0; i < count; i++) {
    const n = Math.floor(Math.random() * 10);
    const username = `d***${n}`;
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    const betAmount = 100;
    users.push({
      username,
      avatar,
      betAmount,
      isYou: i === 3, // 4th user is 'you'
    });
  }
  return users;
}

// Dummy data for Previous tab
function getDummyPrevious() {
  const roundResult = getRandomFloat(1.5, 3.0, 2);
  const users = [];
  const avatars = [
    "https://api.dicebear.com/7.x/identicon/svg?seed=clover",
    "https://api.dicebear.com/7.x/identicon/svg?seed=owl",
    "https://api.dicebear.com/7.x/identicon/svg?seed=lion",
    "https://api.dicebear.com/7.x/identicon/svg?seed=dog",
    "https://api.dicebear.com/7.x/identicon/svg?seed=cat",
    "https://api.dicebear.com/7.x/identicon/svg?seed=parrot",
    "https://api.dicebear.com/7.x/identicon/svg?seed=chips",
    "https://api.dicebear.com/7.x/identicon/svg?seed=duck",
    "https://api.dicebear.com/7.x/identicon/svg?seed=money",
    "https://api.dicebear.com/7.x/identicon/svg?seed=fox",
    "https://api.dicebear.com/7.x/identicon/svg?seed=mask",
    "https://api.dicebear.com/7.x/identicon/svg?seed=pumpkin",
    "https://api.dicebear.com/7.x/identicon/svg?seed=grape",
    "https://api.dicebear.com/7.x/identicon/svg?seed=orange",
    "https://api.dicebear.com/7.x/identicon/svg?seed=lemon",
    "https://api.dicebear.com/7.x/identicon/svg?seed=watermelon",
    "https://api.dicebear.com/7.x/identicon/svg?seed=airplane",
    "https://api.dicebear.com/7.x/identicon/svg?seed=robot",
  ];
  for (let i = 0; i < 18; ++i) {
    const username = `d***${getRandomInt(1, 9)}`;
    const avatar = avatars[i % avatars.length];
    const betAmount = 100;
    // About 40% are winners
    const isWinner = Math.random() < 0.4;
    const x = isWinner ? getRandomFloat(1.1, roundResult, 2) : undefined;
    const win = isWinner ? +(betAmount * (x || 1)).toFixed(2) : 0;
    users.push({
      username,
      avatar,
      betAmount,
      crashedAt: x,
      cashout: win,
      isWinner,
    });
  }
  return { roundResult, users };
}

// Dummy data for Top tab
function getDummyTop() {
  const avatars = [
    "https://api.dicebear.com/7.x/identicon/svg?seed=lion",
    "https://api.dicebear.com/7.x/identicon/svg?seed=eagle",
    "https://api.dicebear.com/7.x/identicon/svg?seed=raccoon",
    "https://api.dicebear.com/7.x/identicon/svg?seed=tiger",
    "https://api.dicebear.com/7.x/identicon/svg?seed=clover",
    "https://api.dicebear.com/7.x/identicon/svg?seed=gold",
  ];
  const top = [];
  for (let i = 0; i < 6; ++i) {
    top.push({
      username: `d***${getRandomInt(1, 9)}`,
      avatar: avatars[i % avatars.length],
      date: "15.07.25",
      bet: getRandomFloat(0.3, 5, 2),
      win: getRandomFloat(300, 9000, 2),
      result: getRandomFloat(0.8, 4, 2),
      roundMax: getRandomFloat(1000, 8000, 2),
      x: getRandomFloat(1000, 4000, 2),
    });
  }
  return top;
}

const Tab = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    className={`px-6 py-1 rounded-full font-semibold text-sm focus:outline-none transition-all ${
      active ? "bg-[#232325] text-white" : "text-gray-400"
    }`}
    style={{ marginRight: 8, marginLeft: 0 }}
    onClick={onClick}
  >
    {label}
  </button>
);

const BetBoardItem = ({
  username,
  betAmount,
  crashedAt,
  cashout,
  avatar,
  isWinner,
  isYou,
}: any) => {
  return (
    <div
      className={`flex items-center px-2 py-1 mb-[2px] ${
        isWinner ? "rounded-[12px]" : "rounded-[8px]"
      } ${isWinner ? "" : isYou ? "bg-[#232a3a]" : "bg-[#141516]"}`}
      style={{
        background: isWinner ? GREEN_WIN_BG : undefined,
        color: isWinner ? "#fff" : isYou ? "#fff" : "#fff",
        fontWeight: isWinner ? 600 : 500,
      }}
    >
      <img
        alt="avatar"
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        src={avatar}
        onError={(e) => (e.currentTarget.src = PLACEHOLDER_AVATAR)}
        className="rounded-full mr-2 border border-[#232325]"
        style={{ objectFit: "cover" }}
      />
      <span className="w-24 truncate font-medium text-[15px]">{username}</span>
      <span className="w-20 text-right font-inter">{betAmount.toFixed(2)}</span>
      <span
        className="w-16 text-center font-bold text-[16px]"
        style={{
          color: crashedAt ? (crashedAt < 2 ? BLUE_X : PURPLE_X) : "#888",
        }}
      >
        {crashedAt ? (
          <span>
            {crashedAt.toFixed(2)}
            <span style={{ fontWeight: 700 }}>x</span>
          </span>
        ) : (
          "-"
        )}
      </span>
      <span className="w-20 text-right font-inter font-bold">
        {cashout ? cashout.toFixed(2) : "-"}
      </span>
    </div>
  );
};

const BetBoard = () => {
  const [tab, setTab] = useState("All Bets");
  const [users, setUsers] = useState<any[]>([]);
  const [totalBets, setTotalBets] = useState(0);
  const [winnerIndexes, setWinnerIndexes] = useState<number[]>([]);
  const [winnerData, setWinnerData] = useState<{
    [idx: number]: { x: number; win: number };
  } | null>(null);
  const [revealedWinners, setRevealedWinners] = useState<number>(0);
  const [roundActive, setRoundActive] = useState(false);
  const [roundTimerId, setRoundTimerId] = useState<any>(null);

  // Top bar winner count (independent from user list)
  const [topWinners, setTopWinners] = useState(0);
  const [topWinnersTarget, setTopWinnersTarget] = useState(0);
  const [topWinnersInterval, setTopWinnersInterval] = useState<any>(null);
  const [topWinIncrements, setTopWinIncrements] = useState<number[]>([]);
  const [topTotalWin, setTopTotalWin] = useState(0);
  const [topTotalWinInterval, setTopTotalWinInterval] = useState<any>(null);

  // For smooth round end
  const roundEndRef = useRef(false);

  // Start a new round
  const startNewRound = () => {
    roundEndRef.current = false;
    const userCount = getRandomInt(25, 40);
    const newUsers = getDummyUsers(userCount);
    setUsers(newUsers);
    const bets = getRandomInt(1000, 2000);
    setTotalBets(bets);
    // Pick winners and assign their X and win USD
    let winnersToReveal = getRandomInt(
      Math.floor(userCount * 0.3),
      Math.floor(userCount * 0.7)
    );
    let indexes = [...Array(userCount).keys()];
    indexes = indexes.sort(() => Math.random() - 0.5);
    const winIndexes = indexes.slice(0, winnersToReveal);
    const winData: { [idx: number]: { x: number; win: number } } = {};
    for (const idx of winIndexes) {
      const x = getRandomFloat(1.1, 4.0, 2);
      winData[idx] = { x, win: +(100 * x).toFixed(2) };
    }
    setWinnerIndexes(winIndexes);
    setWinnerData(winData);
    setRevealedWinners(0);
    setRoundActive(true);
    // Top bar logic
    setTopWinners(0);
    // Target: 30-60% of total bets
    const target = getRandomInt(Math.floor(bets * 0.3), Math.floor(bets * 0.6));
    setTopWinnersTarget(target);
    // Precompute win increments for smooth total win USD
    const increments: number[] = [];
    let total = 0;
    for (let i = 0; i < target; ++i) {
      // Each win is between $110 and $400
      const win = getRandomFloat(110, 400, 2);
      increments.push(win);
      total += win;
    }
    setTopWinIncrements(increments);
    setTopTotalWin(0);
  };

  // Start new round every 8-15s (simulate natural round duration)
  useEffect(() => {
    startNewRound();
    let roundDuration = getRandomInt(8000, 15000);
    let timerId = setTimeout(function roundLoop() {
      startNewRound();
      roundDuration = getRandomInt(8000, 15000);
      timerId = setTimeout(roundLoop, roundDuration);
    }, roundDuration);
    setRoundTimerId(timerId);
    return () => clearTimeout(timerId);
  }, []);

  // Reveal winners in fast, natural-feeling batches (user list)
  useEffect(() => {
    if (!roundActive || !winnerIndexes.length) return;
    let revealed = 0;
    let stopped = false;
    const batchReveal = () => {
      if (roundEndRef.current) return;
      const batchSize = getRandomInt(3, 6);
      revealed = Math.min(revealed + batchSize, winnerIndexes.length);
      setRevealedWinners(revealed);
      if (revealed < winnerIndexes.length && !roundEndRef.current) {
        setTimeout(batchReveal, getRandomInt(180, 260));
      }
    };
    batchReveal();
    return () => {
      stopped = true;
    };
    // eslint-disable-next-line
  }, [winnerIndexes, roundActive]);

  // Top bar winner count and total win USD animation (super smooth, stops at round end)
  useEffect(() => {
    if (topWinnersInterval) clearTimeout(topWinnersInterval);
    if (topTotalWinInterval) clearTimeout(topTotalWinInterval);
    if (!roundActive) return;
    let current = 0;
    let winSum = 0;
    const animate = () => {
      if (roundEndRef.current) return;
      const increment = getRandomInt(1, 3);
      let next = Math.min(current + increment, topWinnersTarget);
      // For each new winner, add their win to total win USD
      let winAdd = 0;
      for (let i = current; i < next; ++i) {
        winAdd += topWinIncrements[i] || 0;
      }
      winSum += winAdd;
      setTopWinners(next);
      setTopTotalWin(winSum);
      current = next;
      if (current < topWinnersTarget && !roundEndRef.current) {
        setTopWinnersInterval(setTimeout(animate, getRandomInt(60, 120)));
      }
    };
    animate();
    return () => {
      if (topWinnersInterval) clearTimeout(topWinnersInterval);
      if (topTotalWinInterval) clearTimeout(topTotalWinInterval);
    };
    // eslint-disable-next-line
  }, [roundActive, topWinnersTarget, topWinIncrements]);

  // When round ends, stop all animations immediately
  useEffect(() => {
    if (!roundActive) {
      roundEndRef.current = true;
      if (topWinnersInterval) clearTimeout(topWinnersInterval);
      if (topTotalWinInterval) clearTimeout(topTotalWinInterval);
    }
    // eslint-disable-next-line
  }, [roundActive]);

  // Calculate total win for visible user list
  let totalWin = 0;
  if (winnerData) {
    for (let i = 0; i < winnerIndexes.length && i < revealedWinners; ++i) {
      const idx = winnerIndexes[i];
      totalWin += winnerData[idx]?.win || 0;
    }
  }

  // Make Previous and Top tab data static
  const [previous] = useState(() => getDummyPrevious());
  const [top] = useState(() => getDummyTop());

  // Fill vertical space
  return (
    <div
      className="flex flex-col w-full h-full max-w-[480px] mx-auto bg-[#18191b] rounded-2xl shadow-lg p-0"
      style={{ minHeight: "100vh" }}
    >
      {/* Tabs & Summary */}
      <div className="flex flex-col w-full px-4 pt-4 pb-2">
        <div className="flex items-center mb-2">
          <Tab
            label="All Bets"
            active={tab === "All Bets"}
            onClick={() => setTab("All Bets")}
          />
          <Tab
            label="Previous"
            active={tab === "Previous"}
            onClick={() => setTab("Previous")}
          />
          <Tab
            label="Top"
            active={tab === "Top"}
            onClick={() => setTab("Top")}
          />
        </div>
        {/* Avatars, Bets, Win, Progress */}
        {tab === "All Bets" && (
          <div className="flex items-center justify-between w-full bg-[#232325] rounded-xl px-3 py-2 mb-2">
            <div className="flex -space-x-3">
              {users.slice(0, 4).map((u, i) => (
                <img
                  key={i}
                  src={u.avatar}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-[#18191b] bg-[#232325]"
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER_AVATAR)}
                  style={{ zIndex: 10 - i }}
                />
              ))}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[18px] font-bold text-white leading-none">
                {topTotalWin.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xs text-gray-400">Total win USD</span>
            </div>
          </div>
        )}
        {tab === "All Bets" && (
          <div className="flex items-center w-full mb-1">
            <span className="text-[15px] font-bold text-white mr-2">
              {topWinners}/{totalBets} Bets
            </span>
            <div className="flex-1 h-2 rounded-full bg-[#232325] overflow-hidden">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${(topWinners / totalBets) * 100}%`,
                  background: GREEN_PROGRESS,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Table Headings */}
      <div className="flex px-4 py-1 text-xs text-gray-400 font-bold border-b border-gray-700">
        <span className="w-24">Player</span>
        <span className="w-20 text-right">Bet USD</span>
        <span className="w-16 text-center">X</span>
        <span className="w-20 text-right">Win USD</span>
      </div>
      {/* Table Body */}
      <div className="flex-1 flex flex-col gap-[2px] w-full text-[15px] overflow-auto px-4 pb-2">
        {tab === "All Bets" &&
          users.map((item, i) => {
            const isWinner =
              winnerIndexes.indexOf(i) > -1 &&
              winnerIndexes.indexOf(i) < revealedWinners;
            const winnerInfo =
              isWinner && winnerData ? winnerData[i] : undefined;
            return (
              <BetBoardItem
                key={i}
                {...item}
                isWinner={isWinner}
                crashedAt={isWinner && winnerInfo ? winnerInfo.x : undefined}
                cashout={isWinner && winnerInfo ? winnerInfo.win : undefined}
              />
            );
          })}
        {tab === "Previous" && (
          <>
            <div className="w-full text-center py-2">
              <span
                className="text-[28px] font-extrabold"
                style={{ color: PURPLE_X }}
              >
                {previous.roundResult.toFixed(2)}x
              </span>
              <div className="text-xs text-gray-400">Round Result</div>
            </div>
            <div className="flex px-2 py-1 text-xs text-gray-400 font-bold border-b border-gray-700">
              <span className="w-24">Player</span>
              <span className="w-20 text-right">Bet USD</span>
              <span className="w-16 text-center">X</span>
              <span className="w-20 text-right">Win USD</span>
            </div>
            {previous.users.map((item, i) => (
              <BetBoardItem key={i} {...item} />
            ))}
          </>
        )}
        {tab === "Top" && (
          <>
            <div className="flex gap-2 mb-2">
              <button className="px-3 py-1 rounded-full bg-[#232325] text-white font-bold">
                X
              </button>
              <button className="px-3 py-1 rounded-full bg-[#232325] text-gray-400 font-bold">
                Win
              </button>
              <button className="px-3 py-1 rounded-full bg-[#232325] text-gray-400 font-bold">
                Rounds
              </button>
              <button className="px-3 py-1 rounded-full bg-[#232325] text-white font-bold">
                Day
              </button>
              <button className="px-3 py-1 rounded-full bg-[#232325] text-gray-400 font-bold">
                Month
              </button>
              <button className="px-3 py-1 rounded-full bg-[#232325] text-gray-400 font-bold">
                Year
              </button>
            </div>
            {top.map((item, i) => (
              <div
                key={i}
                className="flex items-center bg-[#232325] rounded-xl px-3 py-2 mb-2"
              >
                <img
                  src={item.avatar}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full mr-2 border border-[#18191b]"
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER_AVATAR)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-[15px]">
                      {item.username}
                    </span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <div className="flex gap-4 mt-1">
                    <div className="text-xs text-gray-400">
                      Bet USD
                      <br />
                      <span className="text-white font-bold text-[15px]">
                        {item.bet}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Win USD
                      <br />
                      <span className="text-white font-bold text-[15px]">
                        {item.win.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Result
                      <br />
                      <span
                        className="font-bold text-[15px]"
                        style={{ color: PURPLE_X }}
                      >
                        {item.result}x
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Round max.
                      <br />
                      <span
                        className="font-bold text-[15px]"
                        style={{ color: PURPLE_X }}
                      >
                        {item.roundMax}x
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-2">
                  <span className="text-[13px] text-gray-400">{item.x}x</span>
                  <span className="text-[13px] text-gray-400">💬</span>
                  <span className="text-[13px] text-gray-400">✔️</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400 border-t border-[#232325]">
        <span>Provably Fair Game</span>
        <span>
          Powered by <span className="font-bold text-white">*</span>
        </span>
      </div>
    </div>
  );
};

export default BetBoard;
