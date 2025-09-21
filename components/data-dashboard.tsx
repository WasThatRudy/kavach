'use client';

import type { ApiData } from '@/types';

interface DataDashboardProps {
  data: ApiData;
  hoveredZoneId?: string | null;
  onZoneHover?: (zoneId: string | null) => void;
}

export default function DataDashboard({ data, hoveredZoneId, onZoneHover }: DataDashboardProps) {
  // Group zones by risk level
  const zonesByRisk = data.rockfall_events.reduce((acc, zone) => {
    const risk = zone.riskLevel || (zone.rockfall_occurred ? 'High' : 'Low');
    if (!acc[risk]) acc[risk] = [];
    acc[risk].push(zone);
    return acc;
  }, {} as Record<string, typeof data.rockfall_events>);

  const riskColors = {
    'Critical': '#ff4444',
    'High': '#ff8800', 
    'Medium': '#ffbf00',
    'Low': '#ffd700',
    'Very Low': '#88ff88',
    'Unknown': '#6B7280'
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-gradient-amber">🎯 ML Analysis Results</h2>
      
      {/* Summary Stats */}
      <div className="bg-card p-4 rounded-lg mb-4 border border-border">
        <h3 className="font-bold text-card-foreground mb-3">Risk Distribution</h3>
        <p className="text-sm text-muted-foreground mb-3">Individual ML predictions for {data.rockfall_events.length} zones</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(zonesByRisk).map(([risk, zones]) => (
            <div key={risk} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: riskColors[risk as keyof typeof riskColors] || '#6B7280' }}
              ></div>
              <span>{risk}: {zones.length} zones</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Data Table */}
      <div>
        <h3 className="font-bold text-card-foreground mb-3">Zone Analysis Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">Zone ID</th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">Risk Level</th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">Probability</th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">Slope (°)</th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">Cohesion (kPa)</th>
                <th className="border border-border px-3 py-2 text-left text-muted-foreground">Position</th>
              </tr>
            </thead>
            <tbody>
              {data.rockfall_events.map((event) => (
                <tr 
                  key={event.zone_id} 
                  className={`cursor-pointer transition-colors ${
                    hoveredZoneId === event.zone_id 
                      ? 'bg-accent border-primary glow-amber' 
                      : 'hover:bg-muted/50'
                  }`}
                  onMouseEnter={() => onZoneHover?.(event.zone_id)}
                  onMouseLeave={() => onZoneHover?.(null)}
                >
                  <td className="border border-border px-3 py-2 font-medium text-card-foreground">{event.zone_id}</td>
                  <td className="border border-border px-3 py-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: event.color || '#6B7280' }}>
                      <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                      {event.riskLevel || (event.rockfall_occurred ? 'High' : 'Low')}
                    </span>
                  </td>
                  <td className="border border-border px-3 py-2 text-card-foreground">
                    {event.probability ? 
                      <span className="font-mono text-primary">{(event.probability * 100).toFixed(1)}%</span> 
                      : 'N/A'
                    }
                  </td>
                  <td className="border border-border px-3 py-2 text-card-foreground">{event.avg_slope_deg.toFixed(1)}</td>
                  <td className="border border-border px-3 py-2 text-card-foreground">{event.cohesion_kpa.toFixed(1)}</td>
                  <td className="border border-border px-3 py-2 text-xs text-muted-foreground">
                    ({event.position[0].toFixed(0)}, {event.position[1].toFixed(0)}, {event.position[2].toFixed(0)})
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