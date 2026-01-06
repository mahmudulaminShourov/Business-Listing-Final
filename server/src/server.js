import dotenv from 'dotenv';
dotenv.config(); // Load env variables first

import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
  try {
    const uri = process.env.MONGO_URI;  // <-- match your .env variable name
    console.log('Mongo URI:', uri);  // debug: should print your MongoDB connection string

    // Connect to MongoDB via your connectDB function
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
