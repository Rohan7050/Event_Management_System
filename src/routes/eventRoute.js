const express = require('express');
const { createEvent, invite, list, updateEvent } = require("../controllers/eventController")
const { isAuthenticatedUser } = require("../middleware/auth")

const router = express.Router();

router.post('/event', isAuthenticatedUser, createEvent)

router.get('/event/user', isAuthenticatedUser, list)

router.post('/event/:eventId', isAuthenticatedUser, invite)

router.put("/event/:eventId", isAuthenticatedUser, updateEvent)

module.exports = router