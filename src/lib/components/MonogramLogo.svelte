<script lang="ts">
  let { size = 32 }: { size?: number } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 48 48"
  aria-hidden="true"
  class="sp-monogram"
>
  <path fill="currentColor" d="M5 7h10l7 34H12L5 7Z" />
  <path fill="currentColor" d="M18 7h12L44 20v8L30 41h-5l-1.7-8H27l8-9-8-9h-7.3L18 7Z" />
</svg>

<style>
  .sp-monogram {
    display: inline-block;
    vertical-align: middle;
    color: var(--sp-navy, #0f3a5f);
    transition: transform 0.2s ease;
  }
  .sp-monogram:hover {
    transform: scale(1.05);
  }
</style>
