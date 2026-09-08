<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { MapController } from '$lib/map/map-controller';
  import { INITIAL_LAYERS } from '$lib/map/symbology';

  import BrandPill from '$lib/components/BrandPill.svelte';
  import BasemapSelector from '$lib/components/BasemapSelector.svelte';
  import LayerPanel from '$lib/components/LayerPanel.svelte';
  import LegendWidget from '$lib/components/LegendWidget.svelte';
  import HelpModal from '$lib/components/HelpModal.svelte';
  import ImageLightbox from '$lib/components/ImageLightbox.svelte';
  import SearchControl from '$lib/components/SearchControl.svelte';
  import MeasureControl from '$lib/components/MeasureControl.svelte';
  import type { BasemapId, LayerId, MeasureMode, SearchResultItem, SelectedFeatureInfo } from '$lib/types/gis';

  let mapContainer: HTMLDivElement;
  let mapController: MapController | null = null;

  let layers = $state(JSON.parse(JSON.stringify(INITIAL_LAYERS)));
  let activeBasemap = $state<BasemapId>('carto-positron');
  let selectedFeature = $state<SelectedFeatureInfo | null>(null);

  let cursorCoord = $state('-6.7589, 108.4842');
  let currentZoom = $state('14.5');

  const initialMobile = window.matchMedia('(max-width: 1024px)').matches;
  let isMobile = $state(initialMobile);
  let layersCollapsed = $state(initialMobile);
  let legendCollapsed = $state(initialMobile);
  let basemapOpen = $state(false);
  let measurePanelOpen = $state(false);
  let statsOpen = $state(false);

  function openMobilePanel(panel: 'layers' | 'legend' | 'basemap' | 'tools') {
    if (!isMobile) return;
    if (panel !== 'layers') layersCollapsed = true;
    if (panel !== 'legend') legendCollapsed = true;
    if (panel !== 'basemap') basemapOpen = false;
    if (panel !== 'tools') {
      measurePanelOpen = false;
      statsOpen = false;
      handleSetMeasureMode('none');
    }
  }

  onMount(() => {
    const media = window.matchMedia('(max-width: 1024px)');
    const syncLayout = () => {
      isMobile = media.matches;
      layersCollapsed = isMobile;
      legendCollapsed = isMobile;
      basemapOpen = false;
    };
    media.addEventListener('change', syncLayout);
    return () => media.removeEventListener('change', syncLayout);
  });

  let isHelpOpen = $state(false);
  let hideLegend = $state(false);
  let previewImage = $state<{ url: string; caption?: string; title?: string } | null>(null);

  let measureMode = $state<MeasureMode>('none');
  let measureResultText = $state('');

  onMount(async () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('showHelp') === 'true') isHelpOpen = true;
      if (params.get('hideLegend') === 'true') hideLegend = true;
      if (params.get('showLightbox') === 'true') {
        previewImage = {
          url: '/images/foto_kantor-bpn-cirebon.jpg',
          title: 'Kantor Pertanahan ATR/BPN Kabupaten Cirebon',
          caption: 'Gedung pelayanan survei, pemetaan tematik, dan administrasi pertanahan ATR/BPN Kabupaten Cirebon.'
        };
      }
    }

    mapController = new MapController(mapContainer, {
      onFeatureSelected: (info) => {
        selectedFeature = info;
      },
      onMouseMove: (coords, zoom) => {
        cursorCoord = coords[1].toFixed(4) + ', ' + coords[0].toFixed(4);
        currentZoom = zoom.toFixed(1);
      },
      onImagePreview: (image) => {
        previewImage = image;
      },
      onMeasureUpdated: (_points, resultText) => {
        measureResultText = resultText;
      }
    });

    await mapController.init(activeBasemap);
  });

  onDestroy(() => {
    if (mapController) {
      mapController.destroy();
    }
  });

  function handleToggleLayer(layerId: LayerId, visible: boolean) {
    if (!mapController) return;
    mapController.setLayerVisibility(layerId, visible);
  }

  function handleChangeOpacity(layerId: LayerId, opacity: number) {
    if (!mapController) return;
    mapController.setLayerOpacity(layerId, opacity);
  }

  function handleSelectBasemap(basemapId: BasemapId) {
    activeBasemap = basemapId;
    if (!mapController) return;
    mapController.setBasemap(basemapId);
  }

  function handleSetMeasureMode(mode: MeasureMode) {
    measureMode = mode;
    if (mapController) {
      mapController.setMeasureMode(mode);
    }
  }

  function handleClearMeasure() {
    measureResultText = '';
    if (mapController) {
      mapController.clearMeasurement();
    }
  }

  function handleSelectSearchResult(result: SearchResultItem) {
    if (!mapController) return;
    mapController.flyTo(result.coordinates, 16.5);
    if (result.feature) {
      mapController.highlightFeature(
        result.layerId === 'fasilitas-publik' ? 'point' : result.layerId === 'jaringan-jalan' ? 'line' : 'polygon',
        result.feature
      );
      mapController.handleFeatureClick(result.feature, result.coordinates, result.layerId);
    }
  }
</script>

<main class="sp-app-root">
  <!-- Kontainer Peta MapLibre Canvas -->
  <div bind:this={mapContainer} id="map-canvas"></div>

  <!-- Identitas Brand Pill di Kiri Atas -->
  <BrandPill />

  <!-- Pemilih Peta Dasar di Sisi Kiri (Diletakkan di Atas Daftar Layer) -->
  <BasemapSelector
    {activeBasemap}
    bind:isOpen={basemapOpen}
    onExpand={() => openMobilePanel('basemap')}
    onSelectBasemap={handleSelectBasemap}
  />

  <!-- Panel Layer Spasial di Sisi Kiri (Tepat di Bawah Peta Dasar) -->
  <LayerPanel
    bind:layers
    bind:isCollapsed={layersCollapsed}
    onExpand={() => openMobilePanel('layers')}
    onToggleLayer={handleToggleLayer}
    onChangeOpacity={handleChangeOpacity}
  />

  <!-- Kelompok Alat Aksi Kanan Atas: Pencarian, Alat Ukur, dan Bantuan -->
  <div class="sp-top-right-group">
    <SearchControl onSelectResult={handleSelectSearchResult} onActivate={() => openMobilePanel('tools')} />

    <MeasureControl
      bind:isPanelOpen={measurePanelOpen}
      bind:isStatsOpen={statsOpen}
      onActivate={() => openMobilePanel('tools')}
      activeMode={measureMode}
      resultText={measureResultText}
      onSetMode={handleSetMeasureMode}
      onClear={handleClearMeasure}
    />

    <button
      type="button"
      class="sp-pill-action"
      onclick={() => (isHelpOpen = true)}
      title="Buka Panduan Informasi WebGIS"
      aria-label="Bantuan"
    >
      <span class="dot">i</span>
      <span class="sp-btn-label">Bantuan</span>
    </button>
  </div>

  <!-- Widget Legenda Terapung Otomatis Terbuka di Sudut Kanan Bawah -->
  {#if !hideLegend}
    <LegendWidget bind:isCollapsed={legendCollapsed} onExpand={() => openMobilePanel('legend')} />
  {/if}

  <!-- Footer Minimalis Bar Bawah -->
  <footer class="sp-footer">
    <span>WebGIS Tematik Zona Nilai Tanah</span>
    <span class="sp-sep sp-hide-mobile"></span>
    <span class="sp-hide-mobile">Kabupaten Cirebon</span>
    <span class="sp-sep sp-hide-mobile"></span>
    <span class="sp-hide-mobile">Kementerian ATR/BPN</span>
    <div class="sp-spacer"></div>
    <span class="mono sp-hide-mobile" title="Koordinat Kursor Mouse">{cursorCoord}</span>
    <span class="sp-sep sp-hide-mobile"></span>
    <span class="mono" title="Tingkat Perbesaran">Zoom {currentZoom}</span>
  </footer>

  <!-- Modal Dialog Panduan Informasi WebGIS -->
  <HelpModal
    isOpen={isHelpOpen}
    onClose={() => (isHelpOpen = false)}
  />

  <!-- Lightbox Pratinjau Gambar Berlatar Transparan Blur -->
  <ImageLightbox
    image={previewImage}
    onClose={() => (previewImage = null)}
  />
</main>

<style>
  .sp-app-root {
    position: relative;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
</style>
