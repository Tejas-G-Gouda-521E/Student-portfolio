import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TRAIL_COUNT = 5;

function createTrail(seed) {
  const points = [];
  const segments = 40;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push(
      new THREE.Vector3(
        Math.sin(t * Math.PI * 2 + seed) * (8 + seed * 2),
        (t - 0.5) * 14 + Math.sin(t * 4 + seed) * 2,
        -10 - t * 18 + Math.cos(t * 3 + seed) * 3
      )
    );
  }

  return new THREE.CatmullRomCurve3(points);
}

function LightTrail({ curve, speed, offset }) {
  const meshRef = useRef();
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.015, 6, false), [curve]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime * speed + offset;
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.4;
    meshRef.current.position.x = Math.cos(t * 0.3) * 0.3;
    meshRef.current.material.opacity = 0.06 + Math.sin(t * 0.6) * 0.03;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        color="#a8bdd8"
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function LightTrails() {
  const trails = useMemo(
    () =>
      Array.from({ length: TRAIL_COUNT }, (_, i) => ({
        curve: createTrail(i * 1.7 + 0.5),
        speed: 0.15 + i * 0.04,
        offset: i * 2.1,
      })),
    []
  );

  return (
    <group>
      {trails.map((trail, i) => (
        <LightTrail key={i} curve={trail.curve} speed={trail.speed} offset={trail.offset} />
      ))}
    </group>
  );
}
