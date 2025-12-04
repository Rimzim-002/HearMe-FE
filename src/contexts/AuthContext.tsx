'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User, AuthState } from '@/types'
import { generateDisplayName, generateDeviceToken, generateUserId } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
}

interface LoginCredentials {
  email?: string
  displayName?: string
  password?: string
  role: 'seeker' | 'listener' | 'admin'
  isAnonymous?: boolean
}

interface RegisterData {
  email?: string
  displayName?: string
  password?: string
  role: 'seeker' | 'listener' | 'admin'
  isAnonymous?: boolean
  credentials?: string
  bio?: string
  credentialFile?: string
  credentialFileData?: string
}

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('hearme_token')
        const deviceToken = localStorage.getItem('hearme_device_token')
        const userData = localStorage.getItem('hearme_user')
        
        if (token && userData) {
          // Check for temp admin token
          if (token === 'temp_admin_token') {
            const user = JSON.parse(userData)
            dispatch({ type: 'SET_USER', payload: user })
            dispatch({ type: 'SET_AUTHENTICATED', payload: true })
          } else {
            // Verify JWT token with backend
            // For demo: assume token is valid if it exists
            const user = JSON.parse(userData)
            dispatch({ type: 'SET_USER', payload: user })
            dispatch({ type: 'SET_AUTHENTICATED', payload: true })
          }
        } else if (deviceToken && userData) {
          // Anonymous user with device token
          const user = JSON.parse(userData)
          dispatch({ type: 'SET_USER', payload: user })
          dispatch({ type: 'SET_AUTHENTICATED', payload: true })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('hearme_token')
        localStorage.removeItem('hearme_device_token')
        localStorage.removeItem('hearme_user')
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      if (credentials.isAnonymous) {
        // Handle anonymous login locally
        const user: User = {
          id: generateUserId(),
          displayName: credentials.displayName || generateDisplayName(),
          role: 'seeker',
          isAnonymous: true,
          isVerified: true,
          createdAt: new Date()
        }
        
        const deviceToken = generateDeviceToken()
        localStorage.setItem('hearme_device_token', deviceToken)
        localStorage.setItem('hearme_user', JSON.stringify(user))
        
        dispatch({ type: 'SET_USER', payload: user })
        dispatch({ type: 'SET_AUTHENTICATED', payload: true })
        
        toast.success('Welcome! You can start talking immediately.')
      } else {
        // Temporary admin fallback
        if (credentials.role === 'admin' && credentials.email === 'admin@hearme.com' && credentials.password === 'admin123') {
          const user: User = {
            id: 'admin_1',
            email: 'admin@hearme.com',
            displayName: 'Admin User',
            role: 'admin',
            isAnonymous: false,
            isVerified: true,
            createdAt: new Date()
          }
          
          localStorage.setItem('hearme_token', 'temp_admin_token')
          localStorage.setItem('hearme_user', JSON.stringify(user))
          
          dispatch({ type: 'SET_USER', payload: user })
          dispatch({ type: 'SET_AUTHENTICATED', payload: true })
          
          toast.success('Welcome Admin!')
        } else {
          // Use API for other registered users
          const response = await apiClient.login(credentials)
          
          localStorage.setItem('hearme_token', response.token)
          localStorage.setItem('hearme_user', JSON.stringify(response.user))
          
          dispatch({ type: 'SET_USER', payload: response.user })
          dispatch({ type: 'SET_AUTHENTICATED', payload: true })
          
          toast.success(`Welcome ${credentials.role === 'seeker' ? 'Seeker' : credentials.role === 'listener' ? 'Listener' : 'Admin'}!`)
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      if (userData.isAnonymous) {
        // Handle anonymous registration locally
        const user: User = {
          id: generateUserId(),
          displayName: userData.displayName || generateDisplayName(),
          role: 'seeker',
          isAnonymous: true,
          isVerified: true,
          createdAt: new Date()
        }
        
        const deviceToken = generateDeviceToken()
        localStorage.setItem('hearme_device_token', deviceToken)
        localStorage.setItem('hearme_user', JSON.stringify(user))
        
        dispatch({ type: 'SET_USER', payload: user })
        dispatch({ type: 'SET_AUTHENTICATED', payload: true })
        
        toast.success('Welcome! You can start talking immediately.')
      } else {
        // Use API for registered users
        const response = await apiClient.register(userData)
        
        // Check if this listener was previously rejected
        if (userData.role === 'listener') {
          const notifications = JSON.parse(localStorage.getItem('hearme_listener_notifications') || '[]')
          const rejectionNotification = notifications.find((n: any) => 
            n.userId === response.user.id && n.type === 'rejected'
          )
          
          if (rejectionNotification) {
            // Don't auto-approve rejected listeners
            response.user.isVerified = false
            response.user.rejectionReason = 'Previously rejected - credentials need review'
          }
        }
        
        localStorage.setItem('hearme_token', response.token)
        localStorage.setItem('hearme_user', JSON.stringify(response.user))
        
        dispatch({ type: 'SET_USER', payload: response.user })
        dispatch({ type: 'SET_AUTHENTICATED', payload: true })
        
        if (userData.role === 'listener') {
          // Add to pending listeners list for admin review
          const pendingListener = {
            id: response.user.id,
            name: response.user.displayName || response.user.email?.split('@')[0] || 'Unknown',
            email: response.user.email || '',
            credentials: userData.credentials || userData.bio || 'No credentials provided',
            appliedAt: new Date().toISOString().split('T')[0],
            credentialFile: userData.credentialFile || 'credentials_document.pdf',
            credentialFileData: userData.credentialFileData
          }
          
          const existingPending = JSON.parse(localStorage.getItem('hearme_pending_listeners') || '[]')
          const updatedPending = [pendingListener, ...existingPending]
          localStorage.setItem('hearme_pending_listeners', JSON.stringify(updatedPending))
          
          toast.success('Registration successful! Your credentials are being verified.')
        } else {
          toast.success('Welcome to HearMe! You can start connecting with listeners.')
        }
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = () => {
    localStorage.removeItem('hearme_token')
    localStorage.removeItem('hearme_device_token')
    localStorage.removeItem('hearme_user')
    dispatch({ type: 'SET_USER', payload: null })
    dispatch({ type: 'SET_AUTHENTICATED', payload: false })
    toast.success('Logged out successfully')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) return
    
    const updatedUser = { ...state.user, ...updates }
    localStorage.setItem('hearme_user', JSON.stringify(updatedUser))
    dispatch({ type: 'SET_USER', payload: updatedUser })
    toast.success('Profile updated successfully')
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}