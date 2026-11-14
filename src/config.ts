export type GalleryPhoto = {
  src: string;
  caption: string;
};

const photos = {
  img1: { src: "/photos/img_1.png", caption: "" },
  img2: { src: "/photos/img_2.png", caption: "" },
  img3: { src: "/photos/IMG_3.png", caption: "" },
  img4: { src: "/photos/img_4.png", caption: "" },
  img5: { src: "/photos/IMG_5.png", caption: "" },
  img6: { src: "/photos/IMG_6.png", caption: "" },
  img7: { src: "/photos/IMG_7.png", caption: "" },
  img8: { src: "/photos/IMG_8.png", caption: "" },
} satisfies Record<string, GalleryPhoto>;

const draggablePhotos: GalleryPhoto[] = [
  photos.img1,
  photos.img2,
  photos.img4,
  photos.img5,
  photos.img6,
  photos.img7,
  photos.img8,
];

const galleryPhotos: GalleryPhoto[] = [...draggablePhotos, photos.img3];

export const siteConfig = {
  to: "Sayangkuuu",
  from: "Aku yng imut",
  eyebrow: "Semoga sukaaaaa",
  title: "Untuk Sayangkuuu",
  subtitle:
    "Terima kasih sudah mau sama aku ya sayanggg lov uu",
  gallery: {
    title: "Makasihh sayanggggg",
    subtitle: "Beberapa potret yang selalu membuatku tersenyum.",
    photos: galleryPhotos,
  },
  moments: {
    photos: draggablePhotos,
  },
  letter: {
    title: "Buat kamuwh",
    hint: "Ketuk untuk membaca",
    greeting: "May lov",
    body: [
      "Aku gatau harus ngomong apa, munkin ini alay, tapi Terimakasih udah ada buat aku sayangggg :)",
      "Terimakasih udah peduli sama aku, khawatir sama aku, pengertian sama akuu. Aku mau kita lanjut terus, tapi enga tau bisa apa engga :(",
      "Aku engga tau apa yang akan terjadi nanti, tapi aku pengin terus sama kamuuuu, selama masih diberi waktu.",
      "SEMANGAT SAYANGGG besok kamu ke Bekasi yaa, Jadi LDR dong huhu :(. Tapi gpp mau kamu di Bekasi, di Inggris, di Jerman. Aku bakal terus support kamuuuu",
      "Semangat sayanggggg :)"
    ],
    closing: "Lov uuu,",
    signature: "Aku :)",
  },
  music: {
    src: "/Laufey%20-%20Lover%20Girl%20(Official%20Music%20Video).mp3",
    title: "Lover Girl",
    artist: "Laufey",
  },
  footer: "Dibuat dengan sepenuh hati",
};
