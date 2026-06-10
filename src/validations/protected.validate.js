const { param } = require("express-validator");
const validate = require("../middlewares/validate");

const id = [
    param("id")
        .isMongoId().withMessage("Invalid Id"),

    validate
];

module.exports = {
    id
};