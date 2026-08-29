// Centralized event emitter for chaos engine state changes.
// Extracted here to avoid circular imports between ChaosEngine.tsx and useChaosEngine.ts.

export type ChaosEventType = 'thanos' | 'loki' | 'doctor-doom' | 'magneto' | 'universe';

export interface ChaosEventDetail {
  sourceId?: string;
  origin?: {
    x: number;
    y: number;
  };
}

type Listener = (type: ChaosEventType, detail?: ChaosEventDetail) => void;

const listeners = new Set<Listener>();

export const ChaosEventEmitter = {
  emit(type: ChaosEventType, detail?: ChaosEventDetail) {
    listeners.forEach((listener) => listener(type, detail));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
