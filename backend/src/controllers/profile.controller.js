const profileService = require("../services/profile.service");
const { validateUpdateProfile } = require("../validators/profile.validators");

function getMe(req, res, next) {
  try {
    const profile = profileService.getProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

function updateMe(req, res, next) {
  try {
    const payload = validateUpdateProfile(req.body);
    const profile = profileService.updateProfile(req.user.id, payload);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

module.exports = { getMe, updateMe };
