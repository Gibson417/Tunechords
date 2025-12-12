/**
 * MIDI export functionality
 */

import type { Progression } from './progressions';
import type { Chord } from './chords';

/**
 * MIDI file format constants
 */
const MIDI_HEADER = 'MThd';
const MIDI_TRACK = 'MTrk';
const TICKS_PER_BEAT = 480;

/**
 * Convert number to variable-length quantity (VLQ)
 */
function toVLQ(value: number): number[] {
  const bytes: number[] = [];
  bytes.push(value & 0x7f);
  
  while ((value >>= 7) > 0) {
    bytes.unshift((value & 0x7f) | 0x80);
  }
  
  return bytes;
}

/**
 * Convert number to fixed-length bytes
 */
function toBytes(value: number, length: number): number[] {
  const bytes: number[] = [];
  for (let i = length - 1; i >= 0; i--) {
    bytes.push((value >> (i * 8)) & 0xff);
  }
  return bytes;
}

/**
 * Create MIDI header chunk
 */
function createHeader(numTracks: number): number[] {
  const header: number[] = [];
  
  // Header identifier
  header.push(...MIDI_HEADER.split('').map(c => c.charCodeAt(0)));
  
  // Header length (always 6)
  header.push(...toBytes(6, 4));
  
  // Format (1 = multiple tracks, synchronous)
  header.push(...toBytes(1, 2));
  
  // Number of tracks
  header.push(...toBytes(numTracks, 2));
  
  // Time division (ticks per beat)
  header.push(...toBytes(TICKS_PER_BEAT, 2));
  
  return header;
}

/**
 * Create MIDI track chunk for a chord
 */
function createChordTrack(chord: Chord, duration: number, tempo: number): number[] {
  const events: number[] = [];
  
  // Set tempo (microseconds per quarter note)
  const microsecondsPerBeat = Math.floor(60000000 / tempo);
  events.push(...toVLQ(0)); // Delta time
  events.push(0xff, 0x51, 0x03); // Tempo meta event
  events.push(...toBytes(microsecondsPerBeat, 3));
  
  // Note on events
  chord.notes.forEach(note => {
    events.push(...toVLQ(0)); // Delta time
    events.push(0x90); // Note on, channel 0
    events.push(note);
    events.push(80); // Velocity
  });
  
  // Calculate duration in ticks
  const durationTicks = Math.floor(duration * TICKS_PER_BEAT);
  
  // Note off events
  chord.notes.forEach((note, index) => {
    if (index === 0) {
      events.push(...toVLQ(durationTicks)); // Delta time for first note
    } else {
      events.push(...toVLQ(0)); // No delta time for subsequent notes
    }
    events.push(0x80); // Note off, channel 0
    events.push(note);
    events.push(0); // Velocity
  });
  
  // End of track
  events.push(...toVLQ(0)); // Delta time
  events.push(0xff, 0x2f, 0x00); // End of track
  
  return events;
}

/**
 * Create MIDI track chunk for a progression
 */
function createProgressionTrack(progression: Progression): number[] {
  const events: number[] = [];
  const tempo = progression.tempo || 120;
  
  // Set tempo (microseconds per quarter note)
  const microsecondsPerBeat = Math.floor(60000000 / tempo);
  events.push(...toVLQ(0)); // Delta time
  events.push(0xff, 0x51, 0x03); // Tempo meta event
  events.push(...toBytes(microsecondsPerBeat, 3));
  
  // Track name
  const trackName = progression.name;
  events.push(...toVLQ(0));
  events.push(0xff, 0x03); // Track name meta event
  events.push(trackName.length);
  events.push(...trackName.split('').map(c => c.charCodeAt(0)));
  
  let currentTime = 0;
  
  // Add each chord
  progression.chords.forEach((pc, index) => {
    const deltaTime = index === 0 ? 0 : Math.floor(progression.chords[index - 1].duration * TICKS_PER_BEAT);
    
    // Note on events
    pc.chord.notes.forEach((note, noteIndex) => {
      if (noteIndex === 0) {
        events.push(...toVLQ(index === 0 ? 0 : deltaTime));
      } else {
        events.push(...toVLQ(0));
      }
      events.push(0x90); // Note on, channel 0
      events.push(note);
      events.push(80); // Velocity
    });
    
    // Note off events
    const noteDuration = Math.floor(pc.duration * TICKS_PER_BEAT);
    pc.chord.notes.forEach((note, noteIndex) => {
      if (noteIndex === 0) {
        events.push(...toVLQ(noteDuration));
      } else {
        events.push(...toVLQ(0));
      }
      events.push(0x80); // Note off, channel 0
      events.push(note);
      events.push(0);
    });
  });
  
  // End of track
  events.push(...toVLQ(0));
  events.push(0xff, 0x2f, 0x00);
  
  return events;
}

/**
 * Create complete MIDI file from progression
 */
export function createMidiFile(progression: Progression): Uint8Array {
  const tracks: number[][] = [];
  
  // Create track for progression
  tracks.push(createProgressionTrack(progression));
  
  // Create header
  const header = createHeader(tracks.length);
  
  // Combine all chunks
  const midiData: number[] = [...header];
  
  tracks.forEach(track => {
    // Track header
    midiData.push(...MIDI_TRACK.split('').map(c => c.charCodeAt(0)));
    midiData.push(...toBytes(track.length, 4));
    midiData.push(...track);
  });
  
  return new Uint8Array(midiData);
}

/**
 * Export chord to MIDI
 */
export function exportChordToMidi(chord: Chord, duration: number = 4, tempo: number = 120): Uint8Array {
  const track = createChordTrack(chord, duration, tempo);
  const header = createHeader(1);
  
  const midiData: number[] = [...header];
  midiData.push(...MIDI_TRACK.split('').map(c => c.charCodeAt(0)));
  midiData.push(...toBytes(track.length, 4));
  midiData.push(...track);
  
  return new Uint8Array(midiData);
}

/**
 * Export progression to MIDI
 */
export function exportProgressionToMidi(progression: Progression): Uint8Array {
  return createMidiFile(progression);
}

/**
 * Download MIDI file
 */
export function downloadMidi(midiData: Uint8Array, filename: string): void {
  const blob = new Blob([midiData as BlobPart], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}
