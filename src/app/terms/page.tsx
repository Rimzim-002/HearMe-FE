'use client'

import { motion } from 'framer-motion'
import { FileText, ArrowLeft, Shield, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
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
            <FileText className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Please read these terms carefully before using HearMe
            </p>
          </div>

          <div className="space-y-8">
            {/* Service Description */}
            <div className="hearme-card p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                1. Service Description
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  HearMe is a peer support platform that connects individuals seeking emotional support (Seekers) 
                  with trained volunteers (Listeners) in a safe, anonymous environment.
                </p>
                <p>
                  <strong>HearMe is NOT:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A professional therapy or counseling service</li>
                  <li>A medical or mental health treatment provider</li>
                  <li>A crisis intervention or emergency service</li>
                  <li>A dating or social networking platform</li>
                </ul>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="hearme-card p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                2. User Responsibilities
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-blue-500" />
                    Seekers Must:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Use the platform respectfully and safely</li>
                    <li>• Never share personal identifying information</li>
                    <li>• Report inappropriate behavior immediately</li>
                    <li>• Understand this is peer support, not therapy</li>
                    <li>• Seek professional help for serious mental health issues</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-green-500" />
                    Listeners Must:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Maintain complete confidentiality</li>
                    <li>• Provide empathetic, non-judgmental support</li>
                    <li>• Never share session content outside the platform</li>
                    <li>• Report concerning behavior to moderators</li>
                    <li>• Respect personal boundaries and limitations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Prohibited Activities */}
            <div className="hearme-card p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <AlertTriangle className="mr-3 h-6 w-6 text-red-500" />
                3. Prohibited Activities
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm text-red-700 dark:text-red-300">
                  <div>
                    <p className="font-semibold mb-2">Strictly Forbidden:</p>
                    <ul className="space-y-1">
                      <li>• Harassment, threats, or abuse</li>
                      <li>• Sharing personal contact information</li>
                      <li>• Romantic or sexual advances</li>
                      <li>• Discriminatory language or behavior</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Zero Tolerance:</p>
                    <ul className="space-y-1">
                      <li>• Promoting self-harm or violence</li>
                      <li>• Illegal activities or content</li>
                      <li>• Impersonation or false credentials</li>
                      <li>• Circumventing safety measures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Data */}
            <div className="hearme-card p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                4. Privacy & Data Protection
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Session Logging:</strong> All conversations are securely logged and encrypted 
                  for moderation purposes only. Logs are reviewed only when reports are filed.
                </p>
                <p>
                  <strong>Anonymity:</strong> We protect user anonymity through random usernames and IDs. 
                  Real names are never displayed publicly.
                </p>
                <p>
                  <strong>Data Retention:</strong> Session data is retained for 90 days for safety purposes, 
                  then permanently deleted unless required for ongoing investigations.
                </p>
              </div>
            </div>

            {/* Liability Disclaimer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">
                Important Legal Disclaimer
              </h2>
              <div className="space-y-3 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  <strong>No Professional Relationship:</strong> HearMe does not create a therapist-client, 
                  doctor-patient, or any professional relationship.
                </p>
                <p>
                  <strong>Emergency Situations:</strong> HearMe is not equipped to handle mental health emergencies. 
                  Users experiencing crisis should contact emergency services (911) or crisis hotlines (988) immediately.
                </p>
                <p>
                  <strong>Limitation of Liability:</strong> HearMe is not liable for user actions, content shared, 
                  or outcomes of peer support interactions. Users participate at their own risk.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="hearme-card p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Questions or Concerns?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have questions about these terms or need to report a safety concern, 
                please contact our support team.
              </p>
              <p className="text-sm text-gray-500">
                Last updated: December 2024
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}