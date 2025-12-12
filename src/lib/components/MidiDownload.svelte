<script lang="ts">
  import { exportChordToMidi, exportProgressionToMidi, downloadMidi } from '$lib/music/midi';
  import type { Chord } from '$lib/music/chords';
  import type { Progression } from '$lib/music/progressions';

  interface Props {
    chord?: Chord | null;
    progression?: Progression | null;
  }

  let {
    chord = null,
    progression = null
  }: Props = $props();

  function handleDownloadChord() {
    if (!chord) return;

    const midiData = exportChordToMidi(chord);
    const filename = `${chord.symbol}.mid`;
    downloadMidi(midiData, filename);
  }

  function handleDownloadProgression() {
    if (!progression) return;

    const midiData = exportProgressionToMidi(progression);
    const filename = `${progression.name.replace(/\s+/g, '_')}_${progression.key}.mid`;
    downloadMidi(midiData, filename);
  }

  const canDownload = $derived(chord !== null || progression !== null);
</script>

<div class="midi-download">
  <h3>MIDI Export</h3>
  
  <div class="download-buttons">
    {#if chord}
      <button
        class="download-btn"
        onclick={handleDownloadChord}
        disabled={!chord}
      >
        <span class="icon">🎵</span>
        Download Chord as MIDI
      </button>
    {/if}

    {#if progression}
      <button
        class="download-btn"
        onclick={handleDownloadProgression}
        disabled={!progression}
      >
        <span class="icon">🎼</span>
        Download Progression as MIDI
      </button>
    {/if}

    {#if !canDownload}
      <p class="no-data">Select a chord or progression to export</p>
    {/if}
  </div>
</div>

<style>
  .midi-download {
    background: #2a2a2a;
    padding: 20px;
    border-radius: 8px;
    color: white;
  }

  h3 {
    margin: 0 0 15px 0;
    color: #4a9eff;
  }

  .download-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .download-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: background 0.2s, transform 0.1s;
  }

  .download-btn:hover:not(:disabled) {
    background: #4cae4c;
    transform: translateY(-1px);
  }

  .download-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .download-btn:disabled {
    background: #555;
    cursor: not-allowed;
    opacity: 0.5;
  }

  .icon {
    font-size: 20px;
  }

  .no-data {
    color: #888;
    font-style: italic;
    text-align: center;
    margin: 20px 0;
  }
</style>
