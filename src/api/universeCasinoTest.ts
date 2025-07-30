import axios from "axios";

const API_BASE = "https://universeexchapi.com/casinoapp/exchange";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRUb2tlbiI6IlUyRnNkR1ZrWDE5K21vOVJGcTgxK0p3RFg3dTgyeXhIS0xWNmx3NUxUYzlDVXBOcml1THZkSUFMNE5YYlVHb2c2YmU1b0dqbDR0azhWMS81Rllad2hKZkJmaUxmc0puZTNxZmx3cEl6SE1ZdVljUWlta3ZSQjRyVldzNzVJR0ErbFFDT0phSXdTMXRqU2tqWWR6YkU4Vk1ONDVmQVlvUWZkczh4V3dleHp5OGVDU0I1bzc3YnFOMnlsVHRCVDR5YmgxaGFkbUFPWDMvN3pnSjYzUFpicHhVWnNEOEdNNzdGNWtYUU9jYU40M1VqVTBVcVUwdXFsK0NkL3RZTER4ZVVXOFFUTEdza1dockQySUJLUXcvaEJySDZxQm9JajZ1Vk9aRm5vMmlMVXhWaU1hTlpvd3NTTWV1ckwwRVlVL3lmbTgzTnlGS0xaVXZFeXd5a0dncnhXdGxsT2dhMnRDUGx2a1l6REdIWlpFbHZENEprOWxKM1R6dnAxRzRpb1ZpbCIsImlhdCI6MTc1MzgxNjQ2N30.VeN0v2UhdqWjLaZQ8GDLK79EQYxbq_IgEcHWDN9MgxY";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function getUserBalance() {
  try {
    const response = await axios.post(
      `${API_BASE}/users/balance/getUserBalance`,
      {},
      { headers }
    );
    console.log("User Balance Response:", response.data);
  } catch (error: any) {
    if (error.response) {
      console.error("User Balance Error:", error.response.data);
    } else {
      console.error("User Balance Error:", error.message);
    }
  }
}

async function placeBet() {
  try {
    const data = {
      marketId: "1183125",
      eventId: "88.0022",
      bets: [
        { stake: 10, cashIn: 1 },
        { stake: 10, cashIn: 2 },
        { stake: 10, cashIn: 3 },
      ],
    };
    const response = await axios.post(
      `${API_BASE}/users/casino/placebet`,
      data,
      { headers }
    );
    console.log("Place Bet Response:", response.data);
  } catch (error: any) {
    if (error.response) {
      console.error("Place Bet Error:", error.response.data);
    } else {
      console.error("Place Bet Error:", error.message);
    }
  }
}

async function main() {
  await getUserBalance();
  await placeBet();
}

main();
