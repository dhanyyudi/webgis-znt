import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

const targetElement = document.getElementById('app');

if (!targetElement) {
  throw new Error('Elemen wadah #app tidak ditemukan pada dokumen HTML.');
}

const app = mount(App, {
  target: targetElement
});

export default app;
