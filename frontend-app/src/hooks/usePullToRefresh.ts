import { useState, useEffect, useCallback } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export const usePullToRefresh = ({ onRefresh, threshold = 70 }: PullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isPulling) {
      const current = e.touches[0].clientY;
      const diff = current - startY;
      if (diff > 0) {
        setCurrentY(diff);
      }
    }
  }, [isPulling, startY]);

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && currentY >= threshold) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setIsPulling(false);
    setCurrentY(0);
  }, [isPulling, currentY, threshold, onRefresh]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (window.scrollY === 0 && e.deltaY < 0) {
      setStartY(e.clientY);
      setIsPulling(true);
      setCurrentY(Math.abs(e.deltaY));
    }
  }, []);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel]);

  return {
    isRefreshing,
    pullDistance: currentY,
    threshold,
  };
}; 