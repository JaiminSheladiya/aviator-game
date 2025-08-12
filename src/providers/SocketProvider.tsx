import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import EncryptDecryptService from "../services/EncryptDecryptService";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRUb2tlbiI6IlUyRnNkR1ZrWDE5K21vOVJGcTgxK0p3RFg3dTgyeXhIS0xWNmx3NUxUYzlDVXBOcml1THZkSUFMNE5YYlVHb2c2YmU1b0dqbDR0azhWMS81Rllad2hKZkJmaUxmc0JuZTNxZmx3cEl6SE1ZdVljUWlta3ZSQjRyVldzNzVJR0ErbFFDT0phSXdTMXRqU2tqWWR6YkU4Vk1ONDVmQVlvUWZkczh4V3dleHp5OGVDU0I1bzc3YnFOMnlsVHRCVDR5YmgxaGFkbUFPWDMvN3pnSjYzUFpicHhVWnNEOEdNNzdGNWtYUU9jYU40M1VqVTBVcVUwdXFsK0NkL3RZTER4ZVVXOFFUTEdza1dockQySUJLUXcvaEJySDZxQm9JajZ1Vk9aRm5vMmlMVXhWaU1hTlpvd3NTTWV1ckwwRVlVL3lmbTgzTnlGS0xaVXZFeXd5a0dncnhXdGxsT2dhMnRDUGx2a1l6REdIWlpFbHZENEprOWxKM1R6dnAxRzRpb1ZpbCIsImlhdCI6MTc1MzgxNjQ2N30.VeN0v2UhdqWjLaZQ8GDLK79EQYxbq_IgEcHWDN9MgxY";

// Types for socket messages
export interface SocketMessage {
  type: string;
  data?: any;
  [key: string]: any;
}

export interface GameState {
  gameId: string;
  status: "waiting" | "playing" | "crashed";
  multiplier: number;
  crashPoint?: number;
  players: Player[];
  timeLeft?: number;
}

export interface Player {
  id: string;
  username: string;
  betAmount: number;
  cashoutMultiplier?: number;
  isWinner?: boolean;
}

// {
//   "betId": "689ae0d34b63cb03c69927f3",
//   "userName": "o********4",
//   "eventId": "88.0022",
//   "eventName": "VIMAAN",
//   "roundId": "1243261",
//   "oddsRate": 0,
//   "cashOut": 0,
//   "nation": "PLACED",
//   "stake": 100,
//   "createdAt": "2025-08-12T06:36:03.039Z"
// }

// {
//   "cashOut": 113,
//   "nation": "CASHOUT",
//   "oddsRate": 1.13,
//   "betId": "689ae0f70fefc803fc2dccaf"
// }
export enum Status {
  PLACED = "PLACED",
  CASHOUT = "CASHOUT",
}
export type BetStatus = Status.PLACED | Status.CASHOUT;
export interface Bet {
  betId: string;
  oddsRate: number;
  cashOut: number;
  nation: BetStatus;
  userName?: string;
  eventId?: string;
  eventName?: string;
  roundId?: string;
  stake?: string;
  createdAt?: string;
}

export interface BetResult {
  betId: string;
  status: "pending" | "placed" | "cashed_out" | "lost";
  amount: number;
  multiplier?: number;
  profit?: number;
}

// Socket event types
export type SocketEventType =
  | "balance_update"
  | "bet_result"
  | "market_update"
  | "auth_success"
  | "auth_failed"
  | "connection_status"
  | "game_update";

export enum GameStages {
  WAIT = "WAIT",
  RUN = "RUN",
  BLAST = "BLAST",
}
export type GameStatus = GameStages.WAIT | GameStages.RUN | GameStages.BLAST;

export type GameData = {
  status?: GameStatus;
  startsIn?: number;
  multiplier?: number;
};

