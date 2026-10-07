import { api } from "./client.js";
import { PATHS as P } from "../config.js";
export const auth = {
  login: (b) => api.post(P.login, b, { auth: false }),
  register: (b) => api.post(P.register, b, { auth: false }),
  logout: (refresh) => api.post(P.logout, { refresh }),
};
export const getDashboard = () => api.get(P.dashboard);
export const categories = {
  list: (page = 1) => api.get(P.category, { page }),
  async all() { let page = 1, out = [], r; do { r = await this.list(page++); out.push(...r.results); } while (r.next); return out; },
  create: (b) => api.post(P.category, b),
  update: (id, b) => api.patch(`${P.category}${id}/`, b),
  remove: (id) => api.delete(`${P.category}${id}/`),
};
export const transactions = {
  list: (q) => api.get(P.transaction, q),
  create: (b) => api.post(P.transaction, b),
  update: (id, b) => api.patch(`${P.transaction}${id}/`, b),
  remove: (id) => api.delete(`${P.transaction}${id}/`),
};
