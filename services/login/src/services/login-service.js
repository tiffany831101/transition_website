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

  // from api
  async signIn(userInputs) {
    const { email, password } = userInputs;
    const hasUserSignedUp = await this.checkIfUserSignedUp({ email });
    // if (hasUserSignedUp) {
    //   const validPassword = await ValidatePassword(
    //     password,
    //     existingCustomer.password,
    //     existingCustomer.salt
    //   );
    //   if (validPassword) {
    //     const token = await GenerateSignature({
    //       email: existingCustomer.email,
    //       _id: existingCustomer._id,
    //     });
    //     return FormateData({ id: existingCustomer._id, token });
    //   }
    // }
    // return FormateData(null);
  }

  async findUsers({ email }) {
    const userInfo = await this.repository.findUsersByEmail({ email });
    return userInfo;
  }
  async getUsers() {
    const ids = await this.repository.getAllUsersID();
    return ids;
  }

  async checkIfUserSignedUp({ email }) {
    return !!this.findUsers({ email });
  } // return true...代表已經註冊過了

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
