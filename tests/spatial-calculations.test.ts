import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculatePolylineDistance,
  calculatePolygonArea
} from '../src/lib/map/measurement';

describe('Spatial Calculations', () => {
  it('harus menghitung jarak geodesik antara dua titik koordinat', () => {
    // Koordinat Kantor Pertanahan Cirebon dan Kantor Bupati Cirebon (jarak ~140m)
    const bpnCoords: [number, number] = [108.4842, -6.7589];
    const bupatiCoords: [number, number] = [108.4831, -6.7595];

    const dist = calculateDistance(bpnCoords, bupatiCoords);
    expect(dist).toBeGreaterThan(100);
    expect(dist).toBeLessThan(180);
  });

  it('harus menghitung akumulasi jarak garis bertingkat', () => {
    const coords: [number, number][] = [
      [108.4842, -6.7589],
      [108.4831, -6.7595],
      [108.4820, -6.7601]
    ];
    const totalDist = calculatePolylineDistance(coords);
    const seg1 = calculateDistance(coords[0], coords[1]);
    const seg2 = calculateDistance(coords[1], coords[2]);

    expect(totalDist).toBeCloseTo(seg1 + seg2, 2);
  });

  it('harus mengembalikan 0 jika titik polyline kurang dari 2', () => {
    expect(calculatePolylineDistance([[108.48, -6.75]])).toBe(0);
  });

  it('harus menghitung estimasi luas poligon sederhana', () => {
    // Bujursangkar sekitar 0.001 derajat x 0.001 derajat (~111m x ~110m = ~12.200 m²)
    const polygon: [number, number][] = [
      [108.480, -6.750],
      [108.481, -6.750],
      [108.481, -6.751],
      [108.480, -6.751]
    ];
    const area = calculatePolygonArea(polygon);
    expect(area).toBeGreaterThan(11000);
    expect(area).toBeLessThan(13500);
  });

  it('harus mengembalikan 0 jika titik poligon kurang dari 3', () => {
    expect(calculatePolygonArea([[108.48, -6.75], [108.49, -6.75]])).toBe(0);
  });
});
