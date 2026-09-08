import type { BasemapId, BasemapOption } from '$lib/types/gis';
import type { StyleSpecification } from 'maplibre-gl';

const CARTO_API_KEY = (import.meta as any).env?.VITE_CARTO_API_KEY || '';
const CARTO_KEY_PARAM = CARTO_API_KEY ? '?key=' + encodeURIComponent(CARTO_API_KEY) : '';

export function getBasemapTileUrl(id: BasemapId): string {
  switch (id) {
    case 'carto-dark':
      return 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png' + CARTO_KEY_PARAM;
    case 'osm-standard':
      return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    case 'esri-satellite':
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    case 'carto-positron':
    default:
      return 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png' + CARTO_KEY_PARAM;
  }
}

export const BASEMAP_OPTIONS: BasemapOption[] = [
  {
    id: 'carto-positron',
    name: 'Carto Positron (Terang)',
    description: 'Peta dasar terang monokromatik yang ideal untuk menonjolkan analisis tematik.',
    thumbnailUrl: 'https://a.basemaps.cartocdn.com/light_all/14/13127/8505.png' + CARTO_KEY_PARAM,
    attribution: '&copy; OpenStreetMap kontributor, &copy; CARTO',
    maxZoom: 20
  },
  {
    id: 'carto-dark',
    name: 'Carto Dark (Mode Gelap)',
    description: 'Peta dasar bernuansa gelap kontras tinggi untuk tampilan peta modern.',
    thumbnailUrl: 'https://a.basemaps.cartocdn.com/dark_all/14/13127/8505.png' + CARTO_KEY_PARAM,
    attribution: '&copy; OpenStreetMap kontributor, &copy; CARTO',
    maxZoom: 20
  },
  {
    id: 'osm-standard',
    name: 'OpenStreetMap Standar',
    description: 'Peta jalan umum dengan label fasilitas dan toponimi lengkap.',
    thumbnailUrl: 'https://tile.openstreetmap.org/14/13127/8505.png',
    attribution: '&copy; OpenStreetMap kontributor',
    maxZoom: 19
  },
  {
    id: 'esri-satellite',
    name: 'Citra Satelit Esri',
    description: 'Ortografis foto udara resolusi tinggi untuk memverifikasi kondisi aktual tutupan lahan.',
    thumbnailUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/8505/13127',
    attribution: 'Tiles &copy; Esri, Earthstar Geographics, GIS User Community',
    maxZoom: 19
  }
];

export function getBasemapStyle(id: BasemapId): StyleSpecification {
  const tilesUrl = getBasemapTileUrl(id);
  let attributionText = '&copy; OpenStreetMap kontributor';
  let maxZoom = 20;

  if (id === 'carto-dark' || id === 'carto-positron') {
    attributionText = '&copy; OpenStreetMap kontributor, &copy; CARTO';
  } else if (id === 'esri-satellite') {
    attributionText = 'Tiles &copy; Esri, Earthstar Geographics';
    maxZoom = 19;
  } else if (id === 'osm-standard') {
    maxZoom = 19;
  }

  return {
    version: 8,
    sources: {
      'raster-basemap-source': {
        type: 'raster',
        tiles: [tilesUrl],
        tileSize: 256,
        attribution: attributionText,
        maxzoom: maxZoom
      }
    },
    layers: [
      {
        id: 'raster-basemap-layer',
        type: 'raster',
        source: 'raster-basemap-source',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  };
}
