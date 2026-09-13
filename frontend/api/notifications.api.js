import api from "./axios";

export async function fetchNotificationsApi() {
  const { data } = await api.get("/notifications");
  return data.data;
}
export async function markNotificationReadApi(id) {
  const { data } = await api.put("/notifications", { id });
  return data.data;
}
export async function markAllNotificationsReadApi() {
  const { data } = await api.put("/notifications", { markAll: true });
  return data.data;
}
