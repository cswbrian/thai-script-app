import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  StarIcon,
  TrophyIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { useProgressStore } from '../../stores/useProgressStore'
import type { ThaiCharacter } from '../../utils/characters'

interface LearningAnalyticsProps {
  characters: ThaiCharacter[]
  className?: string
}

interface AnalyticsData {
  totalStudyTime: number
  averageSessionLength: number
  totalLessonsCompleted: number
  totalQuizSessions: number
  averageQuizScore: number
  charactersMastered: number
  learningStreak: number
  longestStreak: number
  weeklyProgress: Array<{
    date: string
    lessonsCompleted: number
    quizSessions: number
    studyTime: number
  }>
  characterPerformance: Array<{
    characterId: string
    characterName: string
    masteryLevel: string
    accuracy: number
    attempts: number
    lastPracticed: Date
  }>
  learningPatterns: {
    peakStudyHours: number[]
    preferredQuestionTypes: string[]
    improvementAreas: string[]
    strengths: string[]
  }
}

const LearningAnalytics: React.FC<LearningAnalyticsProps> = ({
  characters,
  className = ''
}) => {
  const { 
    userStats, 
    characterProgress, 
    quizSessions, 
    lessonCompletions 
  } = useProgressStore()

  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week')
  const [isLoading, setIsLoading] = useState(true)

  // Calculate comprehensive analytics data
  const analyticsData = useMemo((): AnalyticsData => {
    const now = new Date()
    // Calculate date ranges for filtering (for future use)
    // const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    // const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Filter data based on selected timeframe (for future use)
    // const filterDate = selectedTimeframe === 'week' ? weekAgo : 
    //                   selectedTimeframe === 'month' ? monthAgo : 
    //                   new Date(0)

    // Calculate weekly progress
    const weeklyProgress = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      
      const daySessions = quizSessions.filter(session => {
        const sessionDate = new Date(session.completedAt)
        return sessionDate.toDateString() === date.toDateString()
      })

      const dayLessons = Object.values(lessonCompletions).filter(lesson => {
        const lessonDate = new Date(lesson.completedAt)
        return lessonDate.toDateString() === date.toDateString()
      })

      weeklyProgress.push({
        date: dateStr,
        lessonsCompleted: dayLessons.length,
        quizSessions: daySessions.length,
        studyTime: daySessions.reduce((sum, session) => sum + session.timeSpent, 0)
      })
    }

    // Calculate character performance
    const characterPerformance = Object.entries(characterProgress).map(([characterId, progress]) => {
      const character = characters.find(c => c.id === characterId)
      return {
        characterId,
        characterName: character?.name || 'Unknown',
        masteryLevel: progress.masteryLevel,
        accuracy: progress.totalAttempts > 0 ? (progress.correctAttempts / progress.totalAttempts) * 100 : 0,
        attempts: progress.totalAttempts,
        lastPracticed: progress.lastPracticed
      }
    }).sort((a, b) => b.accuracy - a.accuracy)

    // Analyze learning patterns
    const peakStudyHours = quizSessions.reduce((hours, session) => {
      const hour = new Date(session.completedAt).getHours()
      hours[hour] = (hours[hour] || 0) + 1
      return hours
    }, {} as Record<number, number>)

    const preferredQuestionTypes = quizSessions.reduce((types, session) => {
      types[session.questionType] = (types[session.questionType] || 0) + 1
      return types
    }, {} as Record<string, number>)

    const improvementAreas = characterPerformance
      .filter(char => char.accuracy < 70)
      .map(char => char.characterName)

    const strengths = characterPerformance
      .filter(char => char.accuracy >= 90)
      .map(char => char.characterName)

    return {
      totalStudyTime: userStats.totalTimeSpent,
      averageSessionLength: quizSessions.length > 0 
        ? quizSessions.reduce((sum, session) => sum + session.timeSpent, 0) / quizSessions.length 
        : 0,
      totalLessonsCompleted: userStats.totalLessonsCompleted,
      totalQuizSessions: userStats.totalQuizSessions,
      averageQuizScore: userStats.averageQuizScore,
      charactersMastered: userStats.charactersMastered,
      learningStreak: userStats.learningStreak.currentStreak,
      longestStreak: userStats.learningStreak.longestStreak,
      weeklyProgress,
      characterPerformance,
      learningPatterns: {
        peakStudyHours: Object.entries(peakStudyHours)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([hour]) => parseInt(hour)),
        preferredQuestionTypes: Object.entries(preferredQuestionTypes)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([type]) => type),
        improvementAreas,
        strengths
      }
    }
  }, [userStats, characterProgress, quizSessions, lessonCompletions, characters, selectedTimeframe])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [selectedTimeframe])

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Analyzing your learning data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Learning Analytics
        </h2>
        <p className="text-gray-600 mb-4">
          Insights into your Thai script learning journey
        </p>
        
        {/* Timeframe Selector */}
        <div className="flex justify-center space-x-2">
          {(['week', 'month', 'all'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {timeframe === 'week' ? 'Last 7 Days' : 
               timeframe === 'month' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-4 text-center"
        >
          <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(analyticsData.totalStudyTime)}m
          </div>
          <div className="text-sm text-gray-600">Study Time</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 rounded-lg p-4 text-center"
        >
          <AcademicCapIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {analyticsData.totalLessonsCompleted}
          </div>
          <div className="text-sm text-gray-600">Lessons</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-50 rounded-lg p-4 text-center"
        >
          <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(analyticsData.averageQuizScore)}%
          </div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-orange-50 rounded-lg p-4 text-center"
        >
          <FireIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">
            {analyticsData.learningStreak}
          </div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </motion.div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-600" />
          Weekly Progress
        </h3>
        <div className="space-y-3">
          {analyticsData.weeklyProgress.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="text-sm font-medium text-gray-700">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{day.lessonsCompleted} lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{day.quizSessions} quizzes</span>
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(day.studyTime / 60)}m
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Character Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <StarIcon className="h-5 w-5 mr-2 text-gray-600" />
          Character Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Performers */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-green-600" />
              Strong Areas
            </h4>
            <div className="space-y-2">
              {analyticsData.characterPerformance.slice(0, 5).map((char) => (
                <div key={char.characterId} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold thai-font">{char.characterId}</span>
                    <span className="text-sm text-gray-700">{char.characterName}</span>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {Math.round(char.accuracy)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Areas */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <ArrowTrendingDownIcon className="h-4 w-4 mr-1 text-red-600" />
              Areas for Improvement
            </h4>
            <div className="space-y-2">
              {analyticsData.characterPerformance.slice(-5).reverse().map((char) => (
                <div key={char.characterId} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold thai-font">{char.characterId}</span>
                    <span className="text-sm text-gray-700">{char.characterName}</span>
                  </div>
                  <div className="text-sm font-medium text-red-600">
                    {Math.round(char.accuracy)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Patterns */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-gray-600" />
          Learning Patterns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Peak Study Hours</h4>
            <div className="space-y-1">
              {analyticsData.learningPatterns.peakStudyHours.map((hour) => (
                <div key={hour} className="text-sm text-gray-600">
                  {hour}:00 - {hour + 1}:00
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Preferred Question Types</h4>
            <div className="space-y-1">
              {analyticsData.learningPatterns.preferredQuestionTypes.map((type) => (
                <div key={type} className="text-sm text-gray-600 capitalize">
                  {type.replace('-', ' ')}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Learning Insights</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>• {analyticsData.charactersMastered} characters mastered</div>
              <div>• Longest streak: {analyticsData.longestStreak} days</div>
              <div>• Avg session: {Math.round(analyticsData.averageSessionLength / 60)}m</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
          Achievement Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData.totalQuizSessions}
            </div>
            <div className="text-sm text-gray-600">Quizzes Taken</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analyticsData.charactersMastered}
            </div>
            <div className="text-sm text-gray-600">Characters Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData.longestStreak}
            </div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(analyticsData.averageQuizScore)}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningAnalytics
