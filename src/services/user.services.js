require('dotenv').config();
const User = require('../models/user.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { Session } = require("../models/session.schema");
const { maintain_session_control } = require("../controller/user.sessioncontroller");
const { distroy_session_redis } = require('../middleware/user.sessionredis');
const { mailforPasswordUpdate } = require('../services/user.mailservice');
const { UserOtpVerification } = require('../models/user.otpverification')



const registerUser = async (req) => {
    try {
        const data = req.body;

        const encryptpass = await bcrypt.hash(data.password, parseInt(process.env.SALT));
        data.password = encryptpass;
        const registerdata = new User(data);
        console.log(registerdata);

        const token = jwt.sign({ email: data.email, user_id: data._id, name: data.name }, process.env.SECRETKEY, { expiresIn: "1d" });
        req.user = { name: data.name, email: data.email, user_id: data._id };
        const result = await registerdata.save();
        await maintain_session_control(req);
        result.token = token;
        console.log(token);
        return result;
    }
    catch (error) {
        return false;
    }
}



const userLogin = async (req) => {
    try {
        const logdata = req.body;
        const email = logdata.email;
        const user = await User.findOne({ email });

        if (!user) {
            return { success: false };
        }

        const passmatch = await bcrypt.compare(logdata.password, user.password);
        if (!passmatch) {
            return { success: false };
        }
        const token = jwt.sign(
            { email: user.email, user_id: user._id, name: user.name },
            process.env.SECRETKEY,
            { expiresIn: "1d" }
        );
        console.log(token);
        req.user = { name: user.name, email: user.email, user_id: user._id };
        // console.log(token);
        await maintain_session_control(req);

        // Return success and token
        return { success: true, token };
    } catch (err) {
        return { success: false };
    }
};

const userLogout = async (req) => {
    try {
        //const isSession = await Session.find({ user_id: req.user.user_id });
        await Session.findOneAndUpdate({ user_id: req.user.user_id }, { status: false });
        await distroy_session_redis(req);
        return true;
    }
    catch (err) {
        return false;
    }
};

const userProfile = async (req) => {
    try {

        const user = await User.findOne({ email: req.user.email });

        req.user = user;
        return { success: true, user: req.user };
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        return { success: false, message: "Internal server error" };
    }
};
const OtpGenarationtoUpdatePass = async (req, res) => {
    try {
        await mailforPasswordUpdate(req, res);
    }
    catch (err) {
        console.error("Error while generating OTP:", err);
    }
}
const userProfilePassUpdate = async (req) => {
    try {


        const user = await User.findOne({ email: req.user.email });
        // console.log(user);

        const { otp, newPassword } = req.body;
        const otpdata = await UserOtpVerification.findOne({ email: user.email });
        if (otpdata.expiresAt < Date.now()) {
            await UserOtpVerification.deleteMany({ email: user.email });
            return { success: false, message: "OTP expired please regenerate otp " };
        }
        const encryptotp = await bcrypt.compare(otp, otpdata.otp);
        if (!encryptotp) {
            return { success: false, message: "Please look into email and enter correct otp" }
        }
        const password = await bcrypt.hash(newPassword, parseInt(process.env.SALT));
        user.password = password;
        await user.save();
        await UserOtpVerification.deleteMany({ email: user.email });
        return { success: true, message: "user password has been changed " };
    } catch (error) {
        console.error("Error updating user profile:", error);

    }
}
const userProfilePUpdate = async (req) => {
    try {
        // if (!req.email) {
        //     return { success: false, message: "Email is required" };
        // }
        const user = await User.findOne({ email: req.user.email });
        Object.keys(req.body).forEach(key => { user[key] = req.body[key] });
        await user.save();
        return { success: true, message: "user prfile updated successfully" };

    } catch (error) {
        console.error("Error updating user profile:", error);
        return { success: false, message: "user prfile  not updated successfully" };


    }



}



module.exports = {
    registerUser, userLogin, userLogout,
    userProfile, userProfilePassUpdate, userProfilePUpdate, OtpGenarationtoUpdatePass
};