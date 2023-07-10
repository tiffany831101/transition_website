const dotEnv = require("dotenv");
const path = require("path");

console.log("node: ", process.env.NODE_ENV);

if (process.env.NODE_ENV.trim() !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV.trim()}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  PORT: process.env.PORT,
  APP_SECRET: process.env.APP_SECRET,
  OS_USERNAME: process.env.OS_USERNAME,
  OS_PASSWORD: process.env.OS_PASSWORD,
  OS_NODE: process.env.OS_NODE,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
