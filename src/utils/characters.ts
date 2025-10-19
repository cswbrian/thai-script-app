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
  classGroups?: Map<string, ThaiCharacter[]>
}

// Character grouping by pronunciation while maintaining category structure
export const getCharacterGroupsByPronunciation = (): CharacterGroup[] => {
  const thaiCharacters = thaiCharactersData as any
  
  const groups: CharacterGroup[] = []
  const colors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 
    'bg-indigo-500', 'bg-pink-500', 'bg-orange-500', 'bg-yellow-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500'
  ]
  
  let colorIndex = 0

  // Process consonants by pronunciation and class
  const consonantPronunciationGroups = new Map<string, Map<string, ThaiCharacter[]>>()
  thaiCharacters.consonants.forEach((character: ThaiCharacter) => {
    if (!character.pronunciation || !character.class) return
    
    const pronunciation = character.pronunciation.toLowerCase()
    const consonantClass = character.class
    
    if (!consonantPronunciationGroups.has(pronunciation)) {
      consonantPronunciationGroups.set(pronunciation, new Map())
    }
    
    const classGroups = consonantPronunciationGroups.get(pronunciation)!
    if (!classGroups.has(consonantClass)) {
      classGroups.set(consonantClass, [])
    }
    
    classGroups.get(consonantClass)!.push(character)
  })

  consonantPronunciationGroups.forEach((classGroups, pronunciation) => {
    // Collect all characters for this pronunciation
    const allCharacters: ThaiCharacter[] = []
    const classOrder = ['mid', 'high', 'low']
    
    classOrder.forEach(consonantClass => {
      const characters = classGroups.get(consonantClass)
      if (characters && characters.length > 0) {
        allCharacters.push(...characters)
      }
    })
    
    if (allCharacters.length > 0) {
      groups.push({
        id: `consonants-pronunciation-${pronunciation}`,
        name: `"${pronunciation}" sound`,
        description: `Consonants that make the "${pronunciation}" sound`,
        characters: allCharacters.sort((a, b) => a.name.localeCompare(b.name)),
        color: colors[colorIndex % colors.length],
        // Store class information for rendering
        classGroups: classGroups
      })
      colorIndex++
    }
  })

  // Process vowels by pronunciation
  const vowelPronunciationGroups = new Map<string, ThaiCharacter[]>()
  thaiCharacters.vowels.forEach((character: ThaiCharacter) => {
    if (!character.pronunciation) return
    
    const pronunciation = character.pronunciation.toLowerCase()
    if (!vowelPronunciationGroups.has(pronunciation)) {
      vowelPronunciationGroups.set(pronunciation, [])
    }
    vowelPronunciationGroups.get(pronunciation)!.push(character)
  })

  vowelPronunciationGroups.forEach((characters, pronunciation) => {
    groups.push({
      id: `vowels-pronunciation-${pronunciation}`,
      name: `"${pronunciation}" sound`,
      description: `Vowels that make the "${pronunciation}" sound`,
      characters: characters.sort((a, b) => a.name.localeCompare(b.name)),
      color: colors[colorIndex % colors.length]
    })
    colorIndex++
  })

  // Process tone marks by pronunciation
  const toneMarkPronunciationGroups = new Map<string, ThaiCharacter[]>()
  thaiCharacters.toneMarks.forEach((character: ThaiCharacter) => {
    if (!character.pronunciation) return
    
    const pronunciation = character.pronunciation.toLowerCase()
    if (!toneMarkPronunciationGroups.has(pronunciation)) {
      toneMarkPronunciationGroups.set(pronunciation, [])
    }
    toneMarkPronunciationGroups.get(pronunciation)!.push(character)
  })

  toneMarkPronunciationGroups.forEach((characters, pronunciation) => {
    groups.push({
      id: `tone-marks-pronunciation-${pronunciation}`,
      name: `"${pronunciation}" sound`,
      description: `Tone marks that make the "${pronunciation}" sound`,
      characters: characters.sort((a, b) => a.name.localeCompare(b.name)),
      color: colors[colorIndex % colors.length]
    })
    colorIndex++
  })

  // Sort groups by category first, then by pronunciation
  return groups.sort((a, b) => {
    const categoryOrder = { consonants: 0, vowels: 1, 'tone-marks': 2 }
    const aCategory = a.id.split('-')[0]
    const bCategory = b.id.split('-')[0]
    
    if (categoryOrder[aCategory as keyof typeof categoryOrder] !== categoryOrder[bCategory as keyof typeof categoryOrder]) {
      return categoryOrder[aCategory as keyof typeof categoryOrder] - categoryOrder[bCategory as keyof typeof categoryOrder]
    }
    
    return a.name.localeCompare(b.name)
  })
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
