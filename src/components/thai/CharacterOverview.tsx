import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCharacterGroups } from '../../utils/characters'
import type { ThaiCharacter } from '../../utils/characters'
import CharacterCard from './CharacterCard'
import { ResponsiveHeading } from '../ui/ResponsiveTypography'

const CharacterOverview: React.FC = () => {
  const navigate = useNavigate()
  
  // Memoize character groups to prevent infinite re-renders
  const characterGroups = useMemo(() => getCharacterGroups(), [])

  const handleCharacterClick = (character: ThaiCharacter) => {
    navigate(`/character/${character.id}`)
  }

  // Group categories
  const consonantGroups = characterGroups.filter(g => g.id.startsWith('consonants'))
  const vowelGroups = characterGroups.filter(g => g.id.startsWith('vowels'))
  const otherGroups = characterGroups.filter(g => !g.id.startsWith('consonants') && !g.id.startsWith('vowels'))

  return (
    <div className="min-h-screen bg-white">
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
                </p>
              </div>

              <div className="space-y-6">
                {consonantGroups.map((group) => (
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
                          groupColor={group.color}
                        />
                      ))}
                    </div>
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
                          groupColor={group.color}
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
                          groupColor={group.color}
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