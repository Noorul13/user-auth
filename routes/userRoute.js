const express = require('express');

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {authenticateToken } = require("../helper/helper.js");

const { signup, login, update, forgatpassword , reset, forgot, resetpassword } = require('../controllers/userControllers.js');

router.post('/signup', signup);
router.post('/login', login);

// Update user route
router.put('/update', authenticateToken, update);

router.put('/forgatpassword', forgatpassword);

router.get("/reset", reset );

router.post('/forgot' , forgot);

router.post('/resetpassword', resetpassword);

module.exports = router