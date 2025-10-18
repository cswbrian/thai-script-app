import React from 'react'
import { SpeakerWaveIcon } from '@heroicons/react/24/outline'
import type { ThaiCharacter } from '../../utils/characters'

interface CharacterCardProps {
  character: ThaiCharacter
  onClick: () => void
  groupColor: string
  isLearned?: boolean
  showProgress?: boolean
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
  groupColor,
  isLearned = false,
  showProgress = false
}) => {
  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement audio playback using Howler.js
    console.log('Playing audio for:', character.id)
  }

  return (
    <div
      className={`
        relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer
        hover:shadow-md hover:scale-105 touch-button
        ${isLearned ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
        ${showProgress ? 'min-h-[120px]' : 'min-h-[100px]'}
      `}
      onClick={onClick}
    >
      {/* Character Display */}
      <div className="p-4 text-center">
        {/* Thai Character */}
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900 thai-font">
            {character.id}
          </span>
        </div>

        {/* Character Info */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-700">
            {character.name}
          </div>
          <div className="text-xs text-gray-500">
            {character.pronunciation}
          </div>
          {character.meaning && (
            <div className="text-xs text-gray-400">
              {character.meaning}
            </div>
          )}
        </div>

        {/* Audio Button */}
        <button
          onClick={handleAudioClick}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label={`Play pronunciation for ${character.name}`}
        >
          <SpeakerWaveIcon className="h-4 w-4 text-gray-600" />
        </button>

        {/* Group Color Indicator */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-lg ${groupColor}`}></div>

        {/* Learned Indicator */}
        {isLearned && (
          <div className="absolute top-2 left-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        )}

        {/* Progress Indicator */}
        {showProgress && (
          <div className="absolute bottom-1 left-2 right-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.random() * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CharacterCard
