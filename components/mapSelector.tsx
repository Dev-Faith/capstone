"use client";

import React, { useState, useRef, useEffect } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Props {
  onPathChange: (path: Point3D[]) => void;
}

export const MapSelector = ({ onPathChange }: Props) => {
  const [path, setPath] = useState<Point3D[]>([]);
  const [pixelPoints, setPixelPoints] = useState<{ x: number; y: number }[]>(
    []
  );
  const isDrawing = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scale = 0.1; // 1px = 0.1 unit for 3D conversion

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDrawing.current = true;
    addPoint(e);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing.current) return;
    addPoint(e);
  };

  const addPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    const scale = 0.1;
    const mapWidth = 100;
    const mapHeight = 100;

    // Convert to world coordinates (same as AnimatedRobot expects)
    const worldX = (xPx / rect.width) * mapWidth;
    const worldZ = (yPx / rect.height) * mapHeight;
    const y = 0.01;

    const newPoint = {
      x: parseFloat(worldX.toFixed(2)),
      y,
      z: parseFloat(worldZ.toFixed(2)),
    };

    const lastPoint = path[path.length - 1];

    // Remove points too close to each other
    const MIN_DISTANCE = 2;
    if (lastPoint) {
      const dx = newPoint.x - lastPoint.x;
      const dz = newPoint.z - lastPoint.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < MIN_DISTANCE) return;
    }

    const newPath = [...path, newPoint];
    const newPixels = [...pixelPoints, { x: xPx, y: yPx }];

    setPath(newPath);
    setPixelPoints(newPixels);
    onPathChange(newPath); // For sending to Firebase
  };

  const handleReset = () => {
    setPath([]);
    setPixelPoints([]);
    onPathChange([]);
  };

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full h-64 bg-gray-200 relative cursor-crosshair border border-dashed rounded-md select-none"
      >
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Line path */}
          <polyline
            points={pixelPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Dots */}
          {pixelPoints.map((point, i) => (
            <circle key={i} cx={point.x} cy={point.y} r="3" fill="#ef4444" />
          ))}
        </svg>

        <p className="absolute bottom-1 left-1 text-xs text-gray-700">
          Drag to draw path
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleReset}
          className="px-3 py-1 text-sm bg-red-100 text-red-600 border border-red-300 rounded"
        >
          Reset Path
        </button>
        <p className="text-sm text-gray-600">{path.length} point(s) drawn</p>
      </div>
    </div>
  );
};
