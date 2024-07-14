// PopulationMarker.tsx
import React, { forwardRef } from 'react';
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
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>
    );
  }
);

PopulationMarker.displayName = 'PopulationMarker';

export default PopulationMarker;
