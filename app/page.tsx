"use client"

import Link from "next/link"
import { ArrowRight, Shield, Brain, Eye, Mountain, Activity, Database, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">KAVACH</h1>
                <p className="text-xs text-blue-200">Risk Analysis System</p>
              </div>
            </div>
            <Link 
              href="/analysis" 
              className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 font-medium flex items-center gap-2"
            >
              Start Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  AI-Powered
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                    Rockfall Risk
                  </span>
                  Analysis
                </h1>
                <p className="text-xl text-gray-300 max-w-lg">
                  Advanced machine learning predictions for open-pit mine safety monitoring and geological risk assessment with real-time 3D visualization.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/analysis"
                  className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-8 py-4 rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 font-semibold text-center flex items-center justify-center gap-2"
                >
                  Launch Platform <ChevronRight className="w-5 h-5" />
                </Link>
                <button className="border border-white/30 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-200 font-semibold">
                  View Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.2%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm text-gray-400">Zone Analysis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="aspect-square bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <Mountain className="w-24 h-24 text-blue-300 opacity-50" />
                  <div className="absolute top-4 right-4 bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 text-white/80 text-sm">
                    <div>Live Mine Status</div>
                    <div className="text-green-400">● Active Monitoring</div>
                  </div>
                </div>
                <div className="mt-4 text-center text-white/80">
                  Real-time 3D Terrain Visualization
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Advanced Mining Safety Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive geological analysis powered by cutting-edge machine learning algorithms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <Brain className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">ML Predictions</h3>
              <p className="text-gray-300">
                Advanced neural networks analyze geological data to predict rockfall risks with high accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <Eye className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">3D Visualization</h3>
              <p className="text-gray-300">
                Interactive 3D terrain models with real-time zone highlighting and risk assessment visualization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <Activity className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Analysis</h3>
              <p className="text-gray-300">
                Continuous monitoring and instant risk assessment updates for proactive safety management.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <Database className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Data Integration</h3>
              <p className="text-gray-300">
                Seamless CSV upload and processing with support for various geological data formats.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <Shield className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Safety First</h3>
              <p className="text-gray-300">
                Comprehensive risk assessment prioritizing worker safety and operational efficiency.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <Mountain className="w-12 h-12 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Mine Modeling</h3>
              <p className="text-gray-300">
                Accurate open-pit mine terrain generation with precise zone mapping and surface analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Enhance Mine Safety?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start analyzing your geological data with our advanced AI-powered platform today.
          </p>
          <Link 
            href="/analysis"
            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-12 py-4 rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 font-semibold text-lg inline-flex items-center gap-3"
          >
            Begin Analysis <ArrowRight className="w-5 h-5" />
          </Link>
      </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-black/30 border-t border-white/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold">KAVACH</span>
            <span className="text-gray-400">© 2024</span>
      </div>
          <div className="text-gray-400 text-sm">
            Advanced Rockfall Risk Analysis System
      </div>
      </div>
      </footer>
    </main>
  )
}
