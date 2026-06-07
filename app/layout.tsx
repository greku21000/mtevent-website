import type { Metadata } from "next";
import { Libre_Bodoni, Public_Sans } from "next/font/google";
import "./globals.css";

const display = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MT Event & Wedding — Volume MMXXVI",
  description:
    "Editorial destination weddings & luxury events in Italy. Curated by Maria Tomash. Booking 2026 & 2027.",
  keywords: "wedding planner Italy, destination wedding Italy, luxury event planner",
  openGraph: {
    title: "MT Event & Wedding",
    description: "Editorial destination weddings in Italy — Beyond Your Expectations",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
