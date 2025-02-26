const { registerUser, userLogin, userProfile, userProfilePassUpdate,
    userProfilePUpdate, userLogout, OtpGenarationtoUpdatePass } = require('../services/user.services');

const registerController = async (req, res) => {
    try {
        const result = await registerUser(req);
        if (!result) {
            res.status(406).send("Data values are not valid");
        }
        else {
            const token = result.token;
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.status(201).send({ Login: result });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}
const loginController = async (req, res) => {
    try {
        const result = await userLogin(req);
        if (!result) {
            res.status(406).send("user not able to login");
        }
        else {
            const token = result.token;
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            console.log(token);
            res.status(201).send({ Login: result.success });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}


const logoutController = async (req, res) => {
    try {

        const result = await userLogout(req);

        if (!result) {
            return res.status(403).send({ message: result.message });
        }

        res.clearCookie("token");

        return res.status(200).send({ message: "You have been logged out" });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};



const profileController = async (req, res) => {
    try {
        // console.log("user has been reached to contriller");
        const result = await userProfile(req);
        if (!result) {
            res.status(404).send("user not found");
        } else {
            res.status(200).send({ Profile: result });
        }
    } catch (error) {
        res.status(500).send(error);

    }
}

const OtptoUpdatePassController = async (req, res) => {
    try {
        await OtpGenarationtoUpdatePass(req, res);
    }
    catch (err) {
        res.status(500).send(err);
    }
}
const profilePassUpdateController = async (req, res) => {
    try {
        console.log("user under controller");

        const result = await userProfilePassUpdate(req);

        if (!result) {
            res.status(404).send("user profile  password failed");
        } else {
            res.status(200).send({ Profile: result });
        }
    } catch (error) {
        res.status(500).send(error);

    }
}
const profileUpdateController = async (req, res) => {
    try {


        const result = await userProfilePUpdate(req);

        if (!result) {
            res.status(404).send("user profile  update failed");
        } else {
            res.status(200).send({ Profile: result });
        }
    } catch (error) {
        res.status(500).send(error);

    }
}



module.exports = {
    registerController,
    loginController,
    profileController,
    profilePassUpdateController,
    profileUpdateController,
    logoutController,
    OtptoUpdatePassController
};