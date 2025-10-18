import React, { useCallback, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'

// Simple swipe gesture hook using touch events
interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  velocity?: number
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocity = 0.3
}: UseSwipeGestureOptions = {}) => {
  const [spring, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { tension: 300, friction: 30 }
  }))

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
    api.start({ scale: 0.95 })
  }, [api])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const deltaTime = Date.now() - touchStart.current.time
    const velocityX = Math.abs(deltaX) / deltaTime
    const velocityY = Math.abs(deltaY) / deltaTime

    api.start({
      x: 0,
      y: 0,
      scale: 1,
      immediate: false
    })

    // Check for swipe gestures
    if (Math.abs(deltaX) > threshold || velocityX > velocity) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    if (Math.abs(deltaY) > threshold || velocityY > velocity) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown()
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp()
      }
    }

    touchStart.current = null
  }, [threshold, velocity, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, api])

  const bind = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  }

  return { bind, spring }
}

// Swipeable card component
interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  className?: string
  threshold?: number
  velocity?: number
  disabled?: boolean
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = '',
  threshold = 50,
  velocity = 0.3,
  disabled = false
}) => {
  const { bind, spring } = useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold,
    velocity
  })

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <animated.div
      {...bind}
      style={{
        transform: spring.x.to(x => spring.y.to(y => spring.scale.to(s => `translate3d(${x}px, ${y}px, 0) scale(${s})`))) as any
      }}
      className={`touch-none select-none ${className}`}
    >
      {children}
    </animated.div>
  )
}

// Swipeable list item component
interface SwipeableListItemProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
  threshold?: number
  velocity?: number
  disabled?: boolean
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
}

const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = '',
  threshold = 100,
  velocity = 0.3,
  disabled = false,
  leftAction,
  rightAction
}) => {
  const [spring, api] = useSpring(() => ({
    x: 0,
    config: { tension: 300, friction: 30 }
  }))

  const touchStart = useRef<{ x: number; time: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      time: Date.now()
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.current.x
    
    api.start({
      x: Math.max(-150, Math.min(150, deltaX)),
      immediate: true
    })
  }, [api])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaTime = Date.now() - touchStart.current.time
    const velocityX = Math.abs(deltaX) / deltaTime

    const shouldSwipeLeft = deltaX < -threshold || velocityX > velocity
    const shouldSwipeRight = deltaX > threshold || velocityX > velocity

    if (shouldSwipeLeft && onSwipeLeft) {
      onSwipeLeft()
    } else if (shouldSwipeRight && onSwipeRight) {
      onSwipeRight()
    }

    api.start({
      x: 0,
      immediate: false
    })

    touchStart.current = null
  }, [threshold, velocity, onSwipeLeft, onSwipeRight, api])

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background actions */}
      <div className="absolute inset-0 flex">
        {leftAction && (
          <div className="flex items-center justify-end bg-red-500 text-white px-4 w-1/2">
            {leftAction}
          </div>
        )}
        {rightAction && (
          <div className="flex items-center justify-start bg-green-500 text-white px-4 w-1/2 ml-auto">
            {rightAction}
          </div>
        )}
      </div>

      {/* Swipeable content */}
      <animated.div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: spring.x.to(x => `translate3d(${x}px, 0, 0)`),
          backgroundColor: 'white'
        }}
        className={`relative z-10 touch-none select-none ${className}`}
      >
        {children}
      </animated.div>
    </div>
  )
}

// Swipeable carousel component
interface SwipeableCarouselProps {
  children: React.ReactNode[]
  currentIndex: number
  onIndexChange: (index: number) => void
  className?: string
  threshold?: number
  velocity?: number
  disabled?: boolean
}

