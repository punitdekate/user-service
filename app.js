"use strict";
require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { logger } = require("helper-utils-library");
const userRouter = require("./src/routes/users.routes.js");
const { connectToDb } = require("./src/config/dbConfig.js");
const { errorHandler } = require("helper-utils-library");
const requestContextMiddleware = require("./src/middlewares/requestContext.middleware.js");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(requestContextMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    await connectToDb({ connectionString: process.env.DB_URL, retry: 0 });
    logger.info(`Server is running on port ${PORT}`);
});

app.get("/api/users/health", (req, res) => {
    res.status(200).json({ status: "running", success: true });
});

app.use("/api/users/token", userRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);
