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
    
    camera.position.z = 2.5;

    // Create glossy lime core sphere
    const coreGeometry = new THREE.IcosahedronGeometry(0.8, 24);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xccff00,
      emissive: 0xccff00,
      emissiveIntensity: 0.15,
      metalness: 0.4,
      roughness: 0.15,
      wireframe: false,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Create white metallic outer shell
    const shellGeometry = new THREE.IcosahedronGeometry(1.0, 20);
    const shellMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8e8e8,
      emissive: 0x555555,
      emissiveIntensity: 0.05,
      metalness: 0.7,
      roughness: 0.25,
      wireframe: false,
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    scene.add(shell);

    // Create band wraps - these are tori that wrap around
    const createBand = (offsetX: number, offsetY: number, rotation: number, color: number) => {
      const bandGeometry = new THREE.TorusGeometry(1.1, 0.15, 16, 32);
      const bandMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color === 0xccff00 ? 0xccff00 : 0xaaaaaa,
        emissiveIntensity: color === 0xccff00 ? 0.2 : 0.05,
        metalness: 0.5,
        roughness: 0.3,
        wireframe: false,
      });
      const band = new THREE.Mesh(bandGeometry, bandMaterial);
      band.rotation.x = offsetX;
      band.rotation.y = offsetY;
      band.rotation.z = rotation;
      scene.add(band);
      return band;
    };

    const band1 = createBand(0.7, 0.3, 0.5, 0xe8e8e8);
    const band2 = createBand(0.2, 0.8, 1.2, 0xccff00);
    const band3 = createBand(-0.6, 0.4, 0.8, 0xe8e8e8);
    const band4 = createBand(0.4, -0.5, 1.5, 0xccff00);

    // Create thin wireframe curves
    const createWireframeRing = (radius: number, thickness: number, color: number) => {
      const curvePoints = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        curvePoints.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * 0.3,
            Math.sin(angle) * radius * 0.3
          )
        );
      }
      
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const points = curve.getPoints(100);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      return line;
    };

    const wireframe1 = createWireframeRing(1.3, 2, 0xccff00);
    const wireframe2 = createWireframeRing(1.35, 2, 0xaaaaaa);
    wireframe2.rotation.z = Math.PI / 4;

    // Create reflective surfaces/planes for additional depth
    const planeGeometry = new THREE.PlaneGeometry(0.8, 0.8, 8, 8);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xccff00,
      emissive: 0xccff00,
      emissiveIntensity: 0.1,
      metalness: 0.3,
      roughness: 0.1,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    // Position planes to create the band effect
    const plane1 = new THREE.Mesh(planeGeometry, planeMaterial);
    plane1.rotation.y = 0.3;
    plane1.position.set(0, 0.4, 0);
    scene.add(plane1);

    const plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    plane2.rotation.y = -0.3;
    plane2.position.set(0, -0.4, 0);
    scene.add(plane2);

    // Advanced lighting for realistic reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Key light - lime from top right
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(4, 4, 4);
    scene.add(keyLight);

    // Fill light - from left
    const fillLight = new THREE.DirectionalLight(0xccff00, 0.9);
    fillLight.position.set(-5, 2, 1);
    scene.add(fillLight);

    // Back light
    const backLight = new THREE.DirectionalLight(0x5577ff, 0.6);
    backLight.position.set(-2, -2, -4);
    scene.add(backLight);

    // Point lights for highlights
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(6, 6, 6);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0xccff00, 0.5, 100);
    accentLight.position.set(-6, -6, 4);
    scene.add(accentLight);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate core
      core.rotation.x += 0.002;
      core.rotation.y += 0.003;

      // Rotate shell
      shell.rotation.x -= 0.0015;
      shell.rotation.y -= 0.0025;

      // Rotate bands with different speeds for dynamic effect
      band1.rotation.x += 0.004;
      band1.rotation.y += 0.002;
      
      band2.rotation.x -= 0.003;
      band2.rotation.z += 0.004;
      
      band3.rotation.y += 0.0035;
      band3.rotation.z -= 0.002;
      
      band4.rotation.x += 0.0025;
      band4.rotation.y -= 0.003;

      // Rotate wireframes
      wireframe1.rotation.z += 0.003;
      wireframe2.rotation.z -= 0.002;
      wireframe2.rotation.x += 0.001;

      // Rotate planes
      plane1.rotation.y += 0.002;
      plane2.rotation.y -= 0.002;

      // Subtle pulsing
      const scale = 0.98 + Math.sin(Date.now() * 0.0006) * 0.02;
      core.scale.set(scale, scale, scale);

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
      coreGeometry.dispose();
      coreMaterial.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
