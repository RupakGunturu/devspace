import { config } from "./config/env";
import { connectDB } from "./config/db";
import app from "./app";

// Start server
async function start() {
  await connectDB();
  app.listen(config.port, () => {
    // No sensitive data logged
  });
}

start().catch(() => {
  process.exit(1);
});
