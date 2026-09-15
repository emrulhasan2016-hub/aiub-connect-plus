// context/AppContext.js
import React, { createContext, useReducer, useCallback } from "react";
import noticesData from "../data/notices";
import jobsData from "../data/jobs";
import groupsData from "../data/groups";
import {
  fetchNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "../api/notifications.api";
import {
  fetchAdminDashboardStatsApi,
  fetchAdminUsersApi,
  updateAdminUserApi,
} from "../api/admin.api";
import {
  fetchPostsApi,
  fetchPostApi,
  createPostApi,
  toggleLikeApi,
  fetchCommentsApi,
  addCommentApi,
} from "../api/posts.api";

export const AppContext = createContext(null);

const initialState = {
  // ---- Member 2 (Sajib) - backend-sourced ----
  posts: [],
  postsStatus: "idle",
  postsError: null,
  comments: [],
  commentsByPost: {},

  // ---- Members 3 & 4 ----
  notices: noticesData,
  jobs: jobsData,
  groups: groupsData,
  notifications: [],
  notificationsStatus: "idle",
  notificationsError: null,
  adminStats: null,
  adminStatsStatus: "idle",
  adminStatsError: null,
  adminUsers: [],
  adminUsersStatus: "idle",
  adminUsersError: null,
};

function flattenCommentTree(tree, postId) {
  const flat = [];
  function walk(node) {
    flat.push({ id: node.id, postId, userId: node.userId, text: node.text, createdAt: node.createdAt });
    (node.replies || []).forEach(walk);
  }
  tree.forEach(walk);
  return flat;
}

function insertCommentIntoTree(tree, comment, parentId) {
  if (!parentId) return [...tree, comment];
  return tree.map((node) =>
    node.id === parentId ? { ...node, replies: [...node.replies, comment] } : node
  );
}

function reducer(state, action) {
  switch (action.type) {
    // ---- Posts (Member 2) ----
    case "POSTS_LOADING":
      return { ...state, postsStatus: "loading", postsError: null };
    case "POSTS_LOADED":
      return { ...state, postsStatus: "success", postsError: null, posts: action.payload };
    case "POSTS_ERROR":
      return { ...state, postsStatus: "error", postsError: action.payload };
    case "POST_CREATED":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "POST_UPDATED": {
      const exists = state.posts.some((p) => p.id === action.payload.id);
      return {
        ...state,
        posts: exists
          ? state.posts.map((p) => (p.id === action.payload.id ? action.payload : p))
          : [action.payload, ...state.posts],
      };
    }

    // ---- Comments (Member 2) ----
    case "COMMENTS_LOADING":
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [action.payload]: {
            status: "loading",
            error: null,
            tree: state.commentsByPost[action.payload]?.tree || [],
          },
        },
      };
    case "COMMENTS_LOADED": {
      const { postId, tree } = action.payload;
      const flattenedForThisPost = flattenCommentTree(tree, postId);
      const commentsWithoutThisPost = state.comments.filter((c) => c.postId !== postId);
      return {
        ...state,
        commentsByPost: { ...state.commentsByPost, [postId]: { status: "success", error: null, tree } },
        comments: [...commentsWithoutThisPost, ...flattenedForThisPost],
      };
    }
    case "COMMENTS_ERROR": {
      const { postId, message } = action.payload;
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: { status: "error", error: message, tree: state.commentsByPost[postId]?.tree || [] },
        },
      };
    }
    case "COMMENT_ADDED": {
      const { postId, comment, parentId } = action.payload;
      const existingEntry = state.commentsByPost[postId] || { status: "success", error: null, tree: [] };
      const newTree = insertCommentIntoTree(existingEntry.tree, comment, parentId);
      return {
        ...state,
        commentsByPost: { ...state.commentsByPost, [postId]: { ...existingEntry, tree: newTree } },
        comments: [
          ...state.comments,
          { id: comment.id, postId, userId: comment.userId, text: comment.text, createdAt: comment.createdAt },
        ],
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
        ),
      };
    }

    // ---- Groups (Member 3) - unchanged ----
    case "TOGGLE_GROUP_MEMBERSHIP": {
      const { groupId, userId } = action.payload;
      return {
        ...state,
        groups: state.groups.map((g) => {
          if (g.id !== groupId) return g;
          const isMember = g.memberIds.includes(userId);
          return {
            ...g,
            memberIds: isMember ? g.memberIds.filter((id) => id !== userId) : [...g.memberIds, userId],
          };
        }),
      };
    }
    case "SEND_GROUP_MESSAGE":
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === action.payload.groupId ? { ...g, messages: [...g.messages, action.payload.message] } : g
        ),
      };

    // ---- Notifications (Member 4) - unchanged ----
    case "NOTIFICATIONS_LOADING":
      return { ...state, notificationsStatus: "loading", notificationsError: null };
    case "NOTIFICATIONS_LOADED":
      return { ...state, notificationsStatus: "success", notificationsError: null, notifications: action.payload };
    case "NOTIFICATIONS_ERROR":
      return { ...state, notificationsStatus: "error", notificationsError: action.payload };

    // ---- Admin (Member 4) - unchanged ----
    case "ADMIN_STATS_LOADING":
      return { ...state, adminStatsStatus: "loading", adminStatsError: null };
    case "ADMIN_STATS_LOADED":
      return { ...state, adminStatsStatus: "success", adminStatsError: null, adminStats: action.payload };
    case "ADMIN_STATS_ERROR":
      return { ...state, adminStatsStatus: "error", adminStatsError: action.payload };
    case "ADMIN_USERS_LOADING":
      return { ...state, adminUsersStatus: "loading", adminUsersError: null };
    case "ADMIN_USERS_LOADED":
      return { ...state, adminUsersStatus: "success", adminUsersError: null, adminUsers: action.payload };
    case "ADMIN_USERS_ERROR":
      return { ...state, adminUsersStatus: "error", adminUsersError: action.payload };
    case "ADMIN_USER_UPDATED":
      return { ...state, adminUsers: state.adminUsers.map((u) => (u.id === action.payload.id ? action.payload : u)) };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ---- Posts (Member 2) ----
  const fetchPosts = useCallback(async () => {
    dispatch({ type: "POSTS_LOADING" });
    try {
      const posts = await fetchPostsApi();
      dispatch({ type: "POSTS_LOADED", payload: posts });
    } catch (err) {
      dispatch({ type: "POSTS_ERROR", payload: err.message || "Failed to load posts." });
    }
  }, []);

  const fetchPost = useCallback(async (postId) => {
    const post = await fetchPostApi(postId);
    dispatch({ type: "POST_UPDATED", payload: post });
    return post;
  }, []);

  const createPost = useCallback(async (payload) => {
    const post = await createPostApi(payload);
    dispatch({ type: "POST_CREATED", payload: post });
    return post;
  }, []);

  const toggleLike = useCallback(async (postId) => {
    const post = await toggleLikeApi(postId);
    dispatch({ type: "POST_UPDATED", payload: post });
    return post;
  }, []);

  const fetchComments = useCallback(async (postId) => {
    dispatch({ type: "COMMENTS_LOADING", payload: postId });
    try {
      const tree = await fetchCommentsApi(postId);
      dispatch({ type: "COMMENTS_LOADED", payload: { postId, tree } });
    } catch (err) {
      dispatch({ type: "COMMENTS_ERROR", payload: { postId, message: err.message || "Failed to load comments." } });
    }
  }, []);

  const addComment = useCallback(async (postId, { text, parentId }) => {
    const comment = await addCommentApi(postId, { text, parentId });
    dispatch({ type: "COMMENT_ADDED", payload: { postId, comment, parentId } });
    return comment;
  }, []);

  // ---- Notifications (Member 4) - unchanged ----
  const fetchNotifications = useCallback(async () => {
    dispatch({ type: "NOTIFICATIONS_LOADING" });
    try {
      const notifications = await fetchNotificationsApi();
      dispatch({ type: "NOTIFICATIONS_LOADED", payload: notifications });
    } catch (err) {
      dispatch({ type: "NOTIFICATIONS_ERROR", payload: err.message || "Failed to load notifications." });
    }
  }, []);

  const markNotificationRead = useCallback(async (notificationId) => {
    const notifications = await markNotificationReadApi(notificationId);
    dispatch({ type: "NOTIFICATIONS_LOADED", payload: notifications });
    return notifications;
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    const notifications = await markAllNotificationsReadApi();
    dispatch({ type: "NOTIFICATIONS_LOADED", payload: notifications });
    return notifications;
  }, []);

  // ---- Admin (Member 4) - unchanged ----
  const fetchAdminStats = useCallback(async () => {
    dispatch({ type: "ADMIN_STATS_LOADING" });
    try {
      const stats = await fetchAdminDashboardStatsApi();
      dispatch({ type: "ADMIN_STATS_LOADED", payload: stats });
    } catch (err) {
      dispatch({ type: "ADMIN_STATS_ERROR", payload: err.message || "Failed to load dashboard stats." });
    }
  }, []);

  const fetchAdminUsers = useCallback(async () => {
    dispatch({ type: "ADMIN_USERS_LOADING" });
    try {
      const users = await fetchAdminUsersApi();
      dispatch({ type: "ADMIN_USERS_LOADED", payload: users });
    } catch (err) {
      dispatch({ type: "ADMIN_USERS_ERROR", payload: err.message || "Failed to load users." });
    }
  }, []);

  const updateAdminUser = useCallback(async (userId, payload) => {
    const user = await updateAdminUserApi(userId, payload);
    dispatch({ type: "ADMIN_USER_UPDATED", payload: user });
    return user;
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        fetchPosts,
        fetchPost,
        createPost,
        toggleLike,
        fetchComments,
        addComment,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        fetchAdminStats,
        fetchAdminUsers,
        updateAdminUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}