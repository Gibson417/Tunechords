/**
 * Note representation and operations
 */

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const FLAT_NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

export type NoteName = typeof NOTE_NAMES[number];
export type FlatNoteName = typeof FLAT_NOTE_NAMES[number];

export interface Note {
  name: NoteName | FlatNoteName;
  octave: number;
  midi: number;
}

/**
 * Convert note name and octave to MIDI number
 */
export function noteToMidi(noteName: string, octave: number): number {
  const noteIndex = NOTE_NAMES.indexOf(noteName as NoteName);
  const flatIndex = FLAT_NOTE_NAMES.indexOf(noteName as FlatNoteName);
  const index = noteIndex >= 0 ? noteIndex : flatIndex;
  
  if (index < 0) {
    throw new Error(`Invalid note name: ${noteName}`);
  }
  
  return (octave + 1) * 12 + index;
}

/**
 * Convert MIDI number to note name and octave
 */
export function midiToNote(midi: number, useFlats = false): Note {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  const name = useFlats ? FLAT_NOTE_NAMES[noteIndex] : NOTE_NAMES[noteIndex];
  
  return { name, octave, midi };
}

/**
 * Get the interval in semitones between two notes
 */
export function getInterval(note1: number, note2: number): number {
  return Math.abs(note2 - note1);
}

/**
 * Transpose a MIDI note by semitones
 */
export function transpose(midi: number, semitones: number): number {
  return midi + semitones;
}

/**
 * Normalize note name to sharp notation
 */
export function normalizeNoteName(noteName: string): NoteName {
  const flatToSharp: Record<string, NoteName> = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
  };
  
  return (flatToSharp[noteName] || noteName) as NoteName;
}

/**
 * Get the note at a specific fret on a string
 */
export function getNoteAtFret(openStringMidi: number, fret: number): number {
  return openStringMidi + fret;
}
