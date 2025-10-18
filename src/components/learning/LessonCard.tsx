import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  PlayIcon, 
  ClockIcon, 
  AcademicCapIcon,
  CheckCircleIcon,
  LockClosedIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import type { LessonWithCharacters, LessonProgress } from '../../utils/lessons'

interface LessonCardProps {
  lesson: LessonWithCharacters
  progress?: LessonProgress
  isAvailable?: boolean
  isCompleted?: boolean
  onStartLesson?: (lessonId: string) => void
  className?: string
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  progress,
  isAvailable = true,
  isCompleted = false,
  onStartLesson,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const handleStartLesson = () => {
    if (onStartLesson && isAvailable) {
      onStartLesson(lesson.id)
    }
  }

  // Generate learning objectives based on lesson content
  const getLearningObjectives = () => {
    const objectives = []
    
    if (lesson.category === 'consonants') {
      objectives.push(`Learn ${lesson.characters.length} consonant characters`)
      objectives.push('Master consonant pronunciation and recognition')
      objectives.push('Understand consonant class system')
    } else if (lesson.category === 'vowels') {
      objectives.push(`Learn ${lesson.characters.length} vowel characters`)
      objectives.push('Master vowel pronunciation and recognition')
      objectives.push('Understand vowel combinations')
    } else if (lesson.category === 'tone-marks') {
      objectives.push(`Learn ${lesson.characters.length} tone mark characters`)
      objectives.push('Master tone mark usage and pronunciation')
      objectives.push('Understand tone rules')
    } else if (lesson.category === 'review') {
      objectives.push('Review previously learned characters')
      objectives.push('Practice character recognition and writing')
      objectives.push('Consolidate learning through mixed exercises')
    }
    
    objectives.push('Complete interactive exercises and quizzes')
    objectives.push('Achieve 80% accuracy in assessments')
    
    return objectives
  }

  const learningObjectives = getLearningObjectives()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'consonants':
        return 'bg-blue-500'
      case 'vowels':
        return 'bg-purple-500'
      case 'tones':
        return 'bg-orange-500'
      case 'review':
        return 'bg-green-500'
      case 'advanced':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className={`
      relative bg-white rounded-xl border-2 transition-all duration-200
      ${isAvailable 
        ? 'border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer' 
        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
      }
      ${isCompleted ? 'border-green-300 bg-green-50' : ''}
      ${className}
    `}>
      {/* Header */}
      <div className="p-4 sm:p-6">
        {/* Category and Difficulty */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(lesson.category)}`}></div>
            <span className="text-sm font-medium text-gray-600 capitalize">
              {lesson.category}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full border
              ${getDifficultyColor(lesson.difficulty)}
            `}>
              {lesson.difficulty}
            </span>
            {isCompleted && (
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            )}
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {lesson.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Learning Objectives */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <TagIcon className="h-4 w-4 text-blue-500 mr-1" />
              Learning Objectives:
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"
            >
              {isExpanded ? 'Show Less' : 'Show All'}
              {isExpanded ? (
                <ChevronUpIcon className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDownIcon className="h-3 w-3 ml-1" />
              )}
            </button>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isExpanded ? learningObjectives : learningObjectives.slice(0, 2)).map((objective, index) => (
              <li key={index} className="flex items-start">
                <AcademicCapIcon className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{objective}</span>
              </li>
            ))}
            {!isExpanded && learningObjectives.length > 2 && (
              <li className="text-gray-500 text-xs">
                +{learningObjectives.length - 2} more objectives
              </li>
            )}
          </ul>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{lesson.estimatedTime}</span>
            </div>
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 mr-1" />
              <span>{lesson.totalCharacters} characters</span>
            </div>
          </div>
          {progress && (
            <div className="text-right">
              <div className="text-xs text-gray-500">
                Best: {progress.bestScore}%
              </div>
              <div className="text-xs text-gray-500">
                {progress.attempts} attempts
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress.charactersMastered.length}/{lesson.totalCharacters}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(progress.charactersMastered.length / lesson.totalCharacters) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Expanded Lesson Details */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="space-y-4">
              {/* Character Preview */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <BookOpenIcon className="h-4 w-4 text-green-500 mr-1" />
                  Characters in this lesson:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {lesson.characters.map((character) => (
                    <div
                      key={character.id}
                      className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg text-sm"
                    >
                      <span className="text-lg font-bold text-gray-900 thai-font">
                        {character.id}
                      </span>
                      <span className="text-gray-600">{character.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              {lesson.prerequisites.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Prerequisites:
                  </h5>
                  <div className="text-sm text-gray-600">
                    Complete these lessons first: {lesson.prerequisites.join(', ')}
                  </div>
                </div>
              )}

              {/* Estimated Time */}
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>Estimated time: {lesson.characters.length * 5} minutes</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {isAvailable ? (
            <Link
              to={`/lesson/${lesson.id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors touch-button"
              onClick={handleStartLesson}
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              {isCompleted ? 'Review Lesson' : 'Start Lesson'}
            </Link>
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed">
              <LockClosedIcon className="h-4 w-4 mr-2" />
              Complete Prerequisites
            </div>
          )}
          
          {/* Lesson Order */}
          <div className="text-xs text-gray-400 font-medium">
            Lesson {lesson.order}
          </div>
        </div>
      </div>

      {/* Category Color Bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl ${getCategoryColor(lesson.category)}`}></div>
    </div>
  )
}

export default LessonCard
