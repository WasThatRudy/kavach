"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const teamMembers = [
  { name: "Alex Chen", role: "AI/ML Engineer", avatar: "/professional-developer-portrait.png" },
  { name: "Sarah Kim", role: "Full-Stack Developer", avatar: "/professional-developer-portrait.png" },
  { name: "Mike Rodriguez", role: "Data Scientist", avatar: "/professional-developer-portrait.png" },
  { name: "Emily Zhang", role: "UI/UX Designer", avatar: "/professional-developer-portrait.png" },
]

const techStack = [
  { name: "Next.js", logo: "/nextjs-logo.png" },
  { name: "Tailwind CSS", logo: "/tailwind-css-logo.png" },
  { name: "Framer Motion", logo: "/framer-motion-logo.png" },
  { name: "Python", logo: "/python-logo.png" },
  { name: "PyTorch", logo: "/pytorch-logo.png" },
  { name: "Vercel", logo: "/vercel-logo.png" },
]

export function TeamSection() {
  return (
    <section id="the-team" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-gradient-cyan mb-6">
            Meet the Builders of KAVACH
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A passionate team of engineers and designers who built this in just 48 hours
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-4 gap-8 mb-20"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              className="text-center group"
            >
              <div className="relative mb-4">
                <Image
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="rounded-full mx-auto group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold text-white">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl font-heading font-bold text-gradient-orange mb-12">Built With</h3>
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  show: { opacity: 1, scale: 1 },
                }}
                className="glassmorphism rounded-lg p-4 hover:glow-cyan transition-all duration-300 group"
              >
                <Image
                  src={tech.logo || "/placeholder.svg"}
                  alt={tech.name}
                  width={60}
                  height={60}
                  className="mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
                />
                <p className="text-sm text-muted-foreground">{tech.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
