const rp = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
export const formatCurrency = (v) => "Rp" + rp.format(Number(v) || 0);
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).replace(" pukul", ",");
// <input type="datetime-local"> <-> ISO UTC (timezone lokal diperhitungkan)
export const toIso = (local) => new Date(local).toISOString();
export const toLocalInput = (iso) => {
  const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
