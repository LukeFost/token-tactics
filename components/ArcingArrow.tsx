// ArcingArrow.tsx
import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface ArcingArrowProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  buffer?: number;
  coneSize?: number;
  animationDuration?: number;
}

const ArcingArrow: React.FC<ArcingArrowProps> = ({ 
  start, 
  end, 
  buffer = 1.5, 
  coneSize = 0.05,
  animationDuration = 2000 
}) => {
  const curve = useMemo(() => {
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    midPoint.normalize().multiplyScalar(1 + distance * buffer);

    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [start, end, buffer]);

  const points = useMemo(() => curve.getPoints(50), [curve]);

  const coneGeometry = useMemo(() => new THREE.ConeGeometry(coneSize, coneSize * 2, 8), [coneSize]);
  const coneMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);

  const coneRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useFrame(() => {
    if (coneRef.current) {
      const elapsedTime = Date.now() - startTimeRef.current;
      progressRef.current = Math.min(elapsedTime / animationDuration, 0.99); // Stop at 99% to add buffer

      const position = curve.getPoint(progressRef.current);
      coneRef.current.position.copy(position);

      const tangent = curve.getTangent(progressRef.current);
      const up = new THREE.Vector3(0, 1, 0);
      const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
      const angle = Math.acos(up.dot(tangent));
      coneRef.current.setRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(axis, angle));
    }
  });

  return (
    <>
      <Line points={points} color="white" lineWidth={1} />
      <mesh ref={coneRef} geometry={coneGeometry} material={coneMaterial} />
    </>
  );
};

export default ArcingArrow;