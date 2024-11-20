// utils/webSocket2Singleton.ts

let socket2: WebSocket | null = null;

export const initializeWebSocket2 = (): void => {
  // Close any existing WebSocket instance
  if (socket2) {
    if (
      socket2.readyState === WebSocket.OPEN ||
      socket2.readyState === WebSocket.CONNECTING
    ) {
      socket2.close();
    }
    socket2 = null;
  }

  // Create a new WebSocket instance
  socket2 = new WebSocket("ws://localhost:8080");

  socket2.onopen = () => console.log("WebSocket2 connected");
  socket2.onclose = () => console.log("WebSocket2 disconnected");
};

export const getWebSocket2 = (): WebSocket | null => {
  return socket2;
};
