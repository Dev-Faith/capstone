"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { RobotModel } from "../robot";
import { useControls } from "leva";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#ffe4e6" />
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

  return (
    <Line
      points={points.map((p) => [p.x, p.y, p.z])}
      color="black"
      lineWidth={2}
      castShadow
    />
  );
}

function RobotMarker() {
  const ref = useRef<THREE.Mesh>(null);

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

// ✅ This component now safely uses useFrame
function CameraController({ x, y, z }: { x: number; y: number; z: number }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Map({ preview }: { preview?: boolean }) {
//   const { x, y, z } = useControls("Camera", {
//     x: { value: 10, min: -20, max: 20, step: 0.1 },
//     y: { value: 10, min: -20, max: 20, step: 0.1 },
//     z: { value: 10, min: -20, max: 20, step: 0.1 },
//   });

//   // 🤖 Leva controls for Robot
//   const robotControls = useControls("Robot", {
//     positionX: {
//       value: Math.PI,
//       min: 0,
//       max: Math.PI * 2,
//       step: 0.01,
//     },
//     positionY: {
//       value: Math.PI,
//       min: 0,
//       max: Math.PI * 2,
//       step: 0.01,
//     },
//     positionZ: {
//       value: Math.PI,
//       min: 0,
//       max: 20,
//       step: 0.01,
//     },
//     scale: {
//       value: { x: 0.3, y: 0.3, z: 0.3 },
//       min: 0.1,
//       max: 3,
//       step: 0.01,
//     },
//     rotationX: {
//       value: Math.PI,
//       min: 0,
//       max: Math.PI * 2,
//       step: 0.01,
//     },
//     rotationY: {
//       value: Math.PI,
//       min: 0,
//       max: Math.PI * 2,
//       step: 0.01,
//     },
//     rotationZ: {
//       value: Math.PI,
//       min: 0,
//       max: Math.PI * 2,
//       step: 0.01,
//     },
//   });

//   // 💡 Leva controls for Light
//   const lightControls = useControls("Light", {
//     intensity: { value: 0.7, min: 0, max: 5, step: 0.1 },
//     color: "#fda4af",
//     posX: { value: 10, min: -20, max: 20, step: 0.5 },
//     posY: { value: 15, min: 0, max: 30, step: 0.5 },
//     posZ: { value: 10, min: -20, max: 20, step: 0.5 },
//   });

  return (
    <Canvas
      shadows
      camera={{ position: [7.3, 5.7, 20.0], fov: 50 }}
      style={{
        background: "#fff1f2",
        width: "100%",
        height: "100%",
        touchAction: "none",
      }}
    >
      <CameraController x={7.3} y={5.7} z={ 20.0} />

      <fog attach="fog" args={["#fff1f2", 15, 60]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[20.0, 30.0, 20.0]}
        intensity={5.0}
        color={"#ffcccc"}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Suspense fallback={null}>
        <Ground />
        <primitive
          object={new THREE.GridHelper(100, 100, "#fca5a5", "#fcd3dc")}
          position={[0, 0.01, 0]}
        />
        <RobotPath />
        {/* <RobotMarker /> */}
        <RobotModel
          position={[7.5, 2, 9]}
          scale={[
            0.30,
            0.30,
            0.30,
          ]}
          rotation={[
            0.00,
            -0.76,
            0.00,
          ]}
          castShadow
        />

        <OrbitControls
          minDistance={5}
          maxDistance={40}
          enablePan={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0}
        />
      </Suspense>
    </Canvas>
  );
}
