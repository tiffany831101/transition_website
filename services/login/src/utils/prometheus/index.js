const promClient = require("prom-client");

// Define Prometheus metrics for each API
const metrics = {
  loginRequests: new promClient.Counter({
    name: "login_requests_total",
    help: "Total number of login requests",
  }),

  signupRequests: new promClient.Counter({
    name: "signup_requests_total",
    help: "Total number of signup requests",
  }),

  // You can add more metrics here for other APIs
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
