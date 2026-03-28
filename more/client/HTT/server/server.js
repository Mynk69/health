const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medai')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.log('❌ MongoDB connection error:', err.message));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/report', require('./routes/report'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/predict', require('./routes/predict'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MedAI server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MedAI server running on port ${PORT}`);
});
