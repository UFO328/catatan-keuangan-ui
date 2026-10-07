import { getDashboard } from "../api/resources.js";
import { mountShell } from "../components/shell.js";
import { stateBox } from "../components/ui.js";
import { formatCurrency, esc } from "../utils/format.js";
if (mountShell("dashboard.html", "Dashboard")) load();
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function bars(id, rows, key, color, title) {
  const c = document.getElementById(id);
  if (!rows.length) { c.parentElement.innerHTML = `<div class="state">Belum ada data ${title.toLowerCase()}.</div>`; return; }
  c.parentElement.style.height = Math.max(140, rows.length * 38 + 48) + "px";
  c.setAttribute("aria-label", `${title}: ` + rows.map((r) => `${r.category_name} ${formatCurrency(r[key])}`).join(", "));
  new Chart(c, { type: "bar", data: { labels: rows.map((r) => r.category_name), datasets: [{ data: rows.map((r) => Number(r[key])), backgroundColor: css(color), borderRadius: 3, barThickness: 20 }] },
    options: { indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => formatCurrency(x.raw) } } },
      scales: { x: { ticks: { callback: (v) => formatCurrency(v) }, grid: { color: css("--color-border") } }, y: { grid: { display: false } } } } });
}
async function load() {
  const el = document.getElementById("dash");
  try {
    const d = await getDashboard();
    const inc = Number(d.total_income), exp = Number(d.total_expense);
    if (!inc && !exp && !d.total_income_by_category.length && !d.total_expense_by_category.length) {
      el.innerHTML = `<div class="panel state"><strong>Belum ada transaksi</strong>Tambahkan pemasukan atau pengeluaran pertama Anda untuk mulai melihat ringkasan keuangan.<div class="mt-3"><a class="btn btn-primary" href="transactions.html?add=1">Tambah Transaksi</a></div></div>`;
      return;
    }
    const bal = inc - exp; // nilai turunan di frontend, bukan field API
    el.innerHTML = `<div class="summary mb-2">
<section class="panel" aria-labelledby="s-in"><div class="label" id="s-in">Total Pemasukan</div><div class="value income num">${formatCurrency(inc)}</div></section>
<section class="panel" aria-labelledby="s-out"><div class="label" id="s-out">Total Pengeluaran</div><div class="value expense num">${formatCurrency(exp)}</div></section></div>
<p class="text-muted small mb-4">Selisih pemasukan dan pengeluaran: <span class="num">${bal < 0 ? "-" : ""}${formatCurrency(Math.abs(bal))}</span></p>
<div class="row g-3"><section class="col-lg-6"><h2 class="section">Pemasukan per kategori</h2><div class="panel chart-box"><canvas id="c-in" role="img"></canvas></div></section>
<section class="col-lg-6"><h2 class="section">Pengeluaran per kategori</h2><div class="panel chart-box"><canvas id="c-out" role="img"></canvas></div></section></div>`;
    bars("c-in", d.total_income_by_category, "total_income", "--color-success", "Pemasukan per kategori");
    bars("c-out", d.total_expense_by_category, "total_expense", "--color-danger", "Pengeluaran per kategori");
  } catch (err) { stateBox(el, "error", err.message); }
}
