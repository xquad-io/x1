/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import { EffectComposer, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";

import fragmentShader from "./shader/fragment2.glsl?raw";
import vertexShader from "./shader/vertex2.glsl?raw";

import { create } from "zustand";

type UseMouseT = {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
  width: number;
  onLink: boolean;
  setPos: (x: number, y: number) => void;
  setClient: (clientX: number, clientY: number) => void;
  setLink: (onLink: boolean) => void;
  setWidth: (width: number) => void;
};

const useMouse = create<UseMouseT>((set) => ({
  x: 0,
  y: 0,
  clientX: 0,
  clientY: 0,
  width: 1900,
  onLink: false,
  setPos: (x = 0, y = 0) => set({ x, y }),
  setClient: (clientX = 0, clientY = 0) => set({ clientX, clientY }),
  setLink: (onLink = false) => set({ onLink }),
  setWidth: (width = 0) => set({ width }),
}));

const ParticlesBgScene = () => {
  const pointsRef = useRef<THREE.Points<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.Material | THREE.Material[]
  > | null>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const pointTexture = useLoader(THREE.TextureLoader, "/point.png");
  const count = 40;
  const mouse = useRef(new THREE.Vector2());
  const { clientX, clientY } = useMouse((state) => ({
    clientX: state.clientX,
    clientY: state.clientY,
  }));

  useEffect(() => {
    const x = (((clientX / window.innerWidth) * 2 - 1) * viewport.width) / 2;
    const y = ((-(clientY / window.innerHeight) * 2 + 1) * viewport.height) / 2;
    gsap.to(mouse.current, {
      x,
      y,
      duration: 1.0,
      ease: "power1.out",
      onUpdate: () => {
        if (shaderRef.current)
          shaderRef.current.uniforms.mouse.value = mouse.current;
      },
    });
  }, [clientX, clientY]);

  const geometry = useMemo(() => {
    let index = 0;
    const bufferGeometry = new THREE.BufferGeometry();
    const position = new THREE.BufferAttribute(
      new Float32Array(count * 2 * count * 3),
      3
    );
    for (let i = 0; i < count * 2; i++) {
      for (let j = 0; j < count; j++) {
        const x = (i - count) * 0.5;
        const y = (j - count / 2) * 0.5;
        const z = 0;
        position.setXYZ(index, x, y, z);
        index++;
      }
    }
    bufferGeometry.setAttribute("position", position);
    return bufferGeometry;
  }, []);

  useFrame(() => {
    pointsRef.current?.rotation.set(
      mouse.current.y / viewport.height / 8,
      mouse.current.x / viewport.width / 8,
      0
    );
  });

  return (
    <points ref={pointsRef} geometry={geometry} position={[0, 0, 0]}>
      <shaderMaterial
        ref={shaderRef}
        transparent={true}
        depthWrite={false}
        opacity={0.06}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          mouse: { value: [mouse.current.x, mouse.current.y] },
          uTexture: { value: pointTexture },
        }}
      />
    </points>
  );
};

const ParticlesBgCanvas = () => {
  const [disableMouse, setDisableMouse] = useState(false);
  const setPos = useMouse((state) => state.setPos);
  const setClient = useMouse((state) => state.setClient);
  const setWidth = useMouse((state) => state.setWidth);

  const mouseMove = ({ pageX: x, pageY: y, clientX, clientY }: MouseEvent) => {
    setPos(x, y);
    setClient(clientX, clientY);
  };

  const onResize = () => {
    setWidth(window.innerWidth);
    setDisableMouse(window.innerWidth <= 1024);
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    if (!disableMouse) document.addEventListener("mousemove", mouseMove);
    return () => {
      if (!disableMouse) document.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, [disableMouse]);

  useLayoutEffect(() => {
    // scroll.init();
    // gsap.registerPlugin(ScrollTrigger);
    // gsap.registerPlugin(TextPlugin);
  }, []);

  return (
    <Canvas
      camera={{
        fov: 75,
        near: 0.1,
        far: 100,
        position: [0, 0, 11],
      }}
    >
      <ParticlesBgScene />
      {/* <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer> */}
    </Canvas>
  );
};

export const QParticlesBgCanvas = qwikify$(ParticlesBgCanvas, {
  eagerness: "idle",
});
