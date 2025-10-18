import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCharacterGroups } from '../../utils/characters'
import type { ThaiCharacter } from '../../utils/characters'
import CharacterCard from './CharacterCard'
import CharacterGroupTabs from './CharacterGroupTabs'

const ThaiCharacterGrid: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string>('consonants-mid')
  const navigate = useNavigate()
  const characterGroups = getCharacterGroups()
  const currentGroup = characterGroups.find(group => group.id === activeGroup)

  const handleGroupChange = (groupId: string) => {
    setActiveGroup(groupId)
  }

  const handleCharacterClick = (character: ThaiCharacter) => {
    // Navigate to character detail page
    navigate(`/character/${character.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 thai-font">
          Thai Character Overview
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore all Thai consonants, vowels, and tone marks. 
          Click on any character to learn more or practice writing.
        </p>
      </div>

      {/* Group Navigation Tabs */}
      <CharacterGroupTabs
        groups={characterGroups}
        activeGroup={activeGroup}
        onGroupChange={handleGroupChange}
      />

      {/* Current Group Info */}
      {currentGroup && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-4 h-4 rounded-full ${currentGroup.color}`}></div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentGroup.name}
              </h2>
              <p className="text-gray-600">
                {currentGroup.description} • {currentGroup.characters.length} characters
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Character Grid */}
      {currentGroup && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {currentGroup.characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => handleCharacterClick(character)}
                groupColor={currentGroup.color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Learning Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {characterGroups.reduce((sum, group) => 
                group.id.startsWith('consonants') ? sum + group.characters.length : sum, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Consonants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {characterGroups.reduce((sum, group) => 
                group.id.startsWith('vowels') ? sum + group.characters.length : sum, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Vowels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {characterGroups.find(g => g.id === 'tone-marks')?.characters.length || 0}
            </div>
            <div className="text-sm text-gray-600">Tone Marks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {characterGroups.reduce((sum, group) => sum + group.characters.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThaiCharacterGrid
