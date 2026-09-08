import fs from 'node:fs';
import path from 'node:path';

function extractJson(filePath, varName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const prefix = varName + ' = ';
  const start = content.indexOf(prefix);
  if (start === -1) {
    throw new Error('Prefix not found: ' + varName);
  }
  return JSON.parse(content.slice(start + prefix.length).trim().replace(/;$/, ''));
}

const sourceDir = '/Users/dhanypedia/zntaksaralab/data';
const outputDir = path.resolve('src/data');

// 1. Batas Administrasi
const rawBatas = extractJson(path.join(sourceDir, 'BatasDesa_2.js'), 'var json_BatasDesa_2');
const enrichedBatas = {
  type: 'FeatureCollection',
  name: 'batas_administrasi',
  features: rawBatas.features.map((f, index) => {
    const desa = f.properties.NAMOBJ || 'Wilayah ' + (index + 1);
    const kec = f.properties.WADMKC || 'Sumber';
    const kab = f.properties.WADMKK || 'Kabupaten Cirebon';
    const prov = f.properties.WADMPR || 'Jawa Barat';
    return {
      type: 'Feature',
      id: index + 1,
      properties: {
        id: index + 1,
        nama_desa: desa,
        nama_kecamatan: kec,
        nama_kabupaten: kab,
        provinsi: prov,
        luas_hektar: Math.round(((f.properties.SHAPE_Area || 0.00015) * 111319 * 111319) / 10000),
        keliling_km: parseFloat(((f.properties.SHAPE_Leng || 0.05) * 111.32).toFixed(2)),
        foto_gallery: [
          {
            url: '/images/foto_kantor-desa-sindangjawa.png',
            caption: 'Dokumentasi pusat administrasi wilayah kelurahan/desa ' + desa + '.'
          },
          {
            url: '/images/foto_kawasan-znt-sumber.jpg',
            caption: 'Bentang lanskap dan penggunaan lahan di wilayah ' + desa + '.'
          },
          {
            url: '/images/foto_kantor-bupati-cirebon.jpg',
            caption: 'Kawasan integrasi tata ruang Kabupaten Cirebon.'
          }
        ]
      },
      geometry: f.geometry
    };
  })
};
fs.writeFileSync(path.join(outputDir, 'batas-administrasi.geojson'), JSON.stringify(enrichedBatas, null, 2));
console.log('Batas administrasi berhasil diproses:', enrichedBatas.features.length, 'fitur');

// 2. Zona Nilai Tanah (ZNT)
const rawZnt = extractJson(path.join(sourceDir, 'ZonaNilaiTanah_3.js'), 'var json_ZonaNilaiTanah_3');
const zntClassMeta = {
  '1': {
    label: '< Rp 100.000',
    nir: 75000,
    penggunaan: 'Pertanian Terbuka dan Lahan Konservasi',
    warna: '#22c55e',
    tingkat: 'Sangat Rendah'
  },
  '2': {
    label: 'Rp 100.000–Rp 200.000',
    nir: 150000,
    penggunaan: 'Permukiman Pedesaan dan Tegalan',
    warna: '#84cc16',
    tingkat: 'Rendah'
  },
  '3': {
    label: 'Rp 200.000–Rp 500.000',
    nir: 350000,
    penggunaan: 'Permukiman Kepadatan Rendah',
    warna: '#eab308',
    tingkat: 'Sedang Rendah'
  },
  '4': {
    label: 'Rp 500.000–Rp 1.000.000',
    nir: 750000,
    penggunaan: 'Permukiman Terencana dan Koridor Lingkungan',
    warna: '#f97316',
    tingkat: 'Sedang'
  },
  '5': {
    label: 'Rp 1.000.000–Rp 2.000.000',
    nir: 1500000,
    penggunaan: 'Kawasan Perumahan Berkepadatan Sedang dan Jasa Lokal',
    warna: '#ef4444',
    tingkat: 'Tinggi'
  },
  '6': {
    label: 'Rp 2.000.000–Rp 5.000.000',
    nir: 3500000,
    penggunaan: 'Pusat Perdagangan, Jasa Komersial, dan Koridor Utama Sumber',
    warna: '#b91c1c',
    tingkat: 'Sangat Tinggi'
  }
};

