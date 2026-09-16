import API from "./axios";

export async function fetchJobsApi() {
  const { data } = await API.get("/jobs");
  return data.data;
}
