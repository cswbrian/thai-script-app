import thaiCharactersData from '../data/thai-characters.json'

export interface ThaiCharacter {
  id: string
  unicode: string
  name: string
  pronunciation: string
  class?: 'mid' | 'high' | 'low'
  type?: 'short' | 'long' | 'compound' | 'symbol' | 'tone' | 'digit'
  position?: 'final' | 'above' | 'below' | 'before'
  strokeCount?: number
  meaning?: string
  tone?: string
  description?: string
  audioPath: string
}

export interface CharacterGroup {
  id: string
  name: string
  description: string
  characters: ThaiCharacter[]
  color: string
}

// Character grouping logic
export const getCharacterGroups = (): CharacterGroup[] => {
  const thaiCharacters = thaiCharactersData as any
  return [
    {
      id: 'consonants-mid',
      name: 'Mid-Class Consonants',
      description: 'Consonants that produce mid tones',
      characters: thaiCharacters.consonants.filter((c: any) => c.class === 'mid'),
      color: 'bg-blue-500'
    },
    {
      id: 'consonants-high',
      name: 'High-Class Consonants',
      description: 'Consonants that produce high tones',
      characters: thaiCharacters.consonants.filter((c: any) => c.class === 'high'),
      color: 'bg-red-500'
    },
    {
      id: 'consonants-low',
      name: 'Low-Class Consonants',
      description: 'Consonants that produce low tones',
      characters: thaiCharacters.consonants.filter((c: any) => c.class === 'low'),
      color: 'bg-green-500'
    },
    {
      id: 'vowels-short',
      name: 'Short Vowels',
      description: 'Short vowel sounds',
      characters: thaiCharacters.vowels.filter((v: any) => v.type === 'short'),
      color: 'bg-purple-500'
    },
    {
      id: 'vowels-long',
      name: 'Long Vowels',
      description: 'Long vowel sounds',
      characters: thaiCharacters.vowels.filter((v: any) => v.type === 'long'),
      color: 'bg-indigo-500'
    },
    {
      id: 'vowels-compound',
      name: 'Compound Vowels',
      description: 'Compound vowel combinations',
      characters: thaiCharacters.vowels.filter((v: any) => v.type === 'compound'),
      color: 'bg-pink-500'
    },
    {
      id: 'tone-marks',
      name: 'Tone Marks',
      description: 'Marks that change the tone of syllables',
      characters: thaiCharacters.toneMarks,
      color: 'bg-orange-500'
    },
    {
      id: 'symbols',
      name: 'Symbols & Digits',
      description: 'Special symbols and Thai numerals',
      characters: thaiCharacters.vowels.filter((v: any) => v.type === 'symbol' || v.type === 'digit'),
      color: 'bg-gray-500'
    }
  ]
}

// Get all characters for a specific group
export const getCharactersByGroup = (groupId: string): ThaiCharacter[] => {
  const groups = getCharacterGroups()
  const group = groups.find(g => g.id === groupId)
  return group ? group.characters : []
}

// Get character by ID
export const getCharacterById = (id: string): ThaiCharacter | null => {
  const thaiCharacters = thaiCharactersData as any
  const allCharacters = [
    ...thaiCharacters.consonants,
    ...thaiCharacters.vowels,
    ...thaiCharacters.toneMarks
  ]
  return allCharacters.find((c: any) => c.id === id) || null
}

// Get characters by class (for consonants)
export const getConsonantsByClass = (className: 'mid' | 'high' | 'low'): ThaiCharacter[] => {
  const thaiCharacters = thaiCharactersData as any
  return thaiCharacters.consonants.filter((c: any) => c.class === className)
}

// Get vowels by type
export const getVowelsByType = (type: 'short' | 'long' | 'compound' | 'symbol' | 'digit'): ThaiCharacter[] => {
  const thaiCharacters = thaiCharactersData as any
  return thaiCharacters.vowels.filter((v: any) => v.type === type)
}


// Get statistics
export const getCharacterStats = () => {
  const thaiCharacters = thaiCharactersData as any
  return {
    totalConsonants: thaiCharacters.consonants.length,
    totalVowels: thaiCharacters.vowels.length,
    totalToneMarks: thaiCharacters.toneMarks.length,
    midClassConsonants: thaiCharacters.consonants.filter((c: any) => c.class === 'mid').length,
    highClassConsonants: thaiCharacters.consonants.filter((c: any) => c.class === 'high').length,
    lowClassConsonants: thaiCharacters.consonants.filter((c: any) => c.class === 'low').length,
    shortVowels: thaiCharacters.vowels.filter((v: any) => v.type === 'short').length,
    longVowels: thaiCharacters.vowels.filter((v: any) => v.type === 'long').length,
    compoundVowels: thaiCharacters.vowels.filter((v: any) => v.type === 'compound').length
  }
}

export default thaiCharactersData
