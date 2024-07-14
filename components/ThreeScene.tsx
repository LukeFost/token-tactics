// ThreeScene.tsx
"use client";
import React, { Suspense, useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Sphere from './Sphere';
import Stars from './Stars';
import CameraControls from './CameraControls';
import ArcingArrow from './ArcingArrow';
import { handleCellClickAtom } from '@/atoms/gameAtoms';

// Define the PopulationMarkerData interface
interface PopulationMarkerData {
  lat: number;
  lon: number;
  population: number;
  cityName: string;
  connections: string[];
}

interface ThreeSceneProps {
  populationMarkerData: PopulationMarkerData[];
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ populationMarkerData }) => {
  const [clickPosition, setClickPosition] = useState<THREE.Vector2 | null>(null);
  const [coordinates] = useState<PopulationMarkerData[]>(populationMarkerData);
  const [activeMarker, setActiveMarker] = useState<PopulationMarkerData | null>(null);
  const [, handleCellClick] = useAtom(handleCellClickAtom);
  
  const handleRightClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const canvas = event.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    setClickPosition(new THREE.Vector2(x, y));
    handleCellClick({ x, y });
  }, [handleCellClick]);

  const updateActiveMarker = useCallback((marker: PopulationMarkerData | null) => {
    setActiveMarker(marker);
  }, []);

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 0.5], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        gl={{ alpha: false }}
        color="#000000"
        onContextMenu={handleRightClick}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 0.5, 0.5]} intensity={1} />
        <pointLight position={[-1, -1, -1]} intensity={0.5} />
        <Suspense fallback={null}>
          <Sphere 
            position={[0, 0, 0]} 
            clickPosition={clickPosition}
            coordinates={coordinates}
            updateActiveMarker={updateActiveMarker}
          />
          <Stars count={1000} />
        </Suspense>
        <CameraControls />
      </Canvas>
    </>
  );
};

export default ThreeScene;
