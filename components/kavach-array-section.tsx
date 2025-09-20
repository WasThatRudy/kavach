"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const features = [
  {
    title: "Predictive AI Core",
    description:
      "Advanced machine learning algorithms analyze geological patterns to predict rockfall events before they occur.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
        <motion.path
          d="M20 50 Q50 20 80 50 Q50 80 20 50"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="15"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </svg>
    ),
  },
  {
    title: "Holographic Risk Mapping",
    description:
      "Real-time 3D visualization of geological stability with interactive risk heat maps and predictive overlays.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
        <motion.rect
          x="20"
          y="30"
          width="60"
          height="40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.path
          d="M30 40 L70 40 M30 50 L70 50 M30 60 L70 60"
          stroke="currentColor"
          strokeWidth="1"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
      </svg>
    ),
  },
  {
    title: "Pre-emptive Alert System",
    description:
      "Instant notifications and automated safety protocols activate when geological instability is detected.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
        <motion.polygon
          points="50,20 60,40 80,40 65,55 70,75 50,65 30,75 35,55 20,40 40,40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="25"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </svg>
    ),
  },
]

export function KavachArraySection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section id="the-kavach-array" className="min-h-screen flex items-center justify-center py-20">
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
            The KAVACH Array
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three interconnected systems working in perfect harmony to create an impenetrable shield of predictive
            safety.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`glassmorphism p-8 rounded-lg hover-converge transition-all duration-300 relative ${
                hoveredCard === index ? "glow-amber" : ""
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-primary mb-6 flex justify-center relative z-10">{feature.icon}</div>
              <h3
                className={`text-xl font-semibold mb-4 relative z-10 ${
                  hoveredCard === index ? "text-amber-300" : "text-gradient-amber"
                }`}
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {feature.title}
              </h3>
              <p className={`leading-relaxed relative z-10 ${
                hoveredCard === index ? "text-white" : "text-muted-foreground"
              }`}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
