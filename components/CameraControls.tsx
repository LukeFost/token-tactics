// CameraControls.tsx
import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const CameraControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<typeof OrbitControls>();

  useFrame(() => {
    controlsRef.current?.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.25}
      rotateSpeed={0.5}
      enableZoom={true}
      zoomSpeed={0.5}
      enablePan={true}
      panSpeed={0.5}
      minDistance={2}
      maxDistance={10}
    />
  );
};

export default CameraControls;