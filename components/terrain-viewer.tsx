'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { RockfallEvent } from '@/types';

// Create a more robust dynamic import with error boundary
const ThreeJSViewer = dynamic(() => import('./three-js-viewer'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading 3D viewer...</div>
});

interface TerrainViewerProps {
  zones: RockfallEvent[];
  onZoneHover?: (zoneId: string | null) => void;
  hoveredZoneId?: string | null;
}

export default function TerrainViewer({ zones, onZoneHover, hoveredZoneId }: TerrainViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex items-center justify-center h-full">Initializing mine terrain...</div>;
  }

  return <ThreeJSViewer zones={zones} onZoneHover={onZoneHover} hoveredZoneId={hoveredZoneId} />;
}