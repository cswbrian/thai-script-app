import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ShareIcon,
  TrophyIcon,
  StarIcon,
  FireIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  GiftIcon,
  SparklesIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { useProgressStore } from '../../stores/useProgressStore'
import type { ThaiCharacter } from '../../utils/characters'

interface ProgressSharingProps {
  characters: ThaiCharacter[]
  className?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
  progress: number
  maxProgress: number
  category: 'learning' | 'streak' | 'mastery' | 'speed' | 'social'
}

interface ShareableProgress {
  totalCharacters: number
  masteredCharacters: number
  learningStreak: number
  averageScore: number
  totalStudyTime: number
  achievements: Achievement[]
  recentActivity: string[]
}

const ProgressSharing: React.FC<ProgressSharingProps> = ({
  characters,
  className = ''
}) => {
  const { userStats, characterProgress } = useProgressStore()

  // Generate achievements based on user progress
  const achievements = useMemo((): Achievement[] => {
    const ach: Achievement[] = []

    // Learning achievements
    ach.push({
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
      rarity: 'common',
      unlockedAt: userStats.totalLessonsCompleted > 0 ? new Date() : undefined,
      progress: Math.min(userStats.totalLessonsCompleted, 1),
      maxProgress: 1,
      category: 'learning'
    })

    ach.push({
      id: 'lesson-master',
      title: 'Lesson Master',
      description: 'Complete 10 lessons',
      icon: StarIcon,
      color: 'bg-purple-500',
      rarity: 'rare',
      unlockedAt: userStats.totalLessonsCompleted >= 10 ? new Date() : undefined,
      progress: Math.min(userStats.totalLessonsCompleted, 10),
      maxProgress: 10,
      category: 'learning'
    })

    ach.push({
      id: 'quiz-champion',
      title: 'Quiz Champion',
      description: 'Score 90% or higher on a quiz',
      icon: TrophyIcon,
      color: 'bg-yellow-500',
      rarity: 'rare',
      unlockedAt: userStats.averageQuizScore >= 90 ? new Date() : undefined,
      progress: Math.min(userStats.averageQuizScore, 90),
      maxProgress: 90,
      category: 'mastery'
    })

    // Streak achievements
    ach.push({
      id: 'streak-starter',
      title: 'Streak Starter',
      description: 'Maintain a 3-day learning streak',
      icon: FireIcon,
      color: 'bg-orange-500',
      rarity: 'common',
      unlockedAt: userStats.learningStreak.currentStreak >= 3 ? new Date() : undefined,
      progress: Math.min(userStats.learningStreak.currentStreak, 3),
      maxProgress: 3,
      category: 'streak'
    })

    ach.push({
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: SparklesIcon,
      color: 'bg-red-500',
      rarity: 'epic',
      unlockedAt: userStats.learningStreak.currentStreak >= 7 ? new Date() : undefined,
      progress: Math.min(userStats.learningStreak.currentStreak, 7),
      maxProgress: 7,
      category: 'streak'
    })

    // Mastery achievements
    const masteredCount = Object.values(characterProgress).filter(
      progress => progress.totalAttempts > 0 && 
      (progress.correctAttempts / progress.totalAttempts) >= 0.8
    ).length

    ach.push({
      id: 'character-master',
      title: 'Character Master',
      description: 'Master 5 characters',
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      rarity: 'rare',
      unlockedAt: masteredCount >= 5 ? new Date() : undefined,
      progress: Math.min(masteredCount, 5),
      maxProgress: 5,
      category: 'mastery'
    })

    ach.push({
      id: 'thai-expert',
      title: 'Thai Script Expert',
      description: 'Master 20 characters',
      icon: GiftIcon,
      color: 'bg-indigo-500',
      rarity: 'legendary',
      unlockedAt: masteredCount >= 20 ? new Date() : undefined,
      progress: Math.min(masteredCount, 20),
      maxProgress: 20,
      category: 'mastery'
    })

    // Speed achievements
    ach.push({
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete a quiz in under 2 minutes',
      icon: ClockIcon,
      color: 'bg-pink-500',
      rarity: 'epic',
      unlockedAt: Math.random() > 0.5 ? new Date() : undefined, // Placeholder
      progress: Math.random() > 0.5 ? 1 : 0,
      maxProgress: 1,
      category: 'speed'
    })

    // Social achievements
    ach.push({
      id: 'sharing-champion',
      title: 'Sharing Champion',
      description: 'Share your progress 5 times',
      icon: ShareIcon,
      color: 'bg-teal-500',
      rarity: 'rare',
      unlockedAt: undefined, // Not implemented yet
      progress: 0,
      maxProgress: 5,
      category: 'social'
    })

    return ach.sort((a, b) => {
      // Sort by unlocked status, then by rarity
      if (a.unlockedAt && !b.unlockedAt) return -1
      if (!a.unlockedAt && b.unlockedAt) return 1
      
      const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 }
      return rarityOrder[b.rarity] - rarityOrder[a.rarity]
    })
  }, [userStats, characterProgress])

  // Generate shareable progress data
  const shareableProgress = useMemo((): ShareableProgress => {
    const masteredCount = Object.values(characterProgress).filter(
      progress => progress.totalAttempts > 0 && 
      (progress.correctAttempts / progress.totalAttempts) >= 0.8
    ).length

    const recentActivity = [
      `Mastered ${masteredCount} characters`,
      `Maintained ${userStats.learningStreak.currentStreak} day streak`,
      `Completed ${userStats.totalLessonsCompleted} lessons`,
      `Achieved ${Math.round(userStats.averageQuizScore)}% average score`
    ]

    return {
      totalCharacters: characters.length,
      masteredCharacters: masteredCount,
      learningStreak: userStats.learningStreak.currentStreak,
      averageScore: Math.round(userStats.averageQuizScore),
      totalStudyTime: Math.round(userStats.totalTimeSpent),
      achievements: achievements.filter(a => a.unlockedAt),
      recentActivity
    }
  }, [characters, characterProgress, userStats, achievements])

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50'
      case 'rare': return 'border-blue-400 bg-blue-50'
      case 'epic': return 'border-purple-400 bg-purple-50'
      case 'legendary': return 'border-yellow-400 bg-yellow-50'
      default: return 'border-gray-400 bg-gray-50'
    }
  }

  const getRarityTextColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600'
      case 'rare': return 'text-blue-600'
      case 'epic': return 'text-purple-600'
      case 'legendary': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const handleShare = async (type: 'summary' | 'achievements' | 'detailed') => {
    const shareData = {
      title: 'My Thai Script Learning Progress',
      text: generateShareText(type),
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.text)
      alert('Progress copied to clipboard!')
    }
  }

  const generateShareText = (type: 'summary' | 'achievements' | 'detailed') => {
    const { masteredCharacters, learningStreak, averageScore, totalStudyTime, achievements } = shareableProgress

    switch (type) {
      case 'summary':
        return `🎉 I'm learning Thai script! Mastered ${masteredCharacters} characters with a ${learningStreak}-day streak and ${averageScore}% average score. Join me on this journey! #ThaiScript #Learning`
      
      case 'achievements':
        const unlockedAchievements = achievements.filter(a => a.unlockedAt)
        return `🏆 Thai Script Achievements Unlocked! ${unlockedAchievements.length} achievements earned including ${unlockedAchievements.slice(0, 3).map(a => a.title).join(', ')}. Keep learning! #Achievements #ThaiScript`
      
      case 'detailed':
        return `📊 Detailed Thai Script Progress:
• ${masteredCharacters}/${characters.length} characters mastered
• ${learningStreak} day learning streak
• ${averageScore}% average quiz score
• ${totalStudyTime} minutes total study time
• ${achievements.filter(a => a.unlockedAt).length} achievements unlocked

Keep up the great work! #ThaiScript #Learning #Progress`
      
      default:
        return 'Learning Thai script!'
    }
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt)
  const lockedAchievements = achievements.filter(a => !a.unlockedAt)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Progress Sharing & Achievements
        </h2>
        <p className="text-gray-600 mb-4">
          Share your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Share Options */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ShareIcon className="h-5 w-5 mr-2 text-blue-600" />
          Share Your Progress
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleShare('summary')}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ChartBarIcon className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Quick Summary</h4>
            </div>
            <p className="text-sm text-gray-600">
              Share a brief overview of your progress
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleShare('achievements')}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrophyIcon className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Achievements</h4>
            </div>
            <p className="text-sm text-gray-600">
              Highlight your unlocked achievements
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleShare('detailed')}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-colors text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <StarIcon className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Detailed Report</h4>
            </div>
            <p className="text-sm text-gray-600">
              Share comprehensive progress details
            </p>
          </motion.button>
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-4 text-center"
        >
          <TrophyIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            {unlockedAchievements.length}
          </div>
          <div className="text-sm text-gray-600">Achievements</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 rounded-lg p-4 text-center"
        >
          <StarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {shareableProgress.masteredCharacters}
          </div>
          <div className="text-sm text-gray-600">Characters Mastered</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-50 rounded-lg p-4 text-center"
        >
          <FireIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">
            {shareableProgress.learningStreak}
          </div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-50 rounded-lg p-4 text-center"
        >
          <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">
            {shareableProgress.averageScore}%
          </div>
          <div className="text-sm text-gray-600">Average Score</div>
        </motion.div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
          Achievements
        </h3>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-1 text-green-600" />
              Unlocked ({unlockedAchievements.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement, index) => {
                const IconComponent = achievement.icon
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-2 rounded-lg p-4 ${getRarityColor(achievement.rarity)}`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${achievement.color} flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          {achievement.title}
                        </h5>
                        <span className={`text-xs font-medium ${getRarityTextColor(achievement.rarity)}`}>
                          {achievement.rarity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-gray-500">
                        Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1 text-gray-600" />
              In Progress ({lockedAchievements.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedAchievements.map((achievement, index) => {
                const IconComponent = achievement.icon
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gray-400 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700">
                          {achievement.title}
                        </h5>
                        <span className="text-xs font-medium text-gray-500">
                          {achievement.rarity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {achievement.description}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {achievement.progress}/{achievement.maxProgress}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Social Features Preview */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <HeartIcon className="h-5 w-5 mr-2 text-pink-600" />
          Coming Soon: Social Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShareIcon className="h-6 w-6 text-pink-600" />
            </div>
            <h4 className="font-medium text-gray-900">Progress Sharing</h4>
            <p className="text-sm text-gray-600">Share achievements with friends</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrophyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900">Leaderboards</h4>
            <p className="text-sm text-gray-600">Compete with other learners</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <LightBulbIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900">Study Groups</h4>
            <p className="text-sm text-gray-600">Learn together with friends</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressSharing
