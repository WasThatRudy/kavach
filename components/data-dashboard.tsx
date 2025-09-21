"use client";

import { Download, FileSpreadsheet, FileText, Share2 } from "lucide-react";
import type { ApiData } from "@/types";

interface DataDashboardProps {
  data: ApiData;
  hoveredZoneId?: string | null;
  onZoneHover?: (zoneId: string | null) => void;
}

export default function DataDashboard({
  data,
  hoveredZoneId,
  onZoneHover,
}: DataDashboardProps) {
  // Group zones by risk level
  const zonesByRisk = data.rockfall_events.reduce((acc, zone) => {
    const risk = zone.riskLevel || (zone.rockfall_occurred ? "High" : "Low");
    if (!acc[risk]) acc[risk] = [];
    acc[risk].push(zone);
    return acc;
  }, {} as Record<string, typeof data.rockfall_events>);

  const riskColors = {
    Critical: "#ff4444",
    High: "#ff8800",
    Medium: "#ffbf00",
    Low: "#ffd700",
    "Very Low": "#88ff88",
    Unknown: "#6B7280",
  };

  const exportToCSV = () => {
    const headers = [
      "Zone ID",
      "Risk Level",
      "Probability (%)",
      "Slope (°)",
      "Aspect (°)",
      "Curvature",
      "Cohesion (kPa)",
      "Friction Angle (°)",
      "Rock Density (kg/m³)",
      "Rainfall (mm/hr)",
      "Temperature (°C)",
      "Seismic PGV",
      "Position X",
      "Position Y",
      "Position Z",
      "Rockfall Occurred",
      "Timestamp",
      "Color Code",
    ];

    const csvData = data.rockfall_events.map((event) => [
      event.zone_id,
      event.riskLevel || "Unknown",
      event.probability ? (event.probability * 100).toFixed(1) : "N/A",
      event.avg_slope_deg.toFixed(1),
      event.avg_aspect_deg?.toFixed(1) || "N/A",
      event.avg_curvature?.toFixed(3) || "N/A",
      event.cohesion_kpa.toFixed(1),
      event.friction_angle_deg?.toFixed(1) || "N/A",
      event.rock_density_kg_m3?.toFixed(1) || "N/A",
      event.rainfall_mm_hr?.toFixed(1) || "N/A",
      event.temperature_celsius?.toFixed(1) || "N/A",
      event.seismic_vibration_pgv?.toFixed(3) || "N/A",
      event.position[0].toFixed(1),
      event.position[1].toFixed(1),
      event.position[2].toFixed(1),
      event.rockfall_occurred || 0,
      event.timestamp || "N/A",
      event.color || "#6B7280",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kavach_analysis_results_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const exportData = {
      analysis_metadata: {
        export_date: new Date().toISOString(),
        total_zones: data.rockfall_events.length,
        dataset_name: data.dataset_specs.file_name,
        description: data.dataset_specs.description,
      },
      risk_summary: Object.entries(zonesByRisk).map(([risk, zones]) => ({
        risk_level: risk,
        zone_count: zones.length,
        percentage: (
          (zones.length / data.rockfall_events.length) *
          100
        ).toFixed(1),
      })),
      zone_analysis: data.rockfall_events.map((event) => ({
        zone_id: event.zone_id,
        risk_assessment: {
          level: event.riskLevel,
          probability: event.probability,
          color_code: event.color,
        },
        geological_properties: {
          slope_degrees: event.avg_slope_deg,
          aspect_degrees: event.avg_aspect_deg,
          curvature: event.avg_curvature,
          cohesion_kpa: event.cohesion_kpa,
          friction_angle_degrees: event.friction_angle_deg,
          rock_density_kg_m3: event.rock_density_kg_m3,
        },
        environmental_conditions: {
          rainfall_mm_hr: event.rainfall_mm_hr,
          temperature_celsius: event.temperature_celsius,
          seismic_vibration_pgv: event.seismic_vibration_pgv,
          timestamp: event.timestamp,
        },
        spatial_coordinates: {
          x: event.position[0],
          y: event.position[1],
          z: event.position[2],
        },
        rockfall_occurred: Boolean(event.rockfall_occurred),
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kavach_analysis_results_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const totalZones = data.rockfall_events.length;
    const highRiskZones =
      (zonesByRisk["Critical"]?.length || 0) +
      (zonesByRisk["High"]?.length || 0);
    const mediumRiskZones = zonesByRisk["Medium"]?.length || 0;
    const lowRiskZones =
      (zonesByRisk["Low"]?.length || 0) +
      (zonesByRisk["Very Low"]?.length || 0);

    const reportContent = `
KAVACH GEOLOGICAL RISK ANALYSIS REPORT
=====================================

Analysis Date: ${new Date().toLocaleDateString()}
Dataset: ${data.dataset_specs.file_name}
Description: ${data.dataset_specs.description}

EXECUTIVE SUMMARY
-----------------
Total Zones Analyzed: ${totalZones}
High Risk Zones: ${highRiskZones} (${(
      (highRiskZones / totalZones) *
      100
    ).toFixed(1)}%)
Medium Risk Zones: ${mediumRiskZones} (${(
      (mediumRiskZones / totalZones) *
      100
    ).toFixed(1)}%)
Low Risk Zones: ${lowRiskZones} (${((lowRiskZones / totalZones) * 100).toFixed(
      1
    )}%)

RISK DISTRIBUTION
-----------------
${Object.entries(zonesByRisk)
  .map(
    ([risk, zones]) =>
      `${risk}: ${zones.length} zones (${(
        (zones.length / totalZones) *
        100
      ).toFixed(1)}%)`
  )
  .join("\n")}

CRITICAL ZONES REQUIRING IMMEDIATE ATTENTION
-------------------------------------------
${(zonesByRisk["Critical"] || [])
  .map(
    (zone) =>
      `• ${zone.zone_id}: ${(zone.probability! * 100).toFixed(
        1
      )}% probability, Slope: ${zone.avg_slope_deg.toFixed(1)}°`
  )
  .join("\n")}

HIGH RISK ZONES
---------------
${(zonesByRisk["High"] || [])
  .map(
    (zone) =>
      `• ${zone.zone_id}: ${(zone.probability! * 100).toFixed(
        1
      )}% probability, Slope: ${zone.avg_slope_deg.toFixed(1)}°`
  )
  .join("\n")}

RECOMMENDATIONS
---------------
1. Implement immediate safety measures in Critical and High risk zones
2. Increase monitoring frequency for zones with probability > 60%
3. Consider slope stabilization for zones with steep angles (>40°)
4. Regular reassessment recommended every 30 days
5. Deploy sensor networks in highest risk areas

TECHNICAL DETAILS
-----------------
ML Model Confidence: Based on geological and environmental parameters
Analysis Method: AI-powered prediction using slope, cohesion, environmental factors
Coordinate System: 3D spatial mapping for precise zone location
Data Quality: Validated against required geological parameters

Report Generated by KAVACH AI Risk Analysis System
Contact: [Your Contact Information]
`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kavach_risk_report_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gradient-amber">
          🎯 AI Analysis Results
        </h2>

        {/* Export Options */}
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors text-green-600 text-sm"
            title="Export as CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={exportToJSON}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-600 text-sm"
            title="Export as JSON"
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors text-amber-600 text-sm"
            title="Generate Report"
          >
            <FileText className="w-4 h-4" />
            Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="font-bold text-card-foreground mb-3 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Risk Distribution Analysis
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          AI-powered individual predictions for {data.rockfall_events.length}{" "}
          monitoring zones
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(zonesByRisk).map(([risk, zones]) => (
            <div key={risk} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      riskColors[risk as keyof typeof riskColors] || "#6B7280",
                  }}
                ></div>
                <span className="text-xs font-medium text-muted-foreground">
                  {risk}
                </span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {zones.length}
              </div>
              <div className="text-xs text-muted-foreground">
                {((zones.length / data.rockfall_events.length) * 100).toFixed(
                  1
                )}
                %
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div>
        <h3 className="font-bold text-card-foreground mb-4">
          Zone Analysis Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">
                  Zone ID
                </th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">
                  Risk Level
                </th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">
                  Probability
                </th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">
                  Slope (°)
                </th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">
                  Cohesion (kPa)
                </th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">
                  Position
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rockfall_events.map((event) => (
                <tr
                  key={event.zone_id}
                  className={`cursor-pointer transition-colors ${
                    hoveredZoneId === event.zone_id
                      ? "bg-accent border-primary glow-amber"
                      : "hover:bg-muted/50"
                  }`}
                  onMouseEnter={() => onZoneHover?.(event.zone_id)}
                  onMouseLeave={() => onZoneHover?.(null)}
                >
                  <td className="border border-border px-3 py-2 font-medium text-card-foreground">
                    {event.zone_id}
                  </td>
                  <td className="border border-border px-3 py-2">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: event.color || "#6B7280" }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                      {event.riskLevel ||
                        (event.rockfall_occurred ? "High" : "Low")}
                    </span>
                  </td>
                  <td className="border border-border px-3 py-2 text-card-foreground">
                    {event.probability ? (
                      <span className="font-mono text-primary">
                        {(event.probability * 100).toFixed(1)}%
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border border-border px-3 py-2 text-card-foreground">
                    {event.avg_slope_deg.toFixed(1)}
                  </td>
                  <td className="border border-border px-3 py-2 text-card-foreground">
                    {event.cohesion_kpa.toFixed(1)}
                  </td>
                  <td className="border border-border px-3 py-2 text-xs text-muted-foreground">
                    ({event.position[0].toFixed(0)},{" "}
                    {event.position[1].toFixed(0)},{" "}
                    {event.position[2].toFixed(0)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
