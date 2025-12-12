<script lang="ts">
  import { NOTE_NAMES } from '$lib/music/notes';
  import { detectChord, type DetectedChord } from '$lib/music/chordDetection';

  interface Props {
    selectedNotes?: Set<number>;
    onClear?: () => void;
  }

  let {
    selectedNotes = new Set<number>(),
    onClear
  }: Props = $props();

  let detectedChords: DetectedChord[] = $state([]);

  $effect(() => {
    if (selectedNotes.size > 0) {
      const notes = Array.from(selectedNotes).map(pitch => pitch + 60); // Convert to MIDI
      detectedChords = detectChord(notes);
    } else {
      detectedChords = [];
    }
  });

  function handleClear() {
    if (onClear) {
      onClear();
    }
  }

  function getSelectedNotesDisplay(): string {
    if (selectedNotes.size === 0) return 'No notes selected';
    return Array.from(selectedNotes)
      .sort((a, b) => a - b)
      .map(pitch => NOTE_NAMES[pitch])
      .join(', ');
  }
</script>

<div class="reverse-finder">
  <h3>Chord Finder</h3>
  
  <div class="selected-notes">
    <strong>Selected Notes:</strong>
    <span class="notes-display">{getSelectedNotesDisplay()}</span>
    {#if selectedNotes.size > 0}
      <button class="clear-btn" onclick={handleClear}>Clear</button>
    {/if}
  </div>

  <div class="results">
    <strong>Detected Chords:</strong>
    {#if detectedChords.length === 0}
      <p class="no-results">
        {selectedNotes.size === 0 ? 'Select notes on the piano or fretboard' : 'No chords detected'}
      </p>
    {:else}
      <ul class="chord-list">
        {#each detectedChords.slice(0, 5) as chord}
          <li class="chord-item">
            <span class="chord-symbol">{chord.symbol}</span>
            <span class="confidence">
              {Math.round(chord.confidence * 100)}%
            </span>
            {#if chord.extraNotes && chord.extraNotes.length > 0}
              <span class="badge extra">+notes</span>
            {/if}
            {#if chord.missingNotes && chord.missingNotes.length > 0}
              <span class="badge missing">incomplete</span>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .reverse-finder {
    background: #2a2a2a;
    padding: 20px;
    border-radius: 8px;
    color: white;
  }

  h3 {
    margin: 0 0 15px 0;
    color: #4a9eff;
  }

  .selected-notes {
    margin-bottom: 20px;
    padding: 15px;
    background: #1a1a1a;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .notes-display {
    color: #4a9eff;
    font-family: monospace;
    flex: 1;
  }

  .clear-btn {
    padding: 6px 12px;
    background: #d9534f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.2s;
  }

  .clear-btn:hover {
    background: #c9302c;
  }

  .results {
    padding: 15px;
    background: #1a1a1a;
    border-radius: 4px;
  }

  .results strong {
    display: block;
    margin-bottom: 10px;
  }

  .no-results {
    color: #888;
    font-style: italic;
    margin: 10px 0;
  }

  .chord-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .chord-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    margin-bottom: 5px;
    background: #2a2a2a;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .chord-item:hover {
    background: #333;
  }

  .chord-symbol {
    font-size: 18px;
    font-weight: bold;
    color: #4a9eff;
    min-width: 80px;
  }

  .confidence {
    color: #5cb85c;
    font-size: 14px;
  }

  .badge {
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: bold;
  }

  .badge.extra {
    background: #f0ad4e;
    color: #000;
  }

  .badge.missing {
    background: #777;
    color: white;
  }
</style>
