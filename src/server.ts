import 'colors';
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(
        `Connected to gizmobuy server and app is listening to port ${config.port}`
          .rainbow.bold,
      );
    });
  } catch (err) {
    console.log(err);
  }
}

main();

//if any error happens in async code, it will be caught here
process.on('unhandledRejection', () => {
  console.log(
    `unahandledRejection is detected , gizmobuy server is shutting down ...`,
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
    `uncaughtException is detected , gizmobuy server is shutting down ...`,
  );
  process.exit(1);
});
