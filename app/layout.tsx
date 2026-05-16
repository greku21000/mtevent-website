import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MT Event & Wedding | Luxury Event Planning in Italy",
  description:
    "Premier event and wedding planning agency in Italy. Destination weddings, corporate events, and private celebrations beyond your expectations.",
  keywords: "wedding planner Italy, destination wedding Italy, event planner Italy, luxury wedding Italy",
  openGraph: {
    title: "MT Event & Wedding",
    description: "Luxury Event & Wedding Planning in Italy — Beyond Your Expectations",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
