"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section id="activate" className="min-h-screen flex items-center justify-center py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <Shield className="w-24 h-24 text-primary" />
                <motion.div
                  className="absolute inset-0 border-2 border-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 border border-primary/30 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </motion.div>

            <h2
              className="text-5xl md:text-7xl font-bold text-gradient-amber leading-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Activate The Shield
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Step into the future of predictive safety. Secure your operation with the most advanced geological
              monitoring system ever created.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-secondary hover:to-primary pulse-glow font-semibold text-lg px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <ArrowRight className="w-6 h-6 mr-3" />
              Request Access
            </Button>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-primary/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { label: "Enterprise Security", value: "ISO 27001 Certified" },
              { label: "Real-time Processing", value: "< 300ms Response" },
              { label: "Prediction Accuracy", value: "94.7% Validated" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-sm text-primary font-semibold tracking-wider uppercase">{feature.label}</div>
                <div
                  className="text-lg text-gradient-amber font-bold"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {feature.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
