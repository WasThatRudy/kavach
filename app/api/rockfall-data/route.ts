import { NextResponse } from 'next/server';
import type { ApiData } from '@/types';

// Call ML prediction API and return detailed prediction info
async function getPredictionFromML(features: number[]): Promise<{prediction: number, probability: number, riskLevel: string, color: string}> {
  const apiUrl = process.env.ML_API_URL;
  console.log(`🤖 Calling ML API: ${apiUrl}/predict with features:`, features);
  
  const response = await fetch(`${apiUrl}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ features }),
  });

  if (!response.ok) {
    throw new Error(`ML API Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  console.log(`✅ ML API Response:`, result);
  
  let probability = result.prediction[1]; // This should be 0.0 to 1.0
  console.log(`📊 Raw probability from ML API: ${probability} (${typeof probability})`);
  
  // Ensure probability is a number and in correct range (0.0 to 1.0)
  if (typeof probability !== 'number' || isNaN(probability)) {
    console.warn(`⚠️ Invalid probability type: ${typeof probability}, value: ${probability}`);
    probability = 0.5; // Default fallback
  } else if (probability > 1.0) {
    console.warn(`⚠️ Probability > 1.0 detected: ${probability}, normalizing to 1.0`);
    probability = 1.0;
  } else if (probability < 0.0) {
    console.warn(`⚠️ Probability < 0.0 detected: ${probability}, normalizing to 0.0`);
    probability = 0.0;
  }
  
  console.log(`📊 Final probability: ${probability} (${(probability * 100).toFixed(1)}%)`);
  const prediction = probability > 0.5 ? 1 : 0;
  
  // Multi-level risk assessment using theme colors
  let riskLevel: string;
  let color: string;
  
  if (probability >= 0.8) {
    riskLevel = 'Critical';
    color = '#ff4444'; // Bright red for critical
  } else if (probability >= 0.6) {
    riskLevel = 'High';
    color = '#ff8800'; // Orange for high
  } else if (probability >= 0.4) {
    riskLevel = 'Medium';
    color = '#ffbf00'; // Primary amber from theme
  } else if (probability >= 0.2) {
    riskLevel = 'Low';
    color = '#ffd700'; // Secondary gold from theme
  } else {
    riskLevel = 'Very Low';
    color = '#88ff88'; // Light green for very low
  }
  
  console.log(`🎯 Zone Risk: ${riskLevel} (${(probability * 100).toFixed(1)}%)`);
  return { prediction, probability, riskLevel, color };
}


// Parse CSV data and generate predictions based on actual input
async function analyzeRockfallData(csvData: string): Promise<ApiData> {
  if (!csvData || csvData.trim() === '') {
    throw new Error('No CSV data provided. Please upload a valid CSV file.');
  }

    // Parse CSV data
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Validate required columns
    const requiredColumns = ['zone_id', 'avg_slope_deg', 'cohesion_kpa'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Process each row and generate predictions
    const rockfallEvents: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim());
      if (row.length !== headers.length) continue;
      
      const rowData: any = {};
      headers.forEach((header, index) => {
        const value = row[index];
        // Convert numeric fields
        if (['avg_slope_deg', 'avg_aspect_deg', 'avg_curvature', 'cohesion_kpa', 
             'friction_angle_deg', 'rock_density_kg_m3', 'rainfall_mm_hr', 
             'temperature_celsius', 'seismic_vibration_pgv'].includes(header)) {
          rowData[header] = parseFloat(value) || 0;
        } else {
          rowData[header] = value;
        }
      });

      // Calculate position based on zone index (distribute around mine)
      const zoneIndex = i - 1;
      const angle = (zoneIndex / (lines.length - 1)) * 2 * Math.PI;
      const ringNumber = Math.floor(zoneIndex / 10);
      const radius = 25 + ringNumber * 12;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Calculate terrain elevation using the same logic as generateMineZones
      const terrainX = x + 60;
      const terrainZ = z + 60;
      const centerX = 60, centerY = 60;
      const maxRadius = Math.min(centerX, centerY) * 0.8;
      const dx = terrainX - centerX;
      const dy = terrainZ - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDistance = Math.min(distance / maxRadius, 1);
      
      let terrainElevation;
      if (distance < maxRadius) {
        const depth = normalizedDistance * normalizedDistance * normalizedDistance * 500;
        const terraceLevel = Math.floor(normalizedDistance * 10);
        const terraceHeight = terraceLevel * 20;
        terrainElevation = Math.max(-300, 150 - depth + terraceHeight);
      } else {
        const rimHeight = 150 + (distance - maxRadius) * 2;
        terrainElevation = rimHeight + Math.sin(terrainX * 0.1) * Math.cos(terrainZ * 0.1) * 5;
      }

      // Prepare features for ML prediction
      const features = [
        rowData.avg_slope_deg || 45,
        rowData.avg_aspect_deg || 180,
        rowData.avg_curvature || 0,
        rowData.cohesion_kpa || 15,
        rowData.friction_angle_deg || 30,
        rowData.rock_density_kg_m3 || 2500,
        rowData.rainfall_mm_hr || 0,
        rowData.temperature_celsius || 15,
        rowData.seismic_vibration_pgv || 0.01
      ];

        // Get ML prediction
        const predictionResult = await getPredictionFromML(features);
        const rockfall_occurred = predictionResult.prediction;

      rockfallEvents.push({
        zone_id: rowData.zone_id || `Zone_${zoneIndex}`,
        avg_slope_deg: parseFloat((rowData.avg_slope_deg || 45).toFixed(2)),
        avg_aspect_deg: parseFloat((rowData.avg_aspect_deg || 180).toFixed(2)),
        avg_curvature: parseFloat((rowData.avg_curvature || 0).toFixed(3)),
        cohesion_kpa: parseFloat((rowData.cohesion_kpa || 15).toFixed(2)),
        friction_angle_deg: parseFloat((rowData.friction_angle_deg || 30).toFixed(2)),
        rock_density_kg_m3: parseFloat((rowData.rock_density_kg_m3 || 2500).toFixed(2)),
        timestamp: rowData.timestamp || "2024-03-15",
        rainfall_mm_hr: parseFloat((rowData.rainfall_mm_hr || 0).toFixed(2)),
        temperature_celsius: parseFloat((rowData.temperature_celsius || 15).toFixed(2)),
        seismic_vibration_pgv: parseFloat((rowData.seismic_vibration_pgv || 0.01).toFixed(3)),
        rockfall_occurred: rockfall_occurred as 0 | 1,
        probability: predictionResult.probability,
        riskLevel: predictionResult.riskLevel,
        color: predictionResult.color,
        position: [parseFloat(x.toFixed(1)), parseFloat(terrainElevation.toFixed(1)), parseFloat(z.toFixed(1))] as [number, number, number]
      });
    }

    return createApiResponse(rockfallEvents, "uploaded_dataset.csv", `Analysis of uploaded dataset with ${rockfallEvents.length} zones processed through ML prediction model.`);
}

