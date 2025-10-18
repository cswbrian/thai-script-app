import React from 'react'
import { 
  ChartBarIcon, 
  AcademicCapIcon, 
  StarIcon,
  FireIcon,
  TrophyIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { FireIcon as FireIconSolid } from '@heroicons/react/24/solid'
import { useProgressStore } from '../../stores/useProgressStore'
import type { LessonWithCharacters } from '../../utils/lessons'

interface ProgressDashboardProps {
  lessons: LessonWithCharacters[]
  className?: string
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  lessons,
  className = ''
}) => {
  const {
    userStats,
    completedLessonIds,
    characterProgress,
    quizSessions,
    getWeakCharacters,
    getStrongCharacters,
    getOverallProgress
  } = useProgressStore()

  const weakCharacters = getWeakCharacters()
  const strongCharacters = getStrongCharacters()
  const overallProgress = getOverallProgress()

  // Calculate additional stats
  const totalCharacters = Object.keys(characterProgress).length
  const charactersMastered = strongCharacters.length
  const charactersNeedingWork = weakCharacters.length

  // Recent quiz performance
  const recentSessions = quizSessions.slice(-5)
  const recentAverageScore = recentSessions.length > 0 
    ? Math.round(recentSessions.reduce((sum, session) => sum + session.score, 0) / recentSessions.length)
    : 0

  // Learning streak status
  const streakStatus = userStats.learningStreak.currentStreak > 0 ? 'active' : 'inactive'

  // Progress by category
  const progressByCategory = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = { completed: 0, total: 0 }
    }
    acc[lesson.category].total += 1
    if (completedLessonIds.includes(lesson.id)) {
      acc[lesson.category].completed += 1
    }
    return acc
  }, {} as Record<string, { completed: number; total: number }>)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Learning Progress
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Track your Thai script learning journey and celebrate your achievements
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Overall Progress */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <ChartBarIcon className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
            {overallProgress}%
          </div>
          <div className="text-sm text-blue-700 font-medium">Overall Progress</div>
        </div>

        {/* Learning Streak */}
        <div className={`rounded-xl p-4 sm:p-6 text-center ${
          streakStatus === 'active' 
            ? 'bg-gradient-to-br from-orange-50 to-orange-100' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
            streakStatus === 'active' ? 'bg-orange-500' : 'bg-gray-400'
          }`}>
            {streakStatus === 'active' ? (
              <FireIconSolid className="h-6 w-6 text-white" />
            ) : (
              <FireIcon className="h-6 w-6 text-white" />
            )}
          </div>
          <div className={`text-2xl sm:text-3xl font-bold mb-1 ${
            streakStatus === 'active' ? 'text-orange-600' : 'text-gray-600'
          }`}>
            {userStats.learningStreak.currentStreak}
          </div>
          <div className={`text-sm font-medium ${
            streakStatus === 'active' ? 'text-orange-700' : 'text-gray-700'
          }`}>
            Day Streak
          </div>
        </div>

        {/* Characters Mastered */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrophyIcon className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
            {charactersMastered}
          </div>
          <div className="text-sm text-green-700 font-medium">Characters Mastered</div>
        </div>

        {/* Lessons Completed */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
            {userStats.totalLessonsCompleted}
          </div>
          <div className="text-sm text-purple-700 font-medium">Lessons Completed</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
            Quiz Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Overall Average</span>
              <span className="text-lg font-semibold text-gray-900">
                {userStats.averageQuizScore}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Recent Average</span>
              <span className="text-lg font-semibold text-gray-900">
                {recentAverageScore}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Quizzes</span>
              <span className="text-lg font-semibold text-gray-900">
                {userStats.totalQuizSessions}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Time Spent</span>
              <span className="text-lg font-semibold text-gray-900">
                {Math.round(userStats.totalTimeSpent)} min
              </span>
            </div>
          </div>
        </div>

        {/* Character Mastery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrophyIcon className="h-5 w-5 text-green-500 mr-2" />
            Character Mastery
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Characters</span>
              <span className="text-lg font-semibold text-gray-900">
                {totalCharacters}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mastered</span>
              <span className="text-lg font-semibold text-green-600">
                {charactersMastered}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Needing Work</span>
              <span className="text-lg font-semibold text-orange-600">
                {charactersNeedingWork}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalCharacters > 0 ? (charactersMastered / totalCharacters) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress by Category */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
          Progress by Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(progressByCategory).map(([category, progress]) => {
            const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {percentage}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Learning Streak Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
          Learning Streak
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {userStats.learningStreak.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {userStats.learningStreak.longestStreak}
            </div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {userStats.learningStreak.streakFreezeUsed ? 'Used' : 'Available'}
            </div>
            <div className="text-sm text-gray-600">Streak Freeze</div>
          </div>
        </div>
      </div>

      {/* Weak Areas */}
      {weakCharacters.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-2" />
            Characters Needing Practice
          </h3>
          <div className="flex flex-wrap gap-2">
            {weakCharacters.slice(0, 10).map((characterId) => (
              <span 
                key={characterId}
                className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full"
              >
                {characterId}
              </span>
            ))}
            {weakCharacters.length > 10 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                +{weakCharacters.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressDashboard
