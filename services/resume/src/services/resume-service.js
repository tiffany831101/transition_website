const { ResumeRepository } = require("../db");

const S3Service = require("../storage/index");
// business logic related
const { SECRET_ACCESS_KEY, ACCESS_KEY_ID, CDN_ID } = require("../config");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
console.log(CDN_ID);

class ResumeService {
  constructor() {
    this.repository = new ResumeRepository();
    this.S3Service = new S3Service(
      ACCESS_KEY_ID,
      SECRET_ACCESS_KEY,
      "us-east-1"
    );
  }

  /**
   *
   * @param { object } data
   * 1. image -> s3, and get the image url
   * 2. all  the  other data to dynamodb
   * 3. create the html file
   * 4. send the html file to s3

   * 5. update the html url in dynamo db

   * 6. and return the html url to the user
   * @returns true => done, false => 沒有成功
   */
  async generateResumeURL(data) {
    // console.log("resume: ", data);
    try {
      // 避免一直產生新的 images, 等到開發完再把 Location 用回來

      const { Location } = await this.S3Service.getInsertedImageUrl(data);

      const { userId, resumeId, resumeData } = data;
      // let Location =
      //   "https://transition-service.s3.amazonaws.com/images/ce5c11cd-d22b-4a3c-94e6-c72339bd6e02/2823b0e3-a5e1-46b5-9a0e-8c888780b3a3/image.jpg";

      let cdnImageUrl = `https://${CDN_ID}.cloudfront.net/images/${userId}/${resumeId}/image.jpg`;

      const params = {
        resume_id: resumeId,
        userId,
        ...resumeData,
        experience: JSON.parse(resumeData["experience"]),
        education: JSON.parse(resumeData["education"]),
        certificate: JSON.parse(resumeData["certificate"]),
        imageUrl: cdnImageUrl,
      };

      const isPutResumeDbSuccess = await this.repository.putResumeData(params);

      if (isPutResumeDbSuccess) {
        const htmlContent = await this.createResume(params);

        const bucketName = "transition-service";
        // const htmlFilePath = path.join(__dirname, "../template/template.html");
        // const htmlContent = fs.readFileSync(htmlFilePath, "utf8");
        const { Location } = await this.S3Service.getInsertedHtmlUrl({
          bucketName,
          htmlFile: htmlContent,
          userId,
          resumeId,
        });

        if (Location) {
          let cdnUrl = `https://${CDN_ID}.cloudfront.net/htmls/${userId}/${resumeId}/resume.html`;

          return FormateData({ htmlUrl: cdnUrl });
        }

        // return FormateData({ htmlUrl: Location });
        // start to draw the html file
      }
      // generate the html file, save all datatodynamodb first
    } catch (err) {
      throw err;
    }

    // 1. image -> s3, and get the image url
    // 2. all  the  other data to dynamodb

    // 3. create the html file
    // 4. send the html file to s3

    // 5. update the html url in dynamo db

    // 6. and return the html url to the user
    // const insertData =
  }

  async updateResumeURL(data, isChangeImage) {
    try {
      // 避免一直產生新的 images, 等到開發完再把 Location 用回來

      let Location;
      if (isChangeImage) {
        const res = await this.S3Service.getUpdatedImageUrl(data);

        Location = res;
      } else {
        Location = data.imageFile;
      }

      const { userId, resumeId, resumeData } = data;

      // let Location =
      //   "https://transition-service.s3.amazonaws.com/images/ce5c11cd-d22b-4a3c-94e6-c72339bd6e02/2823b0e3-a5e1-46b5-9a0e-8c888780b3a3/image.jpg";

      const params = {
        resume_id: resumeId,
        userId,
        ...resumeData,
        experience: JSON.parse(resumeData["experience"]),
        education: JSON.parse(resumeData["education"]),
        certificate: JSON.parse(resumeData["certificate"]),
        imageUrl: Location,
      };

      const isPutResumeDbSuccess = await this.repository.updateResumeData(
        params
      );

      if (isPutResumeDbSuccess) {
        const htmlContent = await this.createResume(params);

        const bucketName = "transition-service";
        // const htmlFilePath = path.join(__dirname, "../template/template.html");
        // const htmlContent = fs.readFileSync(htmlFilePath, "utf8");
        await this.S3Service.updateInsertedHtmlUrl({
          bucketName,
          htmlFile: htmlContent,
          userId,
          resumeId,
        });

        let cdnUrl = `https://${CDN_ID}.cloudfront.net/htmls/${userId}/${resumeId}/resume.html`;

        return FormateData({ htmlUrl: cdnUrl });
        // start to draw the html file
      }
      // generate the html file, save all datatodynamodb first
    } catch (err) {
      throw err;
    }
  }

