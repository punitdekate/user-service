const { INVALID_CREDENTIALS, NOT_AUTHORIZED, RESOURCE_NOT_FOUND } = require("../../errorMessages.js");
const { ResourceNotFound, Unauthorized, CustomMongooseError } = require("helper-utils-library");
const UserModel = require("../schemas/user.schema.js");
const { logger } = require("helper-utils-library");

class UserRepository {
    constructor() {
        this.userModel = UserModel;
    }

    async getAll({ page, limit, sort, order, filter }) {
        try {
            sort = sort || "createdAt"; // Default sort field
            order = order || "asc"; // Default sort order
            filter = filter || {}; // Default filter object
            // Ensure page and limit are positive integers
            if (page < 1 || limit < 1) {
                throw new CustomMongooseError("Page and limit must be positive integers", 400);
            }
            // Construct filter object for MongoDB query
            const filterObj = {};
            if (filter && Object.keys(filter).length > 0) {
                for (const key in filter) {
                    if (filter[key]) {
                        filterObj[key] = new RegExp(filter[key], "i"); // Case-insensitive regex
                    }
                }
            }
            const skip = (page - 1) * limit;
            const sortOrder = order === "asc" ? 1 : -1;
            const users = await this.userModel
                .find(filterObj)
                .sort({ [sort]: sortOrder })
                .skip(skip)
                .limit(limit)
                .select("-password"); // Exclude password field
            return users;
        } catch (error) {
            logger.error(`Error fetching users: ${error.message}, Stack: ${error.stack}`);
            throw new CustomMongooseError(error, 400);
        }
    }

    async token(email, password) {
        try {
            const userExist = await this.userModel.findOne({ email: email });
            if (!userExist) {
                throw new ResourceNotFound(RESOURCE_NOT_FOUND);
            } else {
                const isUser = await userExist.compare(password);
                if (!isUser) {
                    throw new Unauthorized(INVALID_CREDENTIALS);
                }
                const token = await userExist.generateJwtToken();
                return token;
            }
        } catch (error) {
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const user = new this.userModel(userData);
            const savedUser = await user.save();

            // ✅ Remove password before sending response
            const userWithoutPassword = savedUser.toObject();
            delete userWithoutPassword.password;

            return userWithoutPassword;
        } catch (error) {
            logger.error(`Error creating user: ${error.message}, Stack: ${error.stack}`);
            throw error;
        }
    }

    async getById(userId) {
        return await this.userModel.findById(userId).select("-password");
    }

    async updateUser(userId, userData) {
        return await this.userModel
            .findByIdAndUpdate(userId, userData, {
                new: true
            })
            .select("-password");
    }

    async deleteUser(userId) {
        return await this.userModel.findByIdAndDelete(userId);
    }

    //utility functions
    async isAuthorizeToPerformAction(userId, user) {
        try {
            const userResponse = await this.getById(userId);
            if (!userResponse) {
                throw new ResourceNotFound(RESOURCE_NOT_FOUND);
            }
            if (userResponse?.role !== "admin" && user?.id?.toString() !== userId?.toString()) {
                throw new Unauthorized(NOT_AUTHORIZED);
            }
            return true;
        } catch (error) {
            logger.error(`Error in isAuthorizeToPerformAction: ${error.message}, Stack: ${error.stack}`);
            throw error;
        }
    }

    async getUserByEmail(email, includePassword = false) {
        try {
            let user;
            if (includePassword) {
                user = await this.userModel.findOne({ email: email }).select("+password");
            } else {
                user = await this.userModel.findOne({ email: email }).select("-password");
            }
            if (!user) {
                throw new ResourceNotFound(RESOURCE_NOT_FOUND);
            }
            return user;
        } catch (error) {
            logger.error(`Error fetching user by email: ${error.message}, Stack: ${error.stack}`);
            throw error;
        }
    }
}

module.exports = UserRepository;
