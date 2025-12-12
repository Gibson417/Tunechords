/**
 * Chord detection from notes (reverse chord finder)
 */

import { NOTE_NAMES, type NoteName } from './notes';
import { CHORD_TYPES, type ChordDefinition } from './chords';

export interface DetectedChord {
  root: NoteName;
  chordType: string;
  symbol: string;
  confidence: number; // 0-1
  missingNotes?: number[];
  extraNotes?: number[];
}

/**
 * Detect chord from a set of MIDI notes
 */
export function detectChord(midiNotes: number[]): DetectedChord[] {
  if (midiNotes.length === 0) {
    return [];
  }

  // Normalize to pitch classes (0-11)
  const pitches = [...new Set(midiNotes.map(note => note % 12))].sort((a, b) => a - b);
  
  const detectedChords: DetectedChord[] = [];

  // Try each note as a potential root
  for (const rootPitch of pitches) {
    const rootNote = NOTE_NAMES[rootPitch];

    // Try each chord type
    for (const [chordType, definition] of Object.entries(CHORD_TYPES)) {
      const chordPitches = definition.intervals.map(interval => (rootPitch + interval) % 12);
      
      // Check how many chord tones are present
      const matchingNotes = chordPitches.filter(pitch => pitches.includes(pitch));
      const missingNotes = chordPitches.filter(pitch => !pitches.includes(pitch));
      const extraNotes = pitches.filter(pitch => !chordPitches.includes(pitch));

      // Calculate confidence based on matches
      const confidence = matchingNotes.length / chordPitches.length;

      // Only consider chords with high confidence
      if (confidence >= 0.75) {
        detectedChords.push({
          root: rootNote,
          chordType,
          symbol: `${rootNote}${definition.symbol}`,
          confidence,
          missingNotes: missingNotes.length > 0 ? missingNotes : undefined,
          extraNotes: extraNotes.length > 0 ? extraNotes : undefined
        });
      }
    }
  }

  // Sort by confidence (highest first)
  return detectedChords.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Detect chord from fretboard position
 */
export function detectChordFromFrets(
  frets: (number | null)[],
  openStrings: number[]
): DetectedChord[] {
  const notes = frets
    .map((fret, index) => {
      if (fret === null) return null;
      return openStrings[index] + fret;
    })
    .filter((note): note is number => note !== null);

  return detectChord(notes);
}

/**
 * Get the most likely chord from detected chords
 */
export function getMostLikelyChord(detectedChords: DetectedChord[]): DetectedChord | null {
  if (detectedChords.length === 0) return null;

  // Prefer chords with no extra notes and higher confidence
  const sorted = [...detectedChords].sort((a, b) => {
    const aExtra = a.extraNotes?.length || 0;
    const bExtra = b.extraNotes?.length || 0;
    
    if (aExtra !== bExtra) {
      return aExtra - bExtra;
    }
    
    return b.confidence - a.confidence;
  });

  return sorted[0];
}

/**
 * Format chord detection results for display
 */
export function formatDetectionResults(detectedChords: DetectedChord[]): string[] {
  return detectedChords.slice(0, 5).map(chord => {
    let result = chord.symbol;
    if (chord.confidence < 1.0) {
      result += ` (${Math.round(chord.confidence * 100)}%)`;
    }
    if (chord.extraNotes && chord.extraNotes.length > 0) {
      result += ` +notes`;
    }
    return result;
  });
}
