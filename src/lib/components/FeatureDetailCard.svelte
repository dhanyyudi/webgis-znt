<script lang="ts">
  import type { SelectedFeatureInfo } from '$lib/types/gis';
  import { formatPropertyKey, formatRupiah, formatCoordinate } from '$lib/utils/formatters';

  let {
    info,
    onClose,
    onZoomTo
  }: {
    info: SelectedFeatureInfo;
    onClose: () => void;
    onZoomTo: (coords: [number, number]) => void;
  } = $props();

  let isCopied = $state(false);

  function copyCoordinates() {
    if (!info.coordinates) return;
    const text = formatCoordinate(info.coordinates[1], info.coordinates[0]);
    navigator.clipboard.writeText(text);
    isCopied = true;
    setTimeout(() => (isCopied = false), 1800);
  }

  function renderValue(key: string, val: any): string {
    if (val === null || val === undefined || val === '') return 'Tidak ada data';
    if (typeof val === 'number') {
      if (key === 'nir_m2') {
        return formatRupiah(val) + ' / m²';
      }
      return val.toLocaleString('id-ID');
    }
    return String(val);
  }
</script>

<aside class="sp-detail-card" aria-label="Detail Informasi Objek">
  <div class="sp-card-header">
    <div class="sp-header-info">
      <span class="sp-layer-badge">{info.layerTitle}</span>
      <h2 class="sp-card-title">{info.title}</h2>
      {#if info.subtitle}
        <p class="sp-card-subtitle">{info.subtitle}</p>
      {/if}
    </div>

    <button type="button" class="sp-close-btn" onclick={onClose} aria-label="Tutup Panel">
      &times;
    </button>
  </div>

  <div class="sp-card-body">
    <table class="sp-prop-table">
      <tbody>
        {#each Object.entries(info.properties) as [key, value] (key)}
          {#if !['id', 'object_id', 'warna_simbologi', 'warna_kategori'].includes(key)}
            <tr>
              <th scope="row" class="sp-table-key">{formatPropertyKey(key)}</th>
              <td class="sp-table-val">{renderValue(key, value)}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>

  <div class="sp-card-footer">
    {#if info.coordinates}
      <button
        type="button"
        class="sp-action-btn"
        onclick={() => onZoomTo(info.coordinates!)}
        title="Pusatkan dan perbesar tampilan ke objek ini"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <line x1="11" x2="11" y1="8" y2="14" />
          <line x1="8" x2="14" y1="11" y2="11" />
        </svg>
        <span>Perbesar Objek</span>
      </button>

      <button
        type="button"
        class="sp-action-btn sp-action-btn-secondary"
        onclick={copyCoordinates}
        title="Salin koordinat objek"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <span>{isCopied ? 'Tersalin!' : 'Salin Koordinat'}</span>
      </button>
    {/if}
  </div>
</aside>

<style>
  .sp-detail-card {
    position: fixed;
    bottom: 24px;
    right: 14px;
    width: 340px;
    max-width: calc(100vw - 28px);
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(15, 58, 95, 0.18);
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(15, 58, 95, 0.16);
    backdrop-filter: blur(16px);
    z-index: 990;
    overflow: hidden;
    animation: slideUp 0.2s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .sp-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .sp-header-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .sp-layer-badge {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    color: #0369a1;
    letter-spacing: 0.05em;
  }

  .sp-card-title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #0f3a5f;
    line-height: 1.3;
  }

  .sp-card-subtitle {
    margin: 0;
    font-size: 11px;
    color: #64748b;
  }

  .sp-close-btn {
    background: none;
    border: none;
    font-size: 20px;
    line-height: 1;
    color: #94a3b8;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .sp-close-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .sp-card-body {
    padding: 10px 16px;
    max-height: 260px;
    overflow-y: auto;
  }

  .sp-prop-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }

  .sp-prop-table tr {
    border-bottom: 1px solid #f1f5f9;
  }

  .sp-prop-table tr:last-child {
    border-bottom: none;
  }

  .sp-table-key {
    text-align: left;
    padding: 6px 4px 6px 0;
    color: #64748b;
    font-weight: 500;
    width: 42%;
    vertical-align: top;
  }

  .sp-table-val {
    padding: 6px 0 6px 4px;
    color: #1e293b;
    font-weight: 600;
    vertical-align: top;
    word-break: break-word;
  }

  .sp-card-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }

  .sp-action-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px 10px;
    background: #0f3a5f;
    border: 1px solid #0f3a5f;
    border-radius: 6px;
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .sp-action-btn:hover {
    background: #163f63;
  }

  .sp-action-btn-secondary {
    background: #ffffff;
    border-color: #cbd5e1;
    color: #334155;
  }

  .sp-action-btn-secondary:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
</style>
