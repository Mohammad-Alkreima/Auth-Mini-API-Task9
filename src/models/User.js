const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: [true, "Email"],
        required: [true, "The Email must be Required"],
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
        type: String,
        required: [true, "Password Is Required"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);