import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCharacterGroups, getCharacterGroupsByPronunciation } from '../../utils/characters'
import type { ThaiCharacter } from '../../utils/characters'
import CharacterCard from './CharacterCard'
import { ResponsiveHeading } from '../ui/ResponsiveTypography'

const CharacterOverview: React.FC = () => {
  const navigate = useNavigate()
  const [groupByPronunciation, setGroupByPronunciation] = useState(false)
  
  // Memoize character groups to prevent infinite re-renders
  const characterGroups = useMemo(() => {
    return groupByPronunciation ? getCharacterGroupsByPronunciation() : getCharacterGroups()
  }, [groupByPronunciation])

  const handleCharacterClick = (character: ThaiCharacter) => {
    navigate(`/character/${character.id}`)
  }

  // Group categories - works for both symbol and pronunciation grouping
  const consonantGroups = characterGroups.filter(g => g.id.startsWith('consonants'))
  const vowelGroups = characterGroups.filter(g => g.id.startsWith('vowels'))
  const otherGroups = characterGroups.filter(g => !g.id.startsWith('consonants') && !g.id.startsWith('vowels'))

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Toggle */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mt-1">
                {characterGroups.reduce((sum, group) => sum + group.characters.length, 0)} characters
              </p>
            </div>
            
            {/* Tab-style Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setGroupByPronunciation(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  !groupByPronunciation
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Symbol
              </button>
              <button
                onClick={() => setGroupByPronunciation(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  groupByPronunciation
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pronunciation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-8">

          {/* Consonants Section */}
          {consonantGroups.length > 0 && (
            <section>
              <div className="mb-6">
                <ResponsiveHeading level={2} className="text-gray-900 mb-2">
                  Consonants
                </ResponsiveHeading>
                <p className="text-gray-600 text-sm">
                  {consonantGroups.reduce((sum, group) => sum + group.characters.length, 0)} characters
                  {groupByPronunciation && ' grouped by pronunciation'}
                </p>
              </div>

              <div className="space-y-6">
                {consonantGroups.map((group) => (
                  <div key={group.id}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {group.name}
                    </h3>
                    
                    {/* Render class subdivisions for pronunciation groups */}
                    {groupByPronunciation && group.classGroups ? (
                      <div className="space-y-4">
                        {['mid', 'high', 'low'].map((consonantClass) => {
                          const classCharacters = group.classGroups!.get(consonantClass)
                          if (!classCharacters || classCharacters.length === 0) return null
                          
                          return (
                            <div key={consonantClass}>
                              <h4 className="text-md font-medium text-gray-700 mb-2 capitalize">
                                {consonantClass}:
                              </h4>
                              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
                                {classCharacters.map((character) => (
                                  <CharacterCard
                                    key={character.id}
                                    character={character}
                                    onClick={() => handleCharacterClick(character)}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      /* Regular grid for symbol grouping */
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
                        {group.characters.map((character) => (
                          <CharacterCard
                            key={character.id}
                            character={character}
                            onClick={() => handleCharacterClick(character)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Vowels Section */}
          {vowelGroups.length > 0 && (
            <section>
              <div className="mb-6">
                <ResponsiveHeading level={2} className="text-gray-900 mb-2">
                  Vowels
                </ResponsiveHeading>
                <p className="text-gray-600 text-sm">
                  {vowelGroups.reduce((sum, group) => sum + group.characters.length, 0)} characters
                  {groupByPronunciation && ' grouped by pronunciation'}
                </p>
              </div>

              <div className="space-y-6">
                {vowelGroups.map((group) => (
                  <div key={group.id}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {group.name}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
                      {group.characters.map((character) => (
                        <CharacterCard
                          key={character.id}
                          character={character}
                          onClick={() => handleCharacterClick(character)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Other Groups Section */}
          {otherGroups.length > 0 && (
            <section>
              <div className="mb-6">
                <ResponsiveHeading level={2} className="text-gray-900 mb-2">
                  Tones & Symbols
                </ResponsiveHeading>
                <p className="text-gray-600 text-sm">
                  {otherGroups.reduce((sum, group) => sum + group.characters.length, 0)} characters
                  {groupByPronunciation && ' grouped by pronunciation'}
                </p>
              </div>

              <div className="space-y-6">
                {otherGroups.map((group) => (
                  <div key={group.id}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {group.name}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
                      {group.characters.map((character) => (
                        <CharacterCard
                          key={character.id}
                          character={character}
                          onClick={() => handleCharacterClick(character)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default CharacterOverview