  async createResume(data) {
    try {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      data.experience = data.experience.map((item) => ({
        ...item,
        start_month: months[item.start_month - 1],
        end_month: months[item.end_month - 1],
      }));

      data.education = data.education.map((item) => ({
        ...item,
        start_month: months[item.start_month - 1],
        end_month: months[item.end_month - 1],
      }));

      data.certificate = data.certificate.map((item) => ({
        ...item,
        cert_month: months[item.cert_month - 1],
      }));
      const templateFilePath = path.join(
        __dirname,
        "../template/resume_template.ejs"
      );

      const outputFilePath = path.join(__dirname, "../template/template.html");

      const templateFile = fs.readFileSync(templateFilePath, "utf8");

      const renderedTemplate = ejs.render(templateFile, data);
      console.log(renderedTemplate);
      fs.writeFile(outputFilePath, renderedTemplate, (err) => {
        if (err) {
          console.error("Error saving HTML file:", err);
        } else {
          console.log("HTML file saved successfully.");
        }
      });

      return renderedTemplate;
    } catch (err) {
      throw err;
    }
  }

  async insertImageToS3(data) {
    // insert to s3
  }

  async insertHtmlUrl(resumeId, htmlUrl) {
    try {
      const result = await this.repository.putHtmlUrlInDB(resumeId, htmlUrl);
      return result.html;
    } catch (error) {
      console.error("Error updating resume data:", error);
      throw error;
    }
  }

  async getResumeByUserId(userId) {
    const result = await this.repository.getResumeByUserId(userId);
    return result;
  }
  /**
   * first check if user is created or not
   * then check if the pwd is correct
   * @param { object } userInputs
   * @returns token and the userid => should be stored in the sessionStorage
   */
  async signIn(userInputs) {
    const { email, password } = userInputs;
    const existingCustomer = await this.findUsers({ email });

    const hasUserSignedUp = this.checkIfUserSignedUp(existingCustomer);
    if (hasUserSignedUp) {
      const validPassword = await ValidatePassword(
        password,
        existingCustomer[0].password,
        existingCustomer[0].salt
      );
      if (validPassword) {
        const nickname = existingCustomer[0].nickname;
        const token = await GenerateSignature({
          nickname,
          email: existingCustomer.email,
          _id: existingCustomer.id,
        });
        return FormateData({ id: existingCustomer[0].id, token });
      } else {
        return FormateData({
          id: -1,
          token: null,
          reason: "INVALID_PWD",
        });
      }
    } else {
      // redirect to the signup page
      return FormateData({
        id: -1,
        token: null,
        reason: "INVALID_EMAIL",
      });
    }
  }

  /**
   * generate salt and add to the pwd
   * create user
   * generate signature
   * if signup before, pls route to signin page, no duplicate signup
   * @param { object } userInputs
   * @returns token and the userid => should be stored in the sessionStorage
   */
  async signUp(userInputs) {
    const { nickname, email, password } = userInputs;

    const userInfo = await this.findUsers({ email });

    const hasUserSignedUp = this.checkIfUserSignedUp(userInfo);

    // route to signin page:
    if (hasUserSignedUp) {
      return FormateData({
        id: -1,
        token: null,
        reason: "USER_HAS_SIGNED_UP",
      });
    }

    let salt = await GenerateSalt();
    let userPassword = await GeneratePassword(password, salt);

    const existingCustomer = await this.repository.createUser({
      nickname,
      email,
      password: userPassword,
      salt,
    });

    const { id } = existingCustomer;

    const token = await GenerateSignature({
      nickname: nickname,
      email: email,
      _id: existingCustomer["id"],
    });

    return FormateData({ id: id, token });
  }

  async findUsers({ email }) {
    const userInfo = await this.repository.findUsersByEmail({ email });
    return userInfo;
  }
  async getUsers() {
    const ids = await this.repository.getAllUsersID();
    return ids;
  }

  checkIfUserSignedUp(userInfo) {
    return !!userInfo.length;
  }
  //   async PlaceOrder(userInput){

  //       const { _id, txnNumber } = userInput

  //       const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);

  //       return FormateData(orderResult);
  //   }

  //   async GetOrders(customerId){

  //       const orders = await this.repository.Orders(customerId);
  //       return FormateData(orders)
  //   }

  //   async GetOrderDetails({ _id,orderId }){
  //       const orders = await this.repository.Orders(productId);
  //       return FormateData(orders)
  //   }

  //   async ManageCart(customerId, item,qty, isRemove){

  //       const cartResult = await this.repository.AddCartItem(customerId,item,qty, isRemove);
  //       return FormateData(cartResult);
  //   }

  //   async SubscribeEvents(payload){

  //       payload = JSON.parse(payload);
  //       const { event, data } = payload;
  //       const { userId, product, qty } = data;

  //       switch(event){
  //           case 'ADD_TO_CART':
  //               this.ManageCart(userId,product, qty, false);
  //               break;
  //           case 'REMOVE_FROM_CART':
  //               this.ManageCart(userId,product, qty, true);
  //               break;
  //           default:
  //               break;
  //       }

  //   }

  //   async GetOrderPayload(userId,order,event){

  //      if(order){
  //           const payload = {
  //              event: event,
  //              data: { userId, order }
  //          };

  //           return payload
  //      }else{
  //          return FormateData({error: 'No Order Available'});
  //      }

  //  }
}

module.exports = ResumeService;
