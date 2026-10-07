import { categories } from "../api/resources.js";
import { mountShell } from "../components/shell.js";
import { toast, confirmDialog, renderPagination, setFieldErrors, clearErrors, setBusy, stateBox } from "../components/ui.js";
import { esc } from "../utils/format.js";
if (!mountShell("categories.html", "Kategori")) throw 0;
const $ = (id) => document.getElementById(id);
const form = $("form"), modal = new bootstrap.Modal($("modal"));
let page = 1, rows = [], editing = null;
async function load() {
  stateBox($("list"), "loading", "Loading categories...");
  try {
    const r = await categories.list(page);
    rows = r.results;
    if (!rows.length && page > 1) { page--; return load(); }
    if (!rows.length) { $("list").innerHTML = `<div class="panel state"><strong>Belum ada kategori</strong>Tambahkan kategori untuk mengelompokkan transaksi.</div>`; $("pager").innerHTML = ""; return; }
    $("list").innerHTML = `<div class="table-responsive panel p-0"><table class="table mb-0"><thead><tr><th>Nama</th><th>Status</th><th><span class="visually-hidden">Aksi</span></th></tr></thead><tbody>${rows.map((c) => `<tr><td>${esc(c.name)}</td><td>${c.is_default ? "Default" : '<span class="text-muted">—</span>'}</td><td class="text-nowrap text-end"><button class="btn btn-sm btn-outline-secondary" data-edit="${c.id}">Edit</button> <button class="btn btn-sm btn-outline-danger" data-del="${c.id}">Hapus</button></td></tr>`).join("")}</tbody></table></div>`;
    // Ukuran halaman kategori tidak ada di spec -> pakai next/previous dari API.
    $("pager").innerHTML = r.next || r.previous ? `<ul class="pagination mb-0 justify-content-between"><li class="page-item${r.previous ? "" : " disabled"}"><a class="page-link" href="#" data-d="-1">Previous</a></li><li class="page-item disabled"><span class="page-link">Halaman ${page}</span></li><li class="page-item${r.next ? "" : " disabled"}"><a class="page-link" href="#" data-d="1">Next</a></li></ul>` : "";
  } catch (err) { stateBox($("list"), "error", err.message); }
}
$("pager").addEventListener("click", (e) => { const a = e.target.closest("[data-d]"); if (a) { e.preventDefault(); if (!a.parentElement.classList.contains("disabled")) { page += +a.dataset.d; load(); } } });
function openForm(c) {
  editing = c; clearErrors(form); form.reset();
  $("modal-title").textContent = c ? "Edit kategori" : "Tambah kategori";
  if (c) { form.name.value = c.name; form.is_default.checked = c.is_default; }
  modal.show();
}
form.addEventListener("submit", async (e) => {
  e.preventDefault(); clearErrors(form);
  const btn = form.querySelector("[type=submit]"), body = { name: form.name.value.trim(), is_default: form.is_default.checked };
  if (!body.name) return setFieldErrors(form, { data: { name: ["Nama kategori wajib diisi."] } });
  setBusy(btn, true, "Saving...");
  try {
    editing ? await categories.update(editing.id, body) : await categories.create(body);
    modal.hide(); toast(editing ? "Kategori berhasil diperbarui." : "Kategori berhasil ditambahkan."); load();
  } catch (err) {
    setFieldErrors(form, err, err.status === 400 ? { name: "Kategori dengan nama tersebut sudah ada.", non_field_errors: "Kategori dengan nama tersebut sudah ada." } : {});
  } finally { setBusy(btn, false); }
});
$("list").addEventListener("click", async (e) => {
  const ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
  if (ed) return openForm(rows.find((c) => c.id === +ed.dataset.edit));
  if (!del) return;
  const c = rows.find((x) => x.id === +del.dataset.del);
  if (!(await confirmDialog("Hapus kategori?", `<p class="mb-0">Kategori <strong>${esc(c.name)}</strong> akan dihapus permanen.</p>`))) return;
  try { await categories.remove(c.id); toast("Kategori berhasil dihapus."); load(); }
  catch (err) { toast(err.status === 400 ? "Kategori tidak dapat dihapus karena masih digunakan oleh transaksi." : err.message, "error"); }
});
$("add").onclick = () => openForm(null);
load();
