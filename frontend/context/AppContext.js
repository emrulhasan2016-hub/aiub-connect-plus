import React, { createContext, useReducer, useCallback } from "react";
import {
  fetchNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "../api/notifications.api";
import {
  fetchAdminDashboardStatsApi,
  fetchAdminUsersApi,
  updateAdminUserApi,
  createAdminApi,
} from "../api/admin.api";
import {
  fetchPostsApi,
  fetchPostApi,
  createPostApi,
  toggleLikeApi,
  fetchCommentsApi,
  addCommentApi,
} from "../api/posts.api";
import {
  fetchGroupsApi,
  toggleGroupMembershipApi,
  fetchGroupMessagesApi,
  sendGroupMessageApi,
} from "../api/groups.api";
import { fetchNoticesApi } from "../api/notices.api";
import { fetchJobsApi } from "../api/jobs.api";

export const AppContext = createContext(null);

const initialState = {
  posts: [],
  postsStatus: "idle",
  postsError: null,
  comments: [],
  commentsByPost: {},

  groups: [],
  groupsStatus: "idle",
  groupsError: null,
  groupMessagesByGroup: {},

  notices: [],
  noticesStatus: "idle",
  noticesError: null,

  jobs: [],
  jobsStatus: "idle",
  jobsError: null,

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
    flat.push({
      id: node.id,
      postId,
      userId: node.userId,
      text: node.text,
      createdAt: node.createdAt,
    });
    (node.replies || []).forEach(walk);
  }
  tree.forEach(walk);
  return flat;
}

