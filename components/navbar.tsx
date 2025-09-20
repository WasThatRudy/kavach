"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 glassmorphism"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.05 }}>
            <h1
              className="text-2xl font-bold text-gradient-amber tracking-wider"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              KAVACH
            </h1>
          </motion.div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {["The KAVACH Array", "Command Deck", "Activate"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <Button
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-secondary hover:to-primary pulse-glow font-semibold"
              size="sm"
            >
              Launch App
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glassmorphism mt-2 rounded-lg p-4"
          >
            <div className="flex flex-col space-y-4">
              {["The KAVACH Array", "Command Deck", "Activate"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-secondary hover:to-primary pulse-glow font-semibold w-full"
                size="sm"
              >
                Launch App
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
