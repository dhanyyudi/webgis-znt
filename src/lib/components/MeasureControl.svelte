<script lang="ts">
  import { onMount } from 'svelte';
  import type { MeasureMode } from '$lib/types/gis';

  let {
    activeMode = 'none',
    resultText = '',
    onSetMode,
    onClear,
    onActivate
  }: {
    activeMode: MeasureMode;
    resultText: string;
    onSetMode: (mode: MeasureMode) => void;
    onClear: () => void;
    onActivate?: () => void;
  } = $props();

  let isPanelOpen = $state(false);
  let isStatsOpen = $state(false);

  onMount(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('showStats') === 'true') {
        isStatsOpen = true;
      }
    }
  });

  function selectMode(mode: MeasureMode) {
    onActivate?.();
    isStatsOpen = false;
    if (activeMode === mode) {
      onSetMode('none');
      isPanelOpen = false;
    } else {
      onSetMode(mode);
      isPanelOpen = true;
    }
  }

  function toggleStats() {
    onActivate?.();
    onSetMode('none');
    isPanelOpen = false;
    isStatsOpen = !isStatsOpen;
  }

  function handleClose() {
    onSetMode('none');
    isPanelOpen = false;
    isStatsOpen = false;
  }
</script>

<div class="sp-measure-wrapper">
  <div class="sp-measure-trigger-bar">
    <button
      type="button"
      class="sp-measure-btn"
      class:active={activeMode === 'distance'}
      onclick={() => selectMode('distance')}
      title="Ukur Jarak Lintasan (Formula Haversine)"
      aria-label="Ukur Jarak"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
        <path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2" />
      </svg>
      <span class="btn-text">Ukur Jarak</span>
    </button>

    <button
      type="button"
      class="sp-measure-btn"
      class:active={activeMode === 'area'}
      onclick={() => selectMode('area')}
      title="Ukur Luas Poligon (Formula Geodesik)"
      aria-label="Ukur Luas"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
      <span class="btn-text">Ukur Luas</span>
    </button>

    <button
      type="button"
      class="sp-measure-btn"
      class:active={isStatsOpen}
      onclick={toggleStats}
      title="Kalkulasi Spasial & Statistik Wilayah Terpetakan"
      aria-label="Kalkulasi Spasial"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
      <span class="btn-text">Kalkulasi Spasial</span>
    </button>
  </div>

  {#if isPanelOpen && activeMode !== 'none'}
    <div class="sp-measure-status-card">
      <div class="sp-status-header">
        <span class="sp-status-title">
          {activeMode === 'distance' ? 'Pengukuran Jarak Lintasan' : 'Pengukuran Luas Area'}
        </span>
        <button type="button" class="sp-close-small" onclick={handleClose} aria-label="Tutup Alat Ukur">
          &times;
        </button>
      </div>

      <div class="sp-status-content">
        {#if resultText}
          <div class="sp-result-badge">{resultText}</div>
        {:else}
          <p class="sp-guide-text">
            Klik pada peta untuk menempatkan titik ukur. Hubungkan minimal {activeMode === 'distance' ? '2 titik' : '3 titik'} untuk melihat hasil kalkulasi instan.
          </p>
        {/if}
      </div>

      <div class="sp-status-actions">
        <button type="button" class="sp-reset-btn" onclick={onClear}>
          Hapus Titik Ukur
        </button>
      </div>
    </div>
  {/if}

  {#if isStatsOpen}
    <div class="sp-stats-card">
      <div class="sp-status-header">
        <div class="sp-stats-header-wrap">
          <span class="sp-stats-dot"></span>
          <span class="sp-status-title">Kalkulasi Spasial Wilayah</span>
        </div>
        <button type="button" class="sp-close-small" onclick={handleClose} aria-label="Tutup Statistik">
          &times;
        </button>
      </div>

      <div class="sp-stats-grid">
        <div class="sp-stat-box">
          <span class="sp-stat-label">Panjang Jaringan Jalan</span>
          <span class="sp-stat-value">119,78 km</span>
          <span class="sp-stat-sub">165 segmen jalan berhierarki</span>
        </div>

        <div class="sp-stat-box">
          <span class="sp-stat-label">Panjang Aliran Sungai</span>
          <span class="sp-stat-value">112,63 km</span>
          <span class="sp-stat-sub">52 saluran hidrologi air</span>
        </div>

        <div class="sp-stat-box">
          <span class="sp-stat-label">Jumlah Poligon ZNT</span>
          <span class="sp-stat-value">48 Zona</span>
          <span class="sp-stat-sub">Delineasi 8 kelas standar BPN</span>
        </div>

        <div class="sp-stat-box">
          <span class="sp-stat-label">Rata-rata Nilai NIR</span>
          <span class="sp-stat-value">Rp 1.789.583 / m²</span>
          <span class="sp-stat-sub">Rentang: Rp 75.000–Rp 6.800.000</span>
        </div>

        <div class="sp-stat-box">
          <span class="sp-stat-label">Fasilitas Publik (POI)</span>
          <span class="sp-stat-value">75 Lokasi</span>
          <span class="sp-stat-sub">Tersebar merata di 5 zona</span>
        </div>

        <div class="sp-stat-box">
          <span class="sp-stat-label">Wilayah Administrasi</span>
          <span class="sp-stat-value">27 Desa</span>
          <span class="sp-stat-sub">Kabupaten Cirebon</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .sp-measure-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 1550;
  }

  .sp-measure-trigger-bar {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid var(--sp-border);
    border-radius: 999px;
    padding: 3px 5px;
    box-shadow: 0 4px 14px rgba(15, 58, 95, 0.1);
    backdrop-filter: blur(10px);
  }

  .sp-measure-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 9px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 999px;
    color: var(--sp-ink-secondary);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .sp-measure-btn:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  .sp-measure-btn.active {
    background: #0284c7;
    color: #ffffff;
    border-color: #0284c7;
  }

  .sp-measure-status-card {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 250px;
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(15, 58, 95, 0.18);
    border-radius: 12px;
    padding: 12px 14px;
    box-shadow: 0 10px 25px rgba(15, 58, 95, 0.18);
    backdrop-filter: blur(14px);
    animation: fadeIn 0.15s ease;
    z-index: 1600;
  }

  .sp-stats-card {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 320px;
    max-width: 90vw;
    background: #ffffff;
    border: 1px solid rgba(15, 58, 95, 0.18);
    border-radius: 14px;
    padding: 14px 16px;
    box-shadow: 0 12px 30px rgba(15, 58, 95, 0.2);
    backdrop-filter: blur(14px);
    animation: fadeIn 0.15s ease;
    z-index: 1600;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .sp-status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #f1f5f9;
  }

  .sp-stats-header-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sp-stats-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #0284c7;
  }

  .sp-status-title {
    font-size: 11.5px;
    font-weight: 700;
    color: #0f3a5f;
    letter-spacing: -0.01em;
  }

  .sp-close-small {
    background: none;
    border: none;
    font-size: 18px;
    line-height: 1;
    color: #94a3b8;
    cursor: pointer;
    padding: 0 4px;
  }

  .sp-close-small:hover {
    color: #0f172a;
  }

  .sp-status-content {
    margin-bottom: 10px;
  }

  .sp-result-badge {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #0284c7;
    background: #e0f2fe;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid #bae6fd;
    text-align: center;
  }

  .sp-guide-text {
    margin: 0;
    font-size: 10.5px;
    color: #64748b;
    line-height: 1.4;
  }

  .sp-status-actions {
    display: flex;
    justify-content: flex-end;
  }

  .sp-reset-btn {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 10.5px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .sp-reset-btn:hover {
    background: #fee2e2;
    color: #dc2626;
    border-color: #fca5a5;
  }

  /* Stats Grid */
  .sp-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .sp-stat-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sp-stat-label {
    font-size: 9.5px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .sp-stat-value {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #0f3a5f;
  }

  .sp-stat-sub {
    font-size: 9px;
    color: #94a3b8;
    line-height: 1.2;
  }

  @media (max-width: 860px) {
    .btn-text {
      display: none;
    }
    .sp-stats-card {
      width: calc(100vw - 32px);
      right: -80px;
    }
  }

  @media (max-width: 1024px) {
    .sp-measure-wrapper { position: static; }
    .sp-measure-trigger-bar { height: 44px; padding: 1px; gap: 0; }
    .sp-measure-btn { width: 40px; height: 40px; justify-content: center; padding: 0; }
    .sp-measure-btn svg { width: 18px; height: 18px; }
    .btn-text { display: none; }
    .sp-stats-card, .sp-measure-status-card { position: fixed; top: calc(var(--sp-mobile-top) + 102px); left: var(--sp-mobile-left); right: var(--sp-mobile-right); width: auto; max-width: none; max-height: calc(100dvh - 230px); overflow-y: auto; overscroll-behavior: contain; }
    .sp-close-small { min-width: 36px; min-height: 36px; }
  }
</style>
