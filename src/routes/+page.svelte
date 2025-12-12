<script lang="ts">
  import Fretboard from '$lib/components/Fretboard.svelte';
  import PianoView from '$lib/components/PianoView.svelte';
  import ChordSelector from '$lib/components/ChordSelector.svelte';
  import ReverseFinder from '$lib/components/ReverseFinder.svelte';
  import ProgressionEditor from '$lib/components/ProgressionEditor.svelte';
  import MidiDownload from '$lib/components/MidiDownload.svelte';
  import ScaleSelector from '$lib/components/ScaleSelector.svelte';
  import ScaleDisplay from '$lib/components/ScaleDisplay.svelte';
  
  import { getDefaultTuning, type Tuning } from '$lib/music/tunings';
  import { buildChord, type Chord } from '$lib/music/chords';
  import { generateVoicings, type Voicing } from '$lib/music/voicings';
  import { type NoteName } from '$lib/music/notes';
  import { type Progression } from '$lib/music/progressions';
  import { generateScale } from '$lib/music/scales';

  // State
  let tuning: Tuning = $state(getDefaultTuning());
  let selectedRoot: NoteName = $state('C');
  let selectedType: string = $state('major');
  let currentChord: Chord | null = $state(null);
  let currentVoicing: Voicing | null = $state(null);
  let selectedNotes: Set<number> = $state(new Set());
  let currentProgression: Progression | null = $state(null);
  let activeView: 'chords' | 'progression' | 'scales' = $state('chords');
  
  // Scale state
  let selectedScaleRoot: NoteName = $state('C');
  let selectedScaleType: string = $state('major');
  let currentScale: number[] = $state([]);

  // Update chord when selection changes
  function handleChordChange(root: NoteName, type: string) {
    selectedRoot = root;
    selectedType = type;
    updateChord();
  }

  function updateChord() {
    currentChord = buildChord(selectedRoot, selectedType, 60);
    
    // Generate voicings
    const voicings = generateVoicings(currentChord.notes, tuning);
    currentVoicing = voicings.length > 0 ? voicings[0] : null;
  }

  function handlePianoClick(midi: number) {
    const pitch = midi % 12;
    const newSet = new Set(selectedNotes);
    
    if (newSet.has(pitch)) {
      newSet.delete(pitch);
    } else {
      newSet.add(pitch);
    }
    
    selectedNotes = newSet;
  }

  function handleClearNotes() {
    selectedNotes = new Set();
  }

  function handleProgressionChange(progression: Progression | null) {
    currentProgression = progression;
  }

  function handleScaleChange(root: NoteName, scaleType: string) {
    selectedScaleRoot = root;
    selectedScaleType = scaleType;
    updateScale();
  }

  function updateScale() {
    currentScale = generateScale(selectedScaleRoot, selectedScaleType, 60);
  }

  // Initialize
  updateChord();
  updateScale();
</script>

<div class="app">
  <header>
    <h1>🎸 Tunechords</h1>
    <p class="subtitle">Interactive Chord, Tuning & Progression Explorer</p>
  </header>

  <div class="view-tabs">
    <button
      class="tab"
      class:active={activeView === 'chords'}
      onclick={() => activeView = 'chords'}
    >
      Chord Explorer
    </button>
    <button
      class="tab"
      class:active={activeView === 'scales'}
      onclick={() => activeView = 'scales'}
    >
      Scale Explorer
    </button>
    <button
      class="tab"
      class:active={activeView === 'progression'}
      onclick={() => activeView = 'progression'}
    >
      Progression Builder
    </button>
  </div>

  {#if activeView === 'chords'}
    <div class="main-content">
      <div class="left-panel">
        <ChordSelector
          bind:selectedRoot
          bind:selectedType
          onChordChange={handleChordChange}
        />
        
        <div class="section">
          <h2>Fretboard</h2>
          <Fretboard
            {tuning}
            voicing={currentVoicing}
            maxFrets={15}
          />
        </div>
      </div>

      <div class="right-panel">
        <div class="section">
          <h2>Piano</h2>
          <PianoView
            activeNotes={currentChord ? new Set(currentChord.notes.map(n => n % 12)) : new Set()}
            interactive={true}
            onNoteClick={handlePianoClick}
          />
        </div>

        <ReverseFinder
          {selectedNotes}
          onClear={handleClearNotes}
        />

        <MidiDownload chord={currentChord} />
      </div>
    </div>
  {:else if activeView === 'scales'}
    <div class="main-content">
      <div class="left-panel">
        <ScaleSelector
          bind:selectedRoot={selectedScaleRoot}
          bind:selectedScale={selectedScaleType}
          onScaleChange={handleScaleChange}
        />
        
        <div class="section">
          <h2>Fretboard</h2>
          <Fretboard
            {tuning}
            selectedNotes={new Set(currentScale.map(n => n % 12))}
            maxFrets={15}
          />
        </div>
      </div>

      <div class="right-panel">
        <div class="section">
          <h2>Piano</h2>
          <PianoView
            activeNotes={new Set(currentScale.map(n => n % 12))}
          />
        </div>

        <ScaleDisplay
          scaleNotes={currentScale}
          root={selectedScaleRoot}
          scaleType={selectedScaleType}
        />
      </div>
    </div>
  {:else}
    <div class="main-content">
      <div class="left-panel">
        <ProgressionEditor
          bind:progression={currentProgression}
          onProgressionChange={handleProgressionChange}
        />
        
        {#if currentProgression && currentProgression.chords.length > 0}
          <div class="section">
            <h2>Progression Preview</h2>
            <Fretboard
              {tuning}
              voicing={generateVoicings(
                currentProgression.chords[0].chord.notes,
                tuning
              )[0] || null}
              maxFrets={12}
            />
          </div>
        {/if}
      </div>

      <div class="right-panel">
        {#if currentProgression}
          <div class="section">
            <h2>Progression Piano View</h2>
            <PianoView
              activeNotes={currentProgression.chords.length > 0 
                ? new Set(currentProgression.chords[0].chord.notes.map(n => n % 12))
                : new Set()
              }
            />
          </div>
        {/if}

        <MidiDownload progression={currentProgression} />
      </div>
    </div>
  {/if}

  <footer>
    <p>Built with SvelteKit + TypeScript | No backend required</p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #1a1a1a;
    color: white;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px 20px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  h1 {
    margin: 0;
    font-size: 48px;
    font-weight: 700;
  }

  .subtitle {
    margin: 10px 0 0 0;
    font-size: 18px;
    opacity: 0.9;
  }

  .view-tabs {
    display: flex;
    gap: 0;
    padding: 0 20px;
    background: #2a2a2a;
    border-bottom: 2px solid #333;
  }

  .tab {
    padding: 15px 30px;
    background: transparent;
    border: none;
    color: #888;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
  }

  .tab:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
  }

  .tab.active {
    color: #4a9eff;
    border-bottom-color: #4a9eff;
  }

  .main-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding: 20px;
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
  }

  @media (max-width: 1200px) {
    .main-content {
      grid-template-columns: 1fr;
    }
  }

  .left-panel,
  .right-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .section {
    background: #2a2a2a;
    padding: 20px;
    border-radius: 8px;
  }

  .section h2 {
    margin: 0 0 15px 0;
    color: #4a9eff;
    font-size: 20px;
  }

  footer {
    background: #2a2a2a;
    padding: 20px;
    text-align: center;
    color: #888;
    font-size: 14px;
    border-top: 1px solid #333;
  }

  footer p {
    margin: 0;
  }
</style>
