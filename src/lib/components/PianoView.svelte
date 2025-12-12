<script lang="ts">
  import { NOTE_NAMES } from '$lib/music/notes';

  interface Props {
    activeNotes?: Set<number>;
    octaves?: number;
    startOctave?: number;
    onNoteClick?: (midi: number) => void;
    interactive?: boolean;
  }

  let {
    activeNotes = new Set<number>(),
    octaves = 3,
    startOctave = 3,
    onNoteClick,
    interactive = false
  }: Props = $props();

  const blackKeyIndices = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#

  function isBlackKey(noteIndex: number): boolean {
    return blackKeyIndices.includes(noteIndex);
  }

  function getMidiNote(octave: number, noteIndex: number): number {
    return (octave + 1) * 12 + noteIndex;
  }

  function handleKeyClick(midi: number) {
    if (interactive && onNoteClick) {
      onNoteClick(midi);
    }
  }

  function isNoteActive(midi: number): boolean {
    return activeNotes.has(midi % 12);
  }
</script>

<div class="piano-container">
  <div class="piano">
    {#each Array(octaves) as _, octaveOffset}
      {@const octave = startOctave + octaveOffset}
      <div class="octave">
        {#each NOTE_NAMES as note, noteIndex}
          {@const midi = getMidiNote(octave, noteIndex)}
          {@const isBlack = isBlackKey(noteIndex)}
          {@const active = isNoteActive(midi)}
          
          <button
            class="key"
            class:black={isBlack}
            class:white={!isBlack}
            class:active={active}
            class:clickable={interactive}
            onclick={() => handleKeyClick(midi)}
            disabled={!interactive}
            aria-label={`${note}${octave}`}
          >
            {#if !isBlack}
              <span class="note-label">{note}</span>
            {/if}
          </button>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .piano-container {
    background: #2a2a2a;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
  }

  .piano {
    display: flex;
    gap: 0;
    min-width: 600px;
    height: 200px;
    position: relative;
  }

  .octave {
    display: flex;
    position: relative;
  }

  .key {
    border: 1px solid #000;
    cursor: default;
    transition: all 0.1s;
    position: relative;
    padding: 0;
  }

  .key.white {
    width: 40px;
    height: 200px;
    background: white;
    z-index: 1;
  }

  .key.black {
    width: 28px;
    height: 120px;
    background: #222;
    position: absolute;
    z-index: 2;
    margin-left: -14px;
  }

  .key.black:nth-of-type(2) {
    left: 40px;
  }

  .key.black:nth-of-type(4) {
    left: 80px;
  }

  .key.black:nth-of-type(7) {
    left: 160px;
  }

  .key.black:nth-of-type(9) {
    left: 200px;
  }

  .key.black:nth-of-type(11) {
    left: 240px;
  }

  .key.clickable {
    cursor: pointer;
  }

  .key.white:hover:not(:disabled) {
    background: #f0f0f0;
  }

  .key.black:hover:not(:disabled) {
    background: #333;
  }

  .key.white.active {
    background: #4a9eff;
  }

  .key.black.active {
    background: #2a6faf;
  }

  .note-label {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #666;
    pointer-events: none;
  }

  .key.active .note-label {
    color: white;
  }
</style>
