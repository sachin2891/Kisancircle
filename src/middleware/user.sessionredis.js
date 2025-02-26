const redis = require("redis");
const { verify_token } = require("../middleware/user.verifytoken")
const User = require("../models/user.schema");
const { Session } = require("../models/session.schema");
const { json } = require("express");

const client = redis.createClient();
client.connect();


const maintain_session_redis = async (req) => {

    client.on('error', err => console.log('Redis client error', err));
    try {

        const user = req.user;
        const isUser = await User.findOne({ email: user.email });
        console.log(isUser);
        if (isUser) {
            await client.SET(isUser.name, JSON.stringify({
                'user_id': isUser._id,
                'status': true
            }));
            const session = await client.get(isUser.name);
            // console.log(session);
        }
        else {
            console.log("User not found");
        }
    }
    catch (err) {
        console.log(err);
    }
}

const validate_session_redis = async (req, res, next) => {
    try {


        const check_user = await verify_token(req.headers.authorization);



        if (check_user) {


            client.on('error', err => console.log('Redis client error', err));
            const issession = await client.GET(check_user.name);
            // console.log(issession);

            const isSession = JSON.parse(issession);
            // console.log(isSession);
            if (!isSession.status) {
                const isUser = await Session.findOne({ user_id: check_user.user_id });
                if (isUser.status) {
                    await client.SET(isUser.name, JSON.stringify({
                        'user_id': isUser.user_id,
                        'status': true
                    }));
                    req.user = check_user;
                    next();
                }
                else {
                    return res.status(400).json({ message: "Session Expired Please login again" });
                }
            }
            req.user = check_user;
            next();
        }
        else {
            return res.status(400).json({ message: "Unauthorized Token" });
        }
    }

    catch (err) {
        res.status(400).json({ message: err.message });
    }

}

const distroy_session_redis = async (req) => {
    try {
        await client.SET(req.user.name, JSON.stringify({
            'user_id': req.user.user_id,
            'status': false
        }));
    }
    catch (err) {
        console.log(err);
    }
}
module.exports = { maintain_session_redis, validate_session_redis, distroy_session_redis };