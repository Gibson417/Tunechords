/**
 * Chord definitions and operations
 */

import { NOTE_NAMES, type NoteName, normalizeNoteName } from './notes';

export interface ChordDefinition {
  name: string;
  intervals: number[]; // Semitones from root
  symbol: string;
}

export interface Chord {
  root: NoteName;
  type: string;
  notes: number[]; // MIDI numbers
  symbol: string;
}

/**
 * Common chord types with their intervals
 */
export const CHORD_TYPES: Record<string, ChordDefinition> = {
  major: {
    name: 'Major',
    intervals: [0, 4, 7],
    symbol: ''
  },
  minor: {
    name: 'Minor',
    intervals: [0, 3, 7],
    symbol: 'm'
  },
  diminished: {
    name: 'Diminished',
    intervals: [0, 3, 6],
    symbol: 'dim'
  },
  augmented: {
    name: 'Augmented',
    intervals: [0, 4, 8],
    symbol: 'aug'
  },
  sus2: {
    name: 'Suspended 2nd',
    intervals: [0, 2, 7],
    symbol: 'sus2'
  },
  sus4: {
    name: 'Suspended 4th',
    intervals: [0, 5, 7],
    symbol: 'sus4'
  },
  dominant7: {
    name: 'Dominant 7th',
    intervals: [0, 4, 7, 10],
    symbol: '7'
  },
  major7: {
    name: 'Major 7th',
    intervals: [0, 4, 7, 11],
    symbol: 'maj7'
  },
  minor7: {
    name: 'Minor 7th',
    intervals: [0, 3, 7, 10],
    symbol: 'm7'
  },
  diminished7: {
    name: 'Diminished 7th',
    intervals: [0, 3, 6, 9],
    symbol: 'dim7'
  },
  halfDiminished7: {
    name: 'Half Diminished 7th',
    intervals: [0, 3, 6, 10],
    symbol: 'm7b5'
  },
  major6: {
    name: 'Major 6th',
    intervals: [0, 4, 7, 9],
    symbol: '6'
  },
  minor6: {
    name: 'Minor 6th',
    intervals: [0, 3, 7, 9],
    symbol: 'm6'
  },
  major9: {
    name: 'Major 9th',
    intervals: [0, 4, 7, 11, 14],
    symbol: 'maj9'
  },
  dominant9: {
    name: 'Dominant 9th',
    intervals: [0, 4, 7, 10, 14],
    symbol: '9'
  },
  minor9: {
    name: 'Minor 9th',
    intervals: [0, 3, 7, 10, 14],
    symbol: 'm9'
  },
  add9: {
    name: 'Add 9',
    intervals: [0, 4, 7, 14],
    symbol: 'add9'
  }
};

/**
 * Build a chord from root note and type
 */
export function buildChord(root: NoteName, chordType: string, rootMidi: number = 60): Chord {
  const definition = CHORD_TYPES[chordType];
  if (!definition) {
    throw new Error(`Unknown chord type: ${chordType}`);
  }

  const notes = definition.intervals.map(interval => rootMidi + interval);
  
  return {
    root,
    type: chordType,
    notes,
    symbol: `${root}${definition.symbol}`
  };
}

/**
 * Get all chord types
 */
export function getAllChordTypes(): string[] {
  return Object.keys(CHORD_TYPES);
}

/**
 * Get chord definition by type
 */
export function getChordDefinition(chordType: string): ChordDefinition | undefined {
  return CHORD_TYPES[chordType];
}

/**
 * Parse chord symbol (e.g., "Am7" -> {root: "A", type: "minor7"})
 */
export function parseChordSymbol(symbol: string): { root: NoteName; type: string } | null {
  // Match root note (with possible sharp/flat)
  const rootMatch = symbol.match(/^([A-G][#b]?)/);
  if (!rootMatch) return null;

  const root = normalizeNoteName(rootMatch[1]);
  const suffix = symbol.slice(rootMatch[0].length);

  // Find matching chord type
  for (const [key, def] of Object.entries(CHORD_TYPES)) {
    if (def.symbol === suffix) {
      return { root, type: key };
    }
  }

  return null;
}

/**
 * Get common chord quality sequences
 */
export const COMMON_CHORD_QUALITIES: Record<string, string[]> = {
  'I-IV-V': ['major', 'major', 'major'],
  'I-V-vi-IV': ['major', 'major', 'minor', 'major'],
  'ii-V-I': ['minor', 'major', 'major'],
  'I-vi-IV-V': ['major', 'minor', 'major', 'major'],
  'I-IV-I-V': ['major', 'major', 'major', 'major'],
  'vi-IV-I-V': ['minor', 'major', 'major', 'major']
};
