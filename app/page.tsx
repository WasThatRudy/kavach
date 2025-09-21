"use client"

// import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { KavachArraySection } from "@/components/kavach-array-section"
import { CommandDeckSection } from "@/components/command-deck-section"
import { CTASection } from "@/components/cta-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* <Navbar /> */}
      <div className="scroll-snap-section">
        <HeroSection />
      </div>
      <div className="scroll-snap-section">
        <KavachArraySection />
      </div>
      <div className="scroll-snap-section">
        <CommandDeckSection />
      </div>
      <div className="scroll-snap-section">
        <CTASection />
      </div>
    </main>
  )
}
