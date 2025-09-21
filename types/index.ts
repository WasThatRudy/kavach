// For the 3D model zone markers
export type ZonePosition = [x: number, y: number, z: number];

export interface ColumnSpec {
  name: string;
  data_type: string;
  description: string;
  example?: string | number;
  values?: number[];
}

export interface DatasetSpecs {
  file_name: string;
  description: string;
  columns: ColumnSpec[];
}

export interface RockfallEvent {
  zone_id: string;
  avg_slope_deg: number;
  avg_aspect_deg?: number;
  avg_curvature?: number;
  cohesion_kpa: number;
  friction_angle_deg?: number;
  rock_density_kg_m3?: number;
  timestamp?: string;
  rainfall_mm_hr?: number;
  temperature_celsius?: number;
  seismic_vibration_pgv?: number;
  rockfall_occurred: 0 | 1;
  position: ZonePosition; // 3D coordinates for marking on the model
  probability?: number; // ML prediction probability
  riskLevel?: string; // Risk level text
  color?: string; // Color code for visualization
}

export interface ApiData {
  dataset_specs: DatasetSpecs;
  rockfall_events: RockfallEvent[];
}