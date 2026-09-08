const fs = require('fs');
const turf = require('@turf/turf');

const batas = JSON.parse(fs.readFileSync('./src/data/batas-administrasi.geojson', 'utf8'));

// Photo pool with clean logo-free photos
const PHOTOS = {
  pemerintahan: [
    { url: '/images/foto_kantor-bpn-cirebon.jpg', caption: 'Fasad gedung kantor pelayanan pemerintahan dan pertanahan modern di Kabupaten Cirebon.' },
    { url: '/images/foto_pelayanan-bpn-cirebon.jpg', caption: 'Ruang loket pelayanan terpadu dan konsultasi masyarakat yang tertata rapi.' },
    { url: '/images/foto_kantor-bupati-cirebon.jpg', caption: 'Kompleks pusat pemerintahan daerah Kabupaten Cirebon dengan arsitektur khas.' }
  ],
  desa: [
    { url: '/images/foto_kantor-desa-sindangjawa.png', caption: 'Balai pelayanan masyarakat dan kantor pemerintah desa setempat.' },
    { url: '/images/foto_kawasan-znt-sumber.jpg', caption: 'Lanskap tata guna lahan dan permukiman di sekitar balai desa.' },
    { url: '/images/foto_pelayanan-bpn-cirebon.jpg', caption: 'Ruang layanan administrasi kependudukan dan surat tanah desa.' }
  ],
  kesehatan: [
    { url: '/images/foto_fasilitas-kesehatan-sumber.png', caption: 'Fasilitas pusat kesehatan masyarakat (Puskesmas) dan klinik kesehatan wilayah.' },
    { url: '/images/foto_pelayanan-bpn-cirebon.jpg', caption: 'Ruang pelayanan rawat jalan dan konsultasi kesehatan masyarakat.' },
    { url: '/images/foto_kawasan-znt-sumber.jpg', caption: 'Akses koridor jalan menuju fasilitas kesehatan rujukan daerah.' }
  ],
  pendidikan: [
    { url: '/images/foto_sekolah-kawasan-tukmudal.png', caption: 'Gedung fasilitas pendidikan sekolah negeri di kawasan Kabupaten Cirebon.' },
    { url: '/images/foto_kawasan-znt-sumber.jpg', caption: 'Lingkungan sarana pendidikan terpadu dan zona nilai tanah sekitarnya.' },
    { url: '/images/foto_kantor-desa-sindangjawa.png', caption: 'Akses jalan lingkungan dan penunjang aktivitas sekolah siswa.' }
  ],
  ibadah: [
    { url: '/images/foto_masjid-agung-sumber.jpg', caption: 'Arsitektur masjid megah dengan kubah hijau emas dan pelataran marmer indah.' },
    { url: '/images/foto_kawasan-znt-sumber.jpg', caption: 'Kawasan pusat kegiatan keagamaan dan sosial kemasyarakatan.' },
    { url: '/images/foto_kantor-bupati-cirebon.jpg', caption: 'Integrasi tata ruang sarana ibadah dengan kawasan perumahan sekitar.' }
  ],
  ekonomi: [
    { url: '/images/foto_pasar-sumber-cirebon.jpg', caption: 'Aktivitas perdagangan dan transaksi di pasar tradisional Kabupaten Cirebon.' },
    { url: '/images/foto_kawasan-znt-sumber.jpg', caption: 'Kawasan niaga komersial dan koridor pertokoan ekonomi warga.' },
    { url: '/images/foto_pelayanan-bpn-cirebon.jpg', caption: 'Pusat perputaran ekonomi lokal masyarakat Cirebon.' }
  ],
  keuangan: [
    { url: '/images/foto_kantor-bpn-cirebon.jpg', caption: 'Kantor layanan perbankan dan transaksi keuangan terpadu.' },
    { url: '/images/foto_pelayanan-bpn-cirebon.jpg', caption: 'Ruang pelayanan teller dan customer service perbankan profesional.' },
    { url: '/images/foto_pasar-sumber-cirebon.jpg', caption: 'Lokasi strategis di koridor niaga perbankan dan permodalan UMKM.' }
  ]
};

