const jobsService = require("../services/jobs.service");
function getJobs(req, res, next) {
  try {
    const jobs = jobsService.listJobs();
    res.json({ success: true, data: jobs });
  } catch (err) { next(err); }
}
module.exports = { getJobs };