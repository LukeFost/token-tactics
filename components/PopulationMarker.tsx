// PopulationMarker.tsx
import React, { forwardRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import PopulationMarkerUI from './PopulationMarkerUI';

interface PopulationMarkerProps {
  position: THREE.Vector3;
  population: number;
  cityName: string;
  onDeploy: (amount: number) => void;
  onMove: (amount: number) => void;
}

const PopulationMarker = forwardRef<THREE.Mesh, PopulationMarkerProps>(
  ({ position, population, cityName, onDeploy, onMove }, ref) => {
    return (
      <group position={position}>
        <mesh ref={ref}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
        <Html style={{ zIndex: -1 }}>
  <PopulationMarkerUI
    cityName={cityName}
    population={population}
    onDeploy={onDeploy}
    onMove={onMove}
  />
</Html>
      </group>
    );
  }
);

PopulationMarker.displayName = 'PopulationMarker';

export default PopulationMarker;