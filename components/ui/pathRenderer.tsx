"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PathPoint = { x: number; y: number; z: number };

interface PathRendererProps {
  path: PathPoint[];
  className?: string;
  strokeWidth?: number;
}

export default function PathRenderer({
  path,
  className,
  strokeWidth = 2,
}: PathRendererProps) {
  if (path.length < 2) return null;

  const getPathD = (points: { x: number; z: number }[]) => {
    const d = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.z}`)
      .join(" ");
    return d;
  };

  const path2D = path.map((p) => ({ x: p.x, z: p.z }));
  const d = getPathD(path2D);

  const viewBox = (() => {
    const xs = path2D.map((p) => p.x);
    const zs = path2D.map((p) => p.z);
    const minX = Math.min(...xs) - 10;
    const maxX = Math.max(...xs) + 10;
    const minZ = Math.min(...zs) - 10;
    const maxZ = Math.max(...zs) + 10;
    return `${minX} ${minZ} ${maxX - minX} ${maxZ - minZ}`;
  })();

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardContent>
        <div className="w-full h-[300px] bg-muted rounded-md flex items-center justify-center">
          <svg
            className="w-full h-full"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
