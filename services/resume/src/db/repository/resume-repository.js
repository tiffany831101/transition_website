const e = require("express");
const { executeQuery, usersTable } = require("../connection");
const { v4: uuidv4 } = require("uuid");
/**
 * Interact with the database, should return queried data
 *
 */
class ResumeRepository {
  /**
   *
   * @returns get all users id
   */
  async getAllUsersID() {
    const data = await executeQuery("SELECT id FROM ??", [usersTable]);
    console.log(data);
    return data;
  }

  // async findUsersByEmail({ email }) {
  //   const data = await executeQuery("SELECT * FROM ?? WHERE email = ?", [
  //     usersTable,
  //     email,
  //   ]);

  //   return data;
  // }

  /**
   *
   * @param { string } email
   * @returns { object } the find the users email if exists
   */
  async findUsersByEmail({ email }) {
    const data = await executeQuery("GET", {
      IndexName: "email-index", // Specify the GSI name
      KeyConditionExpression: "#email = :emailValue", // Use #email as the placeholder for reserved keyword 'email'
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":emailValue": email,
      },
    });

    return data.Items;
  }

  // async createUser({ nickname, email, password, salt }) {
  //   const data = await executeQuery(
  //     "INSERT INTO ?? (nickname, email, password, salt) VALUES (?, ?, ?, ?)",
  //     [usersTable, nickname, email, password, salt]
  //   );

  //   return data;
  // }

  async createUser({ nickname, email, password, salt }) {
    const uuid = uuidv4();
    const result = await executeQuery("PUT", {
      Item: {
        id: uuid,
        email,
        nickname,
        password,
        salt,
      },
      ConditionExpression: "attribute_not_exists(email)", // Move ConditionExpression outside of Item
    });

    const getUserInfo = await this.getUserById({ id: uuid });

    const { Count, Items } = getUserInfo;
    if (Count == 1) {
      return Items[0];
    } else {
      return [];
    }
  }
  async getUserById({ id }) {
    try {
      const result = await executeQuery("GET", {
        KeyConditionExpression: "#id = :idValue", // Use #email as the placeholder for reserved keyword 'email'
        ExpressionAttributeNames: {
          "#id": "id",
        },
        ExpressionAttributeValues: {
          ":idValue": id,
        },
      });
      return result;
    } catch (err) {
      console.log("error: ", err);
    }
  }
}

module.exports = ResumeRepository;
