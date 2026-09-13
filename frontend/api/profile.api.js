import api from "./axios";

export async function fetchProfileApi() {
  const { data } = await api.get("/profile/me");
  return data.data;
}

export async function updateProfileApi({ fullName, department, bio }) {
  const { data } = await api.put("/profile/me", { fullName, department, bio });
  return data.data;
}
