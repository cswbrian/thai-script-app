import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PencilIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { getCharacterById } from '../utils/characters'
import AudioControls from '../components/ui/AudioControls'

const CharacterDetailPage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>()
  const navigate = useNavigate()
  const character = characterId ? getCharacterById(characterId) : null

  if (!character) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Character Not Found</h1>
          <Link
            to="/characters"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Characters
          </Link>
        </div>
      </div>
    )
  }

  const handleWritingPractice = () => {
    navigate(`/practice/${character.id}`)
  }

  const handleQuiz = () => {
    navigate(`/quiz?character=${character.id}`)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/characters"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6 mr-2" />
              Back
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">{character.name}</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Character Display */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Main Character Card */}
          <div className="bg-gray-50 rounded-2xl p-12 mb-8 text-center">
            {/* Large Character Display */}
            <div className="mb-8">
              <span className="text-9xl font-bold text-gray-900 thai-font">
                {character.id}
              </span>
            </div>

            {/* Character Info */}
            <div className="space-y-3 mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {character.name}
              </h2>
              <p className="text-xl text-gray-600">
                {character.pronunciation}
              </p>
              {character.meaning && (
                <p className="text-lg text-gray-500">
                  {character.meaning}
                </p>
              )}
            </div>

            {/* Audio Controls */}
            {character.audioPath && (
              <div className="mb-6">
                <AudioControls
                  audioPath={character.audioPath}
                  characterName={character.name}
                  character={character}
                  size="lg"
                  showLabel={true}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleWritingPractice}
              className="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors touch-button"
            >
              <PencilIcon className="h-6 w-6 mr-3" />
              <span className="text-lg font-semibold">Practice Writing</span>
            </button>

            <button
              onClick={handleQuiz}
              className="w-full flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors touch-button"
            >
              <AcademicCapIcon className="h-6 w-6 mr-3" />
              <span className="text-lg font-semibold">Take Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterDetailPage