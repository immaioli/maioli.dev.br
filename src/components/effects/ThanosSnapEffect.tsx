'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThanosSnapEffect({
  isTriggered,
  children,
  onComplete
}: {
  isTriggered: boolean;
  children: React.ReactNode;
  onComplete?: () => void;
}) {
  const [isDisintegrating, setIsDisintegrating] = useState(false);
  const [isDust, setIsDust] = useState(false);

  useEffect(() => {
    // Only trigger if going from false to true to prevent loops
    if (isTriggered && !isDisintegrating && !isDust) {
      setIsDisintegrating(true);

      // Animação leva cerca de 2 segundos
      setTimeout(() => {
        setIsDust(true);
        if (onComplete) onComplete();
      }, 2000);

      // Restaura após alguns segundos para permitir uso novamente (efeito Jóia do Tempo)
      setTimeout(() => {
        setIsDisintegrating(false);
        setIsDust(false);
      }, 7500);
    }
  }, [isTriggered, isDisintegrating, isDust, onComplete]);

  return (
    <div className="w-full relative">
      {/* Elemento original */}
      <motion.div
        animate={
          isDisintegrating || isDust
            ? { opacity: 0, filter: 'blur(10px)', scale: 0.95 }
            : { opacity: 1, filter: 'blur(0px)', scale: 1 }
        }
        transition={{ duration: 1.5, ease: 'easeIn' }}
        className="w-full relative z-10"
      >
        {children}
      </motion.div>

      {/* Partículas do pó */}
      {isDisintegrating && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-visible">
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 1,
                scale: Math.random() * 2 + 0.5
              }}
              animate={{
                x: `+=${Math.random() * 200 - 100}%`,
                y: `-=${Math.random() * 200 + 100}%`,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                ease: 'easeOut',
                delay: Math.random() * 0.5
              }}
              className="absolute w-2 h-2 rounded-full bg-yellow-600/80"
              style={{
                boxShadow: '0 0 15px rgba(255,215,0,1)'
              }}
            />
          ))}
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={`dark-${i}`}
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0.9,
                scale: Math.random() * 1.5 + 0.5
              }}
              animate={{
                x: `+=${Math.random() * 200 - 100}%`,
                y: `-=${Math.random() * 100 + 50}%`,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 1.5 + 1,
                ease: 'easeOut',
                delay: Math.random() * 0.8
              }}
              className="absolute w-1.5 h-1.5 rounded-sm bg-gray-900"
            />
          ))}
        </div>
      )}
    </div>
  );
}