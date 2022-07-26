const userModel = require("../models/userModel")
const { isValid, isValidEmail, isValidObject, isValidPW, isValidObjectId, isValidTitle } = require("../validator/validator")
const {sendToken} = require("../utils/jwtToken")

module.exports.registerUser = async function (req, res) {
    try {
        const { title, name, email, password } = req.body
        if (!isValidTitle(title)) {
            return res.status(400).json({status: false, message: "Invalid title"});
        }
        if (!isValid(name)) {
            return res.status(400).json({status: false, message: "Invalid name"});
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({status: false, message: "Invalid email"});
        }
        if (!isValidPW(password)) {
            return res.status(400).json({status: false, message: "Invalid password"});
        }
        const user = await userModel.create({ title, name, email, password })
        sendToken(user, 200, res)
    } catch (err) { 
        return res.status(500).json({status: false, message: err.message});
    }
}

module.exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({status: false, message: "please enter email or password"});
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({status: false, message: "Invalid email"});
        }
        if (!isValidPW(password)) {
            return res.status(400).json({status: false, message: "Invalid password"});
        }
        const user = await userModel.findOne({ email: email }).select("+password");
        if (!user) {
            return res.status(404).json({status: false, message: "user not found"});
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(400).json({status: false, message: "Incorrect password"});
        }
        sendToken(user, 200, res)
    } catch (err) {
        return res.status(500).json({status: false, message: err.message});
    }
}

module.exports.logout = async function (req, res) { 
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        })
        res.status(200).json({ success: true, message: "Logged Out" })
    } catch (err) { 
        return res.status(500).json({status: false, message: err.message});
    }
}

module.exports.forgetPassword = async function (req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({status: false, message: "please enter email"});
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({status: false, message: "Invalid email"});
        }
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ status: false, message: "user not found with this email"})
        }
        const resetToken = await user.getResetPasswordToken()
        await user.save({ validateBeforeSave: false })
        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
        return res.status(200).json({success: true, message: `email send to ${user.email} successfully`, link: resetPasswordUrl})
    } catch (err) { 
        return res.status(500).json({status: false, message: err.message});
    }
}

module.exports.resetPassword = async function (req, res) { 
    try {
        const {password, confirmPassword} = req.body
        const resetPasswordToken = req.params.token
        const user = await userModel.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ status: false, message: "Reset Password Token is invalid or has been expired"})
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ status: false, message: "Password does not match confirmPassword"})
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        sendToken(user, 200, res);
    } catch (err) { 
        return res.status(500).json({status: false, message: err.message});
    }
}

