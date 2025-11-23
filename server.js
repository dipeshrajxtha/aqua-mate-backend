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

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Start server
const PORT = process.env.PORT || 3000;
// CRITICAL FIX: Explicitly set the host to '0.0.0.0' so the server listens on all interfaces.
// This allows the Android emulator (10.0.2.2) to reach the host machine.
const HOST = '0.0.0.0'; 

app.listen(PORT, HOST, () => {
  // Console output now confirms the host setting
  console.log(`Server running on http://${HOST}:${PORT}`); 
});