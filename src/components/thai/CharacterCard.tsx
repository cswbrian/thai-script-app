import React from 'react'
import { motion } from 'framer-motion'
import type { ThaiCharacter } from '../../utils/characters'

interface CharacterCardProps {
  character: ThaiCharacter
  onClick: () => void
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick
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
        border-gray-200 hover:border-gray-300 min-h-[80px]
      `}
      onClick={handleClick}
    >
      {/* Character Display */}
      <div className="p-3 text-center h-full flex flex-col justify-between relative">
        {/* Main Content Area - Clickable for detail page */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Thai Character - Large and Prominent */}
          <div className="mb-2">
            <span className="text-5xl text-gray-900 thai-character">
              {character.id}
            </span>
          </div>

          {/* Character Info - Clean and Minimal */}
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-gray-700 text-wrap">
              {character.name}
            </div>
            <div className="text-xs text-gray-500 text-wrap">
              {character.pronunciation}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}

export default CharacterCard