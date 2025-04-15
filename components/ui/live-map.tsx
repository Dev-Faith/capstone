"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { RobotModel } from "../robot";
import { useControls } from 'leva';
import Map from "./map";



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
