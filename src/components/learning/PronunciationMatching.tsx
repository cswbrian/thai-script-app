import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import AudioControls from '../ui/AudioControls'
import type { ThaiCharacter } from '../../utils/characters'

interface PronunciationMatchingProps {
  targetCharacter: ThaiCharacter
  options: ThaiCharacter[]
  onAnswer: (characterId: string) => void
  timeLimit?: number
  showTimer?: boolean
  allowReplay?: boolean
  className?: string
}

const PronunciationMatching: React.FC<PronunciationMatchingProps> = ({
  targetCharacter,
  options,
  onAnswer,
  timeLimit = 30,
  showTimer = true,
  allowReplay = true,
  className = ''
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [isAnswered, setIsAnswered] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !isAnswered) {
      // Time's up - auto-submit
      handleAnswer('timeout')
    }
  }, [timeRemaining, isAnswered])

  const handleAnswer = (characterId: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(characterId)
    setIsAnswered(true)
    setShowFeedback(true)
    
    // Show feedback briefly before calling onAnswer
    setTimeout(() => {
      onAnswer(characterId)
    }, 1500)
  }

  const handleReplay = () => {
    if (allowReplay && !isAnswered) {
      setPlayCount(prev => prev + 1)
    }
  }

  const getTimeColor = () => {
    if (timeRemaining > 10) return 'text-green-600'
    if (timeRemaining > 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAnswerFeedback = (character: ThaiCharacter) => {
    if (!showFeedback) return null
    
    const isCorrect = character.id === targetCharacter.id
    const isSelected = character.id === selectedAnswer
    
    if (isCorrect) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-green-100 border-2 border-green-500 rounded-lg flex items-center justify-center"
        >
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </motion.div>
      )
    }
    
    if (isSelected && !isCorrect) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-red-100 border-2 border-red-500 rounded-lg flex items-center justify-center"
        >
          <XCircleIcon className="h-8 w-8 text-red-600" />
        </motion.div>
      )
    }
    
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Pronunciation Matching
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Listen to the pronunciation and select the correct character
        </p>
        
        {/* Timer */}
        {showTimer && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ClockIcon className="h-5 w-5 text-gray-500" />
            <span className={`text-lg font-bold ${getTimeColor()}`}>
              {timeRemaining}s
            </span>
          </div>
        )}
      </div>

      {/* Audio Player */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-3">
            {isAnswered ? 'Correct Answer:' : 'Listen to this pronunciation:'}
          </div>
          
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 thai-font mb-2"
            >
              {targetCharacter.id}
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <AudioControls
            audioPath={targetCharacter.audioPath}
            characterName={targetCharacter.name}
            character={targetCharacter}
            size="lg"
            showLabel={true}
          />
          
          {allowReplay && !isAnswered && (
            <button
              onClick={handleReplay}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlayIcon className="h-4 w-4" />
              <span className="text-sm">Replay</span>
            </button>
          )}
        </div>
        
        {playCount > 0 && (
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500">
              Played {playCount} time{playCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Character Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AnimatePresence>
          {options.map((character, index) => {
            const isSelected = character.id === selectedAnswer
            const isCorrect = character.id === targetCharacter.id
            
            return (
              <motion.button
                key={character.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(character.id)}
                disabled={isAnswered}
                className={`
                  relative p-4 border-2 rounded-lg transition-all duration-200 touch-button
                  ${isAnswered 
                    ? 'cursor-not-allowed' 
                    : 'hover:border-blue-300 hover:bg-blue-50'
                  }
                  ${isSelected 
                    ? isCorrect 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 thai-font mb-1">
                    {character.id}
                  </div>
                  <div className="text-xs text-gray-600">
                    {character.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {character.pronunciation}
                  </div>
                </div>
                
                {/* Feedback Overlay */}
                {getAnswerFeedback(character)}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      {!isAnswered && (
        <div className="text-center text-sm text-gray-500">
          <p>Click on the character that matches the pronunciation you heard.</p>
          {timeLimit > 0 && (
            <p className="mt-1">
              You have {timeRemaining} seconds remaining.
            </p>
          )}
        </div>
      )}

      {/* Answer Feedback */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              {selectedAnswer === targetCharacter.id ? 'Correct!' : 'Incorrect'}
            </h4>
            <p className="text-sm text-gray-600">
              The correct answer is <span className="font-medium">{targetCharacter.id}</span> ({targetCharacter.name})
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Pronounced: <span className="font-medium">{targetCharacter.pronunciation}</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PronunciationMatching
