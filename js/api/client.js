import { API_BASE_URL, PATHS } from "../config.js";
const KEY = "ck_auth"; // satu-satunya tempat token disimpan
export const session = {
  get() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } },
  set(v) { localStorage.setItem(KEY, JSON.stringify(v)); },
  clear() { localStorage.removeItem(KEY); },
};
export class ApiError extends Error {
  constructor(status, data, message) { super(message); this.status = status; this.data = data; }
}
function messageFor(status, data) {
  if (status === 0) return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.";
  if (status === 401) return "Session Anda telah berakhir. Silakan login kembali.";
  if (status === 403) return "Anda tidak memiliki akses untuk melakukan tindakan ini.";
  if (status === 404) return "Data tidak ditemukan.";
  if (status >= 500) return "Server sedang mengalami masalah. Coba lagi beberapa saat.";
  return (data && (data.detail || data.message)) || "Data yang dikirim tidak valid. Periksa kembali isian Anda.";
}
async function raw(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const s = session.get();
  if (auth && s) headers.Authorization = `Bearer ${s.access}`;
  try { return await fetch(API_BASE_URL + path, { method, headers, body: body && JSON.stringify(body) }); }
  catch { throw new ApiError(0, null, messageFor(0)); }
}
let refreshing = null;
function refresh() {
  refreshing ??= (async () => {
    const s = session.get();
    if (!s?.refresh) return false;
    const res = await raw(PATHS.refresh, { method: "POST", body: { refresh: s.refresh }, auth: false }).catch(() => null);
    if (!res?.ok) return false;
    const d = await res.json();
    session.set({ ...s, access: d.access, ...(d.refresh && { refresh: d.refresh }) });
    return true;
  })().finally(() => (refreshing = null));
  return refreshing;
}
async function request(path, opts = {}) {
  let res = await raw(path, opts);
  if (res.status === 401 && opts.auth !== false) {
    if (await refresh()) res = await raw(path, opts);
    else { session.clear(); location.replace("login.html"); throw new ApiError(401, null, messageFor(401)); }
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data, messageFor(res.status, data));
  return data;
}
const qs = (q) => { const p = new URLSearchParams(Object.entries(q || {}).filter(([, v]) => v !== "" && v != null)); return p.size ? "?" + p : ""; };
export const api = {
  get: (p, q, o) => request(p + qs(q), o),
  post: (p, body, o) => request(p, { ...o, method: "POST", body }),
  patch: (p, body, o) => request(p, { ...o, method: "PATCH", body }),
  delete: (p, o) => request(p, { ...o, method: "DELETE" }),
};
