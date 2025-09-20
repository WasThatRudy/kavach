"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"

const displacementData = [
  { time: "00:00", displacement: 2.1 },
  { time: "04:00", displacement: 2.3 },
  { time: "08:00", displacement: 2.8 },
  { time: "12:00", displacement: 3.2 },
  { time: "16:00", displacement: 4.1 },
  { time: "20:00", displacement: 5.8 },
  { time: "24:00", displacement: 7.2 },
]

const riskData = [{ name: "Risk", value: 85, fill: "#FFA500" }]

const alerts = [
  { time: "14:32", message: "High displacement detected in Sector 7", level: "HIGH" },
  { time: "14:28", message: "Seismic activity increased in Zone B", level: "MEDIUM" },
  { time: "14:15", message: "Weather conditions affecting stability", level: "LOW" },
]

export function DemoSection() {
  return (
    <section id="live-demo" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-gradient-orange mb-6">See The Data Stream</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time monitoring dashboard showing live geological data and predictive analytics
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="glassmorphism rounded-2xl p-8 glow-orange"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Displacement Chart */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-heading font-semibold text-white mb-6">Pit Wall Displacement (mm)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displacementData}>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#A0A0A0", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#A0A0A0", fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="displacement"
                      stroke="#00FFFF"
                      strokeWidth={3}
                      dot={{ fill: "#00FFFF", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#00FFFF", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Gauge */}
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-xl font-heading font-semibold text-white mb-4">Current Risk Level</h3>
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={riskData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#FFA500" />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary">85%</div>
                    <div className="text-sm text-secondary font-semibold">HIGH</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Alerts */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-xl font-heading font-semibold text-white mb-4">KAVACH: Live Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.level === "HIGH"
                          ? "bg-secondary"
                          : alert.level === "MEDIUM"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <span className="text-white">{alert.message}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{alert.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
