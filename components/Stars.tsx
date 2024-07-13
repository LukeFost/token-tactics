// components/Stars.tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Stars = ({ count = 5000 }) => {
  const mesh = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return positions
  }, [count])

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.0001
      mesh.current.rotation.y += 0.0001
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} sizeAttenuation color="#ffffff" />
    </points>
  )
}

export default Stars