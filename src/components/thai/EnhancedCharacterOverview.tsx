import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  ChevronUpIcon, 
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { getCharacterGroups } from '../../utils/characters'
import type { ThaiCharacter, CharacterGroup } from '../../utils/characters'
import CharacterCard from './CharacterCard'
import { TouchButton } from '../ui/TouchComponents'
import { ResponsiveHeading, ResponsiveParagraph } from '../ui/ResponsiveTypography'

const EnhancedCharacterOverview: React.FC = () => {
  const navigate = useNavigate()
  const characterGroups = getCharacterGroups()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['consonants-mid']))
  
  // Refs for smooth scrolling
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleCharacterClick = (character: ThaiCharacter) => {
    navigate(`/character/${character.id}`)
  }

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const scrollToGroup = (groupId: string) => {
    const element = groupRefs.current[groupId]
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  // Group categories for better organization
  const consonantGroups = characterGroups.filter(g => g.id.startsWith('consonants'))
  const vowelGroups = characterGroups.filter(g => g.id.startsWith('vowels'))
  const otherGroups = characterGroups.filter(g => !g.id.startsWith('consonants') && !g.id.startsWith('vowels'))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4">
            {/* Title */}
            <div className="text-center">
              <ResponsiveHeading level={1} thai className="mb-2">
                Thai Character Overview
              </ResponsiveHeading>
              <ResponsiveParagraph color="secondary" className="max-w-2xl mx-auto">
                Explore all Thai consonants, vowels, and tone marks. 
                Click on any character to learn more or practice writing.
              </ResponsiveParagraph>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Quick Navigation */}
              <div className="flex flex-wrap gap-2 justify-center">
                <TouchButton
                  variant="secondary"
                  size="sm"
                  onClick={() => scrollToGroup('consonants-mid')}
                >
                  Consonants
                </TouchButton>
                <TouchButton
                  variant="secondary"
                  size="sm"
                  onClick={() => scrollToGroup('vowels-short')}
                >
                  Vowels
                </TouchButton>
                <TouchButton
                  variant="secondary"
                  size="sm"
                  onClick={() => scrollToGroup('tone-marks')}
                >
                  Tone Marks
                </TouchButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" ref={scrollContainerRef}>
        <div className="space-y-8">
          {/* Consonants Section */}
          {consonantGroups.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <ResponsiveHeading level={2} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">ก</span>
                  </div>
                  <span>Consonants</span>
                </ResponsiveHeading>
                <div className="text-sm text-gray-500">
                  {consonantGroups.reduce((sum, group) => sum + group.characters.length, 0)} characters
                </div>
              </div>

              <div className="space-y-6">
                {consonantGroups.map((group) => (
                  <CharacterGroupSection
                    key={group.id}
                    group={group}
                    isExpanded={expandedGroups.has(group.id)}
                    onToggleExpansion={() => toggleGroupExpansion(group.id)}
                    onCharacterClick={handleCharacterClick}
                    groupRef={(el) => groupRefs.current[group.id] = el}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Vowels Section */}
          {vowelGroups.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <ResponsiveHeading level={2} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">ะ</span>
                  </div>
                  <span>Vowels</span>
                </ResponsiveHeading>
                <div className="text-sm text-gray-500">
                  {vowelGroups.reduce((sum, group) => sum + group.characters.length, 0)} characters
                </div>
              </div>

              <div className="space-y-6">
                {vowelGroups.map((group) => (
                  <CharacterGroupSection
                    key={group.id}
                    group={group}
                    isExpanded={expandedGroups.has(group.id)}
                    onToggleExpansion={() => toggleGroupExpansion(group.id)}
                    onCharacterClick={handleCharacterClick}
                    groupRef={(el) => groupRefs.current[group.id] = el}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Other Groups Section */}
          {otherGroups.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <ResponsiveHeading level={2} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-lg">่</span>
                  </div>
                  <span>Tones & Symbols</span>
                </ResponsiveHeading>
                <div className="text-sm text-gray-500">
                  {otherGroups.reduce((sum, group) => sum + group.characters.length, 0)} characters
                </div>
              </div>

              <div className="space-y-6">
                {otherGroups.map((group) => (
                  <CharacterGroupSection
                    key={group.id}
                    group={group}
                    isExpanded={expandedGroups.has(group.id)}
                    onToggleExpansion={() => toggleGroupExpansion(group.id)}
                    onCharacterClick={handleCharacterClick}
                    groupRef={(el) => groupRefs.current[group.id] = el}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <TouchButton
          variant="primary"
          size="lg"
          onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          icon={<ChevronUpIcon className="h-5 w-5" />}
          className="shadow-lg"
        >
          Top
        </TouchButton>
      </motion.div>
    </div>
  )
}

// Character Group Section Component
interface CharacterGroupSectionProps {
  group: CharacterGroup
  isExpanded: boolean
  onToggleExpansion: () => void
  onCharacterClick: (character: ThaiCharacter) => void
  groupRef: (el: HTMLDivElement | null) => void
}

const CharacterGroupSection: React.FC<CharacterGroupSectionProps> = ({
  group,
  isExpanded,
  onToggleExpansion,
  onCharacterClick,
  groupRef
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={(el) => {
        ref.current = el
        groupRef(el)
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Group Header */}
      <div
        className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${group.color}`}></div>
            <div>
              <ResponsiveHeading level={3} className="text-gray-900">
                {group.name}
              </ResponsiveHeading>
              <ResponsiveParagraph color="secondary" className="text-sm">
                {group.description} • {group.characters.length} characters
              </ResponsiveParagraph>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              {group.characters.length}
            </div>
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Character Grid */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-2 sm:gap-3 md:gap-4">
            {group.characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => onCharacterClick(character)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EnhancedCharacterOverview