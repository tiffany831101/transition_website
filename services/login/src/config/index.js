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
};
