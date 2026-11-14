"use client";

import {
  motion,
  useReducedMotion,
  useTime,
  useTransform,
  type MotionValue,
} from "motion/react";

type WavyTextProps = {
  text: string;
  className?: string;
  amplitude?: number;
  speed?: number;
  phase?: number;
};

export function WavyText({
  text,
  className,
  amplitude = 0.4,
  speed = 0.002,
  phase = 0.35,
}: WavyTextProps) {
  const time = useTime();
  const reduceMotion = useReducedMotion();

  return (
    <span
      aria-label={text}
      className={`inline-flex items-baseline ${className ?? ""}`}
    >
      {Array.from(text).map((char, index) => (
        <WaveChar
          key={`${char}-${index}`}
          char={char}
          index={index}
          time={time}
          amplitude={amplitude}
          speed={speed}
          phase={phase}
          reduceMotion={Boolean(reduceMotion)}
        />
      ))}
    </span>
  );
}

function WaveChar({
  char,
  index,
  time,
  amplitude,
  speed,
  phase,
  reduceMotion,
}: {
  char: string;
  index: number;
  time: MotionValue<number>;
  amplitude: number;
  speed: number;
  phase: number;
  reduceMotion: boolean;
}) {
  const y = useTransform(time, (value) =>
    reduceMotion
      ? 0
      : Math.sin(value * speed + index * phase) * amplitude,
  );
  const rotate = useTransform(time, (value) =>
    reduceMotion
      ? 0
      : Math.cos(value * speed + index * phase) * amplitude * 0.6,
  );

  return (
    <motion.span
      aria-hidden
      style={{ y, rotate }}
      className="inline-block will-change-transform"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}
