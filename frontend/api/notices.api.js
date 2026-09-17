import API from "./axios";

export async function fetchNoticesApi() {
  const { data } = await API.get("/notices");
  return data.data;
}
