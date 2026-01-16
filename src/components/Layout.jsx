import { Link, useLocation } from 'react-router-dom'
import { FileText, Database, Layers, GitCompare } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()

  const navItems = [
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/extraction', label: 'Extraction', icon: Database },
    { path: '/embedding', label: 'Embedding', icon: Layers },
    { path: '/comparison', label: 'Comparison', icon: GitCompare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Document Management & Extraction
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              v1.0.0
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                    ${isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Document Management & Extraction System</p>
            <p className="mt-1">Built with React + FastAPI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
