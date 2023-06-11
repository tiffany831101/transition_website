const { executeQuery, usersTable } = require("../connection");

/**
 * Interact with the database, should return queried data
 *
 */
class LoginRepository {
  /**
   *
   * @returns get all users id
   */
  async getAllUsersID() {
    const data = await executeQuery("SELECT id FROM ??", [usersTable]);
    console.log(data);
    return data;
  }
  /**
   *
   * @param { string } email
   * @returns { object } the find the users email if exists
   */
  async findUsersByEmail({ email }) {
    const data = await executeQuery("SELECT * FROM ?? WHERE email = ?", [
      usersTable,
      email,
    ]);

    return data;
  }

  async createUser({ nickname, email, password, salt }) {
    const data = await executeQuery(
      "INSERT INTO ?? (nickname, email, password, salt) VALUES (?, ?, ?, ?)",
      [usersTable, nickname, email, password, salt]
    );

    return data;
  }
}

module.exports = LoginRepository;
