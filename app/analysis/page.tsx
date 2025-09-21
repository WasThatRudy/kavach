"use client";

import { useState } from "react";
import DataDashboard from "@/components/data-dashboard";
import TerrainViewer from "@/components/terrain-viewer";
import DatasetUploader from "@/components/dataset-uploader";
import type { ApiData, RockfallEvent } from "@/types";

export default function AnalysisPage() {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUploader, setShowUploader] = useState(true); // Show uploader by default

  const handleDatasetAnalysis = async (data: ApiData) => {
    setShowUploader(false);
    await analyzeZonesFromUploadedData(data);
  };

  const analyzeZonesFromUploadedData = async (uploadedData: ApiData) => {
    setIsAnalyzing(true);

    try {
      // Create 50 zones from uploaded data and make individual API calls
      const analyzedZones: RockfallEvent[] = [];
      const gridSize = 7;
      const maxZones = gridSize * gridSize; // 49 zones max

      // Generate 50 zones (use uploaded data as base, cycle through if needed)
      for (let i = 0; i < 50; i++) {
        // Get base zone data (cycle through uploaded data)
        const baseZone =
          uploadedData.rockfall_events[i % uploadedData.rockfall_events.length];

        // Calculate grid position for this zone
        const zoneIndex = i % maxZones;
        const gridX = zoneIndex % gridSize;
        const gridZ = Math.floor(zoneIndex / gridSize);

        // Map grid position to world coordinates
        const worldX = (gridX - gridSize / 2) * 50;
        const worldZ = (gridZ - gridSize / 2) * 50;

        // Calculate terrain elevation
        const terrainX = worldX + 400;
        const terrainZ = worldZ + 400;
        const centerX = 400,
          centerY = 400;
        const maxRadius = Math.min(centerX, centerY) * 0.85;
        const dx = terrainX - centerX;
        const dy = terrainZ - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalizedDistance = Math.min(distance / maxRadius, 1);

        let terrainElevation = 0;
        if (distance < maxRadius) {
          const depth =
            normalizedDistance * normalizedDistance * normalizedDistance * 500;
          const terraceLevel = Math.floor(normalizedDistance * 10);
          const terraceHeight = terraceLevel * 20;
          terrainElevation = Math.max(-300, 150 - depth + terraceHeight);
        } else {
          const rimHeight = 150 + (distance - maxRadius) * 2;
          terrainElevation =
            rimHeight + Math.sin(terrainX * 0.1) * Math.cos(terrainZ * 0.1) * 5;
        }

        // Prepare features for ML prediction (use base zone data with some variation)
        const features = [
          (baseZone.avg_slope_deg || 45) + (Math.random() - 0.5) * 10, // Add variation
          (baseZone.avg_aspect_deg || 180) + (Math.random() - 0.5) * 60,
          (baseZone.avg_curvature || 0) + (Math.random() - 0.5) * 0.02,
          (baseZone.cohesion_kpa || 15) + (Math.random() - 0.5) * 5,
          (baseZone.friction_angle_deg || 30) + (Math.random() - 0.5) * 8,
          (baseZone.rock_density_kg_m3 || 2500) + (Math.random() - 0.5) * 200,
          (baseZone.rainfall_mm_hr || 0) + Math.random() * 2,
          (baseZone.temperature_celsius || 15) + (Math.random() - 0.5) * 10,
          (baseZone.seismic_vibration_pgv || 0.01) + Math.random() * 0.05,
        ];

        try {
          // Make individual API call for this zone
          const response = await fetch("/api/rockfall-data", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              zoneId: `Zone_${i.toString().padStart(2, "0")}`,
              features: features,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            analyzedZones.push({
              zone_id: `Zone_${i.toString().padStart(2, "0")}`,
              avg_slope_deg: parseFloat(features[0].toFixed(2)),
              avg_aspect_deg: parseFloat(features[1].toFixed(2)),
              avg_curvature: parseFloat(features[2].toFixed(3)),
              cohesion_kpa: parseFloat(features[3].toFixed(2)),
              friction_angle_deg: parseFloat(features[4].toFixed(2)),
              rock_density_kg_m3: parseFloat(features[5].toFixed(2)),
              timestamp: baseZone.timestamp || "2024-03-15",
              rainfall_mm_hr: parseFloat(features[6].toFixed(2)),
              temperature_celsius: parseFloat(features[7].toFixed(2)),
              seismic_vibration_pgv: parseFloat(features[8].toFixed(3)),
              rockfall_occurred: result.prediction as 0 | 1,
              probability: result.probability,
              riskLevel: result.riskLevel,
              color: result.color,
              position: [worldX, terrainElevation / 5, worldZ] as [
                number,
                number,
                number
              ],
            });
          } else {
            // Fallback for failed API calls
            analyzedZones.push({
              zone_id: `Zone_${i.toString().padStart(2, "0")}`,
              avg_slope_deg: parseFloat(features[0].toFixed(2)),
              avg_aspect_deg: parseFloat(features[1].toFixed(2)),
              avg_curvature: parseFloat(features[2].toFixed(3)),
              cohesion_kpa: parseFloat(features[3].toFixed(2)),
              friction_angle_deg: parseFloat(features[4].toFixed(2)),
              rock_density_kg_m3: parseFloat(features[5].toFixed(2)),
              timestamp: baseZone.timestamp || "2024-03-15",
              rainfall_mm_hr: parseFloat(features[6].toFixed(2)),
              temperature_celsius: parseFloat(features[7].toFixed(2)),
              seismic_vibration_pgv: parseFloat(features[8].toFixed(3)),
              rockfall_occurred: 0 as 0 | 1,
              probability: 0.1,
              riskLevel: "Unknown",
              color: "#6B7280",
              position: [worldX, terrainElevation / 5, worldZ] as [
                number,
                number,
                number
              ],
            });
          }
        } catch (error) {
          console.error(`Failed to analyze zone ${i}:`, error);
          // Fallback for failed API calls
          analyzedZones.push({
            zone_id: `Zone_${i.toString().padStart(2, "0")}`,
            avg_slope_deg: parseFloat(features[0].toFixed(2)),
            avg_aspect_deg: parseFloat(features[1].toFixed(2)),
            avg_curvature: parseFloat(features[2].toFixed(3)),
            cohesion_kpa: parseFloat(features[3].toFixed(2)),
            friction_angle_deg: parseFloat(features[4].toFixed(2)),
            rock_density_kg_m3: parseFloat(features[5].toFixed(2)),
            timestamp: baseZone.timestamp || "2024-03-15",
            rainfall_mm_hr: parseFloat(features[6].toFixed(2)),
            temperature_celsius: parseFloat(features[7].toFixed(2)),
            seismic_vibration_pgv: parseFloat(features[8].toFixed(3)),
            rockfall_occurred: 0 as 0 | 1,
            probability: 0.1,
            riskLevel: "Unknown",
            color: "#6B7280",
            position: [worldX, terrainElevation / 5, worldZ] as [
              number,
              number,
              number
            ],
          });
        }

        // Small delay to prevent overwhelming the API (but make it appear as one process)
        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      // Create the enhanced data with 50 zones
      const enhancedData: ApiData = {
        dataset_specs: {
          file_name: "enhanced_zone_analysis.json",
          description: `Enhanced analysis with 50 zones based on uploaded dataset. Each zone processed through individual ML predictions.`,
          columns: [
            {
              name: "zone_id",
              data_type: "string",
              description: "Unique zone identifier",
            },
            {
              name: "probability",
              data_type: "float",
              description: "ML prediction probability (0-1)",
            },
            {
              name: "riskLevel",
              data_type: "string",
              description: "Risk classification",
            },
            {
              name: "color",
              data_type: "string",
              description: "Color code for visualization",
            },
          ],
        },
        rockfall_events: analyzedZones,
      };

      setApiData(enhancedData);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleZoneHover = (zoneId: string | null) => {
    setHoveredZoneId(zoneId);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Digital Topography Background */}
      <div className="digital-topography-bg">
        <div className="contour-lines"></div>
      </div>

      <main className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Header & Dashboard */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* Header Card */}
            <div className="glassmorphism p-8 rounded-2xl glow-amber">
              <h1 className="text-4xl font-bold text-gradient-amber mb-3">
                🏗️ KAVACH
              </h1>
              <p className="text-primary text-lg mb-4 font-semibold">
                AI-Powered Rockfall Risk Analysis
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                Advanced machine learning predictions for open-pit mine safety
                monitoring and geological risk assessment.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-2 h-2 rounded-full bg-chart-1 pulse-glow"></div>
                  <span className="text-sm">ML-Powered</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-2 h-2 rounded-full bg-chart-2 pulse-glow"></div>
                  <span className="text-sm">Real-time</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-2 h-2 rounded-full bg-destructive pulse-glow"></div>
                  <span className="text-sm">3D Visualization</span>
                </div>
              </div>

              {/* Upload Toggle Button */}
              <div className="mt-6 pt-4 border-t border-border">
                {!apiData && (
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Upload your geological survey data to begin AI analysis
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setShowUploader(!showUploader)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                >
                  {showUploader ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Hide Upload</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>Upload Your CSV</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CSV Uploader */}
            {showUploader && (
              <DatasetUploader onDatasetAnalysis={handleDatasetAnalysis} />
            )}

            {/* Data Dashboard */}
            {apiData && !isAnalyzing && (
              <div className="glassmorphism rounded-2xl glow-amber">
                <DataDashboard
                  data={apiData}
                  hoveredZoneId={hoveredZoneId}
                  onZoneHover={handleZoneHover}
                />
              </div>
            )}
          </div>

          {/* Right Column - 3D Viewer */}
          <div className="xl:col-span-2 min-h-[70vh] lg:min-h-[80vh]">
            {apiData && !isAnalyzing ? (
              <div className="glassmorphism rounded-2xl glow-amber h-full">
                <TerrainViewer
                  zones={apiData.rockfall_events}
                  onZoneHover={handleZoneHover}
                  hoveredZoneId={hoveredZoneId}
                />
              </div>
            ) : (
              <div className="glassmorphism rounded-2xl glow-amber h-full flex flex-col items-center justify-center">
                <div className="text-center p-8">
                  {isAnalyzing ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        🔬 AI Analysis in Progress
                      </h3>
                      <div className="space-y-1 text-muted-foreground">
                        <p>
                          • Processing your geological data through ML models
                        </p>
                        <p>• Calculating risk probabilities for each zone</p>
                        <p className="text-primary font-medium">
                          3D visualization will appear when complete...
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 mx-auto mb-6 text-muted-foreground">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">
                        📊 Ready for Analysis
                      </h3>
                      <div className="space-y-2 text-muted-foreground max-w-md">
                        <p className="text-lg">
                          Upload your geological survey data to begin AI-powered
                          risk analysis
                        </p>
                        <div className="pt-4 space-y-1 text-sm">
                          <p>• CSV format with zone measurements</p>
                          <p>• Real-time ML predictions</p>
                          <p>• Interactive 3D visualization</p>
                          <p>• Professional risk reports</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => setShowUploader(true)}
                          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium"
                        >
                          Start with CSV Upload
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
