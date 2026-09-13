import api from "./axios";

export async function fetchAdminDashboardStatsApi() {
  const { data } = await api.get("/admin/dashboard-stats");
  return data.data;
}

export async function fetchAdminUsersApi() {
  const { data } = await api.get("/admin/users");
  return data.data;
}

export async function updateAdminUserApi(userId, { role, status }) {
  const { data } = await api.put(`/admin/users/${userId}`, { role, status });
  return data.data;
}