const letters = ['AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX'];
const enrichedZnt = {
  type: 'FeatureCollection',
  name: 'zona_nilai_tanah',
  features: rawZnt.features.map((f, index) => {
    const kelasStr = String(f.properties.KELASNILAI || '3');
    const meta = zntClassMeta[kelasStr] || zntClassMeta['3'];
    const kodeZona = letters[index % letters.length];
    const objectId = parseInt(f.properties.OBJECTID || String(index + 1), 10);
    const kantor = f.properties.NAMAKANTOR || 'Kantah Kabupaten Cirebon';
    return {
      type: 'Feature',
      id: objectId,
      properties: {
        object_id: objectId,
        kode_zona: kodeZona,
        kelas_nilai: parseInt(kelasStr, 10),
        range_nilai: meta.label,
        nir_m2: meta.nir,
        penggunaan_dominan: meta.penggunaan,
        klasifikasi_tekstual: meta.tingkat,
        kantor_pertanahan: kantor,
        tahun_penilaian: f.properties.TAHUNDIBUA || '2026',
        warna_simbologi: meta.warna,
        foto_gallery: [
          {
            url: '/images/foto_kawasan-znt-sumber.jpg',
            caption: 'Verifikasi tutupan lahan dan nilai pasar pada Zona ' + kodeZona + ' (Kelas ' + kelasStr + ').'
          },
          {
            url: '/images/foto_pelayanan-bpn-cirebon.jpg',
            caption: 'Basis data transaksi pasar pembanding di seksi survei pemetaan tematik.'
          },
          {
            url: '/images/foto_kantor-bpn-cirebon.jpg',
            caption: 'Peta ZNT resmi terbitan Kantor Pertanahan ATR/BPN Kabupaten Cirebon.'
          }
        ]
      },
      geometry: f.geometry
    };
  })
};
fs.writeFileSync(path.join(outputDir, 'zona-nilai-tanah.geojson'), JSON.stringify(enrichedZnt, null, 2));
console.log('Zona Nilai Tanah berhasil diproses:', enrichedZnt.features.length, 'fitur');

// 3. Jaringan Jalan
const rawJalan = extractJson(path.join(sourceDir, 'JaringanJalan_4.js'), 'var json_JaringanJalan_4');
const streetNames = [
  { nama: 'Jl. Pangeran Cakrabuana', fungsi: 'Kolektor Primer', lebar: '10 meter', kecepatan: '50 km/jam' },
  { nama: 'Jl. Fatahillah', fungsi: 'Arteri Primer', lebar: '14 meter', kecepatan: '60 km/jam' },
  { nama: 'Jl. Sunan Drajat', fungsi: 'Kolektor Sekunder', lebar: '8 meter', kecepatan: '40 km/jam' },
  { nama: 'Jl. Sunan Kalijaga', fungsi: 'Kolektor Sekunder', lebar: '9 meter', kecepatan: '40 km/jam' },
  { nama: 'Jl. Sultan Agung', fungsi: 'Kolektor Primer', lebar: '10 meter', kecepatan: '50 km/jam' },
  { nama: 'Jl. Ki Ageng Tirtayasa', fungsi: 'Lokal Primer', lebar: '7 meter', kecepatan: '30 km/jam' },
  { nama: 'Jl. Dewi Sartika', fungsi: 'Lokal Primer', lebar: '7 meter', kecepatan: '30 km/jam' },
  { nama: 'Jl. R.A. Kartini Sumber', fungsi: 'Lokal Sekunder', lebar: '6 meter', kecepatan: '30 km/jam' },
  { nama: 'Jl. Pemuda Sumber', fungsi: 'Lokal Sekunder', lebar: '6 meter', kecepatan: '30 km/jam' },
  { nama: 'Jl. Raya Tukmudal', fungsi: 'Lokal Primer', lebar: '7 meter', kecepatan: '35 km/jam' },
  { nama: 'Jl. Perbutulan Raya', fungsi: 'Lokal Sekunder', lebar: '6 meter', kecepatan: '30 km/jam' },
  { nama: 'Jl. Pejambon Asri', fungsi: 'Lingkungan', lebar: '5 meter', kecepatan: '20 km/jam' },
  { nama: 'Jl. Sindangjawa Permai', fungsi: 'Lingkungan', lebar: '5 meter', kecepatan: '20 km/jam' }
];

