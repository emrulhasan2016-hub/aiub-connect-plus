// context/AppContext.js
// Holds ALL mock "database" data in memory + the actions that mutate it.
// Every screen reads from here via useContext(AppContext) instead of importing /data directly,
// so likes/comments/posts/etc. stay in sync across the whole app.

import React, { createContext, useReducer, useCallback } from "react";
import postsData from "../data/posts";
import commentsData from "../data/comments";
import noticesData from "../data/notices";
import jobsData from "../data/jobs";
import groupsData from "../data/groups";
import notificationsData from "../data/notifications";
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

export const AppContext = createContext(null);

const initialState = {
  posts: postsData,
  comments: commentsData,
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

function reducer(state, action) {
  switch (action.type) {
    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "EDIT_POST":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p,
        ),
      };
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.payload),
      };
    case "TOGGLE_LIKE": {
      const { postId, userId } = action.payload;
      return {
        ...state,
        posts: state.posts.map((p) => {
          if (p.id !== postId) return p;
          const liked = p.likedBy.includes(userId);
          return {
            ...p,
            likedBy: liked
              ? p.likedBy.filter((id) => id !== userId)
              : [...p.likedBy, userId],
          };
        }),
      };
    }
    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.payload] };
    case "ADD_REPLY":
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id === action.payload.commentId
            ? { ...c, replies: [...c.replies, action.payload.reply] }
            : c,
        ),
      };
    case "TOGGLE_GROUP_MEMBERSHIP": {
      const { groupId, userId } = action.payload;
      return {
        ...state,
        groups: state.groups.map((g) => {
          if (g.id !== groupId) return g;
          const isMember = g.memberIds.includes(userId);
          return {
            ...g,
            memberIds: isMember
              ? g.memberIds.filter((id) => id !== userId)
              : [...g.memberIds, userId],
          };
        }),
      };
    }
    case "SEND_GROUP_MESSAGE":
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === action.payload.groupId
            ? { ...g, messages: [...g.messages, action.payload.message] }
            : g,
        ),
      };
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

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
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
