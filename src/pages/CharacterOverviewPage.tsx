import React from 'react'

const CharacterOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Thai Character Overview
        </h1>
        <p className="text-gray-600">
          Explore all Thai consonants, vowels, and tone marks
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Character grid component will be implemented in Task 2.0
        </p>
      </div>
    </div>
  )
}

export default CharacterOverviewPage