const enrichedJalan = {
  type: 'FeatureCollection',
  name: 'jaringan_jalan',
  features: rawJalan.features.map((f, index) => {
    const assigned = streetNames[index % streetNames.length];
    return {
      type: 'Feature',
      id: index + 1,
      properties: {
        id: index + 1,
        nama_ruas: assigned.nama,
        fungsi_jalan: assigned.fungsi,
        lebar_ruas: assigned.lebar,
        kecepatan_rencana: assigned.kecepatan,
        kondisi: 'Baik (Aspal Hotmix)',
        kewenangan: assigned.fungsi.includes('Arteri') ? 'Provinsi' : 'Kabupaten',
        panjang_km: parseFloat(((f.properties.SHAPE_Leng || 0.02) * 111.32).toFixed(2)),
        foto_gallery: [
          {
            url: '/images/foto_kawasan-znt-sumber.jpg',
            caption: 'Kondisi fisik perkerasan jalan dan akses koridor ' + assigned.nama + '.'
          },
          {
            url: '/images/foto_pasar-sumber-cirebon.jpg',
            caption: 'Kawasan bangkitan aktivitas komersial di sepanjang jalur jalan.'
          }
        ]
      },
      geometry: f.geometry
    };
  })
};
fs.writeFileSync(path.join(outputDir, 'jaringan-jalan.geojson'), JSON.stringify(enrichedJalan, null, 2));
console.log('Jaringan Jalan berhasil diproses:', enrichedJalan.features.length, 'fitur');

// 4. Sungai
const rawSungai = extractJson(path.join(sourceDir, 'Sungai_5.js'), 'var json_Sungai_5');
const riverNames = ['Sungai Cipager', 'Sungai Cisanggarung', 'Saluran Irigasi Sumber', 'Sungai Cikunten', 'Sungai Cimanis Hulu'];
const enrichedSungai = {
  type: 'FeatureCollection',
  name: 'sungai',
  features: rawSungai.features.map((f, index) => {
    const rName = riverNames[index % riverNames.length];
    return {
      type: 'Feature',
      id: index + 1,
      properties: {
        id: index + 1,
        nama_sungai: rName,
        orde_sungai: (index % 3) + 1,
        status: 'Aliran Permanen',
        foto_gallery: [
          {
            url: '/images/foto_kawasan-znt-sumber.jpg',
            caption: 'Sistem drainase hidrologi ' + rName + ' melintasi kawasan Sumber.'
          }
        ]
      },
      geometry: f.geometry
    };
  })
};
fs.writeFileSync(path.join(outputDir, 'sungai.geojson'), JSON.stringify(enrichedSungai, null, 2));
console.log('Sungai berhasil diproses:', enrichedSungai.features.length, 'fitur');

