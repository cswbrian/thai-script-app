import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LessonProgress } from '../utils/lessons'

export interface LessonCompletion {
  lessonId: string
  completedAt: Date
  score: number
  timeSpent: number // in seconds
  attempts: number
  charactersLearned: string[]
  quizSessions: string[] // Array of quiz session IDs
  writingPracticeSessions: string[] // Array of writing practice session IDs
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  nextReviewDate?: Date
  isLocked: boolean
  prerequisitesMet: boolean
}

export interface CharacterProgress {
  characterId: string
  masteryLevel: 'learning' | 'practicing' | 'mastered'
  correctAttempts: number
  totalAttempts: number
  lastPracticed: Date
  streak: number
  averageResponseTime: number
  weakAreas: string[]
}

export interface QuizSession {
  id: string
  lessonId?: string
  characterIds: string[]
  questionType: 'recognition' | 'pronunciation' | 'writing' | 'mixed'
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number // in seconds
  completedAt: Date
  results: Array<{
    questionId: string
    userAnswer: string
    isCorrect: boolean
    timeSpent: number
  }>
}

export interface LearningStreak {
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date
  streakFreezeUsed: boolean
}

export interface UserStats {
  totalLessonsCompleted: number
  totalQuizSessions: number
  totalTimeSpent: number // in minutes
  averageQuizScore: number
  charactersMastered: number
  totalCharacters: number
  learningStreak: LearningStreak
  favoriteCharacterType: string
  weakestCharacterType: string
}

interface ProgressStore {
  // Lesson Progress
  lessonProgress: Record<string, LessonProgress>
  completedLessonIds: string[]
  lessonCompletions: Record<string, LessonCompletion>
  
  // Character Progress
  characterProgress: Record<string, CharacterProgress>
  
  // Quiz Sessions
  quizSessions: QuizSession[]
  
  // User Stats
  userStats: UserStats
  
  // Actions
  updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => void
  completeLesson: (lessonId: string, score: number, timeSpent: number, charactersLearned: string[]) => void
  updateCharacterProgress: (characterId: string, isCorrect: boolean, responseTime: number) => void
  addQuizSession: (session: QuizSession) => void
  updateLearningStreak: () => void
  resetProgress: () => void
  getCharacterMasteryLevel: (characterId: string) => CharacterProgress['masteryLevel']
  getWeakCharacters: () => string[]
  getStrongCharacters: () => string[]
  getOverallProgress: () => number
  
  // Enhanced Lesson Completion Actions
  startLessonAttempt: (lessonId: string) => void
  recordLessonActivity: (lessonId: string, activityType: 'quiz' | 'writing' | 'review', sessionId: string) => void
  checkLessonPrerequisites: (lessonId: string) => boolean
  unlockLesson: (lessonId: string) => void
  getLessonCompletionStatus: (lessonId: string) => LessonCompletion | null
  getNextRecommendedLesson: () => string | null
}

