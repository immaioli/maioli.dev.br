'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { doctorDoomFont, heroNameFont } from '../../app/fonts';
import { ChaosEventEmitter, type ChaosEventDetail } from '../../lib/chaosEvents';

// Total cycle budget: 2.0s expand + 3.0s message + 1.0s gap +
// (4 ticks × 0.8s + 0.35s hold) + 0.14s crack + 2.0s retract ≈ 11.7s end-to-end.
//
// Phase timeline (data-phase attribute exposed for tests):
//   'expanding'  : fog circle expanding from capsule origin
//   'message'    : only the "Esse é o fim?" text, MESSAGE_DURATION_MS long
//   'gap'        : clean fog screen for MESSAGE_GAP_MS, dramatic breath before countdown
//   'counting'   : numbers 3 → 2 → 1 → 0, each visible for COUNTDOWN_STEP_MS
//   'cracking'   : brief 140ms visual impact on the fog (scale 1.04 shock)
//   'retracting' : fog + vortex collapse back into the capsule
//
// Adjusting one constant scales only that phase; the countdown schedule
// derives from COUNTDOWN_STEP_MS so adding or removing a tick keeps the
// per-number cadence steady instead of packing numbers into a fixed window.
const FOG_EXPAND_MS = 2000;
const FOG_RETRACT_MS = 2000;
// How long the message "Esse é o fim?" sits on screen alone (no countdown).
// User feedback round 2: the message should be readable, then disappear.
const MESSAGE_DURATION_MS = 3000;
// Brief empty screen between message disappearing and countdown starting.
// Dramatic breath that emphasizes "the doom is real" before the numbers tick.
const MESSAGE_GAP_MS = 1000;
const COUNTDOWN_FROM = 3;
const COUNTDOWN_TO = 0;
// Number of ticks including the final 0 (3,2,1,0 → 4 values).
const COUNTDOWN_TICKS = COUNTDOWN_FROM - COUNTDOWN_TO + 1;
const COUNTDOWN_STEP_MS = 800;
// Hold the final countdown tick ("0") briefly so the user actually sees it
// before the message and countdown unmount on the crack transition.
const COUNTDOWN_FINAL_HOLD_MS = 350;
const REDUCED_MOTION_MS = 250;
// Brief visual impact moment between countdown end and retract start.
// Kept short on purpose — the user requested no hold; the vortex collapses
// back into the capsule as the fog retracts.
const CRACK_SHOCK_MS = 140;

type FogPhase = 'expanding' | 'message' | 'gap' | 'counting' | 'cracking' | 'retracting';

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
  const [crackShock, setCrackShock] = useState(false);
  const expandDuration = prefersReducedMotion ? REDUCED_MOTION_MS : FOG_EXPAND_MS;
  const retractDuration = prefersReducedMotion ? REDUCED_MOTION_MS : FOG_RETRACT_MS;

  useEffect(() => {
    const updateGeometry = () => setGeometry(getFogGeometry(run));
    window.addEventListener('resize', updateGeometry);
    return () => window.removeEventListener('resize', updateGeometry);
  }, [run]);

  useEffect(() => {
    if (phase !== 'expanding' || cancelRequested) return;
    const timer = window.setTimeout(() => setPhase('message'), expandDuration);
    return () => window.clearTimeout(timer);
  }, [cancelRequested, expandDuration, phase]);

  useEffect(() => {
    if (phase !== 'message' || cancelRequested) return;
    const timer = window.setTimeout(() => setPhase('gap'), MESSAGE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [cancelRequested, phase]);

  useEffect(() => {
    if (phase !== 'gap' || cancelRequested) return;
    const timer = window.setTimeout(() => {
      setCountdown(COUNTDOWN_FROM);
      setPhase('counting');
    }, MESSAGE_GAP_MS);
    return () => window.clearTimeout(timer);
  }, [cancelRequested, phase]);

  useEffect(() => {
    if (phase !== 'counting' || cancelRequested) return;

    // Schedule one tick per countdown value from COUNTDOWN_FROM down to
    // COUNTDOWN_TO (inclusive). The final tick ("0") gets a small hold so
    // the user actually sees it before the crack transition unmounts the
    // countdown node — otherwise "0" would be set and replaced in the
    // same React batch and never render.
    const tickTimers: number[] = [];
    for (let i = 1; i < COUNTDOWN_TICKS; i += 1) {
      const value = COUNTDOWN_FROM - i;
      tickTimers.push(
        window.setTimeout(() => setCountdown(value), i * COUNTDOWN_STEP_MS),
      );
    }

    const lastTickMs = (COUNTDOWN_TICKS - 1) * COUNTDOWN_STEP_MS;
    const crack = window.setTimeout(
      () => setPhase('cracking'),
      lastTickMs + COUNTDOWN_FINAL_HOLD_MS,
    );

    return () => {
      tickTimers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(crack);
    };
  }, [cancelRequested, phase]);

  useEffect(() => {
    if (phase !== 'cracking' || cancelRequested) return;

    if (!prefersReducedMotion) {
      queueMicrotask(() => setCrackShock(true));
      const shockTimer = window.setTimeout(() => setCrackShock(false), CRACK_SHOCK_MS);
      const retract = window.setTimeout(() => setPhase('retracting'), CRACK_SHOCK_MS);

      return () => {
        window.clearTimeout(shockTimer);
        window.clearTimeout(retract);
      };
    }

    const retract = window.setTimeout(() => setPhase('retracting'), CRACK_SHOCK_MS);
    return () => {
      window.clearTimeout(retract);
    };
  }, [cancelRequested, phase, prefersReducedMotion]);

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
  const shockRadius = geometry.radius + 24;
  const shockClip = `circle(${shockRadius}px at ${geometry.x}px ${geometry.y}px)`;
  const expandedClip = crackShock
    ? shockClip
    : `circle(${geometry.radius}px at ${geometry.x}px ${geometry.y}px)`;
  const messageVisible = effectivePhase === 'message';
  const countdownVisible = effectivePhase === 'counting';

  // During retraction, the fog's radial gradient inverts into a bright
  // condensation pulse concentrated at the origin (the capsule), fading to
  // nothing at the edges. Combined with the clipPath shrinking and the entire
  // fog scaling toward the origin point, this gives a clear "the energy
  // condensed back into the capsule" visual. framer-motion owns the transform
  // (scale + transformOrigin) so it actually animates, while clipPath is
  // interpolated on the same timeline.
  const isRetracting = effectivePhase === 'retracting' && !prefersReducedMotion;
  // Deep emerald fog - heavy enough to fully obscure the page through the
  // blur+saturate backdrop. Mid stops stay > 0.6 so the underlying content
  // reads only as a smeared silhouette, never as legible detail.
  const fogBackground = isRetracting
    ? `radial-gradient(circle at ${geometry.x}px ${geometry.y}px, rgba(180,255,220,0.85) 0%, rgba(120,200,170,0.55) 25%, rgba(80,150,130,0.25) 55%, rgba(40,80,70,0) 100%)`
    : `radial-gradient(circle at ${geometry.x}px ${geometry.y}px, rgba(6,78,59,0.92) 0%, rgba(6,78,59,0.85) 35%, rgba(4,55,42,0.80) 70%, rgba(2,30,22,0.78) 100%)`;

  return (
    <motion.div
      data-testid="doctor-doom-fog"
      data-phase={effectivePhase}
      data-origin-x={geometry.x.toFixed(2)}
      data-origin-y={geometry.y.toFixed(2)}
      className="fixed inset-0 z-100 pointer-events-none overflow-hidden"
      style={{
        transformOrigin: `${geometry.x}px ${geometry.y}px`,
      }}
      initial={{
        clipPath: collapsedClip,
        scale: prefersReducedMotion ? 1 : 0.12,
        opacity: prefersReducedMotion ? 0 : 1,
      }}
      animate={{
        clipPath: effectivePhase === 'retracting' ? collapsedClip : expandedClip,
        scale: effectivePhase === 'retracting'
          ? 0.12
          : crackShock
            ? 1.04
            : 1,
        opacity: effectivePhase === 'retracting' && prefersReducedMotion ? 0 : 1,
      }}
      exit={{
        clipPath: collapsedClip,
        scale: 0.12,
        opacity: 0,
      }}
      transition={{
        clipPath: {
          duration: (effectivePhase === 'retracting'
            ? retractDuration
            : crackShock
              ? CRACK_SHOCK_MS
              : expandDuration) / 1000,
          ease: 'easeInOut',
        },
        scale: {
          duration: (effectivePhase === 'retracting'
            ? retractDuration
            : crackShock
              ? CRACK_SHOCK_MS
              : expandDuration) / 1000,
          ease: 'easeInOut',
        },
        opacity: { duration: REDUCED_MOTION_MS / 1000 },
      }}
    >
      <div
        className="absolute inset-0 backdrop-blur-[96px] backdrop-saturate-50 backdrop-contrast-90"
        style={{
          background: fogBackground,
          transformOrigin: `${geometry.x}px ${geometry.y}px`,
        }}
      />
      <div className="absolute inset-0 bg-emerald-950/55" />
      <div className="absolute inset-0 bg-black/10" />


      {/* Galactic vortex: animated spiral that appears during retraction and
          is "sucked back" into the capsule as the parent's clipPath shrinks
          to circle(0) at the origin point. */}

      {effectivePhase === 'retracting' && (
        <DoctorDoomVortex
          phase={effectivePhase}
          origin={geometry}
          reducedMotion={prefersReducedMotion ?? false}
        />
      )}

      <AnimatePresence>
        {(messageVisible || countdownVisible) && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: 'easeOut' }}
          >
            {messageVisible && (
            <h2
              data-testid="doctor-doom-message"
              className={`${heroNameFont.className} uppercase tracking-[0.08em] text-white leading-none font-semibold`}
              style={{
                fontSize: 'clamp(2.2rem, 5.2vw, 4.375rem)',
                textShadow: '0 0 32px rgba(20,30,40,0.55), 0 0 64px rgba(5,80,60,0.35)',
              }}
            >
              {message}
            </h2>
            )}
            {/* Countdown is gated by countdownVisible so it can outlive the message:
                the container stays mounted across message -> gap -> counting,
                the message unmounts during "gap", and the countdown mounts
                on the first tick of the "counting" phase. */}
            {countdownVisible && (
              <motion.div
                key={countdown}
                data-testid="doctor-doom-countdown"
                className={`${heroNameFont.className} text-white leading-none font-semibold`}
                style={{
                  fontSize: 'clamp(6rem, 22vw, 18.75rem)',
                  textShadow: '0 0 48px rgba(20,30,40,0.65), 0 0 96px rgba(5,80,60,0.45)',
                }}
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0.15 : 0.4, ease: 'easeOut' }}
              >
                {countdown}
            </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// DoctorDoomVortex
// ---------------------------------------------------------------------------
// A multi-layer animated spiral that appears during the impact and collapses
// back into the capsule during retraction. Rendered inside the parent fog
// container so it inherits the scale + clipPath animation that pulls
// everything toward the origin.
//
// Layers (bottom -> top):
//   1. Halo: large radial gradient emerald veil behind the spiral arms
//   2. Spiral arms: 3 SVG arcs rotating at different speeds (logarithmic
//      spiral shape approximates the galactic arms in the reference image)
//   3. Particle rings: 5 concentric rings of small circles; each ring
//      rotates at a different speed to create the "being sucked in" motion
//   4. Singularity: bright green-white core at the geometric center
//
// All layers collapse to scale 0.55 + opacity 0 during the retract phase,
// mirroring the parent fog animation so the entire vortex is visibly
// "pulled into" the capsule origin.
//
// Accessibility:
//   - aria-hidden: the vortex is purely decorative
//   - prefers-reduced-motion: all rotations and stagger animations are
//     skipped; only the static gradient layers are shown

type VortexPhase = 'cracking' | 'retracting';

function DoctorDoomVortex({
  phase,
  origin,
  reducedMotion,
}: {
  phase: VortexPhase;
  origin: FogGeometry;
  reducedMotion: boolean;
}) {
  const isRetracting = phase === 'retracting';

  // Deterministic particle positions (Mulberry32 PRNG) so the ring layout
  // is identical across renders and SSR/hydration doesn't disagree.
  // 5 rings * 8-16 particles each = 60 particles total (cheap for SVG).
  const rings = buildVortexRings();

  // The parent's clipPath + scale animation already handles the
  // "vortex sucked back into capsule" visual (clipPath shrinks to
  // circle(0) at the origin point while scale drops to 0.12). Keeping
  // the vortex at full opacity during retract lets the parent's own
  // animation reveal the collapse naturally — no separate fade needed.
  //
  // Reduced motion: show the vortex statically at opacity 0.85, no scale
  // change. The parent still clips it away when fog retracts.
  const collapseScale = isRetracting ? 1 : 1;
  const targetOpacity = reducedMotion ? 0.85 : 1;
  const enterDuration = reducedMotion ? 0.2 : 0.25;

  return (
    <motion.div
      data-testid="doctor-doom-vortex"
      data-phase={phase}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
      animate={{
        opacity: targetOpacity,
        scale: collapseScale,
      }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{
        opacity: { duration: enterDuration, ease: 'easeOut' },
        scale: { duration: enterDuration, ease: 'easeOut' },
      }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-50 -50 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Outer halo: large soft emerald glow that sits behind the arms */}
          <radialGradient id="doom-vortex-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(180,255,220,0.55)" />
            <stop offset="35%" stopColor="rgba(80,220,160,0.32)" />
            <stop offset="70%" stopColor="rgba(16,120,90,0.18)" />
            <stop offset="100%" stopColor="rgba(2,40,28,0)" />
          </radialGradient>
          {/* Spiral arm gradient: bright inner edge, fading outward */}
          <linearGradient id="doom-vortex-arm" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(220,255,235,0.95)" />
            <stop offset="100%" stopColor="rgba(120,220,170,0.05)" />
          </linearGradient>
          {/* Singularity core: bright white-green center */}
          <radialGradient id="doom-vortex-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(240,255,248,1)" />
            <stop offset="40%" stopColor="rgba(180,255,210,0.9)" />
            <stop offset="100%" stopColor="rgba(80,200,150,0)" />
          </radialGradient>
          {/* Soft blur for the spiral arms */}
          <filter id="doom-vortex-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* Layer 1: outer halo (full screen) */}
        <rect x="-50" y="-50" width="100" height="100" fill="url(#doom-vortex-halo)" />

        {/* Layer 2: three spiral arms, each rotating at a different speed */}
        <g filter="url(#doom-vortex-blur)">
          <motion.g
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 7, repeat: Infinity, ease: 'linear' }
            }
            style={{ transformOrigin: '0 0' }}
          >
            <path
              d="M 0 0 Q 18 -8 30 -2 Q 40 4 44 14"
              fill="none"
              stroke="url(#doom-vortex-arm)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </motion.g>
          <motion.g
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 9, repeat: Infinity, ease: 'linear' }
            }
            style={{ transformOrigin: '0 0' }}
          >
            <path
              d="M 0 0 Q -18 8 -30 2 Q -40 -4 -44 -14"
              fill="none"
              stroke="url(#doom-vortex-arm)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>
          <motion.g
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 11, repeat: Infinity, ease: 'linear' }
            }
            style={{ transformOrigin: '0 0' }}
          >
            <path
              d="M 0 0 Q 6 22 0 32 Q -6 42 -16 44"
              fill="none"
              stroke="url(#doom-vortex-arm)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </motion.g>
        </g>

        {/* Layer 3: five concentric particle rings, each rotating at its
            own speed. Each particle is a small static circle; only the
            parent <g> animates rotation. This is far cheaper than animating
            each circle independently. */}
        <g>
          {rings.map((ring) => (
            <motion.g
              key={ring.radius}
              animate={
                reducedMotion
                  ? undefined
                  : { rotate: ring.direction === 'cw' ? 360 : -360 }
              }
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: ring.duration,
                      repeat: Infinity,
                      ease: 'linear',
                    }
              }
              style={{ transformOrigin: '0 0' }}
            >
              {ring.particles.map((particle, i) => (
                <circle
                  key={i}
                  cx={particle.x}
                  cy={particle.y}
                  r={particle.size}
                  fill={
                    ring.radius <= 18
                      ? 'rgba(240,255,248,0.95)'
                      : ring.radius <= 32
                        ? 'rgba(180,255,210,0.85)'
                        : 'rgba(140,230,180,0.6)'
                  }
                />
              ))}
            </motion.g>
          ))}
        </g>

        {/* Layer 4: central singularity — bright pulsing core.
            Pulses scale 1 -> 1.18 -> 1 to simulate the breathing of the
            singularity during the impact moment. Stops pulsing once the
            retract begins (the parent's clipPath takes over the visual). */}
        <motion.circle
          cx="0"
          cy="0"
          r="9"
          fill="url(#doom-vortex-core)"
          animate={
            reducedMotion || isRetracting
              ? { scale: 1 }
              : { scale: [1, 1.18, 1] }
          }
          transition={
            reducedMotion || isRetracting
              ? { duration: 0 }
              : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ transformOrigin: '0 0' }}
        />
      </svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Vortex particle ring builder
// ---------------------------------------------------------------------------

type VortexParticle = { x: number; y: number; size: number };
type VortexRing = {
  radius: number;
  duration: number;
  direction: 'cw' | 'ccw';
  particles: VortexParticle[];
};

// Mulberry32 PRNG - deterministic across renders so SSR matches hydration.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildVortexRings(): VortexRing[] {
  const ringConfigs: Array<{
    radius: number;
    count: number;
    duration: number;
    direction: 'cw' | 'ccw';
    particleSize: number;
    radialJitter: number;
  }> = [
    { radius: 12, count: 8, duration: 6, direction: 'cw', particleSize: 0.7, radialJitter: 1.2 },
    { radius: 22, count: 10, duration: 8, direction: 'ccw', particleSize: 0.55, radialJitter: 1.8 },
    { radius: 32, count: 12, duration: 10, direction: 'cw', particleSize: 0.45, radialJitter: 2.2 },
    { radius: 40, count: 14, duration: 12, direction: 'ccw', particleSize: 0.35, radialJitter: 2.6 },
    { radius: 46, count: 16, duration: 14, direction: 'cw', particleSize: 0.28, radialJitter: 3 },
  ];

  const rng = mulberry32(0x444f4f4d); // 'DOOM' as ASCII hex seed
  return ringConfigs.map((cfg) => {
    const particles: VortexParticle[] = [];
    const angleStep = (Math.PI * 2) / cfg.count;
    for (let i = 0; i < cfg.count; i++) {
      const angle = i * angleStep + (rng() - 0.5) * 0.25;
      const radius = cfg.radius + (rng() - 0.5) * cfg.radialJitter;
      particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: cfg.particleSize * (0.8 + rng() * 0.4),
      });
    }
    return {
      radius: cfg.radius,
      duration: cfg.duration,
      direction: cfg.direction,
      particles,
    };
  });
}
