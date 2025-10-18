import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  LightBulbIcon,
  TagIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  FireIcon,
  ArrowRightIcon,
  PencilIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'
import { useProgressStore } from '../../stores/useProgressStore'
import type { ThaiCharacter } from '../../utils/characters'

interface PersonalizedRecommendationsProps {
  characters: ThaiCharacter[]
  className?: string
}

interface Recommendation {
  id: string
  type: 'practice' | 'review' | 'challenge' | 'lesson' | 'quiz'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  estimatedTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  characters: ThaiCharacter[]
  reason: string
  icon: React.ComponentType<any>
  color: string
}

interface LearningGoal {
  id: string
  title: string
  description: string
  target: number
  current: number
  deadline?: Date
  type: 'accuracy' | 'speed' | 'mastery' | 'streak'
  icon: React.ComponentType<any>
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  characters,
  className = ''
}) => {
  const { characterProgress, userStats } = useProgressStore()

  // Generate personalized recommendations based on user data
  const recommendations = useMemo((): Recommendation[] => {
    const recs: Recommendation[] = []

    // Analyze character performance
    const weakCharacters = characters.filter(char => {
      const progress = characterProgress[char.id]
      if (!progress) return true
      const accuracy = progress.totalAttempts > 0 
        ? (progress.correctAttempts / progress.totalAttempts) * 100 
        : 0
      return accuracy < 60
    })

    const strongCharacters = characters.filter(char => {
      const progress = characterProgress[char.id]
      if (!progress) return false
      const accuracy = progress.totalAttempts > 0 
        ? (progress.correctAttempts / progress.totalAttempts) * 100 
        : 0
      return accuracy >= 80
    })

    const needsReview = characters.filter(char => {
      const progress = characterProgress[char.id]
      if (!progress) return true
      const daysSinceLastPractice = Math.floor(
        (Date.now() - progress.lastPracticed.getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysSinceLastPractice > 7
    })

    // Generate recommendations based on analysis

    // 1. Practice weak characters
    if (weakCharacters.length > 0) {
      recs.push({
        id: 'practice-weak',
        type: 'practice',
        priority: 'high',
        title: 'Practice Weak Characters',
        description: `Focus on ${weakCharacters.slice(0, 3).map(c => c.id).join(', ')} and improve your accuracy`,
        estimatedTime: 15,
        difficulty: 'medium',
        characters: weakCharacters.slice(0, 5),
        reason: 'Low accuracy on these characters',
        icon: PencilIcon,
        color: 'bg-red-500'
      })
    }

    // 2. Review characters that need attention
    if (needsReview.length > 0) {
      recs.push({
        id: 'review-needed',
        type: 'review',
        priority: 'high',
        title: 'Review Characters',
        description: `Refresh your memory on ${needsReview.slice(0, 3).map(c => c.id).join(', ')}`,
        estimatedTime: 10,
        difficulty: 'easy',
        characters: needsReview.slice(0, 5),
        reason: 'Haven\'t practiced recently',
        icon: ClockIcon,
        color: 'bg-yellow-500'
      })
    }

    // 3. Challenge with strong characters
    if (strongCharacters.length >= 3) {
      recs.push({
        id: 'challenge-strong',
        type: 'challenge',
        priority: 'medium',
        title: 'Speed Challenge',
        description: `Test your speed with ${strongCharacters.slice(0, 3).map(c => c.id).join(', ')}`,
        estimatedTime: 20,
        difficulty: 'hard',
        characters: strongCharacters.slice(0, 5),
        reason: 'You\'re strong with these characters',
        icon: FireIcon,
        color: 'bg-purple-500'
      })
    }

    // 4. Pronunciation practice
    const pronunciationNeeded = characters.filter(char => {
      const progress = characterProgress[char.id]
      if (!progress) return true
      // Check if pronunciation accuracy is low (simplified)
      return Math.random() < 0.3 // Placeholder logic
    })

    if (pronunciationNeeded.length > 0) {
      recs.push({
        id: 'pronunciation-practice',
        type: 'practice',
        priority: 'medium',
        title: 'Pronunciation Practice',
        description: `Improve pronunciation of ${pronunciationNeeded.slice(0, 3).map(c => c.id).join(', ')}`,
        estimatedTime: 12,
        difficulty: 'medium',
        characters: pronunciationNeeded.slice(0, 5),
        reason: 'Pronunciation needs improvement',
        icon: SpeakerWaveIcon,
        color: 'bg-blue-500'
      })
    }

    // 5. Comprehensive quiz
    if (characters.length >= 10) {
      recs.push({
        id: 'comprehensive-quiz',
        type: 'quiz',
        priority: 'low',
        title: 'Comprehensive Assessment',
        description: 'Take a full assessment to test all your knowledge',
        estimatedTime: 30,
        difficulty: 'hard',
        characters: characters.slice(0, 10),
        reason: 'Ready for comprehensive testing',
        icon: ChartBarIcon,
        color: 'bg-green-500'
      })
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }, [characters, characterProgress])

  // Generate learning goals
  const learningGoals = useMemo((): LearningGoal[] => {
    const totalCharacters = characters.length
    const masteredCharacters = Object.values(characterProgress).filter(
      progress => progress.totalAttempts > 0 && 
      (progress.correctAttempts / progress.totalAttempts) >= 0.8
    ).length

    return [
      {
        id: 'mastery-goal',
        title: 'Character Mastery',
        description: 'Master 80% of all characters',
        target: Math.ceil(totalCharacters * 0.8),
        current: masteredCharacters,
        type: 'mastery',
        icon: StarIcon
      },
      {
        id: 'accuracy-goal',
        title: 'Accuracy Improvement',
        description: 'Achieve 90% average accuracy',
        target: 90,
        current: Math.round(userStats.averageQuizScore),
        type: 'accuracy',
        icon: TagIcon
      },
      {
        id: 'streak-goal',
        title: 'Learning Streak',
        description: 'Maintain a 7-day learning streak',
        target: 7,
        current: userStats.learningStreak.currentStreak,
        type: 'streak',
        icon: FireIcon
      },
      {
        id: 'speed-goal',
        title: 'Speed Challenge',
        description: 'Complete quizzes in under 2 minutes',
        target: 120, // seconds
        current: Math.round(userStats.averageQuizScore * 2), // Placeholder
        type: 'speed',
        icon: ClockIcon
      }
    ]
  }, [characters, characterProgress, userStats])

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-green-500 bg-green-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const getDifficultyColor = (difficulty: Recommendation['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'hard': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personalized Learning Recommendations
        </h2>
        <p className="text-gray-600 mb-4">
          AI-powered suggestions tailored to your learning progress
        </p>
      </div>

      {/* Learning Goals */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TagIcon className="h-5 w-5 mr-2 text-blue-600" />
          Your Learning Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <goal.icon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                {goal.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {goal.description}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-600" />
          Recommended Activities
        </h3>

        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-2 rounded-lg p-4 ${getPriorityColor(rec.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${rec.color} flex items-center justify-center`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {rec.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      {rec.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{rec.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={getDifficultyColor(rec.difficulty)}>
                          {rec.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{rec.characters.length} characters</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        <strong>Why:</strong> {rec.reason}
                      </p>
                    </div>
                  </div>
                </div>
                
                <button className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <span>Start</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
              
              {/* Character Preview */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Characters:</span>
                  <div className="flex space-x-1">
                    {rec.characters.slice(0, 5).map((char) => (
                      <span
                        key={char.id}
                        className="text-lg font-bold thai-font bg-white px-2 py-1 rounded border"
                      >
                        {char.id}
                      </span>
                    ))}
                    {rec.characters.length > 5 && (
                      <span className="text-sm text-gray-500">
                        +{rec.characters.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <LightBulbIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recommendations available
          </h3>
          <p className="text-gray-600">
            Start practicing to get personalized learning recommendations.
          </p>
        </div>
      )}

      {/* Learning Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-gray-600" />
          Learning Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(userStats.averageQuizScore)}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {userStats.learningStreak.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {userStats.totalLessonsCompleted}
            </div>
            <div className="text-sm text-gray-600">Lessons Completed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalizedRecommendations
