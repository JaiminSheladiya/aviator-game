import React, { useEffect, useState } from 'react';
import { useSocket, useSocketEvent } from '../providers/SocketProvider';

const SocketExample: React.FC = () => {
  const { 
    isConnected, 
    isAuthenticated, 
    balance,
    marketData,
    lastBetResult,
    sendMessage,
    connect,
    disconnect 
  } = useSocket();

  // Listen to balance updates
  useSocketEvent('balance_update', (data) => {
    console.log('Balance updated:', data.balance);
  });

  // Listen to bet results
  useSocketEvent('bet_result', (data) => {
    console.log('Bet result received:', data);
  });

  // Listen to market updates
  // useSocketEvent('market_update', (data) => {
  //   console.log('Market update received:', data);
  // });

  // Listen to connection status
  useSocketEvent('connection_status', (data) => {
    console.log('Connection status:', data.status);
  });

  // Listen to auth success/failure
  useSocketEvent('auth_success', (data) => {
    console.log('Authentication successful:', data);
  });

  useSocketEvent('auth_failed', (data) => {
    console.log('Authentication failed:', data);
  });

  // Example: Place a bet
  const placeBet = () => {
    if (isAuthenticated) {
      sendMessage({
        type: 'place_bet',
        data: {
          amount: 100,
          marketId: 'your_market_id',
          eventId: 'your_event_id'
        }
      });
    }
  };

  // Example: Get balance
  const getBalance = () => {
    sendMessage({
      type: 'get_balance'
    });
  };

  return (
    <div className="socket-example">
      <h3>Socket Status</h3>
      <div>
        <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>Balance: ${balance.toFixed(2)}</p>
        
        {marketData && (
          <div>
            <h4>Market Data</h4>
            <pre>{JSON.stringify(marketData, null, 2)}</pre>
          </div>
        )}

        {lastBetResult && (
          <div>
            <h4>Last Bet Result</h4>
            <pre>{JSON.stringify(lastBetResult, null, 2)}</pre>
          </div>
        )}

        <div>
          {/* <button onClick={connect} disabled={isConnected}>
            Connect
          </button> */}
          <button onClick={disconnect} disabled={!isConnected}>
            Disconnect
          </button>
          <button onClick={getBalance} disabled={!isAuthenticated}>
            Get Balance
          </button>
          <button onClick={placeBet} disabled={!isAuthenticated}>
            Place Bet ($100)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocketExample; 