'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { useChaosEngine, useChaosSnap } from '../../hooks/useChaosEngine';

export { ChaosEventEmitter } from '../../lib/chaosEvents';

type MagneticOffset = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  floatX: number;
  floatY: number;
  duration: number;
};

const RESTING_OFFSET: MagneticOffset = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  floatX: 0,
  floatY: 0,
  duration: 4,
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function ChaosGlobalState({ children }: { children: ReactNode }) {
  const chaosState = useChaosEngine();

  return (
    <motion.div
      animate={{ rotate: chaosState === 'loki' ? 180 : 0 }}
      transition={{ duration: 1.5, type: 'spring', bounce: 0.4 }}
      className="w-full min-h-screen relative flex flex-col"
    >
      {children}
    </motion.div>
  );
}

interface ThanosSnapTargetProps {
  children: ReactNode;
  forceKeep?: boolean;
  /** Inverts the shared Thanos decision for paired targets such as logo and avatar. */
  invert?: boolean;
}

export function ThanosSnapTarget({ children, forceKeep = false, invert = false }: ThanosSnapTargetProps) {
  const { chaosState, shouldSnap: effectiveSnap } = useChaosSnap(forceKeep, invert);
  const prefersReducedMotion = useReducedMotion();
  const targetRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const seed = useMemo(() => hashString(reactId), [reactId]);
  const [magneticOffset, setMagneticOffset] = useState<MagneticOffset>(RESTING_OFFSET);

  useEffect(() => {
    if (chaosState !== 'magneto' || forceKeep) return;

    // Magneto respects prefersReducedMotion by reducing intensity, not disabling entirely.
    // Users with "reduce motion" enabled still see the effect, just at 30% of normal magnitude.
    const reducedIntensity = prefersReducedMotion ? 0.3 : 1;
    const reducedFloat = prefersReducedMotion ? 0.75 : 1;

    const updateMagneticOffset = () => {
      const rect = targetRef.current?.getBoundingClientRect();
      if (!rect) return;

      const elementX = rect.left + rect.width / 2;
      const elementY = rect.top + rect.height / 2;
      const vectorX = window.innerWidth / 2 - elementX;
      const vectorY = window.innerHeight / 2 - elementY;
      const distance = Math.hypot(vectorX, vectorY) || 1;
      const magnitude = (35 + (seed % 40)) * reducedIntensity;
      const rotation = (((seed >>> 8) % 801) / 100 - 4) * reducedIntensity;
      const scaleVal = 0.95 + ((seed >>> 12) % 15) / 100;

      setMagneticOffset({
        x: (vectorX / distance) * magnitude,
        y: (vectorY / distance) * magnitude,
        rotate: rotation,
        scale: scaleVal,
        floatX: (2.5 + ((seed >>> 16) % 35) / 10) * reducedFloat,
        floatY: (2.5 + ((seed >>> 20) % 35) / 10) * reducedFloat,
        duration: 3 + ((seed >>> 12) % 20) / 10,
      });
    };

    updateMagneticOffset();
    window.addEventListener('resize', updateMagneticOffset);
    return () => window.removeEventListener('resize', updateMagneticOffset);
  }, [chaosState, forceKeep, prefersReducedMotion, seed]);

  // Magneto stays active even when prefersReducedMotion is true; intensity is reduced instead.
  const magnetoActive = chaosState === 'magneto' && !forceKeep;

  return (
    <div
      ref={targetRef}
      className="relative inline-flex w-auto h-auto"
      data-chaos-target="true"
      data-chaos-mode={chaosState}
      data-force-keep={forceKeep ? 'true' : 'false'}
    >
      <motion.div
        animate={{
          opacity: chaosState === 'thanos' && effectiveSnap ? 0.05 : 1,
          x: magnetoActive ? magneticOffset.x : 0,
          y: magnetoActive ? magneticOffset.y : 0,
          rotate: chaosState === 'loki' ? 180 : magnetoActive ? magneticOffset.rotate : 0,
          scale: magnetoActive ? magneticOffset.scale : 1,
        }}
        transition={{
          opacity: { duration: 2.5, ease: [0.25, 0.1, 0.25, 1] },
          x: { duration: 0.9, ease: 'easeInOut' },
          y: { duration: 0.9, ease: 'easeInOut' },
          scale: { duration: 0.9, ease: 'easeInOut' },
          rotate: chaosState === 'loki'
            ? { duration: 2.5, type: 'spring', bounce: 0.3 }
            : { duration: 0.9, ease: 'easeInOut' },
        }}
        className="inline-flex w-auto h-auto"
      >
        <motion.div
          animate={magnetoActive ? {
            x: [0, magneticOffset.floatX, 0, -magneticOffset.floatX, 0],
            y: [0, -magneticOffset.floatY, 0, magneticOffset.floatY, 0],
          } : { x: 0, y: 0 }}
          transition={magnetoActive ? {
            duration: magneticOffset.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          } : { duration: 0.6, ease: 'easeInOut' }}
          className="inline-flex w-auto h-auto"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
