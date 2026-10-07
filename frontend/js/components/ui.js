import { esc } from "../utils/format.js";
export function toast(message, type = "success") {
  let box = document.getElementById("toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; box.className = "toast-container position-fixed bottom-0 end-0 p-3"; document.body.append(box); }
  const cls = { success: "success", error: "danger", warning: "warning", info: "primary" }[type];
  const el = document.createElement("div");
  el.className = `toast align-items-center text-bg-${cls} border-0`;
  el.setAttribute("role", type === "error" ? "alert" : "status");
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${esc(message)}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Tutup"></button></div>`;
  box.append(el);
  el.addEventListener("hidden.bs.toast", () => el.remove());
  new bootstrap.Toast(el, { delay: 4500 }).show();
}
export function confirmDialog(title, bodyHtml, okLabel = "Hapus") {
  return new Promise((resolve) => {
    const el = document.createElement("div");
    el.className = "modal fade"; el.tabIndex = -1;
    el.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h2 class="modal-title fs-5">${esc(title)}</h2><button class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button></div><div class="modal-body">${bodyHtml}</div><div class="modal-footer"><button class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button><button class="btn btn-danger" data-ok>${esc(okLabel)}</button></div></div></div>`;
    document.body.append(el);
    const m = new bootstrap.Modal(el); let ok = false;
    el.querySelector("[data-ok]").onclick = () => { ok = true; m.hide(); };
    el.addEventListener("hidden.bs.modal", () => { el.remove(); resolve(ok); });
    m.show();
  });
}
export function setBusy(btn, busy, label) {
  if (busy) { btn.dataset.label = btn.textContent; btn.textContent = label; } else btn.textContent = btn.dataset.label;
  btn.disabled = busy;
}
export function clearErrors(form) {
  form.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
  form.querySelector("[data-form-error]")?.classList.add("d-none");
}
// Error validasi DRF {field: [pesan]} -> tampil dekat field; sisanya di alert form.
export function setFieldErrors(form, err, map = {}) {
  clearErrors(form);
  const data = err.data && typeof err.data === "object" ? err.data : {};
  let rest = [];
  for (const [k, v] of Object.entries(data)) {
    const input = form.elements[k];
    const text = map[k] || [].concat(v).join(" ");
    if (input && input.type !== "hidden") {
      input.classList.add("is-invalid");
      const fb = input.parentElement.querySelector(".invalid-feedback");
      if (fb) { fb.textContent = text; fb.id ||= `${k}-err`; input.setAttribute("aria-describedby", fb.id); }
    } else rest.push(text);
  }
  if (!Object.keys(data).some((k) => form.elements[k])) rest = [err.message];
  const box = form.querySelector("[data-form-error]");
  if (box && rest.length) { box.textContent = rest.join(" "); box.classList.remove("d-none"); }
}
// pages dihitung dari `count`, bukan dari data yang tampil.
export function renderPagination(el, { page, pages, onChange }) {
  if (pages <= 1) { el.innerHTML = ""; return; }
  const items = [];
  for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - page) <= 1) items.push(i);
  const li = (label, p, cls = "", dis = false, cur = false) =>
    `<li class="page-item ${cls}${dis ? " disabled" : ""}${cur ? " active" : ""}"><a class="page-link" href="#" data-p="${p}"${cur ? ' aria-current="page"' : ""}>${label}</a></li>`;
  let html = li("Previous", page - 1, "", page === 1);
  let last = 0;
  for (const i of items) { if (i - last > 1) html += `<li class="page-item disabled d-none d-sm-block"><span class="page-link">…</span></li>`; html += li(i, i, "d-none d-sm-block", false, i === page); last = i; }
  html += `<li class="page-item disabled d-sm-none"><span class="page-link">Halaman ${page} / ${pages}</span></li>` + li("Next", page + 1, "", page === pages);
  el.innerHTML = `<ul class="pagination mb-0 justify-content-between justify-content-sm-center">${html}</ul>`;
  el.onclick = (e) => { const a = e.target.closest("[data-p]"); if (a) { e.preventDefault(); if (!a.parentElement.classList.contains("disabled")) onChange(+a.dataset.p); } };
}
export const stateBox = (el, kind, text) => { el.innerHTML = `<div class="state state-${kind}" ${kind === "error" ? 'role="alert"' : ""}>${esc(text)}</div>`; };
