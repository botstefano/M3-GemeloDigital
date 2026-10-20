import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DrillRig, Shovel, HaulTruck, BlastZone, SimulationParams } from '../../types';

interface ThreeMineSceneProps {
  drills: DrillRig[];
  shovels: Shovel[];
  trucks: HaulTruck[];
  blastZones: BlastZone[];
  params?: SimulationParams;
  onSelectAgent?: (agent: DrillRig | Shovel | HaulTruck | BlastZone | null) => void;
  selectedAgentId?: string | null;
  cameraMode?: 'orbit' | 'aerial' | 'follow' | 'first_person';
  heatmapMode?: 'none' | 'fragmentation' | 'energy' | 'traffic' | 'grade';
  onTriggerBlast?: (zoneId: string) => void;
}

export const ThreeMineScene: React.FC<ThreeMineSceneProps> = ({
  drills,
  shovels,
  trucks,
  blastZones,
  params,
  onSelectAgent,
  selectedAgentId,
  cameraMode = 'orbit',
  heatmapMode = 'none',
  onTriggerBlast,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameId = useRef<number>(0);

  // Mesh registries for fast updates
  const truckMeshes = useRef<Map<string, THREE.Group>>(new Map());
  const drillMeshes = useRef<Map<string, THREE.Group>>(new Map());
  const shovelMeshes = useRef<Map<string, THREE.Group>>(new Map());
  const blastZoneMeshes = useRef<Map<string, THREE.Group>>(new Map());
  const particleSystems = useRef<THREE.Points[]>([]);
  const heatmapMeshRef = useRef<THREE.Mesh | null>(null);

  // Fresh refs to prevent stale closures in requestAnimationFrame animate()
  const cameraModeRef = useRef(cameraMode);
  cameraModeRef.current = cameraMode;
  const selectedAgentIdRef = useRef(selectedAgentId);
  selectedAgentIdRef.current = selectedAgentId;
  const trucksRef = useRef(trucks);
  trucksRef.current = trucks;
  const shovelsRef = useRef(shovels);
  shovelsRef.current = shovels;
  const drillsRef = useRef(drills);
  drillsRef.current = drills;
  const onSelectAgentRef = useRef(onSelectAgent);
  onSelectAgentRef.current = onSelectAgent;
  const onTriggerBlastRef = useRef(onTriggerBlast);
  onTriggerBlastRef.current = onTriggerBlast;

  // Orbit state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraSpherical = useRef({ radius: 155, theta: 0.75, phi: 0.68 });
  const cameraTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, 0));

  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  // Setup Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0b0e);
    scene.fog = new THREE.FogExp2(0x0a0b0e, 0.0035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    camera.position.set(90, 85, 120);
    camera.lookAt(0, 4, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff4e6, 1.4);
    sunLight.name = 'sunLight';
    sunLight.position.set(80, 140, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 350;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Secondary fill light for mine pit walls
    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.4);
    fillLight.position.set(-80, 60, -60);
    scene.add(fillLight);

    // 5. Build Open Pit Terraced Geometry & Haul Roads
    buildPitEnvironment(scene);

    // 6. Build Crusher Station & Dump Site
    buildProcessingInfrastructure(scene);

    // 7. Heatmap Plane
    buildHeatmapPlane(scene);

    // 8. Particle System for ambient dust & blasting
    initParticleSystems(scene);

    // Resize Handler
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Mouse Interaction for Orbit Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraSpherical.current.theta -= deltaX * 0.006;
      cameraSpherical.current.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, cameraSpherical.current.phi - deltaY * 0.006));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraSpherical.current.radius = Math.max(25, Math.min(260, cameraSpherical.current.radius + e.deltaY * 0.12));
    };

    const handleCanvasClick = (e: MouseEvent) => {
      if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const clickableObjects: THREE.Object3D[] = [];
      truckMeshes.current.forEach((g) => clickableObjects.push(g));
      drillMeshes.current.forEach((g) => clickableObjects.push(g));
      shovelMeshes.current.forEach((g) => clickableObjects.push(g));
      blastZoneMeshes.current.forEach((g) => clickableObjects.push(g));

      const intersects = raycaster.intersectObjects(clickableObjects, true);
      if (intersects.length > 0) {
        let topGroup: THREE.Object3D | null = intersects[0].object;
        while (topGroup && !topGroup.userData.agentData && topGroup.parent) {
          topGroup = topGroup.parent;
        }
        if (topGroup && topGroup.userData.agentData) {
          if (onSelectAgentRef.current) {
            onSelectAgentRef.current(topGroup.userData.agentData);
          }
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('click', handleCanvasClick);

    // Animation Loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      // FPS tracking
      frameCount.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = now;
      }

      // Update particle effects
      particleSystems.current.forEach((ps) => {
        const posAttr = ps.geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] += 0.08; // float up
          if (arr[i + 1] > 20) {
            arr[i + 1] = 0;
            arr[i] += (Math.random() - 0.5) * 2;
            arr[i + 2] += (Math.random() - 0.5) * 2;
          }
        }
        posAttr.needsUpdate = true;
      });

      // Update Camera based on mode
      updateCameraPosition();

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleCanvasClick);
      renderer.dispose();
    };
  }, []);

  // Update Weather & Lighting
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const sun = scene.getObjectByName('sunLight') as THREE.DirectionalLight;
    const ambient = scene.getObjectByName('ambientLight') as THREE.AmbientLight;

    const weather = params?.weatherCondition ?? 'clear';

    if (weather === 'night') {
      scene.background = new THREE.Color(0x030712);
      scene.fog = new THREE.FogExp2(0x030712, 0.005);
      if (sun) sun.intensity = 0.15;
      if (ambient) ambient.intensity = 0.25;
    } else if (weather === 'sunset') {
      scene.background = new THREE.Color(0x2d1204);
      scene.fog = new THREE.FogExp2(0x2d1204, 0.004);
      if (sun) {
        sun.intensity = 1.2;
        sun.color.setHex(0xf97316);
      }
      if (ambient) ambient.intensity = 0.5;
    } else if (weather === 'dust_storm') {
      scene.background = new THREE.Color(0x451a03);
      scene.fog = new THREE.FogExp2(0x451a03, 0.02);
      if (sun) sun.intensity = 0.6;
      if (ambient) ambient.intensity = 0.4;
    } else {
      // Clear Day
      scene.background = new THREE.Color(0x0b1329);
      scene.fog = new THREE.FogExp2(0x0b1329, 0.0035);
      if (sun) {
        sun.intensity = 1.4;
        sun.color.setHex(0xfff4e6);
      }
      if (ambient) ambient.intensity = 0.65;
    }
  }, [params?.weatherCondition]);

  // Update Heatmap Visibility and Shading
  useEffect(() => {
    if (!heatmapMeshRef.current) return;
    if (heatmapMode === 'none') {
      heatmapMeshRef.current.visible = false;
    } else {
      heatmapMeshRef.current.visible = true;
      const mat = heatmapMeshRef.current.material as THREE.MeshBasicMaterial;
      if (heatmapMode === 'fragmentation') {
        mat.color.setHex(0x10b981); // Emerald for good fragmentation
        mat.opacity = 0.45;
      } else if (heatmapMode === 'energy') {
        mat.color.setHex(0xef4444); // Red/Orange for energy load
        mat.opacity = 0.5;
      } else if (heatmapMode === 'traffic') {
        mat.color.setHex(0xf59e0b); // Amber for queue congestion
        mat.opacity = 0.5;
      } else if (heatmapMode === 'grade') {
        mat.color.setHex(0x8b5cf6); // Purple for Cu/Au ore grade
        mat.opacity = 0.45;
      }
    }
  }, [heatmapMode]);

  // Update/Sync Dynamic Agents in Three.js
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // 1. Sync Drills
    drills.forEach((drill) => {
      let group = drillMeshes.current.get(drill.id);
      if (!group) {
        group = createDrillRigMesh(drill);
        drillMeshes.current.set(drill.id, group);
        scene.add(group);
      }
      group.userData.agentData = drill;
      group.position.set(drill.x, drill.y, drill.z);
      group.rotation.y = drill.rotation;

      const simSpeed = params?.simulationSpeed ?? 1.0;

      // Animate drill mast rotation & bit when active
      const mastBit = group.getObjectByName('drillBit');
      if (mastBit && drill.status === 'drilling') {
        mastBit.rotation.y += 0.25 * simSpeed;
      }
    });

    // 2. Sync Shovels
    shovels.forEach((shovel) => {
      let group = shovelMeshes.current.get(shovel.id);
      if (!group) {
        group = createShovelMesh(shovel);
        shovelMeshes.current.set(shovel.id, group);
        scene.add(group);
      }
      group.userData.agentData = shovel;
      group.position.set(shovel.x, shovel.y, shovel.z);

      // Articulated boom swing animation during loading
      const upperCab = group.getObjectByName('upperCab');
      const simSpeed = params?.simulationSpeed ?? 1.0;
      if (upperCab && shovel.status === 'loading') {
        upperCab.rotation.y = Math.sin(Date.now() * 0.002 * simSpeed) * 0.6;
      }
    });

    // 3. Sync Haul Trucks
    trucks.forEach((truck) => {
      let group = truckMeshes.current.get(truck.id);
      if (!group) {
        group = createTruckMesh(truck);
        truckMeshes.current.set(truck.id, group);
        scene.add(group);
      }
      group.userData.agentData = truck;
      group.position.set(truck.x, truck.y, truck.z);
      group.rotation.y = truck.rotation;

      // Dump bed tilt animation if dumping
      const dumpBed = group.getObjectByName('dumpBed');
      if (dumpBed) {
        if (truck.status === 'dumping') {
          dumpBed.rotation.x = -Math.PI / 4;
        } else {
          dumpBed.rotation.x = 0;
        }
      }

      // Payload visualization inside bed
      const payloadMesh = group.getObjectByName('payloadMesh');
      if (payloadMesh) {
        payloadMesh.visible = truck.currentPayloadTonnes > 20;
      }
    });

    // 4. Sync Blast Zones
    blastZones.forEach((zone) => {
      let group = blastZoneMeshes.current.get(zone.id);
      if (!group) {
        group = createBlastZoneMesh(zone);
        blastZoneMeshes.current.set(zone.id, group);
        scene.add(group);
      }
      group.userData.agentData = zone;
      group.position.set(zone.x, zone.benchElevation === 4120 ? 12 : 4, zone.z);

      const muckpile = group.getObjectByName('muckpile');
      const holeGrid = group.getObjectByName('holeGrid');
      if (muckpile && holeGrid) {
        muckpile.visible = zone.isBlasted;
        holeGrid.visible = !zone.isBlasted;
      }
    });
  }, [drills, shovels, trucks, blastZones, params?.simulationSpeed]);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    const mode = cameraModeRef.current;
    const currentSelectedId = selectedAgentIdRef.current;
    const currentTrucks = trucksRef.current;
    const currentShovels = shovelsRef.current;
    const currentDrills = drillsRef.current;

    if (mode === 'aerial') {
      // Top-down tactical aerial view
      camera.position.lerp(new THREE.Vector3(0, 190, 0.1), 0.08);
      cameraTarget.current.lerp(new THREE.Vector3(0, 0, 0), 0.08);
      camera.lookAt(cameraTarget.current);
    } else if (mode === 'follow' || mode === 'first_person') {
      let targetPos = new THREE.Vector3(0, 4, 0);
      let targetRot = 0;

      if (currentSelectedId) {
        const truck = currentTrucks.find((t) => t.id === currentSelectedId);
        const shovel = currentShovels.find((s) => s.id === currentSelectedId);
        const drill = currentDrills.find((d) => d.id === currentSelectedId);
        if (truck) {
          targetPos = new THREE.Vector3(truck.x, truck.y, truck.z);
          targetRot = truck.rotation;
        } else if (shovel) {
          targetPos = new THREE.Vector3(shovel.x, shovel.y, shovel.z);
          targetRot = shovel.rotation;
        } else if (drill) {
          targetPos = new THREE.Vector3(drill.x, drill.y, drill.z);
          targetRot = drill.rotation;
        }
      } else if (currentTrucks.length > 0) {
        targetPos = new THREE.Vector3(currentTrucks[0].x, currentTrucks[0].y, currentTrucks[0].z);
        targetRot = currentTrucks[0].rotation;
      }

      cameraTarget.current.lerp(targetPos, 0.1);

      if (mode === 'first_person') {
        // Cockpit view in driver's cabin looking forward along vehicle orientation
        const cabinPos = new THREE.Vector3(
          targetPos.x - Math.sin(targetRot) * 1.5,
          targetPos.y + 3.8,
          targetPos.z - Math.cos(targetRot) * 1.5
        );
        camera.position.lerp(cabinPos, 0.15);
        const lookAhead = new THREE.Vector3(
          targetPos.x + Math.sin(targetRot) * 40,
          targetPos.y + 2.0,
          targetPos.z + Math.cos(targetRot) * 40
        );
        camera.lookAt(lookAhead);
      } else {
        // Third-person chase camera tracking behind vehicle
        const followPos = new THREE.Vector3(
          targetPos.x - Math.sin(targetRot) * 28,
          targetPos.y + 14,
          targetPos.z - Math.cos(targetRot) * 28
        );
        camera.position.lerp(followPos, 0.08);
        camera.lookAt(new THREE.Vector3(targetPos.x, targetPos.y + 2.5, targetPos.z));
      }
    } else {
      // Free Orbit Mode
      cameraTarget.current.lerp(new THREE.Vector3(0, 4, 0), 0.06);
      const { radius, theta, phi } = cameraSpherical.current;
      const x = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);

      camera.position.set(x + cameraTarget.current.x, y + cameraTarget.current.y, z + cameraTarget.current.z);
      camera.lookAt(cameraTarget.current);
    }
  };

  // Helper: Open-Pit Terraced Benches Geometry
  const buildPitEnvironment = (scene: THREE.Scene) => {
    const pitGroup = new THREE.Group();
    pitGroup.name = 'pitEnvironment';

    // Benches (Terraced Cylinders / Rings with Rock Textures & Stepped Elevations)
    const benchMaterialHigh = new THREE.MeshStandardMaterial({
      color: 0x6e5842,
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const benchMaterialMid = new THREE.MeshStandardMaterial({
      color: 0x8a6e4d,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const benchMaterialFloor = new THREE.MeshStandardMaterial({
      color: 0x4a3b2c,
      roughness: 0.95,
      side: THREE.DoubleSide,
    });

    // Bench 1 (Top Level +16m)
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(85, 75, 8, 36, 1, true), benchMaterialHigh);
    b1.position.y = 16;
    b1.receiveShadow = true;
    pitGroup.add(b1);

    // Berma 1 (Horizontal terrace step at +12m)
    const berma1 = new THREE.Mesh(
      new THREE.RingGeometry(70, 75, 36),
      new THREE.MeshStandardMaterial({ color: 0x5a4734, roughness: 0.9, side: THREE.DoubleSide })
    );
    berma1.rotation.x = -Math.PI / 2;
    berma1.position.y = 12;
    berma1.receiveShadow = true;
    pitGroup.add(berma1);

    // Bench 2 (Mid Level +8m)
    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(70, 60, 8, 36, 1, true), benchMaterialMid);
    b2.position.y = 8;
    b2.receiveShadow = true;
    pitGroup.add(b2);

    // Berma 2 (Horizontal terrace step at +4m)
    const berma2 = new THREE.Mesh(
      new THREE.RingGeometry(55, 60, 36),
      new THREE.MeshStandardMaterial({ color: 0x5a4734, roughness: 0.9, side: THREE.DoubleSide })
    );
    berma2.rotation.x = -Math.PI / 2;
    berma2.position.y = 4;
    berma2.receiveShadow = true;
    pitGroup.add(berma2);

    // Bench 3 (Floor Level 0m)
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(55, 55, 2, 36), benchMaterialFloor);
    floor.position.y = -1;
    floor.receiveShadow = true;
    pitGroup.add(floor);

    // Outer Terrain Surrounding (Ring with hollow center to open the pit crater)
    const outerGround = new THREE.Mesh(
      new THREE.RingGeometry(85, 260, 48),
      new THREE.MeshStandardMaterial({ color: 0x2b241d, roughness: 0.9, side: THREE.DoubleSide })
    );
    outerGround.rotation.x = -Math.PI / 2;
    outerGround.position.y = 20;
    outerGround.receiveShadow = true;
    pitGroup.add(outerGround);

    // Haul Roads / Ramps Spiral Geometry (Visual Guides)
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(38, 14, 28), // Crusher top
      new THREE.Vector3(25, 10, 15),
      new THREE.Vector3(-15, 6, 20),
      new THREE.Vector3(-24, 4, 16), // Shovel 1
      new THREE.Vector3(14, 0, -12), // Shovel 2 pit floor
    ]);
    const roadGeo = new THREE.TubeGeometry(roadCurve, 40, 3.2, 8, false);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x3d332a, roughness: 0.7 });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.position.y = 0.2;
    roadMesh.receiveShadow = true;
    pitGroup.add(roadMesh);

    scene.add(pitGroup);
  };

  // Helper: Crusher & Waste Dump Infrastructure
  const buildProcessingInfrastructure = (scene: THREE.Scene) => {
    const infra = new THREE.Group();

    // 1. Primary Gyratory Crusher Building & Dump Pocket
    const crusherStation = new THREE.Group();
    crusherStation.position.set(38, 14, 28);

    const pocketGeo = new THREE.BoxGeometry(10, 6, 8);
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5, roughness: 0.4 });
    const pocket = new THREE.Mesh(pocketGeo, pocketMat);
    pocket.position.y = 3;
    pocket.castShadow = true;
    crusherStation.add(pocket);

    // Conveyor to Stockpile
    const conveyorGeo = new THREE.CylinderGeometry(0.8, 0.8, 24, 8);
    const conveyorMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const conveyor = new THREE.Mesh(conveyorGeo, conveyorMat);
    conveyor.position.set(10, 5, 8);
    conveyor.rotation.z = Math.PI / 4;
    crusherStation.add(conveyor);

    // Stockpile Cone
    const stockpile = new THREE.Mesh(
      new THREE.ConeGeometry(9, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0x785338, roughness: 0.9 })
    );
    stockpile.position.set(22, 4, 16);
    stockpile.castShadow = true;
    crusherStation.add(stockpile);

    // Crusher Label Beacon
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
    );
    beacon.position.set(0, 7.5, 0);
    crusherStation.add(beacon);

    infra.add(crusherStation);

    // 2. Waste Dump Plateau
    const wasteDump = new THREE.Group();
    wasteDump.position.set(-44, 14, 40);
    const dumpBerm = new THREE.Mesh(
      new THREE.CylinderGeometry(14, 18, 4, 16),
      new THREE.MeshStandardMaterial({ color: 0x5c4d3c, roughness: 0.95 })
    );
    dumpBerm.position.y = 2;
    dumpBerm.castShadow = true;
    wasteDump.add(dumpBerm);
    infra.add(wasteDump);

    scene.add(infra);
  };

  // Helper: Heatmap Plane
  const buildHeatmapPlane = (scene: THREE.Scene) => {
    const geo = new THREE.CircleGeometry(72, 48);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 4.3;
    mesh.visible = false;
    heatmapMeshRef.current = mesh;
    scene.add(mesh);
  };

  // Helper: Particles for dust and drilling
  const initParticleSystems = (scene: THREE.Scene) => {
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      positions[i] = -32 + (Math.random() - 0.5) * 12;
      positions[i + 1] = Math.random() * 12;
      positions[i + 2] = -28 + (Math.random() - 0.5) * 12;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd97706,
      size: 0.8,
      transparent: true,
      opacity: 0.5,
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    particleSystems.current.push(pSystem);
    scene.add(pSystem);
  };

  // Helper Meshes Creation
  const createTruckMesh = (truck: HaulTruck) => {
    const group = new THREE.Group();
    group.name = `truck_${truck.id}`;

    // Chassis Base
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1.2, 7.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4 })
    );
    chassis.position.y = 1.4;
    chassis.castShadow = true;
    group.add(chassis);

    // Yellow Mining Body / Cabin
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.8, 2.2),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.2, roughness: 0.3 })
    );
    cabin.position.set(-1.0, 2.8, 2.2);
    cabin.castShadow = true;
    group.add(cabin);

    // Front Windshield
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.9, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 })
    );
    glass.position.set(-1.0, 2.9, 3.32);
    group.add(glass);

    // Dump Bed (Articulated for Dumping)
    const bedGroup = new THREE.Group();
    bedGroup.name = 'dumpBed';
    bedGroup.position.set(0, 2.2, -1.0);

    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 2.0, 5.8),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.3, roughness: 0.5 })
    );
    bed.position.set(0, 1.0, -1.5);
    bed.castShadow = true;
    bedGroup.add(bed);

    // Payload rock inside bed
    const payload = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.8, 1),
      new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.9 })
    );
    payload.name = 'payloadMesh';
    payload.position.set(0, 1.8, -1.5);
    payload.scale.set(1.1, 0.6, 1.4);
    payload.castShadow = true;
    bedGroup.add(payload);

    group.add(bedGroup);

    // 6 Giant Hauler Wheels
    const wheelGeo = new THREE.CylinderGeometry(1.3, 1.3, 1.0, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const wheelPositions = [
      [-2.2, 1.3, 2.4],
      [2.2, 1.3, 2.4],
      [-2.4, 1.3, -2.4],
      [2.4, 1.3, -2.4],
      [-2.4, 1.3, -1.0],
      [2.4, 1.3, -1.0],
    ];
    wheelPositions.forEach((pos) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(pos[0], pos[1], pos[2]);
      w.castShadow = true;
      group.add(w);
    });

    // ID Badge on top
    const badge = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshBasicMaterial({ color: truck.status === 'hauling_full' ? 0x10b981 : 0xf59e0b })
    );
    badge.position.set(0, 4.8, 0);
    group.add(badge);

    return group;
  };

  const createDrillRigMesh = (drill: DrillRig) => {
    const group = new THREE.Group();
    group.name = `drill_${drill.id}`;

    // Crawler Tracks
    const tracks = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.8, 6.0),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
    );
    tracks.position.y = 0.4;
    group.add(tracks);

    // Body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 2.0, 4.5),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 })
    );
    body.position.set(0, 1.8, 0);
    group.add(body);

    // Tall Drilling Mast
    const mast = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 12.0, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 })
    );
    mast.position.set(0, 7.5, 2.2);
    group.add(mast);

    // Rotating Drill Bit
    const bit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.2, 3.0, 8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 })
    );
    bit.name = 'drillBit';
    bit.position.set(0, 4.0, 2.2);
    group.add(bit);

    return group;
  };

  const createShovelMesh = (shovel: Shovel) => {
    const group = new THREE.Group();
    group.name = `shovel_${shovel.id}`;

    // Track Base
    const tracks = new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 1.8, 9.0),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
    );
    tracks.position.y = 0.9;
    group.add(tracks);

    // Upper Revolving Cab
    const upperCab = new THREE.Group();
    upperCab.name = 'upperCab';
    upperCab.position.set(0, 2.0, 0);

    const house = new THREE.Mesh(
      new THREE.BoxGeometry(6.0, 4.5, 7.5),
      new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4 })
    );
    house.position.set(0, 2.2, -1.0);
    house.castShadow = true;
    upperCab.add(house);

    // Operator Cab Glass
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 2.0, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 })
    );
    cab.position.set(-2.2, 3.8, 2.0);
    upperCab.add(cab);

    // Giant Boom
    const boom = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 14.0, 1.4),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6 })
    );
    boom.position.set(0, 7.0, 4.5);
    boom.rotation.x = -Math.PI / 5;
    upperCab.add(boom);

    // Giant Dipper Bucket
    const bucket = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 3.2, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 })
    );
    bucket.position.set(0, 4.0, 9.0);
    bucket.castShadow = true;
    upperCab.add(bucket);

    group.add(upperCab);
    return group;
  };

  const createBlastZoneMesh = (zone: BlastZone) => {
    const group = new THREE.Group();
    group.name = `blastZone_${zone.id}`;

    // Collar Boundary
    const boundGeo = new THREE.BoxGeometry(zone.width, 0.4, zone.length);
    const boundMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });
    const bound = new THREE.Mesh(boundGeo, boundMat);
    group.add(bound);

    // Drill Hole Grid Pattern
    const holeGrid = new THREE.Group();
    holeGrid.name = 'holeGrid';
    const holeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    const rows = 4;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const h = new THREE.Mesh(holeGeo, holeMat);
        h.position.set((c - cols / 2) * (zone.width / cols), 0.2, (r - rows / 2) * (zone.length / rows));
        holeGrid.add(h);
      }
    }
    group.add(holeGrid);

    // Muckpile (Blasted broken rock mound)
    const muckpile = new THREE.Mesh(
      new THREE.SphereGeometry(zone.width / 2.2, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0x785338, roughness: 0.95 })
    );
    muckpile.name = 'muckpile';
    muckpile.scale.set(1.0, 0.35, 1.4);
    muckpile.position.y = 1.8;
    muckpile.visible = zone.isBlasted;
    group.add(muckpile);

    return group;
  };

  const handleTriggerBlastWithFX = (zone: BlastZone) => {
    if (zone.isBlasted) return;

    if (sceneRef.current) {
      const scene = sceneRef.current;
      const yOrigin = zone.benchElevation === 4120 ? 12 : 4;

      // 1. Point Light Flash
      const flash = new THREE.PointLight(0xff6600, 25, 150);
      flash.position.set(zone.x, yOrigin + 4, zone.z);
      scene.add(flash);

      let flashLife = 1.0;
      const fadeFlash = () => {
        flashLife -= 0.05;
        if (flashLife > 0) {
          flash.intensity = flashLife * 25;
          requestAnimationFrame(fadeFlash);
        } else {
          scene.remove(flash);
        }
      };
      requestAnimationFrame(fadeFlash);

      // 2. Blast Dust & Fragment Particle Shockwave
      const pCount = 320;
      const pGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(pCount * 3);
      const velocities: THREE.Vector3[] = [];
      for (let i = 0; i < pCount; i++) {
        positions[i * 3] = zone.x + (Math.random() - 0.5) * zone.width;
        positions[i * 3 + 1] = yOrigin + Math.random() * 2;
        positions[i * 3 + 2] = zone.z + (Math.random() - 0.5) * zone.length;
        velocities.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * 1.5,
            Math.random() * 2.6 + 1.2,
            (Math.random() - 0.5) * 1.5
          )
        );
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xf97316,
        size: 2.8,
        transparent: true,
        opacity: 0.95,
      });
      const blastParticles = new THREE.Points(pGeo, pMat);
      scene.add(blastParticles);

      let life = 0;
      const animateBlast = () => {
        life += 0.025;
        const posAttr = blastParticles.geometry.attributes.position as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;
        for (let i = 0; i < pCount; i++) {
          posArr[i * 3] += velocities[i].x;
          posArr[i * 3 + 1] += velocities[i].y * Math.max(0.15, 1 - life);
          posArr[i * 3 + 2] += velocities[i].z;
        }
        posAttr.needsUpdate = true;
        pMat.opacity = Math.max(0, 0.95 - life);
        if (life > 0.25) pMat.color.setHex(0x785338);

        if (life < 1.0) {
          requestAnimationFrame(animateBlast);
        } else {
          scene.remove(blastParticles);
          blastParticles.geometry.dispose();
          pMat.dispose();
        }
      };
      requestAnimationFrame(animateBlast);
    }

    // 3. Camera Shockwave Shake
    if (cameraRef.current) {
      const origPos = cameraRef.current.position.clone();
      let shakeTime = 0;
      const shakeInterval = setInterval(() => {
        shakeTime += 40;
        if (shakeTime < 420 && cameraRef.current) {
          cameraRef.current.position.x = origPos.x + (Math.random() - 0.5) * 2.4;
          cameraRef.current.position.y = origPos.y + (Math.random() - 0.5) * 1.6;
          cameraRef.current.position.z = origPos.z + (Math.random() - 0.5) * 2.4;
        } else {
          clearInterval(shakeInterval);
          if (cameraRef.current) cameraRef.current.position.copy(origPos);
        }
      }, 40);
    }

    onTriggerBlast?.(zone.id);
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-[#0a0b0e] rounded overflow-hidden border border-[#1f2937] shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating HUD: Telemetry & Controls */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="bg-[#0f1115]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#1f2937] shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-xs font-semibold text-white tracking-wide font-tech uppercase">
            Digital Twin 3D Live
          </span>
          <span className="text-xs font-mono text-[#00f2ff] bg-[#00f2ff]/10 px-1.5 py-0.5 rounded border border-[#00f2ff]/30">
            {fps} FPS
          </span>
        </div>

        {/* Heatmap Layer Badge */}
        {heatmapMode !== 'none' && (
          <div className="bg-[#0f1115]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#00f2ff]/40 text-xs font-medium text-[#00f2ff] flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,242,255,0.15)] font-tech uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00f2ff]" />
            Capa Activa: <strong className="capitalize">{heatmapMode}</strong>
          </div>
        )}
      </div>

      {/* Bottom Floating Quick Actions: Trigger Blast & Camera Shortcuts */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Active Blast Zone Trigger Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {blastZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => handleTriggerBlastWithFX(zone)}
              disabled={zone.isBlasted}
              className={`px-3.5 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg ${
                zone.isBlasted
                  ? 'bg-[#15181e] text-[#6b7280] border border-[#1f2937] cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:brightness-110 text-white border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse font-bold cursor-pointer'
              }`}
            >
              <span className="text-sm">💥</span>
              {zone.isBlasted ? `${zone.id} (Detonado)` : `Detonar ${zone.id}`}
            </button>
          ))}
        </div>

        {/* Navigation Hint */}
        <div className="pointer-events-auto bg-[#0f1115]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#1f2937] text-[11px] text-[#9ca3af] font-mono hidden md:flex items-center gap-3">
          <span>🖱️ Click Izq + Arrastrar: Rotar Órbita</span>
          <span>•</span>
          <span>Rueda: Zoom</span>
          <span>•</span>
          <span>Click en Maquinaria: HUD Telemetría</span>
        </div>
      </div>
    </div>
  );
};
