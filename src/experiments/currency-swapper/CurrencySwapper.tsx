import React from "react";
import { View, Text, Image } from "react-native";
import { useCurrencySwapper } from "./useCurrencySwapper";
import WheelSlider from "../wheelslider";
import { usePanResponder } from "./usePanResponder";

export const CurrencySwapper = () => {
  const {
    currentPair,
    currentSwap,
    selectedAmount,
    nextCurrency,
    previousCurrency,
    updateAmount,
  } = useCurrencySwapper();

  const { panResponder } = usePanResponder({
    onSwipeUp: nextCurrency,
    onSwipeDown: previousCurrency,
  });

  // Simple background colors - clean tints from logo colors
  const getBackgroundColor = () => {
    return currentPair.quote.symbol === "USDC"
      ? "rgba(0, 122, 255, 0.08)" // Clean blue tint from USDC logo
      : "rgba(138, 43, 226, 0.08)"; // Clean purple tint from Solana logo
  };

  // Get logo source based on current currency
  const getLogoSource = () => {
    switch (currentPair.quote.symbol) {
      case "USDC":
        return require("../../../assets/usdc.png");
      case "SOL":
        return require("../../../assets/solana.png");
      default:
        return require("../../../assets/usdc.png");
    }
  };

  // Get currency symbol for display
  const getCurrencySymbol = () => {
    return currentPair.quote.symbol === "SOL" ? "SOL" : "$";
  };

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {/* Invisible swipe zones - top and bottom of screen */}
      <View
        className="absolute top-0 left-0 right-0 h-20 z-10"
        {...panResponder.panHandlers}
      />
      <View
        className="absolute bottom-0 left-0 right-0 h-20 z-10"
        {...panResponder.panHandlers}
      />

      {/* Simple header */}
      <View className="mb-8 items-center">
        <View className="flex-row items-center mb-2">
          <Text className="text-2xl font-bold text-white">Buy </Text>
          <Image
            source={require("../../../assets/jupiter.png")}
            className="mx-1"
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-white">JUP</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-lg text-gray-300">with </Text>
          <Image
            source={getLogoSource()}
            className="mx-1"
            style={{
              width: currentPair.quote.symbol === "SOL" ? 40 : 24,
              height: currentPair.quote.symbol === "SOL" ? 40 : 24,
            }}
            resizeMode="contain"
          />
          <Text className="text-lg text-gray-300">
            {currentPair.quote.symbol}
          </Text>
        </View>
      </View>

      {/* Main amount display - shows quote currency amount and JUP received */}
      <View className="mb-8 items-center">
        <Text className="text-5xl font-bold text-white">
          {getCurrencySymbol()}
          {currentSwap.quoteAmount.toFixed(2)}
        </Text>
        <Text className="text-lg text-gray-300 mt-2">
          = ${(currentSwap.baseAmount * 0.5).toFixed(2)} JUP
        </Text>
      </View>

      {/* Wheel slider */}
      <View className="w-full px-4">
        <WheelSlider
          selectedAmount={selectedAmount}
          onAmountChange={updateAmount}
          currencyPair={currentPair}
        />
      </View>
    </View>
  );
};
