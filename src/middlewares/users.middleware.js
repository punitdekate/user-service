const { body, validationResult } = require("express-validator");
const { BadRequest } = require("helper-utils");

const validateUser = async (req, res, next) => {
    const rules = [
        body("name").notEmpty().withMessage("Name is required"),
        body("displayName").notEmpty().withMessage("DisplayName is required"),
        body("email").isEmail().withMessage("Invalid email"),
        body("password").notEmpty().withMessage("Password is required"),
        body("password").isLength({ min: 8 }).withMessage("Password should be greater than 8 characters"),
        body("password").isLength({ max: 16 }).withMessage("Password should be not be more than 16 characters")
    ];

    await Promise.all(rules.map(rule => rule.run(req)));

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array();
        return res.status(400).json(new BadRequest(errors).getMessage());
    }
    next();
};

const validateUpdateUserBody = async (req, res, next) => {
    const rules = [
        body("email").not().exists().withMessage("Email cannot be modified"),
        body("password").not().exists().withMessage("Password cannot be modified"),
        body("name").optional().notEmpty().withMessage("Name cannot be empty"),
        body("displayName").optional().notEmpty().withMessage("DisplayName cannot be empty")
    ];
    await Promise.all(rules.map(rule => rule.run(req)));
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array();
        return res.status(400).json(new BadRequest(errors).getMessage());
    }
    next();
};

module.exports = { validateUser, validateUpdateUserBody };
