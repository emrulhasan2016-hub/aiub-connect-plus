PRAGMA foreign_keys = ON;

-- USERS (Member 1 - Auth)
CREATE TABLE IF NOT EXISTS users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name      TEXT    NOT NULL,
  username       TEXT    NOT NULL UNIQUE,
  email          TEXT    NOT NULL UNIQUE,
  password_hash  TEXT    NOT NULL,
  role           TEXT    NOT NULL CHECK (role IN ('Student','Faculty','Alumni','Admin')),
  department     TEXT,
  student_id     TEXT,
  bio            TEXT    DEFAULT '',
  avatar_url     TEXT,
  cover_url      TEXT,
  status         TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active','banned')),
  is_super_admin INTEGER NOT NULL DEFAULT 0 CHECK (is_super_admin IN (0,1)),
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

CREATE TABLE IF NOT EXISTS follows (
  follower_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followee_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (follower_id, followee_id)
);

-- POSTS / COMMENTS / LIKES (Member 2 - Home Feed)
CREATE TABLE IF NOT EXISTS posts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category    TEXT    NOT NULL,
  content     TEXT    NOT NULL,
  image_url   TEXT,
  visibility  TEXT    NOT NULL DEFAULT 'Public' CHECK (visibility IN ('Public','Group Only')),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_user       ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

CREATE TABLE IF NOT EXISTS comments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id   INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  text        TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_comments_post   ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

CREATE TABLE IF NOT EXISTS likes (
  post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (post_id, user_id)
);

-- GROUPS / MEMBERS / MESSAGES (Member 3 - Groups)
CREATE TABLE IF NOT EXISTS groups (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  description  TEXT DEFAULT '',
  category     TEXT NOT NULL,
  cover_url    TEXT,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS group_members (
  group_id  INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (group_id, user_id)
);
CREATE TABLE IF NOT EXISTS group_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id    INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_group_messages_group ON group_messages(group_id);

-- NOTICES / JOBS (Member 3)
CREATE TABLE IF NOT EXISTS notices (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL CHECK (category IN ('Academic','Exam','Assignment','Seminar','Workshop')),
  content      TEXT NOT NULL,
  attachments  TEXT DEFAULT '[]',
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS jobs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('Job','Internship','Freelancing','Scholarship')),
  company      TEXT NOT NULL,
  position     TEXT NOT NULL,
  description  TEXT NOT NULL,
  requirements TEXT DEFAULT '[]',
  deadline     TEXT NOT NULL,
  apply_link   TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- NOTIFICATIONS (Member 4 - Emrul)
CREATE TABLE IF NOT EXISTS notifications (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('Like','Comment','Reply','Group','Notice','Job')),
  text          TEXT NOT NULL,
  related_id    INTEGER,
  is_read       INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0,1)),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);