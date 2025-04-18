import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "LEAPDRAW",
  description: "Built by LEAP (AI-Club @ Plaksha University)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-left"
          closeButton={true}
          theme="dark"
          duration={2000}
        />
      </body>
    </html>
  );
}
