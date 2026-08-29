'use client';
import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { ChaosEventEmitter } from '../lib/chaosEvents';

export type ChaosMode = 'normal' | 'thanos' | 'loki' | 'doctor-doom' | 'magneto';

/**
 * Shared hook for managing Chaos Engine state.
 * Centralizes ChaosEventEmitter subscription, eliminating duplicated code
 * across ChaosGlobalState, ThanosSnapTarget, and ThemeSwitcher.
 */
export function useChaosEngine(): ChaosMode {
  const [chaosState, setChaosState] = useState<ChaosMode>('normal');

  useEffect(() => {
    const unsubscribe = ChaosEventEmitter.subscribe((type) => {
      if (type === 'universe') {
        setChaosState('normal');
      } else {
        setChaosState(type);
      }
    });
    return unsubscribe;
  }, []);

  return chaosState;
}

/* ------------------------------------------------------------------
 * Shared snap context — ensures all ThanosSnapTargets in a subtree
 * share the SAME random decision when Thanos fires.
 * ------------------------------------------------------------------ */

interface SnapContextValue {
  chaosState: ChaosMode;
  shouldSnap: boolean; // shared random decision for the whole subtree
}

const SnapContext = createContext<SnapContextValue>({
  chaosState: 'normal',
  shouldSnap: false,
});

/**
 * Provider that listens to ChaosEventEmitter and generates ONE random
 * snap decision shared by all ThanosSnapTargets in the subtree.
 * Used in Header to guarantee logo XOR avatar (not independent rolls).
 */
export function SnapProvider({ children }: { children: ReactNode }) {
  const [chaosState, setChaosState] = useState<ChaosMode>('normal');
  const [shouldSnap, setShouldSnap] = useState(false);

  useEffect(() => {
    const unsubscribe = ChaosEventEmitter.subscribe((type) => {
      setChaosState(type === 'universe' ? 'normal' : type);
      if (type === 'thanos') {
        setShouldSnap(Math.random() > 0.5); // single roll for entire subtree
      } else if (type === 'universe') {
        setShouldSnap(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ chaosState, shouldSnap }), [chaosState, shouldSnap]);

  return <SnapContext.Provider value={value}>{children}</SnapContext.Provider>;
}

/**
 * Extended hook that manages snap (disappearance) state.
 * If a SnapProvider ancestor exists, uses the shared random decision.
 * Otherwise rolls independently (for standalone targets like capsules).
 */
export function useChaosSnap(forceKeep: boolean, invert = false): { chaosState: ChaosMode; shouldSnap: boolean } {
  const ctx = useContext(SnapContext);
  const [localSnap, setLocalSnap] = useState(false);
  const [localChaos, setLocalChaos] = useState<ChaosMode>('normal');

  // Standalone mode (no SnapProvider ancestor)
  useEffect(() => {
    const unsubscribe = ChaosEventEmitter.subscribe((type) => {
      setLocalChaos(type === 'universe' ? 'normal' : type);
      if (type === 'thanos') {
        setLocalSnap(!forceKeep && Math.random() > 0.5);
      } else if (type === 'universe') {
        setLocalSnap(false);
      }
    });
    return unsubscribe;
  }, [forceKeep]);

  // Use provider context when available, local state otherwise
  const chaosState = ctx.chaosState !== 'normal' ? ctx.chaosState : localChaos;
  const rawSnap = ctx.chaosState !== 'normal' ? ctx.shouldSnap : localSnap;
  const shouldSnap = invert ? !rawSnap : rawSnap;

  return { chaosState, shouldSnap };
}
