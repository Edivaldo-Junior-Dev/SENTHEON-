import { useEffect, useRef } from 'react';
import { chronicleService } from '../services/chronicleService';
import { EventType, ModuleName } from '../../../types';

interface UseChronicleOptions {
  autoTrack?: boolean;
  debounceMs?: number;
  entityName?: string;
}

export const useChronicle = (
  module: ModuleName,
  entityId: string,
  currentState: any,
  options: UseChronicleOptions = {}
) => {
  const { autoTrack = false, debounceMs = 2000, entityName } = options;
  const previousState = useRef<any>(currentState);
  const timeoutRef = useRef<any>(null);
  const isFirstRender = useRef(true);

  // Manual record function
  const record = async (type: EventType, newState: any = currentState, customLabel?: string) => {
    await chronicleService.recordEvent(
      type,
      module,
      entityId,
      previousState.current,
      newState,
      customLabel || entityName
    );
    previousState.current = JSON.parse(JSON.stringify(newState));
  };

  // Auto tracking
  useEffect(() => {
    if (!autoTrack) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousState.current = JSON.parse(JSON.stringify(currentState));
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const hasChanged = JSON.stringify(previousState.current) !== JSON.stringify(currentState);
      
      if (hasChanged) {
        record(EventType.UPDATED, currentState);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentState, autoTrack, debounceMs]);

  return { recordEvent: record };
};