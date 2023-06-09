const LoginService = require("../services/login-service");
const { PublishCustomerEvent, SubscribeMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");
const { CUSTOMER_SERVICE } = require("../config");
const { PublishMessage } = require("../utils");

module.exports = (app, channel) => {
  const service = new LoginService();

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
