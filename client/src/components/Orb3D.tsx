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
    
    camera.position.z = 3;

    // Create neon lime orb
    const geometry = new THREE.IcosahedronGeometry(1, 16);
    
    const material = new THREE.MeshPhongMaterial({
      color: 0xccff00,
      emissive: 0xccff00,
      emissiveIntensity: 0.3,
      shininess: 100,
      wireframe: false,
    });
    
    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    // Create wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.05, 16);
    const wireframeMaterial = new THREE.MeshPhongMaterial({
      color: 0xccff00,
      emissive: 0xccff00,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // Add glow effect with larger transparent sphere
    const glowGeometry = new THREE.IcosahedronGeometry(1.2, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.1,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xccff00, 1.5, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      orb.rotation.x += 0.003;
      orb.rotation.y += 0.005;
      
      wireframe.rotation.x -= 0.004;
      wireframe.rotation.y -= 0.006;
      
      glow.rotation.x += 0.002;
      glow.rotation.y += 0.003;

      // Pulse effect
      const scale = 0.95 + Math.sin(Date.now() * 0.001) * 0.05;
      orb.scale.set(scale, scale, scale);

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
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
