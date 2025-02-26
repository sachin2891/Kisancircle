const User = require("../models/user.schema");
const { Session } = require("../models/session.schema");
const { maintain_session_redis } = require("../middleware/user.sessionredis");

const maintain_session_service = async (req, res) => {
    try {
        const isUser = await User.find({ email: req.user.email });

        if (isUser) {
            const user = isUser[0]._id;
            const isSession = await Session.find({ user_id: user })
            console.log(isSession);
            if (!isSession.length) {
                const session_details = new Session({
                    user_id: user,
                    status: true
                });
                const session = await session_details.save();
                console.log("Session stored successfully");
                console.log(session);
            }
            else if (isSession.length) {
                if (!isSession[0].status) {
                    await Session.findOneAndUpdate({ user_id: user }, { status: !isSession[0].status });
                    console.log("Session Activate");
                }
            }
            await maintain_session_redis(req);
            // console.log("One session of this user is already activ");
            // res.status(201).json({message: "Session stored successfully"});
            // await maintain_session_redis(req, res);
        }
        else {
            // res.status(404).json({message: "User Not Found"});
            console.log("User not found");
        }
    }
    catch (err) {
        // res.status(500).json({message: "Server Error", err});
        console.log("Server Error")
    }
}
module.exports = { maintain_session_service }