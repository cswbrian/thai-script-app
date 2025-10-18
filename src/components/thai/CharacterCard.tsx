import React from 'react'
import { motion } from 'framer-motion'
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

  const handleClick = () => {
    console.log('CharacterCard clicked:', character.id)
    onClick()
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={`
        relative bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer
        hover:shadow-xl hover:border-blue-300 active:scale-95 touch-button
        ${isLearned ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
        ${showProgress ? 'min-h-[100px]' : 'min-h-[80px]'}
      `}
      onClick={handleClick}
    >
      {/* Character Display */}
      <div className="p-3 text-center h-full flex flex-col justify-between relative">
        {/* Main Content Area - Clickable for detail page */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Thai Character - Large and Prominent */}
          <div className="mb-2">
            <span className="text-4xl font-bold text-gray-900 thai-character">
              {character.id}
            </span>
          </div>

          {/* Character Info - Clean and Minimal */}
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-gray-700 truncate">
              {character.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {character.pronunciation}
            </div>
          </div>
        </div>

        {/* Group Color Indicator */}
        <div className={`absolute bottom-0 left-3 right-3 h-1 rounded-b-2xl ${groupColor}`}></div>

        {/* Learned Indicator */}
        {isLearned && (
          <div className="absolute top-2 left-2">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
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

        {/* Subtle Tap Indicator - Only on Mobile */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xs">→</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CharacterCard