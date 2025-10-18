import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  PencilIcon 
} from '@heroicons/react/24/outline'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: BookOpenIcon,
      title: 'Character Overview',
      description: 'Explore all Thai consonants, vowels, and tone marks',
      path: '/characters',
      color: 'bg-blue-500'
    },
    {
      icon: PencilIcon,
      title: 'Writing Practice',
      description: 'Learn proper stroke order with interactive practice',
      path: '/practice',
      color: 'bg-green-500'
    },
    {
      icon: AcademicCapIcon,
      title: 'Take Quiz',
      description: 'Test your knowledge with interactive quizzes',
      path: '/quiz',
      color: 'bg-purple-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Track Progress',
      description: 'Monitor your learning journey and achievements',
      path: '/progress',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 thai-font">
          สวัสดี! Welcome to Thai Script Learning
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master the beautiful Thai script with interactive lessons, 
          writing practice, and comprehensive quizzes.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.path}
              to={feature.path}
              className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow touch-button"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Learning Overview
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">44</div>
            <div className="text-sm text-gray-600">Consonants</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">32</div>
            <div className="text-sm text-gray-600">Vowels</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600">Tone Marks</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
