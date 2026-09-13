const notificationsService = require("../services/notifications.service");
const { validateMarkRead } = require("../validators/notifications.validators");

function getNotifications(req, res, next) {
  try {
    const notifications = notificationsService.listNotifications(req.user.id);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

function markRead(req, res, next) {
  try {
    const payload = validateMarkRead(req.body);
    const notifications = payload.markAll
      ? notificationsService.markAllRead(req.user.id)
      : notificationsService.markOneRead(req.user.id, payload.id);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

module.exports = { getNotifications, markRead };
