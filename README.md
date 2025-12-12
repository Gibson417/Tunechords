# 🎸 Tunechords

Interactive Chord, Tuning & Progression Explorer built with SvelteKit + TypeScript.

## Features

- **Chord Explorer**: Select chords and view them on an interactive fretboard and piano
- **Reverse Chord Finder**: Click notes to detect possible chords
- **Progression Builder**: Create and edit chord progressions with preset patterns
- **MIDI Export**: Download chords and progressions as MIDI files
- **Multiple Tunings**: Standard EADGBE, Drop D, Open G, Open D, DADGAD
- **18 Chord Types**: Major, minor, 7ths, 9ths, suspended, diminished, augmented
- **12 Scale Types**: Major, minor modes, pentatonic, blues, chromatic

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run check
```

## Architecture

- **Music Theory Library** (`src/lib/music/`): Pure TypeScript modules for notes, chords, scales, tunings, voicings, MIDI
- **UI Components** (`src/lib/components/`): Svelte components for fretboard, piano, chord selector, progression editor
- **No Backend Required**: Fully client-side application

## Technologies

- SvelteKit 2.x
- TypeScript (strict mode)
- Vite
- No external music libraries
