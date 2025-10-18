import React from 'react'
import { BookOpenIcon } from '@heroicons/react/24/outline'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 thai-font">
              Thai Script Learning
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            PWA
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
