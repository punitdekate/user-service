"use strict";
const { requestContext, logger } = require("helper-utils");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const requestContextMiddleware = (req, res, next) => {
    let token = req.headers["authorization"];
    let payload = { id: "No Token" };
    if (token?.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
        payload = jwt.verify(token, process.env.JWT_SECRET);
    }
    const context = {
        requestId: uuidv4(),
        userId: payload?.id || null,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "",
        method: req.method,
        url: req.originalUrl,
        service: "codenest-users"
    };
    // Set global reference so logger can access it
    global.requestContext = requestContext;

    const meta = {
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params
    };

    res.setHeader("X-Request-ID", context.requestId);

    logger.info(`Request Context: ${JSON.stringify(context)}`, meta);

    requestContext.run(context, () => {
        next();
    });
};

module.exports = requestContextMiddleware;
