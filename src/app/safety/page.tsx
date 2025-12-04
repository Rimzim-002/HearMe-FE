'use client'

import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Users, MessageCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Safety & Community Guidelines
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your safety and well-being are our top priorities
            </p>
          </div>

          {/* Community Guidelines */}
          <div className="hearme-card p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
              <Users className="mr-3 h-6 w-6 text-primary-600" />
              Community Guidelines
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "No harassment or abuse - Threats, insults, or discriminatory language are prohibited",
                "Protect privacy - Never share personal contact details or identifying information", 
                "Respect boundaries - Don't pressure others to share more than they're comfortable with",
                "No inappropriate advances - HearMe is strictly a support platform, not dating",
                "No illegal activity - Content promoting violence, self-harm, or illegal behavior is prohibited",
                "Maintain confidentiality - Listeners must never share content outside the platform"
              ].map((guideline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {guideline}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">
                  Important Disclaimer
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  HearMe is not a therapy or medical service. If you're experiencing a mental health emergency, 
                  please contact emergency services immediately.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Crisis Hotlines:</strong></p>
                  <p>• National Suicide Prevention Lifeline: 988</p>
                  <p>• Crisis Text Line: Text HOME to 741741</p>
                  <p>• Emergency Services: 911</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}