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
  useEditor,
  exportToBlob,
} from "tldraw";
import "tldraw/tldraw.css";
const Canvas: React.FC = () => {
  function ExportCanvasButton() {
    const editor = useEditor();
    return (
      <button
        style={{
          pointerEvents: "all",
          fontSize: 18,
          backgroundColor: "thistle",
        }}
        onClick={async () => {
          const shapeIds = editor.getCurrentPageShapeIds();
          if (shapeIds.size === 0) return alert("No shapes on the canvas");
          const blob = await exportToBlob({
            editor,
            ids: [...shapeIds],
            format: "png",
            opts: { background: true },
          });

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "every-shape-on-the-canvas.jpg";
          link.click();
        }}
      >
        Export canvas as image
      </button>
    );
  }
  function ToolbarItem({ tool }: ToolbarItemProps) {
    const tools = useTools();
    const isSelected = useIsToolSelected(tools[tool]);
    return <TldrawUiMenuToolItem toolId={tool} isSelected={isSelected} />;
  }

  const CustomToolbar = () => (
    <DefaultToolbar>
      <>
        {/* <ToolbarItem tool="hand" /> */}
        <ToolbarItem tool="draw" />
        <ToolbarItem tool="eraser" />
      </>
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
    SharePanel: () => ExportCanvasButton(),
  };
  return <Tldraw components={components} cameraOptions={{ isLocked: true }} />;
};

export default Canvas;