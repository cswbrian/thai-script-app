import { useCallback, useRef, useState, useEffect } from 'react'
import { Howl } from 'howler'
import AudioManager, { generateAudioText, checkAudioFileExists } from '../utils/audio'
import type { ThaiCharacter } from '../utils/characters'

interface AudioState {
  isPlaying: boolean
  isLoading: boolean
  error: string | null
}

interface UseAudioReturn {
  playAudio: (audioPath: string, character?: ThaiCharacter) => Promise<void>
  stopAudio: () => void
  isPlaying: boolean
  isLoading: boolean
  error: string | null
}

export const useAudio = (): UseAudioReturn => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    error: null,
  })

  const currentHowl = useRef<Howl | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentHowl.current) {
        currentHowl.current.stop()
        currentHowl.current = null
      }
    }
  }, [])

  const playAudio = useCallback(async (audioPath: string, character?: ThaiCharacter): Promise<void> => {
    let loadingTimeout: number | null = null
    
    try {
      // Stop any currently playing audio
      if (currentHowl.current) {
        currentHowl.current.stop()
        currentHowl.current = null
      }

      setState({
        isPlaying: false,
        isLoading: true,
        error: null,
      })

      // Set a timeout to prevent infinite loading state
      loadingTimeout = setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false, error: 'Audio loading timeout' }))
      }, 5000) // 5 second timeout

      // Check if audio file exists and is a valid audio file
      const audioExists = await checkAudioFileExists(audioPath)
      
      // If no audio file exists and we have character data, use TTS fallback
      if (!audioExists && character) {
        // Fallback to speech synthesis
        const audioManager = AudioManager.getInstance()
        if (audioManager.isSpeechSynthesisAvailable()) {
          const audioText = generateAudioText(character)
          await audioManager.playFallbackAudio({
            text: audioText,
            language: 'th-TH', // Use Thai for proper pronunciation
            rate: 0.6,
            pitch: 1.0,
            volume: 0.9
          })
          setState({
            isPlaying: false,
            isLoading: false,
            error: null,
          })
          return
        } else {
          throw new Error('Audio file not found and speech synthesis not available')
        }
      }

      // Create new Howl instance
      const howl = new Howl({
        src: [audioPath],
        format: ['mp3', 'wav', 'ogg'],
        preload: true,
        html5: false, // Use Web Audio API for better performance
        onload: () => {
          if (loadingTimeout) clearTimeout(loadingTimeout)
          setState(prev => ({ ...prev, isLoading: false }))
        },
        onloaderror: (_, error) => {
          if (loadingTimeout) clearTimeout(loadingTimeout)
          console.warn(`Failed to load audio: ${audioPath}`, error)
          
          // Try fallback if character data is available
          if (character) {
            const audioManager = AudioManager.getInstance()
            if (audioManager.isSpeechSynthesisAvailable()) {
              const audioText = generateAudioText(character)
              audioManager.playFallbackAudio({
                text: audioText,
                language: 'th-TH', // Use Thai for proper pronunciation
                rate: 0.6,
                pitch: 1.0,
                volume: 1.0
              })
              return
            }
          }
          
          setState({
            isPlaying: false,
            isLoading: false,
            error: `Failed to load audio: ${audioPath}`,
          })
        },
        onplay: () => {
          if (loadingTimeout) clearTimeout(loadingTimeout)
          setState(prev => ({ ...prev, isPlaying: true, isLoading: false, error: null }))
        },
        onend: () => {
          setState(prev => ({ ...prev, isPlaying: false, isLoading: false }))
          currentHowl.current = null
        },
        onstop: () => {
          setState(prev => ({ ...prev, isPlaying: false, isLoading: false }))
          currentHowl.current = null
        },
        onpause: () => {
          setState(prev => ({ ...prev, isPlaying: false, isLoading: false }))
        },
      })

      currentHowl.current = howl

      // Start playing
      howl.play()

    } catch (error) {
      if (loadingTimeout) clearTimeout(loadingTimeout)
      console.error('Error playing audio:', error)
      setState({
        isPlaying: false,
        isLoading: false,
        error: `Error playing audio: ${error}`,
      })
    }
  }, [])

  const stopAudio = useCallback(() => {
    if (currentHowl.current) {
      currentHowl.current.stop()
      currentHowl.current = null
    }
    setState(prev => ({ ...prev, isPlaying: false, isLoading: false }))
  }, [])

  return {
    playAudio,
    stopAudio,
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    error: state.error,
  }
}

export default useAudio
