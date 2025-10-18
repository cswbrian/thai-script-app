import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import type { ThaiCharacter } from '../../utils/characters'

interface AdaptiveDifficultyProps {
  characters: ThaiCharacter[]
  onQuestionGenerated: (question: AdaptiveQuestion) => void
  onDifficultyChanged: (difficulty: DifficultyLevel) => void
  className?: string
}

interface DifficultyLevel {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  multiplier: number
  description: string
  color: string
}

interface AdaptiveQuestion {
  character: ThaiCharacter
  questionType: 'recognition' | 'pronunciation' | 'writing' | 'comprehensive'
  difficulty: DifficultyLevel
  timeLimit?: number
  options?: ThaiCharacter[]
  hints?: string[]
}

interface PerformanceData {
  characterId: string
  accuracy: number
  responseTime: number
  attempts: number
  lastAttempt: Date
}

const AdaptiveDifficulty: React.FC<AdaptiveDifficultyProps> = ({
  characters,
  onQuestionGenerated,
  onDifficultyChanged,
  className = ''
}) => {
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>({
    level: 'beginner',
    multiplier: 1.0,
    description: 'Start with basic character recognition',
    color: 'bg-green-500'
  })

  const [performanceData, setPerformanceData] = useState<Map<string, PerformanceData>>(new Map())
  const [streak, setStreak] = useState(0)
  const [recentAccuracy, setRecentAccuracy] = useState<number[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const difficultyLevels: DifficultyLevel[] = [
    {
      level: 'beginner',
      multiplier: 1.0,
      description: 'Basic character recognition with hints',
      color: 'bg-green-500'
    },
    {
      level: 'intermediate',
      multiplier: 1.2,
      description: 'Mixed question types with moderate difficulty',
      color: 'bg-yellow-500'
    },
    {
      level: 'advanced',
      multiplier: 1.5,
      description: 'Complex questions with time pressure',
      color: 'bg-orange-500'
    },
    {
      level: 'expert',
      multiplier: 2.0,
      description: 'Challenging comprehensive assessments',
      color: 'bg-red-500'
    }
  ]

  // Analyze performance and adjust difficulty
  const analyzePerformance = useCallback(() => {
    setIsAnalyzing(true)
    
    // Calculate recent accuracy (last 5 questions)
    const avgAccuracy = recentAccuracy.length > 0 
      ? recentAccuracy.reduce((sum, acc) => sum + acc, 0) / recentAccuracy.length 
      : 0

    // Calculate streak-based adjustments (for future use)
    // const streakBonus = Math.min(streak * 0.1, 0.5)
    
    // Determine new difficulty based on performance
    let newDifficultyIndex = difficultyLevels.findIndex(d => d.level === currentDifficulty.level)
    
    if (avgAccuracy >= 0.8 && streak >= 3) {
      // High performance - increase difficulty
      newDifficultyIndex = Math.min(newDifficultyIndex + 1, difficultyLevels.length - 1)
    } else if (avgAccuracy < 0.6 || streak < -2) {
      // Low performance - decrease difficulty
      newDifficultyIndex = Math.max(newDifficultyIndex - 1, 0)
    }

    const newDifficulty = difficultyLevels[newDifficultyIndex]
    
    if (newDifficulty.level !== currentDifficulty.level) {
      setCurrentDifficulty(newDifficulty)
      onDifficultyChanged(newDifficulty)
    }

    setIsAnalyzing(false)
  }, [recentAccuracy, streak, currentDifficulty, onDifficultyChanged])

  // Generate adaptive question based on current difficulty and performance
  const generateAdaptiveQuestion = useCallback((): AdaptiveQuestion => {
    // Select character based on performance data
    const weakCharacters = Array.from(performanceData.entries())
      .filter(([_, data]) => data.accuracy < 0.7)
      .map(([id, _]) => id)

    const strongCharacters = Array.from(performanceData.entries())
      .filter(([_, data]) => data.accuracy >= 0.8)
      .map(([id, _]) => id)

    let selectedCharacter: ThaiCharacter
    
    if (weakCharacters.length > 0 && Math.random() < 0.7) {
      // Focus on weak characters 70% of the time
      const weakCharId = weakCharacters[Math.floor(Math.random() * weakCharacters.length)]
      selectedCharacter = characters.find(c => c.id === weakCharId) || characters[0]
    } else if (strongCharacters.length > 0 && Math.random() < 0.3) {
      // Occasionally challenge with strong characters
      const strongCharId = strongCharacters[Math.floor(Math.random() * strongCharacters.length)]
      selectedCharacter = characters.find(c => c.id === strongCharId) || characters[0]
    } else {
      // Random character
      selectedCharacter = characters[Math.floor(Math.random() * characters.length)]
    }

    // Determine question type based on difficulty
    let questionType: AdaptiveQuestion['questionType']
    const questionTypes = ['recognition', 'pronunciation', 'writing', 'comprehensive']
    
    switch (currentDifficulty.level) {
      case 'beginner':
        questionType = 'recognition'
        break
      case 'intermediate':
        questionType = Math.random() < 0.5 ? 'recognition' : 'pronunciation'
        break
      case 'advanced':
        questionType = questionTypes[Math.floor(Math.random() * 3)] as any
        break
      case 'expert':
        questionType = 'comprehensive'
        break
      default:
        questionType = 'recognition'
    }

    // Generate options based on difficulty
    const generateOptions = () => {
      const incorrectOptions = characters
        .filter(c => c.id !== selectedCharacter.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, Math.floor(2 + currentDifficulty.multiplier)))
      
      return [...incorrectOptions, selectedCharacter]
        .sort(() => Math.random() - 0.5)
    }

    // Generate hints based on difficulty
    const generateHints = () => {
      const hints: string[] = []
      
      if (currentDifficulty.level === 'beginner') {
        hints.push(`This character is pronounced "${selectedCharacter.pronunciation}"`)
        hints.push(`It means "${selectedCharacter.meaning || 'unknown'}"`)
        if (selectedCharacter.class) {
          hints.push(`It's a ${selectedCharacter.class} class consonant`)
        }
      } else if (currentDifficulty.level === 'intermediate') {
        hints.push(`Think about the pronunciation: ${selectedCharacter.pronunciation}`)
      }
      // Advanced and expert levels get no hints
      
      return hints
    }

    const question: AdaptiveQuestion = {
      character: selectedCharacter,
      questionType,
      difficulty: currentDifficulty,
      timeLimit: Math.max(10, 30 - (currentDifficulty.multiplier * 5)),
      options: generateOptions(),
      hints: generateHints()
    }

    return question
  }, [characters, performanceData, currentDifficulty])

  // Update performance data
  const updatePerformance = useCallback((characterId: string, isCorrect: boolean, responseTime: number) => {
    const existingData = performanceData.get(characterId) || {
      characterId,
      accuracy: 0,
      responseTime: 0,
      attempts: 0,
      lastAttempt: new Date()
    }

    const newAttempts = existingData.attempts + 1
    const newAccuracy = ((existingData.accuracy * existingData.attempts) + (isCorrect ? 1 : 0)) / newAttempts
    const newResponseTime = ((existingData.responseTime * existingData.attempts) + responseTime) / newAttempts

    const updatedData: PerformanceData = {
      characterId,
      accuracy: newAccuracy,
      responseTime: newResponseTime,
      attempts: newAttempts,
      lastAttempt: new Date()
    }

    setPerformanceData(prev => new Map(prev.set(characterId, updatedData)))
    
    // Update recent accuracy
    setRecentAccuracy(prev => [...prev.slice(-4), isCorrect ? 1 : 0])
    
    // Update streak
    setStreak(prev => isCorrect ? Math.max(prev + 1, 1) : Math.min(prev - 1, -1))
    
    // Analyze performance after each question
    setTimeout(analyzePerformance, 1000)
  }, [performanceData, analyzePerformance])

  // Generate next question
  const generateNextQuestion = useCallback(() => {
    const question = generateAdaptiveQuestion()
    onQuestionGenerated(question)
  }, [generateAdaptiveQuestion, onQuestionGenerated])

  // Get performance insights
  const getPerformanceInsights = () => {
    const totalCharacters = performanceData.size
    const weakCharacters = Array.from(performanceData.values()).filter(d => d.accuracy < 0.7).length
    const strongCharacters = Array.from(performanceData.values()).filter(d => d.accuracy >= 0.8).length
    
    return {
      totalCharacters,
      weakCharacters,
      strongCharacters,
      averageAccuracy: totalCharacters > 0 
        ? Array.from(performanceData.values()).reduce((sum, d) => sum + d.accuracy, 0) / totalCharacters 
        : 0
    }
  }

  const insights = getPerformanceInsights()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Difficulty Display */}
      <div className="text-center">
        <motion.div
          key={currentDifficulty.level}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center space-x-3 px-6 py-3 rounded-lg bg-white border-2 border-gray-200"
        >
          <div className={`w-4 h-4 rounded-full ${currentDifficulty.color}`} />
          <div>
            <div className="font-semibold text-gray-900 capitalize">
              {currentDifficulty.level} Level
            </div>
            <div className="text-sm text-gray-600">
              {currentDifficulty.description}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {insights.totalCharacters}
          </div>
          <div className="text-sm text-gray-600">Characters</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {insights.strongCharacters}
          </div>
          <div className="text-sm text-gray-600">Strong</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {insights.weakCharacters}
          </div>
          <div className="text-sm text-gray-600">Weak</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(insights.averageAccuracy * 100)}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
      </div>

      {/* Adaptive Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-blue-600" />
          Adaptive Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-700">Performance-based difficulty</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-700">Weak area focus</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <LightBulbIcon className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-gray-700">Smart hints system</span>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-700">Automatic adjustment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-x-4">
        <button
          onClick={generateNextQuestion}
          disabled={isAnalyzing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? 'Analyzing...' : 'Generate Next Question'}
        </button>
        
        <button
          onClick={() => updatePerformance('ก', true, 1500)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Test Performance Update
        </button>
      </div>
    </div>
  )
}

export default AdaptiveDifficulty
export type { PerformanceData, AdaptiveQuestion, DifficultyLevel }
