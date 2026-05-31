import * as THREE from "three";

function FogLayer({ position, scale, opacity }) {
  return (
    <mesh position={position} scale={scale} renderOrder={-1}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color="#060608"
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export default function VolumetricFog() {
  return (
    <group>
      <FogLayer position={[0, 0, 0]} scale={[60, 40, 50]} opacity={0.32} />
      <FogLayer position={[0, 0, -20]} scale={[90, 55, 70]} opacity={0.18} />
      <FogLayer position={[0, 0, -40]} scale={[120, 70, 90]} opacity={0.1} />
    </group>
  );
}
