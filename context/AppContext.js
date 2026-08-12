// context/AppContext.js
// Holds ALL mock "database" data in memory + the actions that mutate it.
// Every screen reads from here via useContext(AppContext) instead of importing /data directly,
// so likes/comments/posts/etc. stay in sync across the whole app.

import React, { createContext, useReducer } from "react";
import postsData from "../data/posts";
import commentsData from "../data/comments";
import noticesData from "../data/notices";
import jobsData from "../data/jobs";
import groupsData from "../data/groups";
import notificationsData from "../data/notifications";

export const AppContext = createContext(null);

const initialState = {
  posts: postsData,
  comments: commentsData,
  notices: noticesData,
  jobs: jobsData,
  groups: groupsData,
  notifications: notificationsData,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "EDIT_POST":
      return {
        ...state,
        posts: state.posts.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p)),
      };
    case "DELETE_POST":
      return { ...state, posts: state.posts.filter((p) => p.id !== action.payload) };
    case "TOGGLE_LIKE": {
      const { postId, userId } = action.payload;
      return {
        ...state,
        posts: state.posts.map((p) => {
          if (p.id !== postId) return p;
          const liked = p.likedBy.includes(userId);
          return {
            ...p,
            likedBy: liked ? p.likedBy.filter((id) => id !== userId) : [...p.likedBy, userId],
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
            : c
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
            : g
        ),
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.recipientId === action.payload ? { ...n, read: true } : n
        ),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}
