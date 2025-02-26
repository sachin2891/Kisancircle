const express = require('express');
const app = express();
require("dotenv").config();
const { dbConnection } = require('./src/config/conn');
const { homerouter } = require('./src/routes/home.routes');
const { userrouter } = require('./src/routes/user.routes');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { swaggerDefinition } = require("./src/swaggerdocs/swaggerdefinition");
const { postrouter } = require('./src/routes/user.post.routes');
const port = process.env.PORT;
app.use(express.json());

const options = {
    swaggerDefinition,
    swaggerOptions: {
        authAction: { JWT: { name: "JWT", schema: { type: "apiKey", in: "header", name: "Authorization", description: "" }, value: "<JWT>" } }
    },
    apis: ['./src/swaggerdocs/*'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', homerouter);
app.use('/', userrouter);
app.use('/post', postrouter);
dbConnection().then(() => {
    console.log("data base connection established");
    app.listen(port, () => {
        console.log(`listing on port  ${port}`);
    })

}).catch(() => {
    console.error("Database connection failed", err);
});
