// ThreeScene.tsx
"use client";
import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Sphere from './Sphere';
import Stars from './Stars';
import { Cell } from './CustomMap';
import CameraControls from './CameraControls';

interface ThreeSceneProps {
  onCellClick: (cell: Cell) => void;
  initializeAllTerritories: (cells: Cell[]) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ onCellClick, initializeAllTerritories }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const handleCanvasClick = (event: any) => {
    console.log('Canvas clicked', event);
  };
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ alpha: false }}
      color="#000000"
      onClick={handleCanvasClick}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 5, 5]} intensity={10} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Suspense fallback={null}>
        <Sphere position={[0, 0, 0]} onCellClick={onCellClick} initializeAllTerritories={initializeAllTerritories} />
        <Stars count={10000} />
      </Suspense>
      <CameraControls />
    </Canvas>
  );
};

export default ThreeScene;