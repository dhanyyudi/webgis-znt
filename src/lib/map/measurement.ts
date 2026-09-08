/**
 * Konstanta radius bumi dalam satuan meter (WGS 84 mean radius)
 */
const EARTH_RADIUS_METERS = 6371008.8;

/**
 * Konversi nilai derajat ke radian
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Menghitung jarak geodesik antara dua koordinat [lng, lat] menggunakan formula Haversine
 */
export function calculateDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Menghitung total jarak kumulatif dari rangkaian titik koordinat
 */
export function calculatePolylineDistance(coordinates: [number, number][]): number {
  if (coordinates.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    total += calculateDistance(coordinates[i], coordinates[i + 1]);
  }
  return total;
}

/**
 * Menghitung estimasi luas poligon tertutup dalam satuan meter persegi
 * Menggunakan pendekatan proyeksi planar ekuivalen lokal untuk akurasi tinggi pada skala lokal/kota
 */
export function calculatePolygonArea(coordinates: [number, number][]): number {
  if (coordinates.length < 3) return 0;

  // Pastikan cincin tertutup
  const points = [...coordinates];
  const first = points[0];
  const last = points[points.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    points.push([first[0], first[1]]);
  }

  // Menentukan titik tengah garis lintang untuk faktor koreksi kosinus
  let sumLat = 0;
  for (const pt of points) {
    sumLat += pt[1];
  }
  const meanLatRad = toRadians(sumLat / points.length);

  // Proyeksi koordinat desimal ke satuan meter lokal
  const metersPerDegLat = 111132.92;
  const metersPerDegLng = 111412.84 * Math.cos(meanLatRad);

  let areaSum = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const x1 = points[i][0] * metersPerDegLng;
    const y1 = points[i][1] * metersPerDegLat;
    const x2 = points[i + 1][0] * metersPerDegLng;
    const y2 = points[i + 1][1] * metersPerDegLat;

    areaSum += x1 * y2 - x2 * y1;
  }

  return Math.abs(areaSum / 2);
}
