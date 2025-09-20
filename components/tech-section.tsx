"use client"

import { motion } from "framer-motion"
import { Brain, Cable as Cube, Bell } from "lucide-react"

const techFeatures = [
  {
    icon: Brain,
    title: "AI Prediction Engine",
    description:
      "Our model analyzes seismic, radar, and visual data to predict rockfall events with unprecedented accuracy.",
  },
  {
    icon: Cube,
    title: "3D Risk Visualization",
    description: "KAVACH renders risk zones in an interactive 3D map, providing intuitive spatial understanding.",
  },
  {
    icon: Bell,
    title: "Instantaneous Alerts",
    description:
      "Automated SMS and email alerts are sent before potential failures, enabling proactive safety measures.",
  },
]

export function TechSection() {
  return (
    <section id="the-tech" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-gradient-cyan mb-6">The Tech</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            How KAVACH revolutionizes mining safety through cutting-edge AI and real-time monitoring
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {techFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 50 },
                show: { opacity: 1, y: 0 },
              }}
              className="glassmorphism rounded-xl p-8 hover:glow-cyan transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-white">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
