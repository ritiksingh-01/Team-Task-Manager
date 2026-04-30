import dotenv from 'dotenv';
import { createServer } from 'node:http';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const basePort = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  const server = createServer(app);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      if (port >= basePort + 10) {
        console.error(`Unable to find a free port starting at ${basePort}.`);
        process.exit(1);
      }

      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying on ${nextPort}.`);
      startServer(nextPort);
      return;
    }

    throw error;
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
};

connectDB()
  .then(() => {
    startServer(basePort);
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
