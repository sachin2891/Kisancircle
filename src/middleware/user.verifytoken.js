const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
// const key = process.env.secretKey;


const verify_token = async (token) => {

    if (token) {
        if (token.slice(0, 6) === "Bearer") {
            token = token.slice(7, token.length);
        }

        const decoded = jwt.verify(token, process.env.SECRETKEY);
        // console.log(decoded);

        return decoded;
    }
    else {
        return { error: "error" };
    }
}

module.exports = { verify_token }; 