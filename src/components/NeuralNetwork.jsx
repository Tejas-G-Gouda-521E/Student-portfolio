import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 42;
const CONNECT_DIST = 11;

function generateNetwork() {
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 36,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 24 - 6
      )
    );
  }

  const linePositions = [];
  let lineIndex = 0;

  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dist = nodes[i].distanceTo(nodes[j]);
      if (dist < CONNECT_DIST) {
        linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
        linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        lineIndex++;
      }
    }
  }

  const nodePositions = new Float32Array(NODE_COUNT * 3);
  nodes.forEach((n, i) => {
    nodePositions[i * 3] = n.x;
    nodePositions[i * 3 + 1] = n.y;
    nodePositions[i * 3 + 2] = n.z;
  });

  return {
    nodes,
    nodePositions,
    linePositions: new Float32Array(linePositions),
    lineCount: lineIndex,
  };
}

export default function NeuralNetwork({ mouseRef }) {
  const groupRef = useRef();
  const linesRef = useRef();
  const nodesRef = useRef();
  const data = useMemo(() => generateNetwork(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;

    if (groupRef.current) {
      groupRef.current.rotation.y = mx * 0.08 + Math.sin(t * 0.06) * 0.04;
      groupRef.current.rotation.x = my * 0.04 + Math.sin(t * 0.08) * 0.02;
      groupRef.current.position.y = Math.sin(t * 0.12) * 0.3;
    }

    if (linesRef.current) {
      linesRef.current.material.opacity = 0.12 + Math.sin(t * 0.5) * 0.03;
    }

    if (nodesRef.current) {
      nodesRef.current.material.opacity = 0.5 + Math.sin(t * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={data.lineCount * 2}
            array={data.linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#8ba4c4"
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={NODE_COUNT}
            array={data.nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#c8d8f0"
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
