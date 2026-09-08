<script lang="ts">
  import { ZNT_LEGEND_ITEMS, POI_CATEGORY_LEGEND, ROAD_LEGEND_ITEMS, POI_COLOR_MAP, POI_ICON_PATHS } from '$lib/map/symbology';

  let isCollapsed = $state(false);
  let activeTab = $state<'znt' | 'infrastruktur' | 'poi'>('znt');

  function toggleCollapse() {
    isCollapsed = !isCollapsed;
  }
</script>

<div class="sp-legend-widget" class:collapsed={isCollapsed}>
  <!-- Widget Header -->
  <div class="sp-legend-header">
    <div class="sp-header-title-wrap">
      <span class="sp-header-dot"></span>
      <span class="sp-header-title">Legenda Peta Tematik</span>
    </div>

    <button
      type="button"
      class="sp-collapse-btn"
      onclick={toggleCollapse}
      title={isCollapsed ? 'Buka Legenda' : 'Ciutkan Legenda'}
      aria-label="Toggle Legenda"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        style="transform: rotate({isCollapsed ? '180deg' : '0deg'}); transition: transform 0.2s ease;"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  </div>

  {#if !isCollapsed}
    <!-- Tab Navigation -->
    <div class="sp-legend-tabs">
      <button
        type="button"
        class="sp-tab-btn"
        class:active={activeTab === 'znt'}
        onclick={() => (activeTab = 'znt')}
      >
        ZNT (8 Kelas)
      </button>
      <button
        type="button"
        class="sp-tab-btn"
        class:active={activeTab === 'infrastruktur'}
        onclick={() => (activeTab = 'infrastruktur')}
      >
        Jalan & Batas
      </button>
      <button
        type="button"
        class="sp-tab-btn"
        class:active={activeTab === 'poi'}
        onclick={() => (activeTab = 'poi')}
      >
        Fasilitas (POI)
      </button>
    </div>

    <!-- Widget Body -->
    <div class="sp-legend-body">
      {#if activeTab === 'znt'}
        <div class="sp-tab-content">
          <div class="sp-sec-intro">
            Standar Delineasi 8 Kelas Zona Nilai Tanah Kementerian ATR/BPN
          </div>
          <div class="sp-znt-list">
            {#each ZNT_LEGEND_ITEMS as item (item.kelas)}
              <div class="sp-znt-row">
                <span class="sp-znt-swatch" style="background-color: {item.color};"></span>
                <div class="sp-znt-info">
                  <div class="sp-znt-top">
                    <span class="sp-znt-badge">Kelas {item.kelas}</span>
                    <span class="sp-znt-nir">{item.nir}</span>
                  </div>
                  <span class="sp-znt-range">{item.range}</span>
                  <span class="sp-znt-desc">{item.desc}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else if activeTab === 'infrastruktur'}
        <div class="sp-tab-content">
          <div class="sp-sub-sec">
            <span class="sp-sub-heading">Hierarki Jaringan Jalan</span>
            <div class="sp-infra-list">
              {#each ROAD_LEGEND_ITEMS as road (road.fungsi)}
                <div class="sp-infra-row">
                  <div class="sp-road-preview" style="background-color: {road.color}; height: {road.width}px;"></div>
                  <div class="sp-infra-text">
                    <span class="sp-infra-name">{road.fungsi}</span>
                    <span class="sp-infra-desc">{road.desc}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <div class="sp-sub-sec">
            <span class="sp-sub-heading">Batas Wilayah & Hidrologi</span>
            <div class="sp-infra-list">
              <div class="sp-infra-row">
                <div class="sp-admin-preview"></div>
                <div class="sp-infra-text">
                  <span class="sp-infra-name">Batas Administrasi Desa/Kecamatan</span>
                  <span class="sp-infra-desc">Delineasi garis batas wilayah administratif</span>
                </div>
              </div>

              <div class="sp-infra-row">
                <div class="sp-river-preview"></div>
                <div class="sp-infra-text">
                  <span class="sp-infra-name">Aliran Sungai & Saluran Air</span>
                  <span class="sp-infra-desc">Jaringan hidrologi dan saluran drainase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === 'poi'}
        <div class="sp-tab-content">
          <div class="sp-sec-intro">
            Simbol Tematik Fasilitas Publik Tersebar Merata
          </div>
          <div class="sp-poi-list">
            {#each POI_CATEGORY_LEGEND as poi (poi.id)}
              <div class="sp-poi-row">
                <div class="sp-poi-symbol-preview" style="background-color: {poi.color};">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
                    {@html POI_ICON_PATHS[poi.id] || POI_ICON_PATHS.default}
                  </svg>
                </div>
                <div class="sp-poi-info">
                  <span class="sp-poi-name">{poi.label}</span>
                  <span class="sp-poi-desc">{poi.desc}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .sp-legend-widget {
    position: fixed;
    bottom: calc(var(--sp-footer-h) + 12px);
    right: 14px;
    width: 310px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(15, 58, 95, 0.18);
    border-radius: 12px;
    box-shadow: 0 6px 24px rgba(15, 58, 95, 0.16), 0 1px 4px rgba(15, 58, 95, 0.08);
    backdrop-filter: blur(12px);
    z-index: 980;
    overflow: hidden;
    transition: width 0.2s ease, box-shadow 0.2s ease;
  }

  .sp-legend-widget.collapsed {
    width: 210px;
  }

  .sp-legend-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    background: #f8fafc;
    border-bottom: 1px solid rgba(15, 58, 95, 0.1);
    cursor: pointer;
    user-select: none;
  }

  .sp-header-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sp-header-dot {
    width: 8px;
    height: 8px;
    background: #0284c7;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2);
  }

  .sp-header-title {
    font-size: 12px;
    font-weight: 700;
    color: #0f3a5f;
    letter-spacing: -0.01em;
  }

  .sp-collapse-btn {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
    border-radius: 4px;
  }

  .sp-collapse-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .sp-legend-tabs {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 4px 6px 0 6px;
    gap: 4px;
  }

  .sp-tab-btn {
    flex: 1;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 6px 4px;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: center;
    white-space: nowrap;
  }

  .sp-tab-btn:hover {
    color: #0f3a5f;
  }

  .sp-tab-btn.active {
    color: #0f3a5f;
    border-bottom-color: #0f3a5f;
    font-weight: 700;
  }

  .sp-legend-body {
    padding: 10px;
    max-height: 360px;
    overflow-y: auto;
  }

  .sp-sec-intro {
    font-size: 10px;
    color: #64748b;
    margin-bottom: 8px;
    line-height: 1.35;
  }

  /* ZNT Tab */
  .sp-znt-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sp-znt-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 4px 6px;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
  }

  .sp-znt-swatch {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    flex-shrink: 0;
    margin-top: 2px;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .sp-znt-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
  }

  .sp-znt-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sp-znt-badge {
    font-size: 10.5px;
    font-weight: 700;
    color: #0f172a;
  }

  .sp-znt-nir {
    font-size: 10px;
    font-weight: 700;
    font-family: 'IBM Plex Mono', monospace;
    color: #0f3a5f;
  }

  .sp-znt-range {
    font-size: 9.5px;
    font-family: 'IBM Plex Mono', monospace;
    color: #475569;
  }

  .sp-znt-desc {
    font-size: 9.5px;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Infrastruktur Tab */
  .sp-sub-sec {
    margin-bottom: 10px;
  }

  .sp-sub-heading {
    display: block;
    font-size: 10.5px;
    font-weight: 700;
    color: #0f3a5f;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .sp-infra-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sp-infra-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 3px 6px;
    border-radius: 4px;
    background: #f8fafc;
  }

  .sp-road-preview {
    width: 24px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .sp-admin-preview {
    width: 24px;
    height: 0;
    border-top: 2px dashed #0f3a5f;
    flex-shrink: 0;
  }

  .sp-river-preview {
    width: 24px;
    height: 3px;
    background-color: #0284c7;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .sp-infra-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .sp-infra-name {
    font-size: 10.5px;
    font-weight: 600;
    color: #0f172a;
  }

  .sp-infra-desc {
    font-size: 9px;
    color: #64748b;
  }

  /* POI Tab */
  .sp-poi-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sp-poi-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 6px;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
  }

  .sp-poi-symbol-preview {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sp-poi-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .sp-poi-name {
    font-size: 10.5px;
    font-weight: 600;
    color: #0f172a;
  }

  .sp-poi-desc {
    font-size: 9.5px;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 600px) {
    .sp-legend-widget {
      width: calc(100vw - 28px);
      right: 14px;
      left: 14px;
      bottom: calc(var(--sp-footer-h) + 8px);
    }
    .sp-legend-widget.collapsed {
      width: auto;
      right: 14px;
      left: auto;
    }
    .sp-legend-body {
      max-height: 220px;
    }
  }
</style>
