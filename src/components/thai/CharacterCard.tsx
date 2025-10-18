import React from 'react'
import type { ThaiCharacter } from '../../utils/characters'
import AudioControls from '../ui/AudioControls'

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

  return (
    <div
      className={`
        relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:scale-105 hover:border-blue-300 active:scale-95 touch-button
        ${isLearned ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
        ${showProgress ? 'min-h-[100px] sm:min-h-[120px]' : 'min-h-[80px] sm:min-h-[100px]'}
      `}
      onClick={onClick}
    >
      {/* Character Display */}
      <div className="p-2 sm:p-3 md:p-4 text-center">
        {/* Thai Character */}
        <div className="mb-1 sm:mb-2">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 thai-font">
            {character.id}
          </span>
        </div>

        {/* Character Info */}
        <div className="space-y-0.5 sm:space-y-1">
          <div className="text-xs sm:text-sm font-medium text-gray-700 truncate">
            {character.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {character.pronunciation}
          </div>
          {character.meaning && (
            <div className="text-xs text-gray-400 truncate">
              {character.meaning}
            </div>
          )}
          <div className="text-xs text-blue-500 font-medium mt-0.5 sm:mt-1">
            Click to learn
          </div>
        </div>

        {/* Audio Controls */}
        {character.audioPath && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
            <AudioControls
              audioPath={character.audioPath}
              characterName={character.name}
              character={character}
              size="sm"
            />
          </div>
        )}

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
