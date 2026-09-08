import maplibregl, {
  Map,
  Popup,
  LngLatBounds,
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  Marker
} from 'maplibre-gl';
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import type { BasemapId, LayerId, SelectedFeatureInfo, MeasureMode, MeasurePoint } from '$lib/types/gis';
import { getBasemapStyle, getBasemapTileUrl } from './basemaps';
import {
  ZNT_COLOR_EXPRESSION,
  ROAD_WIDTH_EXPRESSION,
  ROAD_COLOR_EXPRESSION,
  POI_COLOR_MAP,
  POI_ICON_PATHS
} from './symbology';
import { calculatePolylineDistance, calculatePolygonArea } from '$lib/map/measurement';
import { formatDistance, formatArea } from '$lib/utils/formatters';

// Impor GeoJSON lokal secara statis
import batasData from '$data/batas-administrasi.geojson';
import zntData from '$data/zona-nilai-tanah.geojson';
import jalanData from '$data/jaringan-jalan.geojson';
import sungaiData from '$data/sungai.geojson';
import poiData from '$data/fasilitas-publik.geojson';

export class MapController {
  private map: Map | null = null;
  private popup: Popup | null = null;
  private currentBasemap: BasemapId = 'carto-positron';
  private poiMarkers: Marker[] = [];
  private onFeatureSelectedCallback?: (info: SelectedFeatureInfo | null) => void;
  private onMeasureUpdatedCallback?: (points: MeasurePoint[], resultText: string) => void;
  private onMouseMoveCallback?: (coords: [number, number], zoom: number) => void;
  private onImagePreviewCallback?: (image: { url: string; caption?: string; title?: string }) => void;

  private measureMode: MeasureMode = 'none';
  private measureCoords: [number, number][] = [];

  constructor(
    private container: HTMLElement,
    options?: {
      onFeatureSelected?: (info: SelectedFeatureInfo | null) => void;
      onMeasureUpdated?: (points: MeasurePoint[], resultText: string) => void;
      onMouseMove?: (coords: [number, number], zoom: number) => void;
      onImagePreview?: (image: { url: string; caption?: string; title?: string }) => void;
    }
  ) {
    this.onFeatureSelectedCallback = options?.onFeatureSelected;
    this.onMeasureUpdatedCallback = options?.onMeasureUpdated;
    this.onMouseMoveCallback = options?.onMouseMove;
    this.onImagePreviewCallback = options?.onImagePreview;
  }

  public init(initialBasemap: BasemapId = 'carto-positron'): Promise<void> {
    this.currentBasemap = initialBasemap;

    // Parsing initial hash jika ada pada URL (#zoom/lat/lng)
    let initialZoom = 14.5;
    let initialCenter: [number, number] = [108.4842, -6.7589];

    if (window.location.hash) {
      const parts = window.location.hash.replace(/^#/, '').split('/');
      if (parts.length === 3) {
        const z = parseFloat(parts[0]);
        const lat = parseFloat(parts[1]);
        const lng = parseFloat(parts[2]);
        if (!isNaN(z) && !isNaN(lat) && !isNaN(lng)) {
          initialZoom = z;
          initialCenter = [lng, lat];
        }
      }
    }

    return new Promise((resolve) => {
      this.map = new Map({
        container: this.container,
        style: getBasemapStyle(this.currentBasemap),
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 11,
        maxZoom: 20
      });

      this.popup = new Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '320px',
        className: 'sp-custom-popup'
      });

      // Kontrol navigasi standar
      this.map.addControl(
        new NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true
        }),
        'top-right'
      );

      this.map.addControl(
        new ScaleControl({
          maxWidth: 150,
          unit: 'metric'
        }),
        'bottom-left'
      );

      this.map.addControl(
        new FullscreenControl(),
        'top-right'
      );

      // Sinkronisasi koordinat ke URL Hash
      this.map.on('moveend', () => {
        if (!this.map) return;
        const center = this.map.getCenter();
        const zoom = this.map.getZoom().toFixed(2);
        const lat = center.lat.toFixed(4);
        const lng = center.lng.toFixed(4);
        window.history.replaceState(null, '', `#${zoom}/${lat}/${lng}`);
      });