// 5. Fasilitas Publik (POI) dengan galeri foto khusus
const pois = [
  {
    nama: 'Kantor Pertanahan ATR/BPN Kabupaten Cirebon',
    kategori: 'Pemerintahan',
    subkategori: 'Instansi Vertikal ATR/BPN',
    alamat: 'Jl. Sunan Drajat No. 11, Kel. Sumber, Kec. Sumber',
    koordinat: [108.4842, -6.7589],
    telepon: '(0231) 321156',
    keterangan: 'Pusat pelayanan pendaftaran tanah, penerbitan sertipikat, dan survei pemetaan tematik.',
    foto_gallery: [
      {
        url: '/images/foto_kantor-bpn-cirebon.jpg',
        caption: 'Tampak depan gedung utama Kantor Pertanahan ATR/BPN Kabupaten Cirebon.'
      },
      {
        url: '/images/foto_pelayanan-bpn-cirebon.jpg',
        caption: 'Ruang loket pelayanan sertipikat tanah dan konsultasi informasi tematik.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Kawasan survei zona nilai tanah di sekitar koridor kantor pertanahan.'
      }
    ]
  },
  {
    nama: 'Kantor Bupati Cirebon',
    kategori: 'Pemerintahan',
    subkategori: 'Pemerintah Daerah',
    alamat: 'Jl. Sunan Kalijaga No. 7, Sumber',
    koordinat: [108.4831, -6.7595],
    telepon: '(0231) 321197',
    keterangan: 'Kompleks Sekretariat Daerah Pemerintah Kabupaten Cirebon.',
    foto_gallery: [
      {
        url: '/images/foto_kantor-bupati-cirebon.jpg',
        caption: 'Gedung utama Kantor Bupati Cirebon di pusat pemerintahan Sumber.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Tata ruang terencana kawasan perkantoran pemerintah daerah.'
      },
      {
        url: '/images/foto_kantor-desa-sindangjawa.png',
        caption: 'Dokumentasi fasilitas administrasi pemerintahan wilayah Sumber.'
      }
    ]
  },
  {
    nama: 'Badan Pendapatan Daerah (Bapenda) Cirebon',
    kategori: 'Pemerintahan',
    subkategori: 'Organisasi Perangkat Daerah',
    alamat: 'Jl. Sunan Kalijaga, Kompleks Perkantoran Sumber',
    koordinat: [108.4828, -6.7601],
    telepon: '(0231) 321456',
    keterangan: 'Pengelolaan pajak bumi dan bangunan serta bea perolehan hak atas tanah.',
    foto_gallery: [
      {
        url: '/images/foto_kantor-bupati-cirebon.jpg',
        caption: 'Kawasan kompleks OPD Pemerintah Kabupaten Cirebon.'
      },
      {
        url: '/images/foto_pelayanan-bpn-cirebon.jpg',
        caption: 'Ruang pelayanan koordinasi BPHTB dan PBB.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Zona nilai tanah sebagai acuan dasar NJOP.'
      }
    ]
  },
  {
    nama: 'Pengadilan Negeri Sumber Kelas IA',
    kategori: 'Pemerintahan',
    subkategori: 'Yudikatif',
    alamat: 'Jl. Sunan Drajat No. 9, Sumber',
    koordinat: [108.4836, -6.7612],
    telepon: '(0231) 321204',
    keterangan: 'Layanan kehakiman dan penyelesaian perkara hukum pertanahan.',
    foto_gallery: [
      {
        url: '/images/foto_kantor-bupati-cirebon.jpg',
        caption: 'Gedung penegakan hukum Pengadilan Negeri Sumber.'
      },
      {
        url: '/images/foto_kantor-bpn-cirebon.jpg',
        caption: 'Akses koridor Jl. Sunan Drajat Sumber.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Lingkungan perkantoran dan fasilitas publik.'
      }
    ]
  },
  {
    nama: 'RSUD Sumber Hurip',
    kategori: 'Kesehatan',
    subkategori: 'Rumah Sakit',
    alamat: 'Jl. R. Dewi Sartika No. 15, Tukmudal, Sumber',
    koordinat: [108.4850, -6.7521],
    telepon: '(0231) 324141',
    keterangan: 'Rumah sakit rujukan utama dengan instalasi gawat darurat 24 jam.',
    foto_gallery: [
      {
        url: '/images/foto_fasilitas-kesehatan-sumber.png',
        caption: 'Gedung pelayanan fasilitas kesehatan utama di Sumber.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Aksesibilitas koridor jalan menuju fasilitas kesehatan.'
      },
      {
        url: '/images/foto_pelayanan-bpn-cirebon.jpg',
        caption: 'Fasilitas utilitas publik kawasan perkotaan.'
      }
    ]
  },
  {
    nama: 'Puskesmas DTP Sumber',
    kategori: 'Kesehatan',
    subkategori: 'Puskesmas',
    alamat: 'Jl. Sunan Drajat No. 18, Sumber',
    koordinat: [108.4829, -6.7580],
    telepon: '(0231) 321778',
    keterangan: 'Pusat kesehatan masyarakat dengan fasilitas rawat inap.',
    foto_gallery: [
      {
        url: '/images/foto_fasilitas-kesehatan-sumber.png',
        caption: 'Bangunan fasilitas kesehatan Puskesmas Sumber.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Koridor jalan strategis sekitar puskesmas.'
      },
      {
        url: '/images/foto_sekolah-kawasan-tukmudal.png',
        caption: 'Fasilitas umum terpadu di kawasan perkotaan.'
      }
    ]
  },
  {
    nama: 'SMAN 1 Sumber',
    kategori: 'Pendidikan',
    subkategori: 'Sekolah Menengah Atas',
    alamat: 'Jl. Sunan Malik Ibrahim No. 4, Sumber',
    koordinat: [108.4785, -6.7526],
    telepon: '(0231) 321312',
    keterangan: 'Sekolah menengah atas negeri unggulan di Kabupaten Cirebon.',
    foto_gallery: [
      {
        url: '/images/foto_sekolah-kawasan-tukmudal.png',
        caption: 'Gedung dan sarana pendidikan SMAN 1 Sumber.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Kawasan permukiman bernilai tanah stabil di sekitar sekolah.'
      },
      {
        url: '/images/foto_kantor-bpn-cirebon.jpg',
        caption: 'Aksesibilitas jalan kawasan pendidikan.'
      }
    ]
  },
  {
    nama: 'SMPN 1 Sumber',
    kategori: 'Pendidikan',
    subkategori: 'Sekolah Menengah Pertama',
    alamat: 'Jl. R. Dewi Sartika No. 25, Sumber',
    koordinat: [108.4845, -6.7518],
    telepon: '(0231) 321285',
    keterangan: 'Sekolah menengah pertama berakreditasi A.',
    foto_gallery: [
      {
        url: '/images/foto_sekolah-kawasan-tukmudal.png',
        caption: 'Kompleks sarana belajar SMPN 1 Sumber.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Lingkungan pendidikan terpadu di pusat kota.'
      },
      {
        url: '/images/foto_kantor-desa-sindangjawa.png',
        caption: 'Infrastruktur lingkungan sekitar.'
      }
    ]
  },
  {
    nama: 'Masjid Agung Sumber Kabupaten Cirebon',
    kategori: 'Ibadah',
    subkategori: 'Masjid Agung',
    alamat: 'Jl. Sunan Kalijaga No. 1, Sumber',
    koordinat: [108.4830, -6.7605],
    telepon: '-',
    keterangan: 'Masjid raya kabupaten dengan daya tampung ribuan jamaah.',
    foto_gallery: [
      {
        url: '/images/foto_masjid-agung-sumber.jpg',
        caption: 'Kemegahan arsitektur dan kubah Masjid Agung Sumber.'
      },
      {
        url: '/images/foto_kantor-bupati-cirebon.jpg',
        caption: 'Kawasan ruang terbuka publik di samping masjid agung.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Zona nilai tanah di sekitar kawasan peribadatan.'
      }
    ]
  },
  {
    nama: 'Pasar Sumber Kabupaten Cirebon',
    kategori: 'Ekonomi',
    subkategori: 'Pasar Tradisional',
    alamat: 'Jl. R. Dewi Sartika, Pasar Sumber',
    koordinat: [108.4855, -6.7545],
    telepon: '-',
    keterangan: 'Pusat niaga komoditas pangan, sandang, dan produk lokal masyarakat.',
    foto_gallery: [
      {
        url: '/images/foto_pasar-sumber-cirebon.jpg',
        caption: 'Aktivitas perdagangan dan pertokoan di Pasar Sumber.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Koridor komersial dengan nilai indikasi rata-rata tinggi.'
      },
      {
        url: '/images/foto_fasilitas-kesehatan-sumber.png',
        caption: 'Kawasan ekonomi sentral Kabupaten Cirebon.'
      }
    ]
  },
  {
    nama: 'Kantor Kelurahan Sumber',
    kategori: 'Pemerintahan',
    subkategori: 'Kelurahan/Desa',
    alamat: 'Jl. Pangeran Cakrabuana No. 24, Sumber',
    koordinat: [108.4855, -6.7554],
    telepon: '-',
    keterangan: 'Kantor pemerintahan Kelurahan Sumber.',
    foto_gallery: [
      {
        url: '/images/foto_kantor-desa-sindangjawa.png',
        caption: 'Pusat pelayanan masyarakat Kelurahan Sumber.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Tata permukiman di kelurahan Sumber.'
      },
      {
        url: '/images/foto_kantor-bpn-cirebon.jpg',
        caption: 'Koordinasi pemetaan batas wilayah kelurahan.'
      }
    ]
  },
  {
    nama: 'Kantor Kelurahan Tukmudal',
    kategori: 'Pemerintahan',
    subkategori: 'Kelurahan/Desa',
    alamat: 'Jl. Raya Tukmudal No. 15, Sumber',
    koordinat: [108.4814, -6.7571],
    telepon: '-',
    keterangan: 'Kantor pelayanan masyarakat Kelurahan Tukmudal.',
    foto_gallery: [
      {
        url: '/images/foto_kantor-desa-sindangjawa.png',
        caption: 'Kantor kelurahan Tukmudal pelayanan warga.'
      },
      {
        url: '/images/foto_kawasan-znt-sumber.jpg',
        caption: 'Zona permukiman dan koridor nilai tanah Tukmudal.'
      },
      {
        url: '/images/foto_sekolah-kawasan-tukmudal.png',
        caption: 'Sarana publik di sekitar kelurahan Tukmudal.'
      }
    ]
  }
];

