import { useRef } from "react";
import { PanResponder, Animated } from "react-native";

interface UsePanResponderProps {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const usePanResponder = ({
  onSwipeUp,
  onSwipeDown,
}: UsePanResponderProps = {}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical swipes with enough distance
        return (
          Math.abs(gestureState.dy) > 50 && Math.abs(gestureState.dx) < 100
        );
      },
      onPanResponderGrant: () => {
        // Reset to zero when starting
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        // Swipe up (negative dy) = next currency
        if (gestureState.dy < -80) {
          onSwipeUp?.();
        }
        // Swipe down (positive dy) = previous currency
        else if (gestureState.dy > 80) {
          onSwipeDown?.();
        }

        // Reset position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return { panResponder, pan };
};
