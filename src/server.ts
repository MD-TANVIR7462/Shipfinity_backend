import 'colors';
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    const PORT = 5000; // 👈 explicitly set to 5000

    server = app.listen(PORT, () => {
      console.log(
        `✅ Connected to Shopfinity server and listening on http://localhost:${PORT}`,
      );
    });
  } catch (err) {
    console.error('❌ Failed to connect:', err);
  }
}

main();

//if any error happens in async code, it will be caught here
process.on('unhandledRejection', () => {
  console.log(
    `unahandledRejection is detected , shopfinity server is shutting down ...`,
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//if any error happens in sync code, it will be caught here
process.on('uncaughtException', () => {
  console.log(
    `uncaughtException is detected , shopfinity server is shutting down ...`,
  );
  process.exit(1);
});
