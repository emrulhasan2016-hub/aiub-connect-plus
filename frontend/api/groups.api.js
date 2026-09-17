// api/groups.api.js
import API from "./axios";

export async function fetchGroupsApi() {
  const { data } = await API.get("/groups");
  return data.data;
}

export async function toggleGroupMembershipApi(groupId) {
  const { data } = await API.post(`/groups/${groupId}/join`);
  return data.data;
}

export async function fetchGroupMessagesApi(groupId) {
  const { data } = await API.get(`/groups/${groupId}/messages`);
  return data.data;
}

export async function sendGroupMessageApi(groupId, text) {
  const { data } = await API.post(`/groups/${groupId}/messages`, { text });
  return data.data;
}
