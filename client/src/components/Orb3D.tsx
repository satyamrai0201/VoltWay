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

    // Create glowing core - intense neon plasma mix
    const coreGeometry = new THREE.IcosahedronGeometry(0.6, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: false,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Inner glow - ultra bright with cyan-magenta blend
    const innerGlowGeometry = new THREE.SphereGeometry(0.65, 32, 32);
    const innerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.4,
    });
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
    scene.add(innerGlow);

    // Mid glow layer - lime accent
    const midGlowGeometry = new THREE.SphereGeometry(0.85, 32, 32);
    const midGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.2,
    });
    const midGlow = new THREE.Mesh(midGlowGeometry, midGlowMaterial);
    scene.add(midGlow);

    // Outer energy halo - soft cyan
    const outerGlowGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.12,
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    scene.add(outerGlow);

    // Energy field - wireframe sphere with pulsing
    const fieldGeometry = new THREE.IcosahedronGeometry(0.95, 32);
    const fieldMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    scene.add(field);

    // Create swirling energy bands with smooth radiations
    const createEnergyBand = (rotationAxis: string, offset: number, color: number) => {
      const bandGeometry = new THREE.TorusGeometry(1.2, 0.06, 32, 128);
      const bandMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.9,
        wireframe: false,
        transparent: true,
        opacity: 0.8,
      });
      const band = new THREE.Mesh(bandGeometry, bandMaterial);
      
      if (rotationAxis === 'x') band.rotation.x = offset;
      else if (rotationAxis === 'y') band.rotation.y = offset;
      else band.rotation.z = offset;
      
      scene.add(band);
      return { mesh: band, axis: rotationAxis };
    };

    const bands = [
      createEnergyBand('x', 0, 0x00ffff),
      createEnergyBand('y', Math.PI / 3, 0xff00ff),
      createEnergyBand('z', (2 * Math.PI) / 3, 0x00ffff),
      createEnergyBand('x', Math.PI / 2, 0xccff00),
    ];

    // Add additional thin radiation spikes
    const createRadiationSpike = (x: number, y: number, z: number, color: number) => {
      const spikeGeometry = new THREE.CylinderGeometry(0.02, 0.01, 1.5, 8);
      const spikeMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.6,
      });
      const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
      spike.position.set(x, y, z);
      spike.lookAt(0, 0, 0);
      scene.add(spike);
      return spike;
    };

    const spikes = [
      createRadiationSpike(1.5, 0, 0, 0x00ffff),
      createRadiationSpike(-1.5, 0, 0, 0xff00ff),
      createRadiationSpike(0, 1.5, 0, 0x00ffff),
      createRadiationSpike(0, -1.5, 0, 0xccff00),
      createRadiationSpike(0, 0, 1.5, 0xff00ff),
      createRadiationSpike(0, 0, -1.5, 0x00ffff),
    ];

    // Create particle effect with multi-color plasma
    const particleCount = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    const particleColorOptions = [
      [0, 1, 1],      // cyan
      [1, 0, 1],      // magenta
      [0.8, 1, 0],    // lime
      [0, 1, 0.8],    // cyan-green
    ];
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      const radius = 0.6 + Math.random() * 0.8;
      
      particlePositions[i] = Math.cos(angle1) * Math.cos(angle2) * radius;
      particlePositions[i + 1] = Math.sin(angle1) * Math.cos(angle2) * radius;
      particlePositions[i + 2] = Math.sin(angle2) * radius;
      
      particleVelocities[i] = (Math.random() - 0.5) * 0.03;
      particleVelocities[i + 1] = (Math.random() - 0.5) * 0.03;
      particleVelocities[i + 2] = (Math.random() - 0.5) * 0.03;
      
      // Assign random colors to particles
      const colorIdx = Math.floor(i / 3) % particleColorOptions.length;
      const color = particleColorOptions[colorIdx];
      particleColors[i] = color[0];
      particleColors[i + 1] = color[1];
      particleColors[i + 2] = color[2];
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Intense neon plasma lighting effect
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.4);
    scene.add(ambientLight);

    // Dominant cyan light from center
    const cyanLight = new THREE.PointLight(0x00ffff, 3.0, 60);
    cyanLight.position.set(0, 0, 0);
    scene.add(cyanLight);

    // Magenta light from different angle
    const magentaLight = new THREE.PointLight(0xff00ff, 2.5, 60);
    magentaLight.position.set(8, -6, 4);
    scene.add(magentaLight);

    // Lime accent light
    const limeLight = new THREE.PointLight(0xccff00, 2.0, 50);
    limeLight.position.set(-6, 8, -4);
    scene.add(limeLight);

    // Additional cyan accent from opposite side
    const cyanLight2 = new THREE.PointLight(0x00ffff, 1.5, 50);
    cyanLight2.position.set(-5, 5, 6);
    scene.add(cyanLight2);

    // Animation variables
    let animationFrameId: number;
    const time = { value: 0 };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time.value += 0.01;

      // Rotate core fast with intense spin
      core.rotation.x += 0.008;
      core.rotation.y += 0.012;
      core.rotation.z += 0.005;

      // Rotate inner glow
      innerGlow.rotation.x -= 0.004;
      innerGlow.rotation.y -= 0.006;

      // Rotate mid glow opposite direction
      midGlow.rotation.x += 0.003;
      midGlow.rotation.y += 0.005;
      midGlow.rotation.z -= 0.004;

      // Rotate outer glow slowly
      outerGlow.rotation.z += 0.002;

      // Rotate energy field
      field.rotation.x += 0.005;
      field.rotation.y += 0.007;

      // Rotate energy bands at different speeds with smooth radiations
      bands.forEach((band, index) => {
        if (band.axis === 'x') {
          band.mesh.rotation.x += 0.012 + index * 0.003;
        } else if (band.axis === 'y') {
          band.mesh.rotation.y += 0.010 + index * 0.002;
        } else {
          band.mesh.rotation.z += 0.014 - index * 0.002;
        }
      });

      // Rotate radiation spikes for radiating effect
      spikes.forEach((spike, index) => {
        spike.rotation.x += 0.005 + Math.sin(time.value) * 0.002;
        spike.rotation.y += 0.004 - Math.cos(time.value) * 0.002;
        spike.scale.set(
          1 + Math.sin(time.value + index) * 0.15,
          1 + Math.sin(time.value + index) * 0.15,
          1 + Math.sin(time.value + index) * 0.15
        );
      });

      // Update particles with more dynamic plasma behavior
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        // Update position with velocity and orbital motion
        positions[i] += particleVelocities[i];
        positions[i + 1] += particleVelocities[i + 1];
        positions[i + 2] += particleVelocities[i + 2];

        // Recirculate particles that go too far
        const dist = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2);
        if (dist > 2.0) {
          const angle1 = Math.random() * Math.PI * 2;
          const angle2 = Math.random() * Math.PI * 2;
          const radius = 0.6 + Math.random() * 0.8;
          
          positions[i] = Math.cos(angle1) * Math.cos(angle2) * radius;
          positions[i + 1] = Math.sin(angle1) * Math.cos(angle2) * radius;
          positions[i + 2] = Math.sin(angle2) * radius;
        }

        // Add more dynamic curve to movement for plasma swirling
        particleVelocities[i] += (Math.random() - 0.5) * 0.005;
        particleVelocities[i + 1] += (Math.random() - 0.5) * 0.005;
        particleVelocities[i + 2] += (Math.random() - 0.5) * 0.005;

        // Dampen velocity
        particleVelocities[i] *= 0.96;
        particleVelocities[i + 1] *= 0.96;
        particleVelocities[i + 2] *= 0.96;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Enhanced pulse effect on glows for plasma energy
      const pulse = 0.85 + Math.sin(time.value * 2.5) * 0.2;
      innerGlow.scale.set(pulse, pulse, pulse);
      
      const pulse2 = 0.9 + Math.sin(time.value * 1.8 + Math.PI / 4) * 0.18;
      midGlow.scale.set(pulse2, pulse2, pulse2);

      const pulse3 = 0.95 + Math.sin(time.value * 1.4 + Math.PI / 2) * 0.12;
      outerGlow.scale.set(pulse3, pulse3, pulse3);

      // Enhanced pulsing particle size with more intensity
      const particleSize = 0.08 + Math.sin(time.value * 2) * 0.06;
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
