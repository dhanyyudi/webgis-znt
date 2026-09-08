<script lang="ts">
  import MonogramLogo from './MonogramLogo.svelte';
</script>

<div class="sp-brand-pill">
  <div class="sp-logo">
    <MonogramLogo size={28} />
  </div>
  <div class="sp-title-wrap">
    <div class="sp-title">WebGIS Zona Nilai Tanah</div>
    <div class="sp-subtitle">
      Survei dan Pemetaan Tematik ATR/BPN · Kabupaten Cirebon
    </div>
  </div>
</div>

<style>
  .sp-brand-pill {
    position: fixed;
    top: 14px;
    left: 0;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 18px 8px 14px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(15, 58, 95, 0.15);
    border-left: 0;
    border-radius: 0 999px 999px 0;
    box-shadow: 0 4px 14px rgba(15, 58, 95, 0.12), 0 1px 2px rgba(15, 58, 95, 0.04);
    z-index: 1500;
    max-width: calc(100vw - 180px);
    backdrop-filter: blur(8px);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .sp-brand-pill:hover {
    box-shadow: 0 6px 18px rgba(15, 58, 95, 0.16);
  }

  .sp-logo {
    width: 40px;
    height: 36px;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid rgba(15, 58, 95, 0.12);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .sp-title-wrap {
    line-height: 1.2;
    min-width: 0;
  }

  .sp-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #0f3a5f;
    letter-spacing: -0.005em;
    white-space: nowrap;
  }

  .sp-subtitle {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 1080px) {
    .sp-subtitle {
      display: none;
    }
  }
</style>
