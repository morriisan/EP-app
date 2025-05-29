import {useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  threshold = 100
}: UseInfiniteScrollProps) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, {
      rootMargin: `${threshold}px`,
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore, threshold]);

  return { lastElementRef };
} 