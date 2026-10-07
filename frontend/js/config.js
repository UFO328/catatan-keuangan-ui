// Satu-satunya tempat untuk mengganti server. Production: https://catatan-keuangan-zeta-sand.vercel.app
export const API_BASE_URL = "https://catatan-keuangan-zeta-sand.vercel.app";
export const PATHS = {
  login: "/auth/catatan_keuangan/api/login/",
  register: "/auth/catatan_keuangan/api/register/",
  logout: "/auth/catatan_keuangan/api/logout/",
  // Endpoint refresh TIDAK ada di OpenAPI; sesuaikan dengan urls.py backend-mu.
  refresh: "/auth/catatan_keuangan/api/token/refresh/",
  dashboard: "/dashboard/catatan_keuangan/api/dashboard/",
  category: "/transaction/catatan_keuangan/api/category/",
  transaction: "/transaction/catatan_keuangan/api/transaction/",
};
export const PAGE_SIZE = 10;
