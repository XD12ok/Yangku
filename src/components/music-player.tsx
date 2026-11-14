"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { siteConfig } from "@/config";
import { createAmbientLoop } from "@/lib/ambient";

export type MusicPlayerHandle = {
  play: () => void;
};

export const MusicPlayer = forwardRef<MusicPlayerHandle>(
  function MusicPlayer(_props, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const ambientRef = useRef<ReturnType<typeof createAmbientLoop> | null>(
      null,
    );
    const synthRef = useRef(false);
    const [playing, setPlaying] = useState(false);
    const [synth, setSynth] = useState(false);

    const startAmbient = useCallback(async () => {
      if (!ambientRef.current) {
        ambientRef.current = createAmbientLoop();
      }

      try {
        await ambientRef.current.start();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }, []);

    const play = useCallback(async () => {
      const audio = audioRef.current;

      if (audio && !synthRef.current) {
        try {
          audio.volume = 0.55;
          await audio.play();
          setPlaying(true);
          return;
        } catch {
          synthRef.current = true;
          setSynth(true);
        }
      }

      await startAmbient();
    }, [startAmbient]);

    const pause = useCallback(() => {
      audioRef.current?.pause();
      ambientRef.current?.stop();
      setPlaying(false);
    }, []);

    const toggle = useCallback(() => {
      if (playing) {
        pause();
      } else {
        void play();
      }
    }, [pause, play, playing]);

    useImperativeHandle(ref, () => ({ play }), [play]);

    useEffect(() => {
      const audio = audioRef.current;

      return () => {
        audio?.pause();
        ambientRef.current?.dispose();
      };
    }, []);

    return (
      <>
        <audio
          ref={audioRef}
          src={siteConfig.music.src}
          loop
          preload="auto"
          onError={() => {
            synthRef.current = true;
            setSynth(true);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        <motion.button
          type="button"
          onClick={toggle}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.02 }}
          aria-label={playing ? "Jeda musik" : "Putar musik"}
          className="music-dock fixed z-40 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-petal/50 bg-cream/85 py-2 pl-2 pr-4 shadow-[0_12px_30px_-12px_rgba(74,47,54,0.45)] backdrop-blur-md"
        >
          <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-petal to-wine text-cream">
            <AnimatePresence mode="wait" initial={false}>
              {playing ? (
                <motion.svg
                  key="pause"
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="currentColor"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.16 }}
                >
                  <rect x="6" y="5" width="4" height="14" rx="1.2" />
                  <rect x="14" y="5" width="4" height="14" rx="1.2" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="play"
                  viewBox="0 0 24 24"
                  className="ml-0.5 size-4"
                  fill="currentColor"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.16 }}
                >
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.8l-10-6.5A1 1 0 0 0 8 5.5Z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </span>

          <span className="min-w-0 text-left">
            <span className="block truncate font-script text-lg leading-tight text-wine">
              {siteConfig.music.title}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-mauve/70">
              {synth ? "ambient" : siteConfig.music.artist}
            </span>
          </span>
        </motion.button>
      </>
    );
  },
);
