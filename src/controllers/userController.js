const userModel = require("../models/userModel")
const {isValid, isValidEmail, isValidObject, isValidPW, isValidObjectId, isValidTitle} = require("../validator/validator")

module.exports.registerUser = async function (req, res) {
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
    return res.status(200).json({ status: true, message: "register user successfully" })
}

