"use client"

import { motion } from "framer-motion"
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts"

const mockData = [
  { time: "00:00", stability: 85, risk: 15 },
  { time: "04:00", stability: 82, risk: 18 },
  { time: "08:00", stability: 78, risk: 22 },
  { time: "12:00", stability: 75, risk: 25 },
  { time: "16:00", stability: 73, risk: 27 },
  { time: "20:00", stability: 70, risk: 30 },
  { time: "24:00", stability: 68, risk: 32 },
]

function AnimatedChart() {
  return (
    <div className="h-80 w-full chart-contour-bg rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData}>
          <defs>
            <linearGradient id="stabilityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffbf00" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ffd700" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#a0a0a0", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a0a0a0", fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="stability"
            stroke="#ffbf00"
            strokeWidth={3}
            fill="url(#stabilityGradient)"
            dot={{ fill: "#ffd700", strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CommandDeckSection() {
  return (
    <section id="command-deck" className="min-h-screen flex items-center justify-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-6xl font-bold text-gradient-amber mb-6"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            The Command Deck
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time geological stability monitoring with predictive analytics and holographic data visualization.
          </p>
        </motion.div>

        <motion.div
          className="glassmorphism p-8 rounded-lg max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3
                className="text-2xl font-semibold text-gradient-amber"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Geological Stability Index
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Status</span>
                  <span className="text-primary font-semibold">68% Stable</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className="text-secondary font-semibold">32% Elevated</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Prediction Accuracy</span>
                  <span className="text-primary font-semibold">94.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Next Alert</span>
                  <span className="text-secondary font-semibold">2.3 hours</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <AnimatedChart />
            </motion.div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[
              { label: "Active Sensors", value: "247", unit: "units" },
              { label: "Data Points", value: "1.2M", unit: "per hour" },
              { label: "Response Time", value: "0.3", unit: "seconds" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 rounded-lg bg-gradient-to-b from-primary/10 to-transparent border border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="text-2xl font-bold text-gradient-amber"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-primary">{stat.unit}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
