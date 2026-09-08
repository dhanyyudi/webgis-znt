<script lang="ts">
  import type { SearchResultItem } from '$lib/types/gis';
  import poiData from '$data/fasilitas-publik.geojson';
  import batasData from '$data/batas-administrasi.geojson';
  import jalanData from '$data/jaringan-jalan.geojson';

  let {
    onSelectResult,
    onActivate
  }: {
    onSelectResult: (result: SearchResultItem) => void;
    onActivate?: () => void;
  } = $props();

  let query = $state('');
  let isOpen = $state(false);
  let isFocused = $state(false);

  // Buat indeks pencarian lokal
  const searchIndex: SearchResultItem[] = [];

  // 1. Indeks POI
  for (const f of poiData.features) {
    const coords = f.geometry.coordinates as [number, number];
    searchIndex.push({
      id: 'poi-' + f.properties.id,
      title: f.properties.nama,
      category: 'Fasilitas: ' + f.properties.kategori,
      subtitle: f.properties.alamat,
      coordinates: coords,
      layerId: 'fasilitas-publik',
      feature: f as any
    });
  }

  // 2. Indeks Desa/Batas
  for (const f of batasData.features) {
    // Cari centroid sederhana dari koordinat polygon pertama
    const ring = f.geometry.coordinates[0][0] || f.geometry.coordinates[0];
    const midLng = ring[Math.floor(ring.length / 2)][0];
    const midLat = ring[Math.floor(ring.length / 2)][1];
    searchIndex.push({
      id: 'desa-' + f.properties.id,
      title: 'Desa/Kelurahan ' + f.properties.nama_desa,
      category: 'Wilayah Administrasi',
      subtitle: 'Kecamatan ' + f.properties.nama_kecamatan + ', Kabupaten Cirebon',
      coordinates: [midLng, midLat],
      layerId: 'batas-administrasi',
      feature: f as any
    });
  }

  // 3. Indeks Jalan Utama (unique name)
  const seenRoads = new Set<string>();
  for (const f of jalanData.features) {
    const name = f.properties.nama_ruas;
    if (!seenRoads.has(name)) {
      seenRoads.add(name);
      const midCoord = f.geometry.coordinates[Math.floor(f.geometry.coordinates.length / 2)] as [number, number];
      searchIndex.push({
        id: 'jalan-' + f.properties.id,
        title: name,
        category: 'Ruas Jalan (' + f.properties.fungsi_jalan + ')',
        subtitle: 'Lebar: ' + f.properties.lebar_ruas + ', ' + f.properties.kondisi,
        coordinates: midCoord,
        layerId: 'jaringan-jalan',
        feature: f as any
      });
    }
  }

  let filteredResults = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return searchIndex
      .filter(item => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      .slice(0, 8);
  });

  function handleSelect(item: SearchResultItem) {
    onSelectResult(item);
    query = item.title;
    isOpen = false;
  }

  function handleClear() {
    query = '';
    isOpen = false;
  }
</script>

<div class="sp-search-container">
  <div class="sp-search-input-wrap" class:focused={isFocused}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" class="sp-search-icon">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>

    <input
      type="text"
      bind:value={query}
      onfocus={() => {
        onActivate?.();
        isFocused = true;
        isOpen = true;
      }}
      onblur={() => {
        isFocused = false;
        // Tunggu sebentar agar event klik item terproses
        setTimeout(() => (isOpen = false), 200);
      }}
      placeholder="Cari fasilitas, jalan..."
      class="sp-search-input"
      aria-label="Cari Objek Spasial"
    />

    {#if query}
      <button type="button" class="sp-clear-btn" onclick={handleClear} aria-label="Bersihkan pencarian">
        &times;
      </button>
    {/if}
  </div>

  {#if isOpen && filteredResults.length > 0}
    <ul class="sp-search-dropdown">
      {#each filteredResults as res (res.id)}
        <li>
          <button type="button" class="sp-result-item" onmousedown={() => handleSelect(res)}>
            <div class="sp-result-main">
              <span class="sp-result-title">{res.title}</span>
              <span class="sp-result-cat">{res.category}</span>
            </div>
            <span class="sp-result-sub">{res.subtitle}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .sp-search-container {
    position: relative;
    width: 200px;
    z-index: 1600;
  }

  .sp-search-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(15, 58, 95, 0.18);
    border-radius: 999px;
    box-shadow: 0 4px 14px rgba(15, 58, 95, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }

  .sp-search-input-wrap.focused {
    border-color: #0f3a5f;
    box-shadow: 0 6px 20px rgba(15, 58, 95, 0.18);
    background: #ffffff;
  }

  .sp-search-icon {
    flex-shrink: 0;
  }

  .sp-search-input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 12px;
    color: #0f172a;
    width: 100%;
    font-family: 'Inter', sans-serif;
  }

  .sp-search-input::placeholder {
    color: #94a3b8;
  }

  .sp-clear-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    padding: 0 4px;
  }

  .sp-clear-btn:hover {
    color: #0f172a;
  }

  .sp-search-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 320px;
    background: #ffffff;
    border: 1px solid rgba(15, 58, 95, 0.15);
    border-radius: 12px;
    list-style: none;
    margin: 0;
    padding: 6px;
    box-shadow: 0 10px 25px rgba(15, 58, 95, 0.18);
    max-height: 280px;
    overflow-y: auto;
    z-index: 1700;
  }

  .sp-result-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    padding: 8px 10px;
    border: none;
    background: transparent;
    border-radius: 6px;
    text-align: left;
    cursor: pointer;
    transition: background 0.12s ease;
  }

  .sp-result-item:hover {
    background: #f1f5f9;
  }

  .sp-result-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  .sp-result-title {
    font-size: 12px;
    font-weight: 700;
    color: #0f3a5f;
    line-height: 1.25;
  }

  .sp-result-cat {
    font-size: 9px;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 600;
    color: #0369a1;
    background: #e0f2fe;
    padding: 1px 5px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .sp-result-sub {
    font-size: 10px;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 600px) {
    .sp-search-container {
      right: 50px;
      width: 160px;
    }
  }

  @media (max-width: 1024px) {
    .sp-search-container { width: auto; min-width: 0; right: auto; }
    .sp-search-input-wrap { height: 44px; padding: 0 10px; gap: 6px; }
    .sp-search-input { min-width: 0; font-size: 16px; }
    .sp-search-dropdown { position: fixed; top: calc(var(--sp-mobile-top) + 102px); left: var(--sp-mobile-left); right: var(--sp-mobile-right); width: auto; max-height: min(280px, calc(100dvh - 210px)); }
    .sp-result-main { align-items: flex-start; flex-direction: column; }
    .sp-result-sub { white-space: normal; }
  }
</style>
