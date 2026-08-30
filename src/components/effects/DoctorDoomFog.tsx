'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { doctorDoomFont } from '../../app/fonts';
import { ChaosEventEmitter, type ChaosEventDetail } from '../../lib/chaosEvents';

const FOG_EXPAND_MS = 1800;
const FOG_RETRACT_MS = 1500;
const REDUCED_MOTION_MS = 250;
const COUNTDOWN_FROM = 3;

type FogPhase = 'expanding' | 'counting' | 'retracting';

type FogRun = {
  id: number;
  sourceId?: string;
  origin: { x: number; y: number };
};

type FogGeometry = {
  x: number;
  y: number;
  radius: number;
};

function readSourceOrigin(sourceId: string | undefined, fallback: FogRun['origin']) {
  if (!sourceId) return fallback;
  const source = document.getElementById(sourceId);
  if (!source) return fallback;
  const rect = source.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function getFogGeometry(run: FogRun): FogGeometry {
  const origin = readSourceOrigin(run.sourceId, run.origin);
  const horizontalRadius = Math.max(origin.x, window.innerWidth - origin.x);
  const verticalRadius = Math.max(origin.y, window.innerHeight - origin.y);

  return {
    ...origin,
    radius: Math.hypot(horizontalRadius, verticalRadius) + 48,
  };
}

export default function DoctorDoomFog({ message }: { message?: string }) {
  const [run, setRun] = useState<FogRun | null>(null);
  const [cancelRequested, setCancelRequested] = useState(false);
  const activeRef = useRef(false);
  const runIdRef = useRef(0);

  useEffect(() => {
    return ChaosEventEmitter.subscribe((type, detail?: ChaosEventDetail) => {
      if (type === 'doctor-doom' && !activeRef.current) {
        activeRef.current = true;
        runIdRef.current += 1;
        setCancelRequested(false);
        setRun({
          id: runIdRef.current,
          sourceId: detail?.sourceId,
          origin: detail?.origin ?? {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          },
        });
      } else if (type === 'universe' && activeRef.current) {
        setCancelRequested(true);
      }
    });
  }, []);

  const dismiss = useCallback(() => {
    activeRef.current = false;
    setRun(null);
    setCancelRequested(false);
    ChaosEventEmitter.emit('universe');
  }, []);

  return (
    <AnimatePresence>
      {run && (
        <DoctorDoomFogInner
          key={run.id}
          run={run}
          message={message}
          cancelRequested={cancelRequested}
          onDone={dismiss}
        />
      )}
    </AnimatePresence>
  );
}

function DoctorDoomFogInner({
  run,
  message,
  cancelRequested,
  onDone,
}: {
  run: FogRun;
  message?: string;
  cancelRequested: boolean;
  onDone: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<FogPhase>('expanding');
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM);
  const [geometry, setGeometry] = useState<FogGeometry>(() => getFogGeometry(run));
  const expandDuration = prefersReducedMotion ? REDUCED_MOTION_MS : FOG_EXPAND_MS;
  const retractDuration = prefersReducedMotion ? REDUCED_MOTION_MS : FOG_RETRACT_MS;

  useEffect(() => {
    const updateGeometry = () => setGeometry(getFogGeometry(run));
    window.addEventListener('resize', updateGeometry);
    return () => window.removeEventListener('resize', updateGeometry);
  }, [run]);

  useEffect(() => {
    if (phase !== 'expanding' || cancelRequested) return;
    const timer = window.setTimeout(() => setPhase('counting'), expandDuration);
    return () => window.clearTimeout(timer);
  }, [cancelRequested, expandDuration, phase]);

  useEffect(() => {
    if (phase !== 'counting' || cancelRequested) return;

    const second = window.setTimeout(() => setCountdown(2), 1000);
    const third = window.setTimeout(() => setCountdown(1), 2000);
    const retract = window.setTimeout(() => setPhase('retracting'), 3000);

    return () => {
      window.clearTimeout(second);
      window.clearTimeout(third);
      window.clearTimeout(retract);
    };
  }, [cancelRequested, phase]);

  useEffect(() => {
    const effectivePhase = cancelRequested ? 'retracting' : phase;
    if (effectivePhase !== 'retracting') return;

    const frame = window.requestAnimationFrame(() => setGeometry(getFogGeometry(run)));
    const timer = window.setTimeout(onDone, retractDuration);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [cancelRequested, onDone, phase, retractDuration, run]);

  const effectivePhase: FogPhase = cancelRequested ? 'retracting' : phase;
  const collapsedClip = `circle(0px at ${geometry.x}px ${geometry.y}px)`;
  const expandedClip = `circle(${geometry.radius}px at ${geometry.x}px ${geometry.y}px)`;
  const messageVisible = effectivePhase === 'counting';

  // During retraction, the visual content scales down toward the origin point
  // in addition to the clipPath shrinking. This makes the "return to origin"
  // motion clearly perceptible (without the scale, the dark gradient collapsing
  // into its transparent center looks like a plain fade out).
  const retractionProgress =
    effectivePhase === 'retracting'
      ? prefersReducedMotion
        ? 0
        : 1
      : 0;
  const innerScale = 1 - 0.15 * retractionProgress;

  return (
    <motion.div
      data-testid="doctor-doom-fog"
      data-phase={effectivePhase}
      data-origin-x={geometry.x.toFixed(2)}
      data-origin-y={geometry.y.toFixed(2)}
      className="fixed inset-0 z-100 pointer-events-none overflow-hidden"
      initial={{
        clipPath: collapsedClip,
        opacity: prefersReducedMotion ? 0 : 1,
      }}
      animate={{
        clipPath: effectivePhase === 'retracting' ? collapsedClip : expandedClip,
        opacity: effectivePhase === 'retracting' && prefersReducedMotion ? 0 : 1,
      }}
      exit={{
        clipPath: collapsedClip,
        opacity: 0,
      }}
      transition={{
        clipPath: {
          duration: (effectivePhase === 'retracting' ? retractDuration : expandDuration) / 1000,
          ease: 'easeInOut',
        },
        opacity: { duration: REDUCED_MOTION_MS / 1000 },
      }}
    >
      <div
        className="absolute inset-0 backdrop-blur-[32px] backdrop-brightness-50"
        style={{
          background: `radial-gradient(circle at ${geometry.x}px ${geometry.y}px, rgba(148,163,184,0.16) 0%, rgba(2,44,34,0.92) 30%, rgba(0,12,9,0.99) 72%, rgba(0,5,4,1) 100%)`,
          transformOrigin: `${geometry.x}px ${geometry.y}px`,
          transform: `scale(${innerScale})`,
          transition: `transform ${retractDuration / 1000}s easeInOut`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.48)_0%,rgba(6,78,59,0.18)_42%,rgba(0,0,0,0.58)_100%)]" />

      <AnimatePresence>
        {messageVisible && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: 'easeOut' }}
          >
            <h2
              data-testid="doctor-doom-message"
              className={`${doctorDoomFont.className} text-5xl md:text-7xl uppercase tracking-[0.08em] text-white`}
              style={{ textShadow: '0 0 42px rgba(192,192,192,0.55), 0 0 80px rgba(5,150,105,0.45)' }}
            >
              {message}
            </h2>
            <motion.div
              key={countdown}
              data-testid="doctor-doom-countdown"
              className={`${doctorDoomFont.className} text-7xl md:text-9xl text-white`}
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.35 }}
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
