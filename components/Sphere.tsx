// Sphere.tsx
"use client";
import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import PopulationMarker from './PopulationMarker';
import { PopulationMarkerData } from './types';

interface SphereProps {
  position: [number, number, number];
  clickPosition: THREE.Vector2 | null;
  coordinates: Array<{ lat: number, lon: number, population: number, cityName: string }>;
  updateActiveMarker: (marker: { lat: number, lon: number, population: number } | null) => void;
  onDeploy: (cityName: string, amount: number) => void;
  onMove: (cityName: string, amount: number) => void;
  valueDisplay: 1 | 2;
}

const Sphere: React.FC<SphereProps> = ({ 
  position, clickPosition, coordinates, 
  updateActiveMarker,
onDeploy, onMove }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const [dayMap, normalMap, specularMap, cloudMap] = useLoader(THREE.TextureLoader, [
    '/2k_earth_daymap.jpg',
    '/2k_earth_normal_map.tif',
    '/2k_earth_specular_map.tif',
    '/2k_earth_clouds.jpg'
  ]);

  const customShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: dayMap },
        normalMap: { value: normalMap },
        specularMap: { value: specularMap },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayMap;
        uniform sampler2D normalMap;
        uniform sampler2D specularMap;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec4 dayColor = texture2D(dayMap, vUv);
          vec3 normal = texture2D(normalMap, vUv).rgb * 2.0 - 1.0;
          float specular = texture2D(specularMap, vUv).r;
          
          vec3 light = normalize(vec3(1.0, 1.0, 1.0));
          float diffuse = max(dot(normal, light), 0.0);
          float spec = pow(max(dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0)), 0.0), 32.0) * specular;
          
          vec3 finalColor = dayColor.rgb * (diffuse + 0.2) + vec3(spec);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [dayMap, normalMap, specularMap]);

  const cloudMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.2,
    });
  }, [cloudMap]);

  const latLonToVector3 = (lat: number, lon: number, radius: number = 1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const populationMarkerRefs = useRef<(THREE.Mesh | null)[]>([]);

  const handleRightClick = useCallback((event: THREE.Intersection) => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(clickPosition!, camera);
  
    const intersects = raycaster.intersectObjects(populationMarkerRefs.current.filter(Boolean) as THREE.Object3D[]);
  
    if (intersects.length > 0) {
      const clickedMarkerIndex = populationMarkerRefs.current.indexOf(intersects[0].object as THREE.Mesh);
      const clickedMarker = coordinates[clickedMarkerIndex];
      updateActiveMarker(clickedMarker);
    }
    // Remove the else clause that sets the active marker to null
  }, [coordinates, updateActiveMarker, camera, clickPosition]);
  
  useFrame((state, delta) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.1;
    }
  
    if (meshRef.current && clickPosition) {
      handleRightClick({ point: new THREE.Vector3() }); // Dummy intersection object
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} material={customShaderMaterial}>
        <sphereGeometry args={[1, 64, 32]} />
      </mesh>
      <mesh ref={cloudRef} material={cloudMaterial}>
        <sphereGeometry args={[1.01, 64, 32]} />
      </mesh>
      {coordinates.map((coord, index) => (
        <PopulationMarker
          key={index}
          position={latLonToVector3(coord.lat, coord.lon, 1.02)}
          population={coord.population}
          cityName={coord.cityName}
          onDeploy={(amount) => onDeploy(coord.cityName, amount)}
          onMove={(amount) => onMove(coord.cityName, amount)}
          ref={(el) => (populationMarkerRefs.current[index] = el)}
          valueDisplay={valueDisplay}
        />
      ))}
    </group>
  );
};

export default React.memo(Sphere);
