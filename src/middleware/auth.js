const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");

module.exports.isAuthenticatedUser = async function (req, res, next) {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({status: false, message: "Please Login to access this resource"});
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);
        req.user = user;
        next()
    } catch (err) { 
        return res.status(500).json({status: false, message: err.message});
    }
}