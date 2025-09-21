"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/router"

export function HeroSection() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })
    }

    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = window.innerHeight * 0.5
      const progress = Math.min((scrolled / maxScroll) * 100, 100)

      setScrollProgress(progress)

      if (progress > 20 && !isTransitioning) {
        setIsTransitioning(true)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isTransitioning])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Mine Model */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Mine Contour Lines */}
          {[...Array(8)].map((_, layer) => {
            const radius = 300 - layer * 30
            return (
              <circle
                key={layer}
                cx="400"
                cy="300"
                r={radius}
                stroke="#FFBF00"
                strokeWidth="2"
                fill="none"
                opacity={0.6 - layer * 0.05}
                className="animate-pulse"
                style={{
                  animationDelay: `${layer * 0.2}s`,
                  animationDuration: "3s",
                }}
              />
            )
          })}

          {/* Vertical Grid Lines */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * 360
            const x1 = 400 + Math.cos((angle * Math.PI) / 180) * 100
            const y1 = 300 + Math.sin((angle * Math.PI) / 180) * 100
            const x2 = 400 + Math.cos((angle * Math.PI) / 180) * 250
            const y2 = 300 + Math.sin((angle * Math.PI) / 180) * 250

            return (
              <line
                key={`vertical-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FFBF00"
                strokeWidth="1"
                opacity="0.4"
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "2s",
                }}
              />
            )
          })}

          {/* Risk Points */}
          {[...Array(15)].map((_, i) => {
            const angle = (i / 15) * 360
            const radius = 150 + Math.sin(i) * 50
            const x = 400 + Math.cos((angle * Math.PI) / 180) * radius
            const y = 300 + Math.sin((angle * Math.PI) / 180) * radius

            return (
              <circle
                key={`risk-${i}`}
                cx={x}
                cy={y}
                r="4"
                fill="#FFBF00"
                opacity="0.8"
                className="animate-ping"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: "2s",
                }}
              />
            )
          })}
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          }}
        >
          <h1 className="text-8xl md:text-9xl font-bold text-primary mb-6 tracking-wider">
            <span className="inline-block animate-pulse">K</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: "0.1s" }}>
              A
            </span>
            <span className="inline-block animate-pulse" style={{ animationDelay: "0.2s" }}>
              V
            </span>
            <span className="inline-block animate-pulse" style={{ animationDelay: "0.3s" }}>
              A
            </span>
            <span className="inline-block animate-pulse" style={{ animationDelay: "0.4s" }}>
              C
            </span>
            <span className="inline-block animate-pulse" style={{ animationDelay: "0.5s" }}>
              H
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
          }}
        >
          <p className="text-xl md:text-2xl text-primary/80 mb-8 max-w-2xl mx-auto">AI-Powered Rockfall Prediction</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          style={{
            transform: `translate(${mousePosition.x * 3}px, ${mousePosition.y * 3}px)`,
          }}
        >
          <button
          onClick={() => router.push("/analysis")}
          className="px-8 py-4 bg-primary/20 border border-primary text-primary rounded-lg hover:bg-primary/30 transition-all duration-300 text-lg font-medium backdrop-blur-sm">
            Launch App
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>

      {/* Transition Overlay */}
      <motion.div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ zIndex: isTransitioning ? 5 : -1 }}
      />
    </div>
  )
}
