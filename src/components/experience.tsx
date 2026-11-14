"use client";

import { useCallback, useRef, useState } from "react";
import { siteConfig } from "@/config";
import { DraggableCardDemo } from "./draggable-card-demo-2";
import { EnvelopeGate } from "./envelope-gate";
import { LoveLetter } from "./love-letter";
import { MusicPlayer, type MusicPlayerHandle } from "./music-player";
import { PhotoGallery } from "./photo-gallery";

export function Experience() {
  const [opened, setOpened] = useState(false);
  const playerRef = useRef<MusicPlayerHandle>(null);

  const begin = useCallback(() => {
    void playerRef.current?.play();
  }, []);

  const finishOpening = useCallback(() => setOpened(true), []);

  return (
    <div className="app-frame">
      <main className="relative z-10 flex min-h-dvh flex-col pb-safe">
        <DraggableCardDemo />
        <PhotoGallery photos={siteConfig.gallery.photos} />
        <LoveLetter />

        <footer className="mt-auto px-6 pb-16 pt-4 text-center">
          <p className="font-script text-lg text-wine/80">{siteConfig.footer}</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.34em] text-mauve/50">
            {siteConfig.from} untuk {siteConfig.to}
          </p>
        </footer>
      </main>

      <MusicPlayer ref={playerRef} />

      {!opened && <EnvelopeGate onBegin={begin} onOpened={finishOpening} />}
    </div>
  );
}
