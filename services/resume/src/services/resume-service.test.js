const LoginService = require("./login-service");
const { LoginRepository } = require("../db");
const {
  FormateData,
  GenerateSignature,
  ValidatePassword,
  GenerateSalt,
  GeneratePassword,
} = require("../utils");

// Mocking the LoginRepository
jest.mock("../db", () => ({
  LoginRepository: jest.fn(() => ({
    findUsersByEmail: jest.fn(),
    createUser: jest.fn(),
    getAllUsersID: jest.fn(),
  })),
}));

// Mocking the utils functions
jest.mock("../utils", () => ({
  FormateData: jest.fn(),
  GenerateSignature: jest.fn(),
  ValidatePassword: jest.fn(),
  GenerateSalt: jest.fn(),
  GeneratePassword: jest.fn(),
}));

describe("LoginService", () => {
  let loginService;
  let loginRepository;

  beforeEach(() => {
    loginRepository = new LoginRepository();
    loginService = new LoginService();
    loginService.repository = loginRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signIn", () => {
    it("should sign in a user successfully", async () => {
      const userInputs = {
        email: "test@example.com",
        password: "password",
      };

      const existingCustomer = [
        {
          id: 1,
          email: "test@example.com",
          password: "hashedPassword",
          salt: "salt",
        },
      ];

      loginRepository.findUsersByEmail.mockResolvedValue(existingCustomer);
      loginService.checkIfUserSignedUp = jest.fn().mockReturnValue(true);
      ValidatePassword.mockReturnValue(true);
      GenerateSignature.mockResolvedValue("testToken");
      FormateData.mockReturnValue({ id: 1, token: "testToken" });

      const result = await loginService.signIn(userInputs);

      expect(loginRepository.findUsersByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(loginService.checkIfUserSignedUp).toHaveBeenCalledWith(
        existingCustomer
      );
      expect(ValidatePassword).toHaveBeenCalledWith(
        "password",
        "hashedPassword",
        "salt"
      );
      expect(FormateData).toHaveBeenCalledWith({ id: 1, token: "testToken" });
      expect(result).toEqual({ id: 1, token: "testToken" });
    });

    it("should return null if the user is not signed up", async () => {
      const userInputs = {
        email: "test@example.com",
        password: "password",
      };

      const existingCustomer = [];

      loginRepository.findUsersByEmail.mockResolvedValue(existingCustomer);
      loginService.checkIfUserSignedUp = jest.fn().mockReturnValue(false);

      const result = await loginService.signIn(userInputs);

      expect(loginRepository.findUsersByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(loginService.checkIfUserSignedUp).toHaveBeenCalledWith(
        existingCustomer
      );
      expect(result).toEqual({ id: -1, token: null });
    });

    it("should return null if the password is invalid", async () => {
      const userInputs = {
        email: "test@example.com",
        password: "password",
      };

      const existingCustomer = [
        {
          id: 1,
          email: "test@example.com",
          password: "hashedPassword",
          salt: "salt",
        },
      ];

      loginRepository.findUsersByEmail.mockResolvedValue(existingCustomer);
      loginService.checkIfUserSignedUp = jest.fn().mockReturnValue(true);
      ValidatePassword.mockReturnValue(false);

      const result = await loginService.signIn(userInputs);

      expect(loginRepository.findUsersByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(loginService.checkIfUserSignedUp).toHaveBeenCalledWith(
        existingCustomer
      );
      expect(ValidatePassword).toHaveBeenCalledWith(
        "password",
        "hashedPassword",
        "salt"
      );
    });
  });

  describe("signUp", () => {
    it("should sign up a new user successfully", async () => {
      const userInputs = {
        nickname: "John",
        email: "test@example.com",
        password: "password",
      };

      const userInfo = [];
      const existingCustomer = [];

      loginRepository.findUsersByEmail.mockResolvedValue(userInfo);
      loginService.checkIfUserSignedUp = jest.fn().mockReturnValue(false);
      GenerateSalt.mockResolvedValue("salt");
      GeneratePassword.mockResolvedValue("hashedPassword");
      loginRepository.createUser.mockResolvedValue({ insertId: 1 });
      GenerateSignature.mockResolvedValue("testToken");
      FormateData.mockReturnValue({ id: 1, token: "testToken" });

      const result = await loginService.signUp(userInputs);

      expect(loginRepository.findUsersByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(loginService.checkIfUserSignedUp).toHaveBeenCalledWith(userInfo);
      expect(GenerateSalt).toHaveBeenCalled();
      expect(GeneratePassword).toHaveBeenCalledWith("password", "salt");
      expect(loginRepository.createUser).toHaveBeenCalledWith({
        nickname: "John",
        email: "test@example.com",
        password: "hashedPassword",
        salt: "salt",
      });
      expect(GenerateSignature).toHaveBeenCalledWith({
        email: "test@example.com",
        _id: 1,
      });
      expect(FormateData).toHaveBeenCalledWith({ id: 1, token: "testToken" });
      expect(result).toEqual({ id: 1, token: "testToken" });
    });

    it("should return null if the user is already signed up", async () => {
      const userInputs = {
        nickname: "John",
        email: "test@example.com",
        password: "password",
      };

      const userInfo = [
        {
          id: 1,
          email: "test@example.com",
          password: "hashedPassword",
          salt: "salt",
        },
      ];

      loginRepository.findUsersByEmail.mockResolvedValue(userInfo);
      loginService.checkIfUserSignedUp = jest.fn().mockReturnValue(true);

      const result = await loginService.signUp(userInputs);

      expect(loginRepository.findUsersByEmail).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(loginService.checkIfUserSignedUp).toHaveBeenCalledWith(userInfo);
      expect(result).toEqual({ id: -1, token: null });
    });

    it("should return false when the user hasnt signed up before", async () => {
      const emptyUserInfo = [];
      const checkEmptyUser = loginService.checkIfUserSignedUp(emptyUserInfo);
      expect(checkEmptyUser).toEqual(false);
    });

    it("should return true when the user has signed up before", async () => {
      const userInfo = [
        {
          id: 1,
          email: "test@example.com",
          password: "hashedPassword",
        },
      ];
      const checkIsUser = loginService.checkIfUserSignedUp(userInfo);
      expect(checkIsUser).toEqual(true);
    });
    it("should return all user ids", async () => {
      const existingUserIds = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      loginRepository.getAllUsersID.mockResolvedValue(existingUserIds);
      const ids = await loginService.getUsers();
      expect(ids).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    });
  });
});
