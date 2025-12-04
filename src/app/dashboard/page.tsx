'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Users, Shield, Clock, Star, Sun, Moon, CheckCircle, XCircle, Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Load notifications for current user
  useEffect(() => {
    if (user && user.role === 'listener') {
      const storedNotifications = JSON.parse(localStorage.getItem('hearme_listener_notifications') || '[]')
      const userNotifications = storedNotifications.filter((n: any) => n.userId === user.id)
      setNotifications(userNotifications)
    }
  }, [user])

  const dismissNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) return null

  const isSeeker = user.role === 'seeker'
  const isListener = user.role === 'listener'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                HearMe
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user.displayName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role} {user.isAnonymous && '(Anonymous)'}
                </p>
                {user.isAnonymous && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✓ Device secured
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Notifications */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border mb-3 ${
                  notification.type === 'approved'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {notification.type === 'approved' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-medium ${
                        notification.type === 'approved'
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        Application {notification.type === 'approved' ? 'Approved' : 'Rejected'}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        notification.type === 'approved'
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(index)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Welcome back, {user.displayName}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isSeeker 
              ? "Ready to connect with a caring listener?" 
              : isListener && !user.isVerified
              ? "Your credentials are being verified. You'll be able to accept sessions once approved."
              : "Ready to help someone who needs support?"
            }
          </p>
        </motion.div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hearme-card p-6"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Safe & Secure</h3>
                <p className="text-sm text-gray-500">Your privacy is protected</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hearme-card p-6"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">24/7 Available</h3>
                <p className="text-sm text-gray-500">Support when you need it</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hearme-card p-6"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Verified Listeners</h3>
                <p className="text-sm text-gray-500">Trained professionals</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="hearme-card p-8 text-center"
        >
          {isSeeker ? (
            <>
              <MessageCircle className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Ready to Share?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Connect with a verified listener who will provide a safe, non-judgmental space 
                for you to express your thoughts and feelings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="hearme-gradient text-white">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start a Session
                </Button>
                <Button size="lg" variant="outline">
                  Browse Listeners
                </Button>
              </div>
            </>
          ) : isListener && !user.isVerified ? (
            <>
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Verification in Progress
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Thank you for applying to be a listener! Our team is reviewing your credentials. 
                You'll receive an email notification once your account is verified.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>What's next?</strong> Verification typically takes 24-48 hours. 
                  We'll review your credentials and background to ensure the safety of our community.
                </p>
              </div>
            </>
          ) : (
            <>
              <Users className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Ready to Listen?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Help someone who needs support today. Your empathy and professional training 
                can make a real difference in someone's life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="hearme-gradient text-white">
                  <Users className="mr-2 h-5 w-5" />
                  Go Online
                </Button>
                <Button size="lg" variant="outline">
                  View Pending Sessions
                </Button>
              </div>
            </>
          )}
        </motion.div>

        {/* Quick Stats */}
        {isListener && user.isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mt-8"
          >
            <div className="hearme-card p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
              <div className="text-sm text-gray-500">Total Sessions</div>
            </div>
            <div className="hearme-card p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5.0</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div className="hearme-card p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0h</div>
              <div className="text-sm text-gray-500">Hours Listened</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}