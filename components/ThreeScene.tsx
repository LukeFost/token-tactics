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

const ThreeScene: React.FC<ThreeSceneProps & { valueDisplay?: 1 | 2 }> = ({ populationMarkerData, valueDisplay = 1 }) => {
  const [clickPosition, setClickPosition] = useState<THREE.Vector2 | null>(null);
  const [coordinates, setCoordinates] = useState<PopulationMarkerData[]>(populationMarkerData);
  const [activeMarker, setActiveMarker] = useState<PopulationMarkerData | null>(null);
  const [, handleCellClick] = useAtom(handleCellClickAtom);

  const handleDeploy = (cityName: string, amount: number) => {
    setCoordinates(prev => prev.map(coord => 
      coord.cityName === cityName ? { ...coord, population: coord.population + amount } : coord
    ));
  };

  const handleMove = (cityName: string, amount: number) => {
    setCoordinates(prev => prev.map(coord => 
      coord.cityName === cityName ? { ...coord, population: coord.population - amount } : coord
    ));
    // Here you would also update the population of the destination city
  };
  
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

  const latLonToVector3 = (lat: number, lon: number, radius: number = 1.02) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        gl={{ alpha: false }}
        color="#000000"
        onContextMenu={handleRightClick}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 5, 5]} intensity={10} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <Sphere 
            position={[0, 0, 0]} 
            clickPosition={clickPosition}
            coordinates={coordinates}
            updateActiveMarker={updateActiveMarker}
            onDeploy={handleDeploy}
            onMove={handleMove}
            valueDisplay={valueDisplay}
          />
          <Stars count={10000} />
          {activeMarker && coordinates.map((coord, index) => {
            const activeCity = coordinates.find(c => c.cityName === activeMarker.cityName);
            if (activeCity && activeCity.connections.includes(coord.cityName)) {
              return (
                <ArcingArrow
                  key={index}
                  start={latLonToVector3(activeMarker.lat, activeMarker.lon)}
                  end={latLonToVector3(coord.lat, coord.lon)}
                  buffer={1}
                  coneSize={0.05}
                />
              );
            }
            return null;
          })}
        </Suspense>
        <CameraControls />
      </Canvas>
    </>
  );
};

export default ThreeScene;
