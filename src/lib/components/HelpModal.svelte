<script lang="ts">
  let {
    isOpen = false,
    onClose
  }: {
    isOpen: boolean;
    onClose: () => void;
  } = $props();

  const TECH_STACK = [
    {
      name: 'Svelte 5',
      color: '#ff3e00',
      bg: 'rgba(255, 62, 0, 0.08)',
      border: 'rgba(255, 62, 0, 0.25)',
      path: 'M10.354 21.125a4.44 4.44 0 0 1-4.765-1.767 4.109 4.109 0 0 1-.703-3.107 3.898 3.898 0 0 1 .134-.522l.105-.321.287.21a7.21 7.21 0 0 0 2.186 1.092l.208.063-.02.208a1.253 1.253 0 0 0 .226.83 1.337 1.337 0 0 0 1.435.533 1.231 1.231 0 0 0 .343-.15l5.59-3.562a1.164 1.164 0 0 0 .524-.778 1.242 1.242 0 0 0-.211-.937 1.338 1.338 0 0 0-1.435-.533 1.23 1.23 0 0 0-.343.15l-2.133 1.36a4.078 4.078 0 0 1-1.135.499 4.44 4.44 0 0 1-4.765-1.766 4.108 4.108 0 0 1-.702-3.108 3.855 3.855 0 0 1 1.742-2.582l5.589-3.563a4.072 4.072 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.109 4.109 0 0 1 .703 3.107 3.943 3.943 0 0 1-.134.522l-.105.321-.286-.21a7.204 7.204 0 0 0-2.187-1.093l-.208-.063.02-.207a1.255 1.255 0 0 0-.226-.831 1.337 1.337 0 0 0-1.435-.532 1.231 1.231 0 0 0-.343.15L8.62 9.368a1.162 1.162 0 0 0-.524.778 1.24 1.24 0 0 0 .211.937 1.338 1.338 0 0 0 1.435.533 1.235 1.235 0 0 0 .344-.151l2.132-1.36a4.067 4.067 0 0 1 1.135-.498 4.44 4.44 0 0 1 4.765 1.766 4.108 4.108 0 0 1 .702 3.108 3.857 3.857 0 0 1-1.742 2.583l-5.589 3.562a4.072 4.072 0 0 1-1.135.499m10.358-17.95C18.484-.015 14.082-.96 10.9 1.068L5.31 4.63a6.412 6.412 0 0 0-2.896 4.295 6.753 6.753 0 0 0 .666 4.336 6.43 6.43 0 0 0-.96 2.396 6.833 6.833 0 0 0 1.168 5.167c2.229 3.19 6.63 4.135 9.812 2.108l5.59-3.562a6.41 6.41 0 0 0 2.896-4.295 6.756 6.756 0 0 0-.665-4.336 6.429 6.429 0 0 0 .958-2.396 6.831 6.831 0 0 0-1.167-5.168Z'
    },
    {
      name: 'TypeScript',
      color: '#3178c6',
      bg: 'rgba(49, 120, 198, 0.08)',
      border: 'rgba(49, 120, 198, 0.25)',
      path: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z'
    },
    {
      name: 'MapLibre GL',
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.08)',
      border: 'rgba(2, 132, 199, 0.25)',
      path: 'M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm0 3.19c2.937 0 5.371 2.265 5.371 5.035 0 4.111-4.364 7.635-5.035 8.138-.084 0-.084.084-.084.084-.084.084-.168.084-.168.084s-.168 0-.168-.084l-.084-.084c-.84-.503-5.203-3.943-5.203-8.138 0-2.77 2.434-5.036 5.371-5.036zm0 2.601c-1.427 0-2.602 1.173-2.602 2.684 0 1.51 1.175 2.685 2.602 2.685 1.427 0 2.602-1.175 2.602-2.685S13.427 5.79 12 5.79zM8.979 17.287h6.042a.66.66 0 0 1 .67.672v2.014a.66.66 0 0 1-.67.67H8.98a.66.66 0 0 1-.67-.67v-2.014a.66.66 0 0 1 .67-.672zm.755 1.258v.924h4.448v-.924H9.734z'
    },
    {
      name: 'Vite',
      color: '#646cff',
      bg: 'rgba(100, 108, 255, 0.08)',
      border: 'rgba(100, 108, 255, 0.25)',
      path: 'M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z'
    },
    {
      name: 'Vitest',
      color: '#729b1b',
      bg: 'rgba(114, 155, 27, 0.08)',
      border: 'rgba(114, 155, 27, 0.25)',
      path: 'M11.545 23.3a.613.613 0 0 1-.895.197L.252 15.936A.61.61 0 0 1 0 15.439V6.325c0-.502.569-.792.975-.497l6.358 4.624c.594.433 1.432.25 1.793-.39L14.393.7a.62.62 0 0 1 .535-.314h8.455a.613.613 0 0 1 .537.916z'
    },
    {
      name: 'Cloudflare Pages',
      color: '#f38020',
      bg: 'rgba(243, 128, 32, 0.08)',
      border: 'rgba(243, 128, 32, 0.25)',
      path: 'M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727'
    },
    {
      name: 'OpenStreetMap',
      color: '#7ebc6f',
      bg: 'rgba(126, 188, 111, 0.08)',
      border: 'rgba(126, 188, 111, 0.25)',
      path: 'M2.672 23.969c-.352-.089-.534-.234-1.471-1.168C.085 21.688.014 21.579.018 20.999c0-.645-.196-.414 3.368-3.986 3.6-3.608 3.415-3.451 4.064-3.449.302 0 .378.016.62.14l.277.14 1.744-1.744-.218-.343c-.425-.662-.825-1.629-1.006-2.429a7.657 7.657 0 0 1 1.479-6.44c2.49-3.12 6.959-3.812 10.26-1.588 1.812 1.218 2.99 3.099 3.328 5.314.07.467.07 1.579 0 2.074a7.554 7.554 0 0 1-2.205 4.402 6.712 6.712 0 0 1-1.943 1.401c-.959.483-1.775.71-2.881.803-1.573.131-3.32-.305-4.656-1.163l-.343-.218-1.744 1.744.14.28c.125.241.14.316.14.617.003.651.156.467-3.426 4.049-2.761 2.756-3.186 3.164-3.398 3.261-.271.125-.69.171-.945.106zM17.485 13.95a6.425 6.425 0 0 0 4.603-3.51c1.391-2.899.455-6.306-2.227-8.108-.638-.43-1.529-.794-2.367-.962-.581-.117-1.809-.104-2.414.025a6.593 6.593 0 0 0-2.452 1.064c-.444.315-1.177 1.048-1.487 1.487a6.384 6.384 0 0 0 .38 7.907 6.406 6.406 0 0 0 3.901 2.136c.509.078 1.542.058 2.065-.037zm-3.738 7.376a80.97 80.97 0 0 1-2.196-.651c-.025-.028 1.207-4.396 1.257-4.449.023-.026 4.242 1.152 4.414 1.236.062.026-.003.288-.525 2.102a398.513 398.513 0 0 0-.635 2.236c-.025.087-.069.156-.097.156-.028-.003-1.028-.287-2.219-.631zm2.912.524c0-.053 1.227-4.333 1.246-4.347.047-.034 4.324-1.23 4.341-1.211.019.019-1.199 4.337-1.23 4.36-.02.019-4.126 1.191-4.259 1.218-.054.011-.098 0-.098-.019zm-7.105-1.911c.846-.852 1.599-1.627 1.674-1.728.171-.218.405-.732.472-1.015.026-.118.053-.352.058-.522l.011-.307.182-.051c.103-.028.193-.044.202-.034.023.025-1.207 4.321-1.246 4.36-.02.016-.677.213-1.464.436l-1.425.405 1.537-1.542zm8.289-3.06a1.371 1.371 0 0 1-.059-.187l-.044-.156.156-.028c1.339-.227 2.776-.856 3.908-1.713.16-.125.252-.171.265-.134.054.165.272.95.265.959-.034.034-4.48 1.282-4.492 1.261zm-15.083-1.3c-.05-.039-1.179-3.866-1.264-4.29-.016-.084.146-.044 2.174.536 2.121.604 2.192.629 2.222.74.028.098.011.129-.125.223-.084.059-.769.724-1.523 1.479a63.877 63.877 0 0 1-1.39 1.367c-.016 0-.056-.025-.093-.054zm.821-4.378c-1.188-.343-2.164-.623-2.167-.626-.016-.012 1.261-4.433 1.285-4.46.022-.022 4.422 1.211 4.469 1.252.009.009-.269 1.017-.618 2.239-.576 2.02-.643 2.224-.723 2.22-.05-.003-1.059-.285-2.247-.626zm2.959.538c.012-.031.212-.723.444-1.534l.42-1.476.056.321c.093.556.265 1.188.464 1.741.106.296.187.539.181.545-.008.006-.332.101-.719.212-.389.109-.741.21-.786.224-.058.016-.075.006-.059-.034zM4.905 6.112c-1.187-.339-2.167-.635-2.18-.654-.04-.062-1.246-4.321-1.23-4.338.026-.025 4.31 1.204 4.351 1.246.047.051 1.28 4.379 1.246 4.376L4.91 6.113zm2.148-1.713l-.519-1.806-.078-.28 1.693-.483c.934-.265 1.724-.495 1.76-.508.034-.016-.083.14-.26.336A8.729 8.729 0 0 0 7.69 5.23a4.348 4.348 0 0 0-.132.561c0 .293-.115-.025-.505-1.39z'
    }
  ];
