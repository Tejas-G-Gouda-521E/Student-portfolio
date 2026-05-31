import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function CinematicEffects() {
  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={0.04}
        luminanceThreshold={0.92}
        luminanceSmoothing={0.95}
        mipmapBlur
        radius={0.3}
      />
      <Noise opacity={0.012} blendFunction={BlendFunction.OVERLAY} />
      <Vignette offset={0.3} darkness={0.7} eskil={false} />
    </EffectComposer>
  );
}
