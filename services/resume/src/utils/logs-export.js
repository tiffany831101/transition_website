// const winston = require("winston");
// const { Client } = require("@opensearch-project/opensearch");
// const AWS = require("aws-sdk");
// const { ElasticsearchTransport } = require("winston-elasticsearch");
// const { OS_USERNAME, OS_PASSWORD, OS_NODE } = require("../config");

// const esClient = new Client({
//   node: OS_NODE,
//   auth: {
//     username: OS_USERNAME,
//     password: OS_PASSWORD,
//   },
// });

// const esTransport = new ElasticsearchTransport({
//   level: "info",
//   index: "logs",
//   client: esClient,
// });

// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(({ level, message, timestamp }) => {
//       return `${timestamp} [${level.toLowerCase()}]: ${message}`;
//     })
//   ),
//   transports: [new winston.transports.Console(), esTransport],
// });

// module.exports = {
//   logger,
// };
// logger.info("User logged in", { userId: "123", ipAddress: "192.168.0.1" });
// logger.warn("Invalid request", { path: "/api/sensitive-data" });
// logger.error("Database connection failed", { error: "Connection timeout" });
