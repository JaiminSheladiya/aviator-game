import axios from "axios";

const API_BASE = "/api/casinoapp/exchange";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRUb2tlbiI6IlUyRnNkR1ZrWDE5K21vOVJGcTgxK0p3RFg3dTgyeXhIS0xWNmx3NUxUYzlDVXBOcml1THZkSUFMNE5YYlVHb2c2YmU1b0dqbDR0azhWMS81Rllad2hKZkJmaUxmc0puZTNxZmx3cEl6SE1ZdVljUWlta3ZSQjRyVldzNzVJR0ErbFFDT0phSXdTMXRqU2tqWWR6YkU4Vk1ONDVmQVlvUWZkczh4V3dleHp5OGVDU0I1bzc3YnFOMnlsVHRCVDR5YmgxaGFkbUFPWDMvN3pnSjYzUFpicHhVWnNEOEdNNzdGNWtYUU9jYU40M1VqVTBVcVUwdXFsK0NkL3RZTER4ZVVXOFFUTEdza1dockQySUJLUXcvaEJySDZxQm9JajZ1Vk9aRm5vMmlMVXhWaU1hTlpvd3NTTWV1ckwwRVlVL3lmbTgzTnlGS0xaVXZFeXd5a0dncnhXdGxsT2dhMnRDUGx2a1l6REdIWlpFbHZENEprOWxKM1R6dnAxRzRpb1ZpbCIsImlhdCI6MTc1MzgxNjQ2N30.VeN0v2UhdqWjLaZQ8GDLK79EQYxbq_IgEcHWDN9MgxY";

// Check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Token payload:", payload);
    console.log("Token issued at:", new Date(payload.iat * 1000));
    console.log("Current time:", new Date(currentTime * 1000));
    return payload.iat + 24 * 60 * 60 < currentTime; // Assume 24h expiry
  } catch (e) {
    console.error("Error parsing token:", e);
    return true;
  }
}

// Log token status
console.log("Token expired:", isTokenExpired(TOKEN));

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

export async function getUserBalance() {
  const response = await axios.post(
    `${API_BASE}/users/balance/getUserBalance`,
    {},
    { headers }
  );
  return response.data?.data?.bankBalance ?? 0;
}

// Types for placeBet
export type Bet = {
  stake: number;
  cashIn: number;
};
// Types for cashout
export type Cashout = {
  betId: string | null;
  cashOutAtMultiplier: number;
};

export type PlaceBetResponse = {
  status: string;
  betId?: string;
  totalStake?: number;
  betsPlaced?: number;
  remainingBalance?: number;
  [key: string]: any;
};

export async function placeBet(
  marketId: string,
  eventId: string,
  bets: Bet[]
): Promise<PlaceBetResponse> {
  const response = await axios.post(
    `${API_BASE}/users/casino/placebet`,
    { marketId, eventId, bets },
    { headers }
  );
  return response.data;
}

export async function cashout(
  marketId: string,
  eventId: string,
  bets: Cashout[]
): Promise<PlaceBetResponse> {
  const response = await axios.post(
    `${API_BASE}/users/casino/cashOut`,
    { marketId, eventId, bets },
    { headers }
  );
  return response.data;
}

export function connectCasinoWebSocket(): WebSocket {
  const socket = new WebSocket(
    "wss://universeexchapi.com/universe_casino_8822?token=" +
      encodeURIComponent(TOKEN)
  );

  socket.onopen = function (event) {
    console.log("WebSocket connected");

    // Send authentication
    socket.send(
      JSON.stringify({
        type: "auth",
        token: TOKEN,
      })
    );
  };

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received:", data);

    // Handle different message types
    switch (data.type) {
      case "balance_update":
        console.log("Balance updated:", data.balance);
        break;
      case "bet_result":
        console.log("Bet result:", data);
        break;
      case "market_update":
        console.log("Market update:", data);
        break;
      default:
        console.log("Unknown message type:", data.type);
    }
  };

  socket.onerror = (error: any) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = (event: any) => {
    console.log("WebSocket disconnected:", event.code, event.reason);
  };

  return socket;
}
