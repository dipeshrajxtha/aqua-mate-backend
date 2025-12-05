const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB (Ensure you have config/db.js and .env set up)
connectDB(); 

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes')); 
app.use('/api/aquariums', require('./routes/aquariumRoutes')); 
// VITAL FIX: Register the reminder routes
app.use('/api/reminders', require('./routes/reminderRoutes'));


// --- Deployment Health Check ---
app.get('/', (req, res) => {
    res.send('AquaMate API is running...');
});

// --- Start Server ---

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; 

app.listen(PORT, HOST, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`); 
});