import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const londrinaShadow = localFont({
  src: "fonts/LondrinaShadow-Regular.ttf",
  variable: "--font-londrina-shadow",
  weight: "400",
});
const instrumentSans = localFont({
  src: "fonts/InstrumentSans.ttf",
  variable: "--font-instrument-sans",
  weight: "400",
});
const inter = Inter({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "LEAPDRAW",
  description: "Built using next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${londrinaShadow.variable} ${instrumentSans.variable} $(inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
