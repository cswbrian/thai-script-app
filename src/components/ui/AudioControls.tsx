import React from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { useAudio } from '../../hooks/useAudio'
import type { ThaiCharacter } from '../../utils/characters'

interface AudioControlsProps {
  audioPath: string
  characterName: string
  character?: ThaiCharacter
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

const AudioControls: React.FC<AudioControlsProps> = ({
  audioPath,
  characterName,
  character,
  size = 'md',
  className = '',
  showLabel = false,
}) => {
  const { playAudio, stopAudio, isPlaying, isLoading, error } = useAudio()

  const handleAudioClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isPlaying) {
      stopAudio()
    } else {
      await playAudio(audioPath, character)
    }
  }

  const sizeClasses = {
    sm: 'h-3 w-3 p-1',
    md: 'h-4 w-4 p-1.5',
    lg: 'h-5 w-5 p-2',
  }

  const buttonClasses = `
    rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-button
    ${sizeClasses[size]}
    ${isLoading ? 'animate-pulse' : ''}
    ${error ? 'bg-red-100 hover:bg-red-200' : ''}
    ${className}
  `.trim()

  const iconClasses = `
    ${error ? 'text-red-600' : isPlaying ? 'text-blue-600' : 'text-gray-600'}
  `.trim()

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={handleAudioClick}
        className={buttonClasses}
        disabled={isLoading}
        aria-label={`${isPlaying ? 'Stop' : 'Play'} pronunciation for ${characterName}`}
        title={`${isPlaying ? 'Stop' : 'Play'} pronunciation for ${characterName}`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full border border-gray-300 border-t-gray-600" />
        ) : isPlaying ? (
          <SpeakerXMarkIcon className={`${sizeClasses[size].split(' ')[0]} ${iconClasses}`} />
        ) : (
          <SpeakerWaveIcon className={`${sizeClasses[size].split(' ')[0]} ${iconClasses}`} />
        )}
      </button>
      
      {showLabel && (
        <span className="text-xs text-gray-500">
          {isPlaying ? 'Playing...' : isLoading ? 'Loading...' : 'Listen'}
        </span>
      )}
      
      {error && (
        <span className="text-xs text-red-500" title={error}>
          Audio Error
        </span>
      )}
    </div>
  )
}

export default AudioControls
