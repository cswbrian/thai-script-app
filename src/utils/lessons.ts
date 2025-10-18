import lessonsData from './lessons.json'
import { getCharacterById } from '../utils/characters'
import type { ThaiCharacter } from '../utils/characters'

export interface Lesson {
  id: string
  title: string
  description: string
  learningObjectives: string[]
  characterIds: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  prerequisites: string[]
  order: number
  category: string
  tags: string[]
}

export interface LessonCategory {
  name: string
  description: string
  color: string
  icon: string
}

export interface DifficultyLevel {
  name: string
  description: string
  color: string
  minScore: number
  maxScore: number
}

export interface LessonWithCharacters extends Lesson {
  characters: ThaiCharacter[]
  completedCharacters: number
  totalCharacters: number
  progressPercentage: number
}

export interface LessonProgress {
  lessonId: string
  isCompleted: boolean
  completionDate?: Date
  score?: number
  attempts: number
  bestScore: number
  timeSpent: number // in minutes
  charactersMastered: string[]
  charactersNeedingReview: string[]
}

// Get all lessons
export const getAllLessons = (): Lesson[] => {
  return lessonsData.lessons as Lesson[]
}

// Get lesson by ID
export const getLessonById = (lessonId: string): Lesson | null => {
  const lessons = getAllLessons()
  return lessons.find(lesson => lesson.id === lessonId) || null
}

// Get lessons by category
export const getLessonsByCategory = (category: string): Lesson[] => {
  const lessons = getAllLessons()
  return lessons.filter(lesson => lesson.category === category)
}

// Get lessons by difficulty
export const getLessonsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Lesson[] => {
  const lessons = getAllLessons()
  return lessons.filter(lesson => lesson.difficulty === difficulty)
}

// Get lessons with character data
export const getLessonsWithCharacters = (): LessonWithCharacters[] => {
  const lessons = getAllLessons()
  
  return lessons.map(lesson => {
    const characters = lesson.characterIds
      .map(id => getCharacterById(id))
      .filter((char): char is ThaiCharacter => char !== null)
    
    return {
      ...lesson,
      characters,
      completedCharacters: 0, // Will be updated by progress tracking
      totalCharacters: characters.length,
      progressPercentage: 0 // Will be updated by progress tracking
    }
  })
}

// Get lesson with character data by ID
export const getLessonWithCharactersById = (lessonId: string): LessonWithCharacters | null => {
  const lesson = getLessonById(lessonId)
  if (!lesson) return null
  
  const characters = lesson.characterIds
    .map(id => getCharacterById(id))
    .filter((char): char is ThaiCharacter => char !== null)
  
  return {
    ...lesson,
    characters,
    completedCharacters: 0, // Will be updated by progress tracking
    totalCharacters: characters.length,
    progressPercentage: 0 // Will be updated by progress tracking
  }
}

// Get available lessons (prerequisites met)
export const getAvailableLessons = (completedLessonIds: string[]): Lesson[] => {
  const lessons = getAllLessons()
  
  return lessons.filter(lesson => {
    // If no prerequisites, lesson is available
    if (lesson.prerequisites.length === 0) return true
    
    // Check if all prerequisites are completed
    return lesson.prerequisites.every(prereqId => 
      completedLessonIds.includes(prereqId)
    )
  })
}

// Get next recommended lesson
export const getNextRecommendedLesson = (completedLessonIds: string[]): Lesson | null => {
  const availableLessons = getAvailableLessons(completedLessonIds)
  
  // Find the lesson with the lowest order number that hasn't been completed
  const nextLesson = availableLessons
    .filter(lesson => !completedLessonIds.includes(lesson.id))
    .sort((a, b) => a.order - b.order)[0]
  
  return nextLesson || null
}

// Get lesson categories
export const getLessonCategories = (): Record<string, LessonCategory> => {
  return lessonsData.categories as Record<string, LessonCategory>
}

// Get difficulty levels
export const getDifficultyLevels = (): Record<string, DifficultyLevel> => {
  return lessonsData.difficultyLevels as Record<string, DifficultyLevel>
}

// Get lessons for practice based on weak areas
export const getLessonsForWeakAreas = (weakCharacterIds: string[]): Lesson[] => {
  const lessons = getAllLessons()
  
  return lessons.filter(lesson => 
    lesson.characterIds.some(charId => weakCharacterIds.includes(charId))
  )
}

// Get random lesson for practice
export const getRandomLesson = (completedLessonIds: string[]): Lesson | null => {
  const availableLessons = getAvailableLessons(completedLessonIds)
  
  if (availableLessons.length === 0) return null
  
  const randomIndex = Math.floor(Math.random() * availableLessons.length)
  return availableLessons[randomIndex]
}

// Get lessons by tags
export const getLessonsByTags = (tags: string[]): Lesson[] => {
  const lessons = getAllLessons()
  
  return lessons.filter(lesson => 
    tags.some(tag => lesson.tags.includes(tag))
  )
}

// Search lessons
export const searchLessons = (query: string): Lesson[] => {
  const lessons = getAllLessons()
  const lowercaseQuery = query.toLowerCase()
  
  return lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(lowercaseQuery) ||
    lesson.description.toLowerCase().includes(lowercaseQuery) ||
    lesson.learningObjectives.some(obj => 
      obj.toLowerCase().includes(lowercaseQuery)
    ) ||
    lesson.tags.some(tag => 
      tag.toLowerCase().includes(lowercaseQuery)
    )
  )
}

// Get lesson statistics
export const getLessonStats = () => {
  const lessons = getAllLessons()
  const categories = getLessonCategories()
  const difficultyLevels = getDifficultyLevels()
  
  return {
    totalLessons: lessons.length,
    lessonsByCategory: Object.keys(categories).reduce((acc, category) => {
      acc[category] = lessons.filter(lesson => lesson.category === category).length
      return acc
    }, {} as Record<string, number>),
    lessonsByDifficulty: Object.keys(difficultyLevels).reduce((acc, difficulty) => {
      acc[difficulty] = lessons.filter(lesson => lesson.difficulty === difficulty).length
      return acc
    }, {} as Record<string, number>),
    averageCharactersPerLesson: lessons.reduce((sum, lesson) => 
      sum + lesson.characterIds.length, 0
    ) / lessons.length,
    totalUniqueCharacters: new Set(
      lessons.flatMap(lesson => lesson.characterIds)
    ).size
  }
}

export default lessonsData
