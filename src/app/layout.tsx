import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Dancing_Script,
  Quicksand,
} from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif-app",
  display: "swap",
});

const script = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script-app",
  display: "swap",
});

const sans = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sayanggggggggggg",
  description: "Lovee uuuuuuuuuu",
};

export const viewport: Viewport = {
  themeColor: "#fde7ee",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${serif.variable} ${script.variable} ${sans.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
