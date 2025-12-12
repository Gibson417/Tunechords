/**
 * Chord progression management
 */

import { NOTE_NAMES, type NoteName } from './notes';
import { buildChord, type Chord } from './chords';

export interface ProgressionChord {
  chord: Chord;
  duration: number; // in beats
  romanNumeral?: string;
}

export interface Progression {
  name: string;
  key: NoteName;
  chords: ProgressionChord[];
  tempo?: number; // BPM
}

/**
 * Roman numeral to scale degree mapping
 */
const ROMAN_TO_DEGREE: Record<string, number> = {
  'I': 0, 'i': 0,
  'II': 1, 'ii': 1,
  'III': 2, 'iii': 2,
  'IV': 3, 'iv': 3,
  'V': 4, 'v': 4,
  'VI': 5, 'vi': 5,
  'VII': 6, 'vii': 6
};

/**
 * Common chord progressions in Roman numeral notation
 */
export const COMMON_PROGRESSIONS: Record<string, string[]> = {
  'I-IV-V': ['I', 'IV', 'V'],
  'I-V-vi-IV': ['I', 'V', 'vi', 'IV'],
  'ii-V-I': ['ii', 'V', 'I'],
  'I-vi-IV-V': ['I', 'vi', 'IV', 'V'],
  'vi-IV-I-V': ['vi', 'IV', 'I', 'V'],
  'I-IV-vi-V': ['I', 'IV', 'vi', 'V'],
  'I-vi-ii-V': ['I', 'vi', 'ii', 'V'],
  'I-iii-IV-V': ['I', 'iii', 'IV', 'V'],
  '12-bar-blues': ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V']
};

/**
 * Convert Roman numeral to chord in a key
 */
export function romanNumeralToChord(
  romanNumeral: string,
  key: NoteName,
  rootMidi: number = 60
): Chord | null {
  const degree = ROMAN_TO_DEGREE[romanNumeral];
  if (degree === undefined) return null;

  // Determine if major or minor based on case
  const isMinor = romanNumeral === romanNumeral.toLowerCase();
  const chordType = isMinor ? 'minor' : 'major';

  // Get the root note for this degree
  const keyIndex = NOTE_NAMES.indexOf(key);
  const scaleIntervals = [0, 2, 4, 5, 7, 9, 11]; // Major scale
  const rootIndex = (keyIndex + scaleIntervals[degree]) % 12;
  const root = NOTE_NAMES[rootIndex];

  return buildChord(root, chordType, rootMidi + scaleIntervals[degree]);
}

/**
 * Create progression from Roman numerals
 */
export function createProgressionFromRoman(
  name: string,
  key: NoteName,
  romanNumerals: string[],
  tempo: number = 120
): Progression {
  const chords: ProgressionChord[] = romanNumerals.map(rn => {
    const chord = romanNumeralToChord(rn, key);
    if (!chord) {
      throw new Error(`Invalid roman numeral: ${rn}`);
    }
    return {
      chord,
      duration: 4, // Default: whole note
      romanNumeral: rn
    };
  });

  return {
    name,
    key,
    chords,
    tempo
  };
}

/**
 * Create progression from chord symbols
 */
export function createProgressionFromSymbols(
  name: string,
  key: NoteName,
  chordSymbols: string[],
  tempo: number = 120
): Progression {
  const chords: ProgressionChord[] = chordSymbols.map(symbol => {
    // Parse chord symbol (e.g., "Am7")
    const rootMatch = symbol.match(/^([A-G][#b]?)/);
    if (!rootMatch) {
      throw new Error(`Invalid chord symbol: ${symbol}`);
    }

    const root = rootMatch[1] as NoteName;
    const suffix = symbol.slice(rootMatch[0].length);

    // Determine chord type from suffix (check longer patterns first)
    let chordType = 'major';
    if (suffix.includes('m7b5')) chordType = 'halfDiminished7';
    else if (suffix.includes('dim7')) chordType = 'diminished7';
    else if (suffix.includes('maj7')) chordType = 'major7';
    else if (suffix.includes('m7')) chordType = 'minor7';
    else if (suffix.includes('sus4')) chordType = 'sus4';
    else if (suffix.includes('sus2')) chordType = 'sus2';
    else if (suffix.includes('dim')) chordType = 'diminished';
    else if (suffix.includes('aug')) chordType = 'augmented';
    else if (suffix.includes('7')) chordType = 'dominant7';
    else if (suffix.includes('m')) chordType = 'minor';

    const chord = buildChord(root, chordType);
    
    return {
      chord,
      duration: 4
    };
  });

  return {
    name,
    key,
    chords,
    tempo
  };
}

/**
 * Get a preset progression
 */
export function getPresetProgression(name: string, key: NoteName = 'C'): Progression | null {
  const romanNumerals = COMMON_PROGRESSIONS[name];
  if (!romanNumerals) return null;

  return createProgressionFromRoman(name, key, romanNumerals);
}

/**
 * Transpose progression to new key
 */
export function transposeProgression(progression: Progression, newKey: NoteName): Progression {
  const oldKeyIndex = NOTE_NAMES.indexOf(progression.key);
  const newKeyIndex = NOTE_NAMES.indexOf(newKey);
  const semitones = newKeyIndex - oldKeyIndex;

  const chords: ProgressionChord[] = progression.chords.map(pc => {
    const oldRootIndex = NOTE_NAMES.indexOf(pc.chord.root);
    const newRootIndex = (oldRootIndex + semitones + 12) % 12;
    const newRoot = NOTE_NAMES[newRootIndex];

    const newChord = buildChord(newRoot, pc.chord.type);

    return {
      chord: newChord,
      duration: pc.duration,
      romanNumeral: pc.romanNumeral
    };
  });

  return {
    ...progression,
    key: newKey,
    chords
  };
}

/**
 * Get all preset progression names
 */
export function getPresetProgressionNames(): string[] {
  return Object.keys(COMMON_PROGRESSIONS);
}
