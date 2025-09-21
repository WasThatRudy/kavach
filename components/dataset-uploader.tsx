'use client';

import { useState } from 'react';

interface DatasetUploaderProps {
  onDatasetAnalysis: (data: any) => void;
}

export default function DatasetUploader({ onDatasetAnalysis }: DatasetUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create FormData and send the actual file
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/rockfall-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const analysisResult = await response.json();
      onDatasetAnalysis(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">1. Upload Dataset</h2>
      <p className="text-sm text-gray-600 mb-4">
        Upload a CSV file containing geological data for rockfall analysis.
      </p>
      
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={isLoading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />
      
      {isLoading && (
        <div className="mt-3 text-sm text-blue-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Analyzing dataset...
        </div>
      )}
      
      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        <p><strong>Required columns:</strong> zone_id, avg_slope_deg, cohesion_kpa</p>
        <p><strong>Optional columns:</strong> avg_aspect_deg, avg_curvature, friction_angle_deg, rock_density_kg_m3, rainfall_mm_hr, temperature_celsius, seismic_vibration_pgv, timestamp</p>
      </div>
    </div>
  );
}
