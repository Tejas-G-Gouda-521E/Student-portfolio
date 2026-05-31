import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const waveVertex = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave1 = sin(pos.x * 0.15 + uTime * 0.35) * 0.4;
    float wave2 = cos(pos.y * 0.12 + uTime * 0.28) * 0.3;
    pos.z += wave1 + wave2;
    vElevation = wave1 + wave2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const waveFragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float flow = sin(vUv.x * 8.0 + uTime * 0.4) * 0.5 + 0.5;
    flow *= sin(vUv.y * 6.0 - uTime * 0.3) * 0.5 + 0.5;

    float edge = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
    float alpha = flow * edge * 0.04;

    vec3 color = mix(vec3(0.4, 0.5, 0.65), vec3(0.7, 0.78, 0.9), flow);
    gl_FragColor = vec4(color, alpha);
  }
`;

function WavePlane({ position, rotation, scale, speed = 1 }) {
  const matRef = useRef();

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime * speed;
    }
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[80, 80, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={waveVertex}
        fragmentShader={waveFragment}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function EnergyWaves() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <WavePlane position={[0, -4, -18]} rotation={[-Math.PI / 2.8, 0, 0]} scale={[1.2, 1, 1]} speed={0.8} />
      <WavePlane position={[0, 2, -28]} rotation={[-Math.PI / 3.2, 0.1, 0.05]} scale={[1.4, 1, 1]} speed={0.6} />
      <WavePlane position={[0, -8, -12]} rotation={[-Math.PI / 2.5, -0.05, 0]} scale={[0.9, 1, 1]} speed={1} />
    </group>
  );
}
