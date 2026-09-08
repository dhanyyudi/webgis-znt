import { describe, it, expect } from 'vitest';
import batasData from '../src/data/batas-administrasi.geojson';
import zntData from '../src/data/zona-nilai-tanah.geojson';
import jalanData from '../src/data/jaringan-jalan.geojson';
import sungaiData from '../src/data/sungai.geojson';
import poiData from '../src/data/fasilitas-publik.geojson';

describe('Data Integrity Check', () => {
  it('harus memuat layer polygon batas administrasi kecamatan dengan valid', () => {
    expect(batasData.type).toBe('FeatureCollection');
    expect(batasData.features.length).toBeGreaterThan(0);
    const sample = batasData.features[0];
    expect(sample.properties).toHaveProperty('nama_desa');
    expect(sample.properties).toHaveProperty('nama_kecamatan');
    expect(['Polygon', 'MultiPolygon']).toContain(sample.geometry.type);
  });

  it('harus memuat layer polygon Zona Nilai Tanah dengan 8 kelas standar ATR/BPN', () => {
    expect(zntData.type).toBe('FeatureCollection');
    expect(zntData.features.length).toBeGreaterThanOrEqual(40);
    const sample = zntData.features[0];
    expect(sample.properties).toHaveProperty('kode_zona');
    expect(sample.properties).toHaveProperty('kelas_nilai');
    expect(sample.properties).toHaveProperty('nir_m2');
    expect(sample.properties).toHaveProperty('range_nilai');
    expect(sample.properties).toHaveProperty('satuan_wilayah_provinsi');
    expect(sample.properties).toHaveProperty('satuan_wilayah_kabupaten');

    // Pastikan seluruh 8 kelas terwakili dalam dataset
    const classes = new Set(zntData.features.map((f: any) => f.properties.kelas_nilai));
    for (let k = 1; k <= 8; k++) {
      expect(classes.has(k)).toBe(true);
    }
  });

  it('harus memuat layer garis jaringan jalan dengan hierarki jalan', () => {
    expect(jalanData.type).toBe('FeatureCollection');
    expect(jalanData.features.length).toBeGreaterThan(0);
    const sample = jalanData.features[0];
    expect(sample.properties).toHaveProperty('nama_ruas');
    expect(sample.properties).toHaveProperty('fungsi_jalan');
    expect(['LineString', 'MultiLineString']).toContain(sample.geometry.type);
  });

  it('harus memuat layer garis hidrologi sungai', () => {
    expect(sungaiData.type).toBe('FeatureCollection');
    expect(sungaiData.features.length).toBeGreaterThan(0);
  });

  it('harus memuat layer titik fasilitas umum (POI) minimal 70 titik tersebar merata', () => {
    expect(poiData.type).toBe('FeatureCollection');
    expect(poiData.features.length).toBeGreaterThanOrEqual(70);
    const sample = poiData.features[0];
    expect(sample.properties).toHaveProperty('nama');
    expect(sample.properties).toHaveProperty('kategori');
    expect(sample.geometry.type).toBe('Point');

    const categories = new Set(poiData.features.map((f: any) => f.properties.kategori));
    expect(categories.has('pemerintahan')).toBe(true);
    expect(categories.has('kesehatan')).toBe(true);
    expect(categories.has('pendidikan')).toBe(true);
    expect(categories.has('ibadah')).toBe(true);
    expect(categories.has('ekonomi')).toBe(true);
    expect(categories.has('desa')).toBe(true);
  });
});
