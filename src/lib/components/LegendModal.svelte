<script lang="ts">
  import { ZNT_LEGEND_ITEMS, POI_CATEGORY_LEGEND, ROAD_LEGEND_ITEMS } from '$lib/map/symbology';

  let {
    isOpen = false,
    onClose
  }: {
    isOpen: boolean;
    onClose: () => void;
  } = $props();
</script>

{#if isOpen}
  <div
    class="sp-modal-backdrop"
    onclick={onClose}
    onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
    role="button"
    tabindex="0"
    aria-label="Tutup Legenda"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
    <div
      class="sp-modal-card"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-labelledby="legend-title"
      tabindex="-1"
    >
      <div class="sp-modal-header">
        <div class="sp-modal-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <h2 id="legend-title" class="sp-modal-title">Legenda Simbologi Peta</h2>
        </div>
        <button type="button" class="sp-modal-close" onclick={onClose} aria-label="Tutup Legenda">
          &times;
        </button>
      </div>

      <div class="sp-modal-body">
        <!-- Bagian 1: Zona Nilai Tanah -->
        <section class="sp-legend-sec">
          <h3 class="sp-sec-title">Klasifikasi Zona Nilai Tanah (ZNT)</h3>
          <p class="sp-sec-desc">
            Berdasarkan Nilai Indikasi Rata-rata (NIR) per meter persegi sesuai standar survei pemetaan tematik Kementerian ATR/BPN.
          </p>

          <div class="sp-znt-grid">
            {#each ZNT_LEGEND_ITEMS as item (item.kelas)}
              <div class="sp-znt-item">
                <span class="sp-znt-swatch" style="background-color: {item.color};"></span>
                <div class="sp-znt-text">
                  <div class="sp-znt-header">
                    <span class="sp-znt-kelas">Kelas {item.kelas}</span>
                    <span class="sp-znt-nir">{item.nir}</span>
                  </div>
                  <span class="sp-znt-range">{item.range}</span>
                  <span class="sp-znt-desc">{item.desc}</span>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <hr class="sp-divider" />

        <!-- Bagian 2: Jaringan Jalan -->
        <section class="sp-legend-sec">
          <h3 class="sp-sec-title">Hierarki Jaringan Jalan</h3>
          <div class="sp-road-grid">
            {#each ROAD_LEGEND_ITEMS as road (road.fungsi)}
              <div class="sp-road-item">
                <div class="sp-road-line-preview" style="background-color: {road.color}; height: {road.width}px;"></div>
                <div class="sp-road-info">
                  <span class="sp-road-name">{road.fungsi}</span>
                  <span class="sp-road-desc">{road.desc}</span>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <hr class="sp-divider" />

        <!-- Bagian 3: Fasilitas Umum -->
        <section class="sp-legend-sec">
          <h3 class="sp-sec-title">Kategori Fasilitas Umum (POI)</h3>
          <div class="sp-poi-grid">
            {#each POI_CATEGORY_LEGEND as poi (poi.kategori)}
              <div class="sp-poi-item">
                <span class="sp-poi-dot" style="background-color: {poi.color};"></span>
                <div class="sp-poi-info">
                  <span class="sp-poi-name">{poi.kategori}</span>
                  <span class="sp-poi-desc">{poi.desc}</span>
                </div>
              </div>
            {/each}
          </div>
        </section>
      </div>
    </div>
  </div>
{/if}

<style>
  .sp-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 16px;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .sp-modal-card {
    width: 100%;
    max-width: 520px;
    max-height: 85vh;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(15, 58, 95, 0.25);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sp-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .sp-modal-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #0f3a5f;
  }

  .sp-modal-title {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #0f3a5f;
  }

  .sp-modal-close {
    background: none;
    border: none;
    font-size: 22px;
    line-height: 1;
    color: #94a3b8;
    cursor: pointer;
  }

  .sp-modal-close:hover {
    color: #0f172a;
  }

  .sp-modal-body {
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sp-sec-title {
    margin: 0 0 4px 0;
    font-size: 13px;
    font-weight: 700;
    color: #0f3a5f;
  }

  .sp-sec-desc {
    margin: 0 0 12px 0;
    font-size: 11px;
    color: #64748b;
    line-height: 1.4;
  }

  .sp-znt-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .sp-znt-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 8px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 8px;
  }

  .sp-znt-swatch {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    margin-top: 2px;
    flex-shrink: 0;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .sp-znt-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
  }

  .sp-znt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sp-znt-kelas {
    font-size: 11px;
    font-weight: 700;
    color: #0f172a;
  }

  .sp-znt-nir {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    color: #0369a1;
  }

  .sp-znt-range {
    font-size: 10px;
    color: #475569;
    font-weight: 500;
  }

  .sp-znt-desc {
    font-size: 9px;
    color: #94a3b8;
  }

  .sp-divider {
    border: none;
    border-top: 1px solid #f1f5f9;
    margin: 0;
  }

  .sp-road-grid,
  .sp-poi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .sp-road-item,
  .sp-poi-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    background: #f8fafc;
    border-radius: 8px;
  }

  .sp-road-line-preview {
    width: 24px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .sp-road-info,
  .sp-poi-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .sp-road-name,
  .sp-poi-name {
    font-size: 11px;
    font-weight: 700;
    color: #0f172a;
  }

  .sp-road-desc,
  .sp-poi-desc {
    font-size: 9px;
    color: #64748b;
  }

  .sp-poi-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    border: 2px solid #ffffff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 540px) {
    .sp-znt-grid,
    .sp-road-grid,
    .sp-poi-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