// Socket provider context
interface SocketContextType {
  isConnected: boolean;
  isAuthenticated: boolean;
  balance: number;
  marketData: any;
  lastBetResult: any;
  connect: (url?: string, messageToSocket?: any) => void;
  disconnect: () => void;
  sendMessage: (message: any) => void;
  subscribe: (
    eventType: SocketEventType,
    callback: (data: any) => void
  ) => () => void;
  unsubscribe: (
    eventType: SocketEventType,
    callback: (data: any) => void
  ) => void;
  needToSendPrevious: () => boolean;
  encryptionState: {
    hasKeyPair: boolean;
    hasServerKey: boolean;
    hasEncryptionKey: boolean;
  };
  getMarketData: () => {
    subscribe: (callback: (data: any) => void) => () => void;
  };
  gameData: GameData;
  // countdownSeconds: number;
  bets: Bet[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Socket Provider Component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(0);
  const [marketData, setMarketData] = useState(null);
  const [lastBetResult, setLastBetResult] = useState(null);

  const socketRef = useRef<WebSocket | null>(null);
  const subscribersRef = useRef<Map<SocketEventType, Set<(data: any) => void>>>(
    new Map()
  );
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 1000; // Increased like Angular service
  const reconnectInterval = 5000; // 5 seconds like Angular service
  const isReconnectingRef = useRef(false);
  const isAttemptRef = useRef(false);
  const previousMsgRef = useRef<any>(null);
  const urlRef = useRef<string>(
    `wss://universeexchapi.com/universe_casino_88?token=${TOKEN}`
  );
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const encryptDecryptServiceRef = useRef<EncryptDecryptService>(
    new EncryptDecryptService()
  );
  const [gameData, setGameData] = useState<GameData>({});
  const [bets, setBets] = useState<Bet[]>([]);

  // Initialize subscribers map
  useEffect(() => {
    const eventTypes: SocketEventType[] = [
      "balance_update",
      "bet_result",
      "market_update",
      "auth_success",
      "auth_failed",
      "connection_status",
      "game_update",
    ];

    eventTypes.forEach((type) => {
      // console.log(
      //   "subscribersRef.current.has(type)",
      //   subscribersRef.current.has(type)
      // );

      if (!subscribersRef.current.has(type)) {
        subscribersRef.current.set(type, new Set());
      }
    });

    // Initialize getMessageFromSocket functionality
    encryptDecryptServiceRef.current.getMessageFromSocket();
  }, []);

  // Notify subscribers of an event
  const notifySubscribers = useCallback(
    (eventType: SocketEventType, data: any) => {
      const subscribers = subscribersRef.current.get(eventType);
      // console.log("subscribers", eventType, data?.data, data, subscribers);

      if (subscribers) {
        // console.log("subscribers into if");

        subscribers.forEach((callback) => {
          // console.log("subscribers into foreach");
          try {
            callback(data);
          } catch (error) {
            console.error(
              `Error in socket subscriber for ${eventType}:`,
              error
            );
          }
        });
      }
    },
    []
  );

  // Handle incoming messages
  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      try {
        // Process message through encryption service
        const processedData =
          await encryptDecryptServiceRef.current.processMessage(
            event.data,
            socketRef.current
          );
        // console.log("processedData", processedData);

        // Handle user_count updates from socket messages
        // if (processedData.user_count !== undefined) {
        //   // Emit custom event for Redux connector to catch
        //   window.dispatchEvent(
        //     new CustomEvent("socketUserCountUpdate", {
        //       detail: { userCount: processedData.user_count },
        //     })
        //   );
        // }

        if (!processedData) {
          return;
        }
        // console.log(
        //   "processedData.type",
        //   processedData.type,
        //   Array.isArray(processedData)
        // );

        const emitEvent = (processedData: any) => {
          // console.log(
          //   "processedData",
          //   processedData?.data?.nation,
          //   processedData.data,
          //   processedData
          // );

          switch (processedData.type) {
            case "auth_success":
              setIsAuthenticated(true);
              reconnectAttemptsRef.current = 0; // Reset reconnection attempts on successful auth
              notifySubscribers("auth_success", processedData);
              break;

            case "auth_failed":
              setIsAuthenticated(false);
              // Don't reconnect on auth failure
              if (socketRef.current) {
                socketRef.current.close(1000, "Auth failed");
                socketRef.current = null;
              }
              notifySubscribers("auth_failed", processedData);
              break;

            case "balance_update":
              setBalance(processedData.balance);
              notifySubscribers("balance_update", processedData);
              break;

            case "bet_result":
              setLastBetResult(processedData);
              notifySubscribers("bet_result", processedData);
              break;

            // case "market_update":
            //   setMarketData(processedData);
            //   notifySubscribers("market_update", processedData);
            //   break;

            case "1":
              const data = processedData.data;
              if (!data) {
                return;
              }
              const { multiplier, seconds, status, nation } = data;
              if (multiplier) {
                // notifySubscribers("game_update", processedData);
                setGameData((cur) => ({
                  ...cur,
                  multiplier,
                }));
              }
              if (seconds) {
                // notifySubscribers("game_update", processedData);
                setGameData((cur) => ({
                  ...cur,
                  startsIn: seconds,
                }));
              }

              // MARKET UPDATE on status
              if (nation) {
                // nation - CASHOUT, PLACED
                // notifySubscribers("market_update", processedData);
                setBets((cur) => {
                  const bets = [...cur];
                  if (nation === Status.PLACED) {
                    bets.push(data);
                  }
                  if (nation === Status.CASHOUT) {
                    const index = bets.findIndex(
                      (bet) => bet.betId === data.betId
                    );
                    if (index > -1) {
                      bets[index] = { ...bets[index], ...data };
                    }
                  }
                  return bets;
                });
              }
              if (status) {
                // status - RUN, BLAST
                // console.log("statusstatusstatus", status);

                // update game data
                setGameData((cur) => ({
                  ...cur,
                  status,
                }));
              }

              // setMarketData(processedData);
              // notifySubscribers("market_update", processedData);
              break;

            case "3":
              // user count
              // setMarketData(processedData);
              // notifySubscribers("market_update", processedData);

              break;

            default:
            // For game data like multiplier updates, notify subscribers
            // if (processedData.data && processedData.data.multiplier) {
            //   notifySubscribers("game_update", processedData);
            // } else {
            //   console.log(
            //     "subscribers else",
            //     processedData?.data?.nation,
            //     processedData.data,
            //     processedData
            //   );
            // }
          }
        };

        if (Array.isArray(processedData)) {
          for (let i = 0; i < processedData.length; i++) {
            const element = processedData[i];
            // console.log("element", element);

            emitEvent(element);
          }
        } else {
          emitEvent(processedData);
        }

        // Handle different message types based on documentation
      } catch (error) {
        console.error("Error parsing socket message:", error);
      }
    },
    [notifySubscribers]
  );

  // Start ping interval
  const startPing = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    pingIntervalRef.current = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 60000); // Send ping every 1 minute like Angular service
  }, []);

  // Stop ping interval
  const stopPing = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(
    async (url?: string, messageToSocket?: any) => {
      if (url) {
        urlRef.current = url;
      }
      console.log("url", url);

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      if (isReconnectingRef.current) {
        return;
      }
      console.log("isReconnectingRef.current", isReconnectingRef.current);

      try {
        isReconnectingRef.current = true;

        // If messageToSocket is provided, use encryption service

        if (messageToSocket) {
          const encryptedUrl =
            await encryptDecryptServiceRef.current.generateEncryptionKey(
              "casino",
              messageToSocket
            );

          socketRef.current = new WebSocket(encryptedUrl);
        } else {
          socketRef.current = new WebSocket(urlRef.current);
        }

        socketRef.current.onopen = () => {
          setIsConnected(true);
          setIsAuthenticated(false);
          isReconnectingRef.current = false;
          isAttemptRef.current = true;
          notifySubscribers("connection_status", { status: "connected" });

          // Start ping
          // startPing();

          // Send previous message if exists
          setTimeout(() => {
            if (socketRef.current && isAttemptRef.current) {
              if (
                previousMsgRef.current == null ||
                previousMsgRef.current == undefined
              ) {
                previousMsgRef.current = { type: "2", id: "" };
              }
            }
          }, 1000);
        };

        socketRef.current.onmessage = handleMessage;

        socketRef.current.onclose = (event) => {
          setIsConnected(false);
          setIsAuthenticated(false);
          isReconnectingRef.current = false;
          isAttemptRef.current = false;
          stopPing();
          notifySubscribers("connection_status", {
            status: "disconnected",
            code: event.code,
          });

          // Send authentication if not using encryption
          // if (!messageToSocket) {
          //   socketRef.current?.send(
          //     JSON.stringify({
          //       type: "auth",
          //       token: TOKEN,
          //     })
          //   );
          // }

          // Reconnect logic like Angular service
          try {
            reconnect();
          } catch (error) {
            reconnect();
          }
        };

        socketRef.current.onerror = (error) => {
          console.error("Socket error:", error);
          isReconnectingRef.current = false;
          notifySubscribers("connection_status", { status: "error", error });
        };
      } catch (error) {
        console.error("Error connecting to socket:", error);
        isReconnectingRef.current = false;
      }
    },
    [handleMessage, notifySubscribers, startPing, stopPing]
  );

  // Reconnect function like Angular service
  const reconnect = useCallback(() => {
    if (!isReconnectingRef.current) {
      isReconnectingRef.current = true;
      reconnectAttemptsRef.current++;

      if (reconnectAttemptsRef.current <= maxReconnectAttempts) {
        setTimeout(() => {
          console.log(
            `WebSocket reconnecting... (attempt ${reconnectAttemptsRef.current} of ${maxReconnectAttempts})`
          );
          isAttemptRef.current = true;
          connect("", {
            type: "1",
            id: "88.0022",
          });
        }, reconnectInterval);
      } else {
        console.error(
          "WebSocket connection failed after maximum reconnect attempts"
        );
      }
    }
  }, [connect]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopPing();
    isReconnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
    isAttemptRef.current = false;

    // Close encryption service
    encryptDecryptServiceRef.current.closeExistingSocket();

    if (socketRef.current) {
      socketRef.current.close(1000, "Manual disconnect");
      socketRef.current = null;
    }

    setIsConnected(false);
    setIsAuthenticated(false);
    setBalance(0);
    setMarketData(null);
    setLastBetResult(null);
  }, [stopPing]);

  // Send message through WebSocket
  const sendMessage = useCallback((message: any) => {
    isAttemptRef.current = false;
    previousMsgRef.current = message;

    let messageToSend: string;

    // Check if encryption is available
    const encryptionState =
      encryptDecryptServiceRef.current.getEncryptionState();
    if (encryptionState.hasEncryptionKey) {
      // Send encrypted message
      messageToSend =
        encryptDecryptServiceRef.current.sendMessageToSocket(message);
    } else {
      // Send plain JSON message
      messageToSend = JSON.stringify(message);
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(messageToSend);
    }

    socketRef.current!.onopen = () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(messageToSend);
      } else {
        try {
          socketRef.current?.send(messageToSend);
        } catch (error) {
          setTimeout(() => {
            socketRef.current?.send(messageToSend);
          }, 1000);
        }
      }
    };
  }, []);

  // Check if need to send previous message
  const needToSendPrevious = useCallback(() => {
    return !!(socketRef.current && isAttemptRef.current);
  }, []);

  // Subscribe to socket events
  const subscribe = useCallback(
    (eventType: SocketEventType, callback: (data: any) => void) => {
      // console.log("eventType", eventType);

      const subscribers = subscribersRef.current.get(eventType);
      // console.log("eventType subscribers", subscribers);
      if (subscribers) {
        subscribers.add(callback);
      }

      // Return unsubscribe function
      return () => {
        const subscribers = subscribersRef.current.get(eventType);
        if (subscribers) {
          subscribers.delete(callback);
        }
      };
    },
    [subscribersRef.current]
  );

  // Unsubscribe from socket events
  const unsubscribe = useCallback(
    (eventType: SocketEventType, callback: (data: any) => void) => {
      const subscribers = subscribersRef.current.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
      }
    },
    []
  );

  // Get market data (similar to Angular service)
  const getMarketData = useCallback(() => {
    return encryptDecryptServiceRef.current.getMarketData();
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect("", {
      type: "1",
      id: "88.0022",
    });

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const value: SocketContextType = {
    isConnected,
    isAuthenticated,
    balance,
    marketData,
    lastBetResult,
    connect,
    disconnect,
    sendMessage,
    subscribe,
    unsubscribe,
    needToSendPrevious,
    encryptionState: encryptDecryptServiceRef.current.getEncryptionState(),
    getMarketData,
    gameData,
    bets,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

// Hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Hook for specific socket events
export const useSocketEvent = (
  eventType: SocketEventType,
  callback: (data: any) => void
) => {
  // console.log("useSocketEvent");

  const { subscribe, unsubscribe } = useSocket();

  useEffect(() => {
    const unsubscribeFn = subscribe(eventType, callback);
    return () => {
      unsubscribeFn();
      unsubscribe(eventType, callback);
    };
  }, [eventType, callback, subscribe, unsubscribe]);
};

export default SocketProvider;
