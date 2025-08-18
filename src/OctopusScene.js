import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function OctopusScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0x404040, 1.5); // softer fill
    scene.add(light2);

    // Load octopus model
    const loader = new GLTFLoader();
    let octopus;
    loader.load(loader.load(public/octopus (1).glb, (gltf) => {

      (gltf) => {
        octopus = gltf.scene;
        octopus.position.set(0, -1, 0);
        scene.add(octopus);
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    // Animation
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (octopus) {
        const pulse = Math.sin(t * 2) * 0.1; // "breathing"
        octopus.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      }

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
