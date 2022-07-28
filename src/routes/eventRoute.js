const express = require('express');
const { createEvent, invite } = require("../controllers/eventController")
const { isAuthenticatedUser } = require("../middleware/auth")

const router = express.Router();

router.post('/event', isAuthenticatedUser, createEvent)

router.post('/event/:evevntId', isAuthenticatedUser, invite)

module.exports = router