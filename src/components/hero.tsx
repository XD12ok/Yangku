"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { siteConfig } from "@/config";
import { CardStackCarousel } from "./card-stack-carousel";
import { WavyText } from "./wavy-text";

const words = siteConfig.title.split(" ");

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 110, damping: 18 },
  },
};

export function Hero({ active }: { active: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const rotateX = useSpring(pointerY, {
    stiffness: 160,
    damping: 20,
    mass: 0.6,
  });
  const rotateY = useSpring(pointerX, {
    stiffness: 160,
    damping: 20,
    mass: 0.6,
  });
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.5), rgba(255,255,255,0) 60%)`;
  const tiltEnabled = canHover && !reduceMotion && !dragging;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () =>
      setCanHover(query.matches || navigator.maxTouchPoints === 0);
    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (tiltEnabled) return;

    pointerX.set(0);
    pointerY.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [tiltEnabled, pointerX, pointerY, glareX, glareY]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(x * 24);
    pointerY.set(-y * 24);
    glareX.set((x + 0.5) * 100);
    glareY.set((y + 0.5) * 100);
    setHovering(true);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
    glareX.set(50);
    glareY.set(50);
    setHovering(false);
  };

  const carouselY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : -64],
  );
  const carouselScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduceMotion ? 1 : 1.1],
  );
  const glowY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 90],
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 pb-8 pt-16"
    >
      <motion.p
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute inset-x-0 top-24 select-none text-center font-script text-[130px] leading-none text-petal/20"
      >
        love
      </motion.p>

      <motion.div
        variants={container}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.p
          variants={item}
          className="text-[10px] uppercase tracking-[0.42em] text-wine/70"
        >
          {siteConfig.eyebrow}
        </motion.p>

        <h1 className="mt-4 max-w-[330px] font-serif text-[42px] font-medium leading-[1.04] text-ink">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              variants={item}
              className={
                index === words.length - 1
                  ? "font-script text-[1.18em] text-wine"
                  : undefined
              }
            >
              {index === words.length - 1 ? (
                <WavyText text={word} amplitude={5} />
              ) : (
                word
              )}
              {index < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-[280px] text-[13px] leading-relaxed text-mauve/80"
        >
          {siteConfig.subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        style={{
          y: carouselY,
          scale: carouselScale,
          rotateX,
          rotateY,
          transformPerspective: 900,
          transformStyle: "preserve-3d",
        }}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={resetPointer}
        className="relative z-10 mx-auto mt-9 w-full max-w-[296px]"
      >
        <CardStackCarousel
          photos={siteConfig.gallery.photos}
          layoutKey="hero"
          ariaLabel="Momen kita"
          onDraggingChange={(value) => {
            setDragging(value);
            if (value) resetPointer();
          }}
        />

        <motion.div
          aria-hidden
          animate={{ opacity: hovering && tiltEnabled ? 0.55 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ backgroundImage: glare }}
          className="pointer-events-none absolute inset-x-0 top-0 z-20 aspect-[4/5] rounded-[16px] mix-blend-screen"
        />

        <motion.div
          style={{ z: 40 }}
          className="absolute -right-2 bottom-7 grid size-12 rotate-6 place-items-center rounded-full border border-white/70 bg-cream/90 font-script text-2xl text-wine shadow-md"
        >
          ♡
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ delay: active ? 0.9 : 0, duration: 0.6 }}
        className="relative z-10 mt-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.36em] text-mauve/60">
          gulir
        </span>
        <motion.span
          aria-hidden
          animate={{ y: reduceMotion ? 0 : [0, 7, 0] }}
          transition={{
            duration: 1.8,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="h-9 w-px bg-gradient-to-b from-petal to-transparent"
        />
      </motion.div>
    </section>
  );
}
