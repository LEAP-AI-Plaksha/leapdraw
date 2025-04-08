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
  TLOnMountHandler,
  Editor,
  getSnapshot,
} from "tldraw";
import "tldraw/tldraw.css";

export const exportCanvasAsImage = async (editor: Editor) => {
  if (!editor) throw new Error("Editor instance is required");

  const shapeIds = editor.getCurrentPageShapeIds();

  // If the canvas is empty, export a blank image
  if (shapeIds.size === 0) {
    console.warn("Canvas is empty. Exporting a blank image.");
    const blankCanvas = document.createElement("canvas");
    blankCanvas.width = 200; // Set desired width for blank image
    blankCanvas.height = 200; // Set desired height for blank image
    const ctx = blankCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#FFFFFF"; // Set background color
      ctx.fillRect(0, 0, blankCanvas.width, blankCanvas.height);
    }

    return new Promise<string>((resolve, reject) => {
      blankCanvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blank image blob"));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob); // Convert blob to base64
      }, "image/png");
    });
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

export const exportCanvasAsStrokes = async (editor: Editor) => {
  if (!editor) throw new Error("Editor instance is required");
  const snapshot = getSnapshot(editor.store);
  console.log(snapshot);
};

export const clearCanvas = (editor: Editor) => {
  if (!editor) throw new Error("Editor instance is required");
  console.log(editor);
  const shapeIds = editor.getCurrentPageShapeIds();

  if (shapeIds.size === 0) {
    console.warn("Canvas is already empty.");
    return;
  }

  editor.deleteShapes([...shapeIds]); // Deletes all shapes in the current page
  console.log("Canvas cleared successfully.");
};

export const downloadBase64Image = (base64Data: string, filename = 'canvas-image.png') => {
  // Create a link element
  const downloadLink = document.createElement('a');
  
  // Set link attributes
  downloadLink.href = base64Data;
  downloadLink.download = filename;
  
  // Append to the body
  document.body.appendChild(downloadLink);
  
  // Trigger download
  downloadLink.click();
  
  // Clean up
  document.body.removeChild(downloadLink);
};

export const sendImageToWebSocket = async (
  editor: Editor,
  socket: WebSocket,
  roomId: string
) => {
  if (!editor) throw new Error("Editor instance is required");

  const imageBase64 = await exportCanvasAsImage(editor);
  downloadBase64Image(imageBase64);
  if (!socket) throw new Error("WebSocket is required");

  try {
    // To download the image:
    // downloadBase64Image(imageBase64);
    
    if (!imageBase64) {
      console.warn("No image to send. Canvas might be empty.");
      return; // Exit early if no image is exported
    }

    socket.send(
      JSON.stringify({
        imageData: imageBase64,
        action: "imageReceive",
        roomId: roomId,
      })
    );

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

const Canvas: React.FC<{ onMount: TLOnMountHandler }> = ({ onMount }) => {
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
      onMount={onMount}
    />
  );
};

export default Canvas;
