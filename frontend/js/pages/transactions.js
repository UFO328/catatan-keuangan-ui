import { transactions, categories } from "../api/resources.js";
import { mountShell } from "../components/shell.js";
import { toast, confirmDialog, renderPagination, setFieldErrors, clearErrors, setBusy, stateBox } from "../components/ui.js";
import { formatCurrency, formatDateTime, toIso, toLocalInput, esc } from "../utils/format.js";
import { PAGE_SIZE } from "../config.js";
if (!mountShell("transactions.html", "Transaksi")) throw 0;
const $ = (id) => document.getElementById(id);
const form = $("form"), modal = new bootstrap.Modal($("modal"));
let page = 1, cats = [], rows = [], editing = null;
const catName = (id) => cats.find((c) => c.id === id)?.name ?? "—";
const filters = () => Object.fromEntries(new FormData($("filters")));

async function load() {
  stateBox($("list"), "loading", "Loading transactions...");
  try {
    const r = await transactions.list({ ...filters(), page });
    rows = r.results;
    if (!rows.length && page > 1) { page--; return load(); }
    if (!rows.length) { $("list").innerHTML = `<div class="panel state"><strong>Tidak ada transaksi</strong>Ubah filter atau tambahkan transaksi baru.</div>`; $("pager").innerHTML = ""; return; }
    $("list").innerHTML = `<div class="table-responsive panel p-0"><table class="table mb-0"><thead><tr><th>Tanggal</th><th>Kategori</th><th>Deskripsi</th><th>Tipe</th><th class="text-end">Nominal</th><th><span class="visually-hidden">Aksi</span></th></tr></thead><tbody>${rows.map((t) => {
      const inc = t.type === "INCOME", k = inc ? "income" : "expense";
      return `<tr><td class="text-nowrap">${formatDateTime(t.transaction_date)}</td><td>${esc(catName(t.category))}</td><td>${esc(t.description) || '<span class="text-muted">—</span>'}</td><td><span class="type-tag ${k}">${inc ? "Pemasukan" : "Pengeluaran"}</span></td><td class="amt num ${k}">${inc ? "+" : "-"} ${formatCurrency(t.amount)}</td><td class="text-nowrap text-end"><button class="btn btn-sm btn-outline-secondary" data-edit="${t.id}">Edit</button> <button class="btn btn-sm btn-outline-danger" data-del="${t.id}">Hapus</button></td></tr>`; }).join("")}</tbody></table></div>`;
    renderPagination($("pager"), { page, pages: Math.ceil(r.count / PAGE_SIZE), onChange: (p) => { page = p; load(); } });
  } catch (err) { stateBox($("list"), "error", err.message); }
}
function fillCats(sel, withAll) { sel.innerHTML = (withAll ? '<option value="">Semua</option>' : "") + cats.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join(""); }
function openForm(t) {
  editing = t; clearErrors(form); form.reset();
  $("modal-title").textContent = t ? "Edit transaksi" : "Tambah transaksi";
  if (t) { form.type.value = t.type; form.amount.value = Math.round(t.amount).toLocaleString("id-ID"); form.category.value = t.category; form.transaction_date.value = toLocalInput(t.transaction_date); form.description.value = t.description; }
  else form.transaction_date.value = toLocalInput(new Date().toISOString());
  modal.show();
}
form.amount.addEventListener("input", (e) => { const n = e.target.value.replace(/\D/g, ""); e.target.value = n ? Number(n).toLocaleString("id-ID") : ""; });
form.addEventListener("submit", async (e) => {
  e.preventDefault(); clearErrors(form);
  const btn = form.querySelector("[type=submit]"), n = Number(form.amount.value.replace(/\D/g, ""));
  if (!(n > 0)) return setFieldErrors(form, { data: { amount: ["Nominal harus lebih dari 0."] } });
  if (!form.category.value) return setFieldErrors(form, { data: { category: ["Pilih kategori terlebih dahulu."] } });
  const body = { type: form.type.value, amount: n.toFixed(2), category: +form.category.value, transaction_date: toIso(form.transaction_date.value), description: form.description.value.trim() };
  setBusy(btn, true, "Saving...");
  try {
    editing ? await transactions.update(editing.id, body) : await transactions.create(body);
    modal.hide(); toast(editing ? "Transaksi berhasil diperbarui." : "Transaksi berhasil ditambahkan."); load();
  } catch (err) { setFieldErrors(form, err); } finally { setBusy(btn, false); }
});
$("list").addEventListener("click", async (e) => {
  const ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
  if (ed) return openForm(rows.find((t) => t.id === +ed.dataset.edit));
  if (!del) return;
  const t = rows.find((x) => x.id === +del.dataset.del);
  const ok = await confirmDialog("Hapus transaksi?", `<p class="mb-1">Transaksi ini akan dihapus permanen:</p><p class="mb-0"><strong>${esc(t.description) || "(tanpa deskripsi)"}</strong><br>${t.type === "INCOME" ? "Pemasukan" : "Pengeluaran"} ${formatCurrency(t.amount)} · ${esc(catName(t.category))} · ${formatDateTime(t.transaction_date)}</p>`);
  if (!ok) return;
  try { await transactions.remove(t.id); toast("Transaksi berhasil dihapus."); load(); } catch (err) { toast(err.message, "error"); }
});
$("filters").addEventListener("submit", (e) => { e.preventDefault(); page = 1; load(); });
$("filters").addEventListener("reset", () => setTimeout(() => { page = 1; load(); }));
$("add").onclick = () => openForm(null);
(async () => {
  try { cats = await categories.all(); fillCats($("f-category"), true); fillCats(form.category); } catch (err) { toast(err.message, "error"); }
  load();
  if (new URLSearchParams(location.search).get("add")) openForm(null);
})();
