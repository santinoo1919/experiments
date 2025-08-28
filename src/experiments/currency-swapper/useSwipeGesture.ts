import { useRef, useState, useCallback } from "react";
import { SwipeDirection, SwipeState } from "./types";

interface UseSwipeGestureProps {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  threshold?: number; // Minimum distance to trigger swipe
}

export const useSwipeGesture = ({
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: UseSwipeGestureProps) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    direction: "none",
    progress: 0,
    isActive: false,
  });

  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  const handleTouchStart = useCallback((event: any) => {
    startY.current = event.touches[0].clientY;
    currentY.current = startY.current;

    setSwipeState((prev) => ({
      ...prev,
      isActive: true,
      direction: "none",
      progress: 0,
    }));
  }, []);

  const handleTouchMove = useCallback(
    (event: any) => {
      if (!swipeState.isActive) return;

      currentY.current = event.touches[0].clientY;
      const deltaY = startY.current - currentY.current;
      const progress = Math.min(Math.abs(deltaY) / threshold, 1);

      setSwipeState((prev) => ({
        ...prev,
        progress,
        direction: deltaY > 0 ? "up" : "down",
      }));
    },
    [swipeState.isActive, threshold]
  );

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.isActive) return;

    const deltaY = startY.current - currentY.current;

    if (Math.abs(deltaY) >= threshold) {
      if (deltaY > 0) {
        onSwipeUp();
      } else {
        onSwipeDown();
      }
    }

    setSwipeState({
      direction: "none",
      progress: 0,
      isActive: false,
    });
  }, [swipeState.isActive, threshold, onSwipeUp, onSwipeDown]);

  return {
    swipeState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
