// server.js - Final version

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// IMPORTANT: Serve static files from the 'uploads' folder for profile pictures
app.use('/uploads', express.static('uploads')); 

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes')); 
// 💡 NEW LINE ADDED: Mount the Reminder routes
app.use('/api/reminders', require('./routes/reminderRoutes')); 

// Start server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; 

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`); 
});