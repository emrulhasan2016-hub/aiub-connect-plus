import api from "./axios";

export async function searchUsersApi(query) {
  const { data } = await api.get("/users", { params: { q: query } });
  return data.data;
}

export async function fetchUserApi(userId) {
  const { data } = await api.get(`/users/${userId}`);
  return data.data;
}

export async function toggleFollowApi(userId) {
  const { data } = await api.post(`/users/${userId}/follow`);
  return data.data;
}
