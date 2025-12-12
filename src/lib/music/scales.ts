/**
 * Scale definitions and helpers
 */

import { NOTE_NAMES, type NoteName } from './notes';

export interface Scale {
  name: string;
  intervals: number[]; // Semitones from root
}

/**
 * Common scale types
 */
export const SCALE_TYPES: Record<string, Scale> = {
  major: {
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11]
  },
  minor: {
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10]
  },
  harmonicMinor: {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11]
  },
  melodicMinor: {
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11]
  },
  dorian: {
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10]
  },
  phrygian: {
    name: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10]
  },
  lydian: {
    name: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11]
  },
  mixolydian: {
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10]
  },
  pentatonicMajor: {
    name: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9]
  },
  pentatonicMinor: {
    name: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10]
  },
  blues: {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10]
  },
  chromatic: {
    name: 'Chromatic',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  }
};

/**
 * Generate scale notes from root
 */
export function generateScale(root: NoteName, scaleType: string, rootMidi: number = 60): number[] {
  const scale = SCALE_TYPES[scaleType];
  if (!scale) {
    throw new Error(`Unknown scale type: ${scaleType}`);
  }

  return scale.intervals.map(interval => rootMidi + interval);
}

/**
 * Get scale degree (1-7 for diatonic scales)
 */
export function getScaleDegree(scale: number[], noteMidi: number): number | null {
  const pitch = noteMidi % 12;
  const scalePitches = scale.map(note => note % 12);
  const index = scalePitches.indexOf(pitch);
  
  return index >= 0 ? index + 1 : null;
}

/**
 * Check if a note is in a scale
 */
export function isNoteInScale(noteMidi: number, scale: number[]): boolean {
  const pitch = noteMidi % 12;
  return scale.some(scaleNote => scaleNote % 12 === pitch);
}

/**
 * Get chords that fit in a scale (diatonic chords)
 */
export function getDiatonicChords(root: NoteName, scaleType: string = 'major'): string[] {
  const scale = SCALE_TYPES[scaleType];
  if (!scale) return [];

  const rootIndex = NOTE_NAMES.indexOf(root);
  const chords: string[] = [];

  // Generate triads for each scale degree
  const majorIntervals = [0, 4, 7];
  const minorIntervals = [0, 3, 7];
  const diminishedIntervals = [0, 3, 6];

  for (let degree = 0; degree < 7; degree++) {
    const chordRoot = NOTE_NAMES[(rootIndex + scale.intervals[degree]) % 12];
    
    // Determine chord quality based on scale degree
    if (scaleType === 'major') {
      // I, IV, V = major; ii, iii, vi = minor; vii = diminished
      if ([0, 3, 4].includes(degree)) {
        chords.push(`${chordRoot}`);
      } else if ([1, 2, 5].includes(degree)) {
        chords.push(`${chordRoot}m`);
      } else if (degree === 6) {
        chords.push(`${chordRoot}dim`);
      }
    } else if (scaleType === 'minor') {
      // i, iv, v = minor; III, VI, VII = major; ii = diminished
      if ([0, 3, 4].includes(degree)) {
        chords.push(`${chordRoot}m`);
      } else if ([2, 5, 6].includes(degree)) {
        chords.push(`${chordRoot}`);
      } else if (degree === 1) {
        chords.push(`${chordRoot}dim`);
      }
    }
  }

  return chords;
}

/**
 * Get all available scale types
 */
export function getAllScaleTypes(): string[] {
  return Object.keys(SCALE_TYPES);
}

/**
 * Get relative minor key
 */
export function getRelativeMinor(majorRoot: NoteName): NoteName {
  const rootIndex = NOTE_NAMES.indexOf(majorRoot);
  return NOTE_NAMES[(rootIndex + 9) % 12];
}

/**
 * Get relative major key
 */
export function getRelativeMajor(minorRoot: NoteName): NoteName {
  const rootIndex = NOTE_NAMES.indexOf(minorRoot);
  return NOTE_NAMES[(rootIndex + 3) % 12];
}
