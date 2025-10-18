import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, PencilIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { getCharacterById } from '../utils/characters'
import AudioControls from '../components/ui/AudioControls'

const CharacterDetailPage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>()
  const character = characterId ? getCharacterById(characterId) : null

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Character Not Found</h1>
          <p className="text-gray-600 mb-6">The requested character could not be found.</p>
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
    // Navigate to writing practice page
    window.location.href = `/practice/${character.id}`
  }

  const handleQuiz = () => {
    // Navigate to quiz with this character
    window.location.href = `/quiz?character=${character.id}`
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/characters"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6 mr-2" />
              Back to Characters
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Character Details</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Character Display */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Main Character Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="text-center">
              {/* Large Character Display */}
              <div className="mb-6">
                <span className="text-8xl font-bold text-gray-900 thai-font">
                  {character.id}
                </span>
              </div>

              {/* Character Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {character.name}
                  </h2>
                  <p className="text-lg text-gray-600">
                    Pronunciation: <span className="font-semibold">{character.pronunciation}</span>
                  </p>
                </div>

                {character.meaning && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">Meaning:</span> {character.meaning}
                    </p>
                  </div>
                )}

                {character.unicode && (
                  <div className="text-sm text-gray-500">
                    Unicode: {character.unicode}
                  </div>
                )}

                {character.strokeCount && (
                  <div className="text-sm text-gray-500">
                    Stroke Count: {character.strokeCount}
                  </div>
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
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleWritingPractice}
              className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors touch-button"
            >
              <PencilIcon className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Writing Practice</div>
                <div className="text-sm opacity-90">Practice stroke order</div>
              </div>
            </button>

            <button
              onClick={handleQuiz}
              className="flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors touch-button"
            >
              <AcademicCapIcon className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Take Quiz</div>
                <div className="text-sm opacity-90">Test your knowledge</div>
              </div>
            </button>
          </div>

          {/* Character Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Character Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Type:</span>
                <p className="text-gray-900">
                  {character.class ? `${character.class}-class consonant` : 
                   character.type ? `${character.type} vowel` : 
                   'Tone mark'}
                </p>
              </div>
              
              {character.position && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Position:</span>
                  <p className="text-gray-900 capitalize">{character.position}</p>
                </div>
              )}

              {character.tone && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Tone:</span>
                  <p className="text-gray-900 capitalize">{character.tone}</p>
                </div>
              )}

              {character.description && (
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-gray-500">Description:</span>
                  <p className="text-gray-900">{character.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Recognition</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Writing Practice</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Quiz Performance</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterDetailPage
