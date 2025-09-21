'use client';

import { useState, useEffect, useRef } from 'react';
import type { RockfallEvent } from '@/types';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

interface HoveredZone {
  zoneData: RockfallEvent & { zoneId: number };
  screenPosition: { x: number; y: number };
}

interface ThreeJSViewerProps {
  zones: RockfallEvent[];
  // ✅ NEW: Props for parent communication
  onZoneHover?: (zoneId: string | null) => void;
  hoveredZoneId?: string | null;
}

export default function ThreeJSViewer({ zones, onZoneHover, hoveredZoneId }: ThreeJSViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const threeRef = useRef<any>({});
  const [hoveredZone, setHoveredZone] = useState<HoveredZone | null>(null);
  const originalColorsRef = useRef<Float32Array | null>(null);
  const lastHoveredZoneIdRef = useRef<number>(-1);
  
  const GRID_SIZE = 7;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsLoading(true);

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 8000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x87CEEB);
      camera.position.set(0, 800, 700);
      camera.lookAt(0, 0, 0);

      threeRef.current.scene = scene;
      threeRef.current.camera = camera;
      threeRef.current.renderer = renderer;
      
      const width = 800;
      const height = 800;
      const data = [];
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.85;
      const rimElevation = 300;
      const pitDepth = 800;
      const shapePower = 1.7; 
      const flatBottomRadius = maxRadius * 0.15;
      const noise = new SimplexNoise();

      for (let i = 0; i < width * height; i++) {
        const x = i % width; const y = Math.floor(i / width); const dx = x - centerX; const dy = y - centerY; const distance = Math.sqrt(dx * dx + dy * dy); let elevation;
        if (distance < flatBottomRadius) { elevation = rimElevation - pitDepth; } else if (distance < maxRadius) { const slopeRange = maxRadius - flatBottomRadius; const distanceFromSlopeStart = distance - flatBottomRadius; const normalizedSlopeDistance = distanceFromSlopeStart / slopeRange; const depthFactor = Math.pow(normalizedSlopeDistance, shapePower); elevation = (rimElevation - pitDepth) + (depthFactor * pitDepth); } else { elevation = rimElevation + noise.noise(x / 80, y / 80) * 25; }
        const noiseFactor = Math.min(1, distance / (maxRadius * 0.5)); elevation += noise.noise(x / 40, y / 40) * 8 * noiseFactor;
        data.push(elevation);
      }
      
      const minElevation = rimElevation - pitDepth;
      const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
      const vertices = geometry.attributes.position.array;
      for (let i = 0; i < vertices.length / 3; i++) { vertices[i * 3 + 2] = data[i] / 5; }
      geometry.computeVertexNormals();
      threeRef.current.geometry = geometry;
      
      const colors = new Float32Array(geometry.attributes.position.count * 3);
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.MeshLambertMaterial({ vertexColors: true });
      const terrain = new THREE.Mesh(geometry, material);
      terrain.rotation.x = -Math.PI / 2;
      scene.add(terrain);
      threeRef.current.terrain = terrain;

      const waterGeometry = new THREE.CircleGeometry(flatBottomRadius * 0.9, 64);
      const waterMaterial = new THREE.MeshBasicMaterial({ color: 0x225577, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
      const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.y = minElevation / 5 + 0.5;
      scene.add(waterMesh);

      const ambientLight = new THREE.AmbientLight(0xcccccc, 0.7); scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); directionalLight.position.set(200, 400, 300); scene.add(directionalLight);

      const animate = () => {
        if (!threeRef.current.renderer) return;
        const rotation = Date.now() * 0.00003;
        threeRef.current.camera.position.x = Math.cos(rotation) * 900;
        threeRef.current.camera.position.z = Math.sin(rotation) * 900;
        threeRef.current.camera.lookAt(0, 0, 0);
        threeRef.current.renderer.render(threeRef.current.scene, threeRef.current.camera);
        threeRef.current.frameId = requestAnimationFrame(animate);
      };
      animate();

    } catch (err) {
      console.error("Failed to initialize 3D scene:", err);
      setError("Could not load the 3D viewer.");
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastDetectedZoneId = -1;

    const onMouseMove = (event: MouseEvent) => {
      if (!threeRef.current.renderer || !threeRef.current.camera || !threeRef.current.terrain) return;

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, threeRef.current.camera);
      const intersects = raycaster.intersectObject(threeRef.current.terrain);

      if (intersects.length > 0) {
        const { point } = intersects[0];
        const width = 800; const height = 800;
        
        const gridX = Math.floor(((point.x + width / 2) / width) * GRID_SIZE);
        const gridZ = Math.floor(((-point.z + height / 2) / height) * GRID_SIZE);

        if (gridX >= 0 && gridX < GRID_SIZE && gridZ >= 0 && gridZ < GRID_SIZE) {
          const gridZoneId = gridZ * GRID_SIZE + gridX;
          
          // Only update if we're hovering a different zone
          if (lastDetectedZoneId !== gridZoneId) {
            const zoneData = zones[gridZoneId % zones.length];

            if (zoneData) {
              // Show local tooltip
              setHoveredZone({
                zoneData: { ...zoneData, zoneId: gridZoneId },
                screenPosition: { x: event.clientX, y: event.clientY },
              });
              
              // Call parent hover function
              onZoneHover?.(zoneData.zone_id);
              lastDetectedZoneId = gridZoneId;
              return;
            }
          } else {
            // Same zone, just update tooltip position
            const zoneData = zones[gridZoneId % zones.length];
            if (zoneData && hoveredZone) {
              setHoveredZone({
                ...hoveredZone,
                screenPosition: { x: event.clientX, y: event.clientY },
              });
            }
            return;
          }
        }
      }
      
      // No intersection or out of bounds
      if (lastDetectedZoneId !== -1) {
        setHoveredZone(null);
        onZoneHover?.(null);
        lastDetectedZoneId = -1;
      }
    };
    
    const onMouseLeave = () => {
        setHoveredZone(null);
        onZoneHover?.(null);
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
      if (threeRef.current.frameId) cancelAnimationFrame(threeRef.current.frameId);
      if (threeRef.current.renderer) threeRef.current.renderer.dispose();
      if (threeRef.current.geometry) threeRef.current.geometry.dispose();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []); // Note: empty array means this setup runs only once

  // Effect for coloring the terrain whenever `zones` changes
  useEffect(() => {
    if (!threeRef.current.geometry || zones.length === 0) {
      setIsLoading(false);
      return;
    };
    
    console.log(`🎨 Coloring Terrain into ${GRID_SIZE}x${GRID_SIZE} Zones...`);
    const geometry = threeRef.current.geometry;
    const colors = geometry.attributes.color.array as Float32Array;
    const positions = geometry.attributes.position.array as Float32Array;

    const width = 800; const maxRadius = (width / 2) * 0.85;
    const outsideColor = new THREE.Color(0x9E9E9E);

    for (let i = 0; i < geometry.attributes.position.count; i++) {
        const vertexX = positions[i * 3]; const vertexZ = positions[i * 3 + 1];
        const distance = Math.sqrt(vertexX**2 + vertexZ**2);
        let finalColor: THREE.Color;

        if (distance < maxRadius) {
            const gridX = Math.floor(((vertexX + width / 2) / width) * GRID_SIZE);
            const gridZ = Math.floor(((-vertexZ + width / 2) / width) * GRID_SIZE);
            const zoneId = gridZ * GRID_SIZE + gridX;
            const zoneData = zones[zoneId % zones.length]; 
            
            if (zoneData?.color) {
                finalColor = new THREE.Color(zoneData.color);
            } else {
                // Fallback to binary colors if no color specified
                finalColor = zoneData?.rockfall_occurred ? new THREE.Color(0xF44336) : new THREE.Color(0x4CAF50);
            }
        } else {
            finalColor = outsideColor;
        }
        
        colors[i * 3] = finalColor.r; colors[i * 3 + 1] = finalColor.g; colors[i * 3 + 2] = finalColor.b;
    }

    originalColorsRef.current = new Float32Array(colors);
    geometry.attributes.color.needsUpdate = true;
    setIsLoading(false);

  }, [zones]);

  const highlightZone = (zoneId: number | null) => {
    if (!threeRef.current.geometry || !originalColorsRef.current) return;
    const geometry = threeRef.current.geometry;
    const colors = geometry.attributes.color.array as Float32Array;
    
    // If zoneId is null, restore original colors
    if (zoneId === null) {
        colors.set(originalColorsRef.current);
        geometry.attributes.color.needsUpdate = true;
        return;
    }

    const positions = geometry.attributes.position.array as Float32Array;
    const width = 800;
    const tempColors = new Float32Array(originalColorsRef.current);

    for (let i = 0; i < geometry.attributes.position.count; i++) {
        const vertexX = positions[i * 3]; 
        const vertexZ = positions[i * 3 + 1];
        
        // More accurate grid calculation
        const gridX = Math.floor(((vertexX + width / 2) / width) * GRID_SIZE);
        const gridZ = Math.floor(((-vertexZ + width / 2) / width) * GRID_SIZE);
        const currentZoneId = gridZ * GRID_SIZE + gridX;

        if (currentZoneId === zoneId) {
            // More intense highlighting with white overlay
            tempColors[i * 3] = Math.min(1, tempColors[i * 3] * 1.8 + 0.3);     // Add white
            tempColors[i * 3 + 1] = Math.min(1, tempColors[i * 3 + 1] * 1.8 + 0.3); // Add white  
            tempColors[i * 3 + 2] = Math.min(1, tempColors[i * 3 + 2] * 1.8 + 0.3); // Add white
        }
    }
    
    colors.set(tempColors);
    geometry.attributes.color.needsUpdate = true;
  }

  // ✅ Effect to handle highlighting from parent component
  useEffect(() => {
    if (!zones || zones.length === 0) return;
    
    if (hoveredZoneId) {
        const zoneToHighlight = zones.find(z => z.zone_id === hoveredZoneId);
        if (zoneToHighlight) {
            // Find the grid position for this zone
            const zoneIndex = zones.indexOf(zoneToHighlight);
            const gridIndex = zoneIndex % (GRID_SIZE * GRID_SIZE); // Map to grid
            
            if (gridIndex !== -1) {
                if (lastHoveredZoneIdRef.current !== gridIndex) {
                    highlightZone(gridIndex);
                    lastHoveredZoneIdRef.current = gridIndex;
                }
            }
        }
    } else {
        if (lastHoveredZoneIdRef.current !== -1) {
            highlightZone(null); // Restore colors
            lastHoveredZoneIdRef.current = -1;
        }
    }
  }, [hoveredZoneId, zones]);


  if (error) { return <div className="flex items-center justify-center h-full p-4 text-red-500 bg-white rounded-lg">{error}</div>; }

  return (
    <div className="h-full bg-white rounded-lg overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>Initializing Scene...</p>
          </div>
        </div>
      )}
      
      {hoveredZone && (
        <div className="absolute top-20 left-4 p-3 text-sm bg-black/90 text-white rounded-lg shadow-xl pointer-events-none z-20 backdrop-blur-sm border border-white/20 max-w-xs"
        >
            <p className="font-bold">{hoveredZone.zoneData.zone_id}</p>
            <p>Risk: <span style={{ color: hoveredZone.zoneData.color || '#6B7280' }}>
              {hoveredZone.zoneData.riskLevel || (hoveredZone.zoneData.rockfall_occurred ? 'High' : 'Low')}
            </span></p>
            {hoveredZone.zoneData.probability && (
              <p>Probability: <span className="font-mono">{(hoveredZone.zoneData.probability * 100).toFixed(1)}%</span></p>
            )}
            <p>Slope: {hoveredZone.zoneData.avg_slope_deg.toFixed(1)}°</p>
            <p>Cohesion: {hoveredZone.zoneData.cohesion_kpa.toFixed(1)} kPa</p>
        </div>
      )}

      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm text-sm max-w-xs z-10">
        <h4 className="font-semibold mb-2">🛰️ Interactive Mine View</h4>
        <p>Geological Risk Assessment</p>
        <p className="text-xs text-gray-600 mt-1">{GRID_SIZE*GRID_SIZE}-Zone Grid with Hover Details</p>
      </div>
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm text-sm z-10 backdrop-blur-sm">
        <h4 className="font-semibold mb-2">Risk Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2"> <div className="w-3 h-3 rounded-full" style={{ background: '#ff4444' }}></div> <span>Critical</span> </div>
          <div className="flex items-center gap-2"> <div className="w-3 h-3 rounded-full" style={{ background: '#ff8800' }}></div> <span>High</span> </div>
          <div className="flex items-center gap-2"> <div className="w-3 h-3 rounded-full" style={{ background: '#ffbf00' }}></div> <span>Medium</span> </div>
          <div className="flex items-center gap-2"> <div className="w-3 h-3 rounded-full" style={{ background: '#ffd700' }}></div> <span>Low</span> </div>
          <div className="flex items-center gap-2"> <div className="w-3 h-3 rounded-full" style={{ background: '#88ff88' }}></div> <span>Very Low</span> </div>
        </div>
      </div>
    </div>
  );
}