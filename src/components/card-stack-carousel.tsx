"use client";

import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/config";

const SWIPE_DISTANCE = 130;
const EXIT_DISTANCE = 460;

type CardStackCarouselProps = {
  photos: readonly GalleryPhoto[];
  layoutKey: string;
  ariaLabel: string;
  onDraggingChange?: (dragging: boolean) => void;
};

export function CardStackCarousel({
  photos,
  layoutKey,
  ariaLabel,
  onDraggingChange,
}: CardStackCarouselProps) {
  const [order, setOrder] = useState<number[]>(() => photos.map((_, i) => i));
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);
  const dragX = useMotionValue(0);
  const animatingRef = useRef(false);
  const close = useCallback(() => setSelected(null), []);
  const layoutIdFor = (src: string) => `${layoutKey}-photo-${src}`;

  const advance = useCallback(
    async (direction: -1 | 1) => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      try {
        await animate(dragX, direction * EXIT_DISTANCE, {
          duration: 0.3,
          ease: [0.32, 0.72, 0, 1],
        });
        setOrder((current) => [...current.slice(1), current[0]]);
      } finally {
        dragX.set(0);
        animatingRef.current = false;
      }
    },
    [dragX],
  );

  const handleDragEnd = useCallback(
    (info: PanInfo) => {
      onDraggingChange?.(false);

      if (info.offset.x > SWIPE_DISTANCE) {
        void advance(1);
      } else if (info.offset.x < -SWIPE_DISTANCE) {
        void advance(-1);
      } else {
        void animate(dragX, 0, {
          type: "spring",
          stiffness: 320,
          damping: 28,
        });
      }
    },
    [advance, dragX, onDraggingChange],
  );

  const handleDragStart = useCallback(() => {
    onDraggingChange?.(true);
  }, [onDraggingChange]);

  const visible = order
    .slice(0, 3)
    .map((photoIndex) => photos[photoIndex]);
  const activeIndex = order[0];

  return (
    <div role="group" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="relative aspect-[4/5]">
        {visible.map((photo, depth) => (
          <StackCard
            key={photo.src}
            photo={photo}
            depth={depth}
            dragX={dragX}
            layoutId={layoutIdFor(photo.src)}
            onOpen={setSelected}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Foto {activeIndex + 1} dari {photos.length}
        {photos[activeIndex].caption
          ? `: ${photos[activeIndex].caption}`
          : ""}
      </p>

      <AnimatePresence>
        {selected ? (
          <Lightbox
            key={selected.src}
            photo={selected}
            layoutId={layoutIdFor(selected.src)}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function StackCard({
  photo,
  depth,
  dragX,
  layoutId,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  photo: GalleryPhoto;
  depth: number;
  dragX: MotionValue<number>;
  layoutId: string;
  onOpen: (photo: GalleryPhoto) => void;
  onDragStart?: () => void;
  onDragEnd: (info: PanInfo) => void;
}) {
  const isTop = depth === 0;
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const progress = useTransform(dragX, (value) =>
    Math.min(Math.abs(value) / SWIPE_DISTANCE, 1),
  );
  const topRotate = useTransform(dragX, (value) => value / 30);
  const y = useTransform(progress, (value) =>
    depth === 0 ? 0 : depth === 1 ? 16 * (1 - value) : 32 - 16 * value,
  );
  const scale = useTransform(progress, (value) =>
    depth === 0 ? 1 : depth === 1 ? 0.94 + 0.06 * value : 0.88 + 0.06 * value,
  );
  const stackRotate = useTransform(progress, (value) =>
    depth === 0 ? 0 : depth === 1 ? -2 + 2 * value : 3 - 5 * value,
  );
  const opacity = useTransform(progress, (value) =>
    depth === 2 ? 0.9 + 0.1 * value : 1,
  );

  return (
    <motion.div
      layoutId={isTop ? layoutId : undefined}
      style={{
        x: isTop ? dragX : 0,
        y,
        scale,
        rotate: isTop ? topRotate : stackRotate,
        opacity,
        zIndex: 10 - depth,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      dragMomentum={false}
      onDragStart={isTop ? onDragStart : undefined}
      onDragEnd={isTop ? (_event, info) => onDragEnd(info) : undefined}
      onPointerDown={
        isTop
          ? (event) => {
              pointerStart.current = { x: event.clientX, y: event.clientY };
            }
          : undefined
      }
      onClick={
        isTop
          ? (event) => {
              const start = pointerStart.current;
              const travelled = start
                ? Math.hypot(event.clientX - start.x, event.clientY - start.y)
                : 0;

              if (travelled < 8) onOpen(photo);
            }
          : undefined
      }
      onKeyDown={
        isTop
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen(photo);
              }
            }
          : undefined
      }
      role={isTop ? "button" : undefined}
      tabIndex={isTop ? 0 : -1}
      aria-label={isTop ? `Buka ${photo.caption || "foto"}` : undefined}
      aria-hidden={isTop ? undefined : true}
      className={`absolute inset-0 flex flex-col rounded-[16px] border border-white bg-white p-2.5 ${
        photo.caption ? "pb-9" : ""
      } shadow-[0_24px_50px_-24px_rgba(74,47,54,0.6)] outline-none focus-visible:ring-4 focus-visible:ring-petal/50 ${
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      <div className="relative flex-1 overflow-hidden rounded-[10px] bg-blush">
        <Image
          src={photo.src}
          alt={isTop ? photo.caption || "Foto kenangan" : ""}
          fill
          draggable={false}
          sizes="300px"
          className="pointer-events-none select-none object-cover"
        />
      </div>

      {photo.caption ? (
        <span className="absolute inset-x-2.5 bottom-2.5 truncate text-center font-script text-lg text-wine">
          {photo.caption}
        </span>
      ) : null}
    </motion.div>
  );
}

function Lightbox({
  photo,
  layoutId,
  onClose,
}: {
  photo: GalleryPhoto;
  layoutId: string;
  onClose: () => void;
}) {
  const dragY = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const backdropOpacity = useTransform(dragY, [0, 240], [1, 0.2]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      className="fixed inset-0 z-[60] flex items-center justify-center px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.button
        type="button"
        aria-label="Tutup foto"
        onClick={onClose}
        style={{ opacity: backdropOpacity }}
        className="absolute inset-0 cursor-zoom-out bg-ink/70 backdrop-blur-sm"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup foto"
        className="absolute right-5 top-6 z-20 grid size-11 place-items-center rounded-full border border-white/40 bg-cream/15 text-xl text-cream backdrop-blur-md"
        style={{ marginTop: "env(safe-area-inset-top, 0px)" }}
      >
        ✕
      </button>

      <div className="relative z-10 flex w-full max-w-[350px] flex-col items-center">
        <motion.div
          layoutId={layoutId}
          drag={reduceMotion ? false : "y"}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.05, bottom: 0.8 }}
          style={{ y: dragY }}
          onDragEnd={(_event, info) => {
            if (info.offset.y > 120 || info.velocity.y > 700) onClose();
          }}
          className="relative aspect-[4/5] w-full cursor-grab overflow-hidden rounded-[22px] border-[6px] border-white bg-blush shadow-[0_30px_70px_-20px_rgba(74,47,54,0.8)] active:cursor-grabbing"
        >
          <Image
            src={photo.src}
            alt={photo.caption || "Foto kenangan"}
            fill
            sizes="350px"
            draggable={false}
            className="pointer-events-none select-none object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="mt-5 text-center"
        >
          {photo.caption ? (
            <p className="font-script text-2xl text-cream">{photo.caption}</p>
          ) : null}
          <p className="mt-1 text-[9px] uppercase tracking-[0.32em] text-cream/60">
            geser ke bawah untuk menutup
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
