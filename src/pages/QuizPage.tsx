import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  PlayIcon, 
  AcademicCapIcon, 
  ChartBarIcon
} from '@heroicons/react/24/outline'
import QuizInterface from '../components/learning/QuizInterface'
import thaiCharactersData, { getCharacterById } from '../utils/characters'

const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [selectedQuizType, setSelectedQuizType] = useState<string>('')
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])
  
  // Get character from URL params if specified
  const characterParam = searchParams.get('character')
  const initialCharacter = characterParam ? getCharacterById(characterParam) : null

  const handleStartQuiz = (type: string) => {
    setSelectedQuizType(type)
    
    // If a specific character is requested, use only that character
    if (initialCharacter) {
      setSelectedCharacters([initialCharacter.id])
    } else {
      // Otherwise, use all characters for the quiz
      const allCharacters = [
        ...thaiCharactersData.consonants,
        ...thaiCharactersData.vowels,
        ...thaiCharactersData.toneMarks
      ]
      const allCharacterIds = allCharacters.map(char => char.id)
      setSelectedCharacters(allCharacterIds.slice(0, 10)) // Limit to 10 characters
    }
    
    setIsQuizOpen(true)
  }

  const handleQuizComplete = (results: any) => {
    console.log('Quiz completed:', results)
    setIsQuizOpen(false)
  }

  const quizTypes = [
    {
      id: 'recognition',
      name: 'Recognition',
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'pronunciation',
      name: 'Pronunciation',
      icon: PlayIcon,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'audio-to-character',
      name: 'Audio Match',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quiz
        </h1>
        
        {initialCharacter && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-sm mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-xl font-bold text-gray-900 thai-font">
                {initialCharacter.id}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {initialCharacter.name}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Type Selection */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
          {quizTypes.map((quizType) => (
            <button
              key={quizType.id}
              onClick={() => handleStartQuiz(quizType.id)}
              className={`
                flex items-center p-4 rounded-xl border-2 border-gray-200 
                hover:border-gray-300 hover:shadow-lg transition-all duration-200
                ${quizType.hoverColor} hover:text-white text-gray-700
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center mr-4
                ${quizType.color} text-white
              `}>
                <quizType.icon className="h-5 w-5" />
              </div>
              
              <div className="text-left">
                <h3 className="text-lg font-semibold">
                  {quizType.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="px-4 pb-6">
        <div className="bg-gray-50 rounded-xl p-4 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Progress
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">0%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Interface Modal */}
      {isQuizOpen && (
        <QuizInterface
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          config={{
            questionCount: Math.min(selectedCharacters.length, 10),
            questionTypes: [selectedQuizType as any],
            characters: selectedCharacters.map(id => getCharacterById(id)).filter((char): char is NonNullable<typeof char> => char !== null),
            allowRetry: true,
            showExplanations: true
          }}
          onComplete={(results, score) => handleQuizComplete({ results, score })}
        />
      )}
    </div>
  )
}

export default QuizPage