const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/userModel.js')
const { getrandom } = require("../helper/getrandom.js");
const { verifyPassword ,sendemail, sendmessage } = require("../helper/helper.js");
const nodemailer = require('nodemailer');

async function signup(req,res){
    const { username, password, email, name, phone } = req.body;
    try {
        if (!username || !email) {
            return res.status(400).json({ message: 'Username and emal is required' });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const verifyPass = verifyPassword(password)
        //console.log("verify Pass",verifyPass);
        if (verifyPass) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new User({
                username,
                password: hashedPassword,
                email,
                name,
                phone
            });
            let token = jwt.sign({ email }, process.env.TOKEN);
            res.cookie("token", token);
            await newUser.save();
            res.status(201).json({ success: true, message: 'User created successfully' });
        }
        else {
            res.status(200).json({ success: false, message: "Password does not match" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function login(req, res) {
        const { email, password } = req.body;
        try {
            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            // Compare the password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            let token = jwt.sign({ email: user.email }, process.env.TOKEN);
            res.cookie("token", token);
            res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name }, token: token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
}

async function update (req, res){
    const { name, email, phone, username } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.name = name || user.name; // Only update if provided
        user.email = email || user.email; // Only update if provided
        user.phone = phone || user.phone; // Only update if provided
        user.username = username || username.phone;

        // Save updated user
        await user.save();
        res.status(200).json({ message: 'User updated successfully', user: { id: user._id, name: user.name, email: user.email, phone: user.phone, username: user.username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function forgatpassword (req, res)  {
    const { email, newPassword } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Ensure newPassword is provided
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        //console.log("New Password:", newPassword);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // console.log("Hashed Password:", hashedPassword); // Check hashed password

        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

function reset (req, res) {
    let otp = getrandom();
    console.log(otp);
    sendemail(otp);
}

// POST /api/reset-password
async function resetpassword (req, res) {
    const { email } = req.body;
    const otp = getrandom();

    const user = await User.findOne({ email });

    try {
         // Hash the new password
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            await sendemail(otp);
            res.status(200).json({status: true, message: "Email send Successfully", OTP: otp })
        }
  
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function forgot (req, res) {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        // Generate OTP
        await user.save();

        const emailMessage = "Your password has been successfully changed.";
        await sendmessage(email, emailMessage);

        res.status(200).json({success: true, message: 'Password Change succssfully'  });
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

module.exports = {signup, login, update, forgatpassword, reset, resetpassword, forgot};