"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config";
import { WavyText } from "./wavy-text";

type Stage = "closed" | "opening" | "leaving";

type Props = {
  onBegin: () => void;
  onOpened: () => void;
};

export function EnvelopeGate({ onBegin, onOpened }: Props) {
  const [stage, setStage] = useState<Stage>("closed");
  const reduceMotion = useReducedMotion();
  const opened = stage !== "closed";

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (stage === "opening") {
      const timer = setTimeout(
        () => setStage("leaving"),
        reduceMotion ? 250 : 1050,
      );
      return () => clearTimeout(timer);
    }

    if (stage === "leaving") {
      const timer = setTimeout(onOpened, reduceMotion ? 120 : 620);
      return () => clearTimeout(timer);
    }
  }, [stage, reduceMotion, onOpened]);

  function handleOpen() {
    if (stage !== "closed") return;
    onBegin();
    setStage("opening");
  }

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6 ${
        stage === "leaving" ? "pointer-events-none" : ""
      }`}
      initial={{ opacity: 1 }}
      animate={stage === "leaving" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.6, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, #fff9f5 0%, #fde7ee 55%, #f6c3d0 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-24 size-56 rounded-full bg-white/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-24 size-64 rounded-full bg-petal/40 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-8 top-[18%] font-script text-3xl text-wine/20"
      >
        ♡
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-10 top-[26%] font-script text-xl text-wine/20"
      >
        ♡
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[24%] left-12 font-script text-2xl text-wine/15"
      >
        ♡
      </span>

      <div className="relative flex w-full max-w-[330px] flex-col items-center gap-9 text-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.42em] text-wine/70"
          >
            {siteConfig.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-3 font-script text-[42px] leading-none text-wine"
          >
            Untuk <WavyText text={siteConfig.to} amplitude={4} speed={0.002} />
          </motion.h2>
        </div>

        <motion.button
          type="button"
          onClick={handleOpen}
          disabled={stage !== "closed"}
          aria-label="Buka kenangan"
          whileTap={{ scale: 0.97 }}
          className="relative block rounded-[26px] outline-none focus-visible:ring-4 focus-visible:ring-white/70"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            animate={opened ? { y: -8 } : { y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="relative h-[200px] w-[290px] max-w-full"
          >
            <motion.div
              aria-hidden
              className="absolute inset-x-6 top-4 z-10 h-[152px] rounded-xl border border-white/70 bg-gradient-to-b from-[#fffdf9] to-[#fff1e9] px-5 py-4 text-left shadow-md"
              animate={
                opened ? { y: -52, scale: 1.03 } : { y: 10, scale: 1 }
              }
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 15,
                delay: opened ? 0.15 : 0,
              }}
            >
              <div className="space-y-2.5 opacity-70">
                <div className="h-1 w-3/4 rounded-full bg-wine/15" />
                <div className="h-1 w-full rounded-full bg-wine/10" />
                <div className="h-1 w-5/6 rounded-full bg-wine/10" />
                <div className="h-1 w-2/3 rounded-full bg-wine/10" />
              </div>
              <p className="mt-5 font-script text-lg text-wine/70">untukmu ♡</p>
            </motion.div>

            <div className="absolute inset-0 z-0 rounded-[24px] bg-gradient-to-b from-[#f7c2cf] to-[#d9849a] shadow-[0_24px_50px_-18px_rgba(74,47,54,0.5)]" />

            <div
              className="absolute inset-x-0 bottom-0 top-[34%] z-20 rounded-b-[24px] bg-gradient-to-b from-[#f3b4c4] to-[#dc8ba0]"
              style={{
                clipPath:
                  "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)",
              }}
            />

            <motion.div
              aria-hidden
              className="absolute inset-x-0 top-0 z-30 h-[52%] origin-top rounded-t-[24px] bg-gradient-to-b from-[#fbd3dc] to-[#f0aabb] shadow-[0_10px_18px_-12px_rgba(74,47,54,0.55)]"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                backfaceVisibility: "hidden",
              }}
              animate={{ rotateX: opened ? -168 : 0 }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 14,
              }}
            />

            <motion.div
              aria-hidden
              className="absolute left-1/2 top-[47%] z-40 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#c76a82] to-[#9c4358] font-script text-2xl text-cream shadow-[0_8px_18px_-6px_rgba(74,47,54,0.6)]"
              animate={
                opened
                  ? { scale: 0, opacity: 0 }
                  : { scale: [1, 1.08, 1], opacity: 1 }
              }
              transition={
                opened
                  ? { duration: 0.25 }
                  : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              }
            >
              ♡
            </motion.div>
          </motion.div>
        </motion.button>

        <motion.p
          animate={{ opacity: opened ? 0 : [0.45, 1, 0.45] }}
          transition={
            opened
              ? { duration: 0.2 }
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
          className="text-[10px] uppercase tracking-[0.36em] text-wine/70"
        >
          Ketuk untuk membuka
        </motion.p>
      </div>
    </motion.div>
  );
}
