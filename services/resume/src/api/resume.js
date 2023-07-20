const ResumeService = require("../services/resume-service");
const { PublishCustomerEvent, SubscribeMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");
const axios = require("axios");

const {
  PublishMessage,
  checkAllInputFilled,
  ValidateSignature,
  GenerateSignature,
  DecodeJWT,
} = require("../utils");
const { FRONTEND_URL } = require("../config");

const { v4: uuidv4 } = require("uuid");

// passport related
const cookieSession = require("cookie-session");

const multer = require("multer");

// Configure multer middleware
const upload = multer();

// 原本有 channel
module.exports = (app) => {
  const service = new ResumeService();

  /**
   * this is not used...
   */

  /**
   * need to login, so need to verify UserAuth
   */
  app.post(
    "/create_resume",
    UserAuth,
    upload.single("image"),
    async (req, res) => {
      try {
        let b = req.body;
        const uuid = uuidv4();

        console.log("req: ", req.body);
        const payload = await DecodeJWT(req);

        const resumeData = {
          ...req.body,
          created_at: Date.now(),
        };
        console.log("payload: ", payload);
        const insertedParams = {
          bucketName: "transition-service",
          imageFile: req.file.buffer,
          userId: payload._id,
          resumeId: uuid,
          resumeData: resumeData,
        };

        const data = await service.generateResumeURL(insertedParams);

        const { htmlUrl } = data.data;
        const result = await service.insertHtmlUrl(uuid, htmlUrl);

        if (result) {
          res.status(200).json({ data });
        }
        // const data = {
        //   data: {
        //     htmlUrl:
        //       "https://transition-service.s3.amazonaws.com/htmls/ce5c11cd-d22b-4a3c-94e6-c72339bd6e02/b3697f32-2891-4d99-ad84-e169440eb6f7/resume.html",
        //   },
        // };
      } catch (err) {
        console.log("err: ", err);
      }
      // console.log("this is the create resume");

      // const { image } = req.body;
      // const imageData = req.body.image;

      // Create a buffer from the base64-encoded image data
      // const imageBuffer = Buffer.from(imageData, "base64");
      // const image = req.body.image;
    }
  );

  app.post(
    "/update_resume",
    UserAuth,
    upload.single("image"),
    async (req, res) => {
      try {
        let b = req.body;

        console.log("req: ", req.body);

        const payload = await DecodeJWT(req);

        const isChangeImage = !/^http/i.test(req.body.imageUrl); // Case-insensitive regex to check for "http" at the beginning of the URL

        let resumeData;
        resumeData = {
          ...req.body,
          created_at: Date.now(),
        };

        console.log("resumedata:", resumeData);
        let insertedParams;
        if (isChangeImage) {
          insertedParams = {
            bucketName: "transition-service",
            imageFile: req.file.buffer,
            userId: payload._id,
            resumeId: resumeData.resume_id,
            resumeData: resumeData,
          };
        } else {
          insertedParams = {
            bucketName: "transition-service",
            imageFile: req.body.imageUrl,
            userId: payload._id,
            resumeId: resumeData.resume_id,
            resumeData: resumeData,
          };
        }
        console.log("payload: ", payload);

        // const data = await service.generateResumeURL(insertedParams);

        const data = await service.updateResumeURL(
          insertedParams,
          isChangeImage
        );

        // const { htmlUrl } = data.data;
        // const result = await service.insertHtmlUrl(uuid, htmlUrl);

        res.status(200).json({ data });
        // if (result) {
        //   res.status(200).json({ data });
        // }
        // const data = {
        //   data: {
        //     htmlUrl:
        //       "https://transition-service.s3.amazonaws.com/htmls/ce5c11cd-d22b-4a3c-94e6-c72339bd6e02/b3697f32-2891-4d99-ad84-e169440eb6f7/resume.html",
        //   },
        // };
      } catch (err) {
        console.log("err: ", err);
      }
      // console.log("this is the create resume");

      // const { image } = req.body;
      // const imageData = req.body.image;

      // Create a buffer from the base64-encoded image data
      // const imageBuffer = Buffer.from(imageData, "base64");
      // const image = req.body.image;
    }
  );

  app.post("/generate_pdf", UserAuth, async (req, res) => {
    let { url } = req.body;
    const response = await axios.get(url);
    console.log(response);
    return res.status(200).json({ htmlText: response.data });
  });

  app.get("/resume", UserAuth, async (req, res) => {
    const userId = req.user._id;
    const resumes = await service.getResumeByUserId(userId);

    return res.status(200).json({ resumes });
  });

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

  app.get("/test", UserAuth, async (req, res) => {
    res.status(200).json({
      status: "success",
    });
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
