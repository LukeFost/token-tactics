// Sphere.tsx
"use client";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { generateCustomMapTexture } from './CustomMap';

interface SphereProps {
  position: [number, number, number];
  onUSClick?: () => void;
}

const Sphere: React.FC<SphereProps> = ({ position, onUSClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [handleClickCell, setHandleClickCell] = useState<((uv: THREE.Vector2) => void) | null>(null);
  const [isTextureReady, setIsTextureReady] = useState(false);


  useEffect(() => {
    console.log('Generating custom map texture');
    generateCustomMapTexture(
      2048,
      1024,
      (newTexture, handleClick, getCells) => {
        console.log('Custom map texture generated');
        setTexture(newTexture);
        setHandleClickCell(() => handleClick);
        setIsTextureReady(true);
        console.log('Total cells:', getCells().length);
      }
    );
  }, []);
  

  useEffect(() => {
    if (texture && meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.map = texture;
      material.needsUpdate = true;
    }
  }, [texture]);

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    console.log('Sphere clicked', event);
    if (handleClickCell && event.uv) {
      console.log('Calling handleClickCell with UV:', event.uv);
      handleClickCell(event.uv);
    } else {
      console.log('handleClickCell is not available or event.uv is undefined');
    }
  }, [handleClickCell]);

  return isTextureReady ? (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      <sphereGeometry args={[1, 64, 32]} />
      <meshStandardMaterial map={texture || undefined} />
    </mesh>
  ) : null;
};

export default Sphere;