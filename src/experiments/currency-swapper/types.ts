// Currency types and interfaces
export interface Currency {
  symbol: string;
  name: string;
  backgroundTint: string;
  icon: string;
  decimals: number;
}

export interface CurrencyPair {
  base: Currency; // What you're buying (e.g., $JUP)
  quote: Currency; // What you're paying with (e.g., USDC, SOL)
}

export interface SwapAmount {
  baseAmount: number;
  quoteAmount: number;
  exchangeRate: number;
}

// Currency swipe direction
export type SwipeDirection = "up" | "down" | "none";

// Swipe gesture state
export interface SwipeState {
  direction: SwipeDirection;
  progress: number; // 0 to 1
  isActive: boolean;
}
