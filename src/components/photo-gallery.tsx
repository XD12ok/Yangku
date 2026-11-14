"use client";

import { siteConfig, type GalleryPhoto } from "@/config";
import { CardStackCarousel } from "./card-stack-carousel";

export function PhotoGallery({ photos }: { photos: readonly GalleryPhoto[] }) {
  return (
    <section
      id="galeri"
      aria-roledescription="carousel"
      aria-label={siteConfig.gallery.title}
      className="relative px-6 pb-16 pt-6"
    >
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.42em] text-wine/70">
          Galeri
        </p>
        <h2 className="mt-3 font-serif text-[30px] font-medium leading-tight text-ink">
          {siteConfig.gallery.title}
        </h2>

      </div>

      <div className="relative mx-auto mt-10 w-full max-w-[300px]">
        <CardStackCarousel
          photos={photos}
          layoutKey="gallery"
          ariaLabel={siteConfig.gallery.title}
        />
      </div>
    </section>
  );
}
