const express = require('express');
const { registerUser, loginUser, logout, forgetPassword, resetPassword, getUserDetails, updatePassword } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth")

const router = express.Router();

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/logout', logout)

router.post('/password/forgot', forgetPassword)

router.put("/password/reset/:token", resetPassword);

router.get('/me', isAuthenticatedUser, getUserDetails)

router.put("/password/update", isAuthenticatedUser, updatePassword);

module.exports = router