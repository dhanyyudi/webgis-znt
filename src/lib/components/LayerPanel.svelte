<script lang="ts">
  import type { LayerConfig, LayerId } from '$lib/types/gis';

  let {
    layers = $bindable<LayerConfig[]>(),
    onToggleLayer,
    onChangeOpacity,
    isCollapsed = $bindable(false),
    onExpand
  }: {
    isCollapsed?: boolean;
    onExpand?: () => void;
    layers: LayerConfig[];
    onToggleLayer: (id: LayerId, visible: boolean) => void;
    onChangeOpacity: (id: LayerId, opacity: number) => void;
  } = $props();

  let activeOpacityId = $state<LayerId | null>(null);

  function toggleCollapse() {
    if (isCollapsed) onExpand?.();
    isCollapsed = !isCollapsed;
  }

  function handleVisibilityChange(layer: LayerConfig) {
    layer.visible = !layer.visible;
    onToggleLayer(layer.id, layer.visible);
  }

  function handleOpacityInput(layer: LayerConfig, e: Event) {
    const target = e.target as HTMLInputElement;
    const val = parseFloat(target.value);
    layer.opacity = val;
    onChangeOpacity(layer.id, val);
  }

  function toggleOpacitySlider(id: LayerId) {
    activeOpacityId = activeOpacityId === id ? null : id;
  }
</script>

<div class="sp-layer-panel" class:collapsed={isCollapsed}>
  <button type="button" class="sp-panel-header" onclick={toggleCollapse} aria-expanded={!isCollapsed} aria-controls="layer-panel-body">
    <div class="sp-header-left">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
      <span class="sp-panel-title"><span class="sp-layer-title-desktop">Daftar Layer Spasial</span><span class="sp-layer-title-mobile">Layer</span></span>
      <span class="sp-layer-count">{layers.filter(l => l.visible).length}/{layers.length}</span>
    </div>

    <span class="sp-icon-btn" aria-hidden="true">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        style="transform: rotate({isCollapsed ? '180deg' : '0deg'}); transition: transform 0.2s;"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </span>
  </button>

  {#if !isCollapsed}
    <div class="sp-panel-body" id="layer-panel-body">
      <ul class="sp-layer-list">
        {#each layers as layer (layer.id)}
          <li class="sp-layer-item" class:layer-disabled={!layer.visible}>
            <div class="sp-layer-row">
              <label class="sp-checkbox-wrap">
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onchange={() => handleVisibilityChange(layer)}
                  class="sp-checkbox"
                />
                <span class="sp-color-swatch" style="background-color: {layer.color};"></span>
                <div class="sp-layer-meta">
                  <span class="sp-layer-name">{layer.label}</span>
                  <span class="sp-geom-badge">{layer.geometryType}</span>
                </div>
              </label>

              <button
                type="button"
                class="sp-opacity-toggle"
                class:active={activeOpacityId === layer.id}
                onclick={() => toggleOpacitySlider(layer.id)}
                title="Atur transparansi layer"
                aria-label="Transparansi"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </button>
            </div>

            {#if activeOpacityId === layer.id && layer.visible}
              <div class="sp-opacity-slider-box">
                <span class="sp-slider-label">Transparansi: {Math.round(layer.opacity * 100)}%</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={layer.opacity}
                  oninput={(e) => handleOpacityInput(layer, e)}
                  class="sp-range"
                />
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .sp-layer-panel {
    position: fixed;
    top: 118px;
    left: 14px;
    width: 280px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(15, 58, 95, 0.15);
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(15, 58, 95, 0.12), 0 1px 3px rgba(15, 58, 95, 0.05);
    backdrop-filter: blur(12px);
    z-index: 980;
    overflow: hidden;
    transition: width 0.2s ease, box-shadow 0.2s ease;
  }

  .sp-layer-title-mobile { display: none; }

  .sp-panel-header {
    width: 100%;
    border: 0;
    text-align: left;
    font: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: #f8fafc;
    border-bottom: 1px solid rgba(15, 58, 95, 0.1);
  }

  .sp-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #0f3a5f;
    font-weight: 700;
    font-size: 12px;
  }

  .sp-layer-count {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    background: #e2e8f0;
    color: #334155;
    padding: 1px 5px;
    border-radius: 4px;
  }

  .sp-icon-btn {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
  }

  .sp-icon-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .sp-panel-body {
    padding: 8px;
    max-height: 380px;
    overflow-y: auto;
  }

  .sp-layer-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sp-layer-item {
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 8px;
    padding: 6px 8px;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .sp-layer-item:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
  }

  .sp-layer-item.layer-disabled {
    opacity: 0.6;
  }

  .sp-layer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .sp-checkbox-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    flex: 1;
  }

  .sp-checkbox {
    cursor: pointer;
    accent-color: #0f3a5f;
    width: 15px;
    height: 15px;
  }

  .sp-color-swatch {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    flex-shrink: 0;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .sp-layer-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .sp-layer-name {
    font-size: 11px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.3;
  }

  .sp-geom-badge {
    font-size: 9px;
    color: #94a3b8;
    font-weight: 500;
  }

  .sp-opacity-toggle {
    background: none;
    border: 1px solid transparent;
    padding: 3px;
    border-radius: 4px;
    color: #64748b;
    cursor: pointer;
  }

  .sp-opacity-toggle:hover,
  .sp-opacity-toggle.active {
    background: #e2e8f0;
    color: #0f3a5f;
    border-color: #cbd5e1;
  }

  .sp-opacity-slider-box {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px dashed #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sp-slider-label {
    font-size: 9px;
    font-family: 'IBM Plex Mono', monospace;
    color: #475569;
  }

  .sp-range {
    width: 100%;
    accent-color: #0f3a5f;
    height: 4px;
  }

  @media (max-width: 768px) {
    .sp-layer-panel {
      top: 110px;
      bottom: auto;
      left: 10px;
      width: calc(100vw - 20px);
      max-width: 290px;
    }
  }

  @media (max-width: 1024px) {
    .sp-layer-panel { top: auto; bottom: calc(var(--sp-footer-h) + 8px); left: var(--sp-mobile-left); width: calc((100% - var(--sp-mobile-left) - var(--sp-mobile-right) - 8px) / 2); max-width: none; overflow: visible; backdrop-filter: none; transition: none; }
    .sp-panel-header { height: 48px; padding: 8px 10px; border-radius: 12px; border-bottom: 0; }
    .sp-header-left { gap: 6px; }
    .sp-layer-title-desktop { display: none; }
    .sp-layer-title-mobile { display: inline; }
    .sp-panel-body { position: fixed; bottom: calc(var(--sp-footer-h) + 64px); left: var(--sp-mobile-left); right: var(--sp-mobile-right); max-height: min(50dvh, calc(100dvh - 230px)); background: #fff; border: 1px solid var(--sp-border); border-radius: 14px; box-shadow: var(--sp-shadow-lg); overscroll-behavior: contain; }
    .sp-layer-row { min-height: 44px; }
    .sp-layer-name { font-size: 12px; }
    .sp-opacity-toggle { min-width: 36px; min-height: 36px; }
    .sp-checkbox { width: 18px; height: 18px; flex-shrink: 0; }
  }
</style>
