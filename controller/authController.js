const { comparePassword } = require("../helpers/bcrypt.js");
const { signToken, verifyToken } = require("../helpers/jwt.js");
const { User, Customer } = require("../models/index.js");
// for google-sign-in
const { OAuth2Client } = require("google-auth-library");

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, password, email, phoneNumber, address } = req.body;
      const created = await User.create({
        username,
        password,
        role: "admin",
        email,
        phoneNumber,
        address,
      });

      res.status(201).json({
        statusCode: 201,
        message: "Register Success",
        data: {
          id: created.id,
          username: created.username,
          email: created.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async openAccount(req, res, next) {
    try {
      const { password, email } = req.body;
      const created = await Customer.create({
        email,
        password,
        role: "customer",
      });

      res.status(201).json({
        statusCode: 201,
        message: "Account creation success",
        data: {
          id: created.id,
          email: created.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("USERNAME_OR_PASSWORD_IS_EMPTY");
      }

      const foundUser = await User.findOne({
        where: {
          email,
        },
      });

      if (!foundUser) {
        throw new Error("INVALID_EMAIL_OR_PASSWORD");
      }
      if (!comparePassword(password, foundUser.password)) {
        throw new Error("INVALID_EMAIL_OR_PASSWORD");
      }

      const payload = {
        id: foundUser.id,
        role: foundUser.role,
      };

      const token = signToken(payload);

      res.status(200).json({
        statusCode: 200,
        message: "Login success",
        access_token: token,
        userdata: {
          id: foundUser.id,
          role: foundUser.role,
          email: foundUser.email,
          username: foundUser.username,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async gLogin(req, res, next) {
    try {
      const { token_google } = req.body;

      if (!token_google) {
        throw new Error("INVALID_EMAIL_OR_PASSWORD");
      }

      const client = new OAuth2Client(process.env.CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token_google,
        audience: process.env.CLIENT_ID,
      });

      let payload = ticket.getPayload();

      const [googleUser] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          username: payload.given_name + payload.family_name,
          password: payload.jti,
          role: "staff",
          email: payload.email,
          phoneNumber: null,
          address: null,
        },
      });

      const newPayload = {
        id: googleUser.id,
        role: googleUser.role,
      };

      const internalToken = signToken(newPayload);

      res.status(200).json({
        statusCode: 200,
        message: "Login success",
        access_token: internalToken,
        userdata: {
          id: googleUser.id,
          role: googleUser.role,
          email: googleUser.email,
          username: googleUser.username,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
