"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

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

export default function MapPage({ preview }: { preview?: boolean }) {
  return (
    <div
      className={`${
        preview ? "h-[50vh]" : "h-[93vh]"
      } w-full rounded-xl overflow-hidden border p-4 ${!preview && "m-4"}`}
    >
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ background: "#fff1f2" }}
      >
        {/* 🌫️ Soft dreamy fog */}
        <fog attach="fog" args={["#fff1f2", 15, 60]} />

        {/* ✨ Soft warm lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={0.7}
          color="#fda4af"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={null}>
          <Ground />

          {/* 💫 Rose grid with glow */}
          <primitive
            object={new THREE.GridHelper(100, 100, "#fca5a5", "#fcd3dc")}
            position={[0, 0.01, 0]}
          />

          <RobotPath />
          <RobotMarker />

          <OrbitControls
            minDistance={5}
            maxDistance={40}
            enablePan={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
