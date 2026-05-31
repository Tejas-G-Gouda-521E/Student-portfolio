import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 700;

const vertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aScale;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    pos += vec3(
      sin(uTime * 0.08 + aPhase) * 0.025,
      cos(uTime * 0.06 + aPhase * 1.2) * 0.02,
      sin(uTime * 0.05 + aPhase * 0.8) * 0.015
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aScale * (100.0 / -mv.z);
    gl_Position = projectionMatrix * mv;

    vAlpha = 0.25 + aScale * 0.15;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.1, d);
    float alpha = core * vAlpha * 0.35;

    vec3 color = vec3(0.72, 0.78, 0.88);
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function ParticleField() {
  const materialRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 10 + Math.random() * 38;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      positions[i * 3 + 2] = r * Math.cos(phi) - 10;

      scales[i] = 0.3 + Math.random() * 0.8;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
