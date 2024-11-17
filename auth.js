const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Ensure you have a User model
const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
    res.render('login'); // Ensure you have a login.ejs file in your views directory
});

// Handle user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id; // Store user ID in session
        return res.redirect('/portfolio'); // Redirect to portfolio after login
    }
    res.redirect('/auth/login'); // Redirect back to login if authentication fails
});

// Render registration page
router.get('/register', (req, res) => {
    res.render('register'); // Ensure you have a register.ejs file in your views directory
});

// Handle user registration
router.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, age, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser  = new User({ username, password: hashedPassword, firstName, lastName, age, gender });
    await newUser .save();

    // Send welcome email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: username, // Assuming username is the email
        subject: 'Welcome to Our Platform',
        text: 'Thank you for registering!',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });

    res.redirect('/auth/login'); // Redirect to login after registration
});

// Handle user logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/portfolio'); // Redirect to portfolio if there's an error
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/auth/login'); // Redirect to login page after logout
    });
});

module.exports = router;