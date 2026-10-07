import { auth } from "../api/resources.js";
import { setBusy, setFieldErrors, clearErrors } from "../components/ui.js";
const form = document.getElementById("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault(); clearErrors(form);
  const btn = form.querySelector("[type=submit]");
  if (btn.disabled) return;
  if (form.password.value.length < 8) return setFieldErrors(form, { data: { password: ["Password minimal 8 karakter."] } });
  setBusy(btn, true, "Memproses...");
  try {
    await auth.register({ username: form.username.value.trim(), email: form.email.value.trim(), password: form.password.value });
    sessionStorage.setItem("ck_flash", "Akun berhasil dibuat. Silakan masuk.");
    location.replace("login.html");
  } catch (err) { setFieldErrors(form, err); setBusy(btn, false); }
});
