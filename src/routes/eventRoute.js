const express = require('express');
const { createEvent, invite, list } = require("../controllers/eventController")
const { isAuthenticatedUser } = require("../middleware/auth")

const router = express.Router();

router.post('/event', isAuthenticatedUser, createEvent)

router.get('/event/user', isAuthenticatedUser, list)

router.post('/event/:evevntId', isAuthenticatedUser, invite)



module.exports = router