// Audio utility functions for Thai Script Learning PWA
// Handles fallback to Web Speech API when audio files are not available

interface AudioFallbackOptions {
  text: string
  language?: string
  rate?: number
  pitch?: number
  volume?: number
}

export class AudioManager {
  private static instance: AudioManager
  private speechSynthesis: SpeechSynthesis | null = null

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  /**
   * Play audio using Web Speech API as fallback
   */
  public playFallbackAudio(options: AudioFallbackOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      const utterance = new SpeechSynthesisUtterance(options.text)
      utterance.lang = options.language || 'th-TH'
      utterance.rate = options.rate || 0.8
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 1.0

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`))

      this.speechSynthesis.speak(utterance)
    })
  }

  /**
   * Get available voices for Thai language
   */
  public getThaiVoices(): SpeechSynthesisVoice[] {
    if (!this.speechSynthesis) return []
    
    return this.speechSynthesis.getVoices().filter(voice => 
      voice.lang.startsWith('th') || voice.lang.includes('Thai')
    )
  }

  /**
   * Check if speech synthesis is available
   */
  public isSpeechSynthesisAvailable(): boolean {
    return this.speechSynthesis !== null
  }

  /**
   * Stop any currently playing speech
   */
  public stopSpeech(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel()
    }
  }
}

/**
 * Generate fallback audio text for Thai characters
 */
export const generateAudioText = (character: {
  id: string
  name: string
  pronunciation: string
  meaning?: string
}): string => {
  // Create a descriptive text for speech synthesis
  const parts = [
    character.id,
    character.name,
    `pronounced ${character.pronunciation}`
  ]
  
  if (character.meaning) {
    parts.push(`meaning ${character.meaning}`)
  }
  
  return parts.join(', ')
}

/**
 * Check if audio file exists
 */
export const checkAudioFileExists = async (audioPath: string): Promise<boolean> => {
  try {
    const response = await fetch(audioPath, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

export default AudioManager
