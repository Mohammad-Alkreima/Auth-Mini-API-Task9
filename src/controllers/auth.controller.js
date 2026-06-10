const User = require("../models/User");
const cookiesService = require("../utils/cookiesService");
const jwtService = require("../utils/jwtService");
const passwordService = require("../utils/passwordService");

class AuthContoller {
    signup = async (req, res) => {
        const {name, email, password} = req.body;

        const hashed = await passwordService.hash(password);

        let user = await User.create({name, email, password: hashed});
        user = user.toObject();
        delete user.password;

        res.status(201).json({
            message: "Created User Successfully",
            user
        })
    }

    login = async(req, res) => {
        const {email, password} = req.body;

        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json("Invalid Data");
        }

        const isVerified = await passwordService.compare(password, user.password);
        if(!isVerified) {
            return res.status(400).json("Invalid Data");
        }

        const token = jwtService.generateAccessToken({ 
            id: user._id, 
            email: user.email, 
            role: user.role
        });

        const refreshToken = jwtService.generateRefreshToken({ 
            id: user._id, 
            email: user.email, 
            role: user.role
        });

        user = user.toObject();
        delete user.password;

        cookiesService.setAccessToken(res, token);
        cookiesService.setRefreshToken(res, refreshToken);

        return res.status(201).json({
            message: "Logged In Successfully",
            user
        })
    }

    logout = async(req, res) => {
        cookiesService.clearTokens(res);
        res.status(201).json({
            message: "Logged Out Successfully"
        })
    }

    profile = async(req, res) => {
        const userId = req._user.id;
        const user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(404).json({
                message: "Not Found"
            })
        }

        return res.status(200).json({
            message: "Get Data",
            user
        })
    }
}

module.exports = new AuthContoller();