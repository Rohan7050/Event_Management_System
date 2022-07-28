const express = require('express');
const { createEvent } = require("../controllers/eventController")
const { isAuthenticatedUser } = require("../middleware/auth")

const router = express.Router();

router.post('/event', isAuthenticatedUser, createEvent)

module.exports = router