const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const baseController = require("./baseController");
const User = require("../models/user.model");
const Pure = require("../models/pure.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("./../utils/email");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const helper = require("./../utils/helper");

class UserController extends baseController {
  static tokenGen = id => {
    return jwt.sign({ id }, process.env.JWT_SEC_KEY, {
      expiresIn: process.env.JWT_EXP_IN
    });
  };

  static createSendToken = catchAsync(async (user, statusCode, res) => {
    //token generation
    const token = this.tokenGen(user.id);
    //save userTokenToDB
    const isDbTokenSaved = await new User().saveUserTokenToDb(user, token);

    if (!isDbTokenSaved) {
      return next(
        new AppError(
          "Smth is wrong during saving your token. Please contact the admin",
          500
        )
      );
    }

    res.status(statusCode).json({
      status: "succes",
      data: {
        //user,
        token
      }
    });
  });

  static resetPasswordTokenGen = async () => {
    //token will be sent to user via email
    //reset_token will be double encrypted and saved to DB
    //when user go through the link in email his hex will be encrypted and compared to saved in DB one
    const token = crypto.randomBytes(32).toString("hex");
    const reset_token = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    //jsToPgTimeStamp - function helper to prepare JS Date for PostgreSQL
    const reset_token_expiration = helper.jsToPgTimeStamp(
      Date.now() + process.env.RESET_TOKEN_EXPIRES_IN_MIN * 60 * 1000
    );
    // console.log(reset_token_expiration);

    return { token, reset_token, reset_token_expiration };
  };

  ///// forgotPassword
  static forgotPassword = catchAsync(async (req, res, next, err) => {
    //try to find user by email
    const currentUser = await new User().findByEmail(req.body.email);

    const {
      token,
      reset_token,
      reset_token_expiration
    } = await this.resetPasswordTokenGen(); //returns { token, reset_token,reset_token_expiration}
    //save resetToken details to DB
    const dbTokenDataSaved = await new User().update(currentUser[0].id, {
      reset_token,
      reset_token_expiration
    });
    if (!dbTokenDataSaved) {
      return next(new AppError("Something is wrong", 500));
    }
    // template for resetPassword EMAIL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/reset_password/${token}`;

    //console.log(resetUrl);

    const message = `Forget a password? Pls submit patch request with your password and passwordConfirm using this url: ${resetUrl}`;
    try {
      await sendEmail({
        email: currentUser[0].email,
        message: message,
        subject: `Your password reset token (valid for ${process.env.RESET_TOKEN_EXPIRES_IN_MIN} minutes)`
      });
      res.status(200).json({
        status: "succes",
        message: "Token was succesfully send via email"
      });
    } catch (err) {
      currentUser.passwordResetToken = undefined;
      currentUser.resetTokenExpiration = undefined;
      await currentUser.save({ validateBeforeSave: false });
      return next(
        new AppError("Email with reseting password token wasn't sent"),
        500
      );
    }
  });

  ///// resetPassword
  static resetPassword = catchAsync(async (req, res, next, err) => {
    const { token } = req.params;
    const { password, passwordConfirmation } = req.body;
    //simple check
    if (!password || !passwordConfirmation) {
      return next(
        new AppError("Password or passwordConfirmation can't be blank")
      );
    }
    //must be the same
    if (password !== passwordConfirmation) {
      return next(
        new AppError(
          "Password and passwordConfirmation feilds must be the same"
        )
      );
    }
    //encrypted version of users resetHex will be compared with saved in a DB
    const encryptedHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    //console.log("encryptedHash:", encryptedHash);
    //looking for resetToken in DB
    const currentUser = await new User().findByResetToken(encryptedHash);
    if (!currentUser.length) {
      return next(new AppError("Your token is invalid", 400));
    }

    //console.log(currentUser);
    //check for expiration time
    if (
      new Date(currentUser[0].reset_token_expiration).getTime() < Date.now()
    ) {
      return next(
        new AppError(
          "Your token is outdated. Please request /api/users/forgot_password again"
        )
      );
    }
    //encryption of new password
    const newPassword = await bcrypt.hash(password, 12);
    //saveNewPassword
    const updatedPassword = await new User().update(currentUser[0].id, {
      password: newPassword
    });

    helper.sendResponse(updatedPassword, res);
  });

  ///// createNewUser
  static signUp = catchAsync(async (req, res, next, err) => {
    const data = await new User(req).createNewUser();

    helper.sendResponse(data, res, 201);
  });

  ////login
  static login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email or Password can't be blank", 400));
    }
    //looking for email in DB
    const currentUser = await new User(req).findByEmail(email);
    //console.log(currentUser);

    //check if password is correct
    if (
      typeof currentUser[0] === "undefined" ||
      !(await User.comparePassword(password, currentUser[0].password))
    ) {
      return next(new AppError("Password or login isn't correct", 401));
    }
    //we delete all resetTokens details from DB if user succesfully loged in
    if (currentUser[0].reset_token || currentUser[0].reset_token_expiration) {
      const nullReset = await new User().update(currentUser[0].id, {
        reset_token: null,
        reset_token_expiration: null
      });
    }
    this.createSendToken(currentUser[0], 201, res);
  });
  //checking for Bearer token, comparing with db and initiate req.user if succes
  static protect = catchAsync(async (req, res, next) => {
    //
    let token;
    //check for headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //split and get token value
      token = req.headers.authorization.split(" ")[1];
    } else {
      return next(new AppError("You are not authorized. Please log in", 403));
    }
    //promisify wrapper for jwt.verify callback
    const decodeToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SEC_KEY
    );
    if (!decodeToken) {
      return next(new AppError("Something is wrong. Please login again", 403));
    }
    //if we have a user with id stored in token
    const currentDbUser = await new User().checkUserByTokenId(decodeToken.id);
    if (!currentDbUser.length) {
      return next(new AppError("Please log in", 403));
    }

    //if token from DB === decoded(token).token
    let accessGranted;
    currentDbUser.forEach(el => {
      if (el.token === token) {
        if (!el.user_active_status) {
          return next(
            new AppError(
              "Your account was disabled. Please contact to administrator"
            )
          );
        }
        accessGranted = true;
      }
    });

    if (!accessGranted || decodeToken.exp < Date.now() / 1000) {
      return next(
        new AppError("Your credentials are outdated.Please login again")
      );
    } else {
      //req.user init
      req.user = currentDbUser[0];
    }

    next();
  });

  ///restrictTo
  //uses together with protect, so we can check user role and compare it with params passed to function
  static restictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You have no permission for doing this action", 403)
        );
      }

      next();
    };
  };

  ///changePersonalPassword
  static changePersonalPassword = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    //clarify body params from trash
    const allowedFields = ["password", "passwordConfirmation"];
    //new object for processing
    const filteredBody = {};
    Object.keys(req.body).forEach(el => {
      if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });
    //passwords must exist and be the same
    if (
      typeof filteredBody.password === "undefined" ||
      typeof filteredBody.passwordConfirmation === "undefined" ||
      filteredBody.passwordConfirmation !== filteredBody.password
    ) {
      return next(
        new AppError(
          "password and passwordConfirmation are required and they have to match each other",
          400
        )
      );
    }
    //no need for this property after check
    delete filteredBody.passwordConfirmation;

    const updatedUser = await new Pure(req).changePersonalPassword(
      filteredBody
    );
    helper.sendResponse(updatedUser, res);
  });
}

module.exports = UserController;
