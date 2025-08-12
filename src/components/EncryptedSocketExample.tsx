import React, { useState } from 'react';
import { useSocket, useSocketEvent } from '../providers/SocketProvider';

const EncryptedSocketExample: React.FC = () => {
  const { 
    isConnected, 
    isAuthenticated, 
    balance,
    marketData,
    lastBetResult,
    connect,
    disconnect,
    sendMessage,
    encryptionState
  } = useSocket();

  const [gameId, setGameId] = useState('88.01'); // Example game ID

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

  // Connect with encryption
  const connectWithEncryption = () => {
    const messageToSocket = {
      id: gameId,
      type: 'join_game',
      data: {
        gameType: 'casino',
        tableId: gameId.slice(-2)
      }
    };
    
    connect(undefined, messageToSocket);
  };

  // Connect without encryption (plain WebSocket)
  const connectPlain = () => {
    connect();
  };

  // Place a bet
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

  // Get balance
  const getBalance = () => {
    sendMessage({
      type: 'get_balance'
    });
  };

  return (
    <div className="encrypted-socket-example">
      <h3>Encrypted Socket Status</h3>
      <div>
        <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>Balance: ${balance.toFixed(2)}</p>
        
        <div>
          <h4>Encryption State</h4>
          <p>Has Key Pair: {encryptionState.hasKeyPair ? 'Yes' : 'No'}</p>
          <p>Has Server Key: {encryptionState.hasServerKey ? 'Yes' : 'No'}</p>
          <p>Has Encryption Key: {encryptionState.hasEncryptionKey ? 'Yes' : 'No'}</p>
        </div>
        
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
          <input 
            type="text" 
            value={gameId} 
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Enter game ID (e.g., 88.01)"
          />
          <button onClick={connectWithEncryption} disabled={isConnected}>
            Connect with Encryption
          </button>
          <button onClick={connectPlain} disabled={isConnected}>
            Connect Plain WebSocket
          </button>
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

export default EncryptedSocketExample; 