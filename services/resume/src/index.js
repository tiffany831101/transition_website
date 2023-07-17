const express = require("express");
const { PORT } = require("./config");
const { executeQuery } = require("./db/connection");
const ResumeService = require("./services/resume-service");
const { logger } = require("./utils/logs-export");

// const { databaseConnection } = require('./database');
const expressApp = require("./express-app");

const StartServer = async () => {
  const app = express();

  app
    .listen(PORT, () => {
      // console.log("port is running on: ", PORT);
      logger.info("port is running on: ", PORT);
      logger.error("is it correct???");
      logger.error("test for error now");
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });

  await expressApp(app);

  // test for if the api is correct...
  // app.get("/test", async (req, res, next) => {
  //   const service = new LoginService();
  //   const email = "tiffany831101@gmail.com";
  //   const nickname = "tiffany";
  //   const password = "12345";
  //   const data = await service.signIn({
  //     email,
  //     password,
  //   });

  //   console.log("check data: ", data);
  // });

  app.use("/", (req, res, next) => {
    return res.status(200).json({ msg: "Hello from Shopping" });
  });
};

StartServer();
