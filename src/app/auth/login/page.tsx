'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Users, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { generateDisplayName } from '@/lib/utils'
import { Header } from '@/components/Header'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading } = useAuth()
  
  const [role, setRole] = useState<'seeker' | 'listener' | 'admin'>('seeker')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const roleParam = searchParams.get('role') as 'seeker' | 'listener' | 'admin'
    if (roleParam) setRole(roleParam)
  }, [searchParams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!isAnonymous) {
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      }
    } else {
      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await login({
        email: isAnonymous ? undefined : formData.email,
        displayName: isAnonymous ? formData.displayName : undefined,
        password: isAnonymous ? undefined : formData.password,
        role,
        isAnonymous
      })
      
      if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      // Error handled in context
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md sm:max-w-lg"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Welcome Back
            </h1>
          </div>

        <div className="hearme-card p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            I am a:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setRole('seeker')}
              className={`p-4 rounded-lg border-2 transition-all ${
                role === 'seeker'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-primary-600" />
              <div className="text-sm font-medium">Seeker</div>
            </button>
            
            <button
              onClick={() => setRole('listener')}
              className={`p-4 rounded-lg border-2 transition-all ${
                role === 'listener'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Users className="h-6 w-6 mx-auto mb-2 text-primary-600" />
              <div className="text-sm font-medium">Listener</div>
            </button>

          </div>
        </div>

        {role === 'seeker' && (
          <div className="hearme-card p-4 mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-primary-600"
              />
              <div className="text-sm">Stay completely anonymous</div>
            </label>
          </div>
        )}

        <div className="hearme-card p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {isAnonymous ? (
              <div>
                <Input
                  label="Display Name"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  error={errors.displayName}
                  placeholder="Enter display name"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, displayName: generateDisplayName() }))}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  Generate random name
                </button>
              </div>
            ) : (
              <>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="Enter your email"
                />
                
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Enter your password"
                />
              </>
            )}

            {/* Safety Reminder */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                By signing in, you agree to follow our{' '}
                <Link href="/safety" target="_blank" className="underline font-medium">
                  Safety Guidelines
                </Link>
                {' '}and{' '}
                <Link href="/terms" target="_blank" className="underline font-medium">
                  Terms of Service
                </Link>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full hearme-gradient text-white"
              size="lg"
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {role === 'seeker' && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={async () => {
                  const displayName = generateDisplayName()
                  try {
                    await login({
                      displayName,
                      role: 'seeker',
                      isAnonymous: true
                    })
                    router.push('/dashboard')
                  } catch (error) {
                    // Error handled in context
                  }
                }}
                loading={isLoading}
              >
                Quick Anonymous Access
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Start talking immediately with a random name
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              href={`/auth/register?role=${role}`}
              className="text-primary-600 hover:text-primary-700"
            >
              Don't have an account? Sign up
            </Link>
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}