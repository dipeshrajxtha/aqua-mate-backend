// server.js (or index.js) - Main application entry point

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Function to connect to MongoDB
const cors = require('cors');

// Load environment variables immediately
dotenv.config();

// Connect to MongoDB
// NOTE: connectDB is an asynchronous function. It's usually best to 
// ensure the server only starts if the connection is successful.
connectDB(); 

const app = express();

// --- Middleware ---

// 1. CORS for cross-origin requests
app.use(cors());

// 2. Body parser for JSON
app.use(express.json());

// 3. Static file serving (e.g., for profile pictures)
// IMPORTANT: Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads')); 

// --- Routes ---

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes')); 

// --- Deployment Health Check (Good Practice) ---
// Add a simple route to verify the server is alive
app.get('/', (req, res) => {
    res.send('AquaMate API is running...');
});

// --- Start Server ---

const PORT = process.env.PORT || 3000;
// Use '0.0.0.0' for deployment environments like Render
const HOST = '0.0.0.0'; 

// Use the standard listen call. If `connectDB` had fatal errors, 
// the Node process should ideally exit before reaching this point.
app.listen(PORT, HOST, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`); 
  // Note: Local logs show localhost, but Render uses 0.0.0.0
});

// *NOTE on Deployment:* // For Render, ensure your environment variable MONGO_URI is correctly set. 
// If your connectDB function throws a hard error, the process will exit, 
// which is the intended behavior when the database is unavailable.