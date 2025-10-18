import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import WritingPractice from '../components/thai/WritingPractice'
import { getCharacterById } from '../utils/characters'

const WritingPracticePage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>()
  const navigate = useNavigate()

  if (!characterId) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Character Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested character could not be found.
          </p>
          <button
            onClick={() => navigate('/characters')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Characters
          </button>
        </div>
      </div>
    )
  }

  const character = getCharacterById(characterId)

  if (!character) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Character Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Character "{characterId}" could not be found in the database.
          </p>
          <button
            onClick={() => navigate('/characters')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Characters
          </button>
        </div>
      </div>
    )
  }

  const handleComplete = (accuracy: number) => {
    console.log(`Writing practice completed with ${accuracy}% accuracy`)
    // Here you could add logic to save progress, show results, etc.
  }

  const handleExit = () => {
    navigate('/characters')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <button
          onClick={handleExit}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Characters
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Writing Practice
        </h1>
        <p className="text-gray-600">
          Practice writing Thai characters with stroke order guidance
        </p>
      </div>
      
      {/* Writing Practice Component */}
      <WritingPractice
        character={character}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    </div>
  )
}

export default WritingPracticePage
