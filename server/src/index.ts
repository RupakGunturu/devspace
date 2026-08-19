import { config } from "./config/env";
import { connectDB } from "./config/db";
import app from "./app";

// Start server
async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`API server listening on http://localhost:${config.port}`);
  });
}

start().catch(() => {
  process.exit(1);
});
