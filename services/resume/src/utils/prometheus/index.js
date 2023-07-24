const promClient = require("prom-client");

// Define Prometheus metrics for each API
const metrics = {
  createResumeRequests: new promClient.Counter({
    name: "create_resume_requests_total",
    help: "Total number of create resume requests",
  }),

  updateResumeRequests: new promClient.Counter({
    name: "update_resume_requests_total",
    help: "Total number of update resume requests",
  }),
  getResumeRequests: new promClient.Counter({
    name: "get_resume_requests_total",
    help: "Total number of get resume requests",
  }),
};

// Function to increment a specific metric
function incrementMetric(metric) {
  metric.inc();
}

// Export the metrics object and the incrementMetric function
module.exports = {
  metrics,
  incrementMetric,
};
