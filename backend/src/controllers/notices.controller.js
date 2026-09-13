const noticesService = require("../services/notices.service");

function getNotices(req, res, next) {
  try {
    const notices = noticesService.listNotices();
    res.json({ success: true, data: notices });
  } catch (err) { next(err); }
}
module.exports = { getNotices };