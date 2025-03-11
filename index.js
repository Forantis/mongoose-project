require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./config/mongodb');
const profileRoutes = require('./api/profiles/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', profileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
