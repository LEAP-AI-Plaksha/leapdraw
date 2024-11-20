"use client";
import React from "react";
import {
  TLComponents,
  Tldraw,
  DefaultToolbar,
  ToolbarItemProps,
  useTools,
  useIsToolSelected,
  TldrawUiMenuToolItem,
  exportToBlob,
} from "tldraw";
import "tldraw/tldraw.css";

export const exportCanvasAsImage = async (editor: any) => {
  if (!editor) throw new Error("Editor instance is required");

  const shapeIds = editor.getCurrentPageShapeIds();

  // Check if the canvas is empty
  if (shapeIds.size === 0) {
    console.warn("Canvas is empty. Nothing to export.");
    return null; // Return null to indicate no image is exported
  }

  const blob = await exportToBlob({
    editor,
    ids: [...shapeIds],
    format: "png",
    opts: { background: true },
  });

  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob); // Converts the blob to a base64 data URL
  });
};

export const sendImageToWebSocket = async (editor: any, wsUrl: string) => {
  if (!editor) throw new Error("Editor instance is required");
  if (!wsUrl) throw new Error("WebSocket URL is required");

  try {
    const imageBase64 = await exportCanvasAsImage(editor);
    if (!imageBase64) {
      console.warn("No image to send. Canvas might be empty.");
      return; // Exit early if no image is exported
    }

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established.");
      socket.send(imageBase64);
      console.log("Image sent to WebSocket:", wsUrl);
      socket.close();
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  } catch (error) {
    console.error("Error sending image to WebSocket:", error);
  }
};

const Canvas: React.FC<{ onEditorReady?: (editor: any) => void }> = ({
  onEditorReady,
}) => {
  function ToolbarItem({ tool }: ToolbarItemProps) {
    const tools = useTools();
    const isSelected = useIsToolSelected(tools[tool]);
    return <TldrawUiMenuToolItem toolId={tool} isSelected={isSelected} />;
  }

  const CustomToolbar = () => (
    <DefaultToolbar>
      <ToolbarItem tool="draw" />
      <ToolbarItem tool="eraser" />
    </DefaultToolbar>
  );

  const components: TLComponents = {
    StylePanel: () => <div></div>,
    QuickActions: () => <div></div>,
    ActionsMenu: () => <div></div>,
    PageMenu: () => <div></div>,
    MainMenu: () => <div></div>,
    NavigationPanel: () => <div></div>,
    Toolbar: CustomToolbar,
    SharePanel: () => <div></div>,
  };

  return (
    <Tldraw
      components={components}
      cameraOptions={{ isLocked: true }}
      onMount={(editor) => {
        if (onEditorReady) {
          onEditorReady(editor);
        }
      }}
    />
  );
};

export default Canvas;
