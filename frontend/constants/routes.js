// constants/routes.js
// Central place for every screen name used in navigation.navigate("...").
// Import these instead of typing raw strings so typos get caught immediately.
export default {
  // Auth stack (Member 1)
  SPLASH: "Splash",
  LOGIN: "Login",
  REGISTER: "Register",
  FORGOT_PASSWORD: "ForgotPassword",

  // Root
  MAIN_TABS: "MainTabs",

  // Home stack (Member 2)
  HOME_FEED: "HomeFeed",
  CREATE_POST: "CreatePost",
  POST_DETAILS: "PostDetails",
  COMMENTS: "Comments",
  SEARCH: "Search",

  // Groups stack (Member 3)
  GROUPS: "Groups",
  GROUP_DETAILS: "GroupDetails",
  GROUP_CHAT: "GroupChat",
  NOTICE_BOARD: "NoticeBoard",
  NOTICE_DETAILS: "NoticeDetails",
  JOB_PORTAL: "JobPortal",
  JOB_DETAILS: "JobDetails",

  // Profile stack (Member 4)
  PROFILE: "Profile",
  EDIT_PROFILE: "EditProfile",
  SETTINGS: "Settings",
  NOTIFICATIONS: "Notifications",
  ADMIN_DASHBOARD: "AdminDashboard",
  USER_MANAGEMENT: "UserManagement",

  // Tab names
  TAB_HOME: "HomeTab",
  TAB_SEARCH: "SearchTab",
  TAB_CREATE: "CreateTab",
  TAB_GROUPS: "GroupsTab",
  TAB_PROFILE: "ProfileTab",
};
