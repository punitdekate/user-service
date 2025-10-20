const jwt = require("jsonwebtoken");
const { failureResponse, Unauthorized } = require("helper-utils");

function auth(req, res, next) {
    try {
        let token = req.headers["authorization"];
        if (!token) {
            return failureResponse(res, new Unauthorized("Authorization token is required"));
        }
        if (token.startsWith("Bearer ")) {
            token = token.replace("Bearer ", "");
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = auth;
