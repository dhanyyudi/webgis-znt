import type { LayerConfig } from '$lib/types/gis';

export const INITIAL_LAYERS: LayerConfig[] = [
  {
    id: 'zona-nilai-tanah',
    label: 'Zona Nilai Tanah (ZNT)',
    category: 'Tematik Utama',
    visible: true,
    opacity: 0.78,
    color: '#ffdd50',
    iconName: 'land-plot',
    description: 'Poligon tematik 8 kelas zona nilai pasar tanah berbasis NIR per meter persegi',
    geometryType: 'Polygon'
  },
  {
    id: 'batas-administrasi',
    label: 'Batas Administrasi Kecamatan & Desa',
    category: 'Batas Wilayah',
    visible: true,
    opacity: 0.9,
    color: '#0f3a5f',
    iconName: 'map-pin',
    description: 'Batas kelurahan dan kecamatan di Kabupaten Cirebon',
    geometryType: 'Polygon'
  },
  {
    id: 'jaringan-jalan',
    label: 'Jaringan Jalan',
    category: 'Infrastruktur',
    visible: true,
    opacity: 1.0,
    color: '#ea580c',
    iconName: 'route',
    description: 'Hierarki ruas jalan arteri, kolektor, lokal, dan lingkungan',
    geometryType: 'LineString'
  },
  {
    id: 'sungai',
    label: 'Jaringan Sungai & Saluran Air',
    category: 'Infrastruktur',
    visible: true,
    opacity: 0.85,
    color: '#0284c7',
    iconName: 'waves',
    description: 'Aliran sungai dan sistem hidrologi utama kawasan Cirebon',
    geometryType: 'LineString'
  },
  {
    id: 'fasilitas-publik',
    label: 'Fasilitas Umum (POI)',
    category: 'Fasilitas',
    visible: true,
    opacity: 1.0,
    color: '#0f3a5f',
    iconName: 'building-2',
    description: 'Titik fasilitas pemerintahan, kesehatan, pendidikan, ibadah, perbankan, dan niaga',
    geometryType: 'Point'
  }
];

// Standar Pewarnaan 8 Kelas ZNT Kementerian ATR/BPN (KAK Halaman 66)
export const ZNT_COLOR_EXPRESSION = [
  'match',
  ['get', 'kelas_nilai'],
  1, '#38a850',
  2, '#66bf50',
  3, '#9bd950',
  4, '#def250',
  5, '#ffdd50',
  6, '#ff9150',
  7, '#ff4850',
  8, '#ff0050',
  '#9bd950'
];

export const ROAD_WIDTH_EXPRESSION = [
  'match',
  ['get', 'fungsi_jalan'],
  'Arteri Primer', 4.0,
  'Kolektor Primer', 3.0,
  'Kolektor Sekunder', 2.2,
  'Lokal Primer', 1.8,
  'Lokal Sekunder', 1.4,
  1.0
];

export const ROAD_COLOR_EXPRESSION = [
  'match',
  ['get', 'fungsi_jalan'],
  'Arteri Primer', '#dc2626',
  'Kolektor Primer', '#ea580c',
  'Kolektor Sekunder', '#f59e0b',
  'Lokal Primer', '#475569',
  '#64748b'
];

export const POI_COLOR_MAP: Record<string, string> = {
  pemerintahan: '#0f3a5f',
  desa: '#0e7490',
  kesehatan: '#dc2626',
  pendidikan: '#2563eb',
  ibadah: '#d97706',
  ekonomi: '#ea580c',
  keuangan: '#7c3aed'
};

export const POI_ICON_PATHS: Record<string, string> = {
  pemerintahan: '<path d="M12 2L4 6v2h16V6l-8-4zm-6 8v7h3v-7H6zm5 0v7h2v-7h-2zm4 0v7h3v-7h-3zM3 20v2h18v-2H3z" fill="currentColor"/>',
  desa: '<path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" fill="currentColor"/>',
  kesehatan: '<path d="M10 3h4v6h6v4h-6v6h-4v-6H4V9h6V3z" fill="currentColor"/>',
  pendidikan: '<path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="currentColor"/>',
  ibadah: '<path d="M12 2c-.5 0-1 .4-1 .9 0 .2.1.4.2.6-2.5 1.5-4.2 4.1-4.2 7.2 0 1.2.3 2.3.8 3.3H5v6h14v-6h-2.8c.5-1 .8-2.1.8-3.3 0-3.1-1.7-5.7-4.2-7.2.1-.2.2-.4.2-.6 0-.5-.5-.9-1-.9z" fill="currentColor"/>',
  ekonomi: '<path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" fill="currentColor"/>',
  keuangan: '<path d="M12 1L2 6v2h20V6L12 1zM4 10v8h3v-8H4zm6 0v8h4v-8h-4zm7 0v8h3v-8h-3zM2 20v2h20v-2H2z" fill="currentColor"/>',
  default: '<circle cx="12" cy="12" r="5" fill="currentColor"/>'
};

