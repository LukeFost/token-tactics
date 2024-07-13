// components/ThreeScene.tsx
"use client";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Sphere from './Sphere';
import Stars from './Stars';

const ThreeScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ alpha: false }}
      color="#000000"
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={null}>
        <Sphere position={[0, 0, 0]} />
        <Stars count={10000} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeScene;