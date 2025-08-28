import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";

const { width: screenWidth } = Dimensions.get("window");
const ITEM_WIDTH = 100; // Increased for 3-digit amounts
const ITEM_SPACING = 25; // Increased spacing
const CENTER_OFFSET = (screenWidth - ITEM_WIDTH) / 2;

interface WheelSliderProps {
  selectedAmount?: number;
  onAmountChange?: (amount: number) => void;
  currencyPair?: any; // We'll use this later for currency-specific styling
  customAmounts?: Array<{ value: number; label: string }>; // Custom amounts and labels
}

const WheelSlider: React.FC<WheelSliderProps> = ({
  selectedAmount: externalAmount,
  onAmountChange,
  currencyPair,
  customAmounts,
}) => {
  const [selectedAmount, setSelectedAmount] = useState(externalAmount || 100);
  const [currentScrollX, setCurrentScrollX] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = new Animated.Value(0);
  const lastScrollTime = useRef(Date.now());
  const lastScrollX = useRef(0);
  const isSpinning = useRef(false);

  // Update internal state when external prop changes
  useEffect(() => {
    if (externalAmount !== undefined && externalAmount !== selectedAmount) {
      setSelectedAmount(externalAmount);
    }
  }, [externalAmount]);

  // Notify parent when amount changes
  const updateAmount = (amount: number) => {
    setSelectedAmount(amount);
    onAmountChange?.(amount);
  };

  // Use custom amounts if provided, otherwise fallback to default USD amounts
  const amountData =
    customAmounts ||
    Array.from({ length: 25 }, (_, index) => {
      const value = (index + 1) * 20;
      // Show SOL amounts when currency is SOL, otherwise show USDC
      const isSOL = currencyPair?.quote?.symbol === "SOL";
      const label = isSOL
        ? `${(value / 200).toFixed(2)}\nSOL`
        : `${value}\nUSDC`;

      return {
        value,
        label,
      };
    });

  // Auto-center the selected amount when it changes
  useEffect(() => {
    const targetIndex = amountData.findIndex(
      (item) => item.value === selectedAmount
    );
    if (targetIndex !== -1) {
      const targetOffset = targetIndex * (ITEM_WIDTH + ITEM_SPACING);
      scrollRef.current?.scrollTo({
        x: targetOffset,
        animated: true,
      });
    }
  }, [selectedAmount]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        setCurrentScrollX(event.nativeEvent.contentOffset.x);
      },
    }
  );

  const handleScrollEnd = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / (ITEM_WIDTH + ITEM_SPACING));
    const newValue = amountData[index]?.value || selectedAmount;
    updateAmount(newValue);
    isSpinning.current = false;
  };

  // Roulette physics: stronger gesture = more acceleration
  const handleScrollBegin = () => {
    lastScrollTime.current = Date.now();
    lastScrollX.current = currentScrollX;
    isSpinning.current = false;
  };

  const handleMomentumScrollBegin = () => {
    const currentTime = Date.now();
    const currentX = currentScrollX;
    const timeDiff = currentTime - lastScrollTime.current;
    const distance = Math.abs(currentX - lastScrollX.current);

    if (timeDiff > 0 && distance > 0) {
      const velocity = distance / timeDiff; // pixels per millisecond

      // Roulette physics: velocity determines acceleration
      if (velocity > 1) {
        // Lower threshold for more responsive feel
        isSpinning.current = true;

        // Calculate acceleration based on gesture strength
        const accelerationMultiplier = Math.min(velocity * 0.8, 8); // Cap at 8x
        const direction = Math.sign(currentX - lastScrollX.current);

        // Stronger gestures get more momentum
        const momentumDistance = Math.floor(accelerationMultiplier);

        // Calculate final position with momentum
        const targetOffset =
          currentX + direction * momentumDistance * (ITEM_WIDTH + ITEM_SPACING);
        const targetIndex = Math.round(
          targetOffset / (ITEM_WIDTH + ITEM_SPACING)
        );
        const clampedIndex = Math.max(
          0,
          Math.min(targetIndex, amountData.length - 1)
        );
        const finalOffset = clampedIndex * (ITEM_WIDTH + ITEM_SPACING);

        // Roulette-style deceleration: faster start, slower end
        const duration = Math.max(400, Math.min(1200, 800 + velocity * 200));

        // Use spring animation for natural deceleration feel
        Animated.spring(scrollX, {
          toValue: finalOffset,
          useNativeDriver: false,
          tension: 50, // Lower tension = more natural deceleration
          friction: 8, // Higher friction = more realistic wheel feel
          velocity: velocity * 0.1, // Initial velocity affects the spring
        }).start(() => {
          // Update selected amount after spring animation
          const newValue = amountData[clampedIndex]?.value || selectedAmount;
          updateAmount(newValue);
          isSpinning.current = false;
        });
      }
    }

    lastScrollTime.current = currentTime;
    lastScrollX.current = currentX;
  };

  const renderItem = (
    item: { value: number; label: string },
    index: number
  ) => {
    const inputRange = [
      (index - 3) * (ITEM_WIDTH + ITEM_SPACING),
      (index - 2) * (ITEM_WIDTH + ITEM_SPACING),
      (index - 1) * (ITEM_WIDTH + ITEM_SPACING),
      index * (ITEM_WIDTH + ITEM_SPACING),
      (index + 1) * (ITEM_WIDTH + ITEM_SPACING),
      (index + 2) * (ITEM_WIDTH + ITEM_SPACING),
      (index + 3) * (ITEM_WIDTH + ITEM_SPACING),
    ];

    // Curved effect: only center 3 items are fully visible
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 0.6, 0.85, 1.3, 0.85, 0.6, 0.4],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.1, 0.3, 0.7, 1, 0.7, 0.3, 0.1],
      extrapolate: "clamp",
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [40, 25, 10, 0, 10, 25, 40],
      extrapolate: "clamp",
    });

    // Add rotation for curved effect
    const rotateY = scrollX.interpolate({
      inputRange,
      outputRange: [
        "-45deg",
        "-25deg",
        "-10deg",
        "0deg",
        "10deg",
        "25deg",
        "45deg",
      ],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        key={item.value}
        style={{
          width: ITEM_WIDTH,
          marginHorizontal: ITEM_SPACING / 2,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale }, { translateY }, { rotateY }],
          opacity,
        }}
      >
        <View
          className={`rounded-xl p-4 border backdrop-blur-sm ${
            item.value === selectedAmount
              ? currencyPair?.quote?.symbol === "USDC"
                ? "bg-blue-500/20 border-blue-400/60"
                : "bg-purple-500/20 border-purple-400/60"
              : currencyPair?.quote?.symbol === "USDC"
              ? "bg-blue-500/10 border-blue-400/30"
              : "bg-purple-500/10 border-purple-400/30"
          }`}
          style={{
            width: ITEM_WIDTH - 20, // Same width for both currencies
            shadowColor:
              item.value === selectedAmount
                ? currencyPair?.quote?.symbol === "USDC"
                  ? "#007AFF"
                  : "#8A2BE2"
                : "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: item.value === selectedAmount ? 0.4 : 0.1,
            shadowRadius: 8,
            elevation: item.value === selectedAmount ? 8 : 2,
          }}
        >
          <Text
            className={`text-center font-semibold ${
              item.value === selectedAmount
                ? "text-lg text-white"
                : "text-lg text-gray-300"
            }`}
            numberOfLines={2}
            adjustsFontSizeToFit={true}
          >
            {item.label}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className="h-40 w-full">
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: CENTER_OFFSET,
        }}
        decelerationRate={0.95} // Higher deceleration for roulette feel
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        snapToAlignment="center"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        bounces={false} // No bouncing at edges
        overScrollMode="never" // Android: no over-scroll
      >
        {amountData.map(renderItem)}
      </Animated.ScrollView>
    </View>
  );
};

export default WheelSlider;
