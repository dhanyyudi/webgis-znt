/// <reference types="vite/client" />
/// <reference types="@sveltejs/vite-plugin-svelte" />

declare module '*.geojson' {
  const content: any;
  export default content;
}

declare module '*.svelte' {
  import type { Component } from 'svelte';
  const component: Component<any>;
  export default component;
}
