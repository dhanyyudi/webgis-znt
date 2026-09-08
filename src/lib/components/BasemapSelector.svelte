<script lang="ts">
  import type { BasemapId } from '$lib/types/gis';
  import { BASEMAP_OPTIONS } from '$lib/map/basemaps';

  let {
    activeBasemap = 'carto-positron',
    onSelectBasemap,
    isOpen = $bindable(false),
    onExpand
  }: {
    isOpen?: boolean;
    onExpand?: () => void;
    activeBasemap: BasemapId;
    onSelectBasemap: (id: BasemapId) => void;
  } = $props();


  function toggleOpen() {
    if (!isOpen) onExpand?.();
    isOpen = !isOpen;
  }

  function handleSelect(id: BasemapId) {
    onSelectBasemap(id);
    isOpen = false;
  }
</script>

<div class="sp-basemap-container">
  <button
    type="button"
    class="sp-basemap-pill-btn"
    class:active={isOpen}
    onclick={toggleOpen}
    title="Pilih Peta Dasar (Basemap)"
    aria-label="Pilih Peta Dasar"
    aria-expanded={isOpen}
  >
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
    <span class="btn-label">Peta Dasar</span>
  </button>

  {#if isOpen}
    <div class="sp-basemap-dropdown">
      <div class="sp-dropdown-header">
        <span class="sp-dropdown-title">Koleksi Peta Dasar</span>
        <button type="button" class="sp-close-icon" onclick={() => (isOpen = false)} aria-label="Tutup">
          &times;
        </button>
      </div>

      <div class="sp-basemap-grid">
        {#each BASEMAP_OPTIONS as opt (opt.id)}
          <button
            type="button"
            class="sp-basemap-card"
            class:selected={activeBasemap === opt.id}
            onclick={() => handleSelect(opt.id)}
          >
            <div
              class="sp-card-thumb"
              style="background-image: url('{opt.thumbnailUrl}'); background-size: cover; background-position: center;"
            >
              {#if activeBasemap === opt.id}
                <div class="sp-thumb-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              {/if}
            </div>
            <div class="sp-card-info">
              <span class="sp-card-name">{opt.name}</span>
              <span class="sp-card-desc">{opt.description}</span>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .sp-basemap-container {
    position: fixed;
    top: 72px;
    left: 14px;
    z-index: 985;
  }

  .sp-basemap-pill-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 14px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(15, 58, 95, 0.18);
    border-radius: 999px;
    color: #0f3a5f;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(15, 58, 95, 0.12);
    backdrop-filter: blur(10px);
    transition: all 0.15s ease;
  }

  .sp-basemap-pill-btn:hover,
  .sp-basemap-pill-btn.active {
    background: #0f3a5f;
    color: #ffffff;
    box-shadow: 0 6px 18px rgba(15, 58, 95, 0.2);
  }

  .sp-basemap-dropdown {
    position: absolute;
    top: 42px;
    left: 0;
    width: 310px;
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(15, 58, 95, 0.18);
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 10px 28px rgba(15, 58, 95, 0.16);
    backdrop-filter: blur(14px);
    animation: fadeIn 0.15s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .sp-dropdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
  }

  .sp-dropdown-title {
    font-size: 12px;
    font-weight: 700;
    color: #0f3a5f;
  }

  .sp-close-icon {
    background: none;
    border: none;
    font-size: 18px;
    line-height: 1;
    color: #94a3b8;
    cursor: pointer;
  }

  .sp-close-icon:hover {
    color: #0f172a;
  }

  .sp-basemap-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sp-basemap-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px;
    background: #f8fafc;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
  }

  .sp-basemap-card:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .sp-basemap-card.selected {
    background: #e0f2fe;
    border-color: #0284c7;
  }

  .sp-card-thumb {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    flex-shrink: 0;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .sp-thumb-check {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 16px;
    height: 16px;
    background: #0284c7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sp-card-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sp-card-name {
    font-size: 11px;
    font-weight: 700;
    color: #0f172a;
  }

  .sp-card-desc {
    font-size: 10px;
    color: #64748b;
    line-height: 1.25;
  }

  @media (max-width: 1024px) {
    .sp-basemap-container { top: calc(var(--sp-mobile-top) + 104px); left: var(--sp-mobile-left); }
    .sp-basemap-pill-btn { height: 44px; }
    .sp-basemap-dropdown { position: fixed; top: calc(var(--sp-mobile-top) + 154px); left: var(--sp-mobile-left); right: var(--sp-mobile-right); width: auto; max-height: calc(100dvh - 260px); overflow-y: auto; overscroll-behavior: contain; }
    .sp-close-icon { min-width: 36px; min-height: 36px; }
  }
</style>
