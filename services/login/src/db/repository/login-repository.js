const { executeQuery } = require("../connection");

// in this file will generate small sql functions
class LoginRepository {
  async getAllUsersID() {
    const data = await executeQuery("SELECT id FROM ??", ["users"]);
    console.log(data);
    return data;
  }

  async findUsersByEmail({ email }) {
    const data = await executeQuery("SELECT * FROM ?? WHERE email = ?", [
      "users",
      email,
    ]);

    return data;
  }
}

module.exports = LoginRepository;
