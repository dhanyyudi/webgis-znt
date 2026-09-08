import type { Feature, Geometry } from 'geojson';

export type LayerId = 'batas-administrasi' | 'zona-nilai-tanah' | 'jaringan-jalan' | 'sungai' | 'fasilitas-publik';

export interface LayerConfig {
  id: LayerId;
  label: string;
  category: 'Tematik Utama' | 'Batas Wilayah' | 'Infrastruktur' | 'Fasilitas';
  visible: boolean;
  opacity: number;
  color: string;
  iconName: string;
  description: string;
  geometryType: 'Polygon' | 'LineString' | 'Point';
}

export type BasemapId = 'carto-positron' | 'carto-dark' | 'osm-standard' | 'esri-satellite';

export interface BasemapOption {
  id: BasemapId;
  name: string;
  description: string;
  thumbnailUrl: string;
  attribution: string;
  maxZoom: number;
}

export interface SelectedFeatureInfo {
  layerId: LayerId;
  layerTitle: string;
  title: string;
  subtitle: string;
  properties: Record<string, any>;
  coordinates?: [number, number];
}

export interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  coordinates: [number, number];
  layerId: LayerId;
  feature: Feature<Geometry>;
}

export type MeasureMode = 'none' | 'distance' | 'area';

export interface MeasurePoint {
  coordinates: [number, number];
  distanceFromPrevious?: number;
  totalDistance?: number;
}
