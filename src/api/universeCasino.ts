import axios from "axios";

const API_BASE = "/casinoapp/exchange";
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
let socket: any = null;

export function connectCasinoWebSocket() {
  // onMessage: (data: any) => void
  socket = new WebSocket(
    "wss://universeexchapi.com/universe_casino_8822?token=" +
      encodeURIComponent(TOKEN)
  );
  console.log("Connecting to WebSocket...");

  // Try with token as query parameter first

  socket.onopen = () => {
    console.log("WebSocket connected, trying auth...");

    // Try different auth message formats
    const authAttempts = [
      { type: "auth", token: TOKEN },
      { type: "auth", jwt: TOKEN },
      { type: "auth", authorization: `Bearer ${TOKEN}` },
      { type: "auth", accessToken: TOKEN },
    ];

    console.log("Trying auth format 1:", authAttempts[0]);
    socket.send(JSON.stringify(authAttempts[0]));

    // If first fails, try others after a delay
    setTimeout(() => {
      console.log("Trying auth format 2:", authAttempts[1]);
      socket.send(JSON.stringify(authAttempts[1]));
    }, 2000);

    setTimeout(() => {
      console.log("Trying auth format 3:", authAttempts[2]);
      socket.send(JSON.stringify(authAttempts[2]));
    }, 4000);
  };

  socket.onmessage = (event: any) => {
    console.log("Raw WebSocket message:", event.data);
    try {
      const data = JSON.parse(event.data);
      console.log("Parsed WebSocket message:", data);
      // onMessage(data);
    } catch (e) {
      console.error("WebSocket message parse error:", e);
    }
  };

  socket.onerror = (error: any) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = (event: any) => {
    console.log("WebSocket disconnected:", event.code, event.reason);
    console.log("Close event details:", event);
  };

  return socket;
}

export function disconnectSocket() {
  
}
