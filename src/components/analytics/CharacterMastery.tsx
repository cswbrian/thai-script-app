import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  StarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  FireIcon,
  AcademicCapIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { useProgressStore } from '../../stores/useProgressStore'
import type { ThaiCharacter } from '../../utils/characters'

interface CharacterMasteryProps {
  characters: ThaiCharacter[]
  className?: string
}

interface MasteryLevel {
  level: 'beginner' | 'developing' | 'proficient' | 'mastered' | 'expert'
  threshold: number
  color: string
  icon: React.ComponentType<any>
  description: string
}

interface CharacterMasteryData {
  characterId: string
  characterName: string
  masteryLevel: MasteryLevel['level']
  accuracy: number
  attempts: number
  lastPracticed: Date
  streak: number
  timeSpent: number
  improvement: number
  needsReview: boolean
}

const CharacterMastery: React.FC<CharacterMasteryProps> = ({
  characters,
  className = ''
}) => {
  const { characterProgress } = useProgressStore()
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'weak' | 'strong' | 'needs-review'>('all')
  const [sortBy, setSortBy] = useState<'mastery' | 'accuracy' | 'recent' | 'streak'>('mastery')

  const masteryLevels: MasteryLevel[] = [
    {
      level: 'beginner',
      threshold: 0,
      color: 'bg-gray-500',
      icon: AcademicCapIcon,
      description: 'Just started learning'
    },
    {
      level: 'developing',
      threshold: 30,
      color: 'bg-blue-500',
      icon: LightBulbIcon,
      description: 'Making progress'
    },
    {
      level: 'proficient',
      threshold: 60,
      color: 'bg-green-500',
      icon: CheckCircleIcon,
      description: 'Good understanding'
    },
    {
      level: 'mastered',
      threshold: 80,
      color: 'bg-purple-500',
      icon: StarIcon,
      description: 'Strong mastery'
    },
    {
      level: 'expert',
      threshold: 95,
      color: 'bg-yellow-500',
      icon: TrophyIcon,
      description: 'Expert level'
    }
  ]

  // Calculate mastery data for all characters
  const masteryData = useMemo((): CharacterMasteryData[] => {
    return characters.map(character => {
      const progress = characterProgress[character.id] || {
        totalAttempts: 0,
        correctAttempts: 0,
        lastPracticed: new Date(),
        streak: 0,
        timeSpent: 0
      }

      const accuracy = progress.totalAttempts > 0 
        ? (progress.correctAttempts / progress.totalAttempts) * 100 
        : 0

      // Determine mastery level
      const masteryLevel = masteryLevels
        .slice()
        .reverse()
        .find(level => accuracy >= level.threshold)?.level || 'beginner'

      // Calculate improvement (simplified - would need historical data)
      const improvement = Math.random() * 20 - 10 // Placeholder

      // Determine if needs review (not practiced recently or low accuracy)
      const daysSinceLastPractice = Math.floor(
        (Date.now() - progress.lastPracticed.getTime()) / (1000 * 60 * 60 * 24)
      )
      const needsReview = daysSinceLastPractice > 7 || accuracy < 50

      return {
        characterId: character.id,
        characterName: character.name,
        masteryLevel: masteryLevel as MasteryLevel['level'],
        accuracy,
        attempts: progress.totalAttempts,
        lastPracticed: progress.lastPracticed,
        streak: progress.streak,
        timeSpent: 0, // Placeholder - timeSpent not available in CharacterProgress
        improvement,
        needsReview
      }
    })
  }, [characters, characterProgress])

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = masteryData

    // Apply filter
    switch (selectedFilter) {
      case 'weak':
        filtered = masteryData.filter(char => char.accuracy < 60)
        break
      case 'strong':
        filtered = masteryData.filter(char => char.accuracy >= 80)
        break
      case 'needs-review':
        filtered = masteryData.filter(char => char.needsReview)
        break
      default:
        filtered = masteryData
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'mastery':
          const aLevel = masteryLevels.findIndex(l => l.level === a.masteryLevel)
          const bLevel = masteryLevels.findIndex(l => l.level === b.masteryLevel)
          return bLevel - aLevel
        case 'accuracy':
          return b.accuracy - a.accuracy
        case 'recent':
          return b.lastPracticed.getTime() - a.lastPracticed.getTime()
        case 'streak':
          return b.streak - a.streak
        default:
          return 0
      }
    })
  }, [masteryData, selectedFilter, sortBy])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = masteryData.length
    const mastered = masteryData.filter(char => char.masteryLevel === 'mastered' || char.masteryLevel === 'expert').length
    const developing = masteryData.filter(char => char.masteryLevel === 'developing' || char.masteryLevel === 'proficient').length
    const beginner = masteryData.filter(char => char.masteryLevel === 'beginner').length
    const needsReview = masteryData.filter(char => char.needsReview).length
    const averageAccuracy = masteryData.reduce((sum, char) => sum + char.accuracy, 0) / total

    return {
      total,
      mastered,
      developing,
      beginner,
      needsReview,
      averageAccuracy
    }
  }, [masteryData])

  const getMasteryLevelInfo = (level: MasteryLevel['level']) => {
    return masteryLevels.find(l => l.level === level) || masteryLevels[0]
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600'
    if (accuracy >= 70) return 'text-blue-600'
    if (accuracy >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Character Mastery Tracking
        </h2>
        <p className="text-gray-600 mb-4">
          Track your progress and identify areas for improvement
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-4 text-center"
        >
          <TrophyIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            {summaryStats.mastered}
          </div>
          <div className="text-sm text-gray-600">Mastered</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 rounded-lg p-4 text-center"
        >
          <ChartBarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {summaryStats.developing}
          </div>
          <div className="text-sm text-gray-600">Developing</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-yellow-50 rounded-lg p-4 text-center"
        >
          <AcademicCapIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-600">
            {summaryStats.beginner}
          </div>
          <div className="text-sm text-gray-600">Beginner</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-red-50 rounded-lg p-4 text-center"
        >
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-600">
            {summaryStats.needsReview}
          </div>
          <div className="text-sm text-gray-600">Need Review</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-purple-50 rounded-lg p-4 text-center"
        >
          <StarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(summaryStats.averageAccuracy)}%
          </div>
          <div className="text-sm text-gray-600">Avg Accuracy</div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex space-x-2">
          {(['all', 'weak', 'strong', 'needs-review'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter === 'needs-review' ? 'Needs Review' : 
               filter === 'all' ? 'All Characters' :
               filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="mastery">Mastery Level</option>
            <option value="accuracy">Accuracy</option>
            <option value="recent">Recently Practiced</option>
            <option value="streak">Streak</option>
          </select>
        </div>
      </div>

      {/* Character Mastery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((char, index) => {
          const masteryInfo = getMasteryLevelInfo(char.masteryLevel)
          const IconComponent = masteryInfo.icon

          return (
            <motion.div
              key={char.characterId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg border-2 p-4 transition-all ${
                char.needsReview ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Character Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold thai-font">
                    {char.characterId}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {char.characterName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {char.attempts} attempts
                    </div>
                  </div>
                </div>
                
                {char.needsReview && (
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                )}
              </div>

              {/* Mastery Level */}
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${masteryInfo.color}`} />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {char.masteryLevel}
                </span>
                <IconComponent className="h-4 w-4 text-gray-500" />
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Accuracy</span>
                  <span className={getAccuracyColor(char.accuracy)}>
                    {Math.round(char.accuracy)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      char.accuracy >= 90 ? 'bg-green-500' :
                      char.accuracy >= 70 ? 'bg-blue-500' :
                      char.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${char.accuracy}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-1">
                  <FireIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-600">{char.streak} streak</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">
                    {Math.round(char.timeSpent / 60)}m
                  </span>
                </div>
              </div>

              {/* Last Practiced */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Last practiced: {char.lastPracticed.toLocaleDateString()}
                </div>
                {char.improvement > 0 && (
                  <div className="text-xs text-green-600 mt-1">
                    ↗ +{Math.round(char.improvement)}% improvement
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No characters found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filter or start practicing to build your mastery data.
          </p>
        </div>
      )}

      {/* Mastery Level Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Mastery Levels</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {masteryLevels.map((level) => {
            const IconComponent = level.icon
            return (
              <div key={level.level} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${level.color}`} />
                <IconComponent className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {level.level}
                  </div>
                  <div className="text-xs text-gray-600">
                    {level.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CharacterMastery
