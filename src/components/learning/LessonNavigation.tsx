import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import type { LessonWithCharacters, LessonProgress } from '../../utils/lessons'
import LessonCard from './LessonCard'

interface LessonNavigationProps {
  lessons: LessonWithCharacters[]
  progress: Record<string, LessonProgress>
  completedLessonIds: string[]
  onStartLesson?: (lessonId: string) => void
  className?: string
}

const LessonNavigation: React.FC<LessonNavigationProps> = ({
  lessons,
  progress,
  completedLessonIds,
  onStartLesson,
  className = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Group lessons by category
  const lessonsByCategory = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = []
    }
    acc[lesson.category].push(lesson)
    return acc
  }, {} as Record<string, LessonWithCharacters[]>)

  // Get available lessons (prerequisites met)
  const availableLessons = lessons.filter(lesson => {
    if (lesson.prerequisites.length === 0) return true
    return lesson.prerequisites.every(prereqId => 
      completedLessonIds.includes(prereqId)
    )
  })

  // Get completed lessons
  const completedLessons = lessons.filter(lesson => 
    completedLessonIds.includes(lesson.id)
  )

  // Get lessons in progress
  const inProgressLessons = lessons.filter(lesson => {
    const lessonProgress = progress[lesson.id]
    return lessonProgress && !lessonProgress.isCompleted && lessonProgress.attempts > 0
  })

  // Get recommended lessons
  const recommendedLessons = availableLessons.filter(lesson => 
    !completedLessonIds.includes(lesson.id) && 
    !inProgressLessons.some(l => l.id === lesson.id)
  )

  const categories = [
    {
      id: 'all',
      name: 'All Lessons',
      icon: BookOpenIcon,
      lessons: lessons,
      count: lessons.length
    },
    {
      id: 'recommended',
      name: 'Recommended',
      icon: StarIcon,
      lessons: recommendedLessons,
      count: recommendedLessons.length
    },
    {
      id: 'in-progress',
      name: 'In Progress',
      icon: ClockIcon,
      lessons: inProgressLessons,
      count: inProgressLessons.length
    },
    {
      id: 'completed',
      name: 'Completed',
      icon: AcademicCapIcon,
      lessons: completedLessons,
      count: completedLessons.length
    },
    {
      id: 'consonants',
      name: 'Consonants',
      icon: BookOpenIcon,
      lessons: lessonsByCategory.consonants || [],
      count: lessonsByCategory.consonants?.length || 0
    },
    {
      id: 'vowels',
      name: 'Vowels',
      icon: BookOpenIcon,
      lessons: lessonsByCategory.vowels || [],
      count: lessonsByCategory.vowels?.length || 0
    },
    {
      id: 'tones',
      name: 'Tone Marks',
      icon: BookOpenIcon,
      lessons: lessonsByCategory.tones || [],
      count: lessonsByCategory.tones?.length || 0
    },
    {
      id: 'review',
      name: 'Review',
      icon: ChartBarIcon,
      lessons: lessonsByCategory.review || [],
      count: lessonsByCategory.review?.length || 0
    }
  ].filter(category => category.count > 0)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Thai Script Lessons
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Learn Thai script systematically through structured lessons.
          Complete prerequisites to unlock new content.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Learning Progress
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {completedLessons.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {inProgressLessons.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {recommendedLessons.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Available</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">
              {Math.round((completedLessons.length / lessons.length) * 100)}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Overall</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex flex-wrap gap-1 sm:gap-2 p-1 bg-gray-100 rounded-lg overflow-x-auto">
          {categories.map((category) => (
            <Tab
              key={category.id}
              className={({ selected }) =>
                `flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-2 rounded-md transition-all duration-200 touch-button whitespace-nowrap ${
                  selected
                    ? 'bg-white shadow-sm border border-gray-200'
                    : 'hover:bg-gray-50'
                }`
              }
            >
              <category.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium truncate">
                {category.name}
              </span>
              <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-gray-200 text-gray-600 flex-shrink-0">
                {category.count}
              </span>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          {categories.map((category) => (
            <Tab.Panel key={category.id} className="space-y-4">
              {/* Category Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <category.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {category.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      {category.count} lesson{category.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {category.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    progress={progress[lesson.id]}
                    isAvailable={availableLessons.some(l => l.id === lesson.id)}
                    isCompleted={completedLessonIds.includes(lesson.id)}
                    onStartLesson={onStartLesson}
                    className="h-fit"
                  />
                ))}
              </div>

              {/* Empty State */}
              {category.lessons.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <category.icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {category.name.toLowerCase()} lessons
                  </h3>
                  <p className="text-gray-500">
                    {category.id === 'recommended' 
                      ? 'Complete some lessons to see recommendations'
                      : 'Lessons will appear here as you progress'
                    }
                  </p>
                </div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default LessonNavigation
