// Sphere.tsx
"use client";
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { ThreeEvent, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { generateCustomMapTexture } from './CustomMap';
import { Cell } from './CustomMap';
import { DDSLoader } from 'three-stdlib';

// Register the DDS loader
THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader() as any);

interface SphereProps {
  position: [number, number, number];
  onCellClick: (cell: Cell) => void;
  initializeAllTerritories: (cells: Cell[]) => void;
}

const Sphere: React.FC<SphereProps> = ({ position, onCellClick, initializeAllTerritories }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [baseTexture, setBaseTexture] = useState<THREE.Texture | null>(null);
  const [handleClickCell, setHandleClickCell] = useState<((uv: THREE.Vector2) => void) | null>(null);
  const [isTextureReady, setIsTextureReady] = useState(false);

  const { gl } = useThree();

  const [normalMap, setNormalMap] = useState<THREE.Texture | null>(null);
  const [worldTexture, setWorldTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    new THREE.TextureLoader().load('/world.png', setWorldTexture);
  }, []);

  useEffect(() => {
    const loader = new DDSLoader();
    loader.load('/worldNormalMap.dds', 
      (texture) => {
        setNormalMap(texture);
      },
      undefined,
      (error) => {
        console.error('Error loading DDS texture:', error);
        // Fallback to PNG if DDS fails
        new THREE.TextureLoader().load('/worldNormalMap.png', setNormalMap);
      }
    );
  }, []);

  const roughnessMap = useLoader(THREE.TextureLoader, '/worldSpec.png');

  const generateTexture = useCallback(() => {
    console.log('Generating custom map texture');
    generateCustomMapTexture(
      2048,
      1024,
      onCellClick,
      (newTexture, handleClick, getCells) => {
        console.log('Custom map texture generated');
        setBaseTexture(newTexture);
        setHandleClickCell(() => handleClick);
        setIsTextureReady(true);
        const cells = getCells();
        console.log('Total cells:', cells.length);
        
        if (!isTextureReady) {
          initializeAllTerritories(cells.map(cell => ({
            ...cell,
            id: `Cell-${Math.round(cell.x)}-${Math.round(cell.y)}`
          })));
        }
      }
    );
  }, [onCellClick, initializeAllTerritories, isTextureReady]);

  useEffect(() => {
    if (!isTextureReady) {
      generateTexture();
    }
  }, [generateTexture, isTextureReady]);

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (handleClickCell && event.uv) {
      console.log('Calling handleClickCell with UV:', event.uv);
      handleClickCell(event.uv);
    } else {
      console.log('handleClickCell is not available or event.uv is undefined');
    }
  }, [handleClickCell]);


  const customShaderMaterial = useMemo(() => {
    if (!worldTexture || !normalMap || !roughnessMap || !baseTexture) return null;

    return new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: baseTexture },
        worldTexture: { value: worldTexture },
        normalMap: { value: normalMap },
        roughnessMap: { value: roughnessMap },
        oceanColor: { value: new THREE.Color(0xADD8E6) }, // Light blue color
        landColor: { value: new THREE.Color(0x228B22) }, // Keep the existing land color
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
        uniform sampler2D baseTexture;
        uniform sampler2D worldTexture;
        uniform sampler2D normalMap;
        uniform sampler2D roughnessMap;
        uniform vec3 oceanColor;
        uniform vec3 landColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec4 worldColor = texture2D(worldTexture, vUv);
          vec4 baseColor = texture2D(baseTexture, vUv);
          vec3 normal = texture2D(normalMap, vUv).rgb * 2.0 - 1.0;
          float roughness = texture2D(roughnessMap, vUv).r;
          
          vec3 finalColor = mix(oceanColor, landColor, worldColor.r);
          finalColor = mix(finalColor, baseColor.rgb, baseColor.a);
          
          // Add some shading based on the normal
          float shading = dot(normal, vec3(0.5, 0.5, 1.0)) * 0.5 + 0.5;
          finalColor *= shading;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [worldTexture, normalMap, roughnessMap, baseTexture]);


  if (!isTextureReady || !customShaderMaterial) {
    return null;
  }

  return (
    <mesh 
    ref={meshRef} 
    position={position} 
    onClick={handleClick} 
    material={customShaderMaterial}
  >
    <sphereGeometry args={[1, 64, 32]} />
  </mesh>
  );
};

export default React.memo(Sphere);