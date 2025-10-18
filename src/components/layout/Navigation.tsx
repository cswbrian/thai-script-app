import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const Navigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/characters', icon: BookOpenIcon, label: 'Characters' },
    { path: '/quiz', icon: AcademicCapIcon, label: 'Quiz' },
    { path: '/progress', icon: ChartBarIcon, label: 'Progress' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors touch-button ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
