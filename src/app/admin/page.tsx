'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  UserCheck,
  MessageSquare,
  Settings
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/Header'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  message: string
  timestamp: Date
}

interface PendingListener {
  id: string
  name: string
  email: string
  credentials: string
  appliedAt: string
  credentialFile: string
  credentialFileData?: string
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [realtimeNotifications, setRealtimeNotifications] = useState<Notification[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  
  // Load pending listeners from localStorage
  const [mockPendingListeners, setMockPendingListeners] = useState<PendingListener[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hearme_pending_listeners')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/admin-login')
      } else if (user?.role !== 'admin') {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  // Save to localStorage whenever pending listeners change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hearme_pending_listeners', JSON.stringify(mockPendingListeners))
    }
  }, [mockPendingListeners])

  // WebSocket for real-time notifications (disabled for now)
  // useEffect(() => {
  //   if (!isAuthenticated || user?.role !== 'admin') return
  //   
  //   const interval = setInterval(() => {
  //     // Mock new applications for demo
  //   }, 30000)
  //   
  //   return () => clearInterval(interval)
  // }, [isAuthenticated, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') return null

  const mockStats = {
    totalUsers: 0,
    activeListeners: 0,
    activeSessions: 0,
    totalSessions: 0,
    reportedIssues: 0
  }

  const handleApprove = (listenerId: string) => {
    const listener = mockPendingListeners.find(l => l.id === listenerId)
    if (listener) {
      // Store approval notification for listener
      const notification = {
        userId: listenerId,
        type: 'approved',
        message: 'Congratulations! Your listener application has been approved. You can now start helping seekers.',
        timestamp: new Date().toISOString()
      }
      
      const existingNotifications = JSON.parse(localStorage.getItem('hearme_listener_notifications') || '[]')
      localStorage.setItem('hearme_listener_notifications', JSON.stringify([notification, ...existingNotifications]))
    }
    
    setMockPendingListeners(prev => prev.filter(l => l.id !== listenerId))
    toast.success('Listener approved successfully!')
  }

  const handleReject = (listenerId: string) => {
    const listener = mockPendingListeners.find(l => l.id === listenerId)
    if (listener) {
      // Store rejection notification for listener
      const notification = {
        userId: listenerId,
        type: 'rejected',
        message: 'Your listener application has been reviewed. Unfortunately, we cannot approve your application at this time. Please ensure your credentials meet our requirements and feel free to reapply.',
        timestamp: new Date().toISOString()
      }
      
      const existingNotifications = JSON.parse(localStorage.getItem('hearme_listener_notifications') || '[]')
      localStorage.setItem('hearme_listener_notifications', JSON.stringify([notification, ...existingNotifications]))
    }
    
    setMockPendingListeners(prev => prev.filter(l => l.id !== listenerId))
    toast.error('Listener application rejected')
  }

  const viewCredentialFile = (fileName: string) => {
    setSelectedFile(fileName)
  }

  const createMockFile = (fileName: string): Blob => {
    if (fileName.endsWith('.pdf')) {
      const pdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj
4 0 obj<</Length 44>>stream
BT/F1 12 Tf 100 700 Td(Mock Credential Document)Tj ET
endstream endobj
xref 0 5
0000000000 65535 f
trailer<</Size 5/Root 1 0 R>>startxref 299
%%EOF`
      return new Blob([pdfContent], { type: 'application/pdf' })
    }
    const imageData = new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,0,0,0,12,73,68,65,84,8,215,99,248,0,0,0,0,1,0,1,0,0,55,110,249,36,0,0,0,0,73,69,78,68,174,66,96,130])
    return new Blob([imageData], { type: 'image/png' })
  }

  const downloadFile = (fileName: string) => {
    const listener = mockPendingListeners.find(l => l.credentialFile === fileName)
    
    if (listener?.credentialFileData) {
      const link = document.createElement('a')
      link.href = listener.credentialFileData
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(`Downloaded original file: ${fileName}`)
    } else {
      const blob = createMockFile(fileName)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`Downloaded ${fileName} - Mock file`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header showThemeToggle={true} />
      
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Manage HearMe platform and ensure community safety
              </p>
            </div>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {[
            { label: 'Total Users', value: mockStats.totalUsers, icon: Users, color: 'blue' },
            { label: 'Active Listeners', value: mockStats.activeListeners, icon: UserCheck, color: 'green' },
            { label: 'Pending Verifications', value: mockPendingListeners.length, icon: Clock, color: 'yellow' },
            { label: 'Active Sessions', value: mockStats.activeSessions, icon: MessageSquare, color: 'purple' },
            { label: 'Total Sessions', value: mockStats.totalSessions, icon: BarChart3, color: 'indigo' },
            { label: 'Reported Issues', value: mockStats.reportedIssues, icon: AlertTriangle, color: 'red' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="hearme-card p-6 text-center"
            >
              <stat.icon className={`h-8 w-8 mx-auto mb-3 text-${stat.color}-500`} />
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="hearme-card p-6 mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'verifications', label: 'Verifications', icon: UserCheck },
              { id: 'reports', label: 'Reports', icon: AlertTriangle },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="hearme-card p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">New listener verified: Dr. Sarah Johnson</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">34 active sessions currently running</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm">12 listener applications pending review</span>
                  </div>
                </div>
              </div>

              <div className="hearme-card p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Platform Health
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">System Status</span>
                    <span className="text-sm text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average Response Time</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">2.3 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">User Satisfaction</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">4.8/5.0</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verifications' && (
            <div className="hearme-card p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Pending Listener Verifications
              </h3>
              {mockPendingListeners.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                    All Caught Up!
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    No pending listener verifications at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockPendingListeners.map((listener) => (
                  <div key={listener.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{listener.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{listener.email}</p>
                      <p className="text-sm text-gray-500">{listener.credentials}</p>
                      <p className="text-xs text-gray-400">Applied: {listener.appliedAt}</p>
                      {listener.credentialFile && (
                        <button
                          onClick={() => viewCredentialFile(listener.credentialFile)}
                          className="text-xs text-blue-600 hover:text-blue-700 underline mt-1"
                        >
                          📎 View Credentials: {listener.credentialFile}
                        </button>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(listener.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleReject(listener.id)}
                      >
                        Reject
                      </Button>
                    </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="hearme-card p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Reported Issues
              </h3>
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  All Clear!
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  No active reports to review. The community is following safety guidelines.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="hearme-card p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Platform Settings
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Anonymous Registration</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Allow seekers to register anonymously</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Auto-Verification</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Automatically verify listeners from trusted institutions</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-primary-600" />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* File Preview Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Credential File: {selectedFile}
                </h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 text-center">
                {(() => {
                  const listener = mockPendingListeners.find(l => l.credentialFile === selectedFile)
                  
                  if (selectedFile.endsWith('.pdf')) {
                    return (
                      <div className="space-y-4">
                        <div className="text-6xl">📄</div>
                        <p className="text-gray-600 dark:text-gray-400">PDF Document</p>
                        <p className="text-sm text-gray-500">
                          {listener?.credentialFileData ? 'Original uploaded PDF' : 'Mock PDF for demo'}
                        </p>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => downloadFile(selectedFile)}
                        >
                          Download PDF
                        </Button>
                      </div>
                    )
                  } else {
                    return (
                      <div className="space-y-4">
                        {listener?.credentialFileData ? (
                          <div>
                            <img 
                              src={listener.credentialFileData} 
                              alt={selectedFile}
                              className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                                if (nextElement) {
                                  nextElement.style.display = 'block'
                                }
                              }}
                            />
                            <div className="text-6xl hidden">🖼️</div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Original Uploaded Image</p>
                          </div>
                        ) : (
                          <div>
                            <div className="text-6xl">🖼️</div>
                            <p className="text-gray-600 dark:text-gray-400">Image File</p>
                            <p className="text-sm text-gray-500">Mock image (no original data)</p>
                          </div>
                        )}
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => downloadFile(selectedFile)}
                        >
                          Download Image
                        </Button>
                      </div>
                    )
                  }
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}