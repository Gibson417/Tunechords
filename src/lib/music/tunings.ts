/**
 * Guitar tuning definitions
 */

import { noteToMidi, type NoteName } from './notes';

export interface Tuning {
  name: string;
  strings: number[]; // MIDI numbers for each open string (low to high)
  stringCount: number;
}

export const STANDARD_TUNING: Tuning = {
  name: 'Standard (EADGBE)',
  strings: [
    noteToMidi('E', 2),  // Low E
    noteToMidi('A', 2),  // A
    noteToMidi('D', 3),  // D
    noteToMidi('G', 3),  // G
    noteToMidi('B', 3),  // B
    noteToMidi('E', 4)   // High E
  ],
  stringCount: 6
};

export const TUNINGS: Record<string, Tuning> = {
  standard: STANDARD_TUNING,
  dropD: {
    name: 'Drop D',
    strings: [
      noteToMidi('D', 2),
      noteToMidi('A', 2),
      noteToMidi('D', 3),
      noteToMidi('G', 3),
      noteToMidi('B', 3),
      noteToMidi('E', 4)
    ],
    stringCount: 6
  },
  openG: {
    name: 'Open G',
    strings: [
      noteToMidi('D', 2),
      noteToMidi('G', 2),
      noteToMidi('D', 3),
      noteToMidi('G', 3),
      noteToMidi('B', 3),
      noteToMidi('D', 4)
    ],
    stringCount: 6
  },
  openD: {
    name: 'Open D',
    strings: [
      noteToMidi('D', 2),
      noteToMidi('A', 2),
      noteToMidi('D', 3),
      noteToMidi('F#', 3),
      noteToMidi('A', 3),
      noteToMidi('D', 4)
    ],
    stringCount: 6
  },
  dadgad: {
    name: 'DADGAD',
    strings: [
      noteToMidi('D', 2),
      noteToMidi('A', 2),
      noteToMidi('D', 3),
      noteToMidi('G', 3),
      noteToMidi('A', 3),
      noteToMidi('D', 4)
    ],
    stringCount: 6
  }
};

/**
 * Get the default tuning (Standard EADGBE)
 */
export function getDefaultTuning(): Tuning {
  return STANDARD_TUNING;
}

/**
 * Get tuning by name
 */
export function getTuning(name: keyof typeof TUNINGS): Tuning {
  return TUNINGS[name] || STANDARD_TUNING;
}

/**
 * Get all available tunings
 */
export function getAllTunings(): Tuning[] {
  return Object.values(TUNINGS);
}
