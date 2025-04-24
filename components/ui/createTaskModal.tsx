"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";
import { MapSelector } from "../mapSelector";

type Coordinate = { x: number; z: number };

/**
 * Filters and smooths path by spacing out points and limiting maximum count.
 */
const filterAndSmoothPath = (
  points: Coordinate[],
  minDistance = 4,
  maxPoints = 50
): Coordinate[] => {
  if (points.length === 0) return [];

  const filtered: Coordinate[] = [];
  let lastPoint = points[0];
  filtered.push(lastPoint);

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - lastPoint.x;
    const dz = points[i].z - lastPoint.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist >= minDistance) {
      lastPoint = points[i];
      filtered.push(lastPoint);
    }
  }

  if (filtered.length > maxPoints) {
    const step = Math.ceil(filtered.length / maxPoints);
    return filtered.filter((_, index) => index % step === 0);
  }

  return filtered;
};

export function CreateTaskModal({
  open,
  setToggleTaskModal,
}: {
  open: boolean;
  setToggleTaskModal: (open: boolean) => void;
}) {
  const [item, setItem] = useState("");
  const [robotId, setRobotId] = useState("robot-001");
  const [destination, setDestination] = useState("");
  const [path, setPath] = useState<Coordinate[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!item || !destination || path.length === 0) {
      toast.error("Please fill all fields and select path.");
      return;
    }

    setLoading(true);

    // Clean path while preserving both x and z coordinates
    const cleanedPath = filterAndSmoothPath(path);

    const formattedPath = cleanedPath.map(({ x, z }) => ({
      x,
      y: 0.01,
      z,
    }));

    try {
      await addDoc(collection(db, "deliveryTasks"), {
        robotId,
        item,
        destination,
        path: formattedPath,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("🚀 Task created successfully!");
      setItem("");
      setDestination("");
      setPath([]);
      setToggleTaskModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setToggleTaskModal}>
      <DialogContent className="max-w-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create Delivery Task
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fill in the task details for the robot to execute.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid gap-1.5">
            <Label htmlFor="item">Item to Deliver</Label>
            <Input
              id="item"
              placeholder="e.g. Documents"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g. Room 301"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Select Path</Label>
            <MapSelector onPathChange={setPath} />
            <p className="text-xs text-gray-500">
              {path.length} point{path.length !== 1 && "s"} selected
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-white hover:bg-primary/90 transition"
          >
            🚀 {loading ? "Submitting..." : "Submit Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
