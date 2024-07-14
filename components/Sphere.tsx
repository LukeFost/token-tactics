// Sphere.tsx
"use client";
import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PopulationMarkerData } from './types';

interface SphereProps {
  position: [number, number, number];
  clickPosition: THREE.Vector2 | null;
  coordinates: Array<{ lat: number, lon: number, population: number, cityName: string }>;
  updateActiveMarker: (marker: { lat: number, lon: number, population: number } | null) => void;
}

const Sphere: React.FC<SphereProps> = ({ 
  position, clickPosition, coordinates, 
  updateActiveMarker
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const sphereMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: 'red' });
  }, []);

  const diskMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: 'rgba(50, 50, 50, 0.7)', transparent: true, opacity: 0.7 });
  }, []);

  const latLonToVector3 = (lat: number, lon: number, radius: number = 0.05) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const handleRightClick = useCallback((event: THREE.Intersection<THREE.Object3D<THREE.Event>>) => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(clickPosition!, camera);
  
    const intersects = raycaster.intersectObject(meshRef.current!);
  
    if (intersects.length > 0) {
      const clickedPoint = intersects[0].point;
      const clickedCoord = coordinates.find(coord => {
        const coordVector = latLonToVector3(coord.lat, coord.lon);
        return coordVector.distanceTo(clickedPoint) < 0.01;
      });
      if (clickedCoord) {
        updateActiveMarker(clickedCoord);
      } else {
        updateActiveMarker(null);
      }
    } else {
      updateActiveMarker(null);
    }
  }, [coordinates, updateActiveMarker, camera, clickPosition]);
  
  useEffect(() => {
    if (meshRef.current && clickPosition) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(clickPosition, camera);
      const intersects = raycaster.intersectObject(meshRef.current);
      if (intersects.length > 0) {
        handleRightClick(intersects[0]);
      }
    }
  }, [clickPosition, camera, handleRightClick]);

  return (
    <group position={position}>
      <mesh ref={meshRef} material={sphereMaterial}>
        <sphereGeometry args={[0.05, 32, 16]} />
      </mesh>
      {coordinates.map((coord, index) => {
        const markerPosition = latLonToVector3(coord.lat, coord.lon, 0.06);
        return (
          <group key={index} position={markerPosition}>
            <mesh material={diskMaterial}>
              <circleGeometry args={[0.01, 32]} />
            </mesh>
            <Text
              position={[0, 0, 0.001]}
              fontSize={0.005}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {coord.population.toString()}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

export default React.memo(Sphere);
