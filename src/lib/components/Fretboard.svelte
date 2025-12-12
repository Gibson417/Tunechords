<script lang="ts">
  import { getNoteAtFret, midiToNote } from '$lib/music/notes';
  import type { Tuning } from '$lib/music/tunings';
  import type { Voicing } from '$lib/music/voicings';

  interface Props {
    tuning: Tuning;
    voicing?: Voicing | null;
    maxFrets?: number;
    interactive?: boolean;
    selectedNotes?: Set<number>;
    onNoteClick?: (stringIndex: number, fret: number, midi: number) => void;
  }

  let {
    tuning,
    voicing = null,
    maxFrets = 15,
    interactive = false,
    selectedNotes = new Set<number>(),
    onNoteClick
  }: Props = $props();

  function handleFretClick(stringIndex: number, fret: number) {
    if (!interactive || !onNoteClick) return;
    const midi = getNoteAtFret(tuning.strings[stringIndex], fret);
    onNoteClick(stringIndex, fret, midi);
  }

  function isFretActive(stringIndex: number, fret: number): boolean {
    if (!voicing) return false;
    return voicing.frets[stringIndex] === fret;
  }

  function isNoteSelected(stringIndex: number, fret: number): boolean {
    const midi = getNoteAtFret(tuning.strings[stringIndex], fret);
    return selectedNotes.has(midi % 12);
  }
</script>

<div class="fretboard">
  <div class="fretboard-container">
    {#each tuning.strings as openString, stringIndex}
      <div class="string-row">
        <div class="string-label">
          {midiToNote(openString).name}
        </div>
        {#each Array(maxFrets + 1) as _, fret}
          <button
            class="fret"
            class:active={isFretActive(stringIndex, fret)}
            class:selected={isNoteSelected(stringIndex, fret)}
            class:open={fret === 0}
            class:clickable={interactive}
            onclick={() => handleFretClick(stringIndex, fret)}
            disabled={!interactive}
          >
            {#if isFretActive(stringIndex, fret)}
              <span class="note-marker"></span>
            {/if}
          </button>
        {/each}
      </div>
    {/each}
    
    <div class="fret-numbers">
      <div class="string-label"></div>
      {#each Array(maxFrets + 1) as _, fret}
        <div class="fret-number">{fret || ''}</div>
      {/each}
    </div>
  </div>
</div>

<style>
  .fretboard {
    overflow-x: auto;
    background: #2a2a2a;
    padding: 20px;
    border-radius: 8px;
  }

  .fretboard-container {
    display: flex;
    flex-direction: column;
    min-width: 800px;
  }

  .string-row {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
  }

  .string-label {
    width: 40px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    font-size: 14px;
  }

  .fret {
    width: 50px;
    height: 40px;
    border: 1px solid #555;
    border-left: none;
    background: #1a1a1a;
    cursor: default;
    position: relative;
    transition: background-color 0.2s;
    padding: 0;
  }

  .fret:first-of-type {
    border-left: 3px solid #888;
  }

  .fret.open {
    border-left: 3px solid #888;
    background: #2a2a2a;
  }

  .fret.clickable {
    cursor: pointer;
  }

  .fret.clickable:hover {
    background: #333;
  }

  .fret.active {
    background: #4a9eff;
  }

  .fret.selected {
    background: #2a4a6a;
  }

  .fret.active.selected {
    background: #4a9eff;
  }

  .note-marker {
    display: block;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .fret-numbers {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  .fret-number {
    width: 50px;
    text-align: center;
    color: #888;
    font-size: 12px;
  }
</style>
