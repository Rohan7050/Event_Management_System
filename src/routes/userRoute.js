const express = require('express');
const {registerUser, loginUser, logout, forgetPassword, resetPassword} = require("../controllers/userController");

const router = express.Router();

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/logout', logout)

router.post('/password/forgot', forgetPassword)

router.put("/password/reset/:token", resetPassword);

module.exports = router