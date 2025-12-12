<script lang="ts">
  import { NOTE_NAMES, type NoteName } from '$lib/music/notes';
  import { getAllScaleTypes, SCALE_TYPES } from '$lib/music/scales';

  interface Props {
    selectedRoot?: NoteName;
    selectedScale?: string;
    onScaleChange?: (root: NoteName, scale: string) => void;
  }

  let {
    selectedRoot = $bindable('C'),
    selectedScale = $bindable('major'),
    onScaleChange
  }: Props = $props();

  const scaleTypes = getAllScaleTypes();

  function handleRootChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedRoot = target.value as NoteName;
    if (onScaleChange) {
      onScaleChange(selectedRoot, selectedScale);
    }
  }

  function handleScaleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedScale = target.value;
    if (onScaleChange) {
      onScaleChange(selectedRoot, selectedScale);
    }
  }

  function getScaleDisplay(): string {
    const def = SCALE_TYPES[selectedScale];
    return `${selectedRoot} ${def?.name || ''}`;
  }
</script>

<div class="scale-selector">
  <h3>Scale Selector</h3>
  
  <div class="selector-group">
    <label for="scale-root-select">Root Note:</label>
    <select id="scale-root-select" value={selectedRoot} onchange={handleRootChange}>
      {#each NOTE_NAMES as note}
        <option value={note}>{note}</option>
      {/each}
    </select>

    <label for="scale-type-select">Scale Type:</label>
    <select id="scale-type-select" value={selectedScale} onchange={handleScaleChange}>
      {#each scaleTypes as type}
        <option value={type}>{SCALE_TYPES[type].name}</option>
      {/each}
    </select>
  </div>

  <div class="scale-display">
    <strong>Selected Scale:</strong>
    <span class="scale-name">{getScaleDisplay()}</span>
  </div>
</div>

<style>
  .scale-selector {
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

  .scale-display {
    padding: 15px;
    background: #1a1a1a;
    border-radius: 4px;
    text-align: center;
  }

  .scale-name {
    display: inline-block;
    margin-left: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #4a9eff;
  }
</style>