function insertCommentIntoTree(tree, comment, parentId) {
  if (!parentId) return [...tree, comment];
  return tree.map((node) =>
    node.id === parentId
      ? { ...node, replies: [...node.replies, comment] }
      : node,
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "POSTS_LOADING":
      return { ...state, postsStatus: "loading", postsError: null };
    case "POSTS_LOADED":
      return {
        ...state,
        postsStatus: "success",
        postsError: null,
        posts: action.payload,
      };
    case "POSTS_ERROR":
      return { ...state, postsStatus: "error", postsError: action.payload };
    case "POST_CREATED":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "POST_UPDATED": {
      const exists = state.posts.some((p) => p.id === action.payload.id);
      return {
        ...state,
        posts: exists
          ? state.posts.map((p) =>
              p.id === action.payload.id ? action.payload : p,
            )
          : [action.payload, ...state.posts],
      };
    }

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
      const commentsWithoutThisPost = state.comments.filter(
        (c) => c.postId !== postId,
      );
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: { status: "success", error: null, tree },
        },
        comments: [...commentsWithoutThisPost, ...flattenedForThisPost],
      };
    }
    case "COMMENTS_ERROR": {
      const { postId, message } = action.payload;
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: {
            status: "error",
            error: message,
            tree: state.commentsByPost[postId]?.tree || [],
          },
        },
      };
    }
    case "COMMENT_ADDED": {
      const { postId, comment, parentId } = action.payload;
      const existingEntry = state.commentsByPost[postId] || {
        status: "success",
        error: null,
        tree: [],
      };
      const newTree = insertCommentIntoTree(
        existingEntry.tree,
        comment,
        parentId,
      );
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: { ...existingEntry, tree: newTree },
        },
        comments: [
          ...state.comments,
          {
            id: comment.id,
            postId,
            userId: comment.userId,
            text: comment.text,
            createdAt: comment.createdAt,
          },
        ],
        posts: state.posts.map((p) =>
          p.id === postId
            ? { ...p, commentCount: (p.commentCount || 0) + 1 }
            : p,
        ),
      };
    }

    // ---- GROUPS (now backed by the real API, not data/groups.js) ----
    case "GROUPS_LOADING":
      return { ...state, groupsStatus: "loading", groupsError: null };
    case "GROUPS_LOADED":
      return {
        ...state,
        groupsStatus: "success",
        groupsError: null,
        groups: action.payload,
      };
    case "GROUPS_ERROR":
      return { ...state, groupsStatus: "error", groupsError: action.payload };
    case "GROUP_UPDATED": {
      const exists = state.groups.some((g) => g.id === action.payload.id);
      return {
        ...state,
        groups: exists
          ? state.groups.map((g) =>
              g.id === action.payload.id ? action.payload : g,
            )
          : [action.payload, ...state.groups],
      };
    }
    case "GROUP_MESSAGES_LOADING":
      return {
        ...state,
        groupMessagesByGroup: {
          ...state.groupMessagesByGroup,
          [action.payload]: {
            status: "loading",
            error: null,
            messages:
              state.groupMessagesByGroup[action.payload]?.messages || [],
          },
        },
      };
    case "GROUP_MESSAGES_LOADED":
      return {
        ...state,
        groupMessagesByGroup: {
          ...state.groupMessagesByGroup,
          [action.payload.groupId]: {
            status: "success",
            error: null,
            messages: action.payload.messages,
          },
        },
      };
    case "GROUP_MESSAGES_ERROR":
      return {
        ...state,
        groupMessagesByGroup: {
          ...state.groupMessagesByGroup,
          [action.payload.groupId]: {
            status: "error",
            error: action.payload.message,
            messages:
              state.groupMessagesByGroup[action.payload.groupId]?.messages ||
              [],
          },
        },
      };
    case "GROUP_MESSAGE_SENT": {
      const { groupId, message } = action.payload;
      const existing = state.groupMessagesByGroup[groupId] || {
        status: "success",
        error: null,
        messages: [],
      };
      return {
        ...state,
        groupMessagesByGroup: {
          ...state.groupMessagesByGroup,
          [groupId]: {
            ...existing,
            messages: [...existing.messages, message],
          },
        },
      };
    }

    // ---- NOTICES (now backed by the real API, not data/notices.js) ----
    case "NOTICES_LOADING":
      return { ...state, noticesStatus: "loading", noticesError: null };
    case "NOTICES_LOADED":
      return {
        ...state,
        noticesStatus: "success",
        noticesError: null,
        notices: action.payload,
      };
    case "NOTICES_ERROR":
      return {
        ...state,
        noticesStatus: "error",
        noticesError: action.payload,
      };

    // ---- JOBS (now backed by the real API, not data/jobs.js) ----
    case "JOBS_LOADING":
      return { ...state, jobsStatus: "loading", jobsError: null };
    case "JOBS_LOADED":
      return {
        ...state,
        jobsStatus: "success",
        jobsError: null,
        jobs: action.payload,
      };
    case "JOBS_ERROR":
      return { ...state, jobsStatus: "error", jobsError: action.payload };

    case "NOTIFICATIONS_LOADING":
      return {
        ...state,
        notificationsStatus: "loading",
        notificationsError: null,
      };
    case "NOTIFICATIONS_LOADED":
      return {
        ...state,
        notificationsStatus: "success",
        notificationsError: null,
        notifications: action.payload,
      };
    case "NOTIFICATIONS_ERROR":
      return {
        ...state,
        notificationsStatus: "error",
        notificationsError: action.payload,
      };

    case "ADMIN_STATS_LOADING":
      return { ...state, adminStatsStatus: "loading", adminStatsError: null };
    case "ADMIN_STATS_LOADED":
      return {
        ...state,
        adminStatsStatus: "success",
        adminStatsError: null,
        adminStats: action.payload,
      };
    case "ADMIN_STATS_ERROR":
      return {
        ...state,
        adminStatsStatus: "error",
        adminStatsError: action.payload,
      };
    case "ADMIN_USERS_LOADING":
      return { ...state, adminUsersStatus: "loading", adminUsersError: null };
    case "ADMIN_USERS_LOADED":
      return {
        ...state,
        adminUsersStatus: "success",
        adminUsersError: null,
        adminUsers: action.payload,
      };
    case "ADMIN_USERS_ERROR":
      return {
        ...state,
        adminUsersStatus: "error",
        adminUsersError: action.payload,
      };
    case "ADMIN_USER_UPDATED":
      return {
        ...state,
        adminUsers: state.adminUsers.map((u) =>
          u.id === action.payload.id ? action.payload : u,
        ),
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchPosts = useCallback(async () => {
    dispatch({ type: "POSTS_LOADING" });
    try {
      const posts = await fetchPostsApi();
      dispatch({ type: "POSTS_LOADED", payload: posts });
    } catch (err) {
      dispatch({
        type: "POSTS_ERROR",
        payload: err.message || "Failed to load posts.",
      });
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
      dispatch({
        type: "COMMENTS_ERROR",
        payload: { postId, message: err.message || "Failed to load comments." },
      });
    }
  }, []);

  const addComment = useCallback(async (postId, { text, parentId }) => {
    const comment = await addCommentApi(postId, { text, parentId });
    dispatch({ type: "COMMENT_ADDED", payload: { postId, comment, parentId } });
    return comment;
  }, []);

  // ---- GROUPS ----
  const fetchGroups = useCallback(async () => {
    dispatch({ type: "GROUPS_LOADING" });
    try {
      const groups = await fetchGroupsApi();
      dispatch({ type: "GROUPS_LOADED", payload: groups });
    } catch (err) {
      dispatch({
        type: "GROUPS_ERROR",
        payload: err.message || "Failed to load groups.",
      });
    }
  }, []);

  const toggleGroupMembership = useCallback(async (groupId) => {
    const group = await toggleGroupMembershipApi(groupId);
    dispatch({ type: "GROUP_UPDATED", payload: group });
    return group;
  }, []);

  const fetchGroupMessages = useCallback(async (groupId) => {
    dispatch({ type: "GROUP_MESSAGES_LOADING", payload: groupId });
    try {
      const messages = await fetchGroupMessagesApi(groupId);
      dispatch({
        type: "GROUP_MESSAGES_LOADED",
        payload: { groupId, messages },
      });
    } catch (err) {
      dispatch({
        type: "GROUP_MESSAGES_ERROR",
        payload: {
          groupId,
          message: err.message || "Failed to load messages.",
        },
      });
    }
  }, []);

  const sendGroupMessage = useCallback(async (groupId, text) => {
    const message = await sendGroupMessageApi(groupId, text);
    dispatch({ type: "GROUP_MESSAGE_SENT", payload: { groupId, message } });
    return message;
  }, []);

  // ---- NOTICES ----
  const fetchNotices = useCallback(async () => {
    dispatch({ type: "NOTICES_LOADING" });
    try {
      const notices = await fetchNoticesApi();
      dispatch({ type: "NOTICES_LOADED", payload: notices });
    } catch (err) {
      dispatch({
        type: "NOTICES_ERROR",
        payload: err.message || "Failed to load notices.",
      });
    }
  }, []);

  // ---- JOBS ----
  const fetchJobs = useCallback(async () => {
    dispatch({ type: "JOBS_LOADING" });
    try {
      const jobs = await fetchJobsApi();
      dispatch({ type: "JOBS_LOADED", payload: jobs });
    } catch (err) {
      dispatch({
        type: "JOBS_ERROR",
        payload: err.message || "Failed to load jobs.",
      });
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    dispatch({ type: "NOTIFICATIONS_LOADING" });
    try {
      const notifications = await fetchNotificationsApi();
      dispatch({ type: "NOTIFICATIONS_LOADED", payload: notifications });
    } catch (err) {
      dispatch({
        type: "NOTIFICATIONS_ERROR",
        payload: err.message || "Failed to load notifications.",
      });
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

  const fetchAdminStats = useCallback(async () => {
    dispatch({ type: "ADMIN_STATS_LOADING" });
    try {
      const stats = await fetchAdminDashboardStatsApi();
      dispatch({ type: "ADMIN_STATS_LOADED", payload: stats });
    } catch (err) {
      dispatch({
        type: "ADMIN_STATS_ERROR",
        payload: err.message || "Failed to load dashboard stats.",
      });
    }
  }, []);

  const fetchAdminUsers = useCallback(async () => {
    dispatch({ type: "ADMIN_USERS_LOADING" });
    try {
      const users = await fetchAdminUsersApi();
      dispatch({ type: "ADMIN_USERS_LOADED", payload: users });
    } catch (err) {
      dispatch({
        type: "ADMIN_USERS_ERROR",
        payload: err.message || "Failed to load users.",
      });
    }
  }, []);

  const updateAdminUser = useCallback(async (userId, payload) => {
    const user = await updateAdminUserApi(userId, payload);
    dispatch({ type: "ADMIN_USER_UPDATED", payload: user });
    return user;
  }, []);

  const createAdmin = useCallback(
    async (payload) => {
      const admin = await createAdminApi(payload);
      dispatch({
        type: "ADMIN_USERS_LOADED",
        payload: [admin, ...state.adminUsers],
      });
      return admin;
    },
    [state.adminUsers],
  );

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
        fetchGroups,
        toggleGroupMembership,
        fetchGroupMessages,
        sendGroupMessage,
        fetchNotices,
        fetchJobs,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        fetchAdminStats,
        fetchAdminUsers,
        updateAdminUser,
        createAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