const initialUserStats: UserStats = {
  totalLessonsCompleted: 0,
  totalQuizSessions: 0,
  totalTimeSpent: 0,
  averageQuizScore: 0,
  charactersMastered: 0,
  totalCharacters: 0,
  learningStreak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: new Date(),
    streakFreezeUsed: false
  },
  favoriteCharacterType: '',
  weakestCharacterType: ''
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      // Initial State
      lessonProgress: {},
      completedLessonIds: [],
      lessonCompletions: {},
      characterProgress: {},
      quizSessions: [],
      userStats: initialUserStats,

      // Actions
      updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => {
        set(state => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              ...state.lessonProgress[lessonId],
              ...progress,
              lessonId
            }
          }
        }))
      },

      completeLesson: (lessonId: string, score: number, timeSpent: number, charactersLearned: string[]) => {
        set(state => {
          const isAlreadyCompleted = state.completedLessonIds.includes(lessonId)
          const now = new Date()
          
          // Create lesson completion record
          const lessonCompletion: LessonCompletion = {
            lessonId,
            completedAt: now,
            score,
            timeSpent,
            attempts: state.lessonCompletions[lessonId]?.attempts ? state.lessonCompletions[lessonId].attempts + 1 : 1,
            charactersLearned,
            quizSessions: [],
            writingPracticeSessions: [],
            masteryLevel: score >= 90 ? 'expert' : score >= 75 ? 'advanced' : score >= 60 ? 'intermediate' : 'beginner',
            nextReviewDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            isLocked: false,
            prerequisitesMet: true
          }
          
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...state.lessonProgress[lessonId],
                lessonId,
                isCompleted: true,
                completionDate: now,
                score,
                timeSpent,
                bestScore: Math.max(state.lessonProgress[lessonId]?.bestScore || 0, score),
                attempts: (state.lessonProgress[lessonId]?.attempts || 0) + 1
              }
            },
            lessonCompletions: {
              ...state.lessonCompletions,
              [lessonId]: lessonCompletion
            },
            completedLessonIds: isAlreadyCompleted 
              ? state.completedLessonIds 
              : [...state.completedLessonIds, lessonId],
            userStats: {
              ...state.userStats,
              totalLessonsCompleted: isAlreadyCompleted 
                ? state.userStats.totalLessonsCompleted 
                : state.userStats.totalLessonsCompleted + 1,
              totalTimeSpent: state.userStats.totalTimeSpent + Math.round(timeSpent / 60), // Convert to minutes
              charactersMastered: Math.max(state.userStats.charactersMastered, charactersLearned.length)
            }
          }
        })
        
        // Update learning streak
        get().updateLearningStreak()
      },

      updateCharacterProgress: (characterId: string, isCorrect: boolean, responseTime: number) => {
        set(state => {
          const currentProgress = state.characterProgress[characterId] || {
            characterId,
            masteryLevel: 'learning' as const,
            correctAttempts: 0,
            totalAttempts: 0,
            lastPracticed: new Date(),
            streak: 0,
            averageResponseTime: 0,
            weakAreas: []
          }

          const newCorrectAttempts = isCorrect ? currentProgress.correctAttempts + 1 : currentProgress.correctAttempts
          const newTotalAttempts = currentProgress.totalAttempts + 1
          const newStreak = isCorrect ? currentProgress.streak + 1 : 0
          
          // Calculate mastery level
          let masteryLevel: CharacterProgress['masteryLevel'] = 'learning'
          if (newTotalAttempts >= 10 && newCorrectAttempts / newTotalAttempts >= 0.8) {
            masteryLevel = 'mastered'
          } else if (newTotalAttempts >= 5 && newCorrectAttempts / newTotalAttempts >= 0.6) {
            masteryLevel = 'practicing'
          }

          // Update average response time
          const newAverageResponseTime = 
            (currentProgress.averageResponseTime * currentProgress.totalAttempts + responseTime) / newTotalAttempts

          return {
            characterProgress: {
              ...state.characterProgress,
              [characterId]: {
                ...currentProgress,
                masteryLevel,
                correctAttempts: newCorrectAttempts,
                totalAttempts: newTotalAttempts,
                lastPracticed: new Date(),
                streak: newStreak,
                averageResponseTime: newAverageResponseTime
              }
            }
          }
        })
      },

      addQuizSession: (session: QuizSession) => {
        set(state => {
          const newSessions = [...state.quizSessions, session]
          const totalSessions = newSessions.length
          const totalScore = newSessions.reduce((sum, s) => sum + s.score, 0)
          const averageScore = totalScore / totalSessions

          return {
            quizSessions: newSessions,
            userStats: {
              ...state.userStats,
              totalQuizSessions: totalSessions,
              averageQuizScore: averageScore,
              totalTimeSpent: state.userStats.totalTimeSpent + (session.timeSpent / 60) // Convert to minutes
            }
          }
        })
      },

      updateLearningStreak: () => {
        set(state => {
          const today = new Date()
          const lastActivity = state.userStats.learningStreak.lastActivityDate
          const daysSinceLastActivity = Math.floor(
            (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
          )

          let newStreak = state.userStats.learningStreak.currentStreak

          if (daysSinceLastActivity === 0) {
            // Already updated today, no change
            return state
          } else if (daysSinceLastActivity === 1) {
            // Consecutive day, increment streak
            newStreak += 1
          } else {
            // Streak broken
            newStreak = 1
          }

          return {
            userStats: {
              ...state.userStats,
              learningStreak: {
                ...state.userStats.learningStreak,
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, state.userStats.learningStreak.longestStreak),
                lastActivityDate: today
              }
            }
          }
        })
      },

      resetProgress: () => {
        set({
          lessonProgress: {},
          completedLessonIds: [],
          characterProgress: {},
          quizSessions: [],
          userStats: initialUserStats
        })
      },

      getCharacterMasteryLevel: (characterId: string) => {
        const progress = get().characterProgress[characterId]
        return progress?.masteryLevel || 'learning'
      },

      getWeakCharacters: () => {
        const progress = get().characterProgress
        return Object.entries(progress)
          .filter(([_, charProgress]) => 
            charProgress.masteryLevel === 'learning' || 
            charProgress.correctAttempts / charProgress.totalAttempts < 0.6
          )
          .map(([characterId, _]) => characterId)
      },

      getStrongCharacters: () => {
        const progress = get().characterProgress
        return Object.entries(progress)
          .filter(([_, charProgress]) => charProgress.masteryLevel === 'mastered')
          .map(([characterId, _]) => characterId)
      },

      getOverallProgress: () => {
        const state = get()
        const totalCharacters = Object.keys(state.characterProgress).length
        if (totalCharacters === 0) return 0
        
        const masteredCharacters = Object.values(state.characterProgress)
          .filter(char => char.masteryLevel === 'mastered').length
        
        return Math.round((masteredCharacters / totalCharacters) * 100)
      },

      // Enhanced Lesson Completion Actions
      startLessonAttempt: (lessonId: string) => {
        set(state => ({
          lessonCompletions: {
            ...state.lessonCompletions,
            [lessonId]: {
              ...state.lessonCompletions[lessonId],
              lessonId,
              completedAt: new Date(),
              score: 0,
              timeSpent: 0,
              attempts: (state.lessonCompletions[lessonId]?.attempts || 0) + 1,
              charactersLearned: [],
              quizSessions: [],
              writingPracticeSessions: [],
              masteryLevel: 'beginner',
              isLocked: false,
              prerequisitesMet: true
            }
          }
        }))
      },

      recordLessonActivity: (lessonId: string, activityType: 'quiz' | 'writing' | 'review', sessionId: string) => {
        set(state => {
          const completion = state.lessonCompletions[lessonId]
          if (!completion) return state

          const updatedCompletion = { ...completion }
          if (activityType === 'quiz') {
            updatedCompletion.quizSessions = [...completion.quizSessions, sessionId]
          } else if (activityType === 'writing') {
            updatedCompletion.writingPracticeSessions = [...completion.writingPracticeSessions, sessionId]
          }

          return {
            lessonCompletions: {
              ...state.lessonCompletions,
              [lessonId]: updatedCompletion
            }
          }
        })
      },

      checkLessonPrerequisites: (_lessonId: string) => {
        // This would check against lesson prerequisites from lessons.json
        // For now, return true for all lessons
        return true
      },

      unlockLesson: (lessonId: string) => {
        set(state => ({
          lessonCompletions: {
            ...state.lessonCompletions,
            [lessonId]: {
              ...state.lessonCompletions[lessonId],
              lessonId,
              isLocked: false,
              prerequisitesMet: true
            }
          }
        }))
      },

      getLessonCompletionStatus: (lessonId: string) => {
        return get().lessonCompletions[lessonId] || null
      },

      getNextRecommendedLesson: () => {
        const state = get()
        const completedIds = state.completedLessonIds
        const allLessons = ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6', 'lesson-7', 'lesson-8', 'lesson-9', 'lesson-10']
        
        // Find the first incomplete lesson
        for (const lessonId of allLessons) {
          if (!completedIds.includes(lessonId)) {
            return lessonId
          }
        }
        
        return null // All lessons completed
      }
    }),
    {
      name: 'thai-script-progress',
      version: 1,
      migrate: (persistedState: any) => {
        // Handle migrations if needed
        return persistedState
      }
    }
  )
)
