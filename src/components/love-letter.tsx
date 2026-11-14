"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config";

const letter = siteConfig.letter;
const fullText = letter.body.join("\n\n");

type Stage = "closed" | "opening" | "open";

const charContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.009, delayChildren: 0.15 },
  },
};

const charItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function TypedBody() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <>
        {letter.body.map((paragraph) => (
          <p key={paragraph} className="mb-5 last:mb-0">
            {paragraph}
          </p>
        ))}
      </>
    );
  }

  return (
    <motion.div
      variants={charContainer}
      initial="hidden"
      animate="visible"
      className="whitespace-pre-wrap"
    >
      {Array.from(fullText).map((char, index) => (
        <motion.span key={index} variants={charItem}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function LoveLetter() {
  const [stage, setStage] = useState<Stage>("closed");
  const reduceMotion = useReducedMotion();
  const opened = stage !== "closed";

  useEffect(() => {
    if (stage !== "opening") return;

    const timer = setTimeout(
      () => setStage("open"),
      reduceMotion ? 180 : 720,
    );
    return () => clearTimeout(timer);
  }, [stage, reduceMotion]);

  return (
    <section id="surat" className="relative px-6 pb-16 pt-4">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.42em] text-wine/70">
          Surat
        </p>
        <h2 className="mt-3 font-serif text-[30px] font-medium leading-tight text-ink">
          {letter.title}
        </h2>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {stage === "open" ? (
            <motion.article
              key="letter"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 16 }}
              className="paper rounded-[22px] border border-white/80 px-5 py-7 text-left shadow-[0_24px_50px_-24px_rgba(74,47,54,0.45)]"
            >
              <p className="font-script text-[26px] leading-tight text-wine">
                {letter.greeting}
              </p>

              <div className="mt-5 font-serif text-[17px] leading-[32px] text-ink/85">
                <TypedBody />
              </div>

              <div className="mt-7 text-right">
                <p className="text-[9px] uppercase tracking-[0.34em] text-mauve/60">
                  {letter.closing}
                </p>
                <p className="mt-1 font-script text-3xl text-wine">
                  {letter.signature}
                </p>
              </div>
            </motion.article>
          ) : (
            <motion.div
              key="envelope"
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.button
                type="button"
                onClick={() => {
                  if (stage === "closed") setStage("opening");
                }}
                disabled={stage !== "closed"}
                aria-label="Buka surat"
                whileTap={{ scale: 0.97 }}
                className="relative block w-full max-w-[300px] rounded-[22px] outline-none focus-visible:ring-4 focus-visible:ring-petal/60"
                style={{ perspective: "1000px" }}
              >
                <div className="relative h-[186px] w-full">
                  <div className="absolute inset-0 rounded-[22px] bg-gradient-to-b from-[#f7c2cf] to-[#d9849a] shadow-[0_22px_45px_-20px_rgba(74,47,54,0.55)]" />

                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 top-[36%] rounded-b-[22px] bg-gradient-to-b from-[#f3b4c4] to-[#dc8ba0]"
                    style={{
                      clipPath:
                        "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)",
                    }}
                  />

                  <motion.div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[52%] origin-top rounded-t-[22px] bg-gradient-to-b from-[#fbd3dc] to-[#f0aabb]"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      transformOrigin: "top center",
                      backfaceVisibility: "hidden",
                    }}
                    animate={{ rotateX: opened ? -168 : 0 }}
                    transition={{ type: "spring", stiffness: 70, damping: 14 }}
                  />

                  <motion.div
                    aria-hidden
                    className="absolute left-1/2 top-[47%] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#c76a82] to-[#9c4358] font-script text-xl text-cream shadow-md"
                    animate={{ opacity: opened ? 0 : 1, scale: opened ? 0 : 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    ♡
                  </motion.div>
                </div>
              </motion.button>

              <motion.p
                animate={{ opacity: opened ? 0 : [0.45, 1, 0.45] }}
                transition={
                  opened
                    ? { duration: 0.2 }
                    : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                }
                className="text-[10px] uppercase tracking-[0.34em] text-wine/70"
              >
                {letter.hint}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
