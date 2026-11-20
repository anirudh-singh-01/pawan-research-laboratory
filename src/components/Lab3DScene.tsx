import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, Sparkles, Eye, Info, RefreshCw, Layers } from 'lucide-react';
import { Language } from '../types';

interface Lab3DSceneProps {
  language: Language;
  className?: string;
  onSelectTest?: (testName: string) => void;
  activeMode?: SceneMode;
  onModeChange?: (mode: SceneMode) => void;
  hideHeader?: boolean;
}

export type SceneMode = 'cells' | 'tubes' | 'dna';

export const Lab3DScene: React.FC<Lab3DSceneProps> = ({
  language,
  className = '',
  onSelectTest,
  activeMode: activeModeProp,
  onModeChange,
  hideHeader = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalMode, setInternalMode] = useState<SceneMode>(activeModeProp || 'cells');
  
  // Keep internal mode in sync with activeModeProp when provided
  const activeMode = activeModeProp !== undefined ? activeModeProp : internalMode;

  const handleModeSelect = (newMode: SceneMode) => {
    setInternalMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const [isRotating, setIsRotating] = useState(true);
  const [selectedItemInfo, setSelectedItemInfo] = useState<string | null>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // References for animation & interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.1, y: 0.2 });
  const currentRotationRef = useRef({ x: 0.1, y: 0.2 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mousePointerRef = useRef(new THREE.Vector2(-1000, -1000));
  const interactiveMeshesRef = useRef<THREE.Mesh[]>([]);

  // Procedural barcode canvas texture generator
  const createBarcodeTexture = (label: string, sub: string, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background label paper
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top colored identification stripe
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, 24);

      // Lab Branding
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('PAWAN RESEARCH LAB', 20, 60);

      ctx.fillStyle = '#0f766e';
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillText(label, 20, 95);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText(sub, 20, 125);
      ctx.fillText('REF #2026-NBT', 20, 150);

      // Realistic procedural barcode lines
      ctx.fillStyle = '#0f172a';
      let x = 20;
      while (x < canvas.width - 30) {
        const width = Math.random() > 0.4 ? 4 : 2;
        ctx.fillRect(x, 165, width, 70);
        x += width + Math.floor(Math.random() * 5 + 2);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    cameraRef.current = camera;

    // Renderer setup with ACESFilmicToneMapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Environment Lighting using RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv).texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Directional Key & Fill lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x99f6e4, 1.2);
    fillLight.position.set(-4, -1, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x0d9488, 1.5);
    rimLight.position.set(0, -4, -3);
    scene.add(rimLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xf0fdfa, 0.8);
    scene.add(ambientLight);

    // Main rotating group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Build the 3D scene objects based on active mode
    buildSceneObjects(activeMode, mainGroup);

    // Interaction Handlers (Mouse / Touch)
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      // Update normalized mouse pointer for raycasting
      mousePointerRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mousePointerRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (!isDraggingRef.current) return;
      const deltaX = clientX - previousMousePosRef.current.x;
      const deltaY = clientY - previousMousePosRef.current.y;
      previousMousePosRef.current = { x: clientX, y: clientY };

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x = Math.max(-0.6, Math.min(0.6, targetRotationRef.current.x + deltaY * 0.008));
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Handle clicks for tube inspection
    const onClick = () => {
      if (!cameraRef.current || !sceneRef.current) return;
      raycasterRef.current.setFromCamera(mousePointerRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(interactiveMeshesRef.current, true);
      if (intersects.length > 0) {
        const topObject = intersects[0].object;
        const info = topObject.userData?.description;
        if (info) {
          setSelectedItemInfo(info);
          if (topObject.userData?.testName && onSelectTest) {
            onSelectTest(topObject.userData.testName);
          }
        }
      }
    };
    dom.addEventListener('click', onClick);

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Clock & Render Loop with smooth exponential damping
    const clock = new THREE.Clock();
    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Exponential damping towards target rotation
      currentRotationRef.current.x = THREE.MathUtils.damp(
        currentRotationRef.current.x,
        targetRotationRef.current.x,
        8,
        delta
      );
      currentRotationRef.current.y = THREE.MathUtils.damp(
        currentRotationRef.current.y,
        targetRotationRef.current.y,
        8,
        delta
      );

      if (mainGroupRef.current) {
        if (isRotating && !isDraggingRef.current) {
          targetRotationRef.current.y += delta * 0.45;
        }
        mainGroupRef.current.rotation.x = currentRotationRef.current.x;
        mainGroupRef.current.rotation.y = currentRotationRef.current.y;

        // Subtle biological floating wave
        mainGroupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.06;

        // Custom animations per mode
        if (activeMode === 'dna') {
          // Additional gentle twist
          mainGroupRef.current.children.forEach((child, i) => {
            if (child.userData?.isParticle) {
              child.position.y += Math.sin(elapsed * 2 + i) * 0.002;
            }
          });
        }
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    // Cleanup
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();

      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('click', onClick);

      // Dispose Three.js resources
      interactiveMeshesRef.current = [];
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeMode, isRotating]);

  // Function to build scene objects procedurally
  const buildSceneObjects = (mode: SceneMode, parentGroup: THREE.Group) => {
    // Clear existing children
    while (parentGroup.children.length > 0) {
      const child = parentGroup.children[0];
      parentGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }
    interactiveMeshesRef.current = [];

    if (mode === 'tubes') {
      buildVacutainerTubes(parentGroup);
    } else if (mode === 'dna') {
      buildDnaHelix(parentGroup);
    } else if (mode === 'cells') {
      buildBloodCellFlow(parentGroup);
    }
  };

  // 1. Procedural Vacutainer Tubes in Medical Stand
  const buildVacutainerTubes = (group: THREE.Group) => {
    // Acrylic Stand Base
    const standGeo = new THREE.BoxGeometry(3.6, 0.18, 1.4);
    const standMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f766e,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.85,
      thickness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const standMesh = new THREE.Mesh(standGeo, standMat);
    standMesh.position.y = -1.1;
    standMesh.receiveShadow = true;
    group.add(standMesh);

    // 3 Specimen Tubes:
    // Tube 1: Lavender EDTA (CBC / Routine Hematology)
    // Tube 2: Gold SST Gel (Biochemistry / LFT / KFT / Lipid)
    // Tube 3: Red Serum (Immunology / Hormones / T3 T4 TSH)
    const tubesData = [
      {
        x: -1.0,
        capColor: 0x9333ea, // Lavender
        liquidColor: 0x881337, // Rich Venous Blood
        label: 'EDTA K2 (CBC / Hematology)',
        sub: 'CBC · ₹300 Special | ESR | Hb',
        desc: language === 'en'
          ? 'Lavender EDTA Tube: Used for Complete Blood Count (CBC, ₹300), Platelet, and Hemoglobin testing.'
          : 'लैवेंडर ईडीटीए ट्यूब: सीबीसी (₹300), प्लेटलेट और हीमोग्लोबिन जांच हेतु प्रयुक्त।',
        testName: 'Complete Blood Count (CBC)',
      },
      {
        x: 0.0,
        capColor: 0xf59e0b, // Gold SST
        liquidColor: 0xb91c1c, // Crimson Blood Serum
        label: 'SST GEL (Biochemistry)',
        sub: 'LFT · ₹520 | KFT · ₹480',
        desc: language === 'en'
          ? 'Gold SST Tube: Advanced clot activator & gel separator for Liver Function (LFT) & Kidney Function (KFT).'
          : 'गोल्ड एसएसटी ट्यूब: लिवर प्रोफाइल (एलएफटी) एवं किडनी प्रोफाइल (केएफटी) हेतु उन्नत जेल सेपरेटर।',
        testName: 'Liver Function Test (LFT)',
      },
      {
        x: 1.0,
        capColor: 0xdc2626, // Red Serum Clot
        liquidColor: 0x991b1b, // Venous Clotted Serum
        label: 'SERUM CLOT (Endocrine / Serology)',
        sub: 'Thyroid T3/T4/TSH · ₹480 | Vit D',
        desc: language === 'en'
          ? 'Red Top Tube: Dedicated for Thyroid Profiles (T3/T4/TSH), Vitamin D/B12, and Diabetes HbA1c.'
          : 'रेड ट्यूब: थायरॉइड प्रोफाइल, विटामिन डी/बी12 और विशेष हार्मोन जांच हेतु।',
        testName: 'Thyroid Profile (T3, T4, TSH)',
      },
    ];

    tubesData.forEach((data) => {
      const tubeGroup = new THREE.Group();
      tubeGroup.position.set(data.x, -0.1, 0);

      // Glass Tube Body (MeshPhysicalMaterial with high transmission)
      const glassGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.8, 32, 1, true);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.92,
        roughness: 0.05,
        metalness: 0.05,
        ior: 1.5,
        thickness: 0.4,
        transparent: true,
        opacity: 0.85,
      });
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      tubeGroup.add(glassMesh);

      // Rounded bottom hemisphere
      const bottomGeo = new THREE.SphereGeometry(0.24, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const bottomMesh = new THREE.Mesh(bottomGeo, glassMat);
      bottomMesh.position.y = -0.9;
      tubeGroup.add(bottomMesh);

      // Liquid Blood Meniscus
      const liquidGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.2, 32);
      const liquidMat = new THREE.MeshStandardMaterial({
        color: data.liquidColor,
        roughness: 0.2,
        metalness: 0.1,
      });
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
      liquidMesh.position.y = -0.3;
      tubeGroup.add(liquidMesh);

      // Rubber Hemogard Stopper Cap
      const capGeo = new THREE.CylinderGeometry(0.28, 0.26, 0.45, 32);
      const capMat = new THREE.MeshStandardMaterial({
        color: data.capColor,
        roughness: 0.4,
        metalness: 0.2,
      });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = 1.05;
      capMesh.castShadow = true;
      tubeGroup.add(capMesh);

      // Specimen Barcode Label
      const barcodeTex = createBarcodeTexture(data.label, data.sub, '#' + data.capColor.toString(16).padStart(6, '0'));
      const labelGeo = new THREE.CylinderGeometry(0.245, 0.245, 0.9, 32, 1, true, 0, Math.PI * 1.4);
      const labelMat = new THREE.MeshBasicMaterial({
        map: barcodeTex,
        side: THREE.DoubleSide,
      });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.position.y = 0.2;
      tubeGroup.add(labelMesh);

      // Interactive hit target wrapper
      const hitBoxGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.4, 16);
      const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBoxMesh = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBoxMesh.userData = {
        description: data.desc,
        testName: data.testName,
      };
      tubeGroup.add(hitBoxMesh);
      interactiveMeshesRef.current.push(hitBoxMesh);

      group.add(tubeGroup);
    });
  };

  // 2. Procedural DNA Double Helix with Glowing Base Pairs
  const buildDnaHelix = (group: THREE.Group) => {
    const strand1Geo = new THREE.SphereGeometry(0.06, 16, 16);
    const strand2Geo = new THREE.SphereGeometry(0.06, 16, 16);
    const rungGeo = new THREE.CylinderGeometry(0.025, 0.025, 1, 12);

    const tealMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      emissive: 0x115e59,
      roughness: 0.3,
      metalness: 0.6,
    });
    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x065f46,
      roughness: 0.3,
      metalness: 0.6,
    });
    const rungMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.8,
    });

    const numPoints = 36;
    const radius = 0.95;
    const heightSpan = 3.2;

    for (let i = 0; i < numPoints; i++) {
      const progress = i / numPoints;
      const angle = progress * Math.PI * 4;
      const y = (progress - 0.5) * heightSpan;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      // Strand 1 node
      const node1 = new THREE.Mesh(strand1Geo, tealMat);
      node1.position.set(x1, y, z1);
      group.add(node1);

      // Strand 2 node
      const node2 = new THREE.Mesh(strand2Geo, emeraldMat);
      node2.position.set(x2, y, z2);
      group.add(node2);

      // Connecting nucleotide base-pair rung
      const rung = new THREE.Mesh(rungGeo, rungMat);
      rung.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
      rung.scale.set(1, radius * 2, 1);
      rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x1 - x2, 0, z1 - z2).normalize());
      group.add(rung);
    }

    // Ambient floating bio-particles
    for (let j = 0; j < 25; j++) {
      const pGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({
        color: j % 2 === 0 ? 0x5eead4 : 0x99f6e4,
        transparent: true,
        opacity: 0.7,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2
      );
      pMesh.userData = { isParticle: true };
      group.add(pMesh);
    }
  };

  // 3. Procedural Blood Cells Flow (Biconcave Erythrocytes, Leukocytes & Platelets)
  const buildBloodCellFlow = (group: THREE.Group) => {
    // Procedural Biconcave Red Blood Cell geometry using Torus/Cylinder composite
    const cellMat = new THREE.MeshStandardMaterial({
      color: 0xc81e1e,
      roughness: 0.32,
      metalness: 0.18,
    });

    const wbcMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.55,
      metalness: 0.1,
    });

    const plateletMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.4,
      metalness: 0.25,
    });

    // Create 18 circulating Erythrocytes (Red Blood Cells)
    for (let i = 0; i < 18; i++) {
      const cellGroup = new THREE.Group();
      
      // Outer rim
      const torusGeo = new THREE.TorusGeometry(0.24, 0.08, 16, 32);
      const torusMesh = new THREE.Mesh(torusGeo, cellMat);
      cellGroup.add(torusMesh);

      // Inner thin dimple
      const discGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 32);
      const discMesh = new THREE.Mesh(discGeo, cellMat);
      discMesh.rotation.x = Math.PI / 2;
      cellGroup.add(discMesh);

      // Interactive hit target
      const hitGeo = new THREE.SphereGeometry(0.32, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = {
        description: language === 'en'
          ? 'Erythrocyte (Red Blood Cell): Transports oxygen via Hemoglobin. Primary component of CBC (₹300 Special Rate).'
          : 'लाल रक्त कोशिका (RBC): हीमोग्लोबिन द्वारा ऑक्सीजन का संचार। सीबीसी जांच (₹300) का मुख्य घटक।',
        testName: 'Complete Blood Count (CBC)',
      };
      cellGroup.add(hitMesh);
      interactiveMeshesRef.current.push(hitMesh);

      // Random placement
      cellGroup.position.set(
        (Math.random() - 0.5) * 3.4,
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 1.8
      );
      cellGroup.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      cellGroup.scale.setScalar(0.75 + Math.random() * 0.4);

      group.add(cellGroup);
    }

    // 3 White Blood Cells (Leukocytes)
    for (let k = 0; k < 3; k++) {
      const wbcGroup = new THREE.Group();
      const wbcGeo = new THREE.DodecahedronGeometry(0.32, 1);
      const wbcMesh = new THREE.Mesh(wbcGeo, wbcMat);
      wbcGroup.add(wbcMesh);

      const hitGeo = new THREE.SphereGeometry(0.36, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = {
        description: language === 'en'
          ? 'Leukocyte (White Blood Cell): Critical for infection defense & immunity. Evaluated in CBC / TLC (₹300).'
          : 'श्वेत रक्त कोशिका (WBC): संक्रमण से बचाव व प्रतिरक्षा प्रणाली। सीबीसी/टीएलसी (₹300) में मापा जाता है।',
        testName: 'Complete Blood Count (CBC)',
      };
      wbcGroup.add(hitMesh);
      interactiveMeshesRef.current.push(hitMesh);

      wbcGroup.position.set(
        (Math.random() - 0.5) * 2.8,
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 1.5
      );
      group.add(wbcGroup);
    }

    // 12 Platelets (Thrombocytes - blood clotting)
    for (let p = 0; p < 12; p++) {
      const pGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16);
      const pMesh = new THREE.Mesh(pGeo, plateletMat);
      pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      pMesh.position.set(
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 2.4,
        (Math.random() - 0.5) * 1.6
      );
      pMesh.userData = {
        description: language === 'en'
          ? 'Platelet (Thrombocyte): Prevents bleeding through clot formation. Monitored in CBC (₹300) & Dengue profiles.'
          : 'प्लेटलेट्स (थ्रॉम्बोसाइट्स): रक्त का थक्का बनाने में आवश्यक। सीबीसी (₹300) में मापा जाता है।',
        testName: 'Complete Blood Count (CBC)',
      };
      interactiveMeshesRef.current.push(pMesh);
      group.add(pMesh);
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 border border-teal-800/40 shadow-xl ${className}`}>
      
      {/* 3D Scene Interactive Overlay Header */}
      {!hideHeader && (
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3 bg-slate-950/60 backdrop-blur-md border-b border-teal-800/40">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-white font-mono tracking-wide uppercase">
              {activeMode === 'cells'
                ? (language === 'en' ? '🩸 Blood Cells (RBC · WBC · Platelets)' : '🩸 रक्त कोशिकाएं (आरबीसी, डब्ल्यूबीसी, प्लेटलेट्स)')
                : activeMode === 'tubes'
                ? (language === 'en' ? '🧪 Vacutainer Specimen Tubes' : '🧪 वैक्यूटेनर सैंपल ट्यूब्स')
                : (language === 'en' ? '🧬 Molecular DNA Double Helix' : '🧬 आणविक डीएनए डबल हेलिक्स')}
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-teal-700/50 text-[11px]">
            <button
              onClick={() => handleModeSelect('cells')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMode === 'cells'
                  ? 'bg-rose-700 text-white font-medium shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Blood Cells"
            >
              {language === 'en' ? 'Blood Cells' : 'रक्त कोशिका'}
            </button>
            <button
              onClick={() => handleModeSelect('tubes')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMode === 'tubes'
                  ? 'bg-teal-700 text-white font-medium shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Vacutainer Blood Collection Tubes"
            >
              {language === 'en' ? 'Tubes' : 'सैंपल ट्यूब्स'}
            </button>
            <button
              onClick={() => handleModeSelect('dna')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMode === 'dna'
                  ? 'bg-teal-700 text-white font-medium shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="DNA Helix"
            >
              {language === 'en' ? 'DNA Helix' : 'डीएनए'}
            </button>
          </div>
        </div>
      )}

      {/* WebGL Canvas Container */}
      {webGlSupported ? (
        <div
          ref={containerRef}
          className="w-full h-[280px] sm:h-[310px] cursor-grab active:cursor-grabbing relative select-none"
        />
      ) : (
        <div className="w-full h-[280px] flex items-center justify-center p-6 text-center text-slate-300">
          <p className="text-sm">
            {language === 'en'
              ? '3D hardware acceleration not detected. Standard high-resolution graphics enabled.'
              : 'मानक ग्राफ़िक्स सक्रिय हैं।'}
          </p>
        </div>
      )}

      {/* Floating 3D Interaction Controls (Bottom Left / Right) */}
      <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-2">
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-teal-200 bg-slate-900/80 hover:bg-slate-800 border border-teal-800/60 rounded-md backdrop-blur-xs transition-colors cursor-pointer"
        >
          <RotateCw className={`w-3 h-3 text-teal-400 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span>{isRotating ? (language === 'en' ? 'Auto-Rotate ON' : 'घूर्णन चालू') : (language === 'en' ? 'Auto-Rotate OFF' : 'घूर्णन बंद')}</span>
        </button>

        <span className="text-[10px] text-teal-300/80 hidden sm:inline-block font-mono">
          {language === 'en' ? 'Drag to rotate 360° · Click to inspect' : '360° घुमाएं · क्लिक करें'}
        </span>
      </div>

      {/* Click / Tap Inspection Callout */}
      {selectedItemInfo && (
        <div className="absolute inset-x-3 bottom-12 z-30 p-2.5 bg-teal-950/95 border border-teal-500/60 rounded-xl text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 leading-snug">{selectedItemInfo}</p>
            </div>
            <button
              onClick={() => setSelectedItemInfo(null)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