const SwipeableCarousel: React.FC<SwipeableCarouselProps> = ({
  children,
  currentIndex,
  onIndexChange,
  className = '',
  threshold = 100,
  velocity = 0.3,
  disabled = false
}) => {
  const [spring, api] = useSpring(() => ({
    x: 0,
    config: { tension: 300, friction: 30 }
  }))

  const touchStart = useRef<{ x: number; time: number } | null>(null)

  const handleSwipeLeft = useCallback(() => {
    if (currentIndex < children.length - 1) {
      onIndexChange(currentIndex + 1)
    }
  }, [currentIndex, children.length, onIndexChange])

  const handleSwipeRight = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1)
    }
  }, [currentIndex, onIndexChange])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      time: Date.now()
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.current.x
    
    api.start({
      x: Math.max(-200, Math.min(200, deltaX)),
      immediate: true
    })
  }, [api])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaTime = Date.now() - touchStart.current.time
    const velocityX = Math.abs(deltaX) / deltaTime

    const shouldSwipeLeft = deltaX < -threshold || velocityX > velocity
    const shouldSwipeRight = deltaX > threshold || velocityX > velocity

    if (shouldSwipeLeft) {
      handleSwipeLeft()
    } else if (shouldSwipeRight) {
      handleSwipeRight()
    }

    api.start({
      x: 0,
      immediate: false
    })

    touchStart.current = null
  }, [threshold, velocity, handleSwipeLeft, handleSwipeRight, api])

  if (disabled) {
    return (
      <div className={className}>
        {children[currentIndex]}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <animated.div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: spring.x.to(x => `translate3d(${x}px, 0, 0)`)
        }}
        className="touch-none select-none"
      >
        {children[currentIndex]}
      </animated.div>
    </div>
  )
}

// Swipeable modal component
interface SwipeableModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
  threshold?: number
  velocity?: number
  swipeToClose?: boolean
}

const SwipeableModal: React.FC<SwipeableModalProps> = ({
  children,
  isOpen,
  onClose,
  className = '',
  threshold = 100,
  velocity = 0.3,
  swipeToClose = true
}) => {
  const [spring, api] = useSpring(() => ({
    y: 0,
    opacity: 0,
    config: { tension: 300, friction: 30 }
  }))

  const touchStart = useRef<{ y: number; time: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      y: touch.clientY,
      time: Date.now()
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    
    const touch = e.touches[0]
    const deltaY = touch.clientY - touchStart.current.y
    
    if (deltaY > 0) {
      api.start({
        y: Math.min(200, deltaY),
        immediate: true
      })
    }
  }, [api])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.changedTouches[0]
    const deltaY = touch.clientY - touchStart.current.y
    const deltaTime = Date.now() - touchStart.current.time
    const velocityY = Math.abs(deltaY) / deltaTime

    const shouldClose = deltaY > threshold || velocityY > velocity

    if (shouldClose && swipeToClose) {
      onClose()
    } else {
      api.start({
        y: 0,
        immediate: false
      })
    }

    touchStart.current = null
  }, [threshold, velocity, swipeToClose, onClose, api])

  React.useEffect(() => {
    api.start({
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 100
    })
  }, [isOpen, api])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <animated.div
        style={{ opacity: spring.opacity }}
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal content */}
      <animated.div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: spring.y.to(y => `translate3d(0, ${y}px, 0)`),
          opacity: spring.opacity
        }}
        className={`relative bg-white rounded-t-xl shadow-xl w-full max-w-md ${className}`}
      >
        {/* Swipe indicator */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {children}
      </animated.div>
    </div>
  )
}

// Swipe gesture utilities
export const SwipeGestureUtils = {
  // Detect swipe direction
  getSwipeDirection: (startX: number, startY: number, endX: number, endY: number, threshold: number = 50) => {
    const deltaX = endX - startX
    const deltaY = endY - startY
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        return deltaX > 0 ? 'right' : 'left'
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        return deltaY > 0 ? 'down' : 'up'
      }
    }
    
    return null
  },

  // Calculate swipe velocity
  getSwipeVelocity: (startTime: number, endTime: number, distance: number) => {
    const timeDelta = endTime - startTime
    return timeDelta > 0 ? distance / timeDelta : 0
  },

  // Check if swipe meets threshold
  isSwipeValid: (distance: number, velocity: number, threshold: number = 50, velocityThreshold: number = 0.3) => {
    return Math.abs(distance) > threshold || Math.abs(velocity) > velocityThreshold
  }
}

export {
  SwipeableCard,
  SwipeableListItem,
  SwipeableCarousel,
  SwipeableModal
}

export type {
  UseSwipeGestureOptions,
  SwipeableCardProps,
  SwipeableListItemProps,
  SwipeableCarouselProps,
  SwipeableModalProps
}