"use client";

import Image from "next/image";
import { siteConfig } from "@/config";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { WavyText } from "./wavy-text";

const words = siteConfig.title.split(" ");

const positions = [
  "top-6 left-[4%] -rotate-6",
  "top-40 left-[22%] rotate-[5deg]",
  "top-16 left-[44%] -rotate-[4deg]",
  "top-52 left-[6%] rotate-[7deg]",
  "top-60 left-[30%] -rotate-[8deg]",
  "top-32 left-[54%] rotate-[3deg]",
  "top-72 left-[18%] rotate-[6deg]",
];

export function DraggableCardDemo() {
  return (
    <section aria-label="Momen kita" className="relative">
      <div className="px-6 pb-2 pt-14 text-center">
        <p className="text-[10px] uppercase tracking-[0.42em] text-wine/70">
          {siteConfig.eyebrow}
        </p>
        <h1 className="mt-4 font-serif text-[38px] font-medium leading-[1.05] text-ink">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
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
            </span>
          ))}
        </h1>
        <p className="mx-auto mt-4 max-w-[280px] text-[13px] leading-relaxed text-mauve/80">
          {siteConfig.subtitle}
        </p>
      </div>

      <DraggableCardContainer className="relative mx-auto h-[600px] w-full">
        {siteConfig.moments.photos.map((photo, index) => (
          <DraggableCardBody
            key={photo.src}
            className={`absolute w-[264px] min-h-0 rounded-[14px] border-[4px] border-white bg-cream p-4 ${
              positions[index % positions.length]
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.caption || `Foto ${index + 1}`}
              width={232}
              height={232}
              sizes="264px"
              draggable={false}
              className="pointer-events-none relative z-10 h-[232px] w-full rounded-[8px] border-[3px] border-white object-cover"
            />
            {photo.caption ? (
              <h3 className="mt-3 text-center font-script text-lg text-wine">
                {photo.caption}
              </h3>
            ) : null}
          </DraggableCardBody>
        ))}
      </DraggableCardContainer>

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 pb-20 pt-2 text-center">
        <p className="text-[9px] uppercase tracking-[0.32em] text-mauve/60">
          tarik dan geser kartunya
        </p>
      </div>
    </section>
  );
}
