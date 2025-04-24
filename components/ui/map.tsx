"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Line,
  OrbitControls,
  Html,
  Loader,
} from "@react-three/drei";
// import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { RobotModel } from "../robot";
import AnimatedRobot from "../animatedRobot";

// import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// === Ground ===
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#ffe4e6" />
    </mesh>
  );
}

// === RobotPath (now dynamic) ===
function RobotPath() {
  // const [points, setPoints] = useState<THREE.Vector3[]>([]);

  // useEffect(() => {
  //   async function fetchLatestPath() {
  //     const q = query(
  //       collection(db, "deliveryTasks"),
  //       orderBy("createdAt", "desc"),
  //       limit(1)
  //     );

  //     const snapshot = await getDocs(q);
  //     if (!snapshot.empty) {
  //       const data = snapshot.docs[0].data();
  //       const path = data.path || [];

  //       const vectorPoints = path.map(
  //         (p: any) => new THREE.Vector3(p.x, p.y, p.z)
  //       );

  //       setPoints(vectorPoints);
  //     } else {
  //       setPoints([]); // If no document, clear the points
  //     }
  //   }

  //   fetchLatestPath();
  // }, []);

  // // Don't render the path if points is empty
  // if (points.length === 0) return null;

  const robotRef = useRef<THREE.Group>(null);
  const [curve, setCurve] = useState<THREE.CatmullRomCurve3 | null>(null);
  const progress = useRef(0);

  // Constants for UI-to-3D scaling
  const scale = 0.1;
  const mapWidth = 100;
  const mapHeight = 100;

  // Fetch latest delivery task path
  useEffect(() => {
    const q = query(
      collection(db, "deliveryTasks"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const path = data.path || [];

        console.log("Fetched path:", path);

        if (path.length > 1) {
          const points = path.map((p: any) => {
            const x = (p.x - mapWidth / 2) * scale;
            const y = 0;
            const z = (p.z - mapHeight / 2) * scale;
            return new THREE.Vector3(x, y, z);
          });

          const newCurve = new THREE.CatmullRomCurve3(points, false);
          console.log("Generated curve points:", newCurve.getPoints(10));
          setCurve(newCurve);
        } else {
          setCurve(null);
        }
      } else {
        setCurve(null);
      }
    });

    // const point = curve.getPointAt(progress.current);

    return () => unsubscribe();
  }, []);

  // Reset animation when new curve is received
  useEffect(() => {
    progress.current = 0;
  }, [curve]);

  return (
    // <Line
    //   points={points.map((p) => [p.x, p.y, p.z])}
    //   color="black"
    //   lineWidth={2}
    //   castShadow
    // />
    {}
  );
}

// === CameraController ===
// function CameraController({ x, y, z }: { x: number; y: number; z: number }) {
//   const { camera } = useThree();

//   useFrame(() => {
//     camera.position.set(x, y, z);
//     camera.lookAt(0, 0, 0);
//   });

//   return null;
// }

// === Main Map Scene ===
export default function Map({ preview }: { preview?: boolean }) {
  return (
    <Canvas
      shadows
      camera={{ position: [7.3, 5.7, 20.0], fov: 50 }}
      style={{
        background: "#fff1f2",
        width: "100%",
        height: "100%",
        touchAction: "none",
        // pointerEvents: "none",
      }}
    >
      {/* <CameraController x={7.3} y={5.7} z={20.0} /> */}
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

      <Suspense
        fallback={
          <Html>
            <Loader />
          </Html>
        }
      >
        <Ground />
        <primitive
          object={new THREE.GridHelper(100, 100, "#fca5a5", "#fcd3dc")}
          position={[0, 0.01, 0]}
        />
        {/* <RobotPath /> */}
        <AnimatedRobot />
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
