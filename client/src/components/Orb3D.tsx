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
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    camera.position.z = 2.8;

    // Create main glossy orb with high shininess
    const geometry = new THREE.IcosahedronGeometry(1, 20);
    
    const material = new THREE.MeshStandardMaterial({
      color: 0xccff00,
      emissive: 0xccff00,
      emissiveIntensity: 0.2,
      metalness: 0.3,
      roughness: 0.2,
      wireframe: false,
    });
    
    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    // Create sharp wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.01, 20);
    const wireframeMaterial = new THREE.MeshPhongMaterial({
      color: 0xccff00,
      emissive: 0xccff00,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      linewidth: 2,
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // Create inner light glow sphere
    const innerGlowGeometry = new THREE.IcosahedronGeometry(0.95, 16);
    const innerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.15,
    });
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
    scene.add(innerGlow);

    // Create outer glow halo
    const outerGlowGeometry = new THREE.IcosahedronGeometry(1.25, 8);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.08,
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    scene.add(outerGlow);

    // Advanced lighting setup for realistic reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main key light - warm lime from top right
    const keyLight = new THREE.DirectionalLight(0xccff00, 1.2);
    keyLight.position.set(3, 3, 3);
    scene.add(keyLight);

    // Fill light - white from left
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    // Back light - subtle from behind
    const backLight = new THREE.DirectionalLight(0xccff00, 0.5);
    backLight.position.set(-2, -2, -3);
    scene.add(backLight);

    // Point lights for additional highlights
    const pointLight1 = new THREE.PointLight(0xffffff, 0.6, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xccff00, 0.4, 100);
    pointLight2.position.set(-5, -5, 3);
    scene.add(pointLight2);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth rotation
      orb.rotation.x += 0.0015;
      orb.rotation.y += 0.0025;
      
      // Faster wireframe rotation for dynamic effect
      wireframe.rotation.x -= 0.002;
      wireframe.rotation.y -= 0.003;
      
      // Inner glow subtle rotation
      innerGlow.rotation.x += 0.001;
      innerGlow.rotation.y += 0.0015;

      // Outer glow counter rotation
      outerGlow.rotation.x -= 0.0008;
      outerGlow.rotation.y -= 0.0012;

      // Subtle pulsing effect on glow
      const glowScale = 0.98 + Math.sin(Date.now() * 0.0008) * 0.03;
      outerGlow.scale.set(glowScale, glowScale, glowScale);

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
      geometry.dispose();
      material.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      innerGlowGeometry.dispose();
      innerGlowMaterial.dispose();
      outerGlowGeometry.dispose();
      outerGlowMaterial.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
