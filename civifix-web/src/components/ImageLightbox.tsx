"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";

interface ImageLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageLightbox({ imageUrl, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Reset zoom and position when image URL changes or component mounts
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [imageUrl]);

  if (!imageUrl) return null;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 8));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleFitScreen = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom handler
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Zoom step and direction
    const zoomStep = 0.1;
    const direction = e.deltaY < 0 ? 1 : -1;
    setScale((prev) => Math.max(0.5, Math.min(prev + direction * zoomStep, 8)));
  };

  // Drag-to-pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale <= 1) return; // Only pan if zoomed in
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col justify-between select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-4 md:p-6 w-full z-50 bg-gradient-to-b from-black/50 to-transparent">
        <span className="text-white/60 text-xs font-semibold tracking-wider uppercase">
          Complaint Image Preview
        </span>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Image Display Area */}
      <div 
        className="flex-1 w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className="relative max-w-[90vw] max-h-[75vh]"
        >
          <img 
            ref={imgRef}
            src={imageUrl} 
            alt="Fullscreen Preview" 
            className="w-full h-full object-contain rounded-xl pointer-events-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="p-6 md:p-8 w-full flex justify-center items-center gap-4 z-50 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 shadow-xl">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <span className="text-white text-sm font-bold min-w-[3.5rem] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          <button
            onClick={handleFitScreen}
            title="Fit to Screen"
            className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
