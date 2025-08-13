# Cashout Success Popup Integration

## 🚀 **Ready to Use!**

The cashout success popup is now fully implemented and ready to work with your API data.

## 📱 **How to Use:**

### **Option 1: Automatic Detection (Recommended)**

When you receive your API response, simply call:

```typescript
handleAPIResponse(yourAPIResponseData);
```

The system will automatically:

- Check if it's a cashout success response
- Process the data
- Show the popup

### **Option 2: Manual Trigger**

If you want to show the popup manually:

```typescript
handleCashoutSuccess({
  cashOutAtMultiplier: "1.27",
  cashout: 127,
  stake: 100,
});
```

## 🔧 **Integration Steps:**

1. **Find where you receive your API response** (WebSocket, HTTP response, etc.)
2. **Call `handleAPIResponse(response)`** with your data
3. **That's it!** The popup will automatically appear

## 📊 **Your Data Format:**

```json
{
  "data": [
    {
      "betId": "689cf2ec4b63cb03c6a33a5f",
      "userName": "t*********2",
      "stake": 100,
      "marketId": "1248123",
      "nation": "CASHOUT",
      "cashout": 127,
      "createdAt": "2025-08-13T20:17:48.422Z",
      "cashOutAtMultiplier": "1.27"
    }
  ],
  "meta": {
    "message": "Casino Bet Cashout Successful.",
    "status_code": 200,
    "status": true
  }
}
```

## 🎯 **Example Usage:**

```typescript
// In your WebSocket message handler
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // This will automatically show the popup if it's a cashout success
  handleAPIResponse(data);
};

// Or in your HTTP response handler
const response = await fetch("/api/cashout");
const data = await response.json();
handleAPIResponse(data);
```

## ✨ **Features:**

- ✅ **Automatic Detection** of cashout success responses
- ✅ **Capsule-shaped Design** with your specified colors
- ✅ **Top Positioning** with 1rem gap
- ✅ **Responsive Layout** (90% width, max 10rem)
- ✅ **Smooth Animations** and decorative stars
- ✅ **Close Button** positioned on the right center

## 🎨 **Current Design:**

- **Colors**: #427F00 (dark green) and #28A909 (light green)
- **Shape**: Perfect capsule with rounded-full
- **Position**: Top of screen with 1rem margin
- **Size**: 90% width, maximum 10rem

The popup is now ready to work with your real API data! Just call `handleAPIResponse()` whenever you receive a response.
