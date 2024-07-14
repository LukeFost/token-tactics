// Sphere.tsx
"use client";
import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

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
    return new THREE.MeshBasicMaterial({ color: 'rgba(50, 50, 50, 0.7)', transparent: true, opacity: 0.7, side: THREE.DoubleSide });
  }, []);

  const latLonToVector3 = useCallback((lat: number, lon: number, radius: number = 0.015) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }, []);

  const handleRightClick = useCallback((event: THREE.Intersection<THREE.Object3D<THREE.Event>>) => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(clickPosition!, camera);
  
    const intersects = raycaster.intersectObject(meshRef.current!);
  
    if (intersects.length > 0) {
      const clickedPoint = intersects[0].point;
      const clickedCoord = coordinates.find(coord => {
        const coordVector = latLonToVector3(coord.lat, coord.lon, 0.01);
        return coordVector.distanceTo(clickedPoint) < 0.005;
      });
      if (clickedCoord) {
        updateActiveMarker(clickedCoord);
      } else {
        updateActiveMarker(null);
      }
    } else {
      updateActiveMarker(null);
    }
  }, [coordinates, updateActiveMarker, camera, clickPosition, latLonToVector3]);
  
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
        <sphereGeometry args={[0.01, 32, 16]} />
      </mesh>
      {coordinates.map((coord, index) => {
        const spherePosition = latLonToVector3(coord.lat, coord.lon, 0.01);
        const diskPosition = spherePosition.clone().normalize().multiplyScalar(0.015);
        const diskRotation = new THREE.Euler().setFromVector3(diskPosition);
        
        return (
          <group key={index}>
            <mesh position={diskPosition} rotation={diskRotation} material={diskMaterial}>
              <circleGeometry args={[0.003, 32]} />
            </mesh>
            <Text
              position={diskPosition.clone().add(new THREE.Vector3(0, 0, 0.0001).applyEuler(diskRotation))}
              fontSize={0.001}
              color="white"
              anchorX="center"
              anchorY="middle"
              rotation={diskRotation}
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
