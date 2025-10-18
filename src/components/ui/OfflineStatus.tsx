import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  WifiIcon,
  SignalSlashIcon,
  CloudIcon,
  ArrowPathIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useOffline } from '../../hooks/useOffline'
import { TouchButton } from '../ui/TouchComponents'
import { ResponsiveText, ResponsiveHeading, ResponsiveBadge } from '../ui/ResponsiveTypography'

interface OfflineStatusProps {
  className?: string
  showDetails?: boolean
  position?: 'top' | 'bottom' | 'floating'
}

const OfflineStatus: React.FC<OfflineStatusProps> = ({
  className = '',
  showDetails = false,
  position = 'floating'
}) => {
  const {
    isOnline,
    isOffline,
    cacheInfo,
    isActive,
    clearAllCaches,
    updateServiceWorker,
    formatCacheSize,
    isSupported
  } = useOffline()

  const [showCacheDetails, setShowCacheDetails] = useState(false)
  const [isClearingCache, setIsClearingCache] = useState(false)
  const [isUpdatingSW, setIsUpdatingSW] = useState(false)

  const handleClearCache = async () => {
    setIsClearingCache(true)
    const success = await clearAllCaches()
    setIsClearingCache(false)
    
    if (success) {
      // Show success message
      setTimeout(() => setShowCacheDetails(false), 2000)
    }
  }

  const handleUpdateServiceWorker = async () => {
    setIsUpdatingSW(true)
    const success = await updateServiceWorker()
    setIsUpdatingSW(false)
    
    if (success) {
      // Reload page to activate new service worker
      window.location.reload()
    }
  }

  const positionClasses = {
    top: 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
    bottom: 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
    floating: 'fixed top-4 right-4 z-50'
  }

  const statusColor = isOnline ? 'bg-green-500' : 'bg-red-500'
  const statusIcon = isOnline ? WifiIcon : SignalSlashIcon
  const StatusIcon = statusIcon

  if (!isSupported) {
    return null
  }

  return (
    <>
      {/* Main Status Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`${positionClasses[position]} ${className}`}
      >
        <div className={`${statusColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 min-h-[44px]`}>
          <StatusIcon className="h-5 w-5" />
          <ResponsiveText variant="caption" color="white" weight="medium">
            {isOnline ? 'Online' : 'Offline'}
          </ResponsiveText>
          
          {showDetails && (
            <button
              onClick={() => setShowCacheDetails(!showCacheDetails)}
              className="ml-2 p-1 hover:bg-white hover:bg-opacity-20 rounded"
            >
              <CloudIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Cache Details Panel */}
      <AnimatePresence>
        {showCacheDetails && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 z-40 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <ResponsiveHeading level={4}>Offline Status</ResponsiveHeading>
                <button
                  onClick={() => setShowCacheDetails(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                )}
                <ResponsiveText variant="body" weight="medium">
                  {isOnline ? 'Connected to internet' : 'Working offline'}
                </ResponsiveText>
              </div>

              {/* Service Worker Status */}
              <div className="space-y-2">
                <ResponsiveText variant="caption" color="muted">
                  Service Worker
                </ResponsiveText>
                <div className="flex items-center space-x-2">
                  {isActive ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                  )}
                  <ResponsiveText variant="caption">
                    {isActive ? 'Active' : 'Inactive'}
                  </ResponsiveText>
                </div>
              </div>

              {/* Cache Information */}
              <div className="space-y-2">
                <ResponsiveText variant="caption" color="muted">
                  Cache Storage
                </ResponsiveText>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <ResponsiveText variant="caption">Size:</ResponsiveText>
                    <ResponsiveText variant="caption" weight="medium">
                      {formatCacheSize(cacheInfo.size)}
                    </ResponsiveText>
                  </div>
                  <div className="flex justify-between">
                    <ResponsiveText variant="caption">Entries:</ResponsiveText>
                    <ResponsiveText variant="caption" weight="medium">
                      {cacheInfo.entries}
                    </ResponsiveText>
                  </div>
                  <div className="flex justify-between">
                    <ResponsiveText variant="caption">Updated:</ResponsiveText>
                    <ResponsiveText variant="caption" weight="medium">
                      {cacheInfo.lastUpdated.toLocaleTimeString()}
                    </ResponsiveText>
                  </div>
                </div>
              </div>

              {/* Available Offline Features */}
              <div className="space-y-2">
                <ResponsiveText variant="caption" color="muted">
                  Available Offline
                </ResponsiveText>
                <div className="flex flex-wrap gap-1">
                  <ResponsiveBadge variant="success" size="sm">Characters</ResponsiveBadge>
                  <ResponsiveBadge variant="success" size="sm">Audio</ResponsiveBadge>
                  <ResponsiveBadge variant="success" size="sm">Quizzes</ResponsiveBadge>
                  <ResponsiveBadge variant="success" size="sm">Progress</ResponsiveBadge>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <TouchButton
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={handleClearCache}
                  loading={isClearingCache}
                  icon={<TrashIcon className="h-4 w-4" />}
                >
                  Clear Cache
                </TouchButton>
                
                {!isOnline && (
                  <TouchButton
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={handleUpdateServiceWorker}
                    loading={isUpdatingSW}
                    icon={<ArrowPathIcon className="h-4 w-4" />}
                  >
                    Update App
                  </TouchButton>
                )}
              </div>

              {/* Offline Tips */}
              {isOffline && (
                <div className="bg-blue-50 rounded p-3">
                  <ResponsiveText variant="caption" color="primary" weight="medium">
                    💡 Tip: You can continue learning offline with cached content!
                  </ResponsiveText>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default OfflineStatus
