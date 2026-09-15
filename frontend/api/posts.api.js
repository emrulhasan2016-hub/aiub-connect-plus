// api/posts.api.js
// OWNED BY: Member 2 (Sajib) - Home Feed
import API from "./axios";

export async function fetchPostsApi() {
  const { data } = await API.get("/posts");
  return data.data;
}

export async function fetchPostApi(postId) {
  const { data } = await API.get(`/posts/${postId}`);
  return data.data;
}

export async function createPostApi({ content, category, image, visibility }) {
  const { data } = await API.post("/posts", { content, category, image, visibility });
  return data.data;
}

export async function toggleLikeApi(postId) {
  const { data } = await API.post(`/posts/${postId}/like`);
  return data.data;
}

export async function fetchCommentsApi(postId) {
  const { data } = await API.get(`/posts/${postId}/comments`);
  return data.data;
}

export async function addCommentApi(postId, { text, parentId }) {
  const { data } = await API.post(`/posts/${postId}/comments`, { text, parentId });
  return data.data;
}