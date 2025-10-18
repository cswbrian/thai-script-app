import React from 'react'
import type { CharacterGroup } from '../../utils/characters'

interface CharacterGroupTabsProps {
  groups: CharacterGroup[]
  activeGroup: string
  onGroupChange: (groupId: string) => void
}

const CharacterGroupTabs: React.FC<CharacterGroupTabsProps> = ({
  groups,
  activeGroup,
  onGroupChange
}) => {
  // Group tabs by category for better organization
  const consonantGroups = groups.filter(g => g.id.startsWith('consonants'))
  const vowelGroups = groups.filter(g => g.id.startsWith('vowels'))
  const otherGroups = groups.filter(g => !g.id.startsWith('consonants') && !g.id.startsWith('vowels'))

  const TabButton: React.FC<{ group: CharacterGroup; isActive: boolean }> = ({ group, isActive }) => (
    <button
      onClick={() => onGroupChange(group.id)}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 touch-button
        ${isActive 
          ? 'bg-white shadow-sm border border-gray-200' 
          : 'hover:bg-gray-50'
        }
      `}
    >
      <div className={`w-3 h-3 rounded-full ${group.color}`}></div>
      <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
        {group.name}
      </span>
      <span className={`text-xs px-2 py-1 rounded-full ${
        isActive ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-500'
      }`}>
        {group.characters.length}
      </span>
    </button>
  )

  return (
    <div className="space-y-4">
      {/* Consonants Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Consonants</h3>
        <div className="flex flex-wrap gap-2">
          {consonantGroups.map((group) => (
            <TabButton
              key={group.id}
              group={group}
              isActive={activeGroup === group.id}
            />
          ))}
        </div>
      </div>

      {/* Vowels Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Vowels</h3>
        <div className="flex flex-wrap gap-2">
          {vowelGroups.map((group) => (
            <TabButton
              key={group.id}
              group={group}
              isActive={activeGroup === group.id}
            />
          ))}
        </div>
      </div>

      {/* Other Groups Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tones & Symbols</h3>
        <div className="flex flex-wrap gap-2">
          {otherGroups.map((group) => (
            <TabButton
              key={group.id}
              group={group}
              isActive={activeGroup === group.id}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {consonantGroups.reduce((sum, group) => sum + group.characters.length, 0)}
            </div>
            <div className="text-xs text-gray-600">Consonants</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {vowelGroups.reduce((sum, group) => sum + group.characters.length, 0)}
            </div>
            <div className="text-xs text-gray-600">Vowels</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {otherGroups.reduce((sum, group) => sum + group.characters.length, 0)}
            </div>
            <div className="text-xs text-gray-600">Others</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterGroupTabs
