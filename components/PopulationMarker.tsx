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
  valueDisplay: 1 | 2;
}

const PopulationMarker = forwardRef<THREE.Mesh, PopulationMarkerProps>(
  ({ position, population, cityName, onDeploy, onMove, valueDisplay }, ref) => {
    return (
      <group position={position}>
        <mesh ref={ref}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
        {valueDisplay === 1 && (
          <Html style={{ zIndex: -1 }}>
            <PopulationMarkerUI
              cityName={cityName}
              population={population}
              onDeploy={onDeploy}
              onMove={onMove}
            />
          </Html>
        )}
        {valueDisplay === 2 && (
          <Html>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '5px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}>
              {population}
            </div>
          </Html>
        )}
      </group>
    );
  }
);

PopulationMarker.displayName = 'PopulationMarker';

export default PopulationMarker;
