'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Car, Star, Users, Zap } from 'lucide-react'

const teamMembers = [
  { name: 'Andrei Cruceru', role: 'CEO & Founder', image: '/placeholder.svg?height=100&width=100' },
]

const timeline = [
  { year: '2024', event: 'Cartopia founded' },
 
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-blue-600 mb-4">About Cartopia</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering car buyers with comprehensive comparisons and unbiased information to make informed decisions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {[
            { icon: Car, title: 'Extensive Database', description: 'Detailed information on thousands of car models' },
            { icon: Star, title: 'Unbiased Reviews', description: 'Honest user reviews and expert ratings' },
            { icon: Users, title: 'Community Driven', description: 'Powered by a passionate community of car enthusiasts' },
            { icon: Zap, title: 'Real-time Updates', description: 'Up-to-date information on prices and specifications' },
          ].map((value, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <value.icon className="w-12 h-12 mx-auto text-blue-500" />
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex mb-8 last:mb-0">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  {index !== timeline.length - 1 && <div className="w-0.5 h-full bg-blue-300"></div>}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.year}</h3>
                  <p className="text-gray-600">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}