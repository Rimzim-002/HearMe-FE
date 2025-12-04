'use client'

import { motion } from 'framer-motion'
import { Heart, Shield, Users, MessageCircle, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header showAuthButtons />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 bg-clip-text text-transparent">
              Safe Space
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200">
              Anonymous Support
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect with trained listeners in a judgment-free environment. 
            Share your thoughts anonymously and find the support you need.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=seeker">
              <Button size="lg" className="hearme-gradient text-white">
                <MessageCircle className="mr-2 h-5 w-5" />
                I Need Someone to Listen
              </Button>
            </Link>
            <Link href="/auth/register?role=listener">
              <Button size="lg" variant="outline">
                <Users className="mr-2 h-5 w-5" />
                I Want to Help Others
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Why Choose HearMe?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Built with safety, privacy, and empathy at its core
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Complete Anonymity",
              description: "Stay fully anonymous while sharing your thoughts. No personal information required."
            },
            {
              icon: CheckCircle,
              title: "Verified Listeners",
              description: "All listeners are verified psychology students or professionals with proper credentials."
            },
            {
              icon: Star,
              title: "Safe Environment",
              description: "24/7 moderation, reporting system, and community guidelines ensure your safety."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="hearme-card p-8 text-center hover:shadow-xl transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="hearme-card p-12 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands who have found support and healing through meaningful connections.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="hearme-gradient text-white">
              Join HearMe Today
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-primary-600" />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">HearMe</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              © 2024 HearMe. Building bridges through empathy and understanding.
            </p>
            
            {/* Safety Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/safety" className="text-primary-600 hover:text-primary-700 font-medium">
                Safety Guidelines
              </Link>
              <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms & Conditions
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-red-600 font-medium">Crisis Hotline: 988</span>
              <span className="text-gray-400">•</span>
              <span className="text-red-600 font-medium">Emergency: 911</span>
            </div>
          </div>
          
          {/* Safety Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
              <strong>Important:</strong> HearMe provides peer support, not professional therapy. 
              If you're in crisis, please contact emergency services immediately.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}