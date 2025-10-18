import { useState, useEffect, useCallback } from 'react'

interface OfflineStatus {
  isOnline: boolean
  isOffline: boolean
  lastOnline: Date | null
  lastOffline: Date | null
}

interface CacheInfo {
  size: number
  entries: number
  lastUpdated: Date
}

interface ServiceWorkerInfo {
  isSupported: boolean
  isRegistered: boolean
  isActive: boolean
  registration: ServiceWorkerRegistration | null
}

export const useOffline = () => {
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
    lastOnline: navigator.onLine ? new Date() : null,
    lastOffline: !navigator.onLine ? new Date() : null
  })

  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({
    size: 0,
    entries: 0,
    lastUpdated: new Date()
  })

  const [swInfo, setSwInfo] = useState<ServiceWorkerInfo>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isActive: false,
    registration: null
  })

  // Update online/offline status
  const updateOnlineStatus = useCallback(() => {
    const isOnline = navigator.onLine
    const now = new Date()
    
    setOfflineStatus(prev => ({
      isOnline,
      isOffline: !isOnline,
      lastOnline: isOnline ? now : prev.lastOnline,
      lastOffline: !isOnline ? now : prev.lastOffline
    }))
  }, [])

  // Get cache information
  const getCacheInfo = useCallback(async (): Promise<CacheInfo> => {
    if (!('caches' in window)) {
      return { size: 0, entries: 0, lastUpdated: new Date() }
    }

    try {
      const cacheNames = await caches.keys()
      let totalSize = 0
      let totalEntries = 0

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const keys = await cache.keys()
        totalEntries += keys.length

        for (const request of keys) {
          const response = await cache.match(request)
          if (response) {
            const blob = await response.blob()
            totalSize += blob.size
          }
        }
      }

      const info = {
        size: totalSize,
        entries: totalEntries,
        lastUpdated: new Date()
      }

      setCacheInfo(info)
      return info
    } catch (error) {
      console.error('Error getting cache info:', error)
      return { size: 0, entries: 0, lastUpdated: new Date() }
    }
  }, [])

  // Clear all caches
  const clearAllCaches = useCallback(async (): Promise<boolean> => {
    if (!('caches' in window)) {
      return false
    }

    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      
      // Update cache info
      await getCacheInfo()
      return true
    } catch (error) {
      console.error('Error clearing caches:', error)
      return false
    }
  }, [getCacheInfo])

  // Preload resources
  const preloadResources = useCallback(async (urls: string[]): Promise<boolean> => {
    if (!('caches' in window)) {
      return false
    }

    try {
      const cache = await caches.open('preload-cache')
      await cache.addAll(urls)
      
      // Update cache info
      await getCacheInfo()
      return true
    } catch (error) {
      console.error('Error preloading resources:', error)
      return false
    }
  }, [getCacheInfo])

  // Get service worker information
  const getServiceWorkerInfo = useCallback(async (): Promise<ServiceWorkerInfo> => {
    if (!('serviceWorker' in navigator)) {
      return {
        isSupported: false,
        isRegistered: false,
        isActive: false,
        registration: null
      }
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      const activeSW = registration?.active

      const info = {
        isSupported: true,
        isRegistered: !!registration,
        isActive: !!activeSW,
        registration: registration || null
      }

      setSwInfo(info)
      return info
    } catch (error) {
      console.error('Error getting service worker info:', error)
      return {
        isSupported: true,
        isRegistered: false,
        isActive: false,
        registration: null
      }
    }
  }, [])

  // Update service worker
  const updateServiceWorker = useCallback(async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating service worker:', error)
      return false
    }
  }, [])

  // Skip waiting for service worker
  const skipWaiting = useCallback(async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        return true
      }
      return false
    } catch (error) {
      console.error('Error skipping waiting:', error)
      return false
    }
  }, [])

  // Cache specific resources
  const cacheResources = useCallback(async (urls: string[], cacheName: string = 'dynamic-cache'): Promise<boolean> => {
    if (!('caches' in window)) {
      return false
    }

    try {
      const cache = await caches.open(cacheName)
      await cache.addAll(urls)
      
      // Update cache info
      await getCacheInfo()
      return true
    } catch (error) {
      console.error('Error caching resources:', error)
      return false
    }
  }, [getCacheInfo])

  // Check if resource is cached
  const isResourceCached = useCallback(async (url: string): Promise<boolean> => {
    if (!('caches' in window)) {
      return false
    }

    try {
      const cacheNames = await caches.keys()
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const response = await cache.match(url)
        if (response) {
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error checking if resource is cached:', error)
      return false
    }
  }, [])

  // Format cache size
  const formatCacheSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Initial cache info
    getCacheInfo()
    getServiceWorkerInfo()

    // Periodic cache info update
    const interval = setInterval(getCacheInfo, 60000) // Every minute

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      clearInterval(interval)
    }
  }, [updateOnlineStatus, getCacheInfo, getServiceWorkerInfo])

  return {
    // Status
    ...offlineStatus,
    
    // Cache management
    cacheInfo,
    getCacheInfo,
    clearAllCaches,
    preloadResources,
    cacheResources,
    isResourceCached,
    formatCacheSize,
    
    // Service worker management
    ...swInfo,
    getServiceWorkerInfo,
    updateServiceWorker,
    skipWaiting,
    
    // Utilities
    isSupported: 'serviceWorker' in navigator && 'caches' in window
  }
}

export default useOffline
