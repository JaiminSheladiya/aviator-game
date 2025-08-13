# Cashout Success Popup Implementation

This implementation provides a beautiful popup message that displays when a user successfully cashes out from the Aviator game.

## Features

- **Exact Design Match**: Replicates the design from the provided image
- **Left Section**: Shows "You have cashed out!" and the multiplier (e.g., "1.27x")
- **Right Section**: Shows "Win USD" and the amount won, with decorative animated stars
- **Responsive Design**: Works on different screen sizes
- **Smooth Animations**: Fade-in and scale-in animations for better UX
- **Easy Integration**: Simple API to trigger the popup

## Components

### 1. CashoutSuccessModal

The main popup component located at `src/components/modals/CashoutSuccessModal.tsx`

### 2. CashoutDemo

A demo component for testing the popup at `src/components/CashoutDemo.tsx`

## Usage

### Basic Usage

```tsx
import CashoutSuccessModal from "./components/modals/CashoutSuccessModal";

const [isOpen, setIsOpen] = useState(false);
const [cashoutData, setCashoutData] = useState(null);

// Show the popup
const showCashoutSuccess = (data) => {
  setCashoutData(data);
  setIsOpen(true);
};

// In your JSX
<CashoutSuccessModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  cashoutData={cashoutData}
/>;
```

### With API Response Data

```tsx
import { processCashoutSuccessData } from "./utils";

// When you receive the API response
const handleAPIResponse = (response) => {
  if (response.meta.message === "Casino Bet Cashout Successful.") {
    const processedData = processCashoutSuccessData(response);
    if (processedData) {
      setCashoutData(processedData);
      setIsOpen(true);
    }
  }
};
```

### Expected Data Format

The popup expects data in this format:

```tsx
{
  cashOutAtMultiplier: "1.27",  // The multiplier (e.g., "1.27x")
  cashout: 127,                  // Total amount received
  stake: 100                     // Original bet amount
}
```

## API Integration

### 1. Automatic Detection

The system automatically detects cashout success responses by checking:

- `response.meta.status === true`
- `response.meta.message === "Casino Bet Cashout Successful."`

### 2. Manual Trigger

You can manually trigger the popup with any data:

```tsx
// Example data
const sampleData = {
  cashOutAtMultiplier: "1.27",
  cashout: 127,
  stake: 100,
};

handleCashoutSuccess(sampleData);
```

## Styling

The popup uses Tailwind CSS classes and custom animations:

- **Colors**: Dark green (#1a4d2e) and lighter green (#2d7a4d)
- **Animations**: Fade-in background, scale-in modal
- **Stars**: Animated decorative elements with pulse effect
- **Responsive**: Minimum width of 500px, flexible layout

## Customization

### Colors

Modify the color classes in `CashoutSuccessModal.tsx`:

- Left section: `bg-[#1a4d2e]`
- Right section: `bg-[#2d7a4d]`
- Border: `border-[#2d5a3d]`

### Animations

Customize animations in `src/index.css`:

- `animate-fadeIn`: Background fade-in
- `animate-scaleIn`: Modal scale-in
- `animate-pulse`: Star pulse effect

### Text

Modify the text content in the component:

- "You have cashed out!"
- "Win USD"

## Testing

Use the included `CashoutDemo` component to test the popup:

1. The demo appears in the top-left corner of the screen
2. Click "Show Cashout Success" to trigger the popup
3. The popup displays with sample data (stake: $100, cashout: $127, multiplier: 1.27x)

## Integration Steps

1. **Import the modal** in your main component
2. **Add state variables** for modal visibility and data
3. **Create handler functions** for showing/hiding the modal
4. **Add the modal** to your JSX
5. **Call the handler** when you receive cashout success data

## Example Integration

```tsx
// In your main component
const [cashoutModalOpen, setCashoutModalOpen] = useState(false);
const [cashoutData, setCashoutData] = useState(null);

const handleCashoutSuccess = (data) => {
  const processedData = processCashoutSuccessData(data);
  if (processedData) {
    setCashoutData(processedData);
    setCashoutModalOpen(true);
  }
};

// Add to your JSX
<CashoutSuccessModal
  isOpen={cashoutModalOpen}
  onClose={() => setCashoutModalOpen(false)}
  cashoutData={cashoutData}
/>;
```

## Troubleshooting

### Popup not showing

- Check if `isOpen` is true
- Verify `cashoutData` contains the required fields
- Ensure the component is properly imported

### Styling issues

- Verify Tailwind CSS is properly configured
- Check if custom animations are loaded
- Ensure z-index values are appropriate

### Data not displaying

- Verify the data structure matches the expected format
- Check console for any errors
- Use the `processCashoutSuccessData` utility function