// Map each village to its polygon feature
const villageMap = {};
batas.features.forEach(b => {
  const key = `${b.properties.nama_desa}_${b.properties.nama_kecamatan}`;
  villageMap[key] = b;
});

// Helper to generate a valid point inside a village polygon
function getValidPointInside(villageName, kecName, offsetFractionX = 0, offsetFractionY = 0) {
  const key = `${villageName}_${kecName}`;
  const poly = villageMap[key] || batas.features.find(f => f.properties.nama_desa === villageName);
  if (!poly) {
    throw new Error(`Village not found: ${villageName}`);
  }

  const bbox = turf.bbox(poly); // [minX, minY, maxX, maxY]
  const width = bbox[2] - bbox[0];
  const height = bbox[3] - bbox[1];

  // Try candidate points
  const candidateLng = bbox[0] + width * (0.5 + offsetFractionX * 0.35);
  const candidateLat = bbox[1] + height * (0.5 + offsetFractionY * 0.35);
  const pt = [candidateLng, candidateLat];

  if (turf.booleanPointInPolygon(pt, poly)) {
    return pt;
  }

  // Fallback to pointOnFeature
  const onFeat = turf.pointOnFeature(poly).geometry.coordinates;
  return onFeat;
}

const RAW_POIS = [
  // === SUMBER (Pusat Pemerintahan) ===
  { nama: 'Kantor Pertanahan ATR/BPN Kab. Cirebon', kategori: 'pemerintahan', desa: 'Sumber', kec: 'Sumber', offX: 0.2, offY: 0.1, alamat: 'Jl. Sunan Drajat No. 11, Sumber', telp: '(0231) 321456', jam: '08:00 - 15:30 WIB' },
  { nama: 'Kantor Bupati Cirebon', kategori: 'pemerintahan', desa: 'Sumber', kec: 'Sumber', offX: 0.1, offY: 0.3, alamat: 'Jl. Sunan Kalijaga No. 7, Kompleks Pemkab, Sumber', telp: '(0231) 321197', jam: '07:30 - 16:00 WIB' },
  { nama: 'DPRD Kabupaten Cirebon', kategori: 'pemerintahan', desa: 'Sumber', kec: 'Sumber', offX: 0.3, offY: 0.25, alamat: 'Jl. Sunan Rahmat No. 1, Sumber', telp: '(0231) 321301', jam: '08:00 - 16:00 WIB' },
  { nama: 'Bappelitbangda Kab. Cirebon', kategori: 'pemerintahan', desa: 'Sumber', kec: 'Sumber', offX: -0.1, offY: 0.2, alamat: 'Kompleks Perkantoran Pemkab, Sumber', telp: '(0231) 321402', jam: '07:30 - 15:30 WIB' },
  { nama: 'Masjid Agung Sumber', kategori: 'ibadah', desa: 'Sumber', kec: 'Sumber', offX: 0.15, offY: 0.35, alamat: 'Jl. Sunan Kalijaga Depan Kantor Bupati, Sumber', telp: '-', jam: 'Setiap Waktu Sholat' },
  { nama: 'Pasar Sumber Tradisional', kategori: 'ekonomi', desa: 'Sumber', kec: 'Sumber', offX: -0.1, offY: -0.2, alamat: 'Jl. R.A. Kartini No. 5, Sumber', telp: '-', jam: '04:00 - 17:00 WIB' },
  { nama: 'Bank BJB Cabang Sumber', kategori: 'keuangan', desa: 'Sumber', kec: 'Sumber', offX: -0.15, offY: 0.1, alamat: 'Jl. R. Dewi Sartika No. 22, Sumber', telp: '(0231) 321555', jam: '08:00 - 15:00 WIB' },
  { nama: 'Bank BRI KC Sumber', kategori: 'keuangan', desa: 'Sumber', kec: 'Sumber', offX: 0.1, offY: -0.1, alamat: 'Jl. Sunan Drajat No. 8, Sumber', telp: '(0231) 321666', jam: '08:00 - 15:00 WIB' },
  { nama: 'Puskesmas DTP Sumber', kategori: 'kesehatan', desa: 'Sumber', kec: 'Sumber', offX: 0.25, offY: -0.05, alamat: 'Jl. Sultan Agung No. 15, Sumber', telp: '(0231) 321045', jam: '24 Jam' },
  { nama: 'SMAN 1 Sumber', kategori: 'pendidikan', desa: 'Sumber', kec: 'Sumber', offX: 0.35, offY: 0.15, alamat: 'Jl. Sunan Malik Ibrahim No. 4, Sumber', telp: '(0231) 321184', jam: '07:00 - 15:00 WIB' },
  { nama: 'Kantor Kelurahan Sumber', kategori: 'desa', desa: 'Sumber', kec: 'Sumber', offX: 0.18, offY: 0.05, alamat: 'Jl. Pangeran Kejaksan No. 3, Sumber', telp: '(0231) 321701', jam: '08:00 - 15:30 WIB' },
  { nama: 'Taman Olahraga Ranggajati', kategori: 'pemerintahan', desa: 'Sumber', kec: 'Sumber', offX: 0.3, offY: 0.3, alamat: 'Jl. Sunan Malik Ibrahim, Sumber', telp: '-', jam: '06:00 - 21:00 WIB' },

  // === TUKMUDAL ===
  { nama: 'Dinas Pekerjaan Umum & Tata Ruang (PUTR)', kategori: 'pemerintahan', desa: 'Tukmudal', kec: 'Sumber', offX: 0.2, offY: -0.1, alamat: 'Jl. R. Dewi Sartika No. 1, Tukmudal', telp: '(0231) 321155', jam: '08:00 - 15:30 WIB' },
  { nama: 'SMPN 1 Sumber', kategori: 'pendidikan', desa: 'Tukmudal', kec: 'Sumber', offX: 0.1, offY: -0.2, alamat: 'Jl. Raden Dewi Sartika No. 12, Tukmudal', telp: '(0231) 321345', jam: '07:00 - 14:30 WIB' },
  { nama: 'Kantor Kelurahan Tukmudal', kategori: 'desa', desa: 'Tukmudal', kec: 'Sumber', offX: -0.2, offY: 0.1, alamat: 'Jl. Ki Bagus Rangin No. 14, Tukmudal', telp: '(0231) 321703', jam: '08:00 - 15:30 WIB' },

  // === BABAKAN ===
  { nama: 'RSUD Sumber Kab. Cirebon', kategori: 'kesehatan', desa: 'Babakan', kec: 'Sumber', offX: 0.1, offY: 0.2, alamat: 'Jl. Pangeran Kejaksan No. 5, Babakan', telp: '(0231) 321288', jam: '24 Jam (IGD)' },
  { nama: 'Kantor Kelurahan Babakan', kategori: 'desa', desa: 'Babakan', kec: 'Sumber', offX: 0.2, offY: -0.2, alamat: 'Jl. Fatahillah No. 45, Babakan', telp: '(0231) 321702', jam: '08:00 - 15:30 WIB' },

  // === GEGUNUNG & PERBUTULAN ===
  { nama: 'Kantor Kelurahan Gegunung', kategori: 'desa', desa: 'Gegunung', kec: 'Sumber', offX: 0.1, offY: 0.1, alamat: 'Jl. Gegunung Indah No. 5, Gegunung', telp: '(0231) 321704', jam: '08:00 - 15:30 WIB' },
  { nama: 'Kantor Kelurahan Perbutulan', kategori: 'desa', desa: 'Perbutulan', kec: 'Sumber', offX: 0.1, offY: 0.1, alamat: 'Jl. Pangeran Antasari No. 18, Perbutulan', telp: '(0231) 321705', jam: '08:00 - 15:30 WIB' },

  // === UTARA: CEMPAKA (Talun & Plumbon), KALIWADAS, KENANGA, KARANGWANGI ===
  { nama: 'Kantor Desa Cempaka', kategori: 'desa', desa: 'Cempaka', kec: 'Talun', offX: 0.1, offY: 0.1, alamat: 'Jl. Pangeran Cakrabuana No. 25, Cempaka', telp: '(0231) 880123', jam: '08:00 - 15:30 WIB' },
  { nama: 'Masjid Jamie Nurul Huda Cempaka', kategori: 'ibadah', desa: 'Cempaka', kec: 'Talun', offX: -0.1, offY: -0.2, alamat: 'Jl. Raya Talun KM 3, Cempaka', telp: '-', jam: 'Setiap Waktu Sholat' },
  { nama: 'SDN 1 Cempaka', kategori: 'pendidikan', desa: 'Cempaka', kec: 'Talun', offX: 0.2, offY: -0.1, alamat: 'Jl. Ki Gede Cempaka No. 8, Cempaka', telp: '(0231) 880456', jam: '07:00 - 13:00 WIB' },
  { nama: 'Sentra Niaga & Kuliner Cakrabuana', kategori: 'ekonomi', desa: 'Cempaka', kec: 'Talun', offX: -0.2, offY: 0.2, alamat: 'Jl. Pangeran Cakrabuana Kav. 12, Cempaka', telp: '-', jam: '09:00 - 22:00 WIB' },
  
  { nama: 'Kantor Kelurahan Kaliwadas', kategori: 'desa', desa: 'Kaliwadas', kec: 'Sumber', offX: 0.1, offY: 0.1, alamat: 'Jl. Kaliwadas Raya No. 9, Kaliwadas', telp: '(0231) 321706', jam: '08:00 - 15:30 WIB' },
  { nama: 'SDN 1 Kaliwadas', kategori: 'pendidikan', desa: 'Kaliwadas', kec: 'Sumber', offX: -0.2, offY: -0.1, alamat: 'Jl. Blok Pesantren No. 3, Kaliwadas', telp: '(0231) 321780', jam: '07:00 - 13:30 WIB' },
  { nama: 'Masjid Jamie Baiturrahman Kaliwadas', kategori: 'ibadah', desa: 'Kaliwadas', kec: 'Sumber', offX: 0.2, offY: -0.2, alamat: 'Jl. Kaliwadas Timur No. 14, Kaliwadas', telp: '-', jam: 'Setiap Waktu Sholat' },

  { nama: 'Kantor Kelurahan Kenanga', kategori: 'desa', desa: 'Kenanga', kec: 'Sumber', offX: 0.1, offY: 0.1, alamat: 'Jl. Kenanga Raya No. 1, Kenanga', telp: '(0231) 321707', jam: '08:00 - 15:30 WIB' },
  { nama: 'Sentra Industri Pangan Kerupuk Kenanga', kategori: 'ekonomi', desa: 'Kenanga', kec: 'Sumber', offX: -0.2, offY: 0.2, alamat: 'Kawasan Sentra UMKM Kenanga, Kenanga', telp: '(0231) 321900', jam: '08:00 - 17:00 WIB' },
  { nama: 'Puskesmas Pembantu Kenanga', kategori: 'kesehatan', desa: 'Kenanga', kec: 'Sumber', offX: 0.2, offY: -0.2, alamat: 'Jl. Siliwangi Barat No. 7, Kenanga', telp: '(0231) 321098', jam: '08:00 - 14:00 WIB' },

  { nama: 'Kantor Desa Karangwangi', kategori: 'desa', desa: 'Karangwangi', kec: 'Depok', offX: 0.1, offY: 0.1, alamat: 'Jl. Karangwangi Blok Masjid, Karangwangi', telp: '(0231) 881234', jam: '08:00 - 15:30 WIB' },
  { nama: 'SDN 1 Karangwangi', kategori: 'pendidikan', desa: 'Karangwangi', kec: 'Depok', offX: -0.1, offY: -0.1, alamat: 'Jl. Karangwangi Utama No. 16, Karangwangi', telp: '-', jam: '07:00 - 13:00 WIB' },
  { nama: 'Masjid Jami Al-Barokah Karangwangi', kategori: 'ibadah', desa: 'Karangwangi', kec: 'Depok', offX: 0.2, offY: -0.2, alamat: 'Jl. Pesantren No. 4, Karangwangi', telp: '-', jam: 'Setiap Waktu Sholat' },

  { nama: 'Puskesmas Plumbon Pembantu', kategori: 'kesehatan', desa: 'Cempaka', kec: 'Plumbon', offX: 0.1, offY: 0.1, alamat: 'Jl. Pangeran Antasari Plumbon, Cempaka', telp: '(0231) 321950', jam: '08:00 - 15:00 WIB' },
  { nama: 'Klinik Pratama Rawat Inap Sehat', kategori: 'kesehatan', desa: 'Cempaka', kec: 'Plumbon', offX: -0.1, offY: -0.1, alamat: 'Jl. Raya Plumbon No. 40, Cempaka', telp: '(0231) 321977', jam: '24 Jam' },

  // === BARAT: SINDANGJAWA, SINDANGMEKAR, CANGKOAK, CISAAT ===
  { nama: 'Kantor Kuwu Desa Sindangjawa', kategori: 'desa', desa: 'Sindangjawa', kec: 'Dukupuntang', offX: 0.1, offY: 0.1, alamat: 'Jl. Nyi Ageng Serang No. 1, Sindangjawa', telp: '(0231) 882101', jam: '08:00 - 15:30 WIB' },
  { nama: 'Masjid Jamie Al-Ikhlas Sindangjawa', kategori: 'ibadah', desa: 'Sindangjawa', kec: 'Dukupuntang', offX: -0.2, offY: -0.1, alamat: 'Jl. Nyi Ageng Serang No. 15, Sindangjawa', telp: '-', jam: 'Setiap Waktu Sholat' },
  { nama: 'SDN 1 Sindangjawa', kategori: 'pendidikan', desa: 'Sindangjawa', kec: 'Dukupuntang', offX: 0.2, offY: -0.2, alamat: 'Jl. Sindangjawa Tengah No. 20, Sindangjawa', telp: '-', jam: '07:00 - 13:00 WIB' },
  { nama: 'Sentra Agrowisata Buah Sindangjawa', kategori: 'ekonomi', desa: 'Sindangjawa', kec: 'Dukupuntang', offX: -0.1, offY: 0.2, alamat: 'Kawasan Perkebunan Rakyat Sindangjawa', telp: '-', jam: '08:00 - 17:00 WIB' },

  { nama: 'Kantor Kuwu Desa Sindangmekar', kategori: 'desa', desa: 'Sindangmekar', kec: 'Dukupuntang', offX: 0.1, offY: 0.1, alamat: 'Jl. Ki Gede Mayung No. 2, Sindangmekar', telp: '(0231) 882102', jam: '08:00 - 15:30 WIB' },
  { nama: 'SDN 1 Sindangmekar', kategori: 'pendidikan', desa: 'Sindangmekar', kec: 'Dukupuntang', offX: -0.1, offY: -0.1, alamat: 'Jl. Raya Dukupuntang No. 44, Sindangmekar', telp: '-', jam: '07:00 - 13:00 WIB' },

  { nama: 'Balai Kuwu Desa Cangkoak', kategori: 'desa', desa: 'Cangkoak', kec: 'Dukupuntang', offX: 0.1, offY: 0.1, alamat: 'Jl. Cangkoak Raya No. 10, Cangkoak', telp: '(0231) 882103', jam: '08:00 - 15:30 WIB' },
  { nama: 'Sentra Kerajinan Batu Alam Cangkoak', kategori: 'ekonomi', desa: 'Cangkoak', kec: 'Dukupuntang', offX: -0.1, offY: 0.2, alamat: 'Jl. Sentra Industri Batu Alam, Cangkoak', telp: '-', jam: '08:00 - 17:00 WIB' },
  { nama: 'SMPN 2 Dukupuntang', kategori: 'pendidikan', desa: 'Cangkoak', kec: 'Dukupuntang', offX: 0.2, offY: -0.1, alamat: 'Jl. Cangkoak Dukupuntang No. 8, Cangkoak', telp: '(0231) 882345', jam: '07:00 - 14:00 WIB' },

  { nama: 'Kantor Kuwu Desa Cisaat', kategori: 'desa', desa: 'Cisaat', kec: 'Dukupuntang', offX: 0.1, offY: 0.1, alamat: 'Jl. Cisaat Utama No. 5, Cisaat', telp: '(0231) 882104', jam: '08:00 - 15:30 WIB' },
  { nama: 'Puskesmas Dukupuntang Rawat Inap', kategori: 'kesehatan', desa: 'Cisaat', kec: 'Dukupuntang', offX: -0.1, offY: -0.1, alamat: 'Jl. Raya Cisaat KM 2, Cisaat', telp: '(0231) 882990', jam: '24 Jam' },
  { nama: 'Pasar Tradisional Cisaat', kategori: 'ekonomi', desa: 'Cisaat', kec: 'Dukupuntang', offX: 0.2, offY: -0.2, alamat: 'Jl. Pasar Cisaat No. 1, Cisaat', telp: '-', jam: '05:00 - 15:00 WIB' },
  { nama: 'Pesantren Terpadu Bina Insan Mulia', kategori: 'pendidikan', desa: 'Cisaat', kec: 'Dukupuntang', offX: -0.2, offY: 0.2, alamat: 'Jl. KH. Lukman Hakim, Cisaat', telp: '(0231) 882777', jam: '08:00 - 17:00 WIB' },

  // === TIMUR: KECOMBERAN, SENDANG, KEMANTREN, WANASABA, SAMPIRAN, SARWADADI, KUBANG, KRANDON, PEJAMBON ===
  { nama: 'Kantor Desa Kecomberan', kategori: 'desa', desa: 'Kecomberan', kec: 'Talun', offX: 0.1, offY: 0.1, alamat: 'Jl. Pangeran Cakrabuana No. 88, Kecomberan', telp: '(0231) 883101', jam: '08:00 - 15:30 WIB' },
  { nama: 'SMPN 1 Talun', kategori: 'pendidikan', desa: 'Kecomberan', kec: 'Talun', offX: -0.1, offY: -0.1, alamat: 'Jl. Kecomberan No. 14, Kecomberan', telp: '(0231) 883234', jam: '07:00 - 14:00 WIB' },
  { nama: 'Puskesmas Talun', kategori: 'kesehatan', desa: 'Kecomberan', kec: 'Talun', offX: 0.2, offY: -0.2, alamat: 'Jl. Raya Kecomberan Talun No. 2, Kecomberan', telp: '(0231) 883045', jam: '24 Jam' },

  { nama: 'Kantor Kelurahan Sendang', kategori: 'desa', desa: 'Sendang', kec: 'Sumber', offX: 0.1, offY: 0.1, alamat: 'Jl. Ki Gede Sendang No. 7, Sendang', telp: '(0231) 321708', jam: '08:00 - 15:30 WIB' },
  { nama: 'Sentra Kerajinan Batik Sendang', kategori: 'ekonomi', desa: 'Sendang', kec: 'Sumber', offX: -0.1, offY: -0.1, alamat: 'Jl. Pesantren Sendang No. 12, Sendang', telp: '(0231) 321955', jam: '08:30 - 20:00 WIB' },

  { nama: 'Kantor Kelurahan Kemantren', kategori: 'desa', desa: 'Kemantren', kec: 'Sumber', offX: 0.1, offY: 0.1, alamat: 'Jl. Pangeran Kejaksan No. 50, Kemantren', telp: '(0231) 321709', jam: '08:00 - 15:30 WIB' },
  { nama: 'Pos Damkar Sektor Sumber', kategori: 'pemerintahan', desa: 'Kemantren', kec: 'Sumber', offX: -0.1, offY: -0.1, alamat: 'Jl. Kemantren Raya No. 3, Kemantren', telp: '(0231) 321113', jam: '24 Jam' },

  { nama: 'Kantor Desa Wanasaba Lor', kategori: 'desa', desa: 'Wanasaba Lor', kec: 'Talun', offX: 0.1, offY: 0.1, alamat: 'Jl. Wanasaba Lor No. 16, Wanasaba Lor', telp: '(0231) 883102', jam: '08:00 - 15:30 WIB' },
  { nama: 'Pasar Tradisional Wanasaba', kategori: 'ekonomi', desa: 'Wanasaba Lor', kec: 'Talun', offX: -0.1, offY: -0.1, alamat: 'Jl. Raya Wanasaba, Wanasaba Lor', telp: '-', jam: '05:00 - 14:00 WIB' },

  { nama: 'Kantor Desa Wanasaba Kidul', kategori: 'desa', desa: 'Wanasaba Kidul', kec: 'Talun', offX: 0.1, offY: 0.1, alamat: 'Jl. Balai Desa Wanasaba Kidul No. 1, Wanasaba Kidul', telp: '(0231) 883103', jam: '08:00 - 15:30 WIB' },

  { nama: 'Kantor Desa Cirebongirang', kategori: 'desa', desa: 'Cirebongirang', kec: 'Talun', offX: 0.1, offY: 0.1, alamat: 'Jl. Sunan Gunung Jati No. 3, Cirebongirang', telp: '(0231) 883104', jam: '08:00 - 15:30 WIB' },
  { nama: 'Masjid Bersejarah Cirebongirang', kategori: 'ibadah', desa: 'Cirebongirang', kec: 'Talun', offX: -0.1, offY: -0.1, alamat: 'Kompleks Keramat Cirebongirang', telp: '-', jam: 'Buka 24 Jam' },

  { nama: 'Balai Kuwu Desa Sampiran', kategori: 'desa', desa: 'Sampiran', kec: 'Talun', offX: 0.1, offY: 0.1, alamat: 'Jl. Raya Gronggong KM 5, Sampiran', telp: '(0231) 883105', jam: '08:00 - 15:30 WIB' },
  { nama: 'Kawasan Wisata Bukit Gronggong', kategori: 'ekonomi', desa: 'Sampiran', kec: 'Talun', offX: -0.1, offY: 0.2, alamat: 'Jl. Raya Cirebon-Kuningan Bukit Gronggong, Sampiran', telp: '-', jam: '10:00 - 23:00 WIB' },

  { nama: 'Kantor Desa Krandon', kategori: 'desa', desa: 'Krandon', kec: 'Talun', offX: 0.1, offY: 0.1, alamat: 'Jl. Krandon Tengah No. 4, Krandon', telp: '(0231) 883106', jam: '08:00 - 15:30 WIB' },
  { nama: 'Balai Kuwu Desa Kubang', kategori: 'desa', desa: 'Kubang', kec: 'Talun', offX: 0.1, offY: 0.1, alamat: 'Jl. Desa Kubang No. 12, Kubang', telp: '(0231) 883107', jam: '08:00 - 15:30 WIB' },
  { nama: 'Kantor Desa Sarwadadi', kategori: 'desa', desa: 'Sarwadadi', kec: 'Talun', offX: 0.1, offY: 0.1, alamat: 'Jl. Sarwadadi Utama No. 8, Sarwadadi', telp: '(0231) 883108', jam: '08:00 - 15:30 WIB' },
  { nama: 'Embung Pertanian Sarwadadi', kategori: 'pemerintahan', desa: 'Sarwadadi', kec: 'Talun', offX: -0.1, offY: -0.1, alamat: 'Kawasan Embung Irigasi Sarwadadi, Sarwadadi', telp: '-', jam: '06:00 - 18:00 WIB' },
  { nama: 'Kantor Kelurahan Pejambon', kategori: 'desa', desa: 'Pejambon', kec: 'Sumber', offX: 0.1, offY: 0.1, alamat: 'Jl. Pejambon Raya No. 11, Pejambon', telp: '(0231) 321710', jam: '08:00 - 15:30 WIB' },

  // === SELATAN: SINDANGWANGI & MATANGAJI ===
  { nama: 'Kantor Kuwu Desa Matangaji', kategori: 'desa', desa: 'Matangaji', kec: 'Sumber', offX: 0.0, offY: 0.0, alamat: 'Jl. Panembahan Matangaji No. 1, Matangaji', telp: '(0231) 321711', jam: '08:00 - 15:30 WIB' },
  { nama: 'Wisata Alam Batu Lawang', kategori: 'ekonomi', desa: 'Matangaji', kec: 'Sumber', offX: -0.2, offY: -0.1, alamat: 'Perbukitan Matangaji, Matangaji', telp: '-', jam: '07:30 - 17:30 WIB' },
  { nama: 'SDN 1 Matangaji', kategori: 'pendidikan', desa: 'Matangaji', kec: 'Sumber', offX: 0.2, offY: 0.1, alamat: 'Jl. Panembahan No. 18, Matangaji', telp: '-', jam: '07:00 - 13:00 WIB' },
  { nama: 'Puskesmas Pembantu Matangaji', kategori: 'kesehatan', desa: 'Matangaji', kec: 'Sumber', offX: -0.1, offY: 0.15, alamat: 'Jl. Raya Desa Matangaji, Matangaji', telp: '(0231) 321980', jam: '08:00 - 14:00 WIB' },

  { nama: 'Balai Kuwu Desa Sindangwangi', kategori: 'desa', desa: 'Sindangwangi', kec: 'Sumber', offX: 0.0, offY: 0.0, alamat: 'Jl. Sindangwangi Asri No. 5, Sindangwangi', telp: '(0231) 321712', jam: '08:00 - 15:30 WIB' },
  { nama: 'Kawasan Perkebunan Rakyat Sindangwangi', kategori: 'ekonomi', desa: 'Sindangwangi', kec: 'Sumber', offX: -0.2, offY: -0.15, alamat: 'Blok Perkebunan Sindangwangi, Sindangwangi', telp: '-', jam: '07:00 - 16:00 WIB' },
  { nama: 'Pos Pantau Kehutanan & Konservasi', kategori: 'pemerintahan', desa: 'Sindangwangi', kec: 'Sumber', offX: 0.2, offY: -0.2, alamat: 'Batas Kawasan Hutan Lindung, Sindangwangi', telp: '(0231) 321115', jam: '24 Jam' },
  { nama: 'SDN 1 Sindangwangi', kategori: 'pendidikan', desa: 'Sindangwangi', kec: 'Sumber', offX: 0.15, offY: 0.15, alamat: 'Jl. Sindangwangi No. 12, Sindangwangi', telp: '-', jam: '07:00 - 13:00 WIB' },
  { nama: 'Masjid Jami Al-Muhajirin Sindangwangi', kategori: 'ibadah', desa: 'Sindangwangi', kec: 'Sumber', offX: -0.15, offY: 0.2, alamat: 'Jl. Sindangwangi Timur, Sindangwangi', telp: '-', jam: 'Setiap Waktu Sholat' }
];

