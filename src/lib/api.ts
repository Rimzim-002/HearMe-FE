const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'



interface LoginRequest {
  email?: string
  displayName?: string
  password?: string
  role: 'seeker' | 'listener' | 'admin'
  isAnonymous?: boolean
}

interface RegisterRequest {
  email?: string
  displayName?: string
  password?: string
  role: 'seeker' | 'listener' | 'admin'
  isAnonymous?: boolean
  credentials?: string
  bio?: string
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('hearme_token') || localStorage.getItem('hearme_device_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async handleRequest(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      return response
    } catch (error) {
      // Handle CORS and network errors - fallback to mock mode
      console.warn('Backend not available, using mock mode:', error)
      throw new Error('BACKEND_UNAVAILABLE')
    }
  }

  async login(credentials: LoginRequest): Promise<{ user: any; token: string }> {
    try {
      const response = await this.handleRequest(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error && error.message === 'BACKEND_UNAVAILABLE') {
        // Mock successful login for development
        return {
          user: {
            id: credentials.isAnonymous ? `anon_${Date.now()}` : '1',
            email: credentials.email || null,
            displayName: credentials.displayName || credentials.email?.split('@')[0] || 'User',
            role: credentials.role,
            isAnonymous: credentials.isAnonymous || false
          },
          token: 'mock_jwt_token_' + Date.now()
        }
      }
      throw error
    }
  }

  async register(userData: RegisterRequest): Promise<{ user: any; token: string }> {
    try {
      const response = await this.handleRequest(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error && error.message === 'BACKEND_UNAVAILABLE') {
        // Mock successful registration for development
        return {
          user: {
            id: userData.isAnonymous ? `anon_${Date.now()}` : Date.now().toString(),
            email: userData.email || null,
            displayName: userData.displayName || userData.email?.split('@')[0] || 'User',
            role: userData.role,
            isAnonymous: userData.isAnonymous || false,
            bio: userData.bio,
            credentials: userData.credentials
          },
          token: 'mock_jwt_token_' + Date.now()
        }
      }
      throw error
    }
  }


}

export const apiClient = new ApiClient()