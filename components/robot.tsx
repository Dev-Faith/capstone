import { useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function RobotModel(props: any) {
  const groupRef = useRef<THREE.Group>(null);

  //   useFrame(() => {
  //     if (groupRef.current) {
  //       // Rotate around local Y-axis
  //       groupRef.current.rotation.y += 0.01;
  //     }
  //   });

  //   const { rotX, rotY, rotZ } = useControls("Robot Rotation", {
  //     rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  //     rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  //     rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  //   });

  const { scene } = useGLTF("/models/capstone.glb"); // path is from the `public` folder

  return <primitive object={scene} {...props} rotation={[0, -0.86, 0]} />;
}
