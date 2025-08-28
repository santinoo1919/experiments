import { Currency } from "./types";

// Simplified: Only SOL and USDC for buying $JUP
export const CURRENCIES: Record<string, Currency> = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    backgroundTint: "bg-blue-500/20",
    icon: "💵",
    decimals: 6,
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    backgroundTint: "bg-purple-500/20",
    icon: "☀️",
    decimals: 9,
  },
  JUP: {
    symbol: "JUP",
    name: "Jupiter",
    backgroundTint: "bg-green-500/20",
    icon: "🪐",
    decimals: 6,
  },
};

// Only 2 quote currencies: SOL and USDC
export const QUOTE_CURRENCIES = ["USDC", "SOL"];

// Base currency: $JUP (what you're buying)
export const BASE_CURRENCY = CURRENCIES.JUP;

// Simple exchange rates
export const EXCHANGE_RATES: Record<string, number> = {
  USDC: 1.0, // 1 USDC = $1.00
  SOL: 200.0, // 1 SOL = $200.00
  JUP: 0.5, // 1 JUP = $0.50
};
