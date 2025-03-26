import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Word Blast",
  description:
    "A fast-paced typing game where you defend against falling word aliens. Test your typing speed and accuracy as you blast through increasingly challenging levels in this sci-fi themed word game.",
  icons: {
    icon: [
      {
        url: "/spaceship.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: ["/spaceship.svg"],
    apple: [
      {
        url: "/spaceship.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
