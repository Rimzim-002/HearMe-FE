'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await login({
        email: formData.email,
        password: formData.password,
        role: 'admin',
        isAnonymous: false
      })
      
      router.push('/admin')
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
      <Header showThemeToggle={true} />
      
      <div className="flex items-center justify-center p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="hearme-card p-8">
            <div className="text-center mb-8">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Admin Access
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Authorized personnel only
              </p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter admin email"
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter admin password"
            />

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
              loading={isLoading}
            >
              Access Admin Panel
            </Button>
          </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}