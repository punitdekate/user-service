"use strict";
const mongoose = require("mongoose");
const { MAX_RETRY } = require("../../constants.js");
const { logger } = require("helper-utils-library");

/**
 * Connects to the MongoDB database using Mongoose.
 * Retries the connection if it fails, up to a maximum number of retries.
 * @param {Object} params - Parameters for the connection.
 * @param {string} params.connectionString - The MongoDB connection string.
 * @param {number} [params.retry=0] - The current retry count.
 * @throws Will throw an error if the maximum number of retries is reached.
 */
async function connectToDb({ connectionString, retry = 0 }) {
    try {
        logger.info(`Connecting with database ${connectionString} on retry ${retry}`);
        mongoose
            .connect(process.env.DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => logger.info("Connected database successfully."));
    } catch (error) {
        logger.error(`Error in connectToDB : ${error.message}`);
        if (retry < MAX_RETRY) {
            connectToDb({ connectionString, retry: ++retry });
        } else {
            throw error;
        }
    }
}

module.exports = { connectToDb };
