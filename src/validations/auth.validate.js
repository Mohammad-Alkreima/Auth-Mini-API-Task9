require("dotenv").config();
const { body } = require("express-validator");
const validate = require("../middlewares/validate");
const User = require("../models/User");

const signupValidation = [
    body("name")
        .isString().withMessage("Name Must Be String")
        .isLength({min: 3, max: 30}).withMessage("Length Name Must Be Between 3 to 30 Ch")
        .trim()
        .toLowerCase(),

    body("email")
        .isString().withMessage("Email Must Be String")
        .isEmail().withMessage("Invalid Email")
        .normalizeEmail()
        .custom(async (email) => {
            const user = await User.findOne({email})
            if(user) {
                throw new Error("This Email Already Exist")
            }
            return true;
        }),

    body("password")
        .isString().withMessage("Password must be string")
        .isStrongPassword({ 
            minLength: 8, 
            minNumbers: 1, 
            minUppercase: 1, 
            minSymbols: 1,
            minLowercase: 2
        }).withMessage("Password is weak"),

    

    validate
];

const loginValidation = [
    body("email")
        .isString().withMessage("Email Must Be String")
        .isEmail().withMessage("Invalid Email")
        .normalizeEmail(),

    body("password")
        .isString().withMessage("Password must be string")
        .notEmpty().withMessage("Password cannot be empty"),

    validate
]

module.exports = {
    signupValidation,
    loginValidation
};