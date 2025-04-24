import { RobotModel } from "./robot";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Line } from "@react-three/drei";

function AnimatedRobot() {
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

    return () => unsubscribe();
  }, []);

  // Reset animation when new curve is received
  useEffect(() => {
    progress.current = 0;
  }, [curve]);

  // Animate robot
  useFrame((_, delta) => {
    if (!robotRef.current || !curve) return;

    // Animate with time
    progress.current += delta * 0.02;

    // Loop animation (optional)
    if (progress.current > 1) progress.current = 0;

    const point = curve.getPointAt(progress.current);
    const tangent = curve.getTangentAt(progress.current);

    if (point) {
      robotRef.current.position.copy(point);
      const forward = new THREE.Vector3(0, 0, 1);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        forward,
        tangent.clone().normalize()
      );
      robotRef.current.quaternion.slerp(quaternion, 0.1);

      console.log("Progress:", progress.current.toFixed(2), "Position:", point);
    }
  });

  return (
    <>
      {curve && (
        // <line>
        //   <bufferGeometry
        //     attach="geometry"
        //     setFromPoints={curve.getPoints(100)}
        //   />
        //   <lineBasicMaterial attach="material" color="orange" />
        // </line>
         <Line
              points={curve.getPoints(100)}
              color="black"
              lineWidth={2}
              castShadow
            />
      )}

      <group ref={robotRef} position={[0, 0.01, 0]}>
        <RobotModel
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, -0.76, 0]}
          castShadow
        />
      </group>
    </>
  );
}

export default AnimatedRobot;
