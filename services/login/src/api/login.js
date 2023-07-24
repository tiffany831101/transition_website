const LoginService = require("../services/login-service");
const { PublishCustomerEvent, SubscribeMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");
const { CUSTOMER_SERVICE } = require("../config");
const promClient = require("prom-client");
const {
  PublishMessage,
  checkAllInputFilled,
  ValidateSignature,
  GenerateSignature,
} = require("../utils");
const { FRONTEND_URL } = require("../config");
const { metrics, incrementMetric } = require("../utils/prometheus");
// passport related
const passport = require("passport");
const cookieSession = require("cookie-session");
require("../utils/passport");

// 原本有 channel
module.exports = (app) => {
  const service = new LoginService();

  /**
   * this is not used...
   */
  app.post("/register", async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;

      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/signup", async (req, res) => {
    try {
      const { nickname, email, password } = req.body;
      if (!(nickname && email && password)) {
        res.status(400).send("All input is required");
        return;
      }

      incrementMetric(metrics.signupRequests);
      const userToken = await service.signUp({ nickname, email, password });

      res.status(200).json(userToken);
    } catch (err) {
      console.log(err);
    }
  });
  app.post("/signin", async (req, res) => {
    console.log("req: ", req);
    incrementMetric(metrics.loginRequests);
    console.log("signin is running here...");
    try {
      const { email, password } = req.body;
      const isAllInputFieldFilled = checkAllInputFilled({
        email,
        password,
      });
      if (!isAllInputFieldFilled) {
        res.status(400).send("All input is required");
        return;
      }

      const userToken = await service.signIn({ email, password });

      res.status(200).json(userToken);
    } catch (err) {
      console.log(err);
    }
  });
  app.get("/test", UserAuth, async (req, res) => {
    res.status(200).json({
      status: "success",
    });
  });

  // start for google login

  app.use(
    cookieSession({
      name: "google-auth-session",
      keys: ["key1", "key2"],
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Auth
  app.get(
    "/auth",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  // Auth Callback
  app.get(
    "/auth/callback",
    passport.authenticate("google", {
      successRedirect: "/auth/callback/success",
      failureRedirect: "/auth/callback/failure",
    })
  );

  // Success
  app.get("/auth/callback/success", async (req, res) => {
    if (!req.user) res.redirect("/auth/callback/failure");

    const { email, id, displayName } = req.user;

    const token = await GenerateSignature({
      email,
      nickname: displayName,
      _id: id,
    });

    res.cookie("token", token, { httpOnly: false });

    console.log("frontend url: ", FRONTEND_URL);
    res.redirect(FRONTEND_URL);
  });

  // failure
  app.get("/auth/callback/failure", (req, res) => {
    res.send("Error");
  });

  // end for google login

  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", promClient.register.contentType);
    let metrics = await promClient.register.metrics();
    res.send(metrics);
    // const a = promClient.register.metrics();
    // console.log(a);
    // // res.set("Content-Type", promClient.register.contentType);
    // res.send(promClient.register.metrics());
  });

  function incrementLoginRequests() {
    loginRequests.inc();
  }

  // SubscribeMessage(channel, service)

  // app.post('/order',UserAuth, async (req,res,next) => {

  //     const { _id } = req.user;
  //     const { txnNumber } = req.body;

  //     const { data } = await service.PlaceOrder({_id, txnNumber});

  //     const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER')

  //     // PublishCustomerEvent(payload)
  //     PublishMessage(channel,CUSTOMER_SERVICE, JSON.stringify(payload))

  //     res.status(200).json(data);

  // });

  // app.get('/orders',UserAuth, async (req,res,next) => {

  //     const { _id } = req.user;

  //     const { data } = await service.GetOrders(_id);

  //     res.status(200).json(data);

  // });

  // app.put('/cart',UserAuth, async (req,res,next) => {

  //     const { _id } = req.user;

  //     const { data } = await service.AddToCart(_id, req.body._id);

  //     res.status(200).json(data);

  // });

  // app.delete('/cart/:id',UserAuth, async (req,res,next) => {

  //     const { _id } = req.user;

  //     const { data } = await service.AddToCart(_id, req.body._id);

  //     res.status(200).json(data);

  // });

  // app.get('/cart', UserAuth, async (req,res,next) => {

  //     const { _id } = req.user;

  //     const { data } = await service.GetCart({ _id });

  //     return res.status(200).json(data);
  // });

  // app.get('/whoami', (req,res,next) => {
  //     return res.status(200).json({msg: '/shoping : I am Shopping Service'})
  // })
};
