// utils/webSocket1Singleton.ts

let socket1: WebSocket | null = null;

export const initializeWebSocket1 = (): void => {
  // Close any existing WebSocket instance
  if (socket1) {
    if (
      socket1.readyState === WebSocket.OPEN ||
      socket1.readyState === WebSocket.CONNECTING
    ) {
      socket1.close();
    }
    socket1 = null;
  }

  // Create a new WebSocket instance
  socket1 = new WebSocket("ws://localhost:8080");

  socket1.onopen = () => console.log("WebSocket1 connected");

  socket1.onclose = () => console.log("WebSocket1 disconnected");
};

export const getWebSocket1 = (): WebSocket | null => {
  return socket1;
};
