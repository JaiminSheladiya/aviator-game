import React, { useEffect, useState } from 'react';
import { useSocket } from '../providers/SocketProvider';

const MarketDataExample: React.FC = () => {
  const { getMarketData, isConnected } = useSocket();
  const [marketData, setMarketData] = useState<any>(null);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to market data using getMessageFromSocket functionality
    const unsubscribe = getMarketData().subscribe((data: any) => {
      console.log('Market data received:', data);
      
      if (data) {
        setMarketData(data);
        setMessageHistory(prev => [...prev, { timestamp: new Date(), data }]);
      } else {
        // Handle connection closed or unsubscribed
        console.log('Market data connection closed');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, getMarketData]);

  return (
    <div className="market-data-example">
      <h3>Market Data (getMessageFromSocket)</h3>
      <div>
        <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
        
        {marketData && (
          <div>
            <h4>Latest Market Data</h4>
            <pre>{JSON.stringify(marketData, null, 2)}</pre>
          </div>
        )}

        {messageHistory.length > 0 && (
          <div>
            <h4>Message History ({messageHistory.length} messages)</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {messageHistory.map((msg, index) => (
                <div key={index} style={{ 
                  border: '1px solid #ccc', 
                  margin: '5px 0', 
                  padding: '10px',
                  fontSize: '12px'
                }}>
                  <div><strong>Time:</strong> {msg.timestamp.toLocaleTimeString()}</div>
                  <div><strong>Data:</strong></div>
                  <pre style={{ fontSize: '10px', margin: '5px 0' }}>
                    {JSON.stringify(msg.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {messageHistory.length === 0 && (
          <p>No messages received yet. Connect to start receiving market data.</p>
        )}
      </div>
    </div>
  );
};

export default MarketDataExample; 