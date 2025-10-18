import { useCallback, useRef, useState } from 'react'
import type { ThaiCharacter } from '../utils/characters'

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

interface StrokeOrder {
  strokeId: string
  points: StrokePoint[]
  order: number
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'curve'
  startRegion: string
  endRegion: string
}

interface UseWritingReturn {
  startStroke: (point: StrokePoint) => void
  addPoint: (point: StrokePoint) => void
  endStroke: () => void
  undoStroke: () => void
  redoStroke: () => void
  clearCanvas: () => void
  calculateAccuracy: (strokes: Stroke[]) => number
  getStrokeOrder: () => StrokeOrder[]
  isStrokeCorrect: (stroke: Stroke, expectedStroke: StrokeOrder) => boolean
  detectStrokeOrder: (stroke: Stroke) => { order: number; direction: string; accuracy: number }
  validateStrokeSequence: (strokes: Stroke[]) => { isValid: boolean; expectedOrder: number[]; actualOrder: number[] }
  currentStroke: StrokePoint[]
  strokeHistory: Stroke[][]
  historyIndex: number
  currentStrokeOrder: number
  strokeOrderFeedback: string[]
}

export const useWriting = (_character: ThaiCharacter): UseWritingReturn => {
  const [currentStroke, setCurrentStroke] = useState<StrokePoint[]>([])
  const [strokeHistory, setStrokeHistory] = useState<Stroke[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStrokeOrder] = useState(0)
  const [strokeOrderFeedback] = useState<string[]>([])

  // Character stroke data - this would typically come from character.strokeData
  const characterStrokeData = useRef<StrokeOrder[]>([])

  // Initialize character stroke data
  const initializeStrokeData = useCallback(() => {
    // This is a placeholder - in a real implementation, this would load
    // the actual stroke order data for the character
    characterStrokeData.current = [
      {
        strokeId: 'stroke-1',
        points: [
          { x: 200, y: 100, timestamp: 0 },
          { x: 200, y: 300, timestamp: 100 }
        ],
        order: 1,
        direction: 'vertical',
        startRegion: 'top',
        endRegion: 'bottom'
      },
      {
        strokeId: 'stroke-2',
        points: [
          { x: 150, y: 150, timestamp: 0 },
          { x: 250, y: 150, timestamp: 100 }
        ],
        order: 2,
        direction: 'horizontal',
        startRegion: 'left',
        endRegion: 'right'
      }
    ]
  }, [])

  const startStroke = useCallback((point: StrokePoint) => {
    setIsDrawing(true)
    setCurrentStroke([point])
  }, [])

  const addPoint = useCallback((point: StrokePoint) => {
    if (!isDrawing) return
    setCurrentStroke(prev => [...prev, point])
  }, [isDrawing])

  const endStroke = useCallback(() => {
    setIsDrawing(false)
    setCurrentStroke([])
  }, [])

  const undoStroke = useCallback(() => {
    if (historyIndex >= 0) {
      setHistoryIndex(prev => prev - 1)
    }
  }, [historyIndex])

  const redoStroke = useCallback(() => {
    if (historyIndex < strokeHistory.length - 1) {
      setHistoryIndex(prev => prev + 1)
    }
  }, [historyIndex, strokeHistory.length])

  const clearCanvas = useCallback(() => {
    setCurrentStroke([])
    setStrokeHistory([])
    setHistoryIndex(-1)
    setIsDrawing(false)
  }, [])

  const calculateAccuracy = useCallback((strokes: Stroke[]): number => {
    if (strokes.length === 0) return 0

    // Simple accuracy calculation based on stroke count and basic shape matching
    const expectedStrokes = characterStrokeData.current.length
    const actualStrokes = strokes.length
    
    // Base accuracy from stroke count
    const strokeCountAccuracy = Math.max(0, 1 - Math.abs(expectedStrokes - actualStrokes) / expectedStrokes)
    
    // Additional accuracy from stroke order and shape (simplified)
    let shapeAccuracy = 0
    strokes.forEach((stroke, index) => {
      const expectedStroke = characterStrokeData.current[index]
      if (expectedStroke && isStrokeCorrect(stroke, expectedStroke)) {
        shapeAccuracy += 1
      }
    })
    shapeAccuracy = shapeAccuracy / strokes.length

    // Combine accuracies
    const totalAccuracy = (strokeCountAccuracy * 0.4 + shapeAccuracy * 0.6) * 100
    return Math.round(Math.max(0, Math.min(100, totalAccuracy)))
  }, [])

  const getStrokeOrder = useCallback((): StrokeOrder[] => {
    return characterStrokeData.current
  }, [])

  const detectStrokeOrder = useCallback((stroke: Stroke): { order: number; direction: string; accuracy: number } => {
    if (stroke.points.length < 2) {
      return { order: 0, direction: 'unknown', accuracy: 0 }
    }

    const start = stroke.points[0]
    const end = stroke.points[stroke.points.length - 1]
    
    // Calculate stroke direction using angle analysis
    const deltaX = end.x - start.x
    const deltaY = end.y - start.y
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
    
    // Enhanced direction detection with tolerance
    let direction = 'curve'
    const tolerance = 20 // Increased tolerance for better detection
    
    if (Math.abs(angle) < tolerance || Math.abs(angle - 180) < tolerance || Math.abs(angle + 180) < tolerance) {
      direction = 'horizontal'
    } else if (Math.abs(angle - 90) < tolerance || Math.abs(angle + 90) < tolerance) {
      direction = 'vertical'
    } else if (Math.abs(angle - 45) < tolerance || Math.abs(angle + 135) < tolerance || 
               Math.abs(angle + 45) < tolerance || Math.abs(angle - 135) < tolerance) {
      direction = 'diagonal'
    }

    // Advanced stroke order detection using position analysis
    let order = 1
    const centerY = 200
    
    // Analyze stroke position relative to character structure
    if (start.y < centerY - 50) {
      order = 1 // Top strokes first
    } else if (start.y < centerY + 50) {
      order = 2 // Middle strokes
    } else {
      order = 3 // Bottom strokes last
    }

    // Enhanced accuracy calculation using multiple factors
    const strokeLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const expectedLength = 100
    const lengthAccuracy = Math.max(0, 1 - Math.abs(strokeLength - expectedLength) / expectedLength)
    
    // Calculate smoothness (how straight the stroke is)
    let smoothness = 1
    if (stroke.points.length > 2) {
      let totalDeviation = 0
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const prev = stroke.points[i - 1]
        const curr = stroke.points[i]
        const next = stroke.points[i + 1]
        
        // Calculate deviation from straight line
        const expectedY = prev.y + (next.y - prev.y) * (curr.x - prev.x) / (next.x - prev.x)
        const deviation = Math.abs(curr.y - expectedY)
        totalDeviation += deviation
      }
      smoothness = Math.max(0, 1 - totalDeviation / (stroke.points.length * 10))
    }
    
    // Calculate speed consistency
    let speedConsistency = 1
    if (stroke.points.length > 2) {
      const speeds: number[] = []
      for (let i = 1; i < stroke.points.length; i++) {
        const prev = stroke.points[i - 1]
        const curr = stroke.points[i]
        const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2))
        const timeDiff = curr.timestamp - prev.timestamp
        const speed = timeDiff > 0 ? distance / timeDiff : 0
        speeds.push(speed)
      }
      
      // Calculate coefficient of variation
      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
      const variance = speeds.reduce((sum, speed) => sum + Math.pow(speed - avgSpeed, 2), 0) / speeds.length
      const stdDev = Math.sqrt(variance)
      speedConsistency = avgSpeed > 0 ? Math.max(0, 1 - stdDev / avgSpeed) : 1
    }
    
    // Combined accuracy score
    const accuracy = Math.round((lengthAccuracy * 0.4 + smoothness * 0.3 + speedConsistency * 0.3) * 100)

    return { order, direction, accuracy }
  }, [])

  const validateStrokeSequence = useCallback((strokes: Stroke[]): { isValid: boolean; expectedOrder: number[]; actualOrder: number[] } => {
    const expectedOrder = characterStrokeData.current.map(s => s.order).sort((a, b) => a - b)
    const actualOrder = strokes.map(stroke => detectStrokeOrder(stroke).order).sort((a, b) => a - b)
    
    const isValid = expectedOrder.length === actualOrder.length && 
                   expectedOrder.every((order, index) => order === actualOrder[index])

    return { isValid, expectedOrder, actualOrder }
  }, [detectStrokeOrder])

  const isStrokeCorrect = useCallback((stroke: Stroke, expectedStroke: StrokeOrder): boolean => {
    // Enhanced stroke correctness check with advanced algorithms
    if (stroke.points.length < 2 || expectedStroke.points.length < 2) {
      return false
    }

    const detected = detectStrokeOrder(stroke)
    
    // Check stroke order
    if (detected.order !== expectedStroke.order) {
      return false
    }

    // Check stroke direction
    if (detected.direction !== expectedStroke.direction) {
      return false
    }

    // Advanced position accuracy using dynamic time warping concept
    const strokeStart = stroke.points[0]
    const strokeEnd = stroke.points[stroke.points.length - 1]
    const expectedStart = expectedStroke.points[0]
    const expectedEnd = expectedStroke.points[expectedStroke.points.length - 1]

    const startDistance = Math.sqrt(
      Math.pow(strokeStart.x - expectedStart.x, 2) + 
      Math.pow(strokeStart.y - expectedStart.y, 2)
    )
    const endDistance = Math.sqrt(
      Math.pow(strokeEnd.x - expectedEnd.x, 2) + 
      Math.pow(strokeEnd.y - expectedEnd.y, 2)
    )

    // Dynamic tolerance based on stroke characteristics
    const baseTolerance = 50
    const lengthFactor = Math.min(stroke.points.length / expectedStroke.points.length, 2)
    const tolerance = baseTolerance * lengthFactor

    // Shape similarity check using curvature analysis
    let shapeSimilarity = 1
    if (stroke.points.length > 2 && expectedStroke.points.length > 2) {
      // Calculate curvature for both strokes
      const strokeCurvature = calculateCurvature(stroke.points)
      const expectedCurvature = calculateCurvature(expectedStroke.points)
      
      // Compare curvature patterns
      const curvatureDiff = Math.abs(strokeCurvature - expectedCurvature)
      shapeSimilarity = Math.max(0, 1 - curvatureDiff / 100)
    }

    const positionAccuracy = startDistance < tolerance && endDistance < tolerance
    const accuracyThreshold = 60 // Lowered threshold for more lenient matching
    
    return positionAccuracy && detected.accuracy > accuracyThreshold && shapeSimilarity > 0.7
  }, [detectStrokeOrder])

  // Helper function to calculate stroke curvature
  const calculateCurvature = useCallback((points: StrokePoint[]): number => {
    if (points.length < 3) return 0
    
    let totalCurvature = 0
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const next = points[i + 1]
      
      // Calculate angle between consecutive segments
      const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x)
      const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x)
      const angleDiff = Math.abs(angle2 - angle1)
      
      totalCurvature += angleDiff
    }
    
    return totalCurvature / (points.length - 2)
  }, [])

  // Initialize stroke data when character changes
  useState(() => {
    initializeStrokeData()
  })

  return {
    startStroke,
    addPoint,
    endStroke,
    undoStroke,
    redoStroke,
    clearCanvas,
    calculateAccuracy,
    getStrokeOrder,
    isStrokeCorrect,
    detectStrokeOrder,
    validateStrokeSequence,
    currentStroke,
    strokeHistory,
    historyIndex,
    currentStrokeOrder,
    strokeOrderFeedback
  }
}

