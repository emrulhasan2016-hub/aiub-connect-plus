const groupsService = require("../services/groups.service");
const { validateGroupMessage } = require("../validators/groups.validators");
const AppError = require("../utils/AppError");
function parseId(raw, label) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `Invalid ${label}.`);
  }
  return id;
}
function getGroups(req, res, next) {
  try {
    const groups = groupsService.listGroups();
    res.json({ success: true, data: groups });
  } catch (err) { next(err); }
}
function joinGroup(req, res, next) {
  try {
    const groupId = parseId(req.params.id, "group id");
    const group = groupsService.toggleMembership(groupId, req.user.id);
    res.json({ success: true, data: group });
  } catch (err) { next(err); }
}

function getMessages(req, res, next) {
  try {
    const groupId = parseId(req.params.id, "group id");
    const messages = groupsService.listMessages(groupId);
    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
}
function postMessage(req, res, next) {
  try {
    const groupId = parseId(req.params.id, "group id");
    const { text } = validateGroupMessage(req.body);
    const message = groupsService.addMessage(groupId, req.user.id, text);
    res.status(201).json({ success: true, data: message });
  } catch (err) { next(err); }
}
module.exports = { getGroups, joinGroup, getMessages, postMessage };