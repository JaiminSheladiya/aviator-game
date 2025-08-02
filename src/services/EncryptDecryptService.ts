import * as forge from 'node-forge';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptionData {
  serverPublicKey: string;
  iv: string;
  encryptionKey: string;
}

export interface MarketDataCallback {
  (data: any): void;
}

export class EncryptDecryptService {
  private keyPair: KeyPair | null = null;
  private serverPublicKey: string | null = null;
  private ivhex: string | null = null;
  private encryptionKey: string | null = null;
  private previousGameName: string | null = null;
  private messageToSocket: any = null;
  private counter: number = 0;
  private marketDataCallbacks: MarketDataCallback[] = [];

  constructor() {
    // Initialize the service
  }

  /**
   * Subscribe to market data updates
   */
  subscribeToMarketData(callback: MarketDataCallback): () => void {
    this.marketDataCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.marketDataCallbacks.indexOf(callback);
      if (index > -1) {
        this.marketDataCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Update market data and notify subscribers
   */
  updateMarketData(message: any): void {
    this.marketDataCallbacks.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('Error in market data callback:', error);
      }
    });
  }

  /**
   * Get message from socket - main message processing function
   */
  getMessageFromSocket(): void {
    this.counter = 0;
    // This will be called by the SocketProvider when messages are received
  }

  /**
   * Process incoming socket message
   */
  async processMessage(message: any): Promise<any> {
    if (message === "WebSocket connection closed" || 
        message === "unsubscribed successfully" || 
        message === null) {
      // Close socket and return
      this.updateMarketData(null);
      return null;
    }

    try {
      // Try to parse as plain JSON first
      const plainData = JSON.parse(message);
      this.updateMarketData(message);
      return plainData;
    } catch (error) {
      // If not plain JSON, try to decrypt
      return this.messageReader(message);
    }
  }

  /**
   * Read and decrypt message
   */
  private async messageReader(message: string): Promise<any> {
    if (message === "WebSocket connection closed" || 
        message === "unsubscribed successfully" || 
        message === null) {
      this.updateMarketData(null);
      return null;
    }

    const decryptedBuffer = forge.util.decode64(message);

    try {
      const dataParse = JSON.parse(decryptedBuffer);
      if (dataParse?.type === 1) {
        this.updateMarketData(dataParse);
        return dataParse;
      }
    } catch (error) {
      // If not JSON, decrypt using AES
      const decryptedData = this.decryptusingNodeforge(decryptedBuffer, this.encryptionKey!, this.ivhex!);
      this.updateMarketData(decryptedData);
      return decryptedData;
    }

    try {
      const dataParse = JSON.parse(decryptedBuffer);
      
      if (dataParse?.type === 0) {
        // Handle server public key and encryption setup
        this.serverPublicKey = dataParse.data; // Store the PEM string directly
        this.ivhex = this.decryptString(dataParse.iv);
        this.encryptionKey = this.decryptString(dataParse.encryptionKey);

        // Send the original message to socket
        this.sendMessageToSocket(this.messageToSocket);
        
        return this.messageToSocket;
      } else {
        this.updateMarketData(dataParse);
        return dataParse;
      }
    } catch (error) {
      // Decrypt using AES if not JSON
      const decryptedData = this.decryptusingNodeforge(decryptedBuffer, this.encryptionKey!, this.ivhex!);
      this.updateMarketData(decryptedData);
      return decryptedData;
    }
  }

  /**
   * Generate encryption key and establish secure connection
   */
  async generateEncryptionKey(gameName: string, messageToSocket?: any): Promise<string> {
    this.messageToSocket = messageToSocket;
    
    if (!this.previousGameName) {
      this.previousGameName = gameName;
    }

    // Generate RSA key pair
    this.keyPair = this.generateKeyPair();

    // Encrypt data
    const publicKeyBase64 = btoa(this.keyPair.publicKey);

    // Generate URL based on message type
    const socketBaseUrl = this.getBaseUrlofEvent(messageToSocket);
    const url = `${socketBaseUrl}?token=${publicKeyBase64}`;

    return url;
  }

  /**
   * Generate RSA key pair
   */
  private generateKeyPair(): KeyPair {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 1024 });
    
    return {
      publicKey: forge.pki.publicKeyToPem(keyPair.publicKey),
      privateKey: forge.pki.privateKeyToPem(keyPair.privateKey)
    };
  }

  /**
   * Get base URL for different event types
   */
  getBaseUrlofEvent(msg: any): string {
    let url = '';

    if (msg.id.startsWith("99.")) {
      const tableId = msg.id.slice(-2); // Extract last 2 digits
      url = `wss://universeexchapi.com/universe_casino_99${tableId}`;
    }
    if (msg.id.startsWith("88.")) {
      const tableId = msg.id.slice(-2); // Extract last 2 digits
      url = `wss://universeexchapi.com/universe_casino_88${tableId}`;
    }

    return url;
  }

  /**
   * Send encrypted message to socket
   */
  sendMessageToSocket(message: any): string {
    const msg = JSON.stringify(message);
    const encryptedText = this.encryptUsingNodeForge(msg, this.encryptionKey!, this.ivhex!);
    return forge.util.encode64(encryptedText);
  }

  /**
   * Encrypt data using RSA public key
   */
  async encryptData(data: string, keyPair: KeyPair): Promise<string> {
    try {
      const publicKey = forge.pki.publicKeyFromPem(keyPair.publicKey);
      const encryptedBytes = publicKey.encrypt(data);
      const encryptedData = forge.util.encode64(encryptedBytes);
      return encryptedData;
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  /**
   * Decrypt data using RSA private key
   */
  decryptData(items: string[]): string {
    try {
      let concatenatedString = '';
      items.forEach((data: string) => {
        const decryptedString = this.decryptString(data);
        concatenatedString = concatenatedString + decryptedString;
      });
      return concatenatedString;
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }

  /**
   * Decrypt using AES-CBC
   */
  private decryptusingNodeforge(encryptedHex: string, keyBase64: string, ivHex: string): any {
    try {
      const keyBytes = forge.util.decode64(keyBase64);
      const ivBytes = forge.util.hexToBytes(ivHex);

      const decipher = forge.cipher.createDecipher('AES-CBC', keyBase64);
      decipher.start({ iv: ivBytes });
      decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encryptedHex)));
      decipher.finish();
      
      const decryptedString = decipher.output.data;
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('AES decryption error:', error);
      throw error;
    }
  }

  /**
   * Encrypt using AES-CBC
   */
  encryptUsingNodeForge(data: string, keyBase64: string, ivHex: string): string {
    const keyBytes = forge.util.decode64(keyBase64);
    const ivBytes = forge.util.hexToBytes(ivHex);

    const cipher = forge.cipher.createCipher('AES-CBC', keyBase64);
    cipher.start({ iv: ivBytes });
    cipher.update(forge.util.createBuffer(data, 'utf8'));
    cipher.finish();

    const encryptedBuffer = cipher.output;
    const encryptedHex = forge.util.bytesToHex(encryptedBuffer.data);

    return encryptedHex;
  }

  /**
   * Decrypt string using RSA private key
   */
  decryptString(data: string): string {
    try {
      const decryptedBuffer = forge.util.decode64(data);
      const privateKey = forge.pki.privateKeyFromPem(this.keyPair!.privateKey);
      const decrypted = privateKey.decrypt(decryptedBuffer);
      return decrypted;
    } catch (error) {
      console.error('RSA decryption error:', error);
      throw error;
    }
  }

  /**
   * Close existing socket and reset state
   */
  closeExistingSocket(): void {
    this.keyPair = null;
    this.counter = 0;
    this.serverPublicKey = null;
    this.ivhex = null;
    this.encryptionKey = null;
    this.previousGameName = null;
    this.messageToSocket = null;
    this.marketDataCallbacks = [];
  }

  /**
   * Get current encryption state
   */
  getEncryptionState(): {
    hasKeyPair: boolean;
    hasServerKey: boolean;
    hasEncryptionKey: boolean;
  } {
    return {
      hasKeyPair: !!this.keyPair,
      hasServerKey: !!this.serverPublicKey,
      hasEncryptionKey: !!this.encryptionKey
    };
  }

  /**
   * Get market data observable (similar to Angular service)
   */
  getMarketData(): {
    subscribe: (callback: MarketDataCallback) => () => void;
  } {
    return {
      subscribe: (callback: MarketDataCallback) => {
        return this.subscribeToMarketData(callback);
      }
    };
  }
}

export default EncryptDecryptService; 