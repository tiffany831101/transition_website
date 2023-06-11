const { LoginRepository } = require("../db");

// business logic related
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");

class LoginService {
  constructor() {
    this.repository = new LoginRepository();
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
        const token = await GenerateSignature({
          email: existingCustomer.email,
          _id: existingCustomer.id,
        });
        return FormateData({ id: existingCustomer[0].id, token });
      }
    } else {
      // redirect to the signup page
      return {
        id: -1,
        token: null,
      };
    }
  }

  /**
   * generate salt and add to the pwd
   * create user
   * generate signature
   * if signup before, pls route to
   * @param { object } userInputs
   * @returns token and the userid => should be stored in the sessionStorage
   */
  async signUp(userInputs) {
    const { nickname, email, password } = userInputs;

    const userInfo = await this.findUsers({ email });

    const hasUserSignedUp = this.checkIfUserSignedUp(userInfo);

    // route to signin page:
    if (hasUserSignedUp) {
      return {
        id: -1,
        token: null,
      };
    }

    let salt = await GenerateSalt();
    let userPassword = await GeneratePassword(password, salt);

    const existingCustomer = await this.repository.createUser({
      nickname,
      email,
      password: userPassword,
      salt,
    });
    const { insertId } = existingCustomer;
    const token = await GenerateSignature({
      email: email,
      _id: existingCustomer["insertId"],
    });

    return FormateData({ id: insertId, token });
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

module.exports = LoginService;
