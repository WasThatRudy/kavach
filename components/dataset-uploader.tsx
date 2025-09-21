"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface DatasetUploaderProps {
  onDatasetAnalysis: (data: any) => void;
}

interface FilePreview {
  name: string;
  size: number;
  rows: number;
  columns: string[];
}

export default function DatasetUploader({
  onDatasetAnalysis,
}: DatasetUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate file type
      if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error("Please upload a CSV file (.csv extension required)");
      }

      // Preview file content
      const text = await file.text();
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      setFilePreview({
        name: file.name,
        size: file.size,
        rows: lines.length - 1, // Exclude header
        columns: headers,
      });

      // Validate required columns
      const requiredColumns = ["zone_id", "avg_slope_deg", "cohesion_kpa"];
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col)
      );

      if (missingColumns.length > 0) {
        throw new Error(
          `Missing required columns: ${missingColumns.join(", ")}`
        );
      }

      // Create FormData and send the file
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/rockfall-data", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Analysis failed: ${response.status}`
        );
      }

      const analysisResult = await response.json();
      onDatasetAnalysis(analysisResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during file processing"
      );
      setFilePreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = Array.from(event.dataTransfer.files);
      const csvFile = files.find((file) =>
        file.name.toLowerCase().endsWith(".csv")
      );

      if (csvFile) {
        await processFile(csvFile);
      } else {
        setError("Please drop a CSV file");
      }
    },
    []
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    const templateData = `zone_id,avg_slope_deg,avg_aspect_deg,avg_curvature,cohesion_kpa,friction_angle_deg,rock_density_kg_m3,timestamp,rainfall_mm_hr,temperature_celsius,seismic_vibration_pgv,rockfall_occurred
Zone_1,35.5,142.3,0.025,8.2,15.4,2380.5,01-01-2025,15.8,18.3,2.8,1
Zone_2,12.8,98.1,0.012,25.3,31.6,2580.2,02-01-2025,0.2,13.7,0.05,0
Zone_3,45.7,198.2,0.038,6.2,13.1,2250.4,03-01-2025,25.1,20.2,3.8,1
Zone_4,18.6,156.2,0.018,18.9,24.7,2510.3,04-01-2025,2.1,15.2,0.08,0`;

    const blob = new Blob([templateData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kavach_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-amber flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Dataset Upload
          </h2>
          <p className="text-muted-foreground mt-1">
            Upload geological survey data for AI-powered risk analysis
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary"
        >
          <Download className="w-4 h-4" />
          Template
        </button>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-primary bg-primary/5 scale-105"
            : "border-border hover:border-primary/50 hover:bg-primary/5"
        } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
        />

        <div className="space-y-4">
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          ) : (
            <Upload
              className={`w-12 h-12 mx-auto transition-colors ${
                isDragOver ? "text-primary" : "text-muted-foreground"
              }`}
            />
          )}

          <div>
            <p className="text-lg font-medium text-foreground">
              {isLoading
                ? "Processing your dataset..."
                : "Drop your CSV file here or click to browse"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Maximum file size: 10MB • Supported format: CSV
            </p>
          </div>
        </div>
      </div>

      {/* File Preview */}
      {filePreview && (
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-foreground">
              File Validated Successfully
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">File Name:</span>
              <span className="ml-2 font-medium">{filePreview.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">File Size:</span>
              <span className="ml-2 font-medium">
                {(filePreview.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Data Rows:</span>
              <span className="ml-2 font-medium">{filePreview.rows}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Columns:</span>
              <span className="ml-2 font-medium">
                {filePreview.columns.length}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-muted-foreground text-sm">
              Detected Columns:
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {filePreview.columns.map((col, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-destructive">Upload Error</h3>
          </div>
          <p className="text-sm text-destructive/80 mt-1">{error}</p>
        </div>
      )}

      {/* Requirements */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Data Requirements
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-green-600">
              Required Columns:
            </span>
            <span className="ml-2">zone_id, avg_slope_deg, cohesion_kpa</span>
          </div>
          <div>
            <span className="font-medium text-blue-600">Optional Columns:</span>
            <span className="ml-2">
              avg_aspect_deg, avg_curvature, friction_angle_deg,
              rock_density_kg_m3, rainfall_mm_hr, temperature_celsius,
              seismic_vibration_pgv, timestamp, rockfall_occurred
            </span>
          </div>
          <div className="pt-2 border-t border-border">
            <span className="font-medium">Example Data:</span>
            <span className="ml-2">
              Geological survey measurements, environmental sensor data,
              historical rockfall records
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
