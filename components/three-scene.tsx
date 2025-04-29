"use client";

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

type MousePosition = {
  x: number;
  y: number;
};

const Model = ({ mousePosition }: { mousePosition: MousePosition }) => {
  const mesh = useRef();
  const particles = useRef<
  { position: THREE.Vector3; velocity: THREE.Vector3; size: number }[]
>([]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    particles.current = Array(50).fill(0).map(() => ({

      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      size: Math.random() * 0.2 + 0.1
    }));
  }, []);
  
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Rotate based on mouse position with smooth interpolation
    const targetRotationX = (mousePosition.y * 0.2);
    const targetRotationY = (mousePosition.x * 0.2);
    
    mesh.current.rotation.x += (targetRotationX - mesh.current.rotation.x) * 0.05;
    mesh.current.rotation.y += (targetRotationY - mesh.current.rotation.y) * 0.05;
    
    // Pulsing scale animation
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    mesh.current.scale.set(scale, scale, scale);

    // Update particles
    particles.current.forEach(particle => {
      particle.position.add(particle.velocity);
      
      // Reset particle position when it goes too far
      if (particle.position.length() > 10) {
        particle.position.normalize().multiplyScalar(10);
        particle.velocity.multiplyScalar(-1);
      }
    });
  });

  return (
    <group>
      <mesh
        ref={mesh}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial
          color={hovered ? "#6366f1" : "#4361ee"}
          roughness={0.2}
          metalness={0.8}
          emissive={hovered ? "#4338ca" : "#000066"}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Particles */}
      {particles.current.map((particle, i) => (
        <mesh
          key={i}
          position={particle.position.toArray()}
          scale={particle.size}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#4361ee"
            emissive="#4361ee"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

const FloatingText = ({ text, position, rotation }) => {
  const textRef = useRef();

  useFrame((state) => {
    if (!textRef.current) return;
    textRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
  });

  return (
    <Text
      ref={textRef}
      position={position}
      rotation={rotation}
      fontSize={0.5}
      color="#4361ee"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

const FloatingIcons = () => {
  const icons = useRef([]);
  const technologies = ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'];
  
  useEffect(() => {
    icons.current = Array(8).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 10
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: 0.25 + Math.random() * 0.5,
      speed: 0.002 + Math.random() * 0.01,
      technology: technologies[Math.floor(Math.random() * technologies.length)]
    }));
  }, []);
  
  useFrame((state) => {
    icons.current.forEach(icon => {
      icon.rotation[0] += icon.speed;
      icon.rotation[1] += icon.speed * 0.7;
      
      const time = state.clock.elapsedTime;
      icon.position[0] = Math.sin(time * icon.speed * 5) * 10;
      icon.position[1] = Math.cos(time * icon.speed * 3) * 8;
    });
  });
  
  return (
    <>
      {icons.current.map((icon, index) => (
        <group key={index}>
          <mesh
            position={icon.position}
            rotation={icon.rotation}
            scale={[icon.scale, icon.scale, icon.scale]}
          >
            <boxGeometry args={[1, 1, 0.2]} />
            <meshStandardMaterial
              color="#4361ee"
              roughness={0.3}
              metalness={0.7}
              emissive="#4361ee"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* <FloatingText
            text={icon.technology}
            position={[icon.position[0], icon.position[1] - 1, icon.position[2]]}
            rotation={[0, 0, 0]}
          /> */}
        </group>
      ))}
    </>
  );
};

const ThreeScene = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, isMobile ? 20 : 15], fov: 50 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Stars
          radius={50}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <Model mousePosition={mousePosition} />
        <FloatingIcons />
        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;