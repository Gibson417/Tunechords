<script lang="ts">
  import { NOTE_NAMES, type NoteName } from '$lib/music/notes';
  import { getAllChordTypes, CHORD_TYPES } from '$lib/music/chords';

  interface Props {
    selectedRoot?: NoteName;
    selectedType?: string;
    onChordChange?: (root: NoteName, type: string) => void;
  }

  let {
    selectedRoot = $bindable('C'),
    selectedType = $bindable('major'),
    onChordChange
  }: Props = $props();

  const chordTypes = getAllChordTypes();

  function handleRootChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedRoot = target.value as NoteName;
    if (onChordChange) {
      onChordChange(selectedRoot, selectedType);
    }
  }

  function handleTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedType = target.value;
    if (onChordChange) {
      onChordChange(selectedRoot, selectedType);
    }
  }

  function getChordSymbol(): string {
    const def = CHORD_TYPES[selectedType];
    return `${selectedRoot}${def?.symbol || ''}`;
  }
</script>

<div class="chord-selector">
  <h3>Chord Selector</h3>
  
  <div class="selector-group">
    <label for="root-select">Root Note:</label>
    <select id="root-select" value={selectedRoot} onchange={handleRootChange}>
      {#each NOTE_NAMES as note}
        <option value={note}>{note}</option>
      {/each}
    </select>

    <label for="type-select">Chord Type:</label>
    <select id="type-select" value={selectedType} onchange={handleTypeChange}>
      {#each chordTypes as type}
        <option value={type}>{CHORD_TYPES[type].name}</option>
      {/each}
    </select>
  </div>

  <div class="chord-display">
    <strong>Selected Chord:</strong>
    <span class="chord-symbol">{getChordSymbol()}</span>
  </div>
</div>

<style>
  .chord-selector {
    background: #2a2a2a;
    padding: 20px;
    border-radius: 8px;
    color: white;
  }

  h3 {
    margin: 0 0 15px 0;
    color: #4a9eff;
  }

  .selector-group {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    align-items: center;
    margin-bottom: 15px;
  }

  label {
    font-weight: 500;
  }

  select {
    padding: 8px 12px;
    background: #1a1a1a;
    color: white;
    border: 1px solid #555;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }

  select:hover {
    border-color: #4a9eff;
  }

  select:focus {
    outline: none;
    border-color: #4a9eff;
    box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2);
  }

  .chord-display {
    padding: 15px;
    background: #1a1a1a;
    border-radius: 4px;
    text-align: center;
  }

  .chord-symbol {
    display: inline-block;
    margin-left: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #4a9eff;
  }
</style>
