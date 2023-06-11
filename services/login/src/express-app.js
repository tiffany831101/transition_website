const express = require("express");
const cors = require("cors");
const path = require("path");
const { login, appEvents } = require("./api");
const bodyParser = require("body-parser");
const { CreateChannel } = require("./utils");
const { log } = require("console");

module.exports = async (app) => {
  app.use(express.json());
  app.use(cors());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  // app.use(express.static(__dirname + '/public'))

  //api
  // appEvents(app);

  // const channel = await CreateChannel()
  login(app);
  // error handling
};
