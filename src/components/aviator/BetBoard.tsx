import React, { useState, useEffect, useRef } from "react";
import { getHistoryItemColor } from "../../utils";
import { useSocket } from "../../providers/SocketProvider";

const GREEN_WIN_BG = "#23391a";
const GREEN_PROGRESS = "#427f00";
const PURPLE_X = "#a259f7";
const BLUE_X = "#07BDE5";
const AVATAR_SIZE = 24;
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
  const users = [];
  for (let i = 0; i < count; i++) {
    const avatarIndex = Math.floor(Math.random() * 72) + 1;
    const avatar = `/avatars/av-${avatarIndex}.png`;
    const username = `d***${Math.floor(Math.random() * 10)}`;
    const betAmount = 150;

    users.push({
      username,
      avatar,
      betAmount,
      isYou: i === 3, // 4th user is 'you'
    });
  }
  return users;
}

function getDummyPrevious() {
  const roundResult = getRandomFloat(1.5, 3.0, 2);
  const users = [];

  for (let i = 0; i < 18; ++i) {
    const username = `d***${getRandomInt(1, 9)}`;
    const avatarIndex = Math.floor(Math.random() * 72) + 1; // 1 to 72
    const avatar = `/avatars/av-${avatarIndex}.png`; // served from /public/avatars

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

function getDummyTop() {
  const top = [];
  for (let i = 0; i < 32; ++i) {
    top.push({
      username: `d***${getRandomInt(1, 9)}`,
      avatar: `/avatars/av-${getRandomInt(1, 72)}.png`,
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
  rounded,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  rounded: boolean;
}) => (
  <button
    className={`px-6 rounded-${
      rounded ? "full" : "md"
    } focus:outline-none m-1 w-[100%] transition-all ${
      active ? "bg-[#2c2d30] text-gray-400" : "text-gray-400"
    }`}
    style={
      rounded
        ? { paddingBlock: "0.15rem" }
        : {
            paddingBlock: "0.4rem",
            borderRadius: "12px",
            paddingInline: "0.5rem",
            fontSize: "12px",
            fontWeight: "500",
            lineHeight: "1.5",
            marginBlock: "0.1rem",
          }
    }
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
      className={`flex items-center py-1 mb-[2px] rounded-[32px] ${
        isWinner ? "" : isYou ? "bg-[#232a3a]" : "bg-[#141516]"
      }`}
      style={{
        background: isWinner ? GREEN_WIN_BG : undefined,
        color: isWinner ? "#bbbfc5" : isYou ? "#bbbfc5" : "#bbbfc5",
      }}
    >
      <img
        alt="avatar"
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        src={avatar}
        onError={(e) => (e.currentTarget.src = PLACEHOLDER_AVATAR)}
        className="rounded-full mr-2 ml-1 border border-[#232325]"
        style={{ objectFit: "cover" }}
      />
      <span className="w-20 truncate text-[12]">{username}</span>
      <span className="w-[4.5rem] text-right font-inter">
        {betAmount.toFixed(2)}
      </span>
      <span
        className="w-16 text-center text-[12px]"
        style={{
          color: crashedAt ? (crashedAt < 2 ? BLUE_X : PURPLE_X) : "#888",
        }}
      >
        {crashedAt ? (
          <span>
            {crashedAt.toFixed(2)}
            <span>x</span>
          </span>
        ) : (
          "-"
        )}
      </span>
      <span className="w-20 text-right font-inter">
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
  const [topTab, setTopTab] = useState("X");
  const [topTabFilter, setTopTabFilter] = useState("Day");

  const { bets } = useSocket();

  // Convert socket bets to user format
  const convertBetsToUsers = (socketBets: any[]) => {
    return socketBets.map((bet, index) => {
      return {
        username: bet.userName,
        avatar: bet.avatar, // Use avatar from socket data
        betAmount: bet.stake,
        betId: bet.betId,
        eventId: bet.eventId,
        roundId: bet.roundId,
        nation: bet.nation,
        createdAt: bet.createdAt,
        oddsRate: bet.oddsRate,
        cashOut: bet.cashOut,
        isYou: false, // You can set this based on your user logic
      };
    });
  };

  // Update users and calculate winners whenever bets change
  useEffect(() => {
    if (bets && bets.length > 0) {
      const convertedUsers = convertBetsToUsers(bets);
      setUsers(convertedUsers);
      setTotalBets(bets.length);

      // Find actual winners (users who cashed out)
      const actualWinners = bets.filter((bet) => bet.nation === "CASHOUT");
      const winnerIndexes = actualWinners.map((winner) =>
        bets.findIndex((bet) => bet.betId === winner.betId)
      );

      // Create winner data from actual cashout information
      const winData: { [idx: number]: { x: number; win: number } } = {};
      actualWinners.forEach((winner, index) => {
        const betIndex = winnerIndexes[index];
        if (betIndex !== -1) {
          winData[betIndex] = {
            x: winner.oddsRate,
            win: winner.cashOut,
          };
        }
      });

      setWinnerIndexes(winnerIndexes);
      setWinnerData(winData);
      setRevealedWinners(actualWinners.length); // All winners are already revealed
    }
  }, [bets]);

  // Calculate total win from actual cashout data
  const actualTotalWin = bets
    .filter((bet) => bet.nation === "CASHOUT")
    .reduce((sum, bet) => sum + (bet.cashOut || 0), 0);

  // Calculate actual winner count from live data
  const actualWinnerCount = bets.filter(
    (bet) => bet.nation === "CASHOUT"
  ).length;

  // Make Previous and Top tab data static
  const [previous] = useState(() => getDummyPrevious());
  const [top] = useState(() => getDummyTop());

  // Fill vertical space
  return (
    <div
      className="flex flex-col w-full h-full lg:max-w-[480px] mx-auto bg-[#1b1c1d] rounded-2xl shadow-lg p-0 mt-1"
      style={{ maxHeight: "100vh" }}
    >
      <div className="flex flex-col w-full px-2 pt-2 pb-2">
        <div
          className="flex items-center mb-1 bg-[#141516] rounded-full "
          style={{ fontSize: "12px" }}
        >
          <Tab
            label="All Bets"
            active={tab === "All Bets"}
            onClick={() => setTab("All Bets")}
            rounded
          />
          <Tab
            label="Previous"
            active={tab === "Previous"}
            onClick={() => setTab("Previous")}
            rounded
          />
          <Tab
            label="Top"
            active={tab === "Top"}
            onClick={() => setTab("Top")}
            rounded
          />
        </div>
        {tab === "All Bets" && (
          <div className="bg-[#141516] px-3 py-1 rounded-xl">
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex -space-x-2">
                {users.slice(0, 3).map((u, i) => (
                  <img
                    key={u.betId || i}
                    src={u.avatar}
                    alt="avatar"
                    width={24}
                    height={24}
                    className="rounded-full border border-[#28a90a] bg-[#232325]"
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER_AVATAR)}
                    style={{ zIndex: 10 - i }}
                  />
                ))}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[16px] text-white leading-none">
                  {actualTotalWin.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 justify-between mb-1">
              <div className="text-[12px] text-white">
                {actualWinnerCount}/{totalBets}{" "}
                <span className="text-[#7b7b7b]"> Bets</span>
              </div>
              <div className="text-[12px] font-normal leading-[100%] align-middle text-[#7b7b7b]">
                Total win USD
              </div>
            </div>
            <div className="flex items-center w-full mb-1">
              <div className="flex-1 h-2 rounded-full bg-[#232325] overflow-hidden flex items-center">
                <div
                  className="h-1 rounded-full"
                  style={{
                    width: `${(actualWinnerCount / totalBets) * 100}%`,
                    background: GREEN_PROGRESS,
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {tab === "Previous" && (
          <>
            <div className="w-full text-center py-2 bg-[#141516] rounded-xl">
              <div className="text-xs text-gray-400">Round Result</div>
              <span
                className="text-[28px] font-extrabold"
                style={{
                  color: getHistoryItemColor(previous.roundResult.toFixed(2)),
                }}
              >
                {previous.roundResult.toFixed(2)}x
              </span>
            </div>
            <div className="flex px-4 py-1 mt-2 text-gray-400 text-[10px] mb-1">
              <span className="w-20">Player</span>
              <span className="w-24 text-right">Bet USD</span>
              <span className="w-20 text-center">X</span>
              <span className="w-20 text-right">Win USD</span>
            </div>
            <div
              className="flex-1 flex flex-col gap-[2px] w-full text-[12px] overflow-auto px-2 pb-2"
              style={{ maxHeight: "calc(100vh - 200px)" }}
              // style={{ border: "1px solid red" }}
            >
              {previous.users.map((item, i) => (
                <BetBoardItem key={i} {...item} />
              ))}
            </div>
          </>
        )}
        {tab === "Top" && (
          <div className="bg-[#141516] rounded-xl text-[12px]">
            <div className="flex ">
              <Tab
                label="X"
                active={topTab === "X"}
                onClick={() => setTopTab("X")}
                rounded={false}
              />
              <Tab
                label="Win"
                active={topTab === "Win"}
                onClick={() => setTopTab("Win")}
                rounded={false}
              />
              <Tab
                label="Rounds"
                active={topTab === "Rounds"}
                onClick={() => setTopTab("Rounds")}
                rounded={false}
              />
            </div>
            <div className="flex">
              <Tab
                label="Day"
                active={topTabFilter === "Day"}
                onClick={() => setTopTabFilter("Day")}
                rounded={false}
              />
              <Tab
                label="Month"
                active={topTabFilter === "Month"}
                onClick={() => setTopTabFilter("Month")}
                rounded={false}
              />
              <Tab
                label="Year"
                active={topTabFilter === "Year"}
                onClick={() => setTopTabFilter("Year")}
                rounded={false}
              />
            </div>
          </div>
        )}
      </div>
      <>
        {tab === "All Bets" && (
          <div className="flex px-4 py-1 text-gray-400 text-[10px] mb-1">
            <span className="w-20">Player</span>
            <span className="w-24 text-right">Bet USD</span>
            <span className="w-20 text-center">X</span>
            <span className="w-20 text-right">Win USD</span>
          </div>
        )}
      </>
      <div className="flex-1 flex flex-col gap-[2px] w-full text-[12px] overflow-auto px-2 pb-2">
        {tab === "All Bets" &&
          users.map((item, i) => {
            // Check if user has cashed out based on actual data
            const isWinner = item.nation === "CASHOUT";

            return (
              <BetBoardItem
                key={item.betId || i} // Use betId as key for better React performance
                {...item}
                isWinner={isWinner}
                crashedAt={isWinner ? item.oddsRate : undefined}
                cashout={isWinner ? item.cashOut : undefined}
              />
            );
          })}

        {tab === "Top" && (
          <>
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
                    <span className="font-bold text-white text-[12px]">
                      {item.username}
                    </span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <div className="flex gap-4 mt-1">
                    <div className="text-xs text-gray-400">
                      Bet USD
                      <br />
                      <span className="text-white text-[12px]">{item.bet}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Win USD
                      <br />
                      <span className="text-white text-[12px]">
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
                        className="font-bold text-[12px]"
                        style={{ color: PURPLE_X }}
                      >
                        {item.result}x
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Round max.
                      <br />
                      <span
                        className="font-bold text-[12px]"
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
