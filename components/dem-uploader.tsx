'use client';

interface DemUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function DemUploader({ onFileSelect }: DemUploaderProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">2. Upload Terrain Model</h2>
      <p className="text-sm text-gray-600 mb-4">
        Upload a Digital Elevation Model (DEM) in GeoTIFF format for 3D terrain visualization.
      </p>
      <input
        type="file"
        accept=".tif,.tiff"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      <div className="mt-3 text-xs text-gray-500">
        <p><strong>Note:</strong> The DEM file is used to generate the 3D terrain model where zone risks will be visualized.</p>
      </div>
    </div>
  );
}