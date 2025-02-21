const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register User - POST /auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET);

        // Return user data + token
        res.status(200).json({
            message: "User registered successfully",
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


// Login User - POST /auth/login

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check if user already exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });


        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET
        );

        // Return user data + token
        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email },
            token
        });

    } catch (error) {
        res.status(500).json({ error: err.message });
    }

})

module.exports = router;