</script>

{#if isOpen}
  <div
    class="sp-modal-backdrop"
    onclick={onClose}
    onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
    role="button"
    tabindex="0"
    aria-label="Tutup Panduan"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
    <div
      class="sp-modal-card"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-labelledby="help-title"
      tabindex="-1"
    >
      <!-- Header -->
      <div class="sp-modal-header">
        <div class="sp-modal-title-wrap">
          <span class="sp-help-badge">i</span>
          <h2 id="help-title" class="sp-modal-title">Panduan Informasi Portal WebGIS</h2>
        </div>
        <button type="button" class="sp-modal-close" onclick={onClose} aria-label="Tutup Bantuan">
          &times;
        </button>
      </div>

      <!-- Content Body -->
      <div class="sp-modal-body">
        <!-- Tentang Aplikasi -->
        <section class="sp-help-sec">
          <h3 class="sp-help-heading">Tentang Portal WebGIS</h3>
          <p class="sp-help-text">
            Portal WebGIS statis modern ini menyajikan visualisasi interaktif Zona Nilai Tanah (ZNT) berstandar resmi 8 kelas Kementerian Agraria dan Tata Ruang / Badan Pertanahan Nasional (ATR/BPN), hierarki jaringan jalan, aliran hidrologi sungai, batas wilayah administrasi desa, serta sebaran fasilitas umum strategis di Kabupaten Cirebon.
          </p>
          <p class="sp-help-text">
            Platform dirancang menggunakan arsitektur statis berkecepatan tinggi tanpa server database kompleks, sehingga memberikan performa visualisasi data geospasial yang instan, responsif, dan mudah diakses melalui berbagai perangkat.
          </p>
        </section>

        <!-- Panduan Penggunaan Ringkas (3 Card Grid) -->
        <section class="sp-help-sec">
          <h3 class="sp-help-heading">Panduan Penggunaan Cepat</h3>
          <div class="sp-guide-grid">
            <div class="sp-guide-card">
              <div class="sp-guide-icon-box">🗺️</div>
              <div class="sp-guide-card-content">
                <span class="sp-guide-card-title">Eksplorasi Tematik</span>
                <span class="sp-guide-card-desc">Klik zona nilai tanah, ruas jalan, atau simbol POI untuk membuka kartu atribut dan galeri foto lapangan.</span>
              </div>
            </div>

            <div class="sp-guide-card">
              <div class="sp-guide-icon-box">🎛️</div>
              <div class="sp-guide-card-content">
                <span class="sp-guide-card-title">Peta Dasar & Layer</span>
                <span class="sp-guide-card-desc">Beralih antara 4 peta dasar (Positron, Dark, OSM, Satelit Esri) dan sesuaikan transparansi layer di panel kiri.</span>
              </div>
            </div>

            <div class="sp-guide-card">
              <div class="sp-guide-icon-box">📏</div>
              <div class="sp-guide-card-content">
                <span class="sp-guide-card-title">Alat Ukur & Pencarian</span>
                <span class="sp-guide-card-desc">Ukur jarak lintasan jalan atau luas poligon secara interaktif serta temukan nama fasilitas pada bilah pencarian.</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Arsitektur Teknologi dengan Icon SVG Terkait -->
        <section class="sp-help-sec">
          <h3 class="sp-help-heading">Arsitektur Teknologi</h3>
          <div class="sp-tech-grid">
            {#each TECH_STACK as tech (tech.name)}
              <div class="sp-tech-pill" style="background-color: {tech.bg}; border-color: {tech.border};">
                <svg class="sp-tech-svg" width="16" height="16" viewBox="0 0 24 24" style="fill: {tech.color};">
                  <path d={tech.path} />
                </svg>
                <span class="sp-tech-name" style="color: {tech.color};">{tech.name}</span>
              </div>
            {/each}
          </div>
        </section>

        <!-- Penyusun & Kontak -->
        <section class="sp-help-sec sp-author-box">
          <div class="sp-author-header">
            <h3 class="sp-help-heading" style="margin-bottom: 0;">Pengembang WebGIS</h3>
            <span class="sp-author-tag">Geospatial Web Engineer</span>
          </div>
          <p class="sp-author-name">Dhany Yudi Prasetyo</p>
          <div class="sp-contact-links">
            <span class="sp-contact-item">
              🌐 Portofolio: <a href="https://www.dhanypedia.com" target="_blank" rel="noopener noreferrer" class="sp-link">dhanypedia.com</a>
            </span>
            <span class="sp-contact-item">
              ✉️ Email: <a href="mailto:dhanyyudi.prasetyo@gmail.com" class="sp-link">dhanyyudi.prasetyo@gmail.com</a>
            </span>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <div class="sp-modal-footer">
        <button type="button" class="sp-confirm-btn" onclick={onClose}>
          Tutup Panduan
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .sp-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.48);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    padding: 16px;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .sp-modal-card {
    width: 100%;
    max-width: 580px;
    max-height: 88vh;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 48px rgba(15, 58, 95, 0.28);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sp-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .sp-modal-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sp-help-badge {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #0f3a5f;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 700;
  }

  .sp-modal-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #0f3a5f;
  }

  .sp-modal-close {
    background: none;
    border: none;
    font-size: 22px;
    line-height: 1;
    color: #94a3b8;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .sp-modal-close:hover {
    color: #0f172a;
    background: #e2e8f0;
  }

  .sp-modal-body {
    padding: 18px 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sp-help-heading {
    margin: 0 0 8px 0;
    font-size: 12.5px;
    font-weight: 700;
    color: #0f3a5f;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .sp-help-text {
    margin: 0 0 6px 0;
    font-size: 12px;
    color: #475569;
    line-height: 1.55;
  }

  /* Guide Grid */
  .sp-guide-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sp-guide-card {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }

  .sp-guide-icon-box {
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .sp-guide-card-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sp-guide-card-title {
    font-size: 11.5px;
    font-weight: 700;
    color: #0f172a;
  }

  .sp-guide-card-desc {
    font-size: 10.5px;
    color: #64748b;
    line-height: 1.4;
  }

  /* Tech Grid with Authentic SVG Icons */
  .sp-tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .sp-tech-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    border: 1px solid;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .sp-tech-pill:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  }

  .sp-tech-svg {
    display: block;
    flex-shrink: 0;
  }

  .sp-tech-name {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  /* Author Box */
  .sp-author-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sp-author-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sp-author-tag {
    font-size: 9.5px;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 600;
    background: #e2e8f0;
    color: #334155;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .sp-author-name {
    margin: 0;
    font-size: 13.5px;
    font-weight: 700;
    color: #0f172a;
  }

  .sp-contact-links {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 2px;
  }

  .sp-contact-item {
    font-size: 11px;
    color: #475569;
  }

  .sp-link {
    color: #0284c7;
    text-decoration: none;
    font-weight: 600;
  }

  .sp-link:hover {
    text-decoration: underline;
  }

  .sp-modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 12px 20px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }

  .sp-confirm-btn {
    padding: 8px 18px;
    background: #0f3a5f;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .sp-confirm-btn:hover {
    background: #163f63;
  }

  @media (max-width: 600px) {
    .sp-tech-pill {
      flex: 1 1 calc(50% - 8px);
    }
  }
</style>
