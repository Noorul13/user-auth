const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cookieParser = require("cookie-parser");

const userRouter = require('./routes/userRoute.js');
app.use(express.json());

app.use(cookieParser());
require('dotenv').config();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hello");
});

app.use("/api/user", userRouter);

app.listen(PORT, (req, res) => {
    console.log(`Server is running on ${PORT}`);
});