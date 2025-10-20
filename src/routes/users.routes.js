const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/users.controller.js");
const { validateUser, validateUpdateUserBody } = require("../middlewares/users.middleware.js");
const upload = require("../middlewares/upload.middleware.js");
const auth = require("../middlewares/auth.middleware.js");

const userController = new UserController();

userRouter.get("/", (req, res, err) => {
    userController.getAllUsers(req, res, err);
});

userRouter.post("/generate", (req, res, err) => {
    userController.generateToken(req, res, err);
});

userRouter.post("/reset/verify", (req, res, err) => {
    userController.resetPassword(req, res, err);
});

userRouter.post("/reset", (req, res, err) => {
    userController.sendResetTokenToUserEmail(req, res, err);
});

userRouter.get("/:id", (req, res, err) => {
    userController.getUserById(req, res, err);
});

userRouter.post("/", validateUser, (req, res, err) => {
    userController.createUser(req, res, err);
});

userRouter.put("/:id", upload.single("image"), validateUpdateUserBody, auth, (req, res, err) => {
    userController.modifyUser(req, res, err);
});

userRouter.delete("/:id", auth, (req, res, err) => {
    userController.deleteUser(req, res, err);
});

module.exports = userRouter;
