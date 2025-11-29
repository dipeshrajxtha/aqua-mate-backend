// routes/authRoutes.js - Handles user registration and login endpoints

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register
// Endpoint for user registration
router.post('/register', authController.register);

// POST /api/auth/login
// Endpoint for user login
router.post('/login', authController.login);

module.exports = router;