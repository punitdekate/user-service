const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 3,
        trim: true
    },
    displayName: {
        type: String,
        required: [true, "DisplayName is required"],
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8
    },
    active: {
        type: Boolean,
        default: true
    },
    image: {
        type: String
    },
    phone: {
        type: String,
        match: [/^\d{10}$/, "Incorrect phone number"]
    },
    role: {
        type: String,
        enum: ["admin", "user", "guest"], // Define roles as per your application needs
        default: "user"
    },
    isOauthAuthenticated: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpiry: {
        type: Number // Change to Date for better handling of expiry
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 12);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// // Method to generate JWT token
userSchema.methods.generateJwtToken = async function () {
    return await jwt.sign(
        {
            id: this._id,
            name: this.name,
            email: this.email,
            displayName: this.displayName,
            role: this.role,
            isOauthAuthenticated: this.isOauthAuthenticated,
            phone: this.phone,
            active: this.active,
            image: this.image
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );
};

// Method to compare passwords
userSchema.methods.compare = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateResetToken = async function () {
    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before storing (for security)
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await this.save();

    // Return the unhashed token to send via email
    return resetToken;
};

userSchema.methods.verifyResetToken = async function (token) {
    if (!this.resetPasswordToken || !this.resetPasswordTokenExpiry) {
        return false;
    }

    // Hash the provided token and compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    return this.resetPasswordToken === hashedToken && this.resetPasswordTokenExpiry > new Date();
};

userSchema.methods.resetPassword = async function (newPassword) {
    this.password = newPassword;
    this.resetPasswordToken = undefined;
    this.resetPasswordTokenExpiry = undefined;
    return await this.save();
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