console.log('Total raw POIs defined:', RAW_POIS.length);

const generatedFeatures = [];

RAW_POIS.forEach((item, idx) => {
  const coords = getValidPointInside(item.desa, item.kec, item.offX, item.offY);
  const photoSet = PHOTOS[item.kategori] || PHOTOS.pemerintahan;

  generatedFeatures.push({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coords
    },
    properties: {
      id: idx + 1,
      nama: item.nama,
      kategori: item.kategori,
      alamat: item.alamat,
      kecamatan: item.kec,
      kelurahan: item.desa,
      telepon: item.telp,
      jam_operasional: item.jam,
      status: 'Aktif Beroperasi',
      foto_gallery: photoSet
    }
  });
});

// Final check: guarantee 100% inside polygon
let allInside = true;
generatedFeatures.forEach(f => {
  let ins = false;
  for (const b of batas.features) {
    if (turf.booleanPointInPolygon(f.geometry.coordinates, b)) {
      ins = true;
      break;
    }
  }
  if (!ins) {
    console.error('ERROR: Still outside:', f.properties.nama);
    allInside = false;
  }
});

if (allInside) {
  console.log('SUCCESS: All ' + generatedFeatures.length + ' POIs are 100% strictly INSIDE the boundary polygons!');
  const fc = {
    type: 'FeatureCollection',
    features: generatedFeatures
  };
  fs.writeFileSync('./src/data/fasilitas-publik.geojson', JSON.stringify(fc, null, 2));
} else {
  console.error('FAILED verification');
}
