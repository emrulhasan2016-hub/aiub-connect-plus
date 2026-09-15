// src/controllers/posts.controller.js
// OWNED BY: Member 2 (Sajib) - Home Feed

const postsService = require("../services/posts.service");
const { validateCreatePost, validateComment } = require("../validators/posts.validators");
const AppError = require("../utils/AppError");

function parseId(raw, label) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `Invalid ${label}.`);
  }
  return id;
}

function getPosts(req, res, next) {
  try {
    const posts = postsService.listPosts(req.user.id);
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
}

function getPost(req, res, next) {
  try {
    const postId = parseId(req.params.id, "post id");
    const post = postsService.getPostById(postId, req.user.id);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

function createPost(req, res, next) {
  try {
    const payload = validateCreatePost(req.body);
    const post = postsService.createPost(req.user.id, payload);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

function toggleLike(req, res, next) {
  try {
    const postId = parseId(req.params.id, "post id");
    const post = postsService.toggleLike(postId, req.user.id);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

function getComments(req, res, next) {
  try {
    const postId = parseId(req.params.id, "post id");
    const comments = postsService.listComments(postId);
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

function addComment(req, res, next) {
  try {
    const postId = parseId(req.params.id, "post id");
    const payload = validateComment(req.body);
    const comment = postsService.addComment(postId, req.user.id, payload);
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPosts, getPost, createPost, toggleLike, getComments, addComment };