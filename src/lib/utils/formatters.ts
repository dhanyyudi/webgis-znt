/**
 * Format angka ke mata uang Rupiah Indonesia
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

/**
 * Format jarak dalam meter atau kilometer
 */
export function formatDistance(meters: number): string {
  if (isNaN(meters) || meters < 0) return '0 m';
  if (meters >= 1000) {
    return (meters / 1000).toFixed(2).replace('.', ',') + ' km';
  }
  return Math.round(meters) + ' m';
}

/**
 * Format luas dalam meter persegi atau hektar
 */
export function formatArea(squareMeters: number): string {
  if (isNaN(squareMeters) || squareMeters < 0) return '0 m²';
  if (squareMeters >= 10000) {
    return (squareMeters / 10000).toFixed(2).replace('.', ',') + ' ha';
  }
  return Math.round(squareMeters).toLocaleString('id-ID') + ' m²';
}

/**
 * Format koordinat desimal derajat
 */
export function formatCoordinate(lat: number, lng: number): string {
  return lat.toFixed(5) + ', ' + lng.toFixed(5);
}

/**
 * Format label properti menjadi nama yang ramah dibaca
 */
export function formatPropertyKey(key: string): string {
  const dictionary: Record<string, string> = {
    nama: 'Nama Objek',
    kategori: 'Kategori',
    subkategori: 'Subkategori',
    alamat: 'Alamat',
    telepon: 'Kontak / Telepon',
    keterangan: 'Keterangan',
    nama_desa: 'Kelurahan/Desa',
    nama_kecamatan: 'Kecamatan',
    nama_kabupaten: 'Kabupaten',
    provinsi: 'Provinsi',
    luas_hektar: 'Estimasi Luas (ha)',
    keliling_km: 'Keliling Batas (km)',
    kode_zona: 'Kode Blok Zona',
    kelas_nilai: 'Tingkat Kelas Nilai',
    range_nilai: 'Rentang Nilai Pasar / m²',
    nir_m2: 'Nilai Indikasi Rata-rata (NIR)',
    penggunaan_dominan: 'Tutupan Lahan Dominan',
    klasifikasi_tekstual: 'Klasifikasi Nilai',
    kantor_pertanahan: 'Kantor Pertanahan',
    tahun_penilaian: 'Tahun Pemetaan ZNT',
    nama_ruas: 'Nama Ruas Jalan',
    fungsi_jalan: 'Fungsi Jalan',
    lebar_ruas: 'Lebar Ruas',
    kecepatan_rencana: 'Kecepatan Rencana',
    kondisi: 'Kondisi Permukaan',
    kewenangan: 'Status Kewenangan',
    panjang_km: 'Panjang Segmen (km)',
    nama_sungai: 'Nama Sungai',
    orde_sungai: 'Orde Aliran',
    status: 'Status Aliran'
  };

  if (dictionary[key]) {
    return dictionary[key];
  }

  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}
