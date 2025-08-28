import { useState, useCallback, useMemo } from "react";
import { Currency, CurrencyPair, SwapAmount } from "./types";
import {
  CURRENCIES,
  QUOTE_CURRENCIES,
  BASE_CURRENCY,
  EXCHANGE_RATES,
} from "./currencies";

export const useCurrencySwapper = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(100);

  // Safety check - ensure arrays exist and have values
  const safeIndex =
    currentQuoteIndex < (QUOTE_CURRENCIES?.length || 0) ? currentQuoteIndex : 0;
  const quoteSymbol = QUOTE_CURRENCIES?.[safeIndex] || "USDC";
  const quoteCurrency = CURRENCIES?.[quoteSymbol] || CURRENCIES?.USDC;

  // Simple currency pair
  const currentPair: CurrencyPair = {
    base: BASE_CURRENCY,
    quote: quoteCurrency,
  };

  // Available amounts in quote currency
  const availableAmounts = useMemo(() => {
    const amounts = [];
    for (let i = 1; i <= 25; i++) {
      const baseValue = i * 20; // Base JUP amount
      const exchangeRate = EXCHANGE_RATES?.[currentPair.quote.symbol] || 1;
      const quoteValue = baseValue * exchangeRate;

      amounts.push({
        value: baseValue, // This is what gets passed to WheelSlider
        label: `${currentPair.quote.symbol}${quoteValue.toFixed(2)}`, // Quote currency label
        quoteAmount: quoteValue,
      });
    }
    return amounts;
  }, [currentPair.quote.symbol]);

  // Simple swap
  const currentSwap: SwapAmount = {
    baseAmount: selectedAmount,
    quoteAmount:
      currentPair.quote.symbol === "SOL"
        ? selectedAmount / (EXCHANGE_RATES?.[currentPair.quote.symbol] || 1) // For SOL: divide to get SOL amount
        : selectedAmount * (EXCHANGE_RATES?.[currentPair.quote.symbol] || 1), // For USDC: multiply to get USD amount
    exchangeRate: EXCHANGE_RATES?.[currentPair.quote.symbol] || 1,
  };

  // Simple navigation
  const nextCurrency = useCallback(() => {
    setCurrentQuoteIndex((prev) => (prev === 0 ? 1 : 0));
  }, []);

  const previousCurrency = useCallback(() => {
    setCurrentQuoteIndex((prev) => (prev === 0 ? 1 : 0));
  }, []);

  const updateAmount = useCallback((amount: number) => {
    setSelectedAmount(amount);
  }, []);

  return {
    currentPair,
    currentSwap,
    availableAmounts,
    selectedAmount,
    nextCurrency,
    previousCurrency,
    updateAmount,
    quoteCurrencies: QUOTE_CURRENCIES,
    currentQuoteIndex,
  };
};