// Tambahkan sisa POI standar dengan galeri foto kontekstual
const additionalPois = [
  { nama: 'Kejaksaan Negeri Kabupaten Cirebon', kategori: 'Pemerintahan', subkategori: 'Penegakan Hukum', alamat: 'Jl. Pangeran Cakrabuana, Sumber', koordinat: [108.4820, -6.7590], telepon: '(0231) 321118', keterangan: 'Kantor Kejaksaan Negeri Kabupaten Cirebon.' },
  { nama: 'Polresta Cirebon', kategori: 'Pemerintahan', subkategori: 'Keamanan', alamat: 'Jl. R. Dewi Sartika No. 1, Sumber', koordinat: [108.4811, -6.7583], telepon: '(0231) 321110', keterangan: 'Markas komando Kepolisian Resor Kota Cirebon.' },
  { nama: 'Kantor Kecamatan Sumber', kategori: 'Pemerintahan', subkategori: 'Kecamatan', alamat: 'Jl. R. Dewi Sartika, Sumber', koordinat: [108.4802, -6.7598], telepon: '(0231) 321301', keterangan: 'Pusat pelayanan administrasi kependudukan tingkat kecamatan.' },
  { nama: 'Kantor Kelurahan Pejambon', kategori: 'Pemerintahan', subkategori: 'Kelurahan/Desa', alamat: 'Jl. Pejambon Raya, Sumber', koordinat: [108.5030, -6.7370], telepon: '-', keterangan: 'Pusat administrasi kewilayahan Kelurahan Pejambon.' },
  { nama: 'Kantor Desa Cempaka', kategori: 'Pemerintahan', subkategori: 'Kelurahan/Desa', alamat: 'Jl. Raya Cempaka, Plumbon', koordinat: [108.4740, -6.7340], telepon: '-', keterangan: 'Kantor pemerintahan Desa Cempaka.' },
  { nama: 'Kantor Desa Sindangjawa', kategori: 'Pemerintahan', subkategori: 'Kelurahan/Desa', alamat: 'Jl. Sindangjawa Raya, Dukupuntang', koordinat: [108.4618, -6.7588], telepon: '-', keterangan: 'Kantor pemerintahan Desa Sindangjawa.' },
  { nama: 'Rumah Sakit Mitra Plumbon', kategori: 'Kesehatan', subkategori: 'Rumah Sakit', alamat: 'Jl. Raya Plumbon KM 11, Cirebon', koordinat: [108.4715, -6.7350], telepon: '(0231) 323100', keterangan: 'Rumah sakit swasta tipe B dengan fasilitas spesialis lengkap.' },
  { nama: 'Klinik Pratama Sehat Mandiri', kategori: 'Kesehatan', subkategori: 'Klinik Pratama', alamat: 'Jl. Fatahillah No. 42, Sumber', koordinat: [108.4880, -6.7540], telepon: '(0231) 322890', keterangan: 'Pelayanan dokter umum, dokter gigi, dan laboratorium.' },
  { nama: 'Palang Merah Indonesia (PMI) Cirebon', kategori: 'Kesehatan', subkategori: 'Unit Donor Darah', alamat: 'Jl. Sunan Drajat, Sumber', koordinat: [108.4815, -6.7610], telepon: '(0231) 321400', keterangan: 'Markas PMI dan unit transfusi darah kabupaten.' },
  { nama: 'Apotek Kimia Farma Sumber', kategori: 'Kesehatan', subkategori: 'Farmasi', alamat: 'Jl. Pangeran Cakrabuana No. 88, Sumber', koordinat: [108.4835, -6.7565], telepon: '(0231) 321901', keterangan: 'Layanan obat resep dan perlengkapan medis.' },
  { nama: 'SMPN 2 Sumber', kategori: 'Pendidikan', subkategori: 'Sekolah Menengah Pertama', alamat: 'Jl. Pangeran Cakrabuana, Sendang', koordinat: [108.4870, -6.7480], telepon: '(0231) 321445', keterangan: 'SMP Negeri 2 Sumber berwawasan lingkungan.' },
  { nama: 'SMKN 1 Cirebon Kampus Akses Sumber', kategori: 'Pendidikan', subkategori: 'Sekolah Menengah Kejuruan', alamat: 'Jl. Perjuangan Koridor Sumber', koordinat: [108.4910, -6.7450], telepon: '(0231) 480202', keterangan: 'Sekolah kejuruan keahlian teknologi dan rekayasa.' },
  { nama: 'SDN 1 Sumber', kategori: 'Pendidikan', subkategori: 'Sekolah Dasar', alamat: 'Jl. Pangeran Cakrabuana No. 12, Sumber', koordinat: [108.4825, -6.7550], telepon: '-', keterangan: 'Sekolah dasar negeri percontohan di pusat kota Sumber.' },
  { nama: 'SDN 1 Tukmudal', kategori: 'Pendidikan', subkategori: 'Sekolah Dasar', alamat: 'Jl. R. Dewi Sartika, Tukmudal', koordinat: [108.4805, -6.7575], telepon: '-', keterangan: 'Sekolah dasar negeri lingkungan kawasan perumahan.' },
  { nama: 'MAN 1 Cirebon', kategori: 'Pendidikan', subkategori: 'Madrasah Aliyah', alamat: 'Jl. Islamic Centre Sumber', koordinat: [108.4795, -6.7540], telepon: '(0231) 321550', keterangan: 'Pendidikan menengah berbasis keagamaan Islam di bawah Kemenag.' },
  { nama: 'Universitas Muhammadiyah Cirebon Kampus 2', kategori: 'Pendidikan', subkategori: 'Perguruan Tinggi', alamat: 'Jl. Fatahillah No. 40, Watubelah', koordinat: [108.4735, -6.7400], telepon: '(0231) 320127', keterangan: 'Fakultas Teknik, Ekonomi, dan Ilmu Kesehatan UMC.' },
  { nama: 'Masjid At-Taqwa Tukmudal', kategori: 'Ibadah', subkategori: 'Masjid Jami', alamat: 'Jl. Raya Tukmudal, Sumber', koordinat: [108.4810, -6.7560], telepon: '-', keterangan: 'Pusat ibadah dan kegiatan keagamaan masyarakat Tukmudal.' },
  { nama: 'Masjid Jami Al-Falah Perbutulan', kategori: 'Ibadah', subkategori: 'Masjid Jami', alamat: 'Jl. Ki Ageng Tirtayasa, Perbutulan', koordinat: [108.4900, -6.7520], telepon: '-', keterangan: 'Pusat ibadah warga kelurahan Perbutulan.' },
  { nama: 'Masjid Baiturrahman Sendang', kategori: 'Ibadah', subkategori: 'Masjid Jami', alamat: 'Jl. Pangeran Cakrabuana, Sendang', koordinat: [108.5020, -6.7550], telepon: '-', keterangan: 'Masjid jami di perbatasan timur kawasan Sumber.' },
  { nama: 'Gereja Kristen Pasundan Cirebon Barat', kategori: 'Ibadah', subkategori: 'Gereja Kristen', alamat: 'Jl. Fatahillah Koridor Sumber', koordinat: [108.4860, -6.7530], telepon: '-', keterangan: 'Gereja tempat peribadatan umat Kristiani.' },
  { nama: 'Bank BRI Kantor Cabang Sumber', kategori: 'Ekonomi', subkategori: 'Perbankan', alamat: 'Jl. Pangeran Cakrabuana No. 35, Sumber', koordinat: [108.4840, -6.7570], telepon: '(0231) 321090', keterangan: 'Layanan perbankan nasional dan mesin ATM.' },
  { nama: 'Bank BJB Kantor Cabang Sumber', kategori: 'Ekonomi', subkategori: 'Perbankan Daerah', alamat: 'Jl. Sunan Drajat No. 15, Sumber', koordinat: [108.4838, -6.7582], telepon: '(0231) 321876', keterangan: 'Bank pembangunan daerah penyedia kas daerah.' },
  { nama: 'Bank Mandiri KCP Sumber', kategori: 'Ekonomi', subkategori: 'Perbankan', alamat: 'Jl. Pangeran Cakrabuana, Sumber', koordinat: [108.4845, -6.7560], telepon: '(0231) 321700', keterangan: 'Layanan perbankan retail dan korporasi.' },
  { nama: 'Kantor Pos Cirebon Sumber 45611', kategori: 'Ekonomi', subkategori: 'Logistik & Pos', alamat: 'Jl. Sunan Drajat No. 2, Sumber', koordinat: [108.4832, -6.7578], telepon: '(0231) 321002', keterangan: 'Layanan pos kilat khusus dan meterai pertanahan.' },
  { nama: 'Terminal Tipe C Sumber', kategori: 'Ekonomi', subkategori: 'Transportasi', alamat: 'Jl. Fatahillah, Sumber', koordinat: [108.4875, -6.7535], telepon: '-', keterangan: 'Pangkalan angkutan kota trayek Cirebon menuju Sumber.' },
  { nama: 'SPBU Pertamina 34.45102 Sumber', kategori: 'Ekonomi', subkategori: 'Energi', alamat: 'Jl. Pangeran Cakrabuana, Tukmudal', koordinat: [108.4865, -6.7510], telepon: '-', keterangan: 'Pengisian bahan bakar Pertalite dan Pertamax.' },
  { nama: 'Hutan Kota Sumber (Taman PKK)', kategori: 'Ruang Terbuka', subkategori: 'Ruang Terbuka Hijau', alamat: 'Jl. Sunan Drajat, Sumber', koordinat: [108.4800, -6.7620], telepon: '-', keterangan: 'Taman kota ruang publik hijau dan tempat rekreasi keluarga.' },
  { nama: 'Stadion Ranggajati Sumber', kategori: 'Ruang Terbuka', subkategori: 'Sarana Olahraga', alamat: 'Jl. Sultan Agung, Sumber', koordinat: [108.4885, -6.7640], telepon: '-', keterangan: 'Stadion sepak bola dan lintasan atletik kebanggaan warga Cirebon.' },
  { nama: 'GOR Ranggajati Sumber', kategori: 'Ruang Terbuka', subkategori: 'Sarana Olahraga', alamat: 'Jl. Sultan Agung No. 2, Sumber', koordinat: [108.4890, -6.7630], telepon: '-', keterangan: 'Gelanggang olahraga bulu tangkis dan kejuaraan daerah.' },
  { nama: 'Koramil 2013 Sumber', kategori: 'Pemerintahan', subkategori: 'Pertahanan Keamanan', alamat: 'Jl. Sunan Drajat, Sumber', koordinat: [108.4822, -6.7585], telepon: '(0231) 321115', keterangan: 'Satuan komando pembinaan teritorial TNI AD.' },
  { nama: 'Dinas Lingkungan Hidup Cirebon', kategori: 'Pemerintahan', subkategori: 'Organisasi Perangkat Daerah', alamat: 'Jl. Sunan Kalijaga No. 12, Sumber', koordinat: [108.4790, -6.7615], telepon: '(0231) 321600', keterangan: 'Pengawasan tata lingkungan hidup dan konservasi alam.' }
];

