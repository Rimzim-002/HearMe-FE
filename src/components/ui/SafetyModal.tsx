'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, X, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from './Button'

interface SafetyModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  userRole: 'seeker' | 'listener'
}

export function SafetyModal({ isOpen, onClose, onAccept, userRole }: SafetyModalProps) {
  const [accepted, setAccepted] = useState(false)

  const handleAccept = () => {
    setAccepted(true)
    onAccept()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-green-500" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Safety Guidelines
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Emergency Warning */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                        Emergency Disclaimer
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        If you're in crisis, please contact emergency services (911) or crisis hotline (988) immediately.
                        HearMe is not a substitute for professional therapy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role-specific guidelines */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {userRole === 'seeker' ? 'As a Seeker, you agree to:' : 'As a Listener, you agree to:'}
                  </h3>
                  
                  <div className="space-y-3">
                    {(userRole === 'seeker' ? [
                      'Share thoughts safely and respectfully',
                      'Never share personal identifying information',
                      'Report any harassment or inappropriate behavior',
                      'Respect listener boundaries and availability',
                      'Understand this is peer support, not professional therapy'
                    ] : [
                      'Listen actively and empathetically without judgment',
                      'Maintain complete confidentiality of all conversations',
                      'Never share seeker content outside the platform',
                      'Report any concerning or inappropriate behavior',
                      'Respect your own boundaries and limitations'
                    ]).map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community Rules */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                    Community Rules (Zero Tolerance)
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>• No harassment, threats, or discriminatory language</p>
                    <p>• No romantic advances or inappropriate content</p>
                    <p>• No sharing of personal contact information</p>
                    <p>• No promotion of illegal activities or self-harm</p>
                  </div>
                </div>

                {/* Acceptance */}
                <div className="border-t pt-6">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      I have read and agree to follow the HearMe safety guidelines and community rules. 
                      I understand that violations may result in account suspension or termination.
                    </span>
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAccept}
                    disabled={!accepted}
                    className="flex-1 hearme-gradient text-white"
                  >
                    I Agree & Continue
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}