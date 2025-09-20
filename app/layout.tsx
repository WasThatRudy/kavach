import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "KAVACH - The Future of Geotechnical Stability",
  description: "Digital Topography meets AI-powered rockfall prediction. Award-winning mining safety technology.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font-sans ${inter.variable} antialiased custom-cursor`}>
        <div className="cursor-dot" id="cursor-dot"></div>
        <div className="digital-topography-bg">
          <div className="contour-lines"></div>
        </div>
        <Suspense fallback={null}>{children}</Suspense>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Custom cursor movement
              document.addEventListener('mousemove', (e) => {
                const cursor = document.getElementById('cursor-dot');
                if (cursor) {
                  cursor.style.left = e.clientX + 'px';
                  cursor.style.top = e.clientY + 'px';
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
