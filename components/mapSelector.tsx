// components/MapSelector.tsx
"use client";

import React, { useState } from "react";

interface Props {
  onPathChange: (path: { x: number; y: number }[]) => void;
}

export const MapSelector = ({ onPathChange }: Props) => {
  const [path, setPath] = useState<{ x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPath = [...path, { x, y }];
    setPath(newPath);
    onPathChange(newPath);
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-64 bg-gray-200 relative cursor-crosshair border border-dashed"
    >
      {path.map((point, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-red-500 rounded-full"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        />
      ))}
      <p className="absolute bottom-1 left-1 text-xs text-gray-700">Click to set path</p>
    </div>
  );
};
