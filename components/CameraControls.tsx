"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const CameraControls = () => {
  const controlsRef = useRef(null);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={1}
      rotateSpeed={0.1}
      enableZoom={false} // Disable zoom to keep focus on the sphere
    />
  );
};

export default CameraControls;
