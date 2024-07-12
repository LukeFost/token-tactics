// components/Sphere.tsx
"use client";
import React, { useRef, useState } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Sphere: React.FC<ThreeElements['mesh']> = (props) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const texture = useTexture('/world.png'); // Make sure this path is correct

  useFrame((state, delta) => {
    if (active) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <sphereGeometry args={[20, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Sphere;