const UserRepository = require("../repositories/users.repositories.js");
const { USER_SUPPORTED_FILTERS } = require("../../constants.js");
const { EMAIL_IS_REQUIRED, PASSWORD_IS_REQUIRED, INVALID_USER_ID, RESOURCE_NOT_FOUND, ID_IS_REQUIRED, RESET_TOKEN_AND_PASSWORD_REQUIRED, EXPIRED_RESET_TOKEN, RESET_TOKEN_REQUIRED } = require("../../errorMessages.js");
const { BadRequest, ResourceNotFound, Unauthorized, failureResponse, successResponse, logger } = require("helper-utils");
const UserEvents = require("../events/users.events.js");
const { use } = require("../routes/users.routes.js");

class UserController {
    constructor() {
        this.userRepository = new UserRepository();
        this.userEvents = new UserEvents();
    }

    async generateToken(req, res, next) {
        try {
            logger.info("----------Start GenerateToken----------");

            const { email, password } = req.body;
            logger.info(`email : ${email}`);
            if (!email) {
                return failureResponse(res, new Unauthorized(EMAIL_IS_REQUIRED), 400);
            }
            if (!password) {
                return failureResponse(res, new Unauthorized(PASSWORD_IS_REQUIRED), 401);
            }
            const dbResponse = await this.userRepository.token(email, password);
            logger.info(`dbResponse : ${JSON.stringify(dbResponse)}`);
            logger.info("----------End GenerateToken----------");

            return successResponse(res, { token: dbResponse }, 200);
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            logger.info("----------Start GetAllUsers----------");
            let { page, limit, sort, order } = req.query;
            page = parseInt(page) || 1; // Default to page 1 if not provided
            limit = parseInt(limit) || 10; // Default to 10 items per page if not provided

            let filter = {};
            USER_SUPPORTED_FILTERS.forEach(filterKey => {
                if (req.query[filterKey]) {
                    filter[filterKey] = req.query[filterKey];
                }
            });

            logger.info(`page : ${page}, limit : ${limit}`);

            const dbResponse = await this.userRepository.getAll({ page, limit, sort, order, filter });
            logger.info(`dbResponse : ${JSON.stringify(dbResponse)}`);

            logger.info("----------End GetAllUsers----------");
            return successResponse(res, dbResponse, 200, { page, limit });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            logger.info("----------Start GetUser----------");

            const { id } = req.params;
            logger.info(`User Id : ${id}`);
            if (!id.trim()) {
                throw new BadRequest(ID_IS_REQUIRED);
            }
            const dbResponse = await this.userRepository.getById(id);
            logger.info(`dbResponse : ${JSON.stringify(dbResponse)}`);

            logger.info("----------End GetUser----------");
            if (!dbResponse) {
                return failureResponse(res, new ResourceNotFound(RESOURCE_NOT_FOUND));
            }

            return successResponse(res, dbResponse, 200);
        } catch (error) {
            next(error);
        }
    }

    async createUser(req, res, next) {
        try {
            logger.info("----------Start CreateUser----------");

            const userData = req?.body;
            const dbResponse = await this.userRepository.createUser(userData);
            logger.info(`dbResponse : ${JSON.stringify(dbResponse)}`);

            this.userEvents.on("userRegistered", dbResponse => this.userEvents.notifyUserRegistration(dbResponse));
            this.userEvents.emit("userRegistered", dbResponse);

            logger.info("----------End CreateUser----------");

            return successResponse(res, dbResponse, 201);
        } catch (error) {
            next(error);
        }
    }

    async modifyUser(req, res, next) {
        try {
            logger.info("----------Start ModifyUser----------");

            const { id } = req.params;
            const user = req.user;
            logger.info(`User Id : ${id}, User : ${JSON.stringify(user)}`);
            if (!id.trim()) {
                throw new BadRequest(INVALID_USER_ID);
            }
            if (req?.file) {
                req.body.image = req.file.filename;
            }

            await this.userRepository.isAuthorizeToPerformAction(id, user);
            const dbResponse = await this.userRepository.updateUser(id, req.body);
            logger.info(`dbResponse : ${JSON.stringify(dbResponse)}`);
            logger.info("----------End ModifyUser----------");

            return res.status(200).json(dbResponse);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            logger.info("----------Start DeleteUser----------");

            const { id } = req.params;
            const user = req.user;
            logger.info(`User Id : ${id}, User : ${JSON.stringify(user)}`);
            if (!id.trim()) {
                throw new BadRequest(INVALID_USER_ID);
            }
            await this.userRepository.isAuthorizeToPerformAction(id, user);
            const dbResponse = await this.userRepository.deleteUser(id);
            logger.info(`dbResponse : ${JSON.stringify(dbResponse)}`);

            logger.info("----------End DeleteUser----------");

            return successResponse(res, {}, 204);
        } catch (error) {
            next(error);
        }
    }

    async sendResetTokenToUserEmail(req, res, next) {
        try {
            const { email } = req?.body;
            if (!email) {
                return failureResponse(res, new BadRequest(EMAIL_IS_REQUIRED), 400);
            }
            const user = await this.userRepository.getUserByEmail(email, true);

            if (user) {
                const resetToken = await user.generateResetToken(email);
                this.userEvents.on("passwordReset", user => this.userEvents.notifyPasswordReset(user,resetToken));
                this.userEvents.emit("passwordReset", user);
                return res.status(200).json({ success: true, data: "Password reset token sent to your email." });
            } else {
                return failureResponse(res, new ResourceNotFound(RESOURCE_NOT_FOUND), 404);
            }
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email, token, password } = req?.body;
            if (!email) {
                return failureResponse(res, new BadRequest(EMAIL_IS_REQUIRED), 400);
            }
            if (!token) {
                return failureResponse(res, new BadRequest(RESET_TOKEN_REQUIRED), 400);
            }
            if (!password) {
                return failureResponse(res, new BadRequest(PASSWORD_IS_REQUIRED), 400);
            }

            const user = await this.userRepository.getUserByEmail(email, true);
            if (!user) {
                return failureResponse(res, new ResourceNotFound(RESOURCE_NOT_FOUND), 404);
            }

            const isVerifiedToken = await user.verifyResetToken(token);
            if (!isVerifiedToken) {
                return failureResponse(res, new Unauthorized(EXPIRED_RESET_TOKEN), 401);
            }

            await user.resetPassword(password);
            return successResponse(res, { message: "Password has been reset successfully." }, 200);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
