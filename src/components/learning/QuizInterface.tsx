import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { 
  XMarkIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import type { ThaiCharacter } from '../../utils/characters'
import AudioControls from '../ui/AudioControls'

interface SubQuestion {
  id: string
  type: 'visual' | 'audio' | 'writing' | 'text' | 'multiple-choice' | 'character'
  question: string
  answer: string
  options?: string[]
}

export interface QuizQuestion {
  id: string
  type: 'recognition' | 'pronunciation' | 'writing' | 'mixed' | 'audio-to-character' | 'comprehensive'
  question: string
  correctAnswer: string
  options?: string[]
  character?: ThaiCharacter
  audioPath?: string
  explanation?: string
  audioText?: string
  characterOptions?: ThaiCharacter[]
  subQuestions?: SubQuestion[]
}

export interface QuizResult {
  questionId: string
  userAnswer: string
  isCorrect: boolean
  attempts: number
}

export interface QuizConfig {
  questionCount: number
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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  // Generate quiz questions
  useEffect(() => {
    if (isOpen && config.characters.length > 0) {
      const generatedQuestions = generateQuestions(config)
      setQuestions(generatedQuestions)
      setCurrentQuestionIndex(0)
      setResults([])
      setSelectedAnswer(null)
      setShowAnswer(false)
    }
  }, [isOpen, config])

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

      case 'audio-to-character':
        return {
          ...baseQuestion,
          question: `Listen to the pronunciation and select the correct character`,
          correctAnswer: character.id,
          characterOptions: generateCharacterOptions(character),
          audioText: `${character.name}, pronounced ${character.pronunciation}`,
          explanation: `The pronunciation "${character.pronunciation}" corresponds to the character "${character.id}"`
        }

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

  const generateCharacterOptions = (character: ThaiCharacter): ThaiCharacter[] => {
    const options = [character]
    const allCharacters = config.characters
    
    while (options.length < 4 && options.length < allCharacters.length) {
      const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)]
      if (!options.some(opt => opt.id === randomChar.id)) {
        options.push(randomChar)
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
    const isCorrect = answer === currentQuestion.correctAnswer
    
    setSelectedAnswer(answer)
    setShowAnswer(true)

    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      attempts: 1
    }

    setResults(prev => [...prev, result])
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    } else {
      handleQuizComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    }
  }

  const handleQuizComplete = () => {
    const score = Math.round((results.filter(r => r.isCorrect).length / questions.length) * 100)
    onComplete(results, score)
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-2">
        <Dialog.Panel className={`
          bg-white rounded-xl shadow-xl w-full h-full max-h-screen overflow-hidden flex flex-col
          ${className}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Quiz
              </Dialog.Title>
              <p className="text-sm text-gray-600">
                {currentQuestionIndex + 1} of {questions.length}
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
          <div className="px-4 py-2 bg-gray-50 flex-shrink-0">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 flex flex-col justify-center p-4 overflow-hidden">
            {currentQuestion && (
              <div className="space-y-4">
                {/* Question */}
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {currentQuestion.question}
                  </h3>
                  
                  {/* Audio-to-Character Question */}
                  {currentQuestion.type === 'audio-to-character' && (
                    <div className="mb-4">
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        {currentQuestion.character && currentQuestion.audioPath && (
                          <AudioControls
                            audioPath={currentQuestion.audioPath}
                            characterName={currentQuestion.character.name}
                            character={currentQuestion.character}
                            size="lg"
                            showLabel={true}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Character Display */}
                  {currentQuestion.character && currentQuestion.type !== 'audio-to-character' && (
                    <div className="mb-4">
                      <div className="text-6xl font-bold text-gray-900 thai-font mb-2">
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
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.type === 'audio-to-character' && currentQuestion.characterOptions ? (
                    // Character options for audio-to-character questions
                    currentQuestion.characterOptions.map((character, index) => {
                      const isSelected = selectedAnswer === character.id
                      const isCorrect = character.id === currentQuestion.correctAnswer
                      const showCorrect = showAnswer && isCorrect
                      const showIncorrect = showAnswer && isSelected && !isCorrect
                      
                      return (
                        <button
                          key={index}
                          onClick={() => !showAnswer && handleAnswerSelect(character.id)}
                          disabled={showAnswer}
                          className={`p-3 text-center border-2 rounded-lg transition-colors touch-button ${
                            showCorrect 
                              ? 'border-green-500 bg-green-50' 
                              : showIncorrect 
                                ? 'border-red-500 bg-red-50' 
                                : isSelected 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          } ${showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="text-2xl font-bold text-gray-900 thai-font mb-1">
                            {character.id}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {character.name}
                          </div>
                          {showAnswer && (
                            <div className="mt-1">
                              {showCorrect ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                              ) : showIncorrect ? (
                                <XCircleIcon className="h-5 w-5 text-red-500 mx-auto" />
                              ) : null}
                            </div>
                          )}
                        </button>
                      )
                    })
                  ) : (
                    // Regular text options
                    currentQuestion.options?.map((option, index) => {
                      const isSelected = selectedAnswer === option
                      const isCorrect = option === currentQuestion.correctAnswer
                      const showCorrect = showAnswer && isCorrect
                      const showIncorrect = showAnswer && isSelected && !isCorrect
                      
                      return (
                        <button
                          key={index}
                          onClick={() => !showAnswer && handleAnswerSelect(option)}
                          disabled={showAnswer}
                          className={`p-4 text-center border-2 rounded-lg transition-colors touch-button ${
                            showCorrect 
                              ? 'border-green-500 bg-green-50' 
                              : showIncorrect 
                                ? 'border-red-500 bg-red-50' 
                                : isSelected 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          } ${showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="text-lg font-medium text-gray-900">
                            {option}
                          </div>
                          {showAnswer && (
                            <div className="mt-1">
                              {showCorrect ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                              ) : showIncorrect ? (
                                <XCircleIcon className="h-5 w-5 text-red-500 mx-auto" />
                              ) : null}
                            </div>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>

                {/* Answer Explanation */}
                {showAnswer && currentQuestion.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        {selectedAnswer === currentQuestion.correctAnswer ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                        </div>
                        <div className="text-sm text-gray-700">
                          {currentQuestion.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
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