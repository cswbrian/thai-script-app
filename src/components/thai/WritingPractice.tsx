import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Stage, Layer, Line, Rect, Text, Circle, Group } from 'react-konva'
import { motion } from 'framer-motion'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PlayIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import type { ThaiCharacter } from '../../utils/characters'
import { useWriting } from '../../hooks/useWriting'

interface WritingPracticeProps {
  character: ThaiCharacter
  onComplete?: (accuracy: number) => void
  onExit?: () => void
  className?: string
}

interface StrokePoint {
  x: number
  y: number
  timestamp: number
}

interface Stroke {
  id: string
  points: StrokePoint[]
  color: string
  width: number
}

const WritingPractice: React.FC<WritingPracticeProps> = ({
  character,
  onComplete,
  onExit,
  className = ''
}) => {
  const stageRef = useRef<any>(null)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<StrokePoint[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedStrokes, setAnimatedStrokes] = useState<Stroke[]>([])
  const [history, setHistory] = useState<Stroke[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [feedbackPoints, setFeedbackPoints] = useState<{x: number, y: number, type: 'correct' | 'incorrect' | 'warning'}[]>([])
  const [showRealTimeFeedback, setShowRealTimeFeedback] = useState(true)
  const [showStrokeHints, setShowStrokeHints] = useState(false)
  const [currentHintIndex] = useState(0)
  const [practiceMode, setPracticeMode] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [bestAccuracy, setBestAccuracy] = useState(0)
  const [sessionStats, setSessionStats] = useState({
    totalAttempts: 0,
    bestAccuracy: 0,
    averageAccuracy: 0,
    timeSpent: 0,
    startTime: Date.now()
  })

  const {
    startStroke,
    addPoint,
    endStroke,
    undoStroke,
    redoStroke,
    clearCanvas,
    calculateAccuracy,
    detectStrokeOrder,
    validateStrokeSequence,
    getStrokeOrder,
    currentStrokeOrder,
    strokeOrderFeedback
  } = useWriting(character)

  // Canvas dimensions
  const canvasWidth = 400
  const canvasHeight = 400
  const padding = 40

  // Initialize character stroke data
  useEffect(() => {
    // Character stroke data would be loaded here
    console.log('Character:', character.id, character.name)
  }, [character])

  const handleMouseDown = useCallback((e: any) => {
    const pos = e.target.getStage().getPointerPosition()
    if (!pos) return

    setIsDrawing(true)
    const newPoint: StrokePoint = {
      x: pos.x,
      y: pos.y,
      timestamp: Date.now()
    }

    setCurrentStroke([newPoint])
    startStroke(newPoint)
  }, [startStroke])

  const handleMouseMove = useCallback((e: any) => {
    if (!isDrawing) return

    const pos = e.target.getStage().getPointerPosition()
    if (!pos) return

    const newPoint: StrokePoint = {
      x: pos.x,
      y: pos.y,
      timestamp: Date.now()
    }

    setCurrentStroke(prev => [...prev, newPoint])
    addPoint(newPoint)

    // Real-time feedback
    if (showRealTimeFeedback && currentStroke.length > 0) {
      const currentStrokeData = [...currentStroke, newPoint]
      const stroke: Stroke = {
        id: 'temp-stroke',
        points: currentStrokeData,
        color: '#3B82F6',
        width: 3
      }

      const detection = detectStrokeOrder(stroke)
      
      // Add feedback points based on accuracy
      if (detection.accuracy > 80) {
        setFeedbackPoints(prev => [...prev.slice(-5), { x: pos.x, y: pos.y, type: 'correct' }])
      } else if (detection.accuracy > 50) {
        setFeedbackPoints(prev => [...prev.slice(-5), { x: pos.x, y: pos.y, type: 'warning' }])
      } else {
        setFeedbackPoints(prev => [...prev.slice(-5), { x: pos.x, y: pos.y, type: 'incorrect' }])
      }
    }
  }, [isDrawing, addPoint, currentStroke, showRealTimeFeedback, detectStrokeOrder])

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || currentStroke.length === 0) return

    setIsDrawing(false)
    
    const newStroke: Stroke = {
      id: `stroke-${Date.now()}`,
      points: currentStroke,
      color: '#3B82F6',
      width: 3
    }

    // Detect stroke order and provide feedback
    const strokeDetection = detectStrokeOrder(newStroke)
    const validation = validateStrokeSequence([...strokes, newStroke])
    
    // Update feedback based on stroke order
    const feedback = []
    if (strokeDetection.order !== strokes.length + 1) {
      feedback.push(`Expected stroke ${strokes.length + 1}, but drew stroke ${strokeDetection.order}`)
    }
    if (strokeDetection.accuracy < 70) {
      feedback.push(`Stroke accuracy: ${strokeDetection.accuracy}% - try to be more precise`)
    }
    if (!validation.isValid) {
      feedback.push('Stroke order is incorrect')
    }

    setStrokes(prev => {
      const newStrokes = [...prev, newStroke]
      setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), prev])
      setHistoryIndex(prev => prev + 1)
      return newStrokes
    })

    setCurrentStroke([])
    endStroke()
  }, [isDrawing, currentStroke, endStroke, historyIndex, strokes, detectStrokeOrder, validateStrokeSequence])

  const handleUndo = useCallback(() => {
    if (historyIndex >= 0) {
      setStrokes(history[historyIndex])
      setHistoryIndex(prev => prev - 1)
      setFeedbackPoints([]) // Clear feedback when undoing
      undoStroke()
    }
  }, [historyIndex, history, undoStroke])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1
      setStrokes(history[nextIndex])
      setHistoryIndex(nextIndex)
      setFeedbackPoints([]) // Clear feedback when redoing
      redoStroke()
    }
  }, [historyIndex, history, redoStroke])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          handleUndo()
        } else if (e.key === 'z' && e.shiftKey) {
          e.preventDefault()
          handleRedo()
        } else if (e.key === 'y') {
          e.preventDefault()
          handleRedo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  const handleClear = useCallback(() => {
    setStrokes([])
    setCurrentStroke([])
    setHistory([])
    setHistoryIndex(-1)
    clearCanvas()
  }, [clearCanvas])

  const handleCheck = useCallback(() => {
    const accuracy = calculateAccuracy(strokes)
    const newAttempts = attempts + 1
    
    setAttempts(newAttempts)
    
    if (accuracy > bestAccuracy) {
      setBestAccuracy(accuracy)
    }
    
    // Update session stats
    setSessionStats(prev => {
      const newTotalAttempts = prev.totalAttempts + 1
      const newAverageAccuracy = ((prev.averageAccuracy * prev.totalAttempts) + accuracy) / newTotalAttempts
      const timeSpent = Date.now() - prev.startTime
      
      return {
        ...prev,
        totalAttempts: newTotalAttempts,
        bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
        averageAccuracy: newAverageAccuracy,
        timeSpent
      }
    })
    
    onComplete?.(accuracy)
  }, [calculateAccuracy, strokes, onComplete, attempts, bestAccuracy])

  const handlePlayAnimation = useCallback(() => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setShowAnimation(true)
    setAnimationProgress(0)
    setAnimatedStrokes([])
    
    // Get the expected stroke order for this character
    const expectedStrokes = getStrokeOrder()
    
    if (expectedStrokes.length === 0) {
      // Fallback animation with sample strokes
      const sampleStrokes: Stroke[] = [
        {
          id: 'demo-stroke-1',
          points: [
            { x: 200, y: 100, timestamp: 0 },
            { x: 200, y: 300, timestamp: 1000 }
          ],
          color: '#10B981',
          width: 4
        },
        {
          id: 'demo-stroke-2',
          points: [
            { x: 150, y: 150, timestamp: 0 },
            { x: 250, y: 150, timestamp: 1000 }
          ],
          color: '#10B981',
          width: 4
        }
      ]
      
      // Animate each stroke
      sampleStrokes.forEach((stroke, index) => {
        setTimeout(() => {
          setAnimatedStrokes(prev => [...prev, stroke])
          setAnimationProgress((index + 1) / sampleStrokes.length)
        }, index * 1500)
      })
      
      // End animation
      setTimeout(() => {
        setIsAnimating(false)
        setShowAnimation(false)
        setAnimatedStrokes([])
        setAnimationProgress(0)
      }, sampleStrokes.length * 1500 + 1000)
    } else {
      // Animate with actual character strokes
      expectedStrokes.forEach((strokeData: any, index: number) => {
        const stroke: Stroke = {
          id: `demo-${strokeData.strokeId}`,
          points: strokeData.points,
          color: '#10B981',
          width: 4
        }
        
        setTimeout(() => {
          setAnimatedStrokes(prev => [...prev, stroke])
          setAnimationProgress((index + 1) / expectedStrokes.length)
        }, index * 1500)
      })
      
      // End animation
      setTimeout(() => {
        setIsAnimating(false)
        setShowAnimation(false)
        setAnimatedStrokes([])
        setAnimationProgress(0)
      }, expectedStrokes.length * 1500 + 1000)
    }
  }, [isAnimating, getStrokeOrder])

  // Render stroke lines
  const renderStrokes = () => {
    return strokes.map((stroke) => {
      const points = stroke.points.reduce((acc, point) => {
        return acc.concat([point.x, point.y])
      }, [] as number[])

      return (
        <Line
          key={stroke.id}
          points={points}
          stroke={stroke.color}
          strokeWidth={stroke.width}
          lineCap="round"
          lineJoin="round"
          tension={0.5}
        />
      )
    })
  }

  // Render animated stroke lines
  const renderAnimatedStrokes = () => {
    return animatedStrokes.map((stroke) => {
      const points = stroke.points.reduce((acc, point) => {
        return acc.concat([point.x, point.y])
      }, [] as number[])

      return (
        <motion.div
          key={stroke.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Line
            points={points}
            stroke={stroke.color}
            strokeWidth={stroke.width}
            lineCap="round"
            lineJoin="round"
            tension={0.5}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={4}
            shadowOffset={{ x: 2, y: 2 }}
          />
        </motion.div>
      )
    })
  }

  // Render current stroke being drawn
  const renderCurrentStroke = () => {
    if (currentStroke.length === 0) return null

    const points = currentStroke.reduce((acc, point) => {
      return acc.concat([point.x, point.y])
    }, [] as number[])

    return (
      <Line
        points={points}
        stroke="#3B82F6"
        strokeWidth={3}
        lineCap="round"
        lineJoin="round"
        tension={0.5}
      />
    )
  }

  // Render real-time feedback points
  const renderFeedbackPoints = () => {
    if (!showRealTimeFeedback) return null

    return feedbackPoints.map((point, index) => {
      const colors = {
        correct: '#10B981',
        warning: '#F59E0B',
        incorrect: '#EF4444'
      }

      return (
        <Circle
          key={`feedback-${index}`}
          x={point.x}
          y={point.y}
          radius={8}
          fill={colors[point.type]}
          opacity={0.7}
          stroke="white"
          strokeWidth={2}
        />
      )
    })
  }

  // Render guide lines
  const renderGuides = () => {
    if (!showGuide) return null

    return (
      <>
        {/* Center guide lines */}
        <Line
          points={[canvasWidth / 2, padding, canvasWidth / 2, canvasHeight - padding]}
          stroke="#E5E7EB"
          strokeWidth={1}
          dash={[5, 5]}
        />
        <Line
          points={[padding, canvasHeight / 2, canvasWidth - padding, canvasHeight / 2]}
          stroke="#E5E7EB"
          strokeWidth={1}
          dash={[5, 5]}
        />
        
        {/* Character boundary */}
        <Rect
          x={padding}
          y={padding}
          width={canvasWidth - 2 * padding}
          height={canvasHeight - 2 * padding}
          stroke="#D1D5DB"
          strokeWidth={2}
          dash={[10, 5]}
        />

        {/* Stroke hints */}
        {showStrokeHints && renderStrokeHints()}
      </>
    )
  }

  // Render stroke hints
  const renderStrokeHints = () => {
    const expectedStrokes = getStrokeOrder()
    if (expectedStrokes.length === 0) return null

    return expectedStrokes.map((strokeData, index) => {
      const isCurrentStroke = index === currentHintIndex
      const isCompleted = index < strokes.length
      
      if (isCompleted) return null // Don't show hints for completed strokes

      const startPoint = strokeData.points[0]
      const endPoint = strokeData.points[strokeData.points.length - 1]

      return (
        <Group key={`hint-${strokeData.strokeId}`}>
          {/* Start point indicator */}
          <Circle
            x={startPoint.x}
            y={startPoint.y}
            radius={12}
            fill={isCurrentStroke ? '#3B82F6' : '#9CA3AF'}
            opacity={0.8}
            stroke="white"
            strokeWidth={2}
          />
          
          {/* End point indicator */}
          <Circle
            x={endPoint.x}
            y={endPoint.y}
            radius={8}
            fill={isCurrentStroke ? '#10B981' : '#6B7280'}
            opacity={0.8}
            stroke="white"
            strokeWidth={2}
          />
          
          {/* Stroke direction arrow */}
          <Line
            points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
            stroke={isCurrentStroke ? '#3B82F6' : '#9CA3AF'}
            strokeWidth={2}
            dash={[10, 5]}
            opacity={0.6}
          />
          
          {/* Stroke number */}
          <Text
            x={startPoint.x}
            y={startPoint.y - 20}
            text={`${index + 1}`}
            fontSize={16}
            fontFamily="Arial"
            fill={isCurrentStroke ? '#3B82F6' : '#9CA3AF'}
            align="center"
            offsetX={8}
            offsetY={8}
          />
        </Group>
      )
    })
  }

  // Render character reference
  const renderCharacterReference = () => {
    return (
      <Text
        x={canvasWidth / 2}
        y={canvasHeight / 2}
        text={character.id}
        fontSize={120}
        fontFamily="'Noto Sans Thai', sans-serif"
        fill="#9CA3AF"
        align="center"
        verticalAlign="middle"
        offsetX={60}
        offsetY={60}
      />
    )
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900">
          Practice Writing: {character.name}
        </h2>
        {onExit && (
          <button
            onClick={onExit}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Character Info */}
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900 mb-2 thai-font">
          {character.id}
        </div>
        <div className="text-lg text-gray-600">
          {character.name} • {character.pronunciation}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative">
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="border-2 border-gray-200 rounded-lg shadow-lg bg-white"
        >
          <Layer>
            {renderGuides()}
            {renderCharacterReference()}
            {renderStrokes()}
            {renderAnimatedStrokes()}
            {renderCurrentStroke()}
            {renderFeedbackPoints()}
          </Layer>
        </Stage>

        {/* Animation Progress Indicator */}
        {showAnimation && (
          <div className="absolute top-2 left-2 right-2">
            <div className="bg-white bg-opacity-90 rounded-lg p-2">
              <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                <span>Demo Animation</span>
                <span>{Math.round(animationProgress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${animationProgress * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={handleUndo}
          disabled={historyIndex < 0}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
          Undo {historyIndex >= 0 && `(${historyIndex + 1})`}
        </button>

        <button
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
        >
          <ArrowUturnRightIcon className="h-4 w-4 mr-1" />
          Redo {historyIndex < history.length - 1 && `(${history.length - historyIndex - 1})`}
        </button>

        <button
          onClick={handleClear}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Clear
        </button>

        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {showGuide ? (
            <EyeSlashIcon className="h-4 w-4 mr-1" />
          ) : (
            <EyeIcon className="h-4 w-4 mr-1" />
          )}
          {showGuide ? 'Hide' : 'Show'} Guide
        </button>

        <button
          onClick={() => setShowStrokeHints(!showStrokeHints)}
          className={`flex items-center px-3 py-2 text-sm font-medium border rounded-md ${
            showStrokeHints 
              ? 'text-white bg-purple-600 border-transparent hover:bg-purple-700' 
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <XCircleIcon className="h-4 w-4 mr-1" />
          {showStrokeHints ? 'Hide' : 'Show'} Hints
        </button>

        <button
          onClick={() => setShowRealTimeFeedback(!showRealTimeFeedback)}
          className={`flex items-center px-3 py-2 text-sm font-medium border rounded-md ${
            showRealTimeFeedback 
              ? 'text-white bg-green-600 border-transparent hover:bg-green-700' 
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <XCircleIcon className="h-4 w-4 mr-1" />
          {showRealTimeFeedback ? 'Hide' : 'Show'} Feedback
        </button>

        <button
          onClick={handlePlayAnimation}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          <PlayIcon className="h-4 w-4 mr-1" />
          Demo
        </button>

        <button
          onClick={handleCheck}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
        >
          <CheckIcon className="h-4 w-4 mr-1" />
          Check
        </button>

        <button
          onClick={() => setPracticeMode(!practiceMode)}
          className={`flex items-center px-3 py-2 text-sm font-medium border rounded-md ${
            practiceMode 
              ? 'text-white bg-orange-600 border-transparent hover:bg-orange-700' 
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <CheckIcon className="h-4 w-4 mr-1" />
          {practiceMode ? 'Exit' : 'Start'} Practice
        </button>
      </div>

      {/* Practice Mode Stats */}
      {practiceMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Practice Session Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Attempts:</span>
              <span className="ml-2 text-blue-900">{sessionStats.totalAttempts}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Best Accuracy:</span>
              <span className="ml-2 text-blue-900">{Math.round(sessionStats.bestAccuracy)}%</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Average:</span>
              <span className="ml-2 text-blue-900">{Math.round(sessionStats.averageAccuracy)}%</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Time:</span>
              <span className="ml-2 text-blue-900">{Math.round(sessionStats.timeSpent / 1000)}s</span>
            </div>
          </div>
        </div>
      )}

      {/* Stroke Order Feedback */}
      {strokeOrderFeedback.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Stroke Order Feedback:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {strokeOrderFeedback.map((feedback, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{feedback}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        <p>Draw the character {character.id} in the correct stroke order.</p>
        <p>Use your mouse or touch to draw on the canvas.</p>
        <p className="text-xs text-gray-500 mt-2">
          Current stroke: {strokes.length + 1} • Expected order: {currentStrokeOrder}
        </p>
      </div>
    </div>
  )
}

export default WritingPractice
