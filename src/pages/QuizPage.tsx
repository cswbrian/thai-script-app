import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  PlayIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  StarIcon
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
    // Here you could add logic to save results, show summary, etc.
  }

  const quizTypes = [
    {
      id: 'recognition',
      name: 'Character Recognition',
      description: 'Identify pronunciation from character',
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'pronunciation',
      name: 'Pronunciation Test',
      description: 'Listen and identify characters',
      icon: PlayIcon,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'audio-to-character',
      name: 'Audio to Character',
      description: 'Match audio to character',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Test',
      description: 'Complete assessment with multiple question types',
      icon: StarIcon,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Quiz & Assessment
        </h1>
        <p className="text-gray-600 mb-6">
          Test your Thai script knowledge with interactive quizzes
        </p>
        
        {initialCharacter && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-2xl font-bold text-gray-900 thai-font">
                {initialCharacter.id}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {initialCharacter.name}
                </div>
                <div className="text-xs text-gray-600">
                  Focused quiz for this character
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quizTypes.map((quizType) => (
          <button
            key={quizType.id}
            onClick={() => handleStartQuiz(quizType.id)}
            className={`
              flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 
              hover:border-gray-300 hover:shadow-lg transition-all duration-200
              ${quizType.hoverColor} hover:text-white text-gray-700
            `}
          >
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center mb-4
              ${quizType.color} text-white
            `}>
              <quizType.icon className="h-6 w-6" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2 text-center">
              {quizType.name}
            </h3>
            
            <p className="text-sm text-center opacity-80">
              {quizType.description}
            </p>
          </button>
        ))}
      </div>

      {/* Quiz Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quiz Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Quizzes Taken</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Characters Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">0</div>
            <div className="text-sm text-gray-600">Streak Days</div>
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
            timeLimit: 300, // 5 minutes
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
