const express = require('express');
const userrouter = express.Router();
const { registerController,
    loginController,
    profileController,
    profilePassUpdateController,
    profileUpdateController,
    logoutController,
    OtptoUpdatePassController } = require('../controller/user.controller');
//const { authorization } = require('../middleware/user.authorization');
const { validate_session_redis } = require("../middleware/user.sessionredis");

userrouter.route('/').get();
userrouter.route('/signup').post(registerController);
userrouter.route('/login').post(loginController);
userrouter.route('/logout').post(validate_session_redis, logoutController);
userrouter.route('/profile/view').get(validate_session_redis, profileController);
userrouter.route('/profile/otptoupdatepass').post(validate_session_redis, OtptoUpdatePassController);
userrouter.route('/profile/updatePassword').patch(validate_session_redis, profilePassUpdateController);
userrouter.route('/profile/updateProfile').patch(validate_session_redis, profileUpdateController);



module.exports = { userrouter };