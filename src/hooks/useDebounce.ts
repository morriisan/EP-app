import { useState, useEffect, useMemo } from 'react';
import { debounce, DebouncedFunc } from 'lodash';

// Hook for debouncing values (like in MediaCard)
export function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debouncedSetValue = useMemo(
    () => debounce(setDebouncedValue, delay),
    [delay]
  );

  useEffect(() => {
    debouncedSetValue(value);
    
    // Cleanup: cancel any pending debounced calls
    return () => {
      debouncedSetValue.cancel();
    };
  }, [value, debouncedSetValue]);

  return debouncedValue;
}

// Hook for debouncing functions (like in EmailValidator)
export function useDebounceFunction<TArgs extends unknown[], TReturn>(
  callback: (...args: TArgs) => TReturn,
  delay: number
): DebouncedFunc<(...args: TArgs) => TReturn> {
  return useMemo(
    () => debounce(callback, delay),
    [callback, delay]
  );
} 