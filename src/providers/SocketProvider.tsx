import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { connectCasinoWebSocket } from "../api/universeCasino";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRUb2tlbiI6IlUyRnNkR1ZrWDE5K21vOVJGcTgxK0p3RFg3dTgyeXhIS0xWNmx3NUxUYzlDVXBOcml1THZkSUFMNE5YYlVHb2c2YmU1b0dqbDR0azhWMS81Rllad2hKZkJmaUxmc0puZTNxZmx3cEl6SE1ZdVljUWlta3ZSQjRyVldzNzVJR0ErbFFDT0phSXdTMXRqU2tqWWR6YkU4Vk1ONDVmQVlvUWZkczh4V3dleHp5OGVDU0I1bzc3YnFOMnlsVHRCVDR5YmgxaGFkbUFPWDMvN3pnSjYzUFpicHhVWnNEOEdNNzdGNWtYUU9jYU40M1VqVTBVcVUwdXFsK0NkL3RZTER4ZVVXOFFUTEdza1dockQySUJLUXcvaEJySDZxQm9JajZ1Vk9aRm5vMmlMVXhWaU1hTlpvd3NTTWV1ckwwRVlVL3lmbTgzTnlGS0xaVXZFeXd5a0dncnhXdGxsT2dhMnRDUGx2a1l6REdIWlpFbHZENEprOWxKM1R6dnAxRzRpb1ZpbCIsImlhdCI6MTc1MzgxNjQ2N30.VeN0v2UhdqWjLaZQ8GDLK79EQYxbq_IgEcHWDN9MgxY";

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
  | "connection_status";

// Socket provider context
interface SocketContextType {
  isConnected: boolean;
  isAuthenticated: boolean;
  balance: number;
  marketData: any;
  lastBetResult: any;
  connect: () => void;
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
  const maxReconnectAttempts = 3; // Reduced from 5 to 3
  const isReconnectingRef = useRef(false);

  // Initialize subscribers map
  useEffect(() => {
    const eventTypes: SocketEventType[] = [
      "balance_update",
      "bet_result",
      "market_update",
      "auth_success",
      "auth_failed",
      "connection_status",
    ];

    eventTypes.forEach((type) => {
      if (!subscribersRef.current.has(type)) {
        subscribersRef.current.set(type, new Set());
      }
    });
  }, []);

  // Notify subscribers of an event
  const notifySubscribers = useCallback(
    (eventType: SocketEventType, data: any) => {
      const subscribers = subscribersRef.current.get(eventType);
      if (subscribers) {
        subscribers.forEach((callback) => {
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
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received:", data);

        // Handle different message types based on documentation
        switch (data.type) {
          case "auth_success":
            setIsAuthenticated(true);
            reconnectAttemptsRef.current = 0; // Reset reconnection attempts on successful auth
            notifySubscribers("auth_success", data);
            break;

          case "auth_failed":
            setIsAuthenticated(false);
            // Don't reconnect on auth failure
            if (socketRef.current) {
              socketRef.current.close();
              socketRef.current = null;
            }
            notifySubscribers("auth_failed", data);
            break;

          case "balance_update":
            setBalance(data.balance);
            notifySubscribers("balance_update", data);
            break;

          case "bet_result":
            setLastBetResult(data);
            notifySubscribers("bet_result", data);
            break;

          case "market_update":
            setMarketData(data);
            notifySubscribers("market_update", data);
            break;

          default:
            console.log("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Error parsing socket message:", error);
      }
    },
    [notifySubscribers]
  );

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("Socket already connected");
      return;
    }

    if (isReconnectingRef.current) {
      console.log("Already attempting to reconnect");
      return;
    }

    try {
      isReconnectingRef.current = true;
      socketRef.current = connectCasinoWebSocket();

      socketRef.current.onopen = () => {
        console.log("Socket connected");
        setIsConnected(true);
        setIsAuthenticated(false);
        isReconnectingRef.current = false;
        notifySubscribers("connection_status", { status: "connected" });
        console.log("WebSocket connected");
        // Send authentication
        // socketRef.current?.send(
        //   JSON.stringify({
        //     type: "auth",
        //     token: TOKEN,
        //   })
        // );
      };

      socketRef.current.onmessage = handleMessage;

      setInterval(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current?.send(JSON.stringify({ type: 'ping' }));
        }
    }, 30000);

      socketRef.current.onclose = (event) => {
        console.log("Socket disconnected:", event.code, event.reason);
        setIsConnected(false);
        setIsAuthenticated(false);
        isReconnectingRef.current = false;
        notifySubscribers("connection_status", {
          status: "disconnected",
          code: event.code,
        });

        // Only attempt to reconnect if it's not an auth failure and we haven't exceeded max attempts
        if (
          event.code !== 1000 &&
          event.code !== 1001 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(
            2000 * Math.pow(2, reconnectAttemptsRef.current),
            10000
          );

          console.log(
            `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts}) in ${delay}ms`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          console.log(
            "Max reconnection attempts reached or connection closed normally"
          );
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
  }, [handleMessage, notifySubscribers]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    isReconnectingRef.current = false;
    reconnectAttemptsRef.current = 0;

    if (socketRef.current) {
      socketRef.current.close(1000, "Manual disconnect");
      socketRef.current = null;
    }

    setIsConnected(false);
    setIsAuthenticated(false);
    setBalance(0);
    setMarketData(null);
    setLastBetResult(null);
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message: socket not connected");
    }
  }, []);

  // Subscribe to socket events
  const subscribe = useCallback(
    (eventType: SocketEventType, callback: (data: any) => void) => {
      const subscribers = subscribersRef.current.get(eventType);
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
    []
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

  // Auto-connect on mount
  useEffect(() => {
    connect();

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
