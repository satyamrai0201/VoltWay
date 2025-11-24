import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Orb3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    camera.position.z = 2.5;

    // Create glowing core - intense lime energy
    const coreGeometry = new THREE.IcosahedronGeometry(0.6, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      wireframe: false,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Inner glow - ultra bright
    const innerGlowGeometry = new THREE.SphereGeometry(0.65, 32, 32);
    const innerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.3,
    });
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
    scene.add(innerGlow);

    // Mid glow layer
    const midGlowGeometry = new THREE.SphereGeometry(0.85, 32, 32);
    const midGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.15,
    });
    const midGlow = new THREE.Mesh(midGlowGeometry, midGlowMaterial);
    scene.add(midGlow);

    // Outer energy halo
    const outerGlowGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.08,
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    scene.add(outerGlow);

    // Energy field - wireframe sphere with pulsing
    const fieldGeometry = new THREE.IcosahedronGeometry(0.95, 24);
    const fieldMaterial = new THREE.MeshPhongMaterial({
      color: 0xccff00,
      emissive: 0xccff00,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    scene.add(field);

    // Create swirling energy bands
    const createEnergyBand = (rotationAxis: string, offset: number) => {
      const bandGeometry = new THREE.TorusGeometry(1.2, 0.08, 16, 64);
      const bandMaterial = new THREE.MeshPhongMaterial({
        color: 0xccff00,
        emissive: 0xccff00,
        emissiveIntensity: 0.8,
        wireframe: false,
        transparent: true,
        opacity: 0.7,
      });
      const band = new THREE.Mesh(bandGeometry, bandMaterial);
      
      if (rotationAxis === 'x') band.rotation.x = offset;
      else if (rotationAxis === 'y') band.rotation.y = offset;
      else band.rotation.z = offset;
      
      scene.add(band);
      return { mesh: band, axis: rotationAxis };
    };

    const bands = [
      createEnergyBand('x', 0),
      createEnergyBand('y', Math.PI / 3),
      createEnergyBand('z', (2 * Math.PI) / 3),
      createEnergyBand('x', Math.PI / 2),
    ];

    // Create particle effect
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      const radius = 0.8 + Math.random() * 0.5;
      
      particlePositions[i] = Math.cos(angle1) * Math.cos(angle2) * radius;
      particlePositions[i + 1] = Math.sin(angle1) * Math.cos(angle2) * radius;
      particlePositions[i + 2] = Math.sin(angle2) * radius;
      
      particleVelocities[i] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i + 1] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xccff00,
      size: 0.08,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Intense lighting for energy ball effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Dominant lime light
    const limeLight = new THREE.PointLight(0xccff00, 2.5, 50);
    limeLight.position.set(0, 0, 0);
    scene.add(limeLight);

    // Secondary lime light from different angle
    const limeLight2 = new THREE.PointLight(0xccff00, 1.5, 50);
    limeLight2.position.set(5, 5, 5);
    scene.add(limeLight2);

    // Blue/white light for contrast
    const blueLight = new THREE.PointLight(0x5588ff, 0.8, 50);
    blueLight.position.set(-4, -4, 3);
    scene.add(blueLight);

    // Animation variables
    let animationFrameId: number;
    const time = { value: 0 };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time.value += 0.01;

      // Rotate core fast
      core.rotation.x += 0.005;
      core.rotation.y += 0.008;
      core.rotation.z += 0.003;

      // Rotate inner glow
      innerGlow.rotation.x -= 0.003;
      innerGlow.rotation.y -= 0.005;

      // Rotate mid glow opposite direction
      midGlow.rotation.x += 0.002;
      midGlow.rotation.y += 0.004;
      midGlow.rotation.z -= 0.003;

      // Rotate outer glow slowly
      outerGlow.rotation.z += 0.001;

      // Rotate energy field
      field.rotation.x += 0.004;
      field.rotation.y += 0.006;

      // Rotate energy bands at different speeds
      bands.forEach((band, index) => {
        if (band.axis === 'x') {
          band.mesh.rotation.x += 0.01 + index * 0.002;
        } else if (band.axis === 'y') {
          band.mesh.rotation.y += 0.008 + index * 0.001;
        } else {
          band.mesh.rotation.z += 0.012 - index * 0.002;
        }
      });

      // Update particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        // Update position with velocity
        positions[i] += particleVelocities[i];
        positions[i + 1] += particleVelocities[i + 1];
        positions[i + 2] += particleVelocities[i + 2];

        // Recirculate particles that go too far
        const dist = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2);
        if (dist > 1.5) {
          const angle1 = Math.random() * Math.PI * 2;
          const angle2 = Math.random() * Math.PI * 2;
          const radius = 0.8 + Math.random() * 0.5;
          
          positions[i] = Math.cos(angle1) * Math.cos(angle2) * radius;
          positions[i + 1] = Math.sin(angle1) * Math.cos(angle2) * radius;
          positions[i + 2] = Math.sin(angle2) * radius;
        }

        // Add slight curve to movement
        particleVelocities[i] += (Math.random() - 0.5) * 0.003;
        particleVelocities[i + 1] += (Math.random() - 0.5) * 0.003;
        particleVelocities[i + 2] += (Math.random() - 0.5) * 0.003;

        // Dampen velocity
        particleVelocities[i] *= 0.98;
        particleVelocities[i + 1] *= 0.98;
        particleVelocities[i + 2] *= 0.98;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Pulse effect on glows
      const pulse = 0.9 + Math.sin(time.value * 2) * 0.15;
      innerGlow.scale.set(pulse, pulse, pulse);
      
      const pulse2 = 0.95 + Math.sin(time.value * 1.5 + Math.PI / 4) * 0.12;
      midGlow.scale.set(pulse2, pulse2, pulse2);

      const pulse3 = 0.98 + Math.sin(time.value * 1.2 + Math.PI / 2) * 0.08;
      outerGlow.scale.set(pulse3, pulse3, pulse3);

      // Pulsing particle size
      const particleSize = 0.06 + Math.sin(time.value * 1.5) * 0.04;
      particleMaterial.size = particleSize;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
