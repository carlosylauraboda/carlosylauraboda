const ENDPOINT = process.env.REACT_APP_SHEET_ENDPOINT;

function ensureEndpoint() {
  if (!ENDPOINT) {
    throw new Error('REACT_APP_SHEET_ENDPOINT no está configurado');
  }
}

export async function fetchInvitado(codigo) {
  ensureEndpoint();
  const url = `${ENDPOINT}?codigo=${encodeURIComponent(codigo)}`;
  const res = await fetch(url, { method: 'GET', redirect: 'follow' });
  if (!res.ok) throw new Error('Error de red');
  return res.json();
}

export async function submitRsvp(payload) {
  ensureEndpoint();
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error de red');
  return res.json();
}
