/**
 * Chord voicing generation for guitar
 */

import type { Tuning } from './tunings';
import { getNoteAtFret } from './notes';

export interface Voicing {
  frets: (number | null)[]; // Fret number for each string, null = not played
  fingers?: (number | null)[]; // Suggested fingering (1-4), null = open/not played
  notes: (number | null)[]; // MIDI numbers for each string
}

export interface ChordVoicing {
  chord: string;
  voicings: Voicing[];
}

/**
 * Common chord shapes in standard tuning
 */
export const COMMON_VOICINGS: Record<string, Record<string, (number | null)[][]>> = {
  major: {
    'C': [[null, 3, 2, 0, 1, 0], [3, 3, 2, 0, 1, 0], [null, 3, 5, 5, 5, 3]],
    'D': [[null, null, 0, 2, 3, 2], [null, null, 0, 7, 7, 7]],
    'E': [[0, 2, 2, 1, 0, 0], [0, 7, 6, 4, 5, 4]],
    'F': [[1, 3, 3, 2, 1, 1], [null, null, 3, 2, 1, 1]],
    'G': [[3, 2, 0, 0, 0, 3], [3, 5, 5, 4, 3, 3]],
    'A': [[null, 0, 2, 2, 2, 0], [5, 7, 7, 6, 5, 5]],
    'B': [[null, 2, 4, 4, 4, 2], [7, 9, 9, 8, 7, 7]]
  },
  minor: {
    'A': [[null, 0, 2, 2, 1, 0], [5, 7, 7, 5, 5, 5]],
    'B': [[null, 2, 4, 4, 3, 2], [7, 9, 9, 7, 7, 7]],
    'C': [[null, 3, 5, 5, 4, 3]],
    'D': [[null, null, 0, 2, 3, 1], [null, 5, 7, 7, 6, 5]],
    'E': [[0, 2, 2, 0, 0, 0], [0, 7, 5, 4, 5, 3]],
    'F': [[1, 3, 3, 1, 1, 1]],
    'G': [[3, 5, 5, 3, 3, 3]]
  }
};

/**
 * Generate voicings for a chord
 */
export function generateVoicings(
  chordNotes: number[],
  tuning: Tuning,
  maxFret: number = 15
): Voicing[] {
  const voicings: Voicing[] = [];
  
  // Normalize chord notes to single octave (0-11)
  const chordPitches = new Set(chordNotes.map(note => note % 12));
  
  // Try to find voicings within reach
  for (let baseFret = 0; baseFret <= Math.min(12, maxFret - 4); baseFret++) {
    const voicing: Voicing = {
      frets: [],
      notes: []
    };
    
    let validVoicing = true;
    let hasAllNotes = true;
    const foundPitches = new Set<number>();
    
    for (let stringIndex = 0; stringIndex < tuning.strings.length; stringIndex++) {
      const openString = tuning.strings[stringIndex];
      let found = false;
      
      // Try frets within reach of this position
      for (let fret = baseFret; fret <= baseFret + 4 && fret <= maxFret; fret++) {
        const note = getNoteAtFret(openString, fret);
        const pitch = note % 12;
        
        if (chordPitches.has(pitch)) {
          voicing.frets.push(fret);
          voicing.notes.push(note);
          foundPitches.add(pitch);
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Try open string
        const pitch = openString % 12;
        if (chordPitches.has(pitch) && baseFret <= 3) {
          voicing.frets.push(0);
          voicing.notes.push(openString);
          foundPitches.add(pitch);
        } else {
          voicing.frets.push(null);
          voicing.notes.push(null);
        }
      }
    }
    
    // Check if we have all chord notes
    hasAllNotes = chordNotes.every(note => foundPitches.has(note % 12));
    
    // Check if voicing is valid (has at least 3 notes)
    const playedStrings = voicing.frets.filter(f => f !== null).length;
    
    if (validVoicing && playedStrings >= 3 && hasAllNotes) {
      voicings.push(voicing);
    }
  }
  
  return voicings.slice(0, 5); // Return up to 5 voicings
}

/**
 * Get preset voicing for a chord
 */
export function getPresetVoicing(
  root: string,
  chordType: string,
  tuning: Tuning
): Voicing | null {
  const voicingSet = COMMON_VOICINGS[chordType];
  if (!voicingSet || !voicingSet[root]) {
    return null;
  }
  
  const frets = voicingSet[root][0]; // Get first voicing
  const notes = frets.map((fret, index) => {
    if (fret === null) return null;
    return getNoteAtFret(tuning.strings[index], fret);
  });
  
  return { frets, notes };
}

/**
 * Calculate the span of a voicing (distance between lowest and highest fret)
 */
export function getVoicingSpan(voicing: Voicing): number {
  const playedFrets = voicing.frets.filter((f): f is number => f !== null && f > 0);
  if (playedFrets.length === 0) return 0;
  
  return Math.max(...playedFrets) - Math.min(...playedFrets);
}

/**
 * Check if a voicing is playable (span <= 4 frets for most players)
 */
export function isVoicingPlayable(voicing: Voicing, maxSpan: number = 4): boolean {
  return getVoicingSpan(voicing) <= maxSpan;
}