      // Lacak posisi kursor mouse untuk indikator koordinat
      this.map.on('mousemove', (e) => {
        if (!this.map || !this.onMouseMoveCallback) return;
        this.onMouseMoveCallback([e.lngLat.lng, e.lngLat.lat], this.map.getZoom());
      });

      this.map.on('load', () => {
        this.setupThematicSources();
        this.setupThematicLayers();
        this.setupMeasurementLayers();
        this.setupInteractions();
        this.updateMarkerScaleOnZoom();
        resolve();
      });

      this.map.on('zoom', () => {
        this.updateMarkerScaleOnZoom();
      });
    });
  }

  private setupThematicSources(): void {
    if (!this.map) return;

    this.map.addSource('source-batas-administrasi', {
      type: 'geojson',
      data: batasData as FeatureCollection
    });

    this.map.addSource('source-zona-nilai-tanah', {
      type: 'geojson',
      data: zntData as FeatureCollection
    });

    this.map.addSource('source-jaringan-jalan', {
      type: 'geojson',
      data: jalanData as FeatureCollection
    });

    this.map.addSource('source-sungai', {
      type: 'geojson',
      data: sungaiData as FeatureCollection
    });

    this.map.addSource('source-fasilitas-publik', {
      type: 'geojson',
      data: poiData as FeatureCollection
    });

    this.map.addSource('source-highlight-polygon', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

    this.map.addSource('source-highlight-line', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

    this.map.addSource('source-highlight-point', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
  }

  private setupThematicLayers(): void {
    if (!this.map) return;

    // 1. Batas Administrasi
    this.map.addLayer({
      id: 'layer-batas-administrasi-fill',
      type: 'fill',
      source: 'source-batas-administrasi',
      paint: {
        'fill-color': '#0f3a5f',
        'fill-opacity': 0.04
      }
    });

    this.map.addLayer({
      id: 'layer-batas-administrasi-line',
      type: 'line',
      source: 'source-batas-administrasi',
      paint: {
        'line-color': '#0f3a5f',
        'line-width': 2.0,
        'line-dasharray': [4, 2],
        'line-opacity': 0.95
      }
    });

    // 2. Zona Nilai Tanah (ZNT): Cakupan Penuh 8 Kelas
    this.map.addLayer({
      id: 'layer-zona-nilai-tanah-fill',
      type: 'fill',
      source: 'source-zona-nilai-tanah',
      paint: {
        'fill-color': ZNT_COLOR_EXPRESSION as any,
        'fill-opacity': 0.78
      }
    });

    this.map.addLayer({
      id: 'layer-zona-nilai-tanah-line',
      type: 'line',
      source: 'source-zona-nilai-tanah',
      paint: {
        'line-color': '#ffffff',
        'line-width': 1.0,
        'line-opacity': 0.75
      }
    });

    this.map.addLayer({
      id: 'layer-zona-nilai-tanah-label',
      type: 'symbol',
      source: 'source-zona-nilai-tanah',
      minzoom: 14.0,
      layout: {
        'text-field': ['concat', 'Zona ', ['get', 'kode_zona'], '\n', ['get', 'range_nilai']],
        'text-size': 9.5,
        'text-justify': 'center'
      },
      paint: {
        'text-color': '#0f172a',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.8
      }
    });

    // 3. Sungai
    this.map.addLayer({
      id: 'layer-sungai-line',
      type: 'line',
      source: 'source-sungai',
      paint: {
        'line-color': '#0284c7',
        'line-width': 2.0,
        'line-opacity': 0.85
      }
    });

    // 4. Jaringan Jalan
    this.map.addLayer({
      id: 'layer-jaringan-jalan-casing',
      type: 'line',
      source: 'source-jaringan-jalan',
      paint: {
        'line-color': '#ffffff',
        'line-width': [
          'match',
          ['get', 'fungsi_jalan'],
          'Arteri Primer', 6.0,
          'Kolektor Primer', 4.5,
          'Kolektor Sekunder', 3.5,
          2.5
        ],
        'line-opacity': 0.8
      }
    });

    this.map.addLayer({
      id: 'layer-jaringan-jalan-line',
      type: 'line',
      source: 'source-jaringan-jalan',
      paint: {
        'line-color': ROAD_COLOR_EXPRESSION as any,
        'line-width': ROAD_WIDTH_EXPRESSION as any,
        'line-opacity': 1.0
      }
    });

    // Label Batas Administrasi di Posisi Paling Atas (Di Atas Fill ZNT & Jalan)
    this.map.addLayer({
      id: 'layer-batas-administrasi-label',
      type: 'symbol',
      source: 'source-batas-administrasi',
      layout: {
        'text-field': ['get', 'nama_desa'],
        'text-font': ['Open Sans Semibold'],
        'text-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 11,
          13, 13,
          16, 16
        ],
        'text-anchor': 'center',
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.08,
        'symbol-sort-key': 100
      },
      paint: {
        'text-color': '#0f3a5f',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2.5,
        'text-halo-blur': 0.5
      }
    });

    // Fallback Canvas POI Layer (Disembunyikan, digantikan Custom SVG Pin Markers)
    this.map.addLayer({
      id: 'layer-fasilitas-publik-circle',
      type: 'circle',
      source: 'source-fasilitas-publik',
      paint: {
        'circle-radius': 1,
        'circle-opacity': 0
      }
    });

    // Inisialisasi Custom Pin Markers Berbasis HTML & SVG
    this.setupPoiMarkers();

    // Highlight Layers
    this.map.addLayer({
      id: 'layer-highlight-polygon',
      type: 'line',
      source: 'source-highlight-polygon',
      paint: {
        'line-color': '#facc15',
        'line-width': 3.5
      }
    });

    this.map.addLayer({
      id: 'layer-highlight-line',
      type: 'line',
      source: 'source-highlight-line',
      paint: {
        'line-color': '#facc15',
        'line-width': 6.0
      }
    });

    this.map.addLayer({
      id: 'layer-highlight-point',
      type: 'circle',
      source: 'source-highlight-point',
      paint: {
        'circle-radius': 14,
        'circle-color': 'transparent',
        'circle-stroke-width': 3.5,
        'circle-stroke-color': '#facc15'
      }
    });
  }

  private setupMeasurementLayers(): void {
    if (!this.map) return;

    this.map.addSource('source-measure', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

    this.map.addLayer({
      id: 'layer-measure-fill',
      type: 'fill',
      source: 'source-measure',
      filter: ['==', '$type', 'Polygon'],
      paint: {
        'fill-color': '#0284c7',
        'fill-opacity': 0.25
      }
    });

    this.map.addLayer({
      id: 'layer-measure-line',
      type: 'line',
      source: 'source-measure',
      filter: ['in', '$type', 'LineString', 'Polygon'],
      paint: {
        'line-color': '#0284c7',
        'line-width': 3.0,
        'line-dasharray': [2, 2]
      }
    });

    this.map.addLayer({
      id: 'layer-measure-point',
      type: 'circle',
      source: 'source-measure',
      filter: ['==', '$type', 'Point'],
      paint: {
        'circle-radius': 5.5,
        'circle-color': '#0284c7',
        'circle-stroke-width': 2.0,
        'circle-stroke-color': '#ffffff'
      }
    });
  }

  private setupInteractions(): void {
    if (!this.map) return;

    const interactiveLayerIds = [
      'layer-fasilitas-publik-circle',
      'layer-jaringan-jalan-line',
      'layer-zona-nilai-tanah-fill',
      'layer-batas-administrasi-fill'
    ];

    // Mengubah cursor menjadi pointer saat hover objek interaktif
    for (const layerId of interactiveLayerIds) {
      this.map.on('mouseenter', layerId, () => {
        if (!this.map || this.measureMode !== 'none') return;
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', layerId, () => {
        if (!this.map || this.measureMode !== 'none') return;
        this.map.getCanvas().style.cursor = '';
      });
    }

    // Klik objek pada canvas
    this.map.on('click', (e) => {
      if (this.measureMode !== 'none') {
        this.handleMeasureClick([e.lngLat.lng, e.lngLat.lat]);
        return;
      }

      if (!this.map) return;

      const features = this.map.queryRenderedFeatures(e.point, {
        layers: interactiveLayerIds
      });

      if (features.length === 0) {
        this.clearHighlight();
        if (this.popup) this.popup.remove();
        if (this.onFeatureSelectedCallback) {
          this.onFeatureSelectedCallback(null);
        }
        return;
      }

      const topFeature = features[0];
      this.handleFeatureClick(topFeature, [e.lngLat.lng, e.lngLat.lat]);
    });
  }

  public handleFeatureClick(feature: Feature<Geometry>, clickCoords: [number, number], explicitLayerId?: LayerId): void {
    if (!this.map) return;

    const sourceLayerId = ((feature as any).layer?.id || '') as string;
    const props = feature.properties || {};

    let layerId: LayerId = explicitLayerId || 'zona-nilai-tanah';
    let layerTitle = 'Zona Nilai Tanah';
    let title = 'Informasi Objek';
    let subtitle = '';

    if (!explicitLayerId) {
      if (sourceLayerId.includes('fasilitas-publik')) {
        layerId = 'fasilitas-publik';
      } else if (sourceLayerId.includes('jaringan-jalan')) {
        layerId = 'jaringan-jalan';
      } else if (sourceLayerId.includes('zona-nilai-tanah')) {
        layerId = 'zona-nilai-tanah';
      } else if (sourceLayerId.includes('batas-administrasi')) {
        layerId = 'batas-administrasi';
      }
    }

    if (layerId === 'fasilitas-publik') {
      layerTitle = 'Fasilitas Umum (POI)';
      title = props.nama || 'Fasilitas Umum';
      subtitle = (props.kategori || '') + (props.alamat ? ' · ' + props.alamat : '');
      this.highlightFeature('point', feature);
    } else if (layerId === 'jaringan-jalan') {
      layerTitle = 'Jaringan Jalan';
      title = props.nama_ruas || 'Ruas Jalan';
      subtitle = props.fungsi_jalan + (props.lebar_ruas ? ' (Lebar: ' + props.lebar_ruas + ')' : '');
      this.highlightFeature('line', feature);
    } else if (layerId === 'zona-nilai-tanah') {
      layerTitle = 'Zona Nilai Tanah (ZNT)';
      title = 'Zona ' + (props.kode_zona || '') + ' · Kelas ' + (props.kelas_nilai || '');
      subtitle = props.range_nilai || '';
      this.highlightFeature('polygon', feature);
    } else if (layerId === 'batas-administrasi') {
      layerTitle = 'Batas Wilayah';
      title = 'Desa ' + (props.nama_desa || '');
      subtitle = 'Kecamatan ' + (props.nama_kecamatan || '') + ', ' + (props.nama_kabupaten || '');
      this.highlightFeature('polygon', feature);
    }

    const info: SelectedFeatureInfo = {
      layerId,
      layerTitle,
      title,
      subtitle,
      properties: props,
      coordinates: clickCoords
    };

    // Render Popup MapLibre
    this.renderPopup(info, clickCoords);

    if (this.onFeatureSelectedCallback) {
      this.onFeatureSelectedCallback(info);
    }
  }

  private renderPopup(info: SelectedFeatureInfo, coords: [number, number]): void {
    if (!this.map || !this.popup) return;

    const gallery: { url: string; caption: string }[] =
      Array.isArray(info.properties.foto_gallery) && info.properties.foto_gallery.length > 0
        ? info.properties.foto_gallery
        : [];

    const container = document.createElement('div');
    container.className = 'sp-popup-card';

    // 1. Header Box
    const headerBox = document.createElement('div');
    headerBox.className = 'sp-popup-header-box';
    headerBox.innerHTML = `
      <div class="sp-popup-badge">${info.layerTitle}</div>
      <div class="sp-popup-title">${info.title}</div>
      ${info.subtitle ? `<div class="sp-popup-subtitle">${info.subtitle}</div>` : ''}
    `;
    container.appendChild(headerBox);

    // 2. Photo Carousel
    if (gallery.length > 0) {
      let activeIndex = 0;

      const carousel = document.createElement('div');
      carousel.className = 'sp-carousel-box';

      const mediaFrame = document.createElement('div');
      mediaFrame.className = 'sp-carousel-media';

      const img = document.createElement('img');
      img.className = 'sp-carousel-img';
      img.src = gallery[0].url;
      img.alt = gallery[0].caption || info.title;
      img.title = 'Klik untuk memperbesar pratinjau gambar';
      img.onclick = (e) => {
        e.stopPropagation();
        if (this.onImagePreviewCallback) {
          this.onImagePreviewCallback({
            url: gallery[activeIndex].url,
            caption: gallery[activeIndex].caption,
            title: info.title
          });
        }
      };

      const zoomHint = document.createElement('span');
      zoomHint.className = 'sp-carousel-zoom-hint';
      zoomHint.innerHTML = '🔍 Perbesar';
      zoomHint.title = 'Klik untuk memperbesar gambar';
      zoomHint.onclick = (e) => {
        e.stopPropagation();
        if (this.onImagePreviewCallback) {
          this.onImagePreviewCallback({
            url: gallery[activeIndex].url,
            caption: gallery[activeIndex].caption,
            title: info.title
          });
        }
      };

      const counter = document.createElement('span');
      counter.className = 'sp-carousel-counter';
      counter.textContent = `1 / ${gallery.length}`;

      const caption = document.createElement('div');
      caption.className = 'sp-carousel-caption';
      caption.textContent = gallery[0].caption || '';

      const updateSlide = (idx: number) => {
        activeIndex = (idx + gallery.length) % gallery.length;
        img.src = gallery[activeIndex].url;
        img.alt = gallery[activeIndex].caption || info.title;
        counter.textContent = `${activeIndex + 1} / ${gallery.length}`;
        caption.textContent = gallery[activeIndex].caption || '';
      };

      if (gallery.length > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'sp-carousel-nav-btn sp-prev';
        prevBtn.innerHTML = '&#10094;';
        prevBtn.title = 'Foto Sebelumnya';
        prevBtn.onclick = (e) => {
          e.stopPropagation();
          updateSlide(activeIndex - 1);
        };

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'sp-carousel-nav-btn sp-next';
        nextBtn.innerHTML = '&#10095;';
        nextBtn.title = 'Foto Berikutnya';
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          updateSlide(activeIndex + 1);
        };

        mediaFrame.appendChild(prevBtn);
        mediaFrame.appendChild(nextBtn);
      }

      mediaFrame.appendChild(img);
      mediaFrame.appendChild(zoomHint);
      mediaFrame.appendChild(counter);
      carousel.appendChild(mediaFrame);
      carousel.appendChild(caption);
      container.appendChild(carousel);
    }

    // 3. Divider
    const divider = document.createElement('hr');
    divider.className = 'sp-popup-divider';
    container.appendChild(divider);

    // 4. Properties Table
    const table = document.createElement('table');
    table.className = 'sp-popup-table';
    let rowsHtml = '';

    // Ignore internal or raw technical database fields to keep popup clean and concise
    const ignoredKeys = new Set([
      'id', 'object_id', 'warna_simbologi', 'warna_kategori', 'foto_gallery', 'video_url',
      'npbdet', 'fid', 'gid', 'shape_leng', 'shape_area', 'shape_length', 'kd_provinsi',
      'kd_kabupaten', 'kd_kecamatan', 'kd_kelurahan', 'kd_blok', 'simpangan_baku',
      'simpangan_baku_relatif', 'satuan_wilayah', 'nilai_tertinggi', 'nilai_terendah'
    ]);

    for (const [k, v] of Object.entries(info.properties)) {
      if (ignoredKeys.has(k.toLowerCase())) continue;
      if (v === null || v === undefined || v === '') continue;

      let label = k.replace(/_/g, ' ');
      if (k === 'nir_m2') label = 'NIR per m²';
      else if (k === 'range_nilai') label = 'Rentang Nilai';
      else if (k === 'kode_zona') label = 'Blok Zona';
      else if (k === 'kelas_nilai') label = 'Kelas Nilai';
      else if (k === 'penggunaan_dominan') label = 'Penggunaan Lahan';
      else if (k === 'nama_desa' || k === 'kelurahan') label = 'Kelurahan/Desa';
      else if (k === 'nama_kecamatan' || k === 'kecamatan') label = 'Kecamatan';
      else if (k === 'nama_ruas') label = 'Nama Ruas';
      else if (k === 'fungsi_jalan') label = 'Fungsi Jalan';
      else if (k === 'tahun_penilaian') label = 'Tahun Penilaian';
      else if (k === 'jenis_zona') label = 'Jenis Zona';
      else if (k === 'jumlah_sampel') label = 'Sampel Transaksi';
      else if (k === 'jam_operasional') label = 'Jam Operasional';
      else if (k === 'telepon') label = 'Kontak';
      else if (k === 'alamat') label = 'Alamat';
      else if (k === 'klasifikasi_resolusi') label = 'Klasifikasi';
      else if (k === 'kantor_pertanahan') label = 'Kantor Pertanahan';

      let displayVal = String(v);
      if (k === 'nir_m2' && typeof v === 'number') {
        displayVal = 'Rp ' + v.toLocaleString('id-ID') + ' / m²';
      }
      rowsHtml += `
        <tr>
          <th class="sp-table-label">${label}</th>
          <td class="sp-table-val">${displayVal}</td>
        </tr>
      `;
    }
    table.innerHTML = `<tbody>${rowsHtml}</tbody>`;
    container.appendChild(table);

    this.popup.setLngLat(coords).setMaxWidth('340px').setDOMContent(container).addTo(this.map);
  }

  private setupPoiMarkers(): void {
    if (!this.map) return;
    this.poiMarkers.forEach(m => m.remove());
    this.poiMarkers = [];

    const features = (poiData as FeatureCollection).features;
    for (const feature of features) {
      if (feature.geometry.type !== 'Point') continue;
      const coords = feature.geometry.coordinates as [number, number];
      const props = feature.properties || {};
      const el = this.createPoiMarkerElement(props);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleFeatureClick(feature, coords, 'fasilitas-publik');
      });

      const marker = new Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat(coords)
        .addTo(this.map);

      this.poiMarkers.push(marker);
    }
    this.updateMarkerScaleOnZoom();
  }

  private updateMarkerScaleOnZoom(): void {
    if (!this.map) return;
    const z = this.map.getZoom();
    const container = this.map.getContainer();
    if (!container) return;

    if (z < 12.0) {
      container.classList.add('sp-zoom-out');
      container.classList.remove('sp-zoom-mid', 'sp-zoom-in');
    } else if (z < 13.5) {
      container.classList.add('sp-zoom-mid');
      container.classList.remove('sp-zoom-out', 'sp-zoom-in');
    } else {
      container.classList.add('sp-zoom-in');
      container.classList.remove('sp-zoom-out', 'sp-zoom-mid');
    }
  }

  private createPoiMarkerElement(props: Record<string, any>): HTMLElement {
    const kategori = (props.kategori || '').toLowerCase();
    const nama = props.nama || 'Fasilitas Umum';
    const color = POI_COLOR_MAP[kategori] || '#0f3a5f';
    const iconSvg = POI_ICON_PATHS[kategori] || POI_ICON_PATHS.default;

    const el = document.createElement('div');
    el.className = 'sp-poi-symbol-marker';
    el.setAttribute('data-kategori', kategori);
    el.setAttribute('title', nama);

    el.innerHTML = `
      <div class="sp-symbol-badge" style="background-color: ${color};">
        <svg class="sp-symbol-svg" width="13" height="13" viewBox="0 0 24 24" fill="#ffffff">
          ${iconSvg}
        </svg>
      </div>
      <div class="sp-symbol-tooltip">${nama}</div>
    `;

    return el;
  }

  public highlightFeature(type: 'polygon' | 'line' | 'point', feature: Feature<Geometry>): void {
    if (!this.map) return;
    this.clearHighlight();

    // Pastikan objek plain serializable agar tidak memicu error MapLibre Worker ("can't serialize object of unregistered class nf")
    const cleanFeature: Feature<Geometry> = {
      type: 'Feature',
      geometry: JSON.parse(JSON.stringify(feature.geometry)),
      properties: feature.properties ? JSON.parse(JSON.stringify(feature.properties)) : {}
    };

    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [cleanFeature]
    };

    try {
      if (type === 'polygon') {
        (this.map.getSource('source-highlight-polygon') as any)?.setData(collection);
      } else if (type === 'line') {
        (this.map.getSource('source-highlight-line') as any)?.setData(collection);
      } else if (type === 'point') {
        (this.map.getSource('source-highlight-point') as any)?.setData(collection);
      }
    } catch (err) {
      console.warn('Gagal set highlight feature data:', err);
    }
  }

  public clearHighlight(): void {
    if (!this.map) return;
    const empty: FeatureCollection = { type: 'FeatureCollection', features: [] };
    try {
      (this.map.getSource('source-highlight-polygon') as any)?.setData(empty);
      (this.map.getSource('source-highlight-line') as any)?.setData(empty);
      (this.map.getSource('source-highlight-point') as any)?.setData(empty);
    } catch (err) {
      console.warn('Gagal clear highlight data:', err);
    }
  }

  public setBasemap(basemapId: BasemapId): void {
    if (!this.map || this.currentBasemap === basemapId) return;
    this.currentBasemap = basemapId;

    const source = this.map.getSource('raster-basemap-source') as any;
    if (source && source.setTiles) {
      source.setTiles([getBasemapTileUrl(basemapId)]);
    } else {
      // Fallback update style
      const zoom = this.map.getZoom();
      const center = this.map.getCenter();
      this.map.setStyle(getBasemapStyle(basemapId));
      this.map.once('style.load', () => {
        this.map?.setCenter(center);
        this.map?.setZoom(zoom);
        this.setupThematicSources();
        this.setupThematicLayers();
        this.setupMeasurementLayers();
        this.setupInteractions();
      });
    }
  }

  public setLayerVisibility(layerId: LayerId, visible: boolean): void {
    if (!this.map) return;
    const val = visible ? 'visible' : 'none';

    if (layerId === 'batas-administrasi') {
      this.map.setLayoutProperty('layer-batas-administrasi-fill', 'visibility', val);
      this.map.setLayoutProperty('layer-batas-administrasi-line', 'visibility', val);
      this.map.setLayoutProperty('layer-batas-administrasi-label', 'visibility', val);
    } else if (layerId === 'zona-nilai-tanah') {
      this.map.setLayoutProperty('layer-zona-nilai-tanah-fill', 'visibility', val);
      this.map.setLayoutProperty('layer-zona-nilai-tanah-line', 'visibility', val);
      this.map.setLayoutProperty('layer-zona-nilai-tanah-label', 'visibility', val);
    } else if (layerId === 'jaringan-jalan') {
      this.map.setLayoutProperty('layer-jaringan-jalan-casing', 'visibility', val);
      this.map.setLayoutProperty('layer-jaringan-jalan-line', 'visibility', val);
    } else if (layerId === 'sungai') {
      this.map.setLayoutProperty('layer-sungai-line', 'visibility', val);
    } else if (layerId === 'fasilitas-publik') {
      this.map.setLayoutProperty('layer-fasilitas-publik-circle', 'visibility', val);
      this.poiMarkers.forEach(m => {
        const el = m.getElement();
        if (el) el.style.display = visible ? '' : 'none';
      });
    }
  }

  public setLayerOpacity(layerId: LayerId, opacity: number): void {
    if (!this.map) return;

    if (layerId === 'batas-administrasi') {
      this.map.setPaintProperty('layer-batas-administrasi-line', 'line-opacity', opacity);
    } else if (layerId === 'zona-nilai-tanah') {
      this.map.setPaintProperty('layer-zona-nilai-tanah-fill', 'fill-opacity', opacity);
    } else if (layerId === 'jaringan-jalan') {
      this.map.setPaintProperty('layer-jaringan-jalan-line', 'line-opacity', opacity);
    } else if (layerId === 'sungai') {
      this.map.setPaintProperty('layer-sungai-line', 'line-opacity', opacity);
    } else if (layerId === 'fasilitas-publik') {
      this.poiMarkers.forEach(m => {
        const el = m.getElement();
        if (el) el.style.opacity = String(opacity);
      });
    }
  }

  public flyTo(coords: [number, number], zoom = 16): void {
    if (!this.map) return;
    this.map.flyTo({
      center: coords,
      zoom: zoom,
      speed: 1.2,
      curve: 1.4,
      essential: true
    });
  }

  public fitBounds(bounds: [[number, number], [number, number]]): void {
    if (!this.map) return;
    this.map.fitBounds(new LngLatBounds(bounds[0], bounds[1]), {
      padding: 60,
      duration: 1000
    });
  }

  // Alat Ukur Geospasial
  public setMeasureMode(mode: MeasureMode): void {
    this.measureMode = mode;
    this.measureCoords = [];
    this.updateMeasureLayer();

    if (!this.map) return;
    if (mode !== 'none') {
      this.map.getCanvas().style.cursor = 'crosshair';
      if (this.popup) this.popup.remove();
    } else {
      this.map.getCanvas().style.cursor = '';
    }

    if (this.onMeasureUpdatedCallback) {
      this.onMeasureUpdatedCallback([], '');
    }
  }

  private handleMeasureClick(coord: [number, number]): void {
    this.measureCoords.push(coord);
    this.updateMeasureLayer();

    const points: MeasurePoint[] = this.measureCoords.map((c, i) => ({
      coordinates: c
    }));

    let resultText = '';
    if (this.measureMode === 'distance') {
      const dist = calculatePolylineDistance(this.measureCoords);
      resultText = 'Total Jarak: ' + formatDistance(dist);
    } else if (this.measureMode === 'area') {
      const area = calculatePolygonArea(this.measureCoords);
      resultText = 'Total Luas: ' + formatArea(area);
    }

    if (this.onMeasureUpdatedCallback) {
      this.onMeasureUpdatedCallback(points, resultText);
    }
  }

  public clearMeasurement(): void {
    this.measureCoords = [];
    this.updateMeasureLayer();
    if (this.onMeasureUpdatedCallback) {
      this.onMeasureUpdatedCallback([], '');
    }
  }

  private updateMeasureLayer(): void {
    if (!this.map) return;
    const source = this.map.getSource('source-measure') as any;
    if (!source) return;

    if (this.measureCoords.length === 0) {
      source.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    const features: Feature[] = [];

    // Points
    for (const coord of this.measureCoords) {
      features.push({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: coord
        }
      });
    }

    // Line / Polygon
    if (this.measureMode === 'distance' && this.measureCoords.length >= 2) {
      features.push({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: this.measureCoords
        }
      });
    } else if (this.measureMode === 'area' && this.measureCoords.length >= 3) {
      const closedCoords = [...this.measureCoords, this.measureCoords[0]];
      features.push({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [closedCoords]
        }
      });
    }

    source.setData({
      type: 'FeatureCollection',
      features
    });
  }

  public resetExtent(): void {
    this.flyTo([108.4842, -6.7589], 14.2);
  }

  public destroy(): void {
    if (this.popup) this.popup.remove();
    this.poiMarkers.forEach(m => m.remove());
    this.poiMarkers = [];
    if (this.map) this.map.remove();
    this.map = null;
  }
}
