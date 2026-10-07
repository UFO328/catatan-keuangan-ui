import { session } from "../api/client.js";
import { auth } from "../api/resources.js";
import { setBusy, setFieldErrors, clearErrors } from "../components/ui.js";
if (session.get()) location.replace("dashboard.html");
const form = document.getElementById("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault(); clearErrors(form);
  const btn = form.querySelector("[type=submit]");
  if (btn.disabled) return;
  setBusy(btn, true, "Memproses...");
  try {
    const d = await auth.login({ username: form.username.value.trim(), password: form.password.value });
    session.set({ access: d.access, refresh: d.refresh, username: d.username, id: d.id });
    location.replace("dashboard.html");
  } catch (err) {
    if (err.status === 401) err.data = { detail: "Username atau password salah." }, err.message = "Username atau password salah.";
    setFieldErrors(form, err.status === 401 ? { data: null, message: err.message } : err);
    setBusy(btn, false);
  }
});
import { toast } from "../components/ui.js";
const flash = sessionStorage.getItem("ck_flash");
if (flash) { sessionStorage.removeItem("ck_flash"); toast(flash); }
