"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { RobotModel } from "../robot";
import { useControls } from 'leva';
import Map from "./map";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#ffe4e6" /> {/* Light blush pink */}
    </mesh>
  );
}

function RobotPath() {


  const points = useMemo(
    () =>
      [
        [0, 0.01, 0],
        [1, 0.01, 1],
        [3, 0.01, 2],
        [4, 0.01, 5],
        [6, 0.01, 7],
        [7.5, 0.01, 9],
      ].map((p) => new THREE.Vector3(...p)),
    []
  );

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <Line
      points={[
        [0, 0, 0],
        [1, 1, 0],
        [2, 0, 0],
      ]} // Points for the line
      color="black" // Line color
      lineWidth={2} // Width of the line
      castShadow
    />
  );
}

function RobotMarker() {
  const ref = useRef<THREE.Mesh>(null);

  // 💫 Float animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 0.3 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <mesh ref={ref} position={[7.5, 0.3, 9]} castShadow>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial
        color="#f472b6"
        emissive="#f9a8d4"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default function MapPage({ preview }: { preview: boolean }) {

  return (
    <div
      className={`${
        preview ? "h-[50vh] w-full" : "h-[90vh] w-full"
      } rounded-xl overflow-hidden border p-4 ${!preview && "m-4"}`}
    >
     <Map/>
    </div>
  );
}
