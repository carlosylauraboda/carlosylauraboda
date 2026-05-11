#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ENDPOINT = process.env.REACT_APP_SHEET_ENDPOINT;
const TOKEN = process.env.LIST_TOKEN;
const SITE_URL = (process.env.SITE_URL || 'https://carlosylauraboda.github.io/carlosylauraboda').replace(/\/$/, '');
const BUILD_DIR = path.resolve(__dirname, '..', 'build');

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function pageHtml({ codigo, invitado1, invitado2 }) {
  const title = 'Boda de Carlos y Laura';
  const i1 = (invitado1 || '').toString().trim();
  const i2 = (invitado2 || '').toString().trim();
  const nombres = i1 && i2 ? `${i1} e ${i2}` : i1 || i2 || 'nuestros invitados';
  const desc = `Invitación de ${nombres}`;
  const url = `${SITE_URL}/i/${codigo}/`;
  const target = `${SITE_URL}/?c=${encodeURIComponent(codigo)}`;
  const img = `${SITE_URL}/favicon.jpg`;
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtml(title)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${escapeHtml(url)}">
<meta property="og:image" content="${escapeHtml(img)}">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${escapeHtml(img)}">
<link rel="canonical" href="${escapeHtml(target)}">
<meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">
<script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
<p>Redirigiendo a <a href="${escapeHtml(target)}">la invitación</a>…</p>
</body>
</html>
`;
}

async function main() {
  if (!ENDPOINT || !TOKEN) {
    console.warn('[build-previews] Falta REACT_APP_SHEET_ENDPOINT o LIST_TOKEN — se omite la generación de previews.');
    return;
  }
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('[build-previews] No existe build/. Ejecuta `react-scripts build` antes.');
    process.exit(1);
  }

  const listUrl = `${ENDPOINT}?list=1&token=${encodeURIComponent(TOKEN)}`;
  const res = await fetch(listUrl, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Fetch de lista falló: HTTP ${res.status}`);
  const data = await res.json();
  if (data.result !== 'success' || !Array.isArray(data.invitados)) {
    throw new Error('Respuesta inesperada del Apps Script: ' + JSON.stringify(data).slice(0, 300));
  }

  const outRoot = path.join(BUILD_DIR, 'i');
  fs.mkdirSync(outRoot, { recursive: true });

  let n = 0;
  for (const inv of data.invitados) {
    const codigo = (inv.codigo || '').toString().trim().toUpperCase();
    if (!codigo) continue;
    if (!/^[A-Z0-9_-]+$/.test(codigo)) {
      console.warn(`[build-previews] Código con caracteres raros, lo salto: ${codigo}`);
      continue;
    }
    const dir = path.join(outRoot, codigo);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), pageHtml({ codigo, invitado1: inv.invitado1, invitado2: inv.invitado2 }));
    n++;
  }
  console.log(`[build-previews] Generadas ${n} previews en build/i/ (SITE_URL=${SITE_URL})`);
}

main().catch((err) => {
  console.error('[build-previews]', err);
  process.exit(1);
});
