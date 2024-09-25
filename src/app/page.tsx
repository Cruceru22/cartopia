'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronRight, BarChart2, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export default function LandingPage() {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-blue-600 mb-4">Cartopia</h1>
          <p className="text-xl text-gray-600">Find your perfect ride with ease</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: searchFocused ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a car model..."
              className="w-full py-6 pl-12 pr-4 text-lg rounded-full shadow-lg"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            { icon: BarChart2, title: "Compare Models", description: "Side-by-side comparison of your favorite cars" },
            { icon: Zap, title: "Fast & Easy", description: "Get the information you need in seconds" },
            { icon: Shield, title: "Trusted Data", description: "Reliable specs from authoritative sources" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <feature.icon className="mx-auto mb-4 text-blue-500" size={40} />
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/compare">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full">
              Start Comparing <ChevronRight className="ml-2" size={24} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}