'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Users, ArrowLeft, Upload, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { generateDisplayName } from '@/lib/utils'
import { Header } from '@/components/Header'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register, isLoading } = useAuth()
  
  const [role, setRole] = useState<'seeker' | 'listener' | 'admin'>('seeker')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
    bio: '',
    credentials: ''
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedSafety, setAcceptedSafety] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    } else {
      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required'
      }
    }

    if (role === 'listener') {
      if (!formData.bio) {
        newErrors.bio = 'Bio is required for listeners'
      }
      if (!formData.credentials) {
        newErrors.credentials = 'Credentials are required for listeners'
      }
    }

    if (role !== 'admin') {
      if (!acceptedTerms) {
        newErrors.terms = 'You must accept the Terms & Conditions'
      }

      if (!acceptedSafety) {
        newErrors.safety = 'You must accept the Safety Guidelines'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      let fileData = undefined
      if (selectedFile) {
        fileData = await convertFileToBase64(selectedFile)
      }
      
      await register({
        email: isAnonymous ? undefined : formData.email,
        displayName: isAnonymous ? formData.displayName : undefined,
        password: isAnonymous ? undefined : formData.password,
        role,
        isAnonymous,
        bio: formData.bio,
        credentials: formData.credentials,
        credentialFile: selectedFile?.name,
        credentialFileData: fileData
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (errors.credentials) {
        setErrors(prev => ({ ...prev, credentials: '' }))
      }
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md sm:max-w-lg lg:max-w-xl"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Join HearMe
            </h1>
          </div>

        <div className="hearme-card p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            I want to be a:
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
              <div className="text-xs text-gray-500">Need support</div>
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
              <div className="text-xs text-gray-500">Provide support</div>
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
              <div>
                <div className="text-sm font-medium">Stay completely anonymous</div>
                <div className="text-xs text-gray-500">No email required</div>
              </div>
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
                  helperText={role === 'listener' ? 'Institutional email preferred' : undefined}
                />
                
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Create a password"
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                  />
                </div>
              </>
            )}

            {role === 'listener' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your background and experience..."
                    className="hearme-input min-h-[100px] resize-none"
                    maxLength={500}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{formData.bio.length}/500</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Credentials
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    selectedFile 
                      ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    <Upload className={`h-8 w-8 mx-auto mb-2 ${
                      selectedFile ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    {selectedFile ? (
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400 mb-2 font-medium">
                          ✓ {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Upload your credentials (degree, certification, etc.)
                      </p>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="credentials"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="credentials"
                      className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                        selectedFile
                          ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 dark:border-green-600 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/30'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                    >
                      {selectedFile ? 'Change File' : 'Choose File'}
                    </label>
                  </div>
                  <Input
                    name="credentials"
                    value={formData.credentials}
                    onChange={handleChange}
                    error={errors.credentials}
                    placeholder="Or describe your credentials"
                    className="mt-2"
                  />
                </div>
              </>
            )}

            {/* Terms and Safety Acceptance - Only for non-admin */}
            {role !== 'admin' && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedSafety}
                      onChange={(e) => setAcceptedSafety(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        I have read and agree to follow the{' '}
                        <Link href="/safety" target="_blank" className="text-primary-600 hover:text-primary-700 font-medium underline">
                          Safety Guidelines
                        </Link>
                        {' '}and Community Rules
                      </span>
                      {errors.safety && (
                        <p className="text-red-600 text-xs mt-1">{errors.safety}</p>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        I accept the{' '}
                        <Link href="/terms" target="_blank" className="text-primary-600 hover:text-primary-700 font-medium underline">
                          Terms & Conditions
                        </Link>
                        {' '}and understand that HearMe is not professional therapy
                      </span>
                      {errors.terms && (
                        <p className="text-red-600 text-xs mt-1">{errors.terms}</p>
                      )}
                    </div>
                  </label>
                </div>

                {/* Emergency Disclaimer */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-xs text-red-700 dark:text-red-300 text-center">
                    <strong>Emergency Disclaimer:</strong> If you're in crisis, contact 911 or call 988 (Crisis Lifeline) immediately. 
                    HearMe is peer support, not emergency services.
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full hearme-gradient text-white"
              size="lg"
              loading={isLoading}
              disabled={role !== 'admin' && (!acceptedTerms || !acceptedSafety)}
            >
              {role === 'listener' ? 'Apply as Listener' : role === 'admin' ? 'Login Admin Account' : 'Join as Seeker'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href={`/auth/login?role=${role}`}
              className="text-primary-600 hover:text-primary-700"
            >
              Already have an account? Sign in
            </Link>
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}