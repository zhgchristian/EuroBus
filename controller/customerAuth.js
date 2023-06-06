const { comparePassword } = require("../helpers/bcrypt.js");
const { signToken, verifyToken } = require("../helpers/jwt.js");
const { Customer } = require("../models/index.js");
// for google-sign-in
const { OAuth2Client } = require("google-auth-library");

class CustomerAuth {
  static async openAccount(req, res, next) {
    try {
      const { password, email } = req.body;
      const created = await Customer.create({
        email: email,
        password: password,
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

      next();
    } catch (err) {
      next(err);
    }
  }

  static async customerLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("USERNAME_OR_PASSWORD_IS_EMPTY");
      }

      const foundCustomer = await Customer.findOne({
        where: {
          email: email,
        },
      });

      if (!foundCustomer) {
        throw new Error("INVALID_EMAIL_OR_PASSWORD");
      }
      if (!comparePassword(password, foundCustomer.password)) {
        throw new Error("INVALID_EMAIL_OR_PASSWORD");
      }

      const payload = {
        id: foundCustomer.id,
        role: foundCustomer.role,
        email: foundCustomer.email,
      };

      const token = signToken(payload);

      res.status(200).json({
        statusCode: 200,
        message: "Logged in successfully",
        access_token: token,
        userdata: {
          id: foundCustomer.id,
          role: foundCustomer.role,
          email: foundCustomer.email,
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

      const [googleUser] = await Customer.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          password: payload.jti,
          role: "customer",
          email: payload.email,
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
        customerData: {
          id: googleUser.id,
          email: googleUser.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CustomerAuth;
