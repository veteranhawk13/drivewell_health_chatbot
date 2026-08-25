
const API_BASE = import.meta.env.VITE_API_URL || '';

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function registerDriver(name, pin) {
  const res = await fetch(`${API_BASE}/api/auth/driver/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, pin }),
  });
  return handle(res);
}

export async function loginDriver(name, pin) {
  const res = await fetch(`${API_BASE}/api/auth/driver/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, pin }),
  });
  return handle(res);
}

export async function submitCheckin(driverId, payload) {
  const res = await fetch(`${API_BASE}/api/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driverId, ...payload }),
  });
  return handle(res);
}

export async function getCheckinHistory(driverId, limit = 14) {
  const res = await fetch(`${API_BASE}/api/checkin/history/${driverId}?limit=${limit}`);
  return handle(res);
}

export async function sendChat({ history, lang, driverId, currentRiskLevel }) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, lang, driverId, currentRiskLevel }),
  });
  return handle(res);
}

export async function managerLogin(passcode) {
  const res = await fetch(`${API_BASE}/api/auth/manager/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  return handle(res);
}

export async function getManagerOverview(passcode) {
  const res = await fetch(`${API_BASE}/api/manager/drivers`, {
    headers: { 'X-Manager-Passcode': passcode },
  });
  return handle(res);
}

export async function getManagerDriverDetail(passcode, driverId) {
  const res = await fetch(`${API_BASE}/api/manager/driver/${driverId}`, {
    headers: { 'X-Manager-Passcode': passcode },
  });
  return handle(res);
}

export async function clearAllData(passcode) {
  const res = await fetch(`${API_BASE}/api/manager/clear-all`, {
    method: 'POST',
    headers: { 'X-Manager-Passcode': passcode },
  });
  return handle(res);
}