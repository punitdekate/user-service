const EventEmitter = require("events");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const successRegistrationHtml = require("../utility/templates/successRegistration");
const getOtp = require("../utility/templates/getOtp");
const { logger } = require("helper-utils-library");

class UserEvents {
    constructor() {
        this.userEmitter = new EventEmitter();
    }

    on(event, listener) {
        this.userEmitter.on(event, listener);
    }

    emit(event, ...args) {
        this.userEmitter.emit(event, ...args);
    }

    // ✅ Fixed: added await
    async notifyUserRegistration(user) {
        try {
            logger.info(`✅ New user registered: ${user.email}`);
            const emailData = successRegistrationHtml(user);

            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                expiresIn: "5m"
            });

            const options = {
                method: "POST",
                url: `${process.env.NOTIFICATION_SERVICE_URL}send-email`,
                data: {
                    from: process.env.FROM_USER,
                    to: user.email,
                    subject: `Welcome to CodeNest, ${user.name}!`,
                    html: emailData
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000 // ⏱ prevent infinite hang
            };

            const emailResponse = await axios(options); // ✅ await added

            logger.info(`📧 Email sent successfully -> status: ${emailResponse.status}, data: ${JSON.stringify(emailResponse.data)}`);
        } catch (error) {
            logger.error(`❌ Error notifying user registration: ${error.message}`);
        }
    }

    async notifyPasswordReset(user, resetToken) {
        try {
            if (!user.resetPasswordToken) {
                throw new Error("Reset password token is not set for the user.");
            }

            logger.info(`🔐 User password resetting: ${user.email}`);

            const resetHtml = getOtp(resetToken);
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                expiresIn: "5m"
            });

            const options = {
                method: "POST",
                url: `${process.env.NOTIFICATION_SERVICE_URL}send-email`,
                data: {
                    from: process.env.FROM_USER,
                    to: user.email,
                    subject: "Password Reset Request",
                    html: resetHtml
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            };

            const emailResponse = await axios(options);

            logger.info(`📧 Password reset email sent -> status: ${emailResponse.status}, data: ${JSON.stringify(emailResponse.data)}`);
        } catch (error) {
            logger.error(`❌ Error in notifyPasswordReset: ${error.message}`);
        }
    }
}

module.exports = UserEvents;
