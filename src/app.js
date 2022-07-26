const express = require('express');
const cookieParser = require('cookie-parser');
const user = require("./routes/userRoute");
const event = require("./routes/eventRoute");
const { encodeBase64 } = require('bcryptjs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", user);
app.use("/", event);

module.exports = app;


