import { describe, it, expect } from 'vitest';
import {
  formatRupiah,
  formatDistance,
  formatArea,
  formatCoordinate,
  formatPropertyKey
} from '../src/lib/utils/formatters';

describe('Formatters Utility', () => {
  it('harus memformat nilai uang ke format Rupiah Indonesia', () => {
    expect(formatRupiah(1500000)).toBe('Rp 1.500.000');
    expect(formatRupiah(75000)).toBe('Rp 75.000');
    expect(formatRupiah(0)).toBe('Rp 0');
  });

  it('harus memformat jarak dalam satuan meter dan kilometer', () => {
    expect(formatDistance(250)).toBe('250 m');
    expect(formatDistance(1500)).toBe('1,50 km');
    expect(formatDistance(0)).toBe('0 m');
  });

  it('harus memformat luas dalam satuan meter persegi dan hektar', () => {
    expect(formatArea(500)).toBe('500 m²');
    expect(formatArea(25000)).toBe('2,50 ha');
    expect(formatArea(0)).toBe('0 m²');
  });

  it('harus memformat koordinat geografis lintang bujur', () => {
    expect(formatCoordinate(-6.758912, 108.484213)).toBe('-6.75891, 108.48421');
  });

  it('harus menerjemahkan properti teknis menjadi label ramah pengguna', () => {
    expect(formatPropertyKey('nama_desa')).toBe('Kelurahan/Desa');
    expect(formatPropertyKey('nir_m2')).toBe('Nilai Indikasi Rata-rata (NIR)');
    expect(formatPropertyKey('kode_zona')).toBe('Kode Blok Zona');
    expect(formatPropertyKey('custom_attribute')).toBe('Custom Attribute');
  });
});
