import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import AudioControls from '../ui/AudioControls'
import type { ThaiCharacter } from '../../utils/characters'

interface SpeedTestProps {
  characters: ThaiCharacter[]
  timeLimit?: number
  onComplete: (results: SpeedTestResult[]) => void
  onExit?: () => void
  className?: string
}

interface SpeedTestResult {
  characterId: string
  responseTime: number
  isCorrect: boolean
  attempts: number
}

interface SpeedTestQuestion {
  character: ThaiCharacter
  options: ThaiCharacter[]
  correctAnswer: string
  startTime: number
}

const SpeedTest: React.FC<SpeedTestProps> = ({
  characters,
  timeLimit = 60,
  onComplete,
  onExit,
  className = ''
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<SpeedTestQuestion | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [results, setResults] = useState<SpeedTestResult[]>([])
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  // Generate random question
  const generateQuestion = useCallback((): SpeedTestQuestion => {
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
    const incorrectOptions = characters
      .filter(c => c.id !== randomCharacter.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    
    const options = [...incorrectOptions, randomCharacter]
      .sort(() => Math.random() - 0.5)

    return {
      character: randomCharacter,
      options,
      correctAnswer: randomCharacter.id,
      startTime: Date.now()
    }
  }, [characters])

  // Start the speed test
  const startTest = () => {
    setIsActive(true)
    setCurrentQuestion(generateQuestion())
    setQuestionIndex(0)
    setResults([])
    setTimeRemaining(timeLimit)
  }

  // Timer countdown
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && isActive) {
      finishTest()
    }
  }, [timeRemaining, isActive])

  // Handle answer selection
  const handleAnswer = (characterId: string) => {
    if (!currentQuestion || showFeedback) return

    const responseTime = Date.now() - currentQuestion.startTime
    const isCorrect = characterId === currentQuestion.correctAnswer
    
    const result: SpeedTestResult = {
      characterId: currentQuestion.character.id,
      responseTime,
      isCorrect,
      attempts: 1
    }

    setSelectedAnswer(characterId)
    setShowFeedback(true)
    setResults(prev => [...prev, result])

    // Show feedback briefly, then move to next question
    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)
      
      if (timeRemaining > 0) {
        setCurrentQuestion(generateQuestion())
        setQuestionIndex(prev => prev + 1)
      } else {
        finishTest()
      }
    }, 1000)
  }

  // Finish the test
  const finishTest = () => {
    setIsActive(false)
    setIsCompleted(true)
    onComplete(results)
  }

  // Calculate statistics
  const getStats = () => {
    if (results.length === 0) return null

    const correctAnswers = results.filter(r => r.isCorrect).length
    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
    const accuracy = (correctAnswers / results.length) * 100

    return {
      totalQuestions: results.length,
      correctAnswers,
      accuracy,
      averageResponseTime: Math.round(averageResponseTime),
      fastestResponse: Math.min(...results.map(r => r.responseTime)),
      slowestResponse: Math.max(...results.map(r => r.responseTime))
    }
  }

  const stats = getStats()

  if (isCompleted && stats) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Results Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
          >
            <TrophyIcon className="h-8 w-8 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Speed Test Complete!
          </h2>
          <p className="text-gray-600">
            You answered {stats.totalQuestions} questions in {timeLimit} seconds
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600">
              {stats.accuracy.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-50 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600">
              {stats.correctAnswers}
            </div>
            <div className="text-sm text-gray-600">Correct</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-50 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageResponseTime}ms
            </div>
            <div className="text-sm text-gray-600">Avg Time</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-orange-600">
              {stats.fastestResponse}ms
            </div>
            <div className="text-sm text-gray-600">Fastest</div>
          </motion.div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-gray-600" />
            Detailed Results
          </h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  result.isCorrect ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {result.isCorrect ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">{result.characterId}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {result.responseTime}ms
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={startTest}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!isActive) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Character Recognition Speed Test
          </h2>
          <p className="text-gray-600 mb-6">
            Test how quickly you can recognize Thai characters. You'll have {timeLimit} seconds to answer as many questions as possible.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left max-w-md mx-auto">
              <li>• Listen to the pronunciation</li>
              <li>• Select the correct character as quickly as possible</li>
              <li>• Answer as many questions as you can in {timeLimit} seconds</li>
              <li>• Accuracy and speed both matter!</li>
            </ul>
          </div>
          
          <button
            onClick={startTest}
            className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Speed Test
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-gray-500" />
            <span className="text-lg font-bold text-gray-900">
              {timeRemaining}s
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Question {questionIndex + 1}
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-3">
            Listen to the pronunciation:
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <AudioControls
            audioPath={currentQuestion.character.audioPath}
            characterName={currentQuestion.character.name}
            character={currentQuestion.character}
            size="lg"
            showLabel={true}
          />
        </div>
      </div>

      {/* Character Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AnimatePresence>
          {currentQuestion.options.map((character, index) => {
            const isSelected = character.id === selectedAnswer
            const isCorrect = character.id === currentQuestion.correctAnswer
            
            return (
              <motion.button
                key={character.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(character.id)}
                disabled={showFeedback}
                className={`
                  relative p-4 border-2 rounded-lg transition-all duration-200 touch-button
                  ${showFeedback 
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
                </div>
                
                {/* Feedback Overlay */}
                {showFeedback && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center"
                  >
                    {isCorrect ? (
                      <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircleIcon className="h-8 w-8 text-red-600" />
                    )}
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Progress */}
      <div className="text-center">
        <div className="text-sm text-gray-600">
          Questions answered: {results.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(results.length / Math.max(results.length + 1, 10)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default SpeedTest