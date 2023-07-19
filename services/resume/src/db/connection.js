// const mysql = require("mysql2/promise");
const AWS = require("aws-sdk");

const { SECRET_ACCESS_KEY, ACCESS_KEY_ID } = require("../config");
AWS.config.update({
  region: "us-east-1", // Replace with your desired AWS region
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const { v4: uuidv4 } = require("uuid");

// const {
//   DB_PWD,
//   DB_ROOT_ACCOUNT,
//   DB_HOST,
//   DB_PORT,
//   DB_TABLE_NAME,
// } = require("../config");

// const pool = mysql.createPool({
//   host: DB_HOST,
//   // host: "db",
//   user: DB_ROOT_ACCOUNT,
//   password: DB_PWD,
//   database: "transition",
//   // 是否可以包含sql multiple statements
//   multipleStatements: true,
//   port: DB_PORT,
// });

const dynamodb = new AWS.DynamoDB.DocumentClient();
async function executeQuery(queryType, params) {
  let queryParams = {
    TableName: "resume",
    ...params,
  };

  try {
    let result;

    if (queryType === "GET") {
      result = await dynamodb.query(queryParams).promise();
    } else if (queryType === "PUT") {
      result = await dynamodb.put(queryParams).promise(); // Use putParams without ConditionExpression
    } else {
      throw new Error("Invalid query type");
    }

    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

module.exports = {
  executeQuery,
  usersTable: "users",
};
