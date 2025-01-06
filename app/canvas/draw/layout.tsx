import type { Metadata } from "next";
import localFont from "next/font/local";
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

const londrinaShadow = localFont({
  src: "../../fonts/LondrinaShadow-Regular.ttf",
  variable: "--font-londrina-shadow",
  weight: "400",
});

const instrumentSans = localFont({
  src: "../../fonts/InstrumentSans.ttf",
  variable: "--font-instrument-sans",
  weight: "400",
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
          className={`${geistSans.variable} ${geistMono.variable} ${londrinaShadow.variable} ${instrumentSans.variable} antialiased`}
        >
          {children}
        </body>
        {/* </WebSocket1Provider> */}
      </html>
    
  );
}
