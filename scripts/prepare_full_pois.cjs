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

// Raw list of strategic POIs across all 5 zones
const POI_DEFINITIONS = [
  // === 1. KAWASAN TENGAH (Sumber, Babakan, Tukmudal, Gegunung, Perbutulan) ===
  {
    nama: 'Kantor Pertanahan ATR/BPN Kab. Cirebon',
    kategori: 'pemerintahan',
    alamat: 'Jl. Sunan Drajat No. 11, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4812, -6.7645],
    telepon: '(0231) 321456',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Kantor Bupati Cirebon',
    kategori: 'pemerintahan',
    alamat: 'Jl. Sunan Kalijaga No. 7, Kompleks Pemkab, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4805, -6.7605],
    telepon: '(0231) 321197',
    jam: '07:30 - 16:00 WIB'
  },
  {
    nama: 'DPRD Kabupaten Cirebon',
    kategori: 'pemerintahan',
    alamat: 'Jl. Sunan Rahmat No. 1, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4828, -6.7592],
    telepon: '(0231) 321301',
    jam: '08:00 - 16:00 WIB'
  },
  {
    nama: 'Bappelitbangda Kabupaten Cirebon',
    kategori: 'pemerintahan',
    alamat: 'Kompleks Perkantoran Pemkab, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4792, -6.7618],
    telepon: '(0231) 321402',
    jam: '07:30 - 15:30 WIB'
  },
  {
    nama: 'Dinas Pekerjaan Umum & Tata Ruang (PUTR)',
    kategori: 'pemerintahan',
    alamat: 'Jl. R. Dewi Sartika No. 1, Sumber',
    kecamatan: 'Sumber',
    desa: 'Tukmudal',
    coords: [108.4755, -6.7612],
    telepon: '(0231) 321155',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'RSUD Sumber Kab. Cirebon',
    kategori: 'kesehatan',
    alamat: 'Jl. Pangeran Kejaksan No. 5, Babakan',
    kecamatan: 'Sumber',
    desa: 'Babakan',
    coords: [108.4855, -6.7688],
    telepon: '(0231) 321288',
    jam: '24 Jam (IGD)'
  },
  {
    nama: 'Puskesmas DTP Sumber',
    kategori: 'kesehatan',
    alamat: 'Jl. Sultan Agung No. 15, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4831, -6.7658],
    telepon: '(0231) 321045',
    jam: '24 Jam'
  },
  {
    nama: 'SMAN 1 Sumber',
    kategori: 'pendidikan',
    alamat: 'Jl. Sunan Malik Ibrahim No. 4, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4842, -6.7622],
    telepon: '(0231) 321184',
    jam: '07:00 - 15:00 WIB'
  },
  {
    nama: 'SMPN 1 Sumber',
    kategori: 'pendidikan',
    alamat: 'Jl. Raden Dewi Sartika No. 12, Tukmudal',
    kecamatan: 'Sumber',
    desa: 'Tukmudal',
    coords: [108.4738, -6.7629],
    telepon: '(0231) 321345',
    jam: '07:00 - 14:30 WIB'
  },
  {
    nama: 'SMKN 1 Sumber',
    kategori: 'pendidikan',
    alamat: 'Jl. Kenanga No. 8, Kenanga, Sumber',
    kecamatan: 'Sumber',
    desa: 'Kenanga',
    coords: [108.4721, -6.7455],
    telepon: '(0231) 321890',
    jam: '07:00 - 15:30 WIB'
  },
  {
    nama: 'Masjid Agung Sumber',
    kategori: 'ibadah',
    alamat: 'Jl. Sunan Kalijaga, Depan Kantor Bupati, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4815, -6.7598],
    telepon: '-',
    jam: 'Buka Setiap Waktu Sholat'
  },
  {
    nama: 'Pasar Sumber Tradisional',
    kategori: 'ekonomi',
    alamat: 'Jl. R.A. Kartini, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4788, -6.7672],
    telepon: '-',
    jam: '04:00 - 17:00 WIB'
  },
  {
    nama: 'Bank BJB Cabang Sumber',
    kategori: 'keuangan',
    alamat: 'Jl. R. Dewi Sartika No. 22, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4772, -6.7635],
    telepon: '(0231) 321555',
    jam: '08:00 - 15:00 WIB'
  },
  {
    nama: 'Bank BRI Kantor Cabang Sumber',
    kategori: 'keuangan',
    alamat: 'Jl. Sunan Drajat No. 8, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4802, -6.7651],
    telepon: '(0231) 321666',
    jam: '08:00 - 15:00 WIB'
  },
  {
    nama: 'Kantor Kelurahan Sumber',
    kategori: 'desa',
    alamat: 'Jl. Pangeran Kejaksan No. 3, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4822, -6.7638],
    telepon: '(0231) 321701',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Kantor Kelurahan Babakan',
    kategori: 'desa',
    alamat: 'Jl. Fatahillah No. 45, Babakan',
    kecamatan: 'Sumber',
    desa: 'Babakan',
    coords: [108.4862, -6.7725],
    telepon: '(0231) 321702',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Kantor Kelurahan Tukmudal',
    kategori: 'desa',
    alamat: 'Jl. Ki Bagus Rangin No. 14, Tukmudal',
    kecamatan: 'Sumber',
    desa: 'Tukmudal',
    coords: [108.4682, -6.7618],
    telepon: '(0231) 321703',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Kantor Kelurahan Gegunung',
    kategori: 'desa',
    alamat: 'Jl. Gegunung Indah No. 5, Gegunung',
    kecamatan: 'Sumber',
    desa: 'Gegunung',
    coords: [108.4905, -6.7512],
    telepon: '(0231) 321704',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Kantor Kelurahan Perbutulan',
    kategori: 'desa',
    alamat: 'Jl. Pangeran Antasari No. 18, Perbutulan',
    kecamatan: 'Sumber',
    desa: 'Perbutulan',
    coords: [108.4872, -6.7485],
    telepon: '(0231) 321705',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Taman Olahraga Ranggajati',
    kategori: 'pemerintahan',
    alamat: 'Jl. Sunan Malik Ibrahim, Sumber',
    kecamatan: 'Sumber',
    desa: 'Sumber',
    coords: [108.4851, -6.7602],
    telepon: '-',
    jam: '06:00 - 21:00 WIB'
  },

  // === 2. KAWASAN UTARA (Cempaka, Kaliwadas, Kenanga, Karangwangi, Plumbon) ===
  {
    nama: 'Kantor Desa Cempaka',
    kategori: 'desa',
    alamat: 'Jl. Pangeran Cakrabuana No. 25, Cempaka',
    kecamatan: 'Talun',
    desa: 'Cempaka',
    coords: [108.4985, -6.7325],
    telepon: '(0231) 880123',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Masjid Jamie Nurul Huda Cempaka',
    kategori: 'ibadah',
    alamat: 'Jl. Raya Talun KM 3, Cempaka',
    kecamatan: 'Talun',
    desa: 'Cempaka',
    coords: [108.4965, -6.7352],
    telepon: '-',
    jam: 'Setiap Waktu Sholat'
  },
  {
    nama: 'SDN 1 Cempaka',
    kategori: 'pendidikan',
    alamat: 'Jl. Ki Gede Cempaka No. 8, Cempaka',
    kecamatan: 'Talun',
    desa: 'Cempaka',
    coords: [108.4972, -6.7338],
    telepon: '(0231) 880456',
    jam: '07:00 - 13:00 WIB'
  },
  {
    nama: 'Sentra Kuliner & Niaga Cakrabuana',
    kategori: 'ekonomi',
    alamat: 'Jl. Pangeran Cakrabuana Kav. 12, Cempaka',
    kecamatan: 'Talun',
    desa: 'Cempaka',
    coords: [108.4998, -6.7312],
    telepon: '-',
    jam: '09:00 - 22:00 WIB'
  },
  {
    nama: 'Kantor Kelurahan Kaliwadas',
    kategori: 'desa',
    alamat: 'Jl. Kaliwadas Raya No. 9, Kaliwadas',
    kecamatan: 'Sumber',
    desa: 'Kaliwadas',
    coords: [108.4815, -6.7462],
    telepon: '(0231) 321706',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'SDN 1 Kaliwadas',
    kategori: 'pendidikan',
    alamat: 'Jl. Blok Pesantren No. 3, Kaliwadas',
    kecamatan: 'Sumber',
    desa: 'Kaliwadas',
    coords: [108.4828, -6.7445],
    telepon: '(0231) 321780',
    jam: '07:00 - 13:30 WIB'
  },
  {
    nama: 'Masjid Jamie Baiturrahman Kaliwadas',
    kategori: 'ibadah',
    alamat: 'Jl. Kaliwadas Timur No. 14, Kaliwadas',
    kecamatan: 'Sumber',
    desa: 'Kaliwadas',
    coords: [108.4842, -6.7471],
    telepon: '-',
    jam: 'Setiap Waktu Sholat'
  },
  {
    nama: 'Kantor Kelurahan Kenanga',
    kategori: 'desa',
    alamat: 'Jl. Kenanga Raya No. 1, Kenanga',
    kecamatan: 'Sumber',
    desa: 'Kenanga',
    coords: [108.4685, -6.7482],
    telepon: '(0231) 321707',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Sentra Industri Pangan Kerupuk Kenanga',
    kategori: 'ekonomi',
    alamat: 'Kawasan Sentra UMKM Kenanga, Kenanga',
    kecamatan: 'Sumber',
    desa: 'Kenanga',
    coords: [108.4655, -6.7495],
    telepon: '(0231) 321900',
    jam: '08:00 - 17:00 WIB'
  },
  {
    nama: 'Puskesmas Pembantu Kenanga',
    kategori: 'kesehatan',
    alamat: 'Jl. Siliwangi Barat No. 7, Kenanga',
    kecamatan: 'Sumber',
    desa: 'Kenanga',
    coords: [108.4698, -6.7475],
    telepon: '(0231) 321098',
    jam: '08:00 - 14:00 WIB'
  },
  {
    nama: 'Kantor Desa Karangwangi',
    kategori: 'desa',
    alamat: 'Jl. Karangwangi Blok Masjid, Karangwangi',
    kecamatan: 'Depok',
    desa: 'Karangwangi',
    coords: [108.4552, -6.7448],
    telepon: '(0231) 881234',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'SDN 1 Karangwangi',
    kategori: 'pendidikan',
    alamat: 'Jl. Karangwangi Utama No. 16, Karangwangi',
    kecamatan: 'Depok',
    desa: 'Karangwangi',
    coords: [108.4568, -6.7462],
    telepon: '-',
    jam: '07:00 - 13:00 WIB'
  },
  {
    nama: 'Masjid Jami Al-Barokah Karangwangi',
    kategori: 'ibadah',
    alamat: 'Jl. Pesantren No. 4, Karangwangi',
    kecamatan: 'Depok',
    desa: 'Karangwangi',
    coords: [108.4541, -6.7435],
    telepon: '-',
    jam: 'Setiap Waktu Sholat'
  },
  {
    nama: 'Puskesmas Plumbon Pembantu Cempaka',
    kategori: 'kesehatan',
    alamat: 'Jl. Pangeran Antasari Plumbon, Cempaka',
    kecamatan: 'Plumbon',
    desa: 'Cempaka',
    coords: [108.4715, -6.7285],
    telepon: '(0231) 321950',
    jam: '08:00 - 15:00 WIB'
  },
  {
    nama: 'Klinik Pratama Rawat Inap Sehat',
    kategori: 'kesehatan',
    alamat: 'Jl. Raya Plumbon No. 40, Cempaka',
    kecamatan: 'Plumbon',
    desa: 'Cempaka',
    coords: [108.4735, -6.7268],
    telepon: '(0231) 321977',
    jam: '24 Jam'
  },

  // === 3. KAWASAN BARAT (Sindangjawa, Sindangmekar, Cangkoak, Cisaat) ===
  {
    nama: 'Kantor Kuwu Desa Sindangjawa',
    kategori: 'desa',
    alamat: 'Jl. Nyi Ageng Serang No. 1, Sindangjawa',
    kecamatan: 'Dukupuntang',
    desa: 'Sindangjawa',
    coords: [108.4485, -6.7625],
    telepon: '(0231) 882101',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Masjid Jamie Al-Ikhlas Sindangjawa',
    kategori: 'ibadah',
    alamat: 'Jl. Nyi Ageng Serang No. 15, Sindangjawa',
    kecamatan: 'Dukupuntang',
    desa: 'Sindangjawa',
    coords: [108.4468, -6.7638],
    telepon: '-',
    jam: 'Setiap Waktu Sholat'
  },
  {
    nama: 'SDN 1 Sindangjawa',
    kategori: 'pendidikan',
    alamat: 'Jl. Sindangjawa Tengah No. 20, Sindangjawa',
    kecamatan: 'Dukupuntang',
    desa: 'Sindangjawa',
    coords: [108.4492, -6.7612],
    telepon: '-',
    jam: '07:00 - 13:00 WIB'
  },
  {
    nama: 'Sentra Agrowisata Buah Sindangjawa',
    kategori: 'ekonomi',
    alamat: 'Kawasan Perkebunan Rakyat Sindangjawa',
    kecamatan: 'Dukupuntang',
    desa: 'Sindangjawa',
    coords: [108.4452, -6.7655],
    telepon: '-',
    jam: '08:00 - 17:00 WIB'
  },
  {
    nama: 'Kantor Kuwu Desa Sindangmekar',
    kategori: 'desa',
    alamat: 'Jl. Ki Gede Mayung No. 2, Sindangmekar',
    kecamatan: 'Dukupuntang',
    desa: 'Sindangmekar',
    coords: [108.4435, -6.7512],
    telepon: '(0231) 882102',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'SDN 1 Sindangmekar',
    kategori: 'pendidikan',
    alamat: 'Jl. Raya Dukupuntang No. 44, Sindangmekar',
    kecamatan: 'Dukupuntang',
    desa: 'Sindangmekar',
    coords: [108.4448, -6.7525],
    telepon: '-',
    jam: '07:00 - 13:00 WIB'
  },
  {
    nama: 'Balai Kuwu Desa Cangkoak',
    kategori: 'desa',
    alamat: 'Jl. Cangkoak Raya No. 10, Cangkoak',
    kecamatan: 'Dukupuntang',
    desa: 'Cangkoak',
    coords: [108.4355, -6.7585],
    telepon: '(0231) 882103',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Sentra Kerajinan Batu Alam Cangkoak',
    kategori: 'ekonomi',
    alamat: 'Jl. Sentra Industri Batu Alam, Cangkoak',
    kecamatan: 'Dukupuntang',
    desa: 'Cangkoak',
    coords: [108.4328, -6.7602],
    telepon: '-',
    jam: '08:00 - 17:00 WIB'
  },
  {
    nama: 'SMPN 2 Dukupuntang',
    kategori: 'pendidikan',
    alamat: 'Jl. Cangkoak Dukupuntang No. 8, Cangkoak',
    kecamatan: 'Dukupuntang',
    desa: 'Cangkoak',
    coords: [108.4368, -6.7568],
    telepon: '(0231) 882345',
    jam: '07:00 - 14:00 WIB'
  },
  {
    nama: 'Kantor Kuwu Desa Cisaat',
    kategori: 'desa',
    alamat: 'Jl. Cisaat Utama No. 5, Cisaat',
    kecamatan: 'Dukupuntang',
    desa: 'Cisaat',
    coords: [108.4382, -6.7725],
    telepon: '(0231) 882104',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Puskesmas Dukupuntang Rawat Inap',
    kategori: 'kesehatan',
    alamat: 'Jl. Raya Cisaat KM 2, Cisaat',
    kecamatan: 'Dukupuntang',
    desa: 'Cisaat',
    coords: [108.4412, -6.7715],
    telepon: '(0231) 882990',
    jam: '24 Jam'
  },
  {
    nama: 'Pasar Tradisional Cisaat',
    kategori: 'ekonomi',
    alamat: 'Jl. Pasar Cisaat No. 1, Cisaat',
    kecamatan: 'Dukupuntang',
    desa: 'Cisaat',
    coords: [108.4395, -6.7738],
    telepon: '-',
    jam: '05:00 - 15:00 WIB'
  },
  {
    nama: 'Pesantren Terpadu Bina Insan Mulia Cisaat',
    kategori: 'pendidikan',
    alamat: 'Jl. KH. Lukman Hakim, Cisaat',
    kecamatan: 'Dukupuntang',
    desa: 'Cisaat',
    coords: [108.4428, -6.7752],
    telepon: '(0231) 882777',
    jam: '08:00 - 17:00 WIB'
  },

  // === 4. KAWASAN TIMUR (Kecomberan, Sendang, Kemantren, Wanasaba, Sampiran, Sarwadadi, Kubang, Krandon, Pejambon) ===
  {
    nama: 'Kantor Desa Kecomberan',
    kategori: 'desa',
    alamat: 'Jl. Pangeran Cakrabuana No. 88, Kecomberan',
    kecamatan: 'Talun',
    desa: 'Kecomberan',
    coords: [108.5085, -6.7492],
    telepon: '(0231) 883101',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'SMPN 1 Talun',
    kategori: 'pendidikan',
    alamat: 'Jl. Kecomberan No. 14, Kecomberan',
    kecamatan: 'Talun',
    desa: 'Kecomberan',
    coords: [108.5068, -6.7512],
    telepon: '(0231) 883234',
    jam: '07:00 - 14:00 WIB'
  },
  {
    nama: 'Puskesmas Talun',
    kategori: 'kesehatan',
    alamat: 'Jl. Raya Kecomberan Talun No. 2, Kecomberan',
    kecamatan: 'Talun',
    desa: 'Kecomberan',
    coords: [108.5095, -6.7478],
    telepon: '(0231) 883045',
    jam: '24 Jam'
  },
  {
    nama: 'Kantor Kelurahan Sendang',
    kategori: 'desa',
    alamat: 'Jl. Ki Gede Sendang No. 7, Sendang',
    kecamatan: 'Sumber',
    desa: 'Sendang',
    coords: [108.4982, -6.7555],
    telepon: '(0231) 321708',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Sentra Kerajinan Batik Sendang',
    kategori: 'ekonomi',
    alamat: 'Jl. Pesantren Sendang No. 12, Sendang',
    kecamatan: 'Sumber',
    desa: 'Sendang',
    coords: [108.4965, -6.7568],
    telepon: '(0231) 321955',
    jam: '08:30 - 20:00 WIB'
  },
  {
    nama: 'Kantor Kelurahan Kemantren',
    kategori: 'desa',
    alamat: 'Jl. Pangeran Kejaksan No. 50, Kemantren',
    kecamatan: 'Sumber',
    desa: 'Kemantren',
    coords: [108.4942, -6.7588],
    telepon: '(0231) 321709',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Pos Pemadam Kebakaran Sektor Sumber',
    kategori: 'pemerintahan',
    alamat: 'Jl. Kemantren Raya No. 3, Kemantren',
    kecamatan: 'Sumber',
    desa: 'Kemantren',
    coords: [108.4958, -6.7575],
    telepon: '(0231) 321113',
    jam: '24 Jam'
  },
  {
    nama: 'Kantor Desa Wanasaba Lor',
    kategori: 'desa',
    alamat: 'Jl. Wanasaba Lor No. 16, Wanasaba Lor',
    kecamatan: 'Talun',
    desa: 'Wanasaba Lor',
    coords: [108.4985, -6.7635],
    telepon: '(0231) 883102',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Pasar Tradisional Wanasaba',
    kategori: 'ekonomi',
    alamat: 'Jl. Raya Wanasaba, Wanasaba Lor',
    kecamatan: 'Talun',
    desa: 'Wanasaba Lor',
    coords: [108.4971, -6.7648],
    telepon: '-',
    jam: '05:00 - 14:00 WIB'
  },
  {
    nama: 'Kantor Desa Wanasaba Kidul',
    kategori: 'desa',
    alamat: 'Jl. Balai Desa Wanasaba Kidul No. 1, Wanasaba Kidul',
    kecamatan: 'Talun',
    desa: 'Wanasaba Kidul',
    coords: [108.4998, -6.7712],
    telepon: '(0231) 883103',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Kantor Desa Cirebongirang',
    kategori: 'desa',
    alamat: 'Jl. Sunan Gunung Jati No. 3, Cirebongirang',
    kecamatan: 'Talun',
    desa: 'Cirebongirang',
    coords: [108.5112, -6.7628],
    telepon: '(0231) 883104',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Masjid Bersejarah Keramat Cirebongirang',
    kategori: 'ibadah',
    alamat: 'Kompleks Keramat Cirebongirang',
    kecamatan: 'Talun',
    desa: 'Cirebongirang',
    coords: [108.5128, -6.7645],
    telepon: '-',
    jam: 'Buka 24 Jam'
  },
  {
    nama: 'Balai Kuwu Desa Sampiran',
    kategori: 'desa',
    alamat: 'Jl. Raya Gronggong KM 5, Sampiran',
    kecamatan: 'Talun',
    desa: 'Sampiran',
    coords: [108.5175, -6.7745],
    telepon: '(0231) 883105',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Kawasan Wisata Kuliner Bukit Gronggong',
    kategori: 'ekonomi',
    alamat: 'Jl. Raya Cirebon-Kuningan Bukit Gronggong, Sampiran',
    kecamatan: 'Talun',
    desa: 'Sampiran',
    coords: [108.5195, -6.7725],
    telepon: '-',
    jam: '10:00 - 23:00 WIB'
  },
  {
    nama: 'Kantor Desa Krandon',
    kategori: 'desa',
    alamat: 'Jl. Krandon Tengah No. 4, Krandon',
    kecamatan: 'Talun',
    desa: 'Krandon',
    coords: [108.4975, -6.7795],
    telepon: '(0231) 883106',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Balai Kuwu Desa Kubang',
    kategori: 'desa',
    alamat: 'Jl. Desa Kubang No. 12, Kubang',
    kecamatan: 'Talun',
    desa: 'Kubang',
    coords: [108.4962, -6.7925],
    telepon: '(0231) 883107',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Kantor Desa Sarwadadi',
    kategori: 'desa',
    alamat: 'Jl. Sarwadadi Utama No. 8, Sarwadadi',
    kecamatan: 'Talun',
    desa: 'Sarwadadi',
    coords: [108.5088, -6.7895],
    telepon: '(0231) 883108',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Embung Pertanian Sarwadadi',
    kategori: 'pemerintahan',
    alamat: 'Kawasan Embung Irigasi Sarwadadi, Sarwadadi',
    kecamatan: 'Talun',
    desa: 'Sarwadadi',
    coords: [108.5105, -6.7915],
    telepon: '-',
    jam: '06:00 - 18:00 WIB'
  },
  {
    nama: 'Kantor Kelurahan Pejambon',
    kategori: 'desa',
    alamat: 'Jl. Pejambon Raya No. 11, Pejambon',
    kecamatan: 'Sumber',
    desa: 'Pejambon',
    coords: [108.5015, -6.7412],
    telepon: '(0231) 321710',
    jam: '08:00 - 15:30 WIB'
  },

  // === 5. KAWASAN SELATAN (Sindangwangi, Matangaji) ===
  {
    nama: 'Kantor Kuwu Desa Matangaji',
    kategori: 'desa',
    alamat: 'Jl. Panembahan Matangaji No. 1, Matangaji',
    kecamatan: 'Sumber',
    desa: 'Matangaji',
    coords: [108.4552, -6.8045],
    telepon: '(0231) 321711',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Wisata Alam Tebing Batu Lawang',
    kategori: 'ekonomi',
    alamat: 'Perbukitan Matangaji, Matangaji',
    kecamatan: 'Sumber',
    desa: 'Matangaji',
    coords: [108.4525, -6.8078],
    telepon: '-',
    jam: '07:30 - 17:30 WIB'
  },
  {
    nama: 'Bukit Panembahan Matangaji',
    kategori: 'ekonomi',
    alamat: 'Puncak Bukit Matangaji, Matangaji',
    kecamatan: 'Sumber',
    desa: 'Matangaji',
    coords: [108.4578, -6.8062],
    telepon: '-',
    jam: '06:00 - 18:00 WIB'
  },
  {
    nama: 'SDN 1 Matangaji',
    kategori: 'pendidikan',
    alamat: 'Jl. Panembahan No. 18, Matangaji',
    kecamatan: 'Sumber',
    desa: 'Matangaji',
    coords: [108.4565, -6.8028],
    telepon: '-',
    jam: '07:00 - 13:00 WIB'
  },
  {
    nama: 'Puskesmas Pembantu Matangaji',
    kategori: 'kesehatan',
    alamat: 'Jl. Raya Desa Matangaji, Matangaji',
    kecamatan: 'Sumber',
    desa: 'Matangaji',
    coords: [108.4542, -6.8035],
    telepon: '(0231) 321980',
    jam: '08:00 - 14:00 WIB'
  },
  {
    nama: 'Balai Kuwu Desa Sindangwangi',
    kategori: 'desa',
    alamat: 'Jl. Sindangwangi Asri No. 5, Sindangwangi',
    kecamatan: 'Sumber',
    desa: 'Sindangwangi',
    coords: [108.4685, -6.7885],
    telepon: '(0231) 321712',
    jam: '08:00 - 15:30 WIB'
  },
  {
    nama: 'Kawasan Perkebunan Rakyat Sindangwangi',
    kategori: 'ekonomi',
    alamat: 'Blok Perkebunan Sindangwangi, Sindangwangi',
    kecamatan: 'Sumber',
    desa: 'Sindangwangi',
    coords: [108.4628, -6.7925],
    telepon: '-',
    jam: '07:00 - 16:00 WIB'
  },
  {
    nama: 'Pos Pantau Kehutanan & Konservasi Sumber',
    kategori: 'pemerintahan',
    alamat: 'Batas Kawasan Hutan Lindung, Sindangwangi',
    kecamatan: 'Sumber',
    desa: 'Sindangwangi',
    coords: [108.4595, -6.7985],
    telepon: '(0231) 321115',
    jam: '24 Jam'
  },
  {
    nama: 'SDN 1 Sindangwangi',
    kategori: 'pendidikan',
    alamat: 'Jl. Sindangwangi No. 12, Sindangwangi',
    kecamatan: 'Sumber',
    desa: 'Sindangwangi',
    coords: [108.4695, -6.7868],
    telepon: '-',
    jam: '07:00 - 13:00 WIB'
  },
  {
    nama: 'Masjid Jami Al-Muhajirin Sindangwangi',
    kategori: 'ibadah',
    alamat: 'Jl. Sindangwangi Timur, Sindangwangi',
    kecamatan: 'Sumber',
    desa: 'Sindangwangi',
    coords: [108.4712, -6.7892],
    telepon: '-',
    jam: 'Setiap Waktu Sholat'
  }
];

console.log('Total structured POIs to generate:', POI_DEFINITIONS.length);

const poiFeatures = POI_DEFINITIONS.map((p, idx) => {
  const photoSet = PHOTOS[p.kategori] || PHOTOS.pemerintahan;
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: p.coords
    },
    properties: {
      id: idx + 1,
      nama: p.nama,
      kategori: p.kategori,
      alamat: p.alamat,
      kecamatan: p.kecamatan,
      kelurahan: p.desa,
      telepon: p.telepon,
      jam_operasional: p.jam,
      status: 'Aktif Beroperasi',
      foto_gallery: photoSet
    }
  };
});

const poiCollection = {
  type: 'FeatureCollection',
  features: poiFeatures
};

fs.writeFileSync('./src/data/fasilitas-publik.geojson', JSON.stringify(poiCollection, null, 2));
console.log('Successfully saved expanded fasilitas-publik.geojson with ' + poiFeatures.length + ' POIs!');
