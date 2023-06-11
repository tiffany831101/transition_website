const mysql = require("mysql2/promise");
const {
  DB_PWD,
  DB_ROOT_ACCOUNT,
  DB_HOST,
  DB_PORT,
  DB_TABLE_NAME,
} = require("../config");

const pool = mysql.createPool({
  host: DB_HOST,
  // host: "db",
  user: DB_ROOT_ACCOUNT,
  password: DB_PWD,
  database: "transition",
  // 是否可以包含sql multiple statements
  multipleStatements: true,
  port: DB_PORT,
});
// 測試是否連線成功
async function executeQuery(sql, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(sql, params);
    return results;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  executeQuery,
  usersTable: "users",
};
