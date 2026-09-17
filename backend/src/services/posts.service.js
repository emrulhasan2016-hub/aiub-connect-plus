// OWNED BY: Member 2 (Sajib) - Home Feed

const db = require("../database/db");
const AppError = require("../utils/AppError");
const { createNotification } = require("./notifications.service");

const AUTHOR_FIELDS = `
  u.id          AS author_id,
  u.full_name   AS author_full_name,
  u.username    AS author_username,
  u.role        AS author_role,
  u.department  AS author_department,
  u.avatar_url  AS author_avatar
`;

function mapAuthor(row) {
  return {
    id: row.author_id,
    fullName: row.author_full_name,
    username: row.author_username,
    role: row.author_role,
    department: row.author_department,
    avatar: row.author_avatar,
  };
}

// POSTS

function mapPostRow(row, currentUserId) {
  const likedByRows = db
    .prepare(`SELECT user_id FROM likes WHERE post_id = ?`)
    .all(row.id);
  const likedBy = likedByRows.map((r) => r.user_id);

  return {
    id: row.id,
    userId: row.user_id,
    category: row.category,
    content: row.content,
    image: row.image_url,
    visibility: row.visibility,
    createdAt: row.created_at,
    likedBy,
    likedByMe: likedBy.includes(currentUserId),
    commentCount: row.comment_count,
    author: mapAuthor(row),
  };
}

function listPosts(currentUserId) {
  const rows = db
    .prepare(
      `
      SELECT
        p.*,
        ${AUTHOR_FIELDS},
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC, p.id DESC
      `,
    )
    .all();

  return rows.map((row) => mapPostRow(row, currentUserId));
}

function getPostById(postId, currentUserId) {
  const row = db
    .prepare(
      `
      SELECT
        p.*,
        ${AUTHOR_FIELDS},
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
      `,
    )
    .get(postId);

  if (!row) {
    throw new AppError(404, "Post not found.");
  }
  return mapPostRow(row, currentUserId);
}

function createPost(userId, { content, category, image, visibility }) {
  const info = db
    .prepare(
      `INSERT INTO posts (user_id, category, content, image_url, visibility)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(userId, category, content, image, visibility);

  return getPostById(info.lastInsertRowid, userId);
}

function toggleLike(postId, userId) {
  const post = db
    .prepare(`SELECT id, user_id FROM posts WHERE id = ?`)
    .get(postId);
  if (!post) {
    throw new AppError(404, "Post not found.");
  }

  const existing = db
    .prepare(`SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?`)
    .get(postId, userId);

  if (existing) {
    db.prepare(`DELETE FROM likes WHERE post_id = ? AND user_id = ?`).run(
      postId,
      userId,
    );
  } else {
    db.prepare(`INSERT INTO likes (post_id, user_id) VALUES (?, ?)`).run(
      postId,
      userId,
    );

    if (post.user_id !== userId) {
      const liker = db
        .prepare(`SELECT full_name FROM users WHERE id = ?`)
        .get(userId);
      createNotification(
        post.user_id,
        "Like",
        `${liker.full_name} liked your post.`,
        postId,
      );
    }
  }

  return getPostById(postId, userId);
}

// COMMENTS

function mapCommentRow(row) {
  return {
    id: row.id,
    postId: row.post_id,
    userId: row.user_id,
    parentId: row.parent_id,
    text: row.text,
    createdAt: row.created_at,
    author: mapAuthor(row),
    replies: (row.replies || []).map(mapCommentRow),
  };
}

function buildCommentTree(rows) {
  const byId = new Map();
  rows.forEach((r) => byId.set(r.id, { ...r, replies: [] }));

  const roots = [];
  rows.forEach((r) => {
    const node = byId.get(r.id);
    if (r.parent_id) {
      const parent = byId.get(r.parent_id);
      if (parent) parent.replies.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function listComments(postId) {
  const post = db.prepare(`SELECT id FROM posts WHERE id = ?`).get(postId);
  if (!post) {
    throw new AppError(404, "Post not found.");
  }

  const rows = db
    .prepare(
      `
      SELECT c.*, ${AUTHOR_FIELDS}
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC, c.id ASC
      `,
    )
    .all(postId);

  return buildCommentTree(rows).map(mapCommentRow);
}

function addComment(postId, userId, { text, parentId }) {
  const post = db
    .prepare(`SELECT id, user_id FROM posts WHERE id = ?`)
    .get(postId);
  if (!post) {
    throw new AppError(404, "Post not found.");
  }

  if (parentId) {
    const parent = db
      .prepare(`SELECT id, post_id, parent_id FROM comments WHERE id = ?`)
      .get(parentId);

    if (!parent || parent.post_id !== Number(postId)) {
      throw new AppError(
        400,
        "The comment you are replying to does not exist on this post.",
      );
    }
    if (parent.parent_id) {
      throw new AppError(
        400,
        "Cannot reply to a reply. Reply to the original comment instead.",
      );
    }
  }

  const info = db
    .prepare(
      `INSERT INTO comments (post_id, user_id, parent_id, text) VALUES (?, ?, ?, ?)`,
    )
    .run(postId, userId, parentId, text);

  const row = db
    .prepare(
      `
      SELECT c.*, ${AUTHOR_FIELDS}
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
      `,
    )
    .get(info.lastInsertRowid);

  if (post.user_id !== userId) {
    const commenter = db
      .prepare(`SELECT full_name FROM users WHERE id = ?`)
      .get(userId);
    createNotification(
      post.user_id,
      "Comment",
      `${commenter.full_name} commented on your post.`,
      postId,
    );
  }

  return mapCommentRow({ ...row, replies: [] });
}

module.exports = {
  listPosts,
  getPostById,
  createPost,
  toggleLike,
  listComments,
  addComment,
};
