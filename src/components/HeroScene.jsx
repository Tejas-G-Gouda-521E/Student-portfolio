import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import ParticleField from "./ParticleField";
import VolumetricFog from "./VolumetricFog";
import CinematicEffects from "./CinematicEffects";
import { useMousePosition } from "../hooks/useMousePosition";

const BG = "#020203";

function InfiniteVoid() {
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[200, 24, 24]} />
      <meshBasicMaterial color={BG} side={THREE.BackSide} fog={false} />
    </mesh>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.04} color="#0a0a12" />
      <pointLight position={[0, 8, 10]} intensity={0.22} color="#8899bb" distance={50} decay={2} />
      <pointLight position={[-15, -5, -10]} intensity={0.06} color="#445566" distance={40} decay={2} />
    </>
  );
}

function StaticCamera({ mouseRef }) {
  const { camera } = useThree();
  const smooth = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;

    smooth.current.x += (mx - smooth.current.x) * 0.008;
    smooth.current.y += (my - smooth.current.y) * 0.008;

    const targetX = smooth.current.x * 0.35;
    const targetY = smooth.current.y * 0.25;

    camera.position.x += (targetX - camera.position.x) * 0.006;
    camera.position.y += (targetY - camera.position.y) * 0.006;
    camera.position.z = 22;
    camera.lookAt(0, 0, -8);
  });

  return null;
}

function Scene({ mouseRef }) {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fogExp2 attach="fog" args={["#040406", 0.016]} />

      <InfiniteVoid />
      <SceneLighting />

      <ParticleField />
      <VolumetricFog />

      <StaticCamera mouseRef={mouseRef} />
      <CinematicEffects />
    </>
  );
}

export default function HeroScene() {
  const mouseRef = useMousePosition(0.25);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 22], fov: 50, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.85;
        }}
        style={{ background: BG }}
      >
        <Suspense fallback={null}>
          <Scene mouseRef={mouseRef} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(120,140,180,0.03)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020203]/80 via-transparent to-[#020203]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,2,3,0.75)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020203] to-transparent" />
    </div>
  );
}
