const { ResumeRepository } = require("../db");

// business logic related
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");

class ResumeService {
  constructor() {
    this.repository = new ResumeRepository();
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
  async insertResumeData(data) {
    console.log("resume: ", data);
    //     1. image -> s3, and get the image url
    // 2. all  the  other data to dynamodb

    // 3. create the html file
    // 4. send the html file to s3

    // 5. update the html url in dynamo db

    // 6. and return the html url to the user
    // const insertData =
  }

  async insertImageToS3(data) {
    // insert to s3
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
