import type { Metadata } from "next";
import localFont from "next/font/local";
import { Londrina_Shadow } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const londrinaShadow = Londrina_Shadow({
  subsets: ["latin"],
  weight: "400", // Regular weight
  variable: "--font-londrina-shadow",
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
        className={`${geistSans.variable} ${geistMono.variable} ${londrinaShadow.variable}  antialiased`}
      > 
        {children}
      </body>
    </html>
  );
}
