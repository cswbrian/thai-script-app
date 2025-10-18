import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { 
  XMarkIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import type { ThaiCharacter } from '../../utils/characters'
import AudioControls from '../ui/AudioControls'

export interface QuizQuestion {
  id: string
  type: 'recognition' | 'pronunciation' | 'writing' | 'mixed'
  question: string
  correctAnswer: string
  options?: string[]
  character?: ThaiCharacter
  audioPath?: string
  explanation?: string
}

export interface QuizResult {
  questionId: string
  userAnswer: string
  isCorrect: boolean
  timeSpent: number
  attempts: number
}

export interface QuizConfig {
  questionCount: number
  timeLimit?: number // in seconds
  questionTypes: QuizQuestion['type'][]
  characters: ThaiCharacter[]
  allowRetry: boolean
  showExplanations: boolean
}

interface QuizInterfaceProps {
  isOpen: boolean
  onClose: () => void
  config: QuizConfig
  onComplete: (results: QuizResult[], score: number) => void
  className?: string
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({
  isOpen,
  onClose,
  config,
  onComplete,
  className = ''
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [results, setResults] = useState<QuizResult[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())

  // Generate quiz questions
  useEffect(() => {
    if (isOpen && config.characters.length > 0) {
      const generatedQuestions = generateQuestions(config)
      setQuestions(generatedQuestions)
      setCurrentQuestionIndex(0)
      setResults([])
      setQuestionStartTime(Date.now())
      
      if (config.timeLimit) {
        setTimeRemaining(config.timeLimit)
      }
    }
  }, [isOpen, config])

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleTimeUp()
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const generateQuestions = (config: QuizConfig): QuizQuestion[] => {
    const questions: QuizQuestion[] = []
    const { questionCount, questionTypes, characters } = config

    for (let i = 0; i < questionCount; i++) {
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
      const character = characters[Math.floor(Math.random() * characters.length)]
      
      const question = generateQuestion(questionType, character, i)
      questions.push(question)
    }

    return questions
  }

  const generateQuestion = (type: QuizQuestion['type'], character: ThaiCharacter, index: number): QuizQuestion => {
    const baseQuestion = {
      id: `q${index + 1}`,
      type,
      character,
      audioPath: character.audioPath
    }

    switch (type) {
      case 'recognition':
        return {
          ...baseQuestion,
          question: `What is the pronunciation of this character?`,
          correctAnswer: character.pronunciation,
          options: generateRecognitionOptions(character),
          explanation: `The character "${character.id}" is pronounced "${character.pronunciation}"`
        }

      case 'pronunciation':
        return {
          ...baseQuestion,
          question: `Which character matches this pronunciation: "${character.pronunciation}"?`,
          correctAnswer: character.id,
          options: generatePronunciationOptions(character),
          explanation: `The pronunciation "${character.pronunciation}" corresponds to the character "${character.id}"`
        }

      case 'writing':
        return {
          ...baseQuestion,
          question: `How many strokes does this character have?`,
          correctAnswer: character.strokeCount?.toString() || 'Unknown',
          options: generateWritingOptions(character),
          explanation: `The character "${character.id}" has ${character.strokeCount || 'unknown'} strokes`
        }

      case 'mixed':
        const mixedTypes = ['recognition', 'pronunciation', 'writing']
        const selectedType = mixedTypes[Math.floor(Math.random() * mixedTypes.length)]
        return generateQuestion(selectedType as QuizQuestion['type'], character, index)

      default:
        return baseQuestion as QuizQuestion
    }
  }

  const generateRecognitionOptions = (character: ThaiCharacter): string[] => {
    const options = [character.pronunciation]
    const allPronunciations = config.characters.map(c => c.pronunciation)
    const uniquePronunciations = [...new Set(allPronunciations)]
    
    while (options.length < 4 && options.length < uniquePronunciations.length) {
      const randomPron = uniquePronunciations[Math.floor(Math.random() * uniquePronunciations.length)]
      if (!options.includes(randomPron)) {
        options.push(randomPron)
      }
    }
    
    return shuffleArray(options)
  }

  const generatePronunciationOptions = (character: ThaiCharacter): string[] => {
    const options = [character.id]
    const allCharacters = config.characters.map(c => c.id)
    const uniqueCharacters = [...new Set(allCharacters)]
    
    while (options.length < 4 && options.length < uniqueCharacters.length) {
      const randomChar = uniqueCharacters[Math.floor(Math.random() * uniqueCharacters.length)]
      if (!options.includes(randomChar)) {
        options.push(randomChar)
      }
    }
    
    return shuffleArray(options)
  }

  const generateWritingOptions = (character: ThaiCharacter): string[] => {
    const correctAnswer = character.strokeCount?.toString() || 'Unknown'
    const options = [correctAnswer]
    
    // Generate plausible stroke count options
    const strokeCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    while (options.length < 4) {
      const randomStroke = strokeCounts[Math.floor(Math.random() * strokeCounts.length)].toString()
      if (!options.includes(randomStroke)) {
        options.push(randomStroke)
      }
    }
    
    return shuffleArray(options)
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
    
    const isCorrect = answer === currentQuestion.correctAnswer
    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeSpent,
      attempts: 1
    }

    setResults(prev => [...prev, result])

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setQuestionStartTime(Date.now())
      } else {
        handleQuizComplete()
      }
    }, 1500)
  }

  const handleTimeUp = () => {
    const currentQuestion = questions[currentQuestionIndex]
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
    
    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: '',
      isCorrect: false,
      timeSpent,
      attempts: 1
    }

    setResults(prev => [...prev, result])
    handleQuizComplete()
  }

  const handleQuizComplete = () => {
    const score = Math.round((results.filter(r => r.isCorrect).length / questions.length) * 100)
    onComplete(results, score)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setQuestionStartTime(Date.now())
    } else {
      handleQuizComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setQuestionStartTime(Date.now())
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className={`
          bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden
          ${className}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900">
                Thai Script Quiz
              </Dialog.Title>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 sm:px-6 py-2 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              {timeRemaining !== null && (
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{timeRemaining}s</span>
                </div>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-4 sm:p-6">
            {currentQuestion && (
              <div className="space-y-6">
                {/* Question */}
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">
                    {currentQuestion.question}
                  </h3>
                  
                  {/* Character Display */}
                  {currentQuestion.character && (
                    <div className="mb-6">
                      <div className="text-6xl sm:text-8xl font-bold text-gray-900 thai-font mb-2">
                        {currentQuestion.character.id}
                      </div>
                      {currentQuestion.audioPath && (
                        <AudioControls
                          audioPath={currentQuestion.audioPath}
                          characterName={currentQuestion.character.name}
                          character={currentQuestion.character}
                          size="lg"
                          showLabel={true}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors touch-button"
                    >
                      <div className="text-lg font-medium text-gray-900">
                        {option}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Previous
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default QuizInterface