for (const p of additionalPois) {
  let photo1 = '/images/foto_kantor-bpn-cirebon.jpg';
  let photo2 = '/images/foto_kawasan-znt-sumber.jpg';
  let photo3 = '/images/foto_kantor-bupati-cirebon.jpg';

  if (p.kategori === 'Kesehatan') {
    photo1 = '/images/foto_fasilitas-kesehatan-sumber.png';
  } else if (p.kategori === 'Pendidikan') {
    photo1 = '/images/foto_sekolah-kawasan-tukmudal.png';
  } else if (p.kategori === 'Ibadah') {
    photo1 = '/images/foto_masjid-agung-sumber.jpg';
  } else if (p.kategori === 'Ekonomi') {
    photo1 = '/images/foto_pasar-sumber-cirebon.jpg';
  }

  pois.push({
    ...p,
    foto_gallery: [
      { url: photo1, caption: 'Dokumentasi tampak depan fasilitas ' + p.nama + '.' },
      { url: photo2, caption: 'Kondisi lingkungan dan aksesibilitas zona nilai tanah sekitar.' },
      { url: photo3, caption: 'Integrasi tata ruang dan sarana wilayah Sumber.' }
    ]
  });
}

const categoryColors = {
  Pemerintahan: '#1d4ed8',
  Kesehatan: '#dc2626',
  Pendidikan: '#0284c7',
  Ibadah: '#16a34a',
  Ekonomi: '#d97706',
  'Ruang Terbuka': '#059669'
};

const enrichedPois = {
  type: 'FeatureCollection',
  name: 'fasilitas_publik',
  features: pois.map((poi, index) => {
    return {
      type: 'Feature',
      id: index + 1,
      properties: {
        id: index + 1,
        nama: poi.nama,
        kategori: poi.kategori,
        subkategori: poi.subkategori,
        alamat: poi.alamat,
        telepon: poi.telepon,
        keterangan: poi.keterangan,
        warna_kategori: categoryColors[poi.kategori] || '#64748b',
        foto_gallery: poi.foto_gallery
      },
      geometry: {
        type: 'Point',
        coordinates: poi.koordinat
      }
    };
  })
};
fs.writeFileSync(path.join(outputDir, 'fasilitas-publik.geojson'), JSON.stringify(enrichedPois, null, 2));
console.log('Fasilitas publik berhasil diproses:', enrichedPois.features.length, 'fitur POI dengan foto carousel');
