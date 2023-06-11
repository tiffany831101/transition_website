const dotEnv = require("dotenv");
const path = require("path");

if (process.env.NODE_ENV.trim() !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV.trim()}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_PORT: process.env.DB_PORT,
  DB_PWD: process.env.DB_PWD,
  DB_ROOT_ACCOUNT: process.env.DB_ROOT_ACCOUNT,
  DB_TABLE_NAME: process.env.DB_TABLE_NAME,
  APP_SECRET: process.env.APP_SECRET,
  // DB_URL: process.env.MONGODB_URI,
  // APP_SECRET: process.env.APP_SECRET,
  // BASE_URL: process.env.BASE_URL,
  // EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  // MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  // CUSTOMER_SERVICE: "customer_service",
  // SHOPPING_SERVICE: "shopping_service",
};
