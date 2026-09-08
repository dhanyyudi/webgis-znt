<script lang="ts">
  let {
    image = null,
    onClose
  }: {
    image: { url: string; caption?: string; title?: string } | null;
    onClose: () => void;
  } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if image}
  <!-- Backdrop semi-transparan dengan efek blur halus -->
  <div
    class="sp-lightbox-backdrop"
    onclick={onClose}
    onkeydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') onClose(); }}
    role="button"
    tabindex="0"
    aria-label="Tutup Pratinjau Gambar"
  >
    <!-- Kontainer Kartu Gambar yang Dizoom -->
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
    <div
      class="sp-lightbox-content"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <!-- Tombol Tutup -->
      <button
        type="button"
        class="sp-lightbox-close"
        onclick={onClose}
        aria-label="Tutup Pratinjau"
        title="Tutup (Esc)"
      >
        &times;
      </button>

      <!-- Gambar Terzoom -->
      <div class="sp-lightbox-frame">
        <img
          src={image.url}
          alt={image.caption || image.title || 'Foto Lapangan'}
          class="sp-lightbox-img"
        />
      </div>

      <!-- Keterangan Gambar -->
      {#if image.caption || image.title}
        <div class="sp-lightbox-meta">
          {#if image.title}
            <div class="sp-lightbox-title">{image.title}</div>
          {/if}
          {#if image.caption}
            <div class="sp-lightbox-caption">{image.caption}</div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .sp-lightbox-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    min-width: 100vw;
    min-height: 100vh;
    z-index: 4000;
    background: rgba(15, 23, 42, 0.88);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: spFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: zoom-out;
  }

  @keyframes spFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .sp-lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: default;
    animation: spZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes spZoomIn {
    from {
      opacity: 0;
      transform: scale(0.88);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .sp-lightbox-close {
    position: absolute;
    top: -44px;
    right: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.35);
    color: #ffffff;
    font-size: 22px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease;
  }

  .sp-lightbox-close:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: scale(1.08);
  }

  .sp-lightbox-frame {
    max-width: 100%;
    max-height: calc(88vh - 70px);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.15);
    background: #0b1120;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sp-lightbox-img {
    max-width: 82vw;
    max-height: calc(80vh - 60px);
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 12px;
  }

  .sp-lightbox-meta {
    margin-top: 14px;
    max-width: 650px;
    text-align: center;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 16px;
  }

  .sp-lightbox-title {
    font-size: 14px;
    font-weight: 700;
    color: #f8fafc;
    letter-spacing: -0.01em;
  }

  .sp-lightbox-caption {
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1.45;
  }

  @media (max-width: 640px) {
    .sp-lightbox-backdrop {
      padding: 14px;
    }

    .sp-lightbox-close {
      top: -38px;
      right: 4px;
      width: 32px;
      height: 32px;
      font-size: 20px;
    }

    .sp-lightbox-img {
      max-width: 92vw;
      max-height: 65vh;
    }

    .sp-lightbox-title {
      font-size: 13px;
    }

    .sp-lightbox-caption {
      font-size: 11px;
    }
  }
</style>
