<script lang="ts">
  import { midiToNote, type NoteName } from '$lib/music/notes';
  import { SCALE_TYPES } from '$lib/music/scales';

  interface Props {
    scaleNotes: number[];
    root: NoteName;
    scaleType: string;
  }

  let { scaleNotes, root, scaleType }: Props = $props();

  function getNoteNames(): string[] {
    return scaleNotes.map(midi => midiToNote(midi).name);
  }

  function getIntervalPattern(): string {
    const scale = SCALE_TYPES[scaleType];
    if (!scale || scale.intervals.length < 2) return '';
    
    const intervals = scale.intervals;
    const steps: string[] = [];
    
    for (let i = 0; i < intervals.length - 1; i++) {
      const diff = intervals[i + 1] - intervals[i];
      if (diff === 2) {
        steps.push('W');
      } else if (diff === 1) {
        steps.push('H');
      } else {
        steps.push(`${diff}hs`); // e.g., "3hs" for 3 half-steps
      }
    }
    
    return steps.join(' - ');
  }
</script>

<div class="scale-display">
  <h3>Scale Information</h3>
  
  <div class="info-section">
    <div class="info-row">
      <strong>Scale:</strong>
      <span>{root} {SCALE_TYPES[scaleType]?.name}</span>
    </div>
    
    <div class="info-row">
      <strong>Notes:</strong>
      <div class="note-list">
        {#each getNoteNames() as note, i}
          <span class="note-badge" class:root={i === 0}>{note}</span>
        {/each}
      </div>
    </div>
    
    <div class="info-row">
      <strong>Intervals:</strong>
      <span class="interval-pattern">{getIntervalPattern()}</span>
    </div>
    
    <div class="info-row">
      <strong>Total Notes:</strong>
      <span>{scaleNotes.length}</span>
    </div>
  </div>
</div>

<style>
  .scale-display {
    background: #2a2a2a;
    padding: 20px;
    border-radius: 8px;
    color: white;
  }

  h3 {
    margin: 0 0 15px 0;
    color: #4a9eff;
  }

  .info-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .info-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .info-row strong {
    color: #888;
    font-size: 14px;
  }

  .info-row span {
    font-size: 16px;
  }

  .note-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .note-badge {
    background: #1a1a1a;
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid #555;
    font-weight: 500;
    font-size: 14px;
  }

  .note-badge.root {
    background: #4a9eff;
    color: #fff;
    border-color: #4a9eff;
  }

  .interval-pattern {
    font-family: 'Courier New', monospace;
    color: #4a9eff;
  }
</style>
