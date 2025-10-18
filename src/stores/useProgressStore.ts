import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LessonProgress } from '../utils/lessons'

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
  
  // Character Progress
  characterProgress: Record<string, CharacterProgress>
  
  // Quiz Sessions
  quizSessions: QuizSession[]
  
  // User Stats
  userStats: UserStats
  
  // Actions
  updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => void
  completeLesson: (lessonId: string, score: number, timeSpent: number) => void
  updateCharacterProgress: (characterId: string, isCorrect: boolean, responseTime: number) => void
  addQuizSession: (session: QuizSession) => void
  updateLearningStreak: () => void
  resetProgress: () => void
  getCharacterMasteryLevel: (characterId: string) => CharacterProgress['masteryLevel']
  getWeakCharacters: () => string[]
  getStrongCharacters: () => string[]
  getOverallProgress: () => number
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

      completeLesson: (lessonId: string, score: number, timeSpent: number) => {
        set(state => {
          const isAlreadyCompleted = state.completedLessonIds.includes(lessonId)
          
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...state.lessonProgress[lessonId],
                lessonId,
                isCompleted: true,
                completionDate: new Date(),
                score,
                timeSpent,
                bestScore: Math.max(state.lessonProgress[lessonId]?.bestScore || 0, score),
                attempts: (state.lessonProgress[lessonId]?.attempts || 0) + 1
              }
            },
            completedLessonIds: isAlreadyCompleted 
              ? state.completedLessonIds 
              : [...state.completedLessonIds, lessonId],
            userStats: {
              ...state.userStats,
              totalLessonsCompleted: isAlreadyCompleted 
                ? state.userStats.totalLessonsCompleted 
                : state.userStats.totalLessonsCompleted + 1,
              totalTimeSpent: state.userStats.totalTimeSpent + timeSpent
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
