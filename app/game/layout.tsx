import { WebSocketProvider } from "@/lib/contexts/webSocketContext";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}
