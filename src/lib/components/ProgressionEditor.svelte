<script lang="ts">
  import { NOTE_NAMES, type NoteName } from '$lib/music/notes';
  import { getPresetProgressionNames, getPresetProgression, type Progression } from '$lib/music/progressions';

  interface Props {
    progression?: Progression | null;
    onProgressionChange?: (progression: Progression | null) => void;
  }

  let {
    progression = $bindable(null),
    onProgressionChange
  }: Props = $props();

  let selectedKey: NoteName = $state('C');
  let selectedPreset: string = $state('I-V-vi-IV');

  const presetNames = getPresetProgressionNames();

  function handlePresetChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedPreset = target.value;
    loadPreset();
  }

  function handleKeyChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedKey = target.value as NoteName;
    loadPreset();
  }

  function loadPreset() {
    const prog = getPresetProgression(selectedPreset, selectedKey);
    progression = prog;
    if (onProgressionChange) {
      onProgressionChange(prog);
    }
  }

  function handleClear() {
    progression = null;
    if (onProgressionChange) {
      onProgressionChange(null);
    }
  }

  // Load initial progression
  $effect(() => {
    if (!progression) {
      loadPreset();
    }
  });
</script>

<div class="progression-editor">
  <h3>Progression Editor</h3>
  
  <div class="controls">
    <div class="control-group">
      <label for="key-select">Key:</label>
      <select id="key-select" value={selectedKey} onchange={handleKeyChange}>
        {#each NOTE_NAMES as note}
          <option value={note}>{note}</option>
        {/each}
      </select>
    </div>

    <div class="control-group">
      <label for="preset-select">Preset:</label>
      <select id="preset-select" value={selectedPreset} onchange={handlePresetChange}>
        {#each presetNames as name}
          <option value={name}>{name}</option>
        {/each}
      </select>
    </div>

    <button class="clear-btn" onclick={handleClear}>Clear</button>
  </div>

  {#if progression}
    <div class="progression-display">
      <div class="progression-info">
        <strong>{progression.name}</strong> in <strong>{progression.key}</strong>
        {#if progression.tempo}
          <span class="tempo">♩ = {progression.tempo}</span>
        {/if}
      </div>

      <div class="chord-sequence">
        {#each progression.chords as pc, index}
          <div class="chord-card">
            <div class="chord-number">{index + 1}</div>
            <div class="chord-symbol">{pc.chord.symbol}</div>
            {#if pc.romanNumeral}
              <div class="roman-numeral">{pc.romanNumeral}</div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="no-progression">
      <p>No progression loaded</p>
    </div>
  {/if}
</div>

<style>
  .progression-editor {
    background: #2a2a2a;
    padding: 20px;
    border-radius: 8px;
    color: white;
  }

  h3 {
    margin: 0 0 15px 0;
    color: #4a9eff;
  }

  .controls {
    display: flex;
    gap: 15px;
    align-items: end;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  label {
    font-weight: 500;
    font-size: 14px;
  }

  select {
    padding: 8px 12px;
    background: #1a1a1a;
    color: white;
    border: 1px solid #555;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    min-width: 150px;
  }

  select:hover {
    border-color: #4a9eff;
  }

  select:focus {
    outline: none;
    border-color: #4a9eff;
    box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2);
  }

  .clear-btn {
    padding: 8px 16px;
    background: #d9534f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }

  .clear-btn:hover {
    background: #c9302c;
  }

  .progression-display {
    background: #1a1a1a;
    padding: 15px;
    border-radius: 4px;
  }

  .progression-info {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #333;
  }

  .tempo {
    margin-left: 15px;
    color: #888;
    font-size: 14px;
  }

  .chord-sequence {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .chord-card {
    background: #2a2a2a;
    padding: 15px;
    border-radius: 4px;
    text-align: center;
    min-width: 80px;
    transition: transform 0.2s, background 0.2s;
  }

  .chord-card:hover {
    transform: translateY(-2px);
    background: #333;
  }

  .chord-number {
    font-size: 12px;
    color: #888;
    margin-bottom: 5px;
  }

  .chord-symbol {
    font-size: 20px;
    font-weight: bold;
    color: #4a9eff;
    margin-bottom: 5px;
  }

  .roman-numeral {
    font-size: 14px;
    color: #888;
    font-style: italic;
  }

  .no-progression {
    padding: 30px;
    text-align: center;
    color: #888;
    font-style: italic;
  }
</style>