// Helper function to create consistent API response
function createApiResponse(rockfallEvents: any[], fileName: string, description: string): ApiData {
  return {
    dataset_specs: {
      file_name: fileName,
      description: description,
      columns: [
        { name: "zone_id", data_type: "string", description: "Categorical identifier for a specific geological zone on the mine wall.", example: "Zone_0" },
        { name: "avg_slope_deg", data_type: "float", description: "The average steepness of the terrain in degrees. Higher values indicate steeper terrain.", example: 45.5 },
        { name: "avg_aspect_deg", data_type: "float", description: "The average direction the slope faces in degrees (e.g., 0 for North, 180 for South).", example: 117.47 },
        { name: "avg_curvature", data_type: "float", description: "The average curvature of the slope, indicating if it's concave or convex. Influences water flow and stress.", example: 0.014 },
        { name: "cohesion_kpa", data_type: "float", description: "A geotechnical property representing how well rock/soil particles stick together, measured in kilopascals (kPa).", example: 15.06 },
        { name: "friction_angle_deg", data_type: "float", description: "A geotechnical property indicating the shear strength of the material, measured in degrees.", example: 23.08 },
        { name: "rock_density_kg_m3", data_type: "float", description: "The density of the rock/soil material in kilograms per cubic meter (kg/m³).", example: 2493.03 },
        { name: "timestamp", data_type: "datetime", description: "The specific date of the data snapshot." },
        { name: "rainfall_mm_hr", data_type: "float", description: "The rate of rainfall in millimeters per hour (mm/hr), a key environmental trigger.", example: 0.0 },
        { name: "temperature_celsius", data_type: "float", description: "The ambient temperature in degrees Celsius. Freeze-thaw cycles can be a trigger.", example: 14.57 },
        { name: "seismic_vibration_pgv", data_type: "float", description: "Seismic vibration measured in Peak Ground Velocity (PGV), representing tremors or nearby blasts.", example: 0.01 },
        { name: "rockfall_occurred", data_type: "integer", description: "The target variable. A binary flag indicating if a rockfall occurred.", values: [0, 1] }
      ]
    },
    rockfall_events: rockfallEvents
  };
}

export async function GET() {
  return NextResponse.json(
    { error: 'CSV data required. Please use POST endpoint with file upload.' },
    { status: 400 }
  );
}

// New endpoint for single zone prediction
export async function PATCH(request: Request) {
  try {
    const { features, zoneId } = await request.json();
    
    if (!features || !Array.isArray(features) || features.length !== 9) {
      return NextResponse.json(
        { error: 'Invalid features array. Expected 9 numerical values.' },
        { status: 400 }
      );
    }
    
    console.log(`🎯 Processing individual zone: ${zoneId}`);
    const predictionResult = await getPredictionFromML(features);
    
    return NextResponse.json({
      zoneId,
      ...predictionResult,
      features
    });
    
  } catch (error) {
    console.error('Error processing zone prediction:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process zone prediction' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file || file.type !== 'text/csv') {
      return NextResponse.json(
        { error: 'Valid CSV file is required' },
        { status: 400 }
      );
    }
    
    const csvData = await file.text();
    console.log(`📄 Processing uploaded CSV: ${file.name} (${file.size} bytes)`);
    
    const analysisResult = await analyzeRockfallData(csvData);
    return NextResponse.json(analysisResult);
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process CSV data' },
      { status: 500 }
    );
  }
}