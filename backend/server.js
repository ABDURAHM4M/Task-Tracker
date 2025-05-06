// server.js
import dotenv from 'dotenv';
import connectDB from './src/db/connect.js';
import app from './src/app.js';
import config from './src/config/index.js';

dotenv.config();

const startServer = async () => {
  try {
    // 1) Connect to MongoDB
    await connectDB();

    // 2) Start Express server
    const PORT = process.env.PORT || 3000;
    const MODE = config.env || 'development';
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${MODE} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
};

startServer();
