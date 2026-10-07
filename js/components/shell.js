import { session } from "../api/client.js";
import { auth } from "../api/resources.js";
import { esc } from "../utils/format.js";
const NAV = [["dashboard.html", "Dashboard"], ["transactions.html", "Transaksi"], ["categories.html", "Kategori"]];
export async function logout() {
  const s = session.get();
  try { if (s?.refresh) await auth.logout(s.refresh); } catch { /* tetap bersihkan sesi lokal */ }
  session.clear(); location.replace("login.html");
}
export function mountShell(active, title) {
  const s = session.get();
  if (!s) { location.replace("login.html"); return false; }
  const links = NAV.map(([h, l]) => `<a class="nav-item-app${h === active ? " active" : ""}" href="${h}"${h === active ? ' aria-current="page"' : ""}>${l}</a>`).join("") + `<button type="button" class="nav-item-app" data-logout>Logout</button>`;
  const page = document.getElementById("page");
  document.body.insertAdjacentHTML("afterbegin", `<div class="shell">
<aside class="sidebar d-none d-lg-flex"><div class="brand">Catatan Keuangan</div><nav aria-label="Navigasi utama">${links}</nav></aside>
<div class="main"><header class="topbar"><button class="btn btn-outline-secondary d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#nav-oc" aria-label="Buka menu navigasi">Menu</button><h1 class="page-title">${esc(title)}</h1><span class="text-muted small ms-auto">${esc(s.username)}</span></header><main class="content" id="main-content"></main></div></div>
<div class="offcanvas offcanvas-start" id="nav-oc" tabindex="-1" aria-label="Menu navigasi"><div class="offcanvas-header"><span class="brand">Catatan Keuangan</span><button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Tutup menu"></button></div><div class="offcanvas-body"><nav class="d-flex flex-column" aria-label="Navigasi utama">${links}</nav></div></div>`);
  document.getElementById("main-content").append(page);
  document.querySelectorAll("[data-logout]").forEach((b) => (b.onclick = logout));
  return true;
}