export const ZNT_LEGEND_ITEMS = [
  { kelas: 1, range: 'Rp < 250.000', nir: 'Rp 180.000/m²', color: '#38a850', desc: 'Pertanian Terbuka, Hutan, & Konservasi' },
  { kelas: 2, range: 'Rp 250.000–Rp 500.000', nir: 'Rp 380.000/m²', color: '#66bf50', desc: 'Pertanian Sawah Irigasi & Perkebunan' },
  { kelas: 3, range: 'Rp 500.000–Rp 1.000.000', nir: 'Rp 750.000/m²', color: '#9bd950', desc: 'Permukiman Pedesaan Kepadatan Rendah' },
  { kelas: 4, range: 'Rp 1.000.000–Rp 1.750.000', nir: 'Rp 1.350.000/m²', color: '#def250', desc: 'Permukiman Terencana & Sentra Kerajinan' },
  { kelas: 5, range: 'Rp 1.750.000–Rp 2.750.000', nir: 'Rp 2.200.000/m²', color: '#ffdd50', desc: 'Permukiman Perkotaan Kepadatan Sedang' },
  { kelas: 6, range: 'Rp 2.750.000–Rp 4.000.000', nir: 'Rp 3.400.000/m²', color: '#ff9150', desc: 'Campuran Komersial & Jasa Koridor' },
  { kelas: 7, range: 'Rp 4.000.000–Rp 6.000.000', nir: 'Rp 4.800.000/m²', color: '#ff4850', desc: 'Koridor Komersial Utama & Arteri Primer' },
  { kelas: 8, range: 'Rp > 6.000.000', nir: 'Rp 6.800.000/m²', color: '#ff0050', desc: 'Pusat Bisnis Strategis & Pemerintahan Inti' }
];

export const POI_CATEGORY_LEGEND = [
  { id: 'pemerintahan', label: 'Kantor Pemerintahan & BPN', color: '#0f3a5f', desc: 'Kantor Pertanahan ATR/BPN, Bupati, Dinas' },
  { id: 'desa', label: 'Balai Desa & Kelurahan', color: '#0e7490', desc: 'Kantor Kuwu dan Balai Pelayanan Warga' },
  { id: 'kesehatan', label: 'Fasilitas Kesehatan', color: '#dc2626', desc: 'RSUD Sumber, Puskesmas, Klinik Rawat Inap' },
  { id: 'pendidikan', label: 'Fasilitas Pendidikan', color: '#2563eb', desc: 'SMA Negeri, SMP Negeri, SMK, Kampus' },
  { id: 'ibadah', label: 'Sarana Tempat Ibadah', color: '#d97706', desc: 'Masjid Agung Sumber, Masjid Jami Kecamatan' },
  { id: 'ekonomi', label: 'Pasar & Pusat Niaga', color: '#ea580c', desc: 'Pasar Sumber, Sentra Kerajinan, Kuliner' },
  { id: 'keuangan', label: 'Perbankan & Lembaga Keuangan', color: '#7c3aed', desc: 'Bank BJB, Bank BRI, Bank BNI, Kantor Pos' }
];

export const ROAD_LEGEND_ITEMS = [
  { fungsi: 'Arteri Primer', color: '#dc2626', width: 4.0, desc: 'Jalan utama antar-wilayah provinsi' },
  { fungsi: 'Kolektor Primer', color: '#ea580c', width: 3.0, desc: 'Jalan penghubung poros kabupaten' },
  { fungsi: 'Kolektor Sekunder', color: '#f59e0b', width: 2.2, desc: 'Jalan penghubung kawasan perkotaan' },
  { fungsi: 'Lokal Primer', color: '#475569', width: 1.8, desc: 'Jalan akses lingkungan permukiman' }
];
