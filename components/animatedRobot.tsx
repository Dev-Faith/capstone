import { RobotModel } from "./robot";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

function AnimatedRobot() {
  const robotRef = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    const pts = [
      [0, 0.01, 0],
      [1, 0.01, 1],
      [3, 0.01, 2],
      [4, 0.01, 5],
      [6, 0.01, 7],
      [7.5, 0.01, 9],
    ].map((p) => new THREE.Vector3(...p));

    return new THREE.CatmullRomCurve3(pts, false); // `false` = not looping
  }, []);

  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!robotRef.current) return;

    // Animate progress
    progress.current += delta * 0.05; // Adjust speed here
    if (progress.current > 1) progress.current = 0; // stop at end of path

    const point = curve.getPointAt(progress.current);
    const tangent = curve.getTangentAt(progress.current);

    robotRef.current.position.copy(point);

    // Make it face the movement direction
    const axis = new THREE.Vector3(0, 1, 0);
    const forward = new THREE.Vector3(0, 0, 1);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      forward,
      tangent.clone().normalize()
    );
    robotRef.current.quaternion.slerp(quaternion, 0.1); // smooth turn
  });

  return (
    <group ref={robotRef}>
      <RobotModel
        scale={[0.3, 0.3, 0.3]}
        rotation={[0.0, -0.76, 0.0]}
        // position={[0, 2, 9]}
        castShadow
      />
    </group>
  );
}

export default AnimatedRobot;